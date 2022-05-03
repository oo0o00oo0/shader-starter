precision highp float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;
// ...
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
// ...

varying vec2 vUv;

void main(){
  
  vUv=uv;
  
  vec4 modelPosition=modelMatrix*vec4(vec3(position.x,position.y,position.z),1.);
  
  // modelPosition.z += uTime * 5.;
  vec4 viewPosition=viewMatrix*modelPosition;
  vec4 projectedPosition=projectionMatrix*viewPosition;
  gl_Position=projectedPosition;
}