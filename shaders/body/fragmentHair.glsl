varying vec3 vWorldNormal;
varying vec3 vWorldTangent;
varying vec3 vWorldBitangent;
varying vec3 vDirWs;
uniform vec3 uLightPosition;
varying vec4 vScreenPos;
varying mat4 vViewMatrix;
uniform sampler2D uLightMap;
uniform sampler2D uRampMap;
uniform sampler2D uMetalMap;
uniform sampler2D uNormalMap;
uniform sampler2D uEmissiveMap;
uniform sampler2D uDepthTexture;
uniform float uIsDay;
uniform vec3 uShadowColor;
uniform vec3 uTintColor;
uniform float uNoMetallic;
uniform float uMetallic;
uniform float uTime;
uniform float uRimLightWidth;
uniform float uRimLightIntensity;
uniform float uNear;
uniform float uFar;
uniform float uIntensity;
uniform bool uHand;
uniform bool uHair;
uniform bool uCloth;
uniform float uGlobalIntensity;

float RampMapRow0 = 1.;
float RampMapRow1 = 4.;
float RampMapRow2 = 3.;
float RampMapRow3 = 5.;
float RampMapRow4 = 2.;

float readDepth(sampler2D depthSampler, vec2 coord) {
  float fragCoordZ = texture2D(depthSampler, coord).x;
  float viewZ = perspectiveDepthToViewZ(fragCoordZ, uNear, uFar);
  return viewZToOrthographicDepth(viewZ, uNear, uFar);
}

float StrandSpecular(vec3 V, vec3 T, vec3 L, vec3 N, float exponent,float scale){
  //V：点到相机方向
  //T：副切削方向
  //L：点到光源方向，如果是直射光就是光的照射方向的反方向
  //N：法线方向
  float nl = saturate(dot(N, L));
  vec3 H = normalize(L + V);
  T = normalize((scale * 2. - 1.) * N + T);
  float dotTH = dot(T, H);
  float sinTH = sqrt(1.0 - dotTH * dotTH);
  float dirAtten = smoothstep(-1.0, 0.0, dotTH);
  float factor = dirAtten * pow(sinTH, exponent);
  factor *= nl;
  float bdv = dot(V, N);
  return factor * bdv;
}

