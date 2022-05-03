import * as THREE from "three"
import { nanoid } from "nanoid"
import { extend } from "@react-three/fiber"
import { animated, useSpring } from "@react-spring/three"
import vertex from "./shades/vertex.vert"
import fragment from "./shades/fragment.frag"

function shaderMaterial(uniforms, vertexShader, fragmentShader, onInit) {
  const material = class material extends THREE.RawShaderMaterial {
    constructor() {
      const entries = Object.entries(uniforms) // Create unforms and shaders

      super({
        uniforms: entries.reduce((acc, [name, value]) => {
          const uniform = THREE.UniformsUtils.clone({
            [name]: {
              value,
            },
          })
          return { ...acc, ...uniform }
        }, {}),
        vertexShader,
        fragmentShader,
      }) // Create getter/setters

      this.key = ""
      entries.forEach(([name]) =>
        Object.defineProperty(this, name, {
          get: () => this.uniforms[name].value,
          set: (v) => (this.uniforms[name].value = v),
        })
      )
      if (onInit) onInit(this)
    }
  }
  material.key = nanoid()
  return material
}

// console.log(THREE.ShaderChunk.meshphysical_frag)

const ShaderMat = shaderMaterial(
  //uniform
  {
    uTime: 0.0,
  },
  //vertex shader
  vertex,
  //fragment shader
  fragment
  // meshphysical_frag
)

extend({ ShaderMat })
const AniamtedShaderMat = animated("shaderMat")

function ShaderFunction({ toggle }) {
  const { time } = useSpring({
    time: toggle ? 0 : 1,
  })

  return <AniamtedShaderMat uTime={time} attach="material" />
}

export default ShaderFunction
