export const AdditiveBlendingShader = {
  uniforms: {
    tDiffuse: { value: null },
    tAdd: { value: null },
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
    vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tAdd;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D( tDiffuse, vUv );
      vec4 add = texture2D( tAdd, vUv );
      // gl_FragColor = vec4(0.2,0.7,0.4,1.);
      gl_FragColor = color + add;
    }`,
}
