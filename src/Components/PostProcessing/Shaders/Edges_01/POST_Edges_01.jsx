import { EffectComposer } from "three-stdlib/postprocessing/EffectComposer"
import { RenderPass } from "three-stdlib/postprocessing/RenderPass"
import { useFrame, useThree } from "@react-three/fiber"
import {
  ShaderMaterial,
  Vector2,
  Color,
  DoubleSide,
  MeshNormalMaterial,
  TextureLoader,
  RepeatWrapping,
  HalfFloatType,
} from "three"

import { getFBO } from ".././../jstools/FBO.js"

// import { webgl2Fragment } from "./custom/webgl2Fragment.js"
// import { webgl2Vertex } from "./custom/webgl2Vertex.js"
import vertex from "./shades/edges_01_vertex_wgl2.vert"
import fragment from "./shades/edges_01_fragment_wgl2.frag"
import { MathUtils } from "three"
import { ShaderPass } from "../../Generic/ShaderPass.jsx"
import { useStore } from "../../../Objects/store.js"
import { useRef } from "react"
import { useEffect } from "react"
const normalMat = new MeshNormalMaterial({ side: DoubleSide })
// const coordsMat = new CoordsMaterial()

const loader = new TextureLoader()
const noiseTexture = loader.load("")
noiseTexture.wrapS = noiseTexture.wrapT = RepeatWrapping

function POST_Edges_01() {
  const { gl, scene, camera, viewport } = useThree()

  let width = viewport.width
  let height = viewport.height

  const resolution = new Vector2(width, height)

  ///////////////////////////
  // const res = 1.5
  // const res = 2
  const res = 1
  const wW = window.innerWidth * res
  const wH = window.innerHeight * res

  const colorFBO = getFBO(wW, wH, { samples: 64 })

  const coordsFrontFBO = getFBO(wW, wH, { type: HalfFloatType })
  const coordsBackFBO = getFBO(wW, wH, { type: HalfFloatType })
  const normalFBO = getFBO(wW, wH, { samples: 64 })

  const params = {
    scale: 40,
    hatchScale: 1.5,
    contour: 2,
    paperGrid: 0.25,
    objectGrid: 0.25,
    inkColor: new Color(35, 48, 47),
    paperColor: new Color(239, 208, 175),
    angleGrid: 0,
    angleDark: (15 * Math.PI) / 180,
    angleLight: (45 * Math.PI) / 180,
    dark: 0.5,
    light: 0.7,
  }
  ///////////////////////////

  //   const drawShader = new RawShaderMaterial({
  const drawShader = new ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },

    uniforms: {
      tDiffuse: { value: null },
      uTargetTest: { value: null },
      iResolution: { type: "v2", value: resolution },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      //////////////////////////////
      paperTexture: { value: null },
      colorTexture: { value: colorFBO.texture },
      coordsFrontTexture: { value: coordsFrontFBO.texture },
      coordsBackTexture: { value: coordsBackFBO.texture },
      normalTexture: { value: normalFBO.texture },
      inkColor: { value: params.inkColor },
      paperColor: { value: params.paperColor },
      scale: { value: params.scale },
      hatchScale: { value: params.hatchScale },
      contour: { value: params.contour },
      paperGrid: { value: params.paperGrid },
      objectGrid: { value: params.objectGrid },
      angleDark: { value: params.angleDark },
      angleLight: { value: params.angleLight },
      noiseTexture: { value: noiseTexture },
      dark: { value: params.dark },
      light: { value: params.light },
      uBlend: { value: 1 },
    },

    //  vertexShader: vertex,
    //  fragmentShader: fragmentShader
    vertexShader: vertex,
    fragmentShader: fragment,
  })

  const composer = new EffectComposer(gl)

  const renderScene = new RenderPass(scene, camera)
  //   const fxaaPass = new ShaderPass(FXAAShader)
  const sketchPass = new ShaderPass(gl, drawShader)

  composer.addPass(renderScene)
  composer.addPass(sketchPass)

  const mouseRef = useRef(useStore.getState().mouseDown)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() =>
    useStore.subscribe((state) => (mouseRef.current = state.mouseDown))
  )

  useFrame(({ gl, scene, camera }) => {
    // sketchPass.shader.uniforms.uBlend.value = MathUtils.lerp(
    //   sketchPass.shader.uniforms.uBlend.value,
    //   currentPage !== "location" ? 0 : 1,
    //   0.08
    // )

    // console.log(mouseRef)
    // console.log(sketchPass.shader.uniforms.uBlend.value)

    if (mouseRef.current && sketchPass.shader.uniforms.uBlend.value < 1) {
      sketchPass.shader.uniforms.uBlend.value += 0.04
    } else if (
      !mouseRef.current &&
      sketchPass.shader.uniforms.uBlend.value > 0
    ) {
      sketchPass.shader.uniforms.uBlend.value -= 0.08
    }

    // sketchPass.shader.uniforms.uBlend.value = 0.9
    gl.autoClear = false

    // camera.layers.set(1)
    gl.setRenderTarget(colorFBO)
    gl.clear()
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    gl.clearDepth()
    scene.overrideMaterial = normalMat
    gl.setRenderTarget(normalFBO)
    gl.clear()
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    scene.overrideMaterial = null

    composer.render()

    gl.clearDepth()

    // camera.layers.set(0)
    gl.render(scene, camera)
  }, 1)

  return null
}

export default POST_Edges_01
