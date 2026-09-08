uniform float uWidth;
uniform float uBaseCurve;
uniform float uVelocity;
uniform float uBendStrength;
uniform float uVerticalBendInfluence;
uniform float uMaxBend;

varying vec2 vUv;
varying float vShade;

void main() {
  vUv = uv;

  vec3 transformed = position;
  float normalizedX = transformed.x / max(uWidth * 0.5, 0.0001);

  // A quiet permanent curve keeps the image from reading as a rigid plane.
  float baseCurve = -pow(abs(normalizedX), 2.0) * uBaseCurve;

  // Velocity bends the whole subdivided plane. The sine envelope keeps the
  // center stable while the leading and trailing edges flex in opposite ways.
  float velocityWave = sin(normalizedX * 1.5707963) * uVelocity * uBendStrength;
  float dynamicBend = clamp(velocityWave, -uMaxBend, uMaxBend);

  transformed.z += baseCurve + dynamicBend;
  transformed.y += normalizedX * uVelocity * uBendStrength * uVerticalBendInfluence;

  vShade = 0.965 + dynamicBend * 0.12 - abs(normalizedX) * uBaseCurve * 0.08;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
