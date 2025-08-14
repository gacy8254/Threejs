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

function addDOFPass(scene, camera, gui, enableControl)
{
	const depthOfFieldEffect = new DepthOfFieldEffect(camera, {
		focusDistance: 0.,
		focalLength: 0.1027,
		bokehScale: 4.0,
		height: 1080
	});

	const depthEffect = new DepthEffect({
		blendFunction: BlendFunction.SKIP
	});

	const vignetteEffect = new VignetteEffect({
		eskil: false,
		offset: 0.35,
		darkness: 0.5
	});

	const cocTextureEffect = new TextureEffect({
		blendFunction: BlendFunction.SKIP,
		texture: depthOfFieldEffect.renderTargetCoC.texture
	});

	const pass = new EffectPass(
		camera,
		depthOfFieldEffect,
		vignetteEffect,
		cocTextureEffect,
		depthEffect
	);
	depthOfFieldEffect.blendMode.opacity.value = 0.;
        if (enableControl)
        {
		    const effectPass = pass;

            const cocMaterial = depthOfFieldEffect.circleOfConfusionMaterial;
            const blendMode = depthOfFieldEffect.blendMode;
            	blendMode.opacity.value = 0.;

            const RenderMode = {
            	DEFAULT: 0,
            	DEPTH: 1,
            	COC: 2
            };

            const params = {
            	"coc": {
            		"edge blur kernel": depthOfFieldEffect.blurPass.kernelSize,
            		"focus": cocMaterial.uniforms.focusDistance.value,
            		"focal length": cocMaterial.uniforms.focalLength.value
            	},
            	"vignette": {
            		"enabled": true,
            		"offset": vignetteEffect.uniforms.get("offset").value,
            		"darkness": vignetteEffect.uniforms.get("darkness").value
            	},
            	"render mode": RenderMode.DEFAULT,
            	"resolution": depthOfFieldEffect.resolution.height,
            	"bokeh scale": depthOfFieldEffect.bokehScale,
            	"opacity": blendMode.opacity.value,
            	"blend mode": blendMode.blendFunction
            };

            function toggleRenderMode() {

            	const mode = Number(params["render mode"]);

            	depthEffect.blendMode.setBlendFunction((mode === RenderMode.DEPTH) ?
            		BlendFunction.NORMAL : BlendFunction.SKIP);
            	cocTextureEffect.blendMode.setBlendFunction((mode === RenderMode.COC) ?
            		BlendFunction.NORMAL : BlendFunction.SKIP);
            	vignetteEffect.blendMode.setBlendFunction((mode === RenderMode.DEFAULT &&
            		params.vignette.enabled) ? BlendFunction.NORMAL : BlendFunction.SKIP);

            	effectPass.encodeOutput = (mode === RenderMode.DEFAULT);
            	effectPass.renderToScreen = (mode !== RenderMode.DEFAULT);

            }
            const dofFolder = gui.addFolder('dof');

            dofFolder.add(params, "render mode", RenderMode).onChange(toggleRenderMode);

            dofFolder.add(params, "resolution", [240, 360, 480, 720, 1080]).onChange((value) => {

            	depthOfFieldEffect.resolution.height = Number(value);

            });

            dofFolder.add(params, "bokeh scale", 1.0, 5.0, 0.001).onChange((value) => {

            	depthOfFieldEffect.bokehScale = value;

            });

            let folder = dofFolder.addFolder("Circle of Confusion");

            folder.add(params.coc, "edge blur kernel", KernelSize).onChange((value) => {

            	depthOfFieldEffect.blurPass.kernelSize = Number(value);

            });

            folder.add(params.coc, "focus", 0.0, 2.0, 0.0001).onChange((value) => {

            	cocMaterial.uniforms.focusDistance.value = value;

            });

            folder.add(params.coc, "focal length", 0.0, 0.5, 0.000001)
            	.onChange((value) => {

            		cocMaterial.uniforms.focalLength.value = value;

            	});

            folder.open();
            folder = dofFolder.addFolder("Vignette");

            folder.add(params.vignette, "enabled").onChange((value) => {

            	vignetteEffect.blendMode.setBlendFunction(value ?
            		BlendFunction.NORMAL : BlendFunction.SKIP);

            });

            folder.add(vignetteEffect, "eskil");

            folder.add(params.vignette, "offset", 0.0, 1.0, 0.001).onChange((value) => {

            	vignetteEffect.uniforms.get("offset").value = value;

            });

            folder.add(params.vignette, "darkness", 0.0, 1.0, 0.001)
            	.onChange((value) => {

            		vignetteEffect.uniforms.get("darkness").value = value;

            	});

            dofFolder.add(params, "opacity", 0.0, 1.0, 0.01).onChange((value) => {

            	blendMode.opacity.value = value;

            });

            dofFolder.add(params, "blend mode", BlendFunction).onChange((value) => {

            	blendMode.setBlendFunction(Number(value));

            });
        }

    return pass;
};

export{addDOFPass};