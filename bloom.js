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
} from "postprocessing";

function addBloomPass(scene, camera, gui, enableControl)
{
	const effect = new SelectiveBloomEffect(scene, camera, {
		blendFunction: BlendFunction.ADD,
		mipmapBlur: true,
		luminanceThreshold: 0.4,
		luminanceSmoothing: 0.094,
		intensity: 1.53
	});
    effect.inverted = false; 
    effect.mipmapBlurPass.radius = 0.85;
    const pass = new EffectPass(camera, effect);

	const blendMode = effect.blendMode;

	const params = {
		"intensity": effect.intensity,
		"radius": effect.mipmapBlurPass.radius,
		"luminance": {
			"filter": effect.luminancePass.enabled,
			"threshold": effect.luminanceMaterial.threshold,
			"smoothing": effect.luminanceMaterial.smoothing
		},
		"selection": {
			"inverted": effect.inverted,
			"ignore bg": effect.ignoreBackground
		},
		"opacity": blendMode.opacity.value,
		"blend mode": blendMode.blendFunction
	};
    if (enableControl)
    {
        const bloomFolder = gui.addFolder('bloom _');

        bloomFolder.add(params, "intensity", 0.0, 10.0, 0.01).onChange((value) => {

        	effect.intensity = Number(value);

        });

        bloomFolder.add(params, "radius", 0.0, 1.0, 0.001).onChange((value) => {

        	effect.mipmapBlurPass.radius = Number(value);

        });

        let folder = bloomFolder.addFolder("Luminance");

        folder.add(params.luminance, "filter").onChange((value) => {

        	effect.luminancePass.enabled = value;

        });

        folder.add(params.luminance, "threshold", 0.0, 1.0, 0.001)
        	.onChange((value) => {

        		effect.luminanceMaterial.threshold = Number(value);

        	});

        folder.add(params.luminance, "smoothing", 0.0, 1.0, 0.001)
        	.onChange((value) => {

        		effect.luminanceMaterial.smoothing = Number(value);

        	});

        folder.open();
        folder = bloomFolder.addFolder("Selection");

        folder.add(params.selection, "inverted").onChange((value) => {

        	effect.inverted = value;

        });

        folder.add(params.selection, "ignore bg").onChange((value) => {

        	effect.ignoreBackground = value;

        });

        folder.open();

        bloomFolder.add(params, "opacity", 0.0, 1.0, 0.01).onChange((value) => {

        	blendMode.opacity.value = value;

        });

        bloomFolder.add(params, "blend mode", BlendFunction).onChange((value) => {

        	blendMode.setBlendFunction(Number(value));
        });

        bloomFolder.add(pass, "dithering").onChange((value) => {

        	pass.dithering = value;

        });
    }
        	//blendMode.opacity.value = 0.;

    return pass;
};

export{addBloomPass};