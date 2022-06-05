import {
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  Stats,
} from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import BasicShaderClassPlane from "../Objects/BasicShaderClassPlane"
import OnBeforeCompilePlane from "../Objects/OnBeforeCompilePlane"
import TestCube from "../Objects/TestCube"
import ExplodeMesh from "../Objects/ExplodeMesh"
import POST_Edges_01 from "../PostProcessing/Shaders/Edges_01/POST_Edges_01"
import { useRef } from "react"

//https://codesandbox.io/s/elastic-dhawan-c8wk9l?file=/src/shaders/00.js

function SceneMain() {
  return (
    <Canvas
      orthographic={false}
      dpr={2}
      camera={{
        fov: 60,
        // zoom: 500,
        position: [-20, 60, 20],
        // position: [0, 0, 10],
      }}
    >
      {/* <Stats /> */}
      {/* <OrbitControls enableZoom={false} /> */}
      {/* <CustCam /> */}
      {/* <OnBeforeCompilePlane /> */}
      {/* <TestCube /> */}
      <ExplodeMesh />
      {/* <POST_Edges_01 /> */}
      {/* <axisHelper args={[200]} /> */}
    </Canvas>
  )
}

function CustCam() {
  const camRef = useRef()

  // useFrame(() => {
  //   console.log(camRef.current.position)
  //   camRef.current.position.z += 0.1
  // })

  return <PerspectiveCamera ref={camRef} makeDefault />
}

export default SceneMain
