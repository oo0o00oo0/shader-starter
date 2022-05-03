
uniform float uMouse;
uniform float time;
uniform float amplitude;
uniform float speed;
uniform float frequency;

varying float vMouse;

// the function which defines the displacement
float displace(vec3 point){
  return noise(vec3(point.x*frequency,point.z*frequency,time*speed))*amplitude;
}

// http://lolengine.net/blog/2013/09/21/picking-orthogonal-vector-combing-coconuts
vec3 orthogonal(vec3 v){
  return normalize(abs(v.x)>abs(v.z)?vec3(-v.y,v.x,0.)
  :vec3(0.,-v.z,v.y));
}

// float rand(vec2 co){
  //   return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453);
// }
