varying vec2 vUv;

void main() {
    csm_FragColor = vec4(vec3(1., 1., 0.5) * 2000., csm_FragColor.a);
}
