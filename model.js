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
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './node_modules/three/examples/jsm/loaders/RGBELoader.js';
import CustomShaderMaterial from './node_modules/three-custom-shader-material/vanilla'

import OtherfragmentShader from './shaders/body/fragment.glsl?raw'
import FacefragmentShader from './shaders/face/fragment.glsl?raw'
import outlineFragmentShader from './shaders/outline/fragment.glsl?raw'
import outlineVertexShader from './shaders/outline/vertex.glsl?raw'
import vertexShader from './shaders/vertex.glsl?raw'
import lightFragShader from './shaders/my/light.frag?raw'
import godrayVertShader from './shaders/godray.vert?raw'
import godrayFragShader from './shaders/godray.glsl?raw'

import characterModel from './static/character.glb'
import bodyRampName from './static/images/otherImages/body/ramp.png'
import bodyLightName from './static/images/otherImages/body/light.png'
import wowName from './static/images/otherImages/wow.png'
import hairLightName from './static/images/otherImages/hair/light.png'
import hairRameName from './static/images/otherImages/hair/ramp.png'
import metalName from './static/images/otherImages/metalMap.png'
import fogName from './static/images/otherImages/fog.PNG'
import skyName from './static/images/otherImages/T_Sky.png'

const textureLoader = new THREE.TextureLoader();
const bodyRampMap = textureLoader.load(bodyRampName);
const bodyLightMap = textureLoader.load(bodyLightName);
const faceLightMap = textureLoader.load(wowName);
const hairLightMap = textureLoader.load(hairLightName);
const hairRampMap = textureLoader.load(hairRameName);
const matcapMap = textureLoader.load(metalName);
const fogTex = textureLoader.load(fogName);
const skyMap = textureLoader.load(skyName);

faceLightMap.colorSpace = LinearSRGBColorSpace
faceLightMap.generateMipmaps = false
faceLightMap.flipY = false
hairLightMap.flipY = false
hairLightMap.generateMipmaps = false
hairLightMap.colorSpace = LinearSRGBColorSpace
bodyLightMap.flipY = false
bodyLightMap.generateMipmaps = false
bodyLightMap.colorSpace = LinearSRGBColorSpace
hairRampMap.generateMipmaps = false
hairRampMap.colorSpace = SRGBColorSpace
bodyRampMap.colorSpace = SRGBColorSpace
bodyRampMap.generateMipmaps = false
skyMap.generateMipmaps = false;

fogTex.wrapS = THREE.RepeatWrapping;
fogTex.wrapT = THREE.RepeatWrapping;
fogTex.colorSpace = LinearSRGBColorSpace

const loader = new GLTFLoader();
let godrayMats = new Array();
const materials = new Map();

