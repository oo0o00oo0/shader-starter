import Div100vh from "react-div-100vh"
import styled from "styled-components"
import SceneMain from "./Components/Scenes/SceneMain"

function App() {
  return (
    <Holder>
      <SceneContainer>
        <SceneMain />
      </SceneContainer>
    </Holder>
  )
}

export default App

const Holder = styled(Div100vh)`
  background: #f0f6f6;
  position: relative;
`
const SceneContainer = styled.div`
  position: absolute;
  border: #323232 solid 2px;
  box-shadow: 10px 10px 8px #b0b7b9;
  left: 50%;
  top: 50%;
  height: 800px;
  width: 800px;
  transform: translate(-50%, -50%);
`
