

precision highp float;

uniform float uTime;
uniform sampler2D uTexture;
uniform float uActiveFace;
uniform float uMouseX;
uniform float uMix;

varying vec2 vUv;
varying vec3 pos;

varying float vFaceID;

///////////////////////////////////

void main()
{
  
  vec4 colour=LinearTosRGB(texture2D(uTexture,vUv));
  
  // vec3 tempCol=vec3(vUv.x*uTime,.4,vuvAtt*.6);
  
  if(vFaceID==uActiveFace){
    gl_FragColor=vec4(.95,0.,1.,1.);
  }
  else{
    gl_FragColor=vec4(colour.rgb,1.);
    
  }
  
  //  gl_FragColor=vec4(mix(tempCol,vec3(1.,0.,0.),uMix),1.);
  
}