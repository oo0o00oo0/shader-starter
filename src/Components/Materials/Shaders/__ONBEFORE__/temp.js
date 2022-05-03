import * as THREE from "https://unpkg.com/three@0.118.3/build/three.module.js"
// import { OrbitControls } from "https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js"
// import Stats from "https://unpkg.com/three@0.118.3/examples/jsm/libs/stats.module.js"

// init three.js
const webgl = initWebGLApp()

// init stats.js
const stats = initStats()

// init the controls-state panel
const controls = initControls({
  diffuse: "#5B82A6",
  roughness: 0.5,
  noise: {
    amplitude: 0.4,
    frequency: State.Slider(0.5, { max: 2 }),
    speed: State.Slider(0.3, { max: 2 }),
  },
})

const SIZE = 4
const RESOLUTION = 256

const geometry = new THREE.PlaneBufferGeometry(
  SIZE,
  SIZE,
  RESOLUTION,
  RESOLUTION
).rotateX(-Math.PI / 2)

const material = new THREE.ShaderMaterial({
  lights: true,
  side: THREE.DoubleSide,
  extensions: {
    derivatives: true,
  },

  defines: {
    STANDARD: "",
    PHYSICAL: "",
  },

  uniforms: {
    ...THREE.ShaderLib.physical.uniforms,
    ...controls.toUniforms,
    ...controls.noise.toUniforms,
    time: { value: 0 },
  },

  vertexShader: monkeyPatch(THREE.ShaderChunk.meshphysical_vert, {
    header: `
      uniform float time;
      uniform float amplitude;
      uniform float speed;
      uniform float frequency;

      ${noise()}
      
      // the function which defines the displacement
      float displace(vec3 point) {
        return noise(vec3(point.x * frequency, point.z * frequency, time * speed)) * amplitude;
      }
      
      // http://lolengine.net/blog/2013/09/21/picking-orthogonal-vector-combing-coconuts
      vec3 orthogonal(vec3 v) {
        return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
        : vec3(0.0, -v.z, v.y));
      }
    `,
    // adapted from http://tonfilm.blogspot.com/2007/01/calculate-normals-in-shader.html
    main: `
      vec3 displacedPosition = position + normal * displace(position);


      float offset = ${SIZE / RESOLUTION};
      vec3 tangent = orthogonal(normal);
      vec3 bitangent = normalize(cross(normal, tangent));
      vec3 neighbour1 = position + tangent * offset;
      vec3 neighbour2 = position + bitangent * offset;
      vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
      vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);

      // https://i.ya-webdesign.com/images/vector-normals-tangent-16.png
      vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
      vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

      // https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
      vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));
    `,

    "#include <defaultnormal_vertex>":
      THREE.ShaderChunk.defaultnormal_vertex.replace(
        // transformedNormal will be used in the lighting calculations
        "vec3 defaultnormal_vertex = objectNormal;",
        `vec3 transformedNormal = displacedNormal;`
      ),
    // transformed is the output position
    "#include <displacementmap_vertex>": `
      transformed = displacedPosition;
    `,
  }),

  fragmentShader: THREE.ShaderChunk.meshphysical_frag,
})

const plane = new THREE.Mesh(geometry, material)
webgl.scene.add(plane)

// LIGHTS
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.position.set(-0.5, 10, -10)
webgl.scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
webgl.scene.add(ambientLight)

function update(ms) {
  const time = ms * 0.001
  stats.begin()

  // update the time uniform
  plane.material.uniforms.time.value = time

  webgl.render()
  webgl.orbitControls.update()

  stats.end()
  requestAnimationFrame(update)
}
requestAnimationFrame(update)

//------------------------
// BOILERPLATE BELOW
//------------------------

function initWebGLApp() {
  const canvas = document.createElement("canvas")
  document.body.appendChild(canvas)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  })

  renderer.setClearColor("#111", 1)

  const fov = 45
  const near = 0.01
  const far = 100
  const camera = new THREE.PerspectiveCamera(fov, 1, near, far)

  // move the camera back
  camera.position.set(-2, 3, 5)

  const scene = new THREE.Scene()

  const orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enableDamping = true

  function resize() {
    const width = window.innerWidth
    const height = window.innerHeight

    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio) // 2 in case of retinas

    if (camera.isPerspectiveCamera) {
      camera.aspect = width / height
    }
    camera.updateProjectionMatrix()
  }

  function render() {
    renderer.render(scene, camera)
  }

  // initial resize and render
  resize()
  render()

  // add resize listener
  window.addEventListener("resize", resize)

  return {
    canvas,
    renderer,
    camera,
    orbitControls,
    scene,
    resize,
    render,
  }
}

function initStats() {
  const stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)
  return stats
}

function initControls(controlsObject, options = {}) {
  const controls = wrapGUI(State(controlsObject), {
    expanded: !options.closeControls,
  })

  // add the custom controls-gui styles
  const styles = `
    [class^="controlPanel-"] [class*="__field"]::before {
      content: initial !important;
    }
    [class^="controlPanel-"] [class*="__labelText"] {
      text-indent: 6px !important;
    }
    [class^="controlPanel-"] [class*="__field--button"] > button::before {
      content: initial !important;
    }
  `
  const style = document.createElement("style")
  style.type = "text/css"
  style.innerHTML = styles
  document.head.appendChild(style)

  // add .toUniforms property to be used in materials
  Object.keys(controlsObject).forEach((key) => {
    if (controls[key].$field?.type !== "section") {
      return
    }

    const section = controls[key]

    // make it non-enumerable
    Object.defineProperty(section, "toUniforms", {
      value: {},
    })

    Object.keys(section).forEach((property) => {
      section.toUniforms[property] = { value: section[property] }
    })

    section.$onChange((event) => {
      section.toUniforms[event.name].value = event.value
    })
  })

  // add .toUniforms property at the root level
  Object.defineProperty(controls, "toUniforms", {
    value: {},
  })

  Object.keys(controlsObject).forEach((key) => {
    if (controls[key].$field?.type === "section") {
      return
    }

    // support only colors and numbers for now
    const value =
      typeof controls[key] === "string"
        ? new THREE.Color(controls[key])
        : controls[key]

    controls.toUniforms[key] = { value }
  })

  controls.$onChange((event) => {
    // return if it's a child
    if (event.fullPath.includes(".")) {
      return
    }

    // support only colors and numbers for now
    const value =
      typeof event.value === "string"
        ? new THREE.Color(event.value)
        : event.value

    controls.toUniforms[event.name].value = value
  })

  return controls
}

//------------------------
// UTIL FUNCTIONS BELOW
//------------------------

function monkeyPatch(
  shader,
  { defines = "", header = "", main = "", ...replaces }
) {
  let patchedShader = shader

  const replaceAll = (str, find, rep) => str.split(find).join(rep)

  Object.keys(replaces).forEach((key) => {
    patchedShader = replaceAll(patchedShader, key, replaces[key])
  })

  patchedShader = patchedShader.replace(
    "void main() {",
    `
    ${header}
    void main() {
      ${main}
    `
  )

  return `
    ${defines}
    ${patchedShader}
  `
}

// from https://github.com/hughsk/glsl-noise/blob/master/simplex/3d.glsl
function noise() {
  return `
    //
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float noise(vec3 v)
      {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
      }

  `
}
