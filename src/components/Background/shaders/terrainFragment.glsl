uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;
uniform vec3 uColorE;
uniform float uTime;

varying float vElevation;
varying vec3 vNormal;

vec3 varyColor(vec3 color, float factor) {
  float variation = sin(uTime * 0.2) * 0.1 + 0.9;
  return color * variation * factor;
}

void main() {
  vec3 deepPurple = varyColor(uColorA, 1.0);
  vec3 midPurple = varyColor(uColorB, 1.1);
  vec3 brightPurple = varyColor(uColorC, 1.2);

  float midTransition = smoothstep(-0.4, -0.1, vElevation);
  float brightTransition = smoothstep(0.2, 0.5, vElevation);
  vec3 midTone = mix(midPurple, midPurple * vec3(1.0, 0.95, 1.05), sin(vElevation * 4.0) * 0.5 + 0.5);
  vec3 brightTone = mix(brightPurple, brightPurple * vec3(1.1, 1.0, 1.2), cos(vElevation * 3.0) * 0.5 + 0.5);

  vec3 color = mix(deepPurple, midTone, midTransition);
  color = mix(color, brightTone, brightTransition);

  vec3 light = normalize(vec3(1.0, 2.0, 1.5));
  float diffuse = max(0.0, dot(vNormal, light));
  color = mix(color * 0.2, color * 1.15, pow(diffuse, 1.3));

  float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
  vec3 fresnelColor = mix(uColorE, uColorE * vec3(1.2, 1.0, 1.4), fresnel);
  color += fresnelColor * fresnel * 0.4;

  float highlight = pow(max(0.0, dot(reflect(-light, vNormal), vec3(0.0, 0.0, 1.0))), 32.0);
  color += uColorD * highlight * 0.4;

  float topHighlight = smoothstep(0.3, 0.6, vElevation);
  vec3 topColor = mix(uColorD, uColorD * vec3(1.1, 1.0, 1.3), topHighlight);
  color = mix(color, color + topColor * 0.25, topHighlight) * 1.1;

  gl_FragColor = vec4(color, 1.0);
}
