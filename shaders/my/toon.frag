#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

uniform sampler2D uColorMap;
uniform float uGlossiness;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    // shadow map
    DirectionalLightShadow directionalLight = directionalLightShadows[0];

    float shadow = 1.0;

    // directional light
    float NdotL = dot(vNormal, directionalLights[0].direction);
    float lightIntensity = smoothstep(0.0, 0.01, NdotL * shadow);
    vec3 light = directionalLights[0].color * lightIntensity;

    // specular light
    vec3 halfVector = normalize(directionalLights[0].direction + vViewDir);
    float NdotH = dot(vNormal, halfVector);

    float specularIntensity = pow(NdotH * lightIntensity, uGlossiness * uGlossiness);
    float specularIntensitySmooth = smoothstep(0.05, 0.1, specularIntensity);

    vec3 specular = specularIntensitySmooth * directionalLights[0].color;

    // rim lighting
    float rimDot = 1.0 - dot(vViewDir, vNormal);
    float rimAmount = 0.6;

    float rimThreshold = 0.2;
    float rimIntensity = rimDot * pow(NdotL, rimThreshold);
    rimIntensity = smoothstep(rimAmount - 0.01, rimAmount + 0.01, rimIntensity);

    vec3 rim = rimIntensity * directionalLights[0].color;
    vec3 baseColor = texture2D(uColorMap, vUv).rgb;
    gl_FragColor = vec4(baseColor * (ambientLightColor + light + specular + rim), 1.0);
}
