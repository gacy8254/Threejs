void LinearGradient(vec2 UV, out float UGradient, out float VGradient)
{
    UGradient = UV.r;
    VGradient = UV.g;
}

float CheapContrast(vec2 uv, float value, float contrast)
{
    float mixValue = mix( 0. - contrast, contrast + 1., value);

    return clamp(mixValue, 0., 1.);
}

varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec3 vDirWs;
varying vec3 vWorldNormal;
varying vec4 vScreenPos;

uniform float uFalloffMidpoint;
uniform float uFalloffExponent;
uniform float uFalloffStrength;
uniform float uFresnelExponent;
uniform float uDepthFade;
uniform float uDetailIntensity;
uniform vec2 uDetailTexTiling;
uniform vec2 uDetailTexSpeed;
uniform float uStreaksAmountMultiplier;
uniform float uStreaksLengthMultiplier;
uniform float uStreaksStrength;
uniform float ucylindricalfalloffexponent;
uniform float uOverallContrast;
uniform float uOverallIntensity;
uniform float uTime;
uniform vec3  uObjPos;
uniform vec4  uTintColor;
uniform sampler2D uMaskTex;
uniform sampler2D uLightShiftTex;

float Fresnel(float exponentIn)
{
	return pow(
		1.0 - clamp(dot(normalize(vWorldNormal), normalize(vDirWs)), 0.0, 1.0),
		exponentIn
	);
}

float DepthFade(float fadeDistance)
{
//    float sceneDepth = texture2D(uDepthTex, vScreenPos.xy).r;
//    float pixelDepth = vScreenPos.z;
//    float l3 = pixelDepth - sceneDepth / fadeDistance;
//    return clamp(l3, 0., 1.);
    return 0.;
}

float CheckerPattern(vec2 uv, vec2 tiling)
{
    vec2 v1 = uv * tiling * 0.5;
    float f1 = floor(fract(v1.x * -1.) + 0.5);
    float f2 = floor(fract(v1.x) + 0.5);
    float f3 = floor(fract(v1.y) + 0.5);

    return mix(f1, f2, f3);
}
vec3 SCurve(vec3 In, float power)
{
    vec3 v1 = clamp(In * 2., 0., 1.);
    vec3 v2 = pow(v1, vec3(power)) * 0.5;

    vec3 v3 = (In - 0.5) * 2.;
    vec3 v4 = 1. - clamp(v3, 0., 1.);
    vec3 v5 = 1. - pow(v4, vec3(power));
    vec3 v6 = (v5 * 0.5) + 0.5;

    vec3 v7 = clamp(v5 * 500., 0., 1.);

    return mix(v2, v6, v7);
}
void main()
{
    float UGradient;
    float VGradient;

    LinearGradient(vUv, UGradient, VGradient);

    float lB = 0.;
    {    
    vec2 objPosXY = uObjPos.xy;
    float objPosZ = uObjPos.z;
    objPosXY += objPosZ;
    objPosXY = mod(objPosXY, 100.f) / 100.f; 
    objPosXY += vUv2;
    objPosXY *= uDetailTexTiling;
    objPosXY += uTime * uDetailTexSpeed;
    vec4 maskTex = texture2D(uMaskTex, objPosXY);

    lB = pow(maskTex.r, uDetailIntensity * 4.);
    }

    vec2 tempUV = vUv;
    tempUV += (uDetailTexSpeed / 5. * uTime);
    tempUV *= vec2(uStreaksAmountMultiplier, 1. / uStreaksLengthMultiplier);
    vec4 texData = texture2D(uLightShiftTex, tempUV);
    float texDataR = ((1. - texData.r) * uStreaksStrength);

    float uGra = UGradient;
    uGra *= (1. - uGra);
    uGra *= 4.;
    uGra = pow(uGra, ucylindricalfalloffexponent) * 0.8;

    float alpha = clamp((uGra - texDataR) / (1. - texDataR), 0., 1.);

    float beforeCheapContrast = mix(0., lB, alpha);
    float afterContrast = CheapContrast(vUv, beforeCheapContrast, uOverallContrast);
    vec4 emissiveColor = afterContrast * uTintColor * uOverallIntensity;

//    float fresnelValue = 1. - Fresnel(uFresnelExponent);
//    float depthFadeV = pow(DepthFade(uDepthFade), 0.7);
//    float fXd = fresnelValue * depthFadeV;

    vec2 v1 = 1. / vec2(1., 1. - uFalloffMidpoint) * vUv;
    float UGra;
    float VGra;
    LinearGradient(v1, UGra, VGra);
    float f1 = clamp(VGra, 0., 1.);//B

    vec2 v2 = vec2(0., uFalloffMidpoint) + vUv;
    float f2 = CheckerPattern(v2, vec2(1., 1.));

    vec2 v3 = vUv - vec2(0., 1. - uFalloffMidpoint);
    vec2 v4 = 1. / vec2(1., uFalloffMidpoint);
    vec2 v5 = v3 * v4;
    LinearGradient(v5, UGra, VGra);
    float f3 = clamp(1. - VGra, 0., 1.);//B

    float f4 = mix(f3, f1, f2);

    float scurve = SCurve(vec3(f4), uFalloffExponent).r;

    float f5 = mix(1., scurve, uFalloffStrength);

    //float a = f5 * fXd;

    csm_FragColor = vec4(vec3(emissiveColor.rgb * vec3(1.f, 0.7, 0.5) * vec3(0.6)),emissiveColor.r * f5 * 0.8);
    //csm_FragColor = vec4(vec3(1.), 1.);
}