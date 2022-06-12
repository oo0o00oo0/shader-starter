
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
attribute float faceID;
attribute vec3 a_centroid;
attribute vec3 a_startPoint;
attribute vec3 axis;

uniform float uMouseX;
uniform float uActiveFace;

// ...
varying vec2 vUv;
varying vec3 pos;
varying float vFaceID;

float offset=.3;
float tProgress=.5;
vec3 vNormal=vec3(.5,0,.3);

mat4 rotationMatrix(vec3 axis,float angle){
  axis=normalize(axis);
  float s=sin(angle);
  float c=cos(angle);
  float oc=1.-c;
  
  return mat4(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
    oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
    oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
  0.,0.,0.,1.);
}

vec3 rotate(vec3 v,vec3 axis,float angle){
  mat4 m=rotationMatrix(axis,angle);
  return(m*vec4(v,1.)).xyz;
}

void main(){
  
  vFaceID=faceID;
  vUv=uv;
  pos=position;
  
  vec3 p=position.xyz;
  
  // p.y+=a_centroid.z;
  // p.x-=a_centroid.x;
  // p.z+=a_centroid.y;
  
  // vec3 newPosition=rotate(p,axis,uMouseX);
  // vec3 testNew=rotate(p,vec3(0.,0.,0.),0.);
  // vec3 newPosition=rotate(p,vec3(0.,0.,0.),0.);
  
  vec3 blend=mix(p.xzy,vec3(a_startPoint.x,a_startPoint.z,a_startPoint.y),uMouseX);
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(blend,1.);
  
}

