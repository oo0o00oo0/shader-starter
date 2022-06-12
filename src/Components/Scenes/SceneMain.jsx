import {
  CurveModifier,
  FirstPersonControls,
  OrbitControls,
  PerspectiveCamera,
  PointerLockControls,
  Sphere,
  Stats,
} from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect"

import ExplodeMesh from "../Objects/ExplodeMesh"
import { useSpring, animated } from "@react-spring/three"
// import BasicShaderClassPlane from "../Objects/BasicShaderClassPlane"
// import OnBeforeCompilePlane from "../Objects/OnBeforeCompilePlane"
// import TestCube from "../Objects/TestCube"
import { useCallback, useRef } from "react"
// import POST_Edges_01 from "../PostProcessing/Shaders/Edges_01/POST_Edges_01"
import { CatmullRomCurve3, Vector3 } from "three"
import { pipeSpline } from "../Objects/explodeMeshData"
import { TubeGeometry } from "three"
import { DoubleSide } from "three"
import { MathUtils } from "three"

//https://codesandbox.io/s/elastic-dhawan-c8wk9l?file=/src/shaders/00.js

function SceneMain() {
  console.log(window.devicePixelRatio)
  return (
    <Canvas
      orthographic={false}
      dpr={window.devicePixelRatio}
      camera={{
        fov: 60,
        far: 2000,
        // zoom: 500,
        position: [-20, 120, 0],
      }}
    >
      {/* <PointerLockControls /> */}
      {/* <Stats /> */}
      {!isMobile && <OrbitControls enableZoom={false} enablePan={false} />}
      {/* <CustCam /> */}
      {/* <OnBeforeCompilePlane /> */}
      {/* <TestCube /> */}
      <group position={[0, 9, 0]}>
        <ExplodeMesh />
      </group>

      {/* <CustCam /> */}
      {/* <POST_Edges_01 /> */}
      {/* <axisHelper args={[200]} /> */}
    </Canvas>
  )
}

function CustCam() {
  const camRef = useRef()

  const scrollRef = useRef()
  const sphereRef = useRef()
  const tubeGeometry = new TubeGeometry(pipeSpline, 100, 2, 6, false)

  const [{ scrollPos }, api] = useSpring(() => ({
    scrollPos: 0,
  }))

  const onScroll = useCallback((e) => {
    sphereRef.current.position.x = tubeGeometry.parameters.path.getPointAt(
      MathUtils.clamp(window.scrollY, 0, window.innerHeight * 3) /
        (window.innerHeight * 3),
      position
    ).x
    sphereRef.current.position.y = tubeGeometry.parameters.path.getPointAt(
      MathUtils.clamp(window.scrollY, 0, window.innerHeight * 3) /
        (window.innerHeight * 3),
      position
    ).y
    sphereRef.current.position.z = tubeGeometry.parameters.path.getPointAt(
      MathUtils.clamp(window.scrollY, 0, window.innerHeight * 3) /
        (window.innerHeight * 3),
      position
    ).z

    api.start({
      scrollPos: scrollRef.current,
    })
  }, [])

  window.addEventListener("scroll", onScroll)

  const position = new Vector3()

  // useFrame(({ clock }) => {
  //   // const t = ((clock.getElapsedTime() * 60) % looptime) / looptime

  //   // tubeGeometry.parameters.path.getPointAt(t, position)
  //   // position.multiplyScalar(1)
  //   // sphereRef.current.position.x = tubeGeometry.parameters.path.getPointAt(
  //   //   t,
  //   //   position
  //   // ).x
  //   // sphereRef.current.position.y = tubeGeometry.parameters.path.getPointAt(
  //   //   t,
  //   //   position
  //   // ).y
  //   // sphereRef.current.position.z = tubeGeometry.parameters.path.getPointAt(
  //   //   t,
  //   //   position
  //   // ).z
  //   // console.log(position)
  // })

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault />
      <animated.mesh ref={sphereRef}>
        <sphereBufferGeometry args={[50, 10, 10]} />
        <meshBasicMaterial color={"red"} />
      </animated.mesh>
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial side={DoubleSide} color="black" />
      </mesh>
    </>
  )
}

export default SceneMain
