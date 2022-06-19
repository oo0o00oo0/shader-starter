import {
  CurveModifier,
  FirstPersonControls,
  OrbitControls,
  PerspectiveCamera,
  PointerLockControls,
  Sphere,
  Stats,
} from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
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
        position: [-5.4869334241893455, 94.41779388991088, 47.47049513898217],
      }}
    >
      {/* <PointerLockControls /> */}
      {/* <Stats /> */}
      {/* {!isMobile && <OrbitControls enableZoom={false} enablePan={false} />} */}
      {/* <CustCam /> */}
      {/* <OnBeforeCompilePlane /> */}
      {/* <TestCube /> */}
      <group position={[0, 9, 0]}>
        <ExplodeMesh />
      </group>

      {/* <OrbitControls /> */}
      <CustCam />
      {/* <POST_Edges_01 /> */}
      {/* <axisHelper args={[200]} /> */}
    </Canvas>
  )
}

function CustCam() {
  const camRef = useRef()
  const { camera } = useThree()

  function getScrollPos() {
    let t = MathUtils.clamp(
      MathUtils.mapLinear(window.scrollY, -1, 3000, 0.01, 0.99),
      0,
      1
    )
    let pos = tubeGeometry.parameters.path.getPointAt(t)
    return [pos.x, pos.y, pos.z]
  }

  const tubeGeometry = new TubeGeometry(pipeSpline, 100, 2, 6, false)

  const [{ scrollPos }, api] = useSpring(() => ({
    scrollPos: [],
  }))

  const onScroll = useCallback((e) => {
    api.start({
      scrollPos: getScrollPos(),
    })
  }, [])

  document.addEventListener("keydown", (e) => {
    e.key === "s" &&
      console.log([camera.position.x, camera.position.y, camera.position.z])
  })

  window.addEventListener("scroll", onScroll)

  return (
    <>
      <animated.group position={scrollPos}>
        <PerspectiveCamera ref={camRef} makeDefault />
      </animated.group>
      {/* <OrbitControls /> */}
    </>
  )
}

export default SceneMain