function loadCharacter(scene, mixer, camera)
{
    loader.load(characterModel, (gltf) => {
    const model = gltf.scene;
    //model.scale.set(0.01, 0.01, 0.01);
    scene.add(model);

    const lightPosition = new THREE.Vector3(1., 1.,-1.0);
    const tintColor = new THREE.Vector3(1, 1.,0.7);
    let globalInst = 0.9;
    mixer._root = model;
    const animations = gltf.animations;
    const actions = {
      Idle: mixer.clipAction( animations[ 0 ] )
    };

    for ( const m in actions ) {
      actions[ m ].enabled = true;
      actions[ m ].setEffectiveTimeScale( 1 );
      actions[ m ].setEffectiveWeight( 1 );
      actions[ m ].play();
    }

    model.traverse((object) => {
    if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        const colorTex = object.material.map;
        let material = object.material;
        if (object.material.name == 'M_Face1')
        {
          material = new  CustomShaderMaterial({  
                                baseMaterial: THREE.MeshStandardMaterial,
                                vertexShader,
                                fragmentShader: FacefragmentShader,
                                transparent: object.material.transparent,
                                side: FrontSide,
                                alphaTest: object.material.alphaTest,
                                uniforms:{
                                  uRampMap :{value:bodyRampMap},
                                  uFaceLightMap :{value:faceLightMap},
                                  uMetalMap :{value:matcapMap},
                                  uLightPosition :{value: new THREE.Vector3(9., 1.,-0.5)},
                                  uForwardVec : {value: new THREE.Vector3(0,0,1)},
                                  uRightVec : {value: new THREE.Vector3(1,0,0)},
                                  uResolution : {value: new THREE.Vector2(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio,)},
                                  uRampVmove : {value : 0.5},
                                  uNoMetallic : {value : 1},
                                  uIntensity : {value : 3},
                                  uIsDay : {value : 0.5},
                                  uHand : {value : false},
                                  uHair : {value : false},
                                  uCloth : {value : false},
                                  uShadowColor : {value : new THREE.Color('white')},
                                  uMetallic : {value : 0.5},
                                  uRimLightWidth : {value : 1},
                                  uRimLightIntensity : {value : 1},
                                  uNear : {value : camera.near},
                                  uFar : {value : camera.far},
                                  uGlobalIntensity : {value : globalInst},
                                  uTintColor : {value : tintColor},
                                },
                                map: colorTex,
                                });
                              
        }
        else if(object.material.name == 'M_Hair1')
        {
                    material = new  CustomShaderMaterial({  
                                baseMaterial: THREE.MeshStandardMaterial,
                                vertexShader,
                                fragmentShader: OtherfragmentShader,
                                depthWrite: object.material.depthWrite,
                                depthTest: object.material.depthTest,
                                transparent: object.material.transparent,
                                side: FrontSide,
                                alphaTest: object.material.alphaTest,
                                uniforms:{
                                  uRampMap :{value:bodyRampMap},
                                  uFaceLightMap :{value:faceLightMap},
                                  uMetalMap :{value:matcapMap},
                                  uLightPosition :{value: lightPosition},
                                  uForwardVec : {value: new THREE.Vector3(0,0,1)},
                                  uRightVec : {value: new THREE.Vector3(1,0,0)},
                                  uResolution : {value: new THREE.Vector2(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio,)},
                                  uRampVmove : {value : 0.5},
                                  uNoMetallic : {value : 1},
                                  uIntensity : {value : 2},
                                  uIsDay : {value : 0.5},
                                  uHair : {value : true},
                                  uCloth : {value : false},
                                  uShadowColor : {value : new THREE.Color('white')},
                                  uMetallic : {value : 0.5},
                                  uRimLightWidth : {value : 1},
                                  uRimLightIntensity : {value : 1},
                                  uNear : {value : camera.near},
                                  uFar : {value : camera.far},
                                  uGlobalIntensity : {value : globalInst},
                                  uTintColor : {value : tintColor},
                                },
                                map: colorTex,
                                });
        }
        else if ( object.material.name == 'M_SchoolUniform1' || object.material.name == 'M_Blue1' || object.material.name == 'M_Black1' || object.material.name == 'red')
        {
            //material = new THREE.MeshToonMaterial({map : colorTex});
                    material = new  CustomShaderMaterial({  
                                baseMaterial: THREE.MeshStandardMaterial,
                                vertexShader,
                                fragmentShader: OtherfragmentShader,
                                depthWrite: object.material.depthWrite,
                                depthTest: object.material.depthTest,
                                transparent: object.material.transparent,
                                side: FrontSide,
                                alphaTest: object.material.alphaTest,
                                uniforms:{
                                  uRampMap :{value:bodyRampMap},
                                  uFaceLightMap :{value:faceLightMap},
                                  uMetalMap :{value:matcapMap},
                                  uLightPosition :{value: lightPosition},
                                  uForwardVec : {value: new THREE.Vector3(0,0,1)},
                                  uRightVec : {value: new THREE.Vector3(1,0,0)},
                                  uResolution : {value: new THREE.Vector2(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio,)},
                                  uRampVmove : {value : 0.5},
                                  uNoMetallic : {value : 1},
                                  uIntensity : {value : 2},
                                  uIsDay : {value : 0.5},
                                  uHand : {value : false},
                                  uHair : {value : false},
                                  uCloth : {value : true},
                                  uShadowColor : {value : new THREE.Color('white')},
                                  uMetallic : {value : 0.5},
                                  uRimLightWidth : {value : 1},
                                  uRimLightIntensity : {value : 1},
                                  uNear : {value : camera.near},
                                  uFar : {value : camera.far},
                                  uGlobalIntensity : {value : globalInst},
                                  uTintColor : {value : tintColor},
                                },
                                map: colorTex,
                                color: object.material.color,
                                });
        }
        else if ( object.material.name == 'M_Body1')
        {
                    material = new  CustomShaderMaterial({  
                                baseMaterial: THREE.MeshStandardMaterial,
                                vertexShader,
                                fragmentShader: OtherfragmentShader,
                                depthWrite: object.material.depthWrite,
                                depthTest: object.material.depthTest,
                                transparent: object.material.transparent,
                                side: FrontSide,
                                alphaTest: object.material.alphaTest,
                                uniforms:{
                                  uRampMap :{value:bodyRampMap},
                                  uFaceLightMap :{value:faceLightMap},
                                  uMetalMap :{value:matcapMap},
                                  uLightPosition :{value: lightPosition},
                                  uForwardVec : {value: new THREE.Vector3(0,0,1)},
                                  uRightVec : {value: new THREE.Vector3(1,0,0)},
                                  uResolution : {value: new THREE.Vector2(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio,)},
                                  uRampVmove : {value : 0.5},
                                  uNoMetallic : {value : 1},
                                  uIntensity : {value : 2},
                                  uIsDay : {value : 0.5},
                                  uHand : {value : false},
                                  uHair : {value : false},
                                  uCloth : {value : false},
                                  uShadowColor : {value : new THREE.Color('white')},
                                  uMetallic : {value : 0.5},
                                  uRimLightWidth : {value : 1},
                                  uRimLightIntensity : {value : 1},
                                  uNear : {value : camera.near},
                                  uFar : {value : camera.far},
                                  uGlobalIntensity : {value : globalInst},
                                  uTintColor : {value : tintColor},
                                },
                                map: colorTex,
                                });
        }
        else if ( object.material.name == 'M_Hand')
        {
                    material = new  CustomShaderMaterial({  
                                baseMaterial: THREE.MeshStandardMaterial,
                                vertexShader,
                                fragmentShader: OtherfragmentShader,
                                depthWrite: object.material.depthWrite,
                                depthTest: object.material.depthTest,
                                transparent: object.material.transparent,
                                side: FrontSide,
                                alphaTest: object.material.alphaTest,
                                uniforms:{
                                  uRampMap :{value:bodyRampMap},
                                  uFaceLightMap :{value:faceLightMap},
                                  uMetalMap :{value:matcapMap},
                                  uLightPosition :{value: lightPosition},
                                  uForwardVec : {value: new THREE.Vector3(0,0,1)},
                                  uRightVec : {value: new THREE.Vector3(1,0,0)},
                                  uResolution : {value: new THREE.Vector2(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio,)},
                                  uRampVmove : {value : 0.5},
                                  uNoMetallic : {value : 1},
                                  uIntensity : {value : 2},
                                  uIsDay : {value : 0.5},
                                  uHand : {value : true},
                                  uHair : {value : false},
                                  uCloth : {value : false},
                                  uShadowColor : {value : new THREE.Color('white')},
                                  uMetallic : {value : 0.5},
                                  uRimLightWidth : {value : 1},
                                  uRimLightIntensity : {value : 1},
                                  uNear : {value : camera.near},
                                  uFar : {value : camera.far},
                                  uGlobalIntensity : {value : globalInst},
                                  uTintColor : {value : tintColor},
                                },
                                map: colorTex,
                                });
        }
        else if ( object.material.name == 'M_Eye1')
        {
          material = new  CustomShaderMaterial({  
                      baseMaterial: THREE.MeshStandardMaterial,
                      vertexShader,
                      fragmentShader: OtherfragmentShader,
                      depthWrite: object.material.depthWrite,
                      depthTest: object.material.depthTest,
                      transparent: object.material.transparent,
                      side: FrontSide,
                      alphaTest: object.material.alphaTest,
                      uniforms:{
                        uRampMap :{value:bodyRampMap},
                        uFaceLightMap :{value:faceLightMap},
                        uMetalMap :{value:matcapMap},
                        uLightPosition :{value: lightPosition},
                        uForwardVec : {value: new THREE.Vector3(0,0,1)},
                        uRightVec : {value: new THREE.Vector3(1,0,0)},
                        uResolution : {value: new THREE.Vector2(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio,)},
                        uRampVmove : {value : 0.5},
                        uNoMetallic : {value : 1},
                        uIntensity : {value : 2},
                        uIsDay : {value : 0.5},
                        uHand : {value : false},
                        uHair : {value : false},
                        uCloth : {value : false},
                        uShadowColor : {value : new THREE.Color('white')},
                        uMetallic : {value : 0.5},
                        uRimLightWidth : {value : 1},
                        uRimLightIntensity : {value : 1},
                        uNear : {value : camera.near},
                        uFar : {value : camera.far},
                        uGlobalIntensity : {value : globalInst},
                                  uTintColor : {value : tintColor},
                      },
                      map: colorTex,
                      });
        }
        else{
          console.log('unknow material');
          console.log(material.name);
        }

          object.material = material;
      }
      });
            
}, undefined, (error) => {
            console.error('模型加载错误:', error);
});
}

function loadScene(file, scene, gui, bloomEffect, enableCon)
{
    const sceneControls = {
    // 初始颜色：从材质中获取十六进制值（如 0x00ff00）
    scale : 0.025,
    rotateX : 0,
    rotateY : -1050,
    rotateZ : 0,
    positionX : 2.35,
    positionY : -0.3,
    positionZ : 1.3,
};

    loader.load(file, (gltf) => {
    let sceneModle = gltf.scene;
    scene.add(sceneModle);

    function onChanged(newValue)
    {
        sceneModle.scale.set(sceneControls.scale, sceneControls.scale, sceneControls.scale);
        sceneModle.position.set(sceneControls.positionX, sceneControls.positionY, sceneControls.positionZ);
        sceneModle.rotation.set(sceneControls.rotateX / 360.0, sceneControls.rotateY / 360.0, sceneControls.rotateZ / 360.0);
    }
    onChanged();

    if(enableCon)
    {
      const sceneFolder = gui.addFolder("scene");
      sceneFolder.add(sceneControls, 'scale').name('scale').min(-10).max(10).step(0.1).onChange(onChanged);
      sceneFolder.add(sceneControls, 'rotateY').name('rotateY').onChange(onChanged);
      sceneFolder.add(sceneControls, 'positionX').name('positionX').min(-20).max(20).step(0.005).onChange(onChanged);
      sceneFolder.add(sceneControls, 'positionY').name('positionY').min(-20).max(20).step(0.005).onChange(onChanged);
      sceneFolder.add(sceneControls, 'positionZ').name('positionZ').min(-20).max(20).step(0.005).onChange(onChanged);
    }

    sceneModle.traverse((object) => {
    if (object.isMesh) {
        object.visible = true;
        bloomEffect.selection.toggle(object);
        object.castShadow = true;
        object.receiveShadow = true;
        const colorTex = object.material.map;

        let material = object.material;
        if ( object.material.name == 'glass')
        {
          if (materials.has(object.material.name))
          {
            material = materials.get(object.material.name);
          }
          else{
            material = new  THREE.MeshPhysicalMaterial({
                          transparent: true,
                          metalness: 0.2,//玻璃非金属  金属度设置0
                          roughness: 0.1,//玻璃表面光滑  
                          envMapIntensity:1.0,
                          transmission:0.9,//透射度(透光率)
                          envMap : skyMap,
                          ior:1.5,//折射率
                        });
            materials.set(object.material.name, material);
          }

          object.castShadow = false;
          object.receiveShadow = false;
        }
        else if ( object.material.name == 'godray_card_MI')
        {
          bloomEffect.selection.toggle(object);
          if (materials.has(object.material.name))
          {
            material = materials.get(object.material.name);
          }
          else{
          material = new  CustomShaderMaterial({
                          baseMaterial : THREE.MeshBasicMaterial,
                          transparent: true,
                          side : 1,
                          blending : THREE.AdditiveBlending,
                          vertexShader : godrayVertShader,
                          fragmentShader : godrayFragShader,
                            depthWrite: false, // 关闭深度写入
                          uniforms : {
                            uMaskTex : {value : fogTex},
                            uLightShiftTex : {value : fogTex},
                            uDetailIntensity : {value : 1.},
                            uDetailTexTiling : {value : new THREE.Vector2(0.403, 1.6644)},
                            uDetailTexSpeed : {value : new THREE.Vector2(0.000744, 0.006308)},
                            uStreaksAmountMultiplier : {value : 4.0},
                            uStreaksLengthMultiplier : {value : 8.0},
                            uStreaksStrength : {value : 0.4},
                            ucylindricalfalloffexponent : {value : 4.0},
                            uOverallContrast : {value : 0.0},
                            uOverallIntensity : {value : 2.269906},
                            uFalloffMidpoint : {value : 0.5},
                            uFalloffExponent : {value : 1.15},
                            uFalloffStrength : {value : 1},
                            uDepthFade : {value : 300.},
                            uFresnelExponent : {value : 0.175},
                            uTintColor : {value : new THREE.Vector4(1,1,1,1)},
                          },
                      });
            materials.set(object.material.name, material);
          }

          object.castShadow = false;
          object.receiveShadow = false;
          object.depthWrite = false;
          object.depthTest = true;
          godrayMats.push(material);
        }
        else if(object.material.name == 'MI_Wood_Veneer_Wall_Panels_vlskbcz_2K')
        {
          if (materials.has(object.material.name))
          {
            material = materials.get(object.material.name);
          }
          else{
            material.roughness = 1.0;

            materials.set(object.material.name, material);
          }
        }
        else if(object.material.name == 'MI_Book3')
        {
          if (materials.has(object.material.name))
          {
            material = materials.get(object.material.name);
          }
          else{
          material = new  THREE.MeshStandardMaterial({
            map : colorTex,
            emissiveMap: colorTex,
            emissive:0xffffff,
            emissiveIntensity : 1,
            });

            materials.set(object.material.name, material);
          }
        }
        else if(object.material.name == 'M_OutLine')
        {
          bloomEffect.selection.toggle(object);
          if (materials.has(object.material.name))
          {
            material = materials.get(object.material.name);
          }
          else{
          material = new  THREE.MeshBasicMaterial({
            color: new THREE.Color(0,0,0),
            transparent: true,
            opacity: 1.
            });

            materials.set(object.material.name, material);
          }

          object.castShadow = false;
          object.receiveShadow = false;
        }
        else if(object.material.name == 'MI_Sky_Inst')
        {
          bloomEffect.selection.toggle(object);
          material = new  THREE.MeshBasicMaterial({
            map: skyMap,
          });
          object.castShadow = false;
          object.receiveShadow = false;
        }
        else if(object.material.name == 'MI_Box')
        {
          console.log(object.material.map);
        }
        else 
        {
          if (materials.has(object.material.name))
          {
            material = materials.get(object.material.name);
          }
          else{
          material = new THREE.MeshPhongMaterial({map : colorTex,
            color : object.material.color
          });

            materials.set(object.material.name, material);
          }


        }

        if (object.material.name == 'MI_Wall2')
        {
          object.castShadow = false;
          object.receiveShadow = false;
        }
        object.material = material;

      }
      });
            
}, undefined, (error) => {
            console.error('模型加载错误:', error);
});
}

function updateMaterial(time, depthTex)
{
  for (let i = 0; i < godrayMats.length; i++)
  {
    godrayMats[i].uniforms.uTime = {value :time};
  }
}
export{loadCharacter, loadScene, updateMaterial};