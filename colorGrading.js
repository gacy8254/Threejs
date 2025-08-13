import {
	BlendFunction,
	BrightnessContrastEffect,
	ColorAverageEffect,
	LUT3DEffect,
	EdgeDetectionMode,
	EffectPass,
	HueSaturationEffect,
	LookupTexture3D,
	LUT3dlLoader,
	LUTCubeLoader,
	RawImageData,
	SepiaEffect,
	SMAAEffect,
	SMAAImageLoader,
	SMAAPreset
} from "postprocessing";

import {
	ClampToEdgeWrapping,
	Color,
	LinearFilter,
	PerspectiveCamera,
	TextureLoader
} from "three";
    let assets = new Map();

	
let luts = new Map([
		["neutral-2", null],
		["neutral-4", null],
		["neutral-8", null],
		["png/bleach-bypass", "png/bleach-bypass.png"],
		["png/candle-light", "png/candle-light.png"],
		["png/cool-contrast", "png/cool-contrast.png"],
		["png/warm-contrast", "png/warm-contrast.png"],
		["png/desaturated-fog", "png/desaturated-fog.png"],
		["png/evening", "png/evening.png"],
		["png/fall", "png/fall.png"],
		["png/filmic1", "png/filmic1.png"],
		["png/filmic2", "png/filmic2.png"],
		["png/matrix-green", "png/matrix-green.png"],
		["png/strong-amber", "png/strong-amber.png"],
		["3dl/cinematic", "3dl/presetpro-cinematic.3dl"],
		["cube/cinematic", "cube/presetpro-cinematic.cube"],
		["cube/django-25", "cube/django-25.cube"]
	]);

function load()
{
    const textureLoader = new TextureLoader();
	const lut3dlLoader = new LUT3dlLoader();
	const lutCubeLoader = new LUTCubeLoader();


    // 只处理非 null 的条目
    const entriesToLoad = Array.from(luts.entries()).filter(([_, path]) => path !== null);

    // 将每个加载任务封装成一个 Promise
    const loadPromises = entriesToLoad.map(([key, path]) => {
        return new Promise((resolve, reject) => {
            let loader;
            let fullPath = `./static/images/lut/${path}`;

            if (path.endsWith('.3dl')) {
                loader = lut3dlLoader;
            } else if (path.endsWith('.cube')) {
                loader = lutCubeLoader;
            } else {
                loader = textureLoader;
            }

            loader.load(
                fullPath,
                // 成功回调
                (texture) => {
                    texture.name = key;

                    if (!path.endsWith('.3dl') && !path.endsWith('.cube')) {
                        // 针对普通纹理设置参数
                        texture.generateMipmaps = false;
                        texture.minFilter = LinearFilter;
                        texture.magFilter = LinearFilter;
                        texture.wrapS = ClampToEdgeWrapping;
                        texture.wrapT = ClampToEdgeWrapping;
                        texture.flipY = false;
                    }

                    assets.set(key, texture);
                    resolve(texture);
                },
                // 进度回调（可选）
                undefined,
                // 错误回调
                (error) => {
                    console.error(`加载失败: ${key} (${fullPath})`);
                    console.error(error);
                    reject(error);
                }
            );
        });
    });

    // 等待所有加载完成
    return Promise.all(loadPromises);
}

