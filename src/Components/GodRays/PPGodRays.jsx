import * as THREE from "three"
import React, { useRef, Suspense, forwardRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, GodRays } from "@react-three/postprocessing"
import { BlendFunction, Resizer, KernelSize } from "postprocessing"

function Knot() {
  const knotRef = useRef()

  useFrame(() => {
    knotRef.current.rotation.y += -0.01
    knotRef.current.rotation.z += -0.01
  })

  return (
    <mesh ref={knotRef}>
      <torusKnotGeometry args={[4, 0.4, 256, 64, 2, 5]} />
      <meshPhysicalMaterial
        color={"#FFFFFF"}
        roughness={0}
        metalness={0}
        clearcoat={1}
      />
    </mesh>
  )
}

const Sun = forwardRef(function Sun(props, forwardRef) {
  useFrame(({ clock }) => {
    forwardRef.current.position.x = Math.sin(clock.getElapsedTime()) * -8
    forwardRef.current.position.y = Math.cos(clock.getElapsedTime()) * -8
  })

  return (
    <mesh ref={forwardRef} position={[0, 0, -15]}>
      <sphereGeometry args={[1, 36, 36]} />
      <meshBasicMaterial color={"#00FF00"} />
    </mesh>
  )
})

function Effects() {
  // const sunRef = useResource()
  const sunRef = useRef()
  const effectRef = useRef()

  useEffect(() => {
    console.log(effectRef.current)
  }, [])

  return (
    <>
      <Sun ref={sunRef} />
      {sunRef.current && (
        <EffectComposer ref={effectRef} multisampling={0}>
          <GodRays
            sun={sunRef.current}
            blendFunction={BlendFunction.Screen}
            samples={30}
            density={0.97}
            decay={0.96}
            weight={0.6}
            exposure={5}
            clampMax={1}
            width={Resizer.AUTO_SIZE}
            height={Resizer.AUTO_SIZE}
            kernelSize={KernelSize.SMALL}
            blur={true}
          />
        </EffectComposer>
      )}
    </>
  )
}

export function PPGodRays() {
  return (
    <Canvas
      style={{ height: 600, width: 600 }}
      camera={{ position: [0, 0, 10] }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#000000"))
      }}
    >
      <pointLight position={[15, 15, 15]} intensity={1} />
      <Suspense fallback={null}>
        <Knot />
      </Suspense>
      <Effects />
    </Canvas>
  )
}
