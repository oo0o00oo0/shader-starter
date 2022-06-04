import { OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import BasicShaderClassPlane from "../Objects/BasicShaderClassPlane"
import OnBeforeCompilePlane from "../Objects/OnBeforeCompilePlane"
import TestCube from "../Objects/TestCube"
import POST_Edges_01 from "../PostProcessing/Shaders/Edges_01/POST_Edges_01"

//https://codesandbox.io/s/elastic-dhawan-c8wk9l?file=/src/shaders/00.js

function SceneMain() {
  return (
    <Canvas
      orthographic={false}
      camera={{
        fov: 90,
        // zoom: 500,
        position: [0, 0, 60],
        // position: [0, 0, 10],
      }}
    >
      <Stats />
      <OrbitControls />
      {/* <OnBeforeCompilePlane /> */}
      <TestCube />
      <POST_Edges_01 />
    </Canvas>
  )
}

export default SceneMain
