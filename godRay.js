import * as THREE from './node_modules/three/build/three.module.js';
import {
	BlendFunction,
	EdgeDetectionMode,
	SelectiveBloomEffect,
	SMAAEffect,
	SMAAPreset,
	SMAAImageLoader,
  BloomEffect, 
  EffectComposer, 
  EffectPass, 
  RenderPass,
DepthOfFieldEffect,
DepthEffect,
VignetteEffect,
TextureEffect,
KernelSize,
GodRaysEffect,
} from "postprocessing";

import { GodraysPass } from 'three-good-godrays';

function addGodRayPass(scene, camera, light, gui, enableControl)
{
    const params = {
        density: 1 / 128,
        maxDensity: 0.5,
        edgeStrength: 2,
        edgeRadius: 2,
        distanceAttenuation: 2,
        color: new THREE.Color(0xffffff),
        raymarchSteps: 60,
        blur: true,
        gammaCorrection: true,
    };

    const lightPos = new THREE.Vector3(0, 20, 0);
const pointLight = new THREE.PointLight(0xffffff, 1, 10000);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.autoUpdate = true;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 1000;
pointLight.shadow.camera.updateProjectionMatrix();
pointLight.position.copy(lightPos);
scene.add(pointLight);

    const pass = new GodraysPass(pointLight, camera, params);
pass.renderToScreen = true;
    if (enableControl)
    {
        let mainFolder = gui.addFolder('god ray');

		mainFolder.add(params, "density")
			.onChange((value) => {
				params.density = value;
			});
		mainFolder.add(params, "maxDensity")
			.onChange((value) => {
				params.maxDensity = value;
			});
		mainFolder.add(params, "edgeStrength")
			.onChange((value) => {
				params.edgeStrength = value;
			});
		mainFolder.add(params, "edgeRadius")
			.onChange((value) => {
				params.edgeRadius = value;
			});
		mainFolder.add(params, "distanceAttenuation")
			.onChange((value) => {
				params.distanceAttenuation = value;
			});
		mainFolder.addColor(params, "color")
			.onChange((value) => {
				params.color = value;
			});
		mainFolder.add(params, "raymarchSteps")
			.onChange((value) => {
				params.raymarchSteps = value;
			});
		mainFolder.add(params, "blur")
			.onChange((value) => {
				params.blur = value;
			});
		mainFolder.add(params, "gammaCorrection")
			.onChange((value) => {
				params.gammaCorrection = value;
			});
    }

    return pass;
};

export{addGodRayPass};