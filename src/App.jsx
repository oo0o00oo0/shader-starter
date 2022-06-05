import { useRef } from "react"
import Div100vh from "react-div-100vh"
import { useTransition, a } from "@react-spring/web"
import styled from "styled-components"
import { useStore } from "./Components/Objects/store"
import SceneMain from "./Components/Scenes/SceneMain"

function App() {
  return (
    <PageWrapper>
      <Holder>
        <SceneContainer>
          <SceneMain />
          <SkyIDDisplay />
        </SceneContainer>
      </Holder>
    </PageWrapper>
  )
}

export default App

function SkyIDDisplay() {
  const skyID = useStore((s) => s.skyID)

  const transition = useTransition(skyID !== null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return transition(
    ({ opacity }, item) =>
      item && <SkyID style={{ opacity: opacity }}>Sky {skyID}</SkyID>
  )
}

const SkyID = styled(a.div)`
  z-index: 99;
  top: 0;
  position: absolute;
  /* background: #f200ff; */
  /* height: 20px; */
  /* width: 20px; */
  color: black;
  padding: 3vw;
  font-size: 3vw;
`

const PageWrapper = styled(Div100vh)``
// const Holder = styled(Div100vh)`
const Holder = styled.div`
  background: #f0f6f6;
  position: relative;
  height: 400vh;
  /* overflow-y: scroll; */
`
const SceneContainer = styled.div`
  position: sticky;
  top: 0;
  /* background: #1d1d1d; */
  background: #d5e1e5;
  /* border: #323232 solid 2px; */
  /* box-shadow: 10px 10px 8px #b0b7b9;
  left: 50%;
  top: 50%;
  height: 800px;
  width: 800px;
  transform: translate(-50%, -50%); */
  height: 100vh;
  width: 100%;
`
