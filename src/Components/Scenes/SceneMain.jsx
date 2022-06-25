import { OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import TestCube from "../Objects/TestCube"
import POST_Edges_01 from "../PostProcessing/Shaders/Edges_01/POST_Edges_01"

//https://codesandbox.io/s/elastic-dhawan-c8wk9l?file=/src/shaders/00.js

function SceneMain() {
  console.log(window.devicePixelRatio)
  return (
    <Canvas
      orthographic={false}
      dpr={2}
      // dpr={window.devicePixelRatio}
      camera={{
        fov: 60,
        ner: 10,
        far: 200,
        position: [-5, 94, 47],
      }}
    >
      <TestCube />
      {/* <POST_Edges_01 /> */}
      <OrbitControls />
      {/* <Stats /> */}
      <axisHelper args={[200]} />
    </Canvas>
  )
}

export default SceneMain
