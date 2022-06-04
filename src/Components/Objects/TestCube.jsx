import { useGLTF, useTexture } from "@react-three/drei"
import { useState, useEffect, useRef } from "react"
import { BufferAttribute } from "three"
import AnimatedBakedMaterial from "../Materials/Shaders/__BAKED__/AnimatedBakedMaterial/AnimatedBakedMaterial"
import { uvAtt } from "../Objects/data"

function TestCube() {
  const geoRef = useRef()
  const [toggle, set] = useState(false)
  const [activeEl, setActiveEl] = useState(false)

  const { nodes } = useGLTF("src/assets/test.glb")
  const diffuse = useTexture("src/assets/fb_01.jpg")

  diffuse.flipY = false

  const nodesArr = Object.values(nodes)

  useEffect(() => {
    const bufferGeometry = geoRef.current.geometry

    // console.log("normal", bufferGeometry.getAttribute("normal"))

    // const attrib =
    //   bufferGeometry.getIndex() || bufferGeometry.getAttribute("position")
    const attrib = bufferGeometry.getAttribute("position")
    const count = attrib.count
    const barycentric = []

    console.log(count)
    // for each triangle in the geometry, add the barycentric coordinates
    // for (let i = 0; i < count; i++) {
    //   console.log("", i)
    // }
    //    const even = i % 2 === 0
    //    const Q = removeEdge ? 1 : 0
    //    if (even) {
    //      barycentric.push(0, 0, 1, 0, 1, 0, 1, 0, Q)
    //    } else {
    //      barycentric.push(0, 1, 0, 0, 0, 1, 1, 0, Q)
    //    }
    //  }
    //  unindexBufferGeometry(bufferGeometry)

    //  // add the attribute to the geometry
    const array = new Float32Array(uvAtt)
    const attribute = new BufferAttribute(array, 1)
    console.log(attribute)
    bufferGeometry.addAttribute("uvAtt", attribute)
    console.log("geeeeoo", bufferGeometry)

    console.log(nodes)
  }, [])

  return (
    <group>
      {nodesArr.map((n) => (
        <mesh
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
          ref={geoRef}
          geometry={n.geometry}
          onClick={(e) => {
            // e.preventDefault()
            e.stopPropagation()
            setActiveEl(uvAtt[e.face.a])
            set(!toggle)
          }}
        >
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
