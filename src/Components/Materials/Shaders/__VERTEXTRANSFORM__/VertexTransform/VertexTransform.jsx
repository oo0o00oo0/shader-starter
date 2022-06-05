import * as THREE from "three"
import { nanoid } from "nanoid"
import { extend, useFrame } from "@react-three/fiber"
import { animated, useSpring } from "@react-spring/three"
import vertex from "./shades/VertexTransform.vert"
import fragment from "./shades/VertexTransform.frag"
import { useRef, useEffect, useCallback } from "react"
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
    uActiveFace: null,
  },
  vertex,
  fragment
)

extend({ ShaderMat })
const AniamtedShaderMat = animated("shaderMat")

function VertexTransform({ toggle, map, activeEl }) {
  const ref = useRef()

  const windowHeight = window.innerHeight
  const [{ scrollPos }, api] = useSpring(() => ({
    scrollPos: 0,
    // config: { mass: 20 },
  }))

  console.log(windowHeight * 4)

  //when scrolling occurs call the setter created by react spring to update the scrollPos value
  const onScroll = useCallback(
    (e) => {
      // console.log(windowHeight * 4 - window.scrollY)
      //Without Spring
      //  groupRef.current.position.x = scrollObj.current.scrollTop * 0.01
      api.start({
        scrollPos: window.scrollY / windowHeight,
      })
    },
    [scrollPos]
  )

  const skyID = useStore((s) => s.skyID)

  window.addEventListener("scroll", onScroll)

  const shadRef = useRef()

  useEffect(() => {
    shadRef.current.uniforms.uActiveFace.value = skyID
  }, [skyID])

  // const direction = new THREE.Vector3()
  // const origin = new THREE.Vector3(0, 0, 0)
  // const line = new THREE.Vector3(1, 0, 0)

  // useFrame((state) => {
  //   shadRef.current.uniforms.uMix.value = THREE.MathUtils.mapLinear(
  //     direction
  //       .subVectors(state.camera.position, origin)
  //       .normalize()
  //       .angleTo(line),
  //     0,
  //     1,
  //     0,
  //     1
  //   )

  //   shadRef.current.uniforms.uMouseX.value = state.mouse.x
  // })

  const { time } = useSpring({
    time: toggle ? 0 : Math.PI,
    config: { duration: 3000 },
  })

  // return <meshBasicMaterial />

  return (
    <AniamtedShaderMat
      transparent={true}
      side={THREE.DoubleSide}
      ref={shadRef}
      uActiveEl={activeEl}
      uTexture={map}
      uTime={time}
      uMix={time}
      uMouseX={scrollPos}
      attach="material"
    />
  )
}

export default VertexTransform
