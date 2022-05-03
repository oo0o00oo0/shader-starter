precision mediump float;
uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
void main(){
  gl_FragColor=vec4(uTime,vUv.x,vUv.y,1.);
}

