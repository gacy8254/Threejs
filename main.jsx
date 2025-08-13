// main.js
import * as THREE from './node_modules/three/build/three.module.js';
import {
  BackSide,
  Color,
  FrontSide,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  Uniform,
  Vector2,
  Vector3,
  AnimationMixer,
} from 'three'
import {
  EffectComposer, 
  RenderPass,
  SMAAEffect,
  EffectPass,
	SMAAPreset,
} from "postprocessing";

import Stats from 'stats.js';

import {addBloomPass} from './bloom.js';
import {addDOFPass} from './dof.js';
import {addParticle,updateParticle } from './particle.js';
import {addLights } from './light.js';
import {loadCharacter, loadScene, updateMaterial } from './model.js';
import {CustomRenderPass} from './customRenderpass.js';

import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './node_modules/three/examples/jsm/loaders/RGBELoader.js';
import { LUT3dlLoader } from './node_modules/three/examples/jsm/loaders/LUT3dlLoader.js';
import { LUTCubeLoader } from './node_modules/three/examples/jsm/loaders/LUTCubeLoader.js';
import { GTAOPass } from './node_modules/three/examples/jsm/postprocessing/GTAOPass.js';
import { BokehPass } from './node_modules/three/examples/jsm/postprocessing/BokehPass.js';
import { LUTPass } from './node_modules/three/examples/jsm/postprocessing/LUTPass.js';
import { OutputPass } from './node_modules/three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from './node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from './node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from './node_modules/three/examples/jsm/postprocessing/SMAAPass.js';
import { OutlinePass } from './node_modules/three/examples/jsm/postprocessing/OutlinePass.js';

import CustomShaderMaterial from './node_modules/three-custom-shader-material/vanilla'

import toonVertShader from './shaders/my/toon.vert?raw'
import toonFragShader from './shaders/my/toon.frag?raw'

import { GUI } from 'dat.gui';
import { addColorGradingPass, last, next } from './colorGrading.js';

import sceneModel from './static/japan.glb'
import transModel from './static/transparent.glb'


let mixer = new THREE.AnimationMixer();;
let colorGradingPass;

const enableCon = true;
const gui = new GUI;
//gui.dom.style.zIndex = '1';

// const stats = new Stats();

// // 配置面板（可选）：
// stats.showPanel(0); 

// stats.dom.style.position = 'fixed';
// stats.dom.style.left = '10px';   // 左侧偏移
// stats.dom.style.bottom = '10px'; // 底部偏移（原默认是 top:0）
// stats.dom.style.top = 'auto';    // 覆盖默认的 top:0

// document.body.appendChild(stats.dom);

// 1. 创建场景
const scene = new THREE.Scene();
const transScene = new THREE.Scene();

addLights(scene, gui, enableCon);

// 2. 创建透视相机
const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.z = 1.54662038;
camera.position.y = 1.18431981494;
camera.position.x = -0.0930;

// 3. 创建 WebGL 渲染器
const renderer  = new THREE.WebGLRenderer({
	powerPreference: "high-performance",
	antialias: false,
	stencil: false,
	depth: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMapSoft = true;
document.body.appendChild(renderer.domElement);
renderer.domElement.style.width = `${window.innerWidth}px`; // CSS 尺寸保持屏幕物理尺寸
renderer.domElement.style.height = `${window.innerHeight}px`;

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set(0, 1.2, 0);
// controls.enableZoom = false;
// controls.enablePan = false;
// controls.minAzimuthAngle = -Math.PI / 5.;
// controls.maxAzimuthAngle = Math.PI / 5.;
// controls.minPolarAngle = 0.7;
// controls.maxPolarAngle = Math.PI / 1.8;
const 			clock = new THREE.Clock();

const composer = new EffectComposer(renderer);
const basePass = new RenderPass(scene, camera);
const bloomPass = addBloomPass(scene, camera, gui, enableCon);
const dofPass = addDOFPass(scene, camera, gui, enableCon);
const transparentPass = new CustomRenderPass(transScene, camera);
const smaaEffect = new SMAAEffect();
const smaaPass = new EffectPass(camera, smaaEffect);

basePass.renderToScreen = false;

dofPass.renderToScreen = false;

//transparentPass.setDepthTexture(basePass.getDepthTexture());
transparentPass.clear = false;
transparentPass.needsDepthTexture = true;

composer.addPass(basePass);
composer.addPass(dofPass);
composer.addPass(bloomPass);
composer.addPass(transparentPass);
composer.addPass(smaaPass);

dofPass.needsSwap = true;
bloomPass.needsSwap = true;
transparentPass.renderToScreen = false;
bloomPass.renderToScreen = false;

addColorGradingPass(scene, camera, renderer, composer, gui, enableCon);
loadCharacter(scene, mixer, camera);
loadScene(sceneModel, scene, gui, bloomPass.effects[0], enableCon);
loadScene(transModel, transScene, gui, bloomPass.effects[0], false);
addParticle(scene);

   window.addEventListener('keydown', (event) => {
            if (event.code == 'KeyN')
            {
              last();
            }
            else if(event.code == 'KeyM')
            {
              next();
            }
        });

// 5. 动画循环
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  updateParticle(delta);
  updateMaterial(clock.getElapsedTime(), basePass.getDepthTexture());
  mixer.update(delta);
  controls.update();
  composer.render();
  //renderer.render(scene, camera);
  //stats.update(); 
}
animate();