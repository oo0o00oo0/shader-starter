import * as THREE from "three"
import { nanoid } from "nanoid"
import { extend, useFrame } from "@react-three/fiber"
import { animated, useSpring } from "@react-spring/three"
import vertex from "./shades/AnimatedBaked.vert"
import fragment from "./shades/AnimatedBaked.frag"
import { useRef, useEffect } from "react"
import { MathUtils } from "three"
import { useStore } from "../../../../Objects/store"
// import { shaderMaterial } from "@react-three/drei"

function shaderMaterial(uniforms, vertexShader, fragmentShader, onInit) {
  // const material = class material extends THREE.RawShaderMaterial {
  const material = class material extends THREE.ShaderMaterial {
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

const ShaderMat = shaderMaterial(
  //uniform
  {
    uTime: 0.0,
    uMouseX: 0.0,
    uTexture: new THREE.Texture(),
    uActiveEl: null,
    uMix: 0,
  },
  vertex,
  fragment
)

extend({ ShaderMat })
const AniamtedShaderMat = animated("shaderMat")

function AnimatedBakedMaterial({ toggle, map, activeEl }) {
  const value = useRef(0)
  const mouseRef = useRef(useStore.getState().mouseDown)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() =>
    useStore.subscribe((state) => (mouseRef.current = state.mouseDown))
  )

  const shadRef = useRef()

  useEffect(() => {
    console.log(activeEl)
    shadRef.current.uniforms.uActiveEl.value = activeEl
  }, [activeEl])

  const direction = new THREE.Vector3()

  const origin = new THREE.Vector3(0, 0, 0)
  const line = new THREE.Vector3(1, 0, 0)

  useFrame((state) => {
    shadRef.current.uniforms.uMix.value = THREE.MathUtils.mapLinear(
      direction
        .subVectors(state.camera.position, origin)
        .normalize()
        .angleTo(line),
      0,
      1,
      0,
      1
    )

    // if (mouseRef.current && shadRef.current.uniforms.uMix.value < 1) {
    //   shadRef.current.uniforms.uMix.value += 0.07
    // } else if (!mouseRef.current && shadRef.current.uniforms.uMix.value > 0) {
    //   shadRef.current.uniforms.uMix.value -= 0.06
    // }

    // console.log(shadRef.current.uniforms.uMix.value)
    // console.log(value.current)

    shadRef.current.uniforms.uMouseX.value = Math.floor(
      MathUtils.mapLinear(state.mouse.x, -1, 1, 0, 6)
    )
  })

  const { time } = useSpring({
    time: toggle ? 0 : 1,
  })

  return (
    // <meshBasicMaterial />
    <AniamtedShaderMat
      transparent={true}
      side={THREE.DoubleSide}
      ref={shadRef}
      uActiveEl={activeEl}
      uTexture={map}
      uTime={time}
      uMouseX={0.0}
      attach="material"
    />
  )
}

export default AnimatedBakedMaterial
