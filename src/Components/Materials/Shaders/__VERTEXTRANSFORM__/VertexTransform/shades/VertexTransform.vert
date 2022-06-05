
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
// vec3 axis=vec3(0.,1.,0.);

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
  
  vec3 p=position.xyz-a_centroid;
  
  // vec3 newPosition=position-a_centroid;
  
  vec3 newPosition=rotate(p,axis,uMouseX);
  // vec3 newPosition=rotate(p+a_centroid,axis,uMouseX);
  
  newPosition+=a_centroid;
  
  // float new_x=p.x*cos(uMouseX)-p.y*sin(uMouseX);
  // float new_y=p.y*cos(uMouseX)+p.x*sin(uMouseX);
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(newPosition,1.);
  ///////////////////////////////////////
  // gl_Position=projectionMatrix*modelViewMatrix*vec4(newPosition,1.);
  // vec4 modelPosition=modelMatrix*vec4(vec3(position.x,position.y,position.z),1.);
  // // modelPosition.z+=200.;
  // vec4 viewPosition=viewMatrix*modelPosition;
  // vec4 projectedPosition=projectionMatrix*viewPosition;
  // gl_Position=projectedPosition;
  
  // vec3 newposition=position;
  
  // vec3 newnormal=rotate(normal,axis,tProgress);
  // // vNormal=newnormal;
  
  // newposition+=newposition+centroid*(tProgress)*(3.+offset*7.);
  // // gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
  
  // vec4 worldPosition=modelMatrix*vec4(newposition,1.);
  // vec3 worldNormal=normalize(mat3(modelMatrix[0].xyz,modelMatrix[1].xyz,modelMatrix[2].xyz)*newnormal);
  // vec3 I=worldPosition.xyz-cameraPosition;
  // gl_Position=projectionMatrix*modelViewMatrix*vec4(newposition,1.);
  
}

