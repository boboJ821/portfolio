uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform vec2 uPlaneSize;
uniform float uOpacity;

varying vec2 vUv;
varying float vShade;

vec2 coverUv(vec2 uv, vec2 textureSize, vec2 planeSize) {
  float textureAspect = textureSize.x / max(textureSize.y, 1.0);
  float planeAspect = planeSize.x / max(planeSize.y, 0.0001);
  vec2 ratio = vec2(1.0);

  if (textureAspect > planeAspect) {
    ratio.x = planeAspect / textureAspect;
  } else {
    ratio.y = textureAspect / planeAspect;
  }

  return (uv - 0.5) * ratio + 0.5;
}

void main() {
  vec2 uv = coverUv(vUv, uTextureSize, uPlaneSize);
  vec4 textureColor = texture2D(uTexture, uv);
  gl_FragColor = vec4(textureColor.rgb * vShade, textureColor.a * uOpacity);
}