function addColorGradingPass(scene, camera, renderer, composer, gui, enableControl)
{
    const texture = load().then(() => {
	const capabilities = renderer.capabilities;
	const colorAverageEffect = new ColorAverageEffect(BlendFunction.SKIP);
	const sepiaEffect = new SepiaEffect({ blendFunction: BlendFunction.SKIP });

	const brightnessContrastEffect = new BrightnessContrastEffect({
		blendFunction: BlendFunction.SKIP
	});

	const hueSaturationEffect = new HueSaturationEffect({
		blendFunction: BlendFunction.SKIP,
		saturation: 0.4,
		hue: 0.0
	});
    const lutNeutral2 = LookupTexture3D.createNeutral(2);
	lutNeutral2.name = "neutral-2";
	assets.set(lutNeutral2.name, lutNeutral2);

	const lutNeutral4 = LookupTexture3D.createNeutral(4);
	lutNeutral4.name = "neutral-4";
	assets.set(lutNeutral4.name, lutNeutral4);

	const lutNeutral8 = LookupTexture3D.createNeutral(8);
	lutNeutral8.name = "neutral-8";
	assets.set(lutNeutral8.name, lutNeutral8);

	const lut = LookupTexture3D.from(assets.get("png/filmic1"));
	const lutEffect = capabilities.isWebGL2 ? new LUT3DEffect(lut) :
	new LUT3DEffect(lut.convertToUint8().toDataTexture());

	// lutEffect.inputColorSpace = LinearSRGBColorSpace; // Debug
	const pass = new EffectPass(camera,
		colorAverageEffect,
		sepiaEffect,
		brightnessContrastEffect,
		hueSaturationEffect,
		lutEffect
	);

        if (enableControl)
        {
		const params = {
			colorAverage: {
				"opacity": colorAverageEffect.blendMode.opacity.value,
				"blend mode": colorAverageEffect.blendMode.blendFunction
			},
			sepia: {
				"opacity": sepiaEffect.blendMode.opacity.value,
				"blend mode": sepiaEffect.blendMode.blendFunction
			},
			brightnessContrast: {
				"brightness": brightnessContrastEffect.uniforms.get("brightness").value,
				"contrast": brightnessContrastEffect.uniforms.get("contrast").value,
				"opacity": brightnessContrastEffect.blendMode.opacity.value,
				"blend mode": brightnessContrastEffect.blendMode.blendFunction
			},
			hueSaturation: {
				"hue": 0.0,
				"saturation": hueSaturationEffect.uniforms.get("saturation").value,
				"opacity": hueSaturationEffect.blendMode.opacity.value,
				"blend mode": hueSaturationEffect.blendMode.blendFunction
			},
			lut: {
				"LUT": lutEffect.getLUT().name,
				"base size": lutEffect.getLUT().image.width,
				"3D texture": true,
				"tetrahedral filter": false,
				"scale up": false,
				"target size": 48,
				"show LUT": false,
				"opacity": lutEffect.blendMode.opacity.value,
				"blend mode": lutEffect.blendMode.blendFunction
			}
		};

		let objectURL = null;

		function changeLUT() {

			const original = assets.get(params.lut.LUT);
			const size = Math.min(original.image.width, original.image.height);
			const targetSize = params.lut["target size"];
			const scaleUp = params.lut["scale up"] && (targetSize > size);

			let promise;

			if(scaleUp) {

				const lut = original.isLookupTexture3D ? original :
					LookupTexture3D.from(original);

				console.time("Tetrahedral Upscaling");
				promise = lut.scaleUp(targetSize, false);
				document.body.classList.add("progress");

			} else {

				promise = Promise.resolve(LookupTexture3D.from(original));

			}

			promise.then((lut) => {

				if(scaleUp) {

					console.timeEnd("Tetrahedral Upscaling");
					document.body.classList.remove("progress");

				}

				lutEffect.getLUT().dispose();
				params.lut["base size"] = size;

				if(capabilities.isWebGL2) {

					if(context.getExtension("OES_texture_float_linear") === null) {

						console.log("Linear float filtering not supported, " +
							"converting to Uint8");

						lut.convertToUint8();

					}

					lutEffect.setLUT(params.lut["3D texture"] ?
						lut : lut.toDataTexture());

				} else {

					lutEffect.setLUT(lut.convertToUint8().toDataTexture());

				}

				updateLUTPreview();

			}).catch((error) => console.error(error));

		}

		const infoOptions = [];
		let ff = gui.addFolder('color grading');

		let f = ff.addFolder("Color Average");

		f.add(params.colorAverage, "opacity", 0.0, 1.0, 0.01).onChange((value) => {

			colorAverageEffect.blendMode.opacity.value = value;

		});

		f.add(params.colorAverage, "blend mode", BlendFunction)
			.onChange((value) => {

				colorAverageEffect.blendMode.setBlendFunction(Number(value));

			});

		f = ff.addFolder("Sepia");

		f.add(params.sepia, "opacity", 0.0, 1.0, 0.01).onChange((value) => {

			sepiaEffect.blendMode.opacity.value = value;

		});

		f.add(params.sepia, "blend mode", BlendFunction).onChange((value) => {

			sepiaEffect.blendMode.setBlendFunction(Number(value));

		});

		f = ff.addFolder("Brightness & Contrast");

		f.add(params.brightnessContrast, "brightness", -1.0, 1.0, 0.001)
			.onChange((value) => {

				brightnessContrastEffect.uniforms.get("brightness").value = value;

			});

		f.add(params.brightnessContrast, "contrast", -1.0, 1.0, 0.001)
			.onChange((value) => {

				brightnessContrastEffect.uniforms.get("contrast").value = value;

			});

		f.add(params.brightnessContrast, "opacity", 0.0, 1.0, 0.01)
			.onChange((value) => {

				brightnessContrastEffect.blendMode.opacity.value = value;

			});

		f.add(params.brightnessContrast, "blend mode", BlendFunction)
			.onChange((value) => {

				brightnessContrastEffect.blendMode.setBlendFunction(Number(value));

			});

		f = ff.addFolder("Hue & Saturation");

		f.add(params.hueSaturation, "hue", 0.0, Math.PI * 2.0, 0.001)
			.onChange((value) => {

				hueSaturationEffect.setHue(value);

			});

		f.add(params.hueSaturation, "saturation", -1.0, 1.0, 0.001)
			.onChange((value) => {

				hueSaturationEffect.uniforms.get("saturation").value = value;

			});

		f.add(params.hueSaturation, "opacity", 0.0, 1.0, 0.01)
			.onChange((value) => {

				hueSaturationEffect.blendMode.opacity.value = value;

			});

		f.add(params.hueSaturation, "blend mode", BlendFunction)
			.onChange((value) => {

				hueSaturationEffect.blendMode.setBlendFunction(Number(value));

			});

		f = ff.addFolder("Lookup Texture 3D");

		f.add(params.lut, "LUT", [...luts.keys()]).onChange(changeLUT);

		infoOptions.push(f.add(params.lut, "base size").listen());

		if(capabilities.isWebGL2) {

			f.add(params.lut, "3D texture").onChange(changeLUT);
			f.add(params.lut, "tetrahedral filter").onChange((value) => {

				lutEffect.setTetrahedralInterpolationEnabled(value);

			});

		}

		f.add(params.lut, "scale up").onChange(changeLUT);
		f.add(params.lut, "target size", [32, 48, 64, 96, 128]).onChange(changeLUT);

		f.add(params.lut, "opacity", 0.0, 1.0, 0.01).onChange((value) => {

			lutEffect.blendMode.opacity.value = value;

		});

		f.add(params.lut, "blend mode", BlendFunction).onChange((value) => {

			lutEffect.blendMode.setBlendFunction(Number(value));

		});

		f.open();

		for(const option of infoOptions) {

			option.domElement.style.pointerEvents = "none";

		}

        }

    composer.addPass(pass);

	});

};

export{addColorGradingPass};