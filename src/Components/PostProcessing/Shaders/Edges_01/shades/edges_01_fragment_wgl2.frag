

precision highp float;

varying vec2 vUv;
varying vec3 pos;

uniform sampler2D tDiffuse;
uniform sampler2D colorTexture;
uniform sampler2D normalTexture;
uniform sampler2D paperTexture;
uniform sampler2D noiseTexture;
uniform sampler2D coordsBackTexture;
uniform sampler2D coordsFrontTexture;

uniform vec3 inkColor;
uniform vec3 paperColor;
uniform float scale;
uniform float hatchScale;
uniform float contour;
uniform float paperGrid;
uniform float objectGrid;
uniform float angleDark;
uniform float angleLight;
uniform float light;
uniform float dark;
uniform float uBlend;

///////////////////////////////////

vec4 sobel(sampler2D src,vec2 uv,vec2 resolution,float width){
  float x=width/resolution.x;
  float y=width/resolution.y;
  vec4 horizEdge=vec4(0.);
  horizEdge-=texture2D(src,vec2(uv.x-x,uv.y-y))*1.;
  horizEdge-=texture2D(src,vec2(uv.x-x,uv.y))*2.;
  horizEdge-=texture2D(src,vec2(uv.x-x,uv.y+y))*1.;
  horizEdge+=texture2D(src,vec2(uv.x+x,uv.y-y))*1.;
  horizEdge+=texture2D(src,vec2(uv.x+x,uv.y))*2.;
  horizEdge+=texture2D(src,vec2(uv.x+x,uv.y+y))*1.;
  vec4 vertEdge=vec4(0.);
  vertEdge-=texture2D(src,vec2(uv.x-x,uv.y-y))*1.;
  vertEdge-=texture2D(src,vec2(uv.x,uv.y-y))*2.;
  vertEdge-=texture2D(src,vec2(uv.x+x,uv.y-y))*1.;
  vertEdge+=texture2D(src,vec2(uv.x-x,uv.y+y))*1.;
  vertEdge+=texture2D(src,vec2(uv.x,uv.y+y))*2.;
  vertEdge+=texture2D(src,vec2(uv.x+x,uv.y+y))*1.;
  vec4 edge=sqrt((horizEdge*horizEdge)+(vertEdge*vertEdge));
  return edge;
}

float luma(vec3 color){
  return dot(color,vec3(.299,.587,.114));
}

float luma(vec4 color){
  return dot(color.rgb,vec3(.299,.587,.114));
}

float aastep(float threshold,float value){
  #ifdef GL_OES_standard_derivatives
  /* jshint ignore:start */
  float afwidth=length(vec2(dFdx(value),dFdy(value)))*.70710678118654757;
  /* jshint ignore:end */
  return smoothstep(threshold-afwidth,threshold+afwidth,value);
  #else
  return step(threshold,value);
  #endif
}

float blendDarken(float base,float blend){
  return min(blend,base);
}

vec3 blendDarken(vec3 base,vec3 blend){
  return vec3(blendDarken(base.r,blend.r),blendDarken(base.g,blend.g),blendDarken(base.b,blend.b));
}

vec3 blendDarken(vec3 base,vec3 blend,float opacity){
  return(blendDarken(base,blend)*opacity+base*(1.-opacity));
}
float blendScreen(float base,float blend){
  return 1.-((1.-base)*(1.-blend));
}

vec3 blendScreen(vec3 base,vec3 blend){
  return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base,vec3 blend,float opacity){
  return(blendScreen(base,blend)*opacity+base*(1.-opacity));
}

#define mul(a,b)(b*a)

float simplex(in vec3 v){
  return 2.*texture2D(noiseTexture,v.xy/32.).r-1.;
}

float fbm3(vec3 v){
  float result=simplex(v);
  result+=simplex(v*2.)/2.;
  result+=simplex(v*4.)/4.;
  result/=(1.+1./2.+1./4.);
  return result;
}

float fbm5(vec3 v){
  float result=simplex(v);
  result+=simplex(v*2.)/2.;
  result+=simplex(v*4.)/4.;
  result+=simplex(v*8.)/8.;
  result+=simplex(v*16.)/16.;
  result/=(1.+1./2.+1./4.+1./8.+1./16.);
  return result;
}

// adapted from https://github.com/libretro/glsl-shaders/blob/master/misc/cmyk-halftone-dot.glsl

