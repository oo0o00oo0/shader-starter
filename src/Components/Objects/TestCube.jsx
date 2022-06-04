function TestCube() {
  return (
    <group>
      <mesh layers={1}>
        <boxBufferGeometry args={[10, 10, 10]} />
        {/* <meshStandardMaterial /> */}
        <meshBasicMaterial color="#0095ff" />
      </mesh>
      <pointLight position={[20, 20, 20]} args={["#0095ff", 1, 100]} />
    </group>
  )
}

export default TestCube
