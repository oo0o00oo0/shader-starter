import { useEffect, useRef } from "react"
import Div100vh from "react-div-100vh"
import { useTransition, a, useSpring } from "@react-spring/web"
import styled from "styled-components"
import { useStore } from "./Components/Objects/store"
import SceneMain from "./Components/Scenes/SceneMain"
import GodRaysScene from "./Components/GodRays/GodRays"
import GodRaysVanillaScene from "./Components/GodRays/GodRaysVanilla"
import { PPGodRays } from "./Components/GodRays/PPGodRays"
import VolumeApp from "./Components/GodRays/VolumetricLight"

function App() {
  return (
    <>
      {/* <GodRaysVanillaScene /> */}
      <Holder id="holder">
        {/* <PPGodRays /> */}
        <VolumeApp />

        {/* <GodRaysScene /> */}
        {/* <BlackOut>
          <SceneMain />
        </BlackOut>
        <Drop /> */}
      </Holder>
      {/* <WhiteOut /> */}
    </>
  )
}

export default App

function Drop() {
  const showDrop = useStore((s) => s.showDrop)

  useEffect(() => {
    console.log("showdrop", showDrop)
  }, [showDrop])

  // const transition = useTransition(showDrop, {
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  // })

  const { opacity } = useSpring({
    opacity: showDrop ? 1 : 0,
    config: { delay: 700 },
  })

  // return null
  return (
    <a.div
      style={{
        zIndex: 2,
        opacity: opacity,
        position: "absolute",
        height: "200px",
        width: "200px",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
      }}
    >
      DROPP
    </a.div>
  )
  // if (showDrop) {
  //   return (
  //     <a.div
  //       style={{
  //         zIndex: 2,
  //         // opacity: opacity,
  //         position: "absolute",
  //         height: "200px",
  //         width: "200px",
  //         background: "green",
  //       }}
  //     >
  //       DROPP
  //     </a.div>
  //   )
  // } else return null

  // return transition(
  //   ({ opacity }, item) =>
  //     item && (
  //       <a.div
  //         style={{
  //           zIndex: 20,
  //           opacity: opacity,
  //           position: "absolute",
  //           height: "200px",
  //           width: "200px",
  //           background: "green",
  //         }}
  //       >
  //         DROPP
  //       </a.div>
  //     )
  // )
}

const Holder = styled.div`
  background: #000000;
  position: absolute;

  height: 100vh;
  width: 100vw;
`
const SceneContainer = styled.div`
  position: absolute;
  top: 0;

  height: 100vh;
  width: 100vw;
`

function WhiteOut() {
  const ref = useRef()

  let property = "opacity"
  let start, previousTimeStamp
  let count = 0
  const mouseRef = useRef(useStore.getState().mouseDown)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() =>
    useStore.subscribe((state) => (mouseRef.current = state.mouseDown))
  )

  let done = false

  const setShowDrop = useStore((s) => s.setShowDrop)
  function step(timestamp) {
    if (start === undefined) {
      start = timestamp
    }

    const elapsed = timestamp - start

    if (ref.current && previousTimeStamp !== timestamp) {
      if (mouseRef.current && count < 1) {
        count += 0.02
      } else if (!mouseRef.current && count > 0) {
        count -= 0.06
      }

      let opacity = count

      ref.current.style.setProperty(property, opacity)
    }

    if (count >= 1) {
      done = true
      setTimeout(() => setShowDrop(true), 300)
      console.log("DIIIIP")
    }
    // window.requestAnimationFrame(step)
    !done && window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)

  // useEffect(() => {
  //   console.dir(ref.current.style)
  //   ref.current.style.backgroundColor = "red"
  //   // console.dir(ref.current.style.backgroundColor)
  // })

  return <FillPage ref={ref}></FillPage>
}

function BlackOut({ children }) {
  const ref = useRef()

  let property = "opacity"
  let start, previousTimeStamp
  let count = 1
  const mouseRef = useRef(useStore.getState().mouseDown)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() =>
    useStore.subscribe((state) => (mouseRef.current = state.mouseDown))
  )

  function step(timestamp) {
    if (start === undefined) {
      start = timestamp
    }
    const elapsed = timestamp - start

    if (ref.current && previousTimeStamp !== timestamp) {
      if (mouseRef.current && count > 0) {
        count -= 0.03
        // count -= 0.09
      } else if (!mouseRef.current && count < 1) {
        count += 0.09
      }

      let opacity = count

      ref.current.style.setProperty(property, opacity)
    }

    window.requestAnimationFrame(step)
  }

  // window.requestAnimationFrame(step)

  return <FillPageBlack ref={ref}>{children}</FillPageBlack>
}

const FillPageBlack = styled.div`
  /* pointer-events: none; */
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(
    180deg,
    hsl(219deg 10% 73%) 0%,
    hsl(237deg 9% 75%) 11%,
    hsl(266deg 10% 76%) 22%,
    hsl(301deg 10% 76%) 33%,
    hsl(329deg 17% 78%) 44%,
    hsl(346deg 23% 80%) 56%,
    hsl(0deg 28% 81%) 67%,
    hsl(12deg 35% 81%) 78%,
    hsl(22deg 39% 81%) 89%,
    hsl(32deg 37% 80%) 100%
  );
  /* background: black; */
`
const FillPage = styled.div`
  pointer-events: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(#ffffff, #9198e5);

  /* opacity: 0.6; */

  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10vh;
`
