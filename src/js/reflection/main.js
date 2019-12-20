import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import SimplexNoise from 'simplex-noise';

import * as h from './_help'

export default function reflection() {

	let cfg = {
		fps: 60,
		cam: {
			x: 150,
			y: 0,
			z: 0,
			viewAngle: 45,
			width: window.innerWidth,
			height: window.innerHeight,
			near: 1,
			far: 800,
		},
		ray: {
			x: -255,
			y: 0,
			z: 0,
			color: 0x2d1fda,
			colorReflection: 0x2d1fda,
			width: 100,
			height: 290,
			intensity: 20,
		},
		ground: {
			texture: 'water',
			width: 512,
			height: 512,
			x: 0,
			y: -50,
			z: 0,
		}
	};

	var waveMesh, wavePlane, waveMaterial, clock;
	var worldWidth = 20, worldDepth = 20;

	let NEAR = 1,
	FAR = 800,
	camera, cubeCamera, scene, renderer,
	controls,
	groundPlane, groundMesh,

	sooqa,

	stats,
	statsEnabled = true,

	param = {};

	init();
	animate();

	function init() {

		// CORE BEGIN ----------------------------------------------------------------------------
		var container = document.getElementById('jsReflection');


		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(cfg.cam.width, cfg.cam.height);
		container.appendChild(renderer.domElement);

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(cfg.cam.viewAngle, cfg.cam.width / cfg.cam.height, cfg.cam.near, cfg.cam.far);
		camera.position.set(cfg.cam.x, cfg.cam.y, cfg.cam.z);

		controls = new OrbitControls(camera, renderer.domElement);

		controls.target.set(0, -10, 0);
		controls.maxPolarAngle = Math.PI / 2
		controls.enableRotate = true;
		controls.enableZoom = false;
		controls.enablePan = false;
		controls.enableDamping = true;
		controls.dampingFactor = 0.01;
		controls.rotateSpeed = 0.2;
		// controls.screenSpacePanning = false;

		controls.dispose();
		controls.update();

		// cube camera for environment map
		cubeCamera = new THREE.CubeCamera(1, 256, 256);
		cubeCamera.renderTarget.texture.generateMipmaps = true;
		cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
		cubeCamera.renderTarget.texture.mapping = THREE.CubeReflectionMapping;
		scene.add(cubeCamera);

		clock = new THREE.Clock();

		var loader = new THREE.TextureLoader();

		if (statsEnabled) {
			stats = new Stats();
			container.appendChild(stats.dom);
		}
		// CORE END ----------------------------------------------------------------------------



		// RAY BEGIN ----------------------------------------------------------------------------
		let ray = new THREE.RectAreaLight(cfg.ray.color, cfg.ray.intensity, cfg.ray.width, cfg.ray.height);
		ray.position.set(cfg.ray.x, cfg.ray.y, cfg.ray.z);
		ray.lookAt(0, 0, 0);
		scene.add(ray);

		var rectLightMesh = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(),
			new THREE.MeshBasicMaterial({
				color: cfg.ray.color,
				side: THREE.BackSide,
			})
			);
		rectLightMesh.scale.x = ray.width;
		rectLightMesh.scale.y = ray.height;
		ray.add(rectLightMesh);

		RectAreaLightUniformsLib.init();

		var ambient = new THREE.AmbientLight(cfg.ray.color, 0.01);
		scene.add(ambient);
		// RAY END ----------------------------------------------------------------------------



		// GROUND BEGIN ( with box projected environment mapping )--------------------------------
		var rMap = loader.load(`img/textures/${cfg.ground.texture}.jpg`);
		rMap.wrapS = rMap.wrapT = THREE.RepeatWrapping;
		THREE.RepeatWrapping;
		rMap.repeat.set(1, 1);
		var defaultMat = new THREE.MeshPhysicalMaterial({
			roughness: 1,
			envMap: cubeCamera.renderTarget.texture,
			roughnessMap: rMap
		});
		var boxProjectedMat = new THREE.MeshPhysicalMaterial({
			color: new THREE.Color(cfg.ray.colorReflection),
			roughness: 0.75,
			envMap: cubeCamera.renderTarget.texture,
			roughnessMap: rMap
		});
		boxProjectedMat.onBeforeCompile = function (shader) {
			//these parameters are for the cubeCamera texture
			shader.uniforms.cubeMapSize = { value: new THREE.Vector3(0, 0, 0) };
			shader.uniforms.cubeMapPos = { value: new THREE.Vector3(0, 0, 0) };
			shader.uniforms.flipEnvMap.value = true;
			//replace shader chunks with box projection chunks
			shader.vertexShader = 'varying vec3 vWorldPosition;\n' + shader.vertexShader;
			shader.vertexShader = shader.vertexShader.replace(
				'#include <worldpos_vertex>',
				h.worldposReplace
				);
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <envmap_physical_pars_fragment>',
				h.envmapPhysicalParsReplace
				);
		};
		groundPlane = new THREE.PlaneBufferGeometry(cfg.ground.width, cfg.ground.height, worldWidth - 1, worldDepth - 1);
		groundPlane.rotateX(- Math.PI / 2);

		var groundAnimation = groundPlane.attributes.position;
		groundAnimation.usage = THREE.DynamicDrawUsage;


		var groundAnimationArray = groundPlane.attributes.position.array;

		console.log(groundAnimationArray);

		var simplex = new SimplexNoise()
		var smoothing = 100;

		for ( var i = 0; i <= groundAnimationArray.count; i +=3 ) {
			groundAnimationArray[i+2] = simplex.noise2D(
				groundAnimationArray[i] / smoothing.randInt(10, 200),
				groundAnimationArray[i+1] / smoothing.randInt(10, 200)
				);
		}

		groundMesh = new THREE.Mesh(groundPlane, boxProjectedMat);
		groundMesh.position.set(cfg.ground.x, cfg.ground.y, cfg.ground.z);

		console.log(groundMesh);


		scene.add(groundMesh);

		// GROUND END ( with box projected environment mapping )----------------------------------



		// WAWES BEGIN ----------------------------------------------------------------------------
		wavePlane = new THREE.PlaneBufferGeometry( cfg.ground.width, cfg.ground.height, worldWidth - 1, worldDepth - 1 );
		wavePlane.rotateX( - Math.PI / 2 );

		var waveAnimation = wavePlane.attributes.position;
		waveAnimation.usage = THREE.DynamicDrawUsage;

		for ( var i = 0; i < waveAnimation.count; i ++ ) {
			var y = 35 * Math.sin( i / 2 );
			waveAnimation.setY( i, y );
		}

		var waweTexture = new THREE.TextureLoader().load(`img/textures/${cfg.ground.texture}.jpg`);
		waweTexture.wrapS = waweTexture.wrapT = THREE.RepeatWrapping;
		waweTexture.repeat.set( 5, 5 );

		waveMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, map: waweTexture } );
		waveMesh = new THREE.Mesh( wavePlane, waveMaterial );
		waveMesh.position.set(cfg.ground.x, cfg.ground.y+20, cfg.ground.z);

		// scene.add( waveMesh );
		// WAWES END ----------------------------------------------------------------------------



		// GUI BEGIN ----------------------------------------------------------------------------
		var gui = new GUI();


		param = {
			'box projected': true,

			color: ray.color.getHex(),
			colorReflection: boxProjectedMat.color.getHex(),
			width: ray.width,
			height: ray.height,
			roughness1: defaultMat.roughness,
			roughness2: boxProjectedMat.roughness,
			'ambient': ambient.intensity,
			smoothing: smoothing,

		};

		const guiBP = gui.add(param, 'box projected');
		guiBP.onChange(function (value) {
			if (value) {
				groundMesh.material = boxProjectedMat;
			} else {
				groundMesh.material = defaultMat;
			}
			render();
		});

		const guiTest = gui.addFolder(`Test params`);
		guiTest.add(param, 'smoothing', 0, 300).step(1).name('smoothing');
		guiTest.open();

		const guiSceneCfg = gui.addFolder(`Scene params`);
		guiSceneCfg.add(scene.position, 'x', -300, 300).step(1).name('position x');
		guiSceneCfg.add(scene.position, 'y', -300, 300).step(1).name('position y');
		guiSceneCfg.add(scene.position, 'z', -300, 300).step(1).name('position z');
		// guiSceneCfg.open();

		const guiCameraCfg = gui.addFolder(`Camera params`);
		guiCameraCfg.add(camera.position, 'x', -500, 500).step(1).name('position x');
		guiCameraCfg.add(camera.position, 'y', -500, 500).step(1).name('position y');
		guiCameraCfg.add(camera.position, 'z', -500, 500).step(1).name('position z');
		// guiCameraCfg.open();

		const guiRayCfg = gui.addFolder(`Ray params`);
		guiRayCfg.add(ray.position, 'x', -500, 500).name('position x');
		guiRayCfg.add(ray.position, 'y', -500, 500).name('position y');
		guiRayCfg.add(ray.position, 'z', -500, 500).name('position z');
		guiRayCfg.addColor(param, 'color').name('color').onChange(function (val) {
			ray.color.setHex(val);
			rectLightMesh.material.color.copy(ray.color).multiplyScalar(ray.intensity);
		});
		guiRayCfg.addColor(param, 'color').name('Reflection Color').onChange(function (val) {
			boxProjectedMat.color.setHex(val);
		});
		guiRayCfg.add(param, 'width', 1, 100).step(1).onChange(function (val) {
			ray.width = val;
			rectLightMesh.scale.x = val;
		});
		guiRayCfg.add(param, 'height', 1, 500).step(1).onChange(function (val) {
			ray.height = val;
			rectLightMesh.scale.y = val;
		});
		guiRayCfg.add(ray, 'intensity', 0, 100).name('intensity');
		guiRayCfg.add(param, 'roughness1', 0, 1).step(0.01).name('roughness1').onChange(function (val) {
			defaultMat.roughness = val;
		});
		guiRayCfg.add(param, 'roughness2', 0, 1).step(0.01).name('roughness2').onChange(function (val) {
			boxProjectedMat.roughness = val;
		});
		guiRayCfg.add(param, 'ambient', 0.0, 0.2).step(0.01).onChange(function (val) {
			ambient.intensity = val;
		});
		guiRayCfg.open();

		const guiGroundCfg = gui.addFolder(`Ground params`);
		guiGroundCfg.add(groundMesh.position, 'x', -500, 500).name('x');
		guiGroundCfg.add(groundMesh.position, 'y', -500, 500).name('y');
		guiGroundCfg.add(groundMesh.position, 'z', -500, 500).name('z');
		// guiGroundCfg.open();

		class ColorGUIHelper {
			constructor(object, prop) {
				this.object = object;
				this.prop = prop;
			}
			get value() {
				return `#${this.object[this.prop].getHexString()}`;
			}
			set value(hexString) {
				this.object[this.prop].set(hexString);
			}
		}
		// GUI END ----------------------------------------------------------------------------




		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('mousemove', onDocumentMouseMove, false);

	}

	function updateCubeMap() {
		groundMesh.visible = false;
		cubeCamera.position.copy(groundMesh.position);
		cubeCamera.update(renderer, scene);
		groundMesh.visible = true;

		render();
	}

	function onDocumentMouseMove(event) {

		controls.handleMouseMoveRotate(event);
		// console.log(`x:${camera.position.x}, y:${camera.position.y}, z:${camera.position.z} `)

	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {

		requestAnimationFrame(animate);
		updateCubeMap();
		controls.update();


		if (statsEnabled) { stats.update() };
	}

	function randomInteger(min, max) {
		let rand = min + Math.random() * (max + 1 - min);
		return Math.floor(rand);
	}

	function render() {


		var delta = clock.getDelta();
		var time = clock.getElapsedTime() * 10;

		var wavesAnimation = groundPlane.attributes.position;

		for ( var i = 0; i <= wavesAnimation.count; i +=2 ) {
			var y = 2 * Math.sin( i + ( time + i ) / 3 );
			wavesAnimation.setY( i, y );
		}


		// for ( var i = 0; i <= wavesAnimationArray.count; i +=3 ) {
		// 	wavesAnimationArray[i+2] = peak * simplex.noise2D(
		// 		wavesAnimationArray[i]/smoothing,
		// 		wavesAnimationArray[i+1] / smoothing
		// 		);
		// }

		wavesAnimation.needsUpdate = true;

		renderer.render(scene, camera);
	}

}