void main() {
  /* 处理需要的数据 */

  /* normalMap */
  vec4 normalTex = texture2D(uNormalMap, vUv);
  vec3 normalTs = vec3(normalTex.rg * 2. - 1., 0.);
  normalTs.z = sqrt(1. - dot(normalTs.xy, normalTs.xy));

  vec3 worldNormal = normalize(vWorldNormal);
  vec3 viewNormal = (vViewMatrix * vec4(worldNormal, 0.)).xyz;

  /* Screen Pos */
  vec2 scrPos = vScreenPos.xy / vScreenPos.w;
  vec2 scrOffsetPos = scrPos + viewNormal.xy * uRimLightWidth * 0.01;

  vec3 dirL = normalize(uLightPosition);
  vec3 hDirWS = normalize(vDirWs + dirL);

  vec2 matcapUV = (viewNormal.xy + 1.) * .5;

  float NDotL = dot(worldNormal, dirL); //lambert

  float lambert = max(NDotL, 0.);

  float NDotH = dot(worldNormal, hDirWS); //Blinn-Phong

  float NdotV = dot(worldNormal, vDirWs); //fresnel

  /* lightMap */
  vec4 lightMapTex = texture2D(uLightMap, vUv);
  lightMapTex = vec4(0,0.5,1,1);
  float halfLambert = pow(lambert * .5 + .5, 2.);
  float lamberStep = smoothstep(.42, .45, halfLambert);

  /* 枚举样条阈值 */
  float matEnum0 = .0;
  float matEnum1 = .3;
  float matEnum2 = .5;
  float matEnum3 = .7;
  float matEnum4 = 1.;

  /* 计算每一行样条的中心点 */
  float ramp0 = RampMapRow0 / 10. - .05;
  float ramp1 = RampMapRow1 / 10. - .05;
  float ramp2 = RampMapRow2 / 10. - .05;
  float ramp3 = RampMapRow3 / 10. - .05;
  float ramp4 = RampMapRow4 / 10. - .05;

  /* 根据魔法图alpha通道的阈值 计算rampV */
  float dayRampV = mix(ramp4, ramp3, step(lightMapTex.a, (matEnum4 + matEnum3) * .5));
  dayRampV = mix(dayRampV, ramp2, step(lightMapTex.a, (matEnum3 + matEnum2) * .5));
  dayRampV = mix(dayRampV, ramp1, step(lightMapTex.a, (matEnum2 + matEnum1) * .5));
  dayRampV = mix(dayRampV, ramp0, step(lightMapTex.a, (matEnum1 + matEnum0) * .5));

  float nightRampV = dayRampV + .5;

  float rampClampMin = .003;
  float rampClampMax = .997;

  /* 防止取到边界 */
  float rampU = clamp(smoothstep(.2, .4, halfLambert), rampClampMin, rampClampMax);
  vec2 dayUV = vec2(rampU, 1. - dayRampV);
  vec2 nightUV = vec2(rampU, 1. - nightRampV);

  vec2 darkDayUV = vec2(rampClampMin, 1. - dayRampV);
  vec2 darkNightUV = vec2(rampClampMin, 1. - nightRampV);

  float uIsDay = (uIsDay + 1.) * .5;
  vec3 rampGreyColor = mix(texture2D(uRampMap, nightUV).rgb, texture2D(uRampMap, dayUV).rgb, uIsDay);
  vec3 rampDarkColor = mix(texture2D(uRampMap, darkNightUV).rgb, texture2D(uRampMap, darkDayUV).rgb, uIsDay);

  vec4 baseColor = csm_DiffuseColor;

  vec3 grayShadowColor = baseColor.rgb * rampGreyColor * uShadowColor;
  vec3 darkShadowColor = baseColor.rgb * rampDarkColor * uShadowColor;

  /* light.g > 0.5的部分受光照影响 */
  vec3 diffuse = vec3(0.);
  diffuse = mix(grayShadowColor, baseColor.rgb, lamberStep);
  // 处理0-0.5的部分 常暗
  diffuse = mix(darkShadowColor, diffuse, clamp(lightMapTex.g * 2., 0., 1.));
  // 处理0.5-1的部分 受光照影响
  diffuse = mix(diffuse, baseColor.rgb, clamp((lightMapTex.g - .5), 0., 1.) * 2.);

  float blinPhong = step(0., NDotL) * pow(max(NDotH, 0.), 16.);
  /* 避免漏光 */
  vec3 noMetalicSpec = vec3(step(1.04 - blinPhong, 1.) * 1.) * uNoMetallic;

  /*根据光的方向有一个衰减 这里设置的下限是0.2 ，光滑的非金属表面是不吸收颜色的，但是金属会吸收 所以需要乘以baseColor */
  vec3 metalicSpec = vec3(blinPhong * 1. * (lamberStep * .8 + .2) * baseColor.rgb) * uMetallic;

  /* 根据魔法图r通道提取金属区域 */
  float isMetal = step(.95, 1.);

  vec3 finalSpec = mix(noMetalicSpec, metalicSpec, isMetal);

  vec3 metallic = mix(vec3(0.), texture2D(uMetalMap, matcapUV).rgb * baseColor.rgb, isMetal);

  float fresnel = 1. - clamp(NdotV, 0., 1.);

  float fresnelClamp = .5;

  float ft = pow(fresnel, 8.);

  fresnel = pow(fresnel, 8.);


  // fresnel = fresnel * fresnelClamp + (1. - fresnelClamp);

  /* 边缘光 */
  // vec3 rimLight = baseColor.rgb * fresnel;
  float offsetDepth = readDepth(uDepthTexture, scrOffsetPos);
  float currentDepth = readDepth(uDepthTexture, scrPos);
  float depthDiff = clamp(offsetDepth - currentDepth, 0., 1.);
  // float rimIntensity = step(.12, depthDiff);
  float rimIntensity = smoothstep(.12, 1., depthDiff);
  vec3 rimLight = diffuse * rimIntensity * uRimLightIntensity * fresnel;

  /* 自发光 */
  vec4 emissiveTex = texture2D(uEmissiveMap, vUv);
  emissiveTex.a = smoothstep(0., 1., emissiveTex.a);

  vec3 glow = mix(vec3(0.), emissiveTex.rgb * abs(sin(uTime * .8)) * .2, emissiveTex.a);

  vec3 albedo = diffuse + (finalSpec * 2.) + metallic + glow + rimLight;

  if(baseColor.a < .5) {
    discard;
  }

  csm_Roughness = 1.;
  csm_Metalness = 0.;

  vec3 noMetalicSpec1 = vec3(step(1.04 - blinPhong, 1.f) * 0.1f) * uNoMetallic;

  /*根据光的方向有一个衰减 这里设置的下限是0.2 ，光滑的非金属表面是不吸收颜色的，但是金属会吸收 所以需要乘以baseColor */
  vec3 metalicSpec1 = vec3(blinPhong * 1. * (lamberStep * .8 + .2) * baseColor.rgb) * uMetallic;

    //csm_Emissive = pow(albedo + 0.75, vec3(300.)) * 20.5;
    //csm_Emissive = vec3(albedo);
    //csm_DiffuseColor *= vec4(0.3);
    //csm_Roughness = 0.4;
    //csm_Metalness = 0.;
    //vec3 aa = clamp(vec3(pow (blinPhong, 10.)), 0., 1.) / 1.5 * vec3(1., 0.7, 0.5);
    //csm_FragColor.rgb =pow(csm_FragColor.rgb + 0.85, vec3(100.)) * 1000. * vec3(1., 0.7, 0.5);
    //csm_FragColor

    #ifdef USE_TANGENT
    mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
#else
    mat3 tbn2 = getTangentFrame( - vViewPosition, normalize( vNormal ),
        vUv
    );
#endif

  #ifdef USE_ANISOTROPY
        #ifdef USE_ANISOTROPYMAP
            mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
            vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
            vec2 anisotropyV2 = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
        #else
            vec2 anisotropyV2 = anisotropyVector;
        #endif
        float alphaT = mix( pow2( 0.2 ), 1.0, pow2( 1. ) );
        vec3 anisotropyT = tbn2[ 0 ] * anisotropyV2.x + tbn2[ 1 ] * anisotropyV2.y;
        vec3 anisotropyB = tbn2[ 1 ] * anisotropyV2.x - tbn2[ 0 ] * anisotropyV2.y;
  #endif

  float s = clamp(StrandSpecular(vDirWs, anisotropyB, dirL, worldNormal, 128., 0.5), 0., 2.) * 1.;

  albedo += vec3(s);
  csm_FragColor.rgb = (vec3(pow(albedo , vec3(2.2))) * 1.  + vec3(0.005))* vec3(1., 0.75, 0.65);
  //csm_Emissive *= vec3(uGlobalIntensity);
  //csm_Emissive *= vec3(uTintColor);
}