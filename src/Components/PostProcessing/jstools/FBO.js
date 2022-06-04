import {
  WebGLRenderTarget,
  ClampToEdgeWrapping,
  LinearFilter,
  RGBAFormat,
  UnsignedByteType,
} from "three"

function getFBO(w, h, options = {}) {
  // if (isWebGL2Available()) {
  const fbo = new WebGLRenderTarget(w, h, {
    wrapS: options.wrapS || ClampToEdgeWrapping,
    wrapT: options.wrapT || ClampToEdgeWrapping,
    minFilter: options.minFilter || LinearFilter,
    magFilter: options.magFilter || LinearFilter,
    format: options.format || RGBAFormat,
    type: options.type || UnsignedByteType,
    stencilBuffer: options.stencilBuffer || false,
    depthBuffer: options.depthBuffer || true,
    samples: options.samples,
  })
  // }
  //  fbo.samples =
  return fbo
}
// function getFBO(w, h, options = {}) {
//    const fbo = new WebGLRenderTarget(w, h, {
//       wrapS: options.wrapS || ClampToEdgeWrapping,
//       wrapT: options.wrapT || ClampToEdgeWrapping,
//       minFilter: options.minFilter || LinearFilter,
//       magFilter: options.magFilter || LinearFilter,
//       format: options.format || RGBAFormat,
//       type: options.type || UnsignedByteType,
//       stencilBuffer: options.stencilBuffer || false,
//       depthBuffer: options.depthBuffer || true
//    })
//    return fbo
// }

// const fbo = new WebGLMultisampleRenderTarget(w, h, {
export { getFBO }
