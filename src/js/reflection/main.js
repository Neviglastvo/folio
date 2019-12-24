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
			x: 300,
			y: 0,
			z: 0,
			viewAngle: 45,
			width: window.innerWidth,
			height: window.innerHeight,
			near: 1,
			far: 800,
		},
		ray: {
			x: -300,
			y: 130,
			z: 0,
			color: 0xff3767,
			colorReflection: 0xff3767,
			width: 40,
			height: 400,
			intensity: 6,
			glowing: true,
			glowingOpacity: 0.5,
			glowingColor: 0xff3767,
			glowingSizeX: 6,
			glowingSizeY: 6,
			glowBlending: true,
			ambient: 0.03,
			roughtness1: 0.37,
			roughtness2: 0.5,
		},
		ground: {
			texture: 'water',
			width: 512,
			height: 1024,
			x: 0,
			y: -50,
			z: 0,
		}
	};

	let waveMesh, wavePlane, waveMaterial, clock;
	let worldWidth = 20, worldDepth = 20;

	let camera, cubeCamera, scene, renderer,
	controls,
	groundPlane, groundMesh,

	stats, statsEnabled = true, production = false,

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

		controls.target.set(0, 0, 0);
		controls.maxPolarAngle = Math.PI / 2
		controls.enableRotate = true;
		controls.enablePan = true;
		controls.enableZoom = false;
		controls.enableDamping = true;
		controls.dampingFactor = 0.01;
		controls.rotateSpeed = 0.2;
		// controls.screenSpacePanning = false;

		controls.dispose();
		controls.update();

		cubeCamera = new THREE.CubeCamera(1, 256, 256);
		cubeCamera.renderTarget.texture.generateMipmaps = true;
		cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
		cubeCamera.renderTarget.texture.mapping = THREE.CubeReflectionMapping;
		scene.add(cubeCamera);

		clock = new THREE.Clock();

		var loader = new THREE.TextureLoader();

		// CORE END ----------------------------------------------------------------------------



		// RAY BEGIN ----------------------------------------------------------------------------
		let ray = new THREE.RectAreaLight(cfg.ray.colorReflection, cfg.ray.intensity, cfg.ray.width, cfg.ray.height);
		ray.position.set(cfg.ray.x, cfg.ray.y, cfg.ray.z);
		ray.lookAt(0, (cfg.ray.y), 0);

		var rayLightMesh = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(),
			new THREE.MeshBasicMaterial({
				color: cfg.ray.color, // ray color
				side: THREE.BackSide,
			})
			);
		rayLightMesh.scale.x = ray.width;
		rayLightMesh.scale.y = ray.height;
		ray.add(rayLightMesh);

		RectAreaLightUniformsLib.init();

		var ambient = new THREE.AmbientLight(cfg.ray.colorReflection, cfg.ray.ambient);
		scene.add(ambient);

		scene.add(ray);
		// RAY END ----------------------------------------------------------------------------




		// SPHERE BEGIN ----------------------------------------------------------------------------
		// let sphere = new THREE.RectAreaLight(0x4737ff, 50, 50, 50);
		// sphere.position.set(-250, 130, 100);
		// sphere.lookAt(0, 130, 0);
		// scene.add(sphere);

		// var sphereLightMesh = new THREE.Mesh(
		// 	new THREE.SphereGeometry(1, 50, 50),
		// 	new THREE.MeshBasicMaterial({
		// 		color: 0x4737ff,
		// 		side: THREE.BackSide,
		// 	})
		// );
		// sphereLightMesh.scale.x = 50;
		// sphereLightMesh.scale.y = 50;
		// sphere.add(sphereLightMesh);
		// SPHERE END ----------------------------------------------------------------------------



		// GROUND BEGIN ( with box projected environment mapping )--------------------------------
		var rMap = loader.load(`img/textures/${cfg.ground.texture}.jpg`);
		rMap.wrapS = rMap.wrapT = THREE.RepeatWrapping;
		THREE.RepeatWrapping;
		rMap.repeat.set(1, 1);
		var defaultMat = new THREE.MeshPhysicalMaterial({
			roughness: cfg.ray.roughtness1,
			envMap: cubeCamera.renderTarget.texture,
			roughnessMap: rMap
		});
		var boxProjectedMat = new THREE.MeshPhysicalMaterial({
			color: new THREE.Color(cfg.ray.colorReflection),
			roughness: cfg.ray.roughtness2,
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

		var simplex = new SimplexNoise()
		var smoothing = 100;

		for (var i = 0; i <= groundAnimationArray.count; i += 3) {
			groundAnimationArray[i + 2] = simplex.noise2D(
				(groundAnimationArray[i] / smoothing.randInt(1, 100))* Math.sin(i / 2),
				(groundAnimationArray[i + 1] / smoothing.randInt(1, 100))* Math.sin(i / 2)
				);
		}

		groundMesh = new THREE.Mesh(groundPlane, defaultMat);
		groundMesh.position.set(cfg.ground.x, cfg.ground.y, cfg.ground.z);

		scene.add(groundMesh);

		// GROUND END ( with box projected environment mapping )----------------------------------



		// GUI BEGIN ----------------------------------------------------------------------------
		var gui = new GUI();


		param = {
			'box projected': false,

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
			rayLightMesh.material.color.copy(ray.color);
		});
		guiRayCfg.addColor(param, 'colorReflection').name('Reflection Color').onChange(function (val) {
			boxProjectedMat.color.setHex(val);
		});
		guiRayCfg.add(param, 'width', 1, 100).step(1).onChange(function (val) {
			ray.width = val;
			rayLightMesh.scale.x = val;
		});
		guiRayCfg.add(param, 'height', 1, 500).step(1).onChange(function (val) {
			ray.height = val;
			rayLightMesh.scale.y = val;
		});
		guiRayCfg.add(ray, 'intensity', 0, 20).step(0.01).name('intensity');
		guiRayCfg.add(param, 'roughness1', 0, 1).step(0.01).name('roughness1').onChange(function (val) {
			defaultMat.roughness = val;
		});
		guiRayCfg.add(param, 'roughness2', 0, 1).step(0.01).name('roughness2').onChange(function (val) {
			boxProjectedMat.roughness = val;
		});
		guiRayCfg.add(param, 'ambient', 0.0, 1).step(0.01).onChange(function (val) {
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

		$(container).hasClass('js-reflection-production') ? production = true : production = false;

		if (production === true){

			statsEnabled = false;
			$('.dg.ac').remove()

		} else {

			statsEnabled = true;

			if (statsEnabled) {
				stats = new Stats();
				container.appendChild(stats.dom);
			}

		}

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

		for (var i = 0; i <= wavesAnimation.count; i++) {
			var y = 5 * Math.sin(i + ((time + i) / 20) );
			wavesAnimation.setY(i, y);
		}

		wavesAnimation.needsUpdate = true;

		renderer.render(scene, camera);
	}

}
