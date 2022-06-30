import * as THREE from "three"
import React, { Suspense, useRef, useMemo } from "react"
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber"
import { useGLTF, useFBO, OrbitControls, Effects } from "@react-three/drei"
import { FXAAShader } from "three-stdlib"

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { useEffect } from "react"

import { AdditiveBlendingShader } from "./shaders/AdditiveBlendingShader"
import { VolumetricLightShader } from "./shaders/VolumetricLightShader"

extend({ EffectComposer, ShaderPass, RenderPass })

const DEFAULT_LAYER = 0

function Post() {
  const { gl, camera, scene, size } = useThree()
  const occlusionRenderTarget = useFBO()

  const testComposer = useRef()
  const occlusionComposer = useRef()
  const composer = useRef()
  const shaderRef = useRef()

  useEffect(() => {
    console.log("testComposer", testComposer)
  }, [])
  useEffect(() => {
    console.log("composer", composer)
  }, [])

  useFrame((state) => {
    gl.autoClear = true
    // console.log(gl)

    // testComposer.current.render()
    // gl.render(scene, camera)
    // gl.autoClear = true
    occlusionComposer.current.render()
    composer.current.render()
    // shaderRef.current.uniforms.exposure.value =
    //   Math.sin(state.clock.elapsedTime * 3) * 1
  }, true)
  return (
    <>
      <mesh position={[1, 12, -10]}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color="#F6A559" />
      </mesh>
      {/* <effectComposer ref={testComposer} args={[gl]}>
        <renderPass attach={`passes-0`} scene={scene} camera={camera} />
        <shaderPass
          attach={`passes-1`}
          args={[BlackoutShader]}
          material-uniforms-blend-value={0.2}
          renderToScreen
        />
        <shaderPass
          attach={`passes-2`}
          args={[FXAAShader]}
          uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </effectComposer> */}

      {/* <effectComposer
        ref={occlusionComposer}
        disableGamma
        disableRender
        args={[gl, occlusionRenderTarget]}
        renderToScreen={false}
      >
        <renderPass attach={`passes-0`} scene={scene} camera={camera} />
        <shaderPass
          attach={`passes-1`}
          ref={shaderRef}
          args={[VolumetricLightShader]}
          // args={[BlackoutShader]}
          needsSwap={false}
        />
      </effectComposer>

      <effectComposer ref={composer} disableRender>
        <renderPass attach={`passes-0`} scene={scene} camera={camera} />
        <shaderPass
          attach={`passes-2`}
          args={[AdditiveBlendingShader]}
          uniforms-tAdd-value={occlusionRenderTarget.texture}
        />
        <shaderPass
          attach={`passes-3`}
          args={[FXAAShader]}
          uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </effectComposer> */}
      <Effects
        ref={occlusionComposer}
        disableGamma
        disableRender
        args={[gl, occlusionRenderTarget]}
        renderToScreen={false}
      >
        <shaderPass
          attachArray="passes"
          ref={shaderRef}
          args={[VolumetricLightShader]}
          // args={[BlackoutShader]}
          needsSwap={false}
        />
      </Effects>

      <Effects ref={composer} disableRender>
        <shaderPass
          id={"test1"}
          args={[AdditiveBlendingShader]}
          uniforms-tAdd-value={occlusionRenderTarget.texture}
        />
        <shaderPass
          id={"test2"}
          args={[FXAAShader]}
          uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </Effects>
    </>
  )
}

export default function VolumeApp() {
  return (
    <Canvas
      camera={{ position: [0, 0, 122], fov: 35 }}
      gl={{ antialias: false }}
    >
      {/* <color attach="background" args={["#050505"]} /> */}
      <Suspense fallback={null}>
        {/* <Stage intensity={2}> */}

        <Elf />
        {/* </Stage> */}

        <OrbitControls />
        <Post />
      </Suspense>
    </Canvas>
  )
}

const BlackoutShader = {
  uniforms: {
    tDiffuse: { value: null },
    blend: { value: 0.0 },
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,

  fragmentShader: `
     uniform sampler2D tDiffuse;
    uniform float blend;

    varying vec2 vUv;

        void main()
        {
          vec2 texCoord = vUv;
          vec4 color = texture2D(tDiffuse, texCoord);
          // gl_FragColor = mix( vec4(vec3(color  ), 1.0), vec4(1.,1.,1.,1.), blend);
          gl_FragColor = vec4(1.,1.,0., 1.0);

        }
`,
}

function Elf({ layer = DEFAULT_LAYER }) {
  const group = useRef()
  const { nodes } = useGLTF("assets/scene.glb")
  const material = useMemo(() => {
    // if (layer === DEFAULT_LAYER)
    // return new THREE.MeshBasicMaterial({
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#5f5f5f"),
      roughness: 1,
      metalness: 0.9,
    })
    // else return new THREE.MeshBasicMaterial({ color: new THREE.Color("black") })
  }, [layer])

  // useFrame(() => (group.current.rotation.y += 0.004))

  return (
    <group ref={group} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
        <mesh
          geometry={nodes.mesh_0.geometry}
          material={material}
          // layers={layer}
          receiveShadow
          castShadow
        />
        <mesh
          geometry={nodes.mesh_1.geometry}
          material={material}
          // layers={layer}
          receiveShadow
          castShadow
        />
        <mesh
          geometry={nodes.mesh_2.geometry}
          material={material}
          // layers={layer}
          receiveShadow
          castShadow
        />
      </group>
    </group>
  )
}
