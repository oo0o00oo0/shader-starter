import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useState, useEffect, useRef } from "react"
import { BufferAttribute, Vector3 } from "three"
import VertexTransform from "../Materials/Shaders/__VERTEXTRANSFORM__/VertexTransform/VertexTransform"
import {
  // axisData,
  centroidData,
  faceIDData,
  startPoint,
} from "./explodeMeshData"
import { useStore } from "../Objects/store"

function ExplodeMesh({ scrollPos }) {
  const geoRef = useRef()
  const [toggle, set] = useState(false)
  const [activeEl, setActiveEl] = useState(false)
  const setSkyID = useStore((s) => s.setSkyID)
  const { nodes } = useGLTF("assets/transformtests.glb")
  const diffuse = useTexture("assets/testoutput.jpg")
  const onRest = useTexture("assets/onrest.jpg")

  diffuse.flipY = false
  onRest.flipY = false

  const nodesArr = Object.values(nodes)

  useEffect(() => {
    const bufferGeometry = geoRef.current.geometry

    let len = bufferGeometry.attributes.position.array.length / 3

    // let axes = new Array(len * 3).fill(0)
    // // let axes1 = new Array(len1 * 3).fill(0)
    // for (let i = 0; i < len * 3; i = i + 3) {
    //   let index = i % (len / 4)

    //   if (i < 12) {
    //     axes[i] = test[0].x
    //     axes[i + 1] = test[0].y
    //     axes[i + 2] = test[0].z
    //   } else {
    //     axes[i] = test[1].x
    //     axes[i + 1] = test[1].y
    //     axes[i + 2] = test[1].z
    //   }
    // }
    // bufferGeometry.addAttribute(
    //   "axis",
    //   new BufferAttribute(new Float32Array(axisData), 3)
    // )

    const faceIdArr = new Float32Array(faceIDData)
    const faceAttr = new BufferAttribute(faceIdArr, 1)
    bufferGeometry.addAttribute("faceID", faceAttr)

    const array = new Float32Array(centroidData)
    const attribute = new BufferAttribute(array, 3)
    bufferGeometry.addAttribute("a_centroid", attribute)

    const startptArr = new Float32Array(startPoint)
    const stAttribute = new BufferAttribute(startptArr, 3)
    bufferGeometry.addAttribute("a_startPoint", stAttribute)

    console.log(bufferGeometry)
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
            console.log(e.face.a)
            setSkyID(faceIDData[e.face.a])
            set(!toggle)
          }}
        >
          <VertexTransform toggle={toggle} onRest={onRest} map={diffuse} />
        </mesh>
      ))}
    </group>
  )
}

function getCentroid(geometry) {
  let ar = geometry.attributes.position.array
  let len = ar.length
  let x = 0,
    y = 0,
    z = 0
  for (let i = 0; i < len; i = i + 3) {
    x += ar[i]
    y += ar[i + 1]
    z += ar[i + 2]
  }
  return { x: (3 * x) / len, y: (3 * y) / len, z: (3 * z) / len }
}

function getRandomAxis() {
  return new Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).normalize()
}
export default ExplodeMesh
