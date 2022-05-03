import * as THREE from "three"
import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react"
import { useSpring } from "@react-spring/core"
import { animated } from "@react-spring/three"
import { animated as a } from "@react-spring/web"
import { Html, useGLTF, useTexture } from "@react-three/drei"

import { MeshStandardMaterial, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"
import { MathUtils } from "three"
// import glsl from "babel-plugin-glsl/macro"

import noise from "./shades/tools/classicNoise3D.glsl"
import fragment from "./shades/fragment.glsl"
import vertex from "./shades/vertex.glsl"
import topTest from "./shades/topVs.glsl"
import defaultnormal_vertex from "./shades/tools/defaultnormal_vertex.glsl"

function OnBeforeCompileShaderFunction({ toggle }) {
  const { x } = useSpring({
    x: toggle ? 1.0 : 0.0,
  })

  return <CompiledMaterial x={x} toggle={toggle} />
}

function CompiledMaterial({ toggle, x }) {
  const shaderRef = useRef()

  const customUniforms = useMemo(
    () => ({
      uMouse: { value: 0.0 },
      time: { value: 0.0 },
      amplitude: { value: 2.0 },
      speed: { value: 1.2 },
      frequency: { value: 0.0 },
    }),
    []
  )

  const onBeforeCompile = (shader) => {
    shader.uniforms.uMouse = customUniforms.uMouse
    shader.uniforms.time = customUniforms.time
    shader.uniforms.amplitude = customUniforms.amplitude
    shader.uniforms.speed = customUniforms.speed
    shader.uniforms.frequency = customUniforms.frequency

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      topVs
    )
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      vS
    )
    // shader.vertexShader = shader.vertexShader.replace(
    //   "#include <defaultnormal_vertex>",
    //   defaultnormal_vertex
    //   // ""
    // )
    // THREE.ShaderChunk.defaultnormal_vertex.replace(
    //   // transformedNormal will be used in the lighting calculations
    //   "vec3 defaultnormal_vertex = objectNormal;",
    //   `vec3 transformedNormal = displacedNormal;`
    // )
    // shader.vertexShader = shader.vertexShader.replace(
    //   "#include <displacementmap_vertex>",
    //   `transformed = displacedPosition;`
    //   // `transformed = displacedPosition;`
    // )

    console.log("MATERIAL::", shader.vertexShader)
    console.log("MATERIAL::", topVs)
  }

  useFrame(({ clock, mouse }) => {
    customUniforms.frequency.value = MathUtils.lerp(
      customUniforms.uMouse.value,
      (mouse.x / 2 + 0.5) * 10,
      0.05
    )
    customUniforms.time.value = clock.getElapsedTime()
  })

  return (
    <>
      <animated.meshPhysicalMaterial
        // <animated.meshPhysicalMaterial
        side={THREE.DoubleSide}
        // roughness={x}
        wireframe={true}
        time={0.2}
        // roughness={1}
        roughness={0.05}
        ref={shaderRef}
        onUpdate={(m) => (m.needsUpdate = true)}
        onBeforeCompile={onBeforeCompile}
        customProgramCacheKey={() => onBeforeCompile.toString()}
      />
    </>
  )
}

// console.log("SHADERCHUNK::", THREE.ShaderChunk.meshphysical_frag)

// const topFs = `
//   #include <common>
// `
const topVs = `
#include <common>
${noise}
${topTest}
`

const vS = `#include <begin_vertex>;
${vertex} 
`
const fS = `
${fragment} 
`

export default OnBeforeCompileShaderFunction
