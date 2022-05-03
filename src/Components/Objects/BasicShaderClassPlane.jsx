import { useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import ShaderMat from "../Materials/Shaders/__SHADERMAT__/ShaderMat"

function BasicShaderClassPlane() {
  const [toggle, setToggle] = useState(false)
  const { width, height } = useThree((state) => state.viewport)
  const ref = useRef()

  return (
    <mesh
      ref={ref}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
      onClick={() => setToggle(!toggle)}
    >
      <planeBufferGeometry args={[width, height]} />
      <ShaderMat toggle={toggle} />
    </mesh>
  )
}

export default BasicShaderClassPlane
