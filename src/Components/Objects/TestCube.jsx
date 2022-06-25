import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useState, useEffect, useRef } from "react"
import { BufferAttribute, Vector3 } from "three"
import AnimatedBakedMaterial from "../Materials/Shaders/__BAKED__/AnimatedBakedMaterial/AnimatedBakedMaterial"
import { uvAtt } from "../Objects/data"
import { useStore } from "./store"

function TestCube() {
  const geoRef = useRef()
  const [toggle, set] = useState(false)
  const [activeEl, setActiveEl] = useState(false)

  const setMouseDown = useStore((s) => s.setMouseDown)

  const { nodes } = useGLTF("src/assets/test.glb")
  const diffuse = useTexture("src/assets/tt_d.jpg")
  // const diffuse = useTexture("src/assets/fb_01.jpg")

  diffuse.flipY = false

  const nodesArr = Object.values(nodes)

  useEffect(() => {
    const bufferGeometry = geoRef.current.geometry

    const attrib = bufferGeometry.getAttribute("position")
    const count = attrib.count

    const array = new Float32Array(uvAtt)
    const attribute = new BufferAttribute(array, 1)
    console.log(attribute)
    bufferGeometry.addAttribute("uvAtt", attribute)
    console.log("geeeeoo", bufferGeometry)
  }, [])

  return (
    <group position={[0, -1, 0]}>
      {nodesArr.map((n) => (
        <mesh
          // layers={0}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
          ref={geoRef}
          onPointerDown={() => setMouseDown(true)}
          onPointerUp={() => setMouseDown(false)}
          geometry={n.geometry}
          onClick={(e) => {
            // e.preventDefault()
            e.stopPropagation()
            setActiveEl(uvAtt[e.face.a])
            set(!toggle)
          }}
        >
          {/* <meshBasicMaterial /> */}
          {/* <boxBufferGeometry /> */}
          <AnimatedBakedMaterial
            activeEl={activeEl}
            map={diffuse}
            toggle={toggle}
          />
        </mesh>
      ))}
    </group>
  )
}

export default TestCube
