OnBeforeCompileShaderFunction
import { useThree } from "@react-three/fiber"
import { Environment } from "@react-three/drei"

import { useEffect, useRef, useState } from "react"
import OnBeforeCompileShaderFunction from "../Materials/Shaders/__ONBEFORE__/OnBeforeCompileMat"
import ShaderFunction from "../Materials/Shaders/__SHADERMAT__/ShaderMat"

function OnBeforeCompilePlane() {
  const [toggle, setToggle] = useState(false)
  // const { width, height } = useThree((state) => state.viewport)

  return (
    <>
      <mesh
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
        onClick={() => setToggle(!toggle)}
      >
        <planeBufferGeometry args={[100, 100, 128, 128]} />
        <OnBeforeCompileShaderFunction toggle={toggle} />
      </mesh>
      <Environment preset="sunset" />
    </>
  )
}

export default OnBeforeCompilePlane
