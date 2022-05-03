import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { BackSide } from "three"
import BasicShaderClassPlane from "../Objects/BasicShaderClassPlane"
import OnBeforeCompilePlane from "../Objects/OnBeforeCompilePlane"

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
      {/* <Canvas orthographic={true} camera={{ zoom: 50, position: [0, 0, 100] }}> */}
      <OrbitControls />
      <BasicShaderClassPlane />
      {/* <OnBeforeCompilePlane /> */}
    </Canvas>
  )
}

export default SceneMain
