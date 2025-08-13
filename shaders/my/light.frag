uniform sampler2D uOpacityMap;
uniform sampler2D uNoiseMap;
uniform float uTime;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(uOpacityMap, vUv);
    vec4 noise = texture2D(uNoiseMap, (vUv + uTime * 0.01) * 5.f);
    float alpha = pow(noise.r, 1.);
    csm_FragColor = vec4(csm_FragColor.rgb, 0);
}
