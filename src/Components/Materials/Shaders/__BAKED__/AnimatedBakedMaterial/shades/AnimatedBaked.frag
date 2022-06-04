

precision highp float;

uniform float uTime;
uniform sampler2D uTexture;
uniform float uActiveEl;
uniform float uMouseX;

varying vec2 vUv;
varying vec3 pos;

varying float vuvAtt;

///////////////////////////////////

void main()
{
  
  vec4 colour=LinearTosRGB(texture2D(uTexture,vUv));
  
  if(vuvAtt==uActiveEl){
    gl_FragColor=vec4(vUv.x*uTime,.4,vuvAtt*.6,1.);
  }
  else{
    gl_FragColor=vec4(colour.rgb,1.);
    
  }
  
}