float lines(in float l,in vec2 fragCoord,in vec2 resolution,in float thickness){
  
  vec2 center=vec2(resolution.x/2.,resolution.y/2.);
  vec2 uv=fragCoord.xy*resolution;
  
  float c=(.5+.5*sin(uv.x*.5));
  
  float e=4.*100.*length(vec2(dFdx(fragCoord.x),dFdy(fragCoord.y)));
  // float f = 4.*smoothstep(1.-e, 1., c);
  // return f;
  return 1.;
}

#define TAU 6.28318530718

mat2 rot(in float a){
  float s=sin(a);
  float c=cos(a);
  mat2 rot=mat2(c,-s,s,c);
  return rot;
}

// // from https://www.shadertoy.com/view/wdK3Dy

float grid(vec2 fragCoord,float space,float gridWidth)
{
  vec2 p=fragCoord-vec2(.5);
  vec2 size=vec2(gridWidth-.5);
  
  vec2 a1=mod(p-size,space);
  vec2 a2=mod(p+size,space);
  vec2 a=a2-a1;
  
  float g=min(a.x,a.y);
  return clamp(g,0.,1.);
}

bool isCol(float r,float g,float b,float test){
  
  float avg=(r+g+b)/3.;
  
  if(test>avg){
    
    return true;
  }else{
    return false;
  }
  
}

void main()
{
  vec2 size=vec2(7000.,7000.);
  // vec2 size=vec2(2000.,2000.);
  //  vec2 size = vec2(12000.,12000.);
  //  vec2 size = vec2(textureSize(colorTexture, 0));
  float e=.01;
  
  vec4 color=texture2D(colorTexture,vUv);
  
  float normalEdge=1.-length(sobel(normalTexture,vUv,size,contour));
  
  normalEdge=1.-clamp(smoothstep(.5-e,.5+e,normalEdge),.8,1.);
  // normalEdge = 1.-clamp(smoothstep(.5-e, .5+e, normalEdge), 0., 1.);
  
  vec4 coordsFrontTextureTest=texture2D(coordsFrontTexture,vUv);
  vec4 front=texture2D(coordsFrontTexture,vUv);
  vec4 back=texture2D(coordsBackTexture,vUv);
  
  // vec4 paper = texture(paperTexture, .00025 * vUv*size);
  
  float l=clamp(2.*luma(color.rgb),0.,1.);
  
  mat2 r=rot(angleDark);
  
  float hatchDark=0.;
  if(l<.75){
    hatchDark=(1.-l/.75)*lines(.275,r*hatchScale*vUv,size,1.)*color.a;
  }
  
  l=clamp(luma(color.rgb)-.75,0.,1.)*3.;
  r=rot(angleLight);
  float hatchLight=0.;
  if(l>.5){
    hatchLight=((l-.5)*2.)*lines(.5,r*hatchScale*vUv,size,1.)*color.a;
  }
  
  if(mod(length(back.xz),.2)<e){
    back.a=1.;
  }
  
  float stripe=(1.-min(front.a,.25+back.a))*color.a;
  
  // float stripe = 0.6;
  // float stripe = (1.-min(front.a, .25 + back.a)) * color.a;
  
  float w=(objectGrid*stripe)+(dark*hatchDark)+(light*hatchLight)+normalEdge;
  // gl_FragColor.rgb = blendScreen(gl_FragColor.rgb, inkColor.rgb / 255., w);
  // fragColor.rgb = blendScreen(fragColor.rgb, inkColor.rgb / 255., w) * 0.3;
  // gl_FragColor.a = w;
  
  float rr=texture2D(colorTexture,vUv).r;
  float gg=texture2D(colorTexture,vUv).g;
  float bb=texture2D(colorTexture,vUv).b;
  
  // if (texture2D(colorTexture, vUv).b > 0.65){
    
    vec4 pass=vec4(gl_FragColor.rgba);
    
    // if(isCol(rr,gg,bb,bb)){
      //   gl_FragColor=mix(texture2D(colorTexture,vUv),vec4(0.,.61,.65,1.),uBlend);
    // }else if(isCol(rr,gg,bb,gg)){
      
      //   gl_FragColor=mix(texture2D(colorTexture,vUv),vec4(.36,.43,.41,1.),uBlend);
    // }else{
      //   vec4 styled=vec4(blendScreen(gl_FragColor.rgb,inkColor.rgb/255.,w),w);
      //   gl_FragColor=mix(texture2D(colorTexture,vUv),styled,uBlend);
      //   // gl_FragColor = texture2D(colorTexture, vUv);
    // }
    vec4 styled=vec4(blendScreen(gl_FragColor.rgb,inkColor.rgb/255.,w),w);
    gl_FragColor=styled;
    // gl_FragColor=mix(texture2D(colorTexture,vUv),styled,uBlend);
    
  }
  