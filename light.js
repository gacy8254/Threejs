import * as THREE from './node_modules/three/build/three.module.js';

function addLights(scene, gui, enableHelper)
{
    const dirLight = new THREE.DirectionalLight(0xefcac2, 100.);
    scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.position.set(16, 4.9, -8.9);
    dirLight.intensity = 30;
    dirLight.target.position.set(0., 1, 1.5);
    dirLight.shadow.mapSize.set(1024, 1024);

    const shadowCamera = dirLight.shadow.camera;
    shadowCamera.left = -10;
    shadowCamera.right = 10;
    shadowCamera.top = 10;
    shadowCamera.bottom = -10;
    shadowCamera.near = 0.0001;
    shadowCamera.far = 20;

    const ambinetLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambinetLight);

    const pointLight = new THREE.PointLight(0xffffff, 9.2, 0); // 颜色, 强度, 距离
    scene.add(pointLight);
    pointLight.position.set(1.2, 2., -0.6);
    pointLight.intensity = 3;

    if (enableHelper)
    {
        const dirHelper = new THREE.DirectionalLightHelper(dirLight, 3);
        scene.add(dirHelper);
        // const helper = new THREE.CameraHelper( dirLight.shadow.camera );
        // scene.add( helper );

        const pointHelper = new THREE.PointLightHelper(pointLight);
        scene.add(pointHelper);

        	const params = {
		"dir": {
		    "dirPosx": dirLight.position.x,
		    "dirPosy": dirLight.position.y,
		    "dirPosz": dirLight.position.z,
		    "dirIntensity": dirLight.intensity,
		},
		"point": {
			"pointPosx": pointLight.position.x,
			"pointPosy": pointLight.position.y,
			"pointPosz": pointLight.position.z,
			"pointIntensity": pointLight.intensity
		},
	};

    const lightFolder = gui.addFolder('lights');

    let folder = lightFolder.addFolder("dir light");
    folder.add(params.dir, "dirPosx").onChange((value) => {
        dirLight.position.x = value;
    });
    folder.add(params.dir, "dirPosy").onChange((value) => {
        dirLight.position.y = value;
    });
    folder.add(params.dir, "dirPosz").onChange((value) => {
        dirLight.position.z = value;
    });
    folder.add(params.dir, "dirIntensity").onChange((value) => {
        dirLight.intensity = value;
    });

    folder = lightFolder.addFolder("point light");
    folder.add(params.point, "pointPosx").onChange((value) => {
        pointLight.position.x = value;
    });
    folder.add(params.point, "pointPosy").onChange((value) => {
        pointLight.position.y = value;
    });
    folder.add(params.point, "pointPosz").onChange((value) => {
        pointLight.position.z = value;
    });
    folder.add(params.point, "pointIntensity").onChange((value) => {
        pointLight.intensity = value;
    });
    }


    return dirLight;
}

export {addLights};