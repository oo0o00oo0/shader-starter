

precision highp float;

uniform float uTime;
uniform sampler2D uTexture;
uniform float uActiveEl;
uniform float uMouseX;
uniform float uMix;

varying vec2 vUv;
varying vec3 pos;

varying float vuvAtt;

///////////////////////////////////

void main()
{
  
  vec4 colour=LinearTosRGB(texture2D(uTexture,vUv));
  
  vec3 tempCol=vec3(vUv.x*uTime,.4,vuvAtt*.6);
  
  if(vuvAtt==uActiveEl){
    // gl_FragColor=vec4(mix(vec3(1.,0.,0.),vec3(colour.rgb),uMix),1.);
        gl_FragColor=vec4(mix(vec3(colour.rgb * uMix),vec3(1.,1.,1.),uMix),1.);

  }
  else{
    gl_FragColor=vec4(colour.rgb  ,1.);
    
  }
  
  //  gl_FragColor=vec4(mix(tempCol,vec3(1.,0.,0.),uMix),1.);
  
}
