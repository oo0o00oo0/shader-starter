
precision highp float;

// in vec3 position;
// in vec2 uv;
// uniform vec2 resolution;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// out vec2 vUv;

// ...
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
// uniform vec3 cameraPosition;
// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;
// attribute float displacement;
// ...
attribute float uvAtt;
// ...
varying vec2 vUv;
varying vec3 pos;
varying float vuvAtt;

void main(){
  vuvAtt=uvAtt;
  vUv=uv;
  pos=position;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}

