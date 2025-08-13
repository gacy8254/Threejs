import { GLTFLoader } from './js/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './js/node_modules/three/examples/jsm/loaders/RGBELoader.js';

const textureLoader = new THREE.TextureLoader();
function loadTexture(path)
{
    const tex = loadTexture(path//,  (texture) => { // 加载成功回调
    //   console.log('贴图加载成功！', texture);
    // },
    // undefined, // 进度回调（可选，一般不需要）
    // (error) => { // 加载失败回调
    //   console.error('贴图加载失败！', error);
    // }
    );

  return tex;
};
const hdrLoader = new RGBELoader();
function loadHDR(path)
{
       const tex = hdrLoader.load('./Images/T_Sky.HDR'//,  (texture) => { // 加载成功回调
//     console.log('贴图加载成功！', texture);
//   },
//   undefined, // 进度回调（可选，一般不需要）
//   (error) => { // 加载失败回调
//     console.error('贴图加载失败！', error);
//   }
);
  return tex;
};

const bodyRampMap = loadTexture('./static/textures/body/ramp.png');
const emissiveMap = loadTexture('./static/textures/body/emissive.png');
const bodyLightMap = loadTexture('./static/textures/body/light.png');
const bodyNormalMap = loadTexture('./static/textures/body/normal.png');
const faceLightMap = loadTexture('./static/wow.png');
const hairLightMap = loadTexture('./static/textures/hair/light.png');
const hairNormalMap = loadTexture('./static/textures/hair/normal.png');
const hairRampMap = loadTexture('./static/textures/hair/ramp.png');
const matcapMap = loadTexture('./static/textures/matcap/metalMap.png');
const skyMap = loadHDR('./Images/T_Sky.HDR');

export default {
  texture: {
    bodyRampMap,
    emissiveMap,
    bodyLightMap,
    bodyNormalMap,
    faceLightMap,
    hairLightMap,
    hairNormalMap,
    hairRampMap,
    matcapMap,
    skyMap,
  },
}