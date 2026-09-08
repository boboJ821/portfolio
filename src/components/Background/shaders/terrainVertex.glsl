varying float vElevation;
varying vec3 vNormal;

uniform float uTime;

vec4 permute(vec4 value) {
  return mod(((value * 34.0) + 1.0) * value, 289.0);
}

vec4 taylorInvSqrt(vec4 value) {
  return 1.79284291400159 - 0.85373472095314 * value;
}

vec3 fade(vec3 value) {
  return value * value * value * (value * (value * 6.0 - 15.0) + 10.0);
}

float classicNoise(vec3 point) {
  vec3 cell0 = floor(point);
  vec3 cell1 = cell0 + vec3(1.0);
  cell0 = mod(cell0, 289.0);
  cell1 = mod(cell1, 289.0);

  vec3 position0 = fract(point);
  vec3 position1 = position0 - vec3(1.0);
  vec4 indexX = vec4(cell0.x, cell1.x, cell0.x, cell1.x);
  vec4 indexY = vec4(cell0.yy, cell1.yy);
  vec4 indexZ0 = cell0.zzzz;
  vec4 indexZ1 = cell1.zzzz;

  vec4 indexXY = permute(permute(indexX) + indexY);
  vec4 indexXY0 = permute(indexXY + indexZ0);
  vec4 indexXY1 = permute(indexXY + indexZ1);

  vec4 gradientX0 = indexXY0 / 7.0;
  vec4 gradientY0 = fract(floor(gradientX0) / 7.0) - 0.5;
  gradientX0 = fract(gradientX0);
  vec4 gradientZ0 = vec4(0.5) - abs(gradientX0) - abs(gradientY0);
  vec4 stepZ0 = step(gradientZ0, vec4(0.0));
  gradientX0 -= stepZ0 * (step(0.0, gradientX0) - 0.5);
  gradientY0 -= stepZ0 * (step(0.0, gradientY0) - 0.5);

  vec4 gradientX1 = indexXY1 / 7.0;
  vec4 gradientY1 = fract(floor(gradientX1) / 7.0) - 0.5;
  gradientX1 = fract(gradientX1);
  vec4 gradientZ1 = vec4(0.5) - abs(gradientX1) - abs(gradientY1);
  vec4 stepZ1 = step(gradientZ1, vec4(0.0));
  gradientX1 -= stepZ1 * (step(0.0, gradientX1) - 0.5);
  gradientY1 -= stepZ1 * (step(0.0, gradientY1) - 0.5);

  vec3 gradient000 = vec3(gradientX0.x, gradientY0.x, gradientZ0.x);
  vec3 gradient100 = vec3(gradientX0.y, gradientY0.y, gradientZ0.y);
  vec3 gradient010 = vec3(gradientX0.z, gradientY0.z, gradientZ0.z);
  vec3 gradient110 = vec3(gradientX0.w, gradientY0.w, gradientZ0.w);
  vec3 gradient001 = vec3(gradientX1.x, gradientY1.x, gradientZ1.x);
  vec3 gradient101 = vec3(gradientX1.y, gradientY1.y, gradientZ1.y);
  vec3 gradient011 = vec3(gradientX1.z, gradientY1.z, gradientZ1.z);
  vec3 gradient111 = vec3(gradientX1.w, gradientY1.w, gradientZ1.w);

  vec4 normalization0 = taylorInvSqrt(vec4(
    dot(gradient000, gradient000),
    dot(gradient010, gradient010),
    dot(gradient100, gradient100),
    dot(gradient110, gradient110)
  ));
  gradient000 *= normalization0.x;
  gradient010 *= normalization0.y;
  gradient100 *= normalization0.z;
  gradient110 *= normalization0.w;

  vec4 normalization1 = taylorInvSqrt(vec4(
    dot(gradient001, gradient001),
    dot(gradient011, gradient011),
    dot(gradient101, gradient101),
    dot(gradient111, gradient111)
  ));
  gradient001 *= normalization1.x;
  gradient011 *= normalization1.y;
  gradient101 *= normalization1.z;
  gradient111 *= normalization1.w;

  float noise000 = dot(gradient000, position0);
  float noise100 = dot(gradient100, vec3(position1.x, position0.yz));
  float noise010 = dot(gradient010, vec3(position0.x, position1.y, position0.z));
  float noise110 = dot(gradient110, vec3(position1.xy, position0.z));
  float noise001 = dot(gradient001, vec3(position0.xy, position1.z));
  float noise101 = dot(gradient101, vec3(position1.x, position0.y, position1.z));
  float noise011 = dot(gradient011, vec3(position0.x, position1.yz));
  float noise111 = dot(gradient111, position1);

  vec3 blend = fade(position0);
  vec4 noiseZ = mix(
    vec4(noise000, noise100, noise010, noise110),
    vec4(noise001, noise101, noise011, noise111),
    blend.z
  );
  vec2 noiseYZ = mix(noiseZ.xy, noiseZ.zw, blend.y);
  return 2.2 * mix(noiseYZ.x, noiseYZ.y, blend.x);
}

void main() {
  vec3 displacedPosition = position;
  vec3 noisePosition = vec3(position.x * 0.08 + uTime, position.y, position.z * 0.08 + uTime);

  float baseNoise = classicNoise(noisePosition);
  float largeScaleNoise = classicNoise(noisePosition * 0.5) * 2.0;
  float detailNoise = classicNoise(noisePosition * 1.2) * 0.3;
  float fineNoise = classicNoise(noisePosition * 1.8) * 0.1;
  float elevation = ((baseNoise + largeScaleNoise) * 0.7 + (detailNoise + fineNoise) * 0.3) * 2.2;

  elevation = smoothstep(-1.0, 1.0, elevation) * 1.54;
  float distanceFromCenter = length(position.xy) / 12.0;
  elevation *= 1.0 - smoothstep(0.0, 1.0, distanceFromCenter);
  displacedPosition.z += elevation;

  vElevation = elevation * 0.4;
  vNormal = normalMatrix * normalize(normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
