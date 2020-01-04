import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

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
			far: 9800,
		},
		ray: {
			x: -300,
			y: 0,
			z: 0,
			// color: 0x901dc6,
			color: 0xFFFFFF,
			colorReflection: 0x9e00ff,
			width: 40,
			height: window.innerHeight,
			intensity: 4,
			roughtness1: 0.6,
			roughtness2: 1,
			ambient: 0.07,
			glowing: true,
			glowingOpacity: 0.5,
			glowingColor: 0xff3767,
			glowingSizeX: 6,
			glowingSizeY: 6,
			glowBlending: true,
		},
		ground: {
			texture: 'water',
			texture1: 'lavatile',
			width: 512,
			height: 1024,
			x: 0,
			y: -50,
			z: 0
		}
	};

	let waveMesh, wavePlane, waveMaterial, clock;
	let worldWidth = 20, worldDepth = 20;

	console.log(worldWidth)

	let camera, cubeCamera, scene, renderer,
	controls,
	groundPlane, groundMesh,
	cloudPlane, cloudMesh,
	cloudsPlane, cloudsMesh,cloudsMesh2,
	groundPlane1, groundMesh1,
	mountainLeft, mountainLeftMesh,

	stats, statsEnabled = true, production = false,

	param = {};

	var mouseX = 0;
	var mouseY = 0;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	var water = null;

	let lastTime = ( new Date() ).getTime();

	var rotL;
	var rotU;
	var sphericalDelta = new THREE.Spherical();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();
	var rotateStart = new THREE.Vector2();

	var mesh, texture;

	var particleSystem, particleCount, particles;

	init();
	animate();

	function init() {

		// CORE BEGIN ----------------------------------------------------------------------------
		let container = document.getElementById('jsReflection');

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

		let loader = new THREE.TextureLoader();

		// CORE END ----------------------------------------------------------------------------



		// MATERIALS BEGIN -----------------------------------------------------------------------
		let rMap = loader.load(`img/textures/${cfg.ground.texture}.jpg`);
		rMap.wrapS = rMap.wrapT = THREE.RepeatWrapping;
		THREE.RepeatWrapping;
		rMap.repeat.set(1, 1);

		let rMap1 = loader.load(`img/textures/${cfg.ground.texture1}.jpg`);
		rMap1.wrapS = rMap1.wrapT = THREE.RepeatWrapping;
		THREE.RepeatWrapping;
		rMap1.repeat.set(1, 4);

		let defaultReflectionMaterial = new THREE.MeshPhysicalMaterial({
			roughness: cfg.ray.roughtness1,
			envMap: cubeCamera.renderTarget.texture,
			roughnessMap: rMap
		});
		let boxProjectedReflectionMaterial = new THREE.MeshPhysicalMaterial({
			color: new THREE.Color(cfg.ray.colorReflection),
			roughness: cfg.ray.roughtness2,
			envMap: cubeCamera.renderTarget.texture,
			roughnessMap: rMap1
		});
		boxProjectedReflectionMaterial.onBeforeCompile = function (shader) {
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
		// MATERIALS END--------------------------------------------------------------------------



		// RAY BEGIN ----------------------------------------------------------------------------
		let ray = new THREE.RectAreaLight(cfg.ray.color, cfg.ray.intensity, cfg.ray.width, cfg.ray.height);
		ray.position.set(cfg.ray.x, cfg.ray.y, cfg.ray.z);
		ray.lookAt(0, (cfg.ray.y), 0);

		let rayLightMesh = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(),
			new THREE.MeshBasicMaterial({
				color: cfg.ray.color, // ray color
				side: THREE.DoubleSide,
			})
			);
		rayLightMesh.scale.x = ray.width;
		rayLightMesh.scale.y = ray.height;
		ray.add(rayLightMesh);

		RectAreaLightUniformsLib.init();

		let ambient = new THREE.AmbientLight(cfg.ray.colorReflection, cfg.ray.ambient);

		scene.add(ray, ambient);
		// RAY END ----------------------------------------------------------------------------


		// SPHERE BEGIN ----------------------------------------------------------------------------
		// let sphere = new THREE.RectAreaLight(0x4737ff, 50, 50, 50);
		// sphere.position.set(-250, 130, 100);
		// sphere.lookAt(0, 130, 0);
		// scene.add(sphere);

		// let sphereLightMesh = new THREE.Mesh(
		// 	new THREE.SphereGeometry(1, 50, 50),
		// 	new THREE.MeshBasicMaterial({
		// 		color: 0x4737ff,
		// 		side: THREE.BackSide,
		// 	})
		// );
		// sphereLightMesh.scale.x = 100;
		// sphereLightMesh.scale.y = 100;
		// sphere.add(sphereLightMesh);
		// SPHERE END ----------------------------------------------------------------------------



		// GROUND BEGIN ( with box projected environment mapping )--------------------------------
		groundPlane = new THREE.PlaneBufferGeometry(cfg.ground.width, cfg.ground.height, worldWidth - 1, worldDepth - 1);
		groundPlane.rotateX(- Math.PI / 2);

		let groundAnimation = groundPlane.attributes.position;
		groundAnimation.usage = THREE.DynamicDrawUsage;

		let groundAnimationArray = groundPlane.attributes.position.array;

		let simplex = new SimplexNoise()
		let smoothing = 100;

		for (let i = 0; i <= groundAnimationArray.count; i += 3) {
			groundAnimationArray[i + 2] = simplex.noise2D(
				(groundAnimationArray[i] / smoothing.randInt(1, 100))* Math.sin(i / 2),
				(groundAnimationArray[i + 1] / smoothing.randInt(1, 100))* Math.sin(i / 3)
				);
		}

		groundMesh = new THREE.Mesh(groundPlane, defaultReflectionMaterial);
		groundMesh.position.set(cfg.ground.x, cfg.ground.y, cfg.ground.z);

		scene.add(groundMesh);
		// GROUND END ( with box projected environment mapping )----------------------------------



		// CLOUDS BEGIN ( with box projected environment mapping )--------------------------------
		let cloudsMaterial = new THREE.RawShaderMaterial({
			vertexShader: h.cloudVertexShader,
			fragmentShader: h.cloudFragmentShader,
			uniforms: {
				time: { type: 'f', value: 1 },
				uHue: { type: 'f', value: .70 },
				// mousePosition: {type: 'v2', value: new THREE.Vector2( 0.5, 0.5 ) }
			}
		});

		cloudsPlane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerWidth, 128, 128);

		cloudsMesh = new THREE.Mesh(cloudsPlane, cloudsMaterial);
		cloudsMesh.rotateX( Math.PI / 2);
		cloudsMesh.scale.z = 1;
		cloudsMesh.position.set(-310, 160, 0);


		scene.add(cloudsMesh);
		// CLOUDS END ( with box projected environment mapping )----------------------------------



		// GROUND1 BEGIN ( with box projected environment mapping )--------------------------------
		groundPlane1 = new THREE.PlaneBufferGeometry(cfg.ground.width/3, cfg.ground.height, worldWidth - 1, worldDepth - 1);
		groundPlane1.rotateX( -Math.PI / 2);

		groundMesh1 = new THREE.Mesh(groundPlane1, boxProjectedReflectionMaterial);
		groundMesh1.position.set(240, -20, 0);
		groundMesh1.rotateZ(0.2);

		scene.add(groundMesh1);
		// GROUND1 END ( with box projected environment mapping )----------------------------------



		// particles BEGIN ( with box projected environment mapping )--------------------------------
		particleCount = 5000;
		var pMaterial = new THREE.PointCloudMaterial({
			color: 0xFFFFFF,
			size: 2,
			map: loader.load(
				"https://s3-us-west-2.amazonaws.com/s.cdpn.io/212131/snow-small.png"
				),
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		});

		particles = new THREE.Geometry;
		for (var i = 0; i < particleCount; i++) {
			var pX = Math.random() * 500 - 250,
			pY = Math.random() * 500 - 250,
			pZ = Math.random() * 500 - 250,
			particle = new THREE.Vector3(pX, pY, pZ);
			particle.velocity = {};
			particle.velocity.y = 0;
			particles.vertices.push(particle);
		}
		particleSystem = new THREE.PointCloud(particles, pMaterial);
		// scene.add(particleSystem);
		// particles END ( with box projected environment mapping )----------------------------------



		// GUI BEGIN ----------------------------------------------------------------------------
		let gui = new GUI();

		param = {
			'box projected': false,
			color: ray.color.getHex(),
			colorReflection: boxProjectedReflectionMaterial.color.getHex(),
			width: ray.width,
			height: ray.height,
			roughness1: defaultReflectionMaterial.roughness,
			roughness2: boxProjectedReflectionMaterial.roughness,
			'ambient': ambient.intensity,
			smoothing: smoothing,

		};

		const guiBP = gui.add(param, 'box projected');
		guiBP.onChange(function (value) {
			if (value) {
				groundMesh1.material = boxProjectedReflectionMaterial;
			} else {
				groundMesh1.material = defaultReflectionMaterial;
			}
			render();
		});

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
			boxProjectedReflectionMaterial.color.setHex(val);
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
			defaultReflectionMaterial.roughness = val;
		});
		guiRayCfg.add(param, 'roughness2', 0, 1).step(0.01).name('roughness2').onChange(function (val) {
			boxProjectedReflectionMaterial.roughness = val;
		});
		guiRayCfg.add(param, 'ambient', 0.0, 1).step(0.01).onChange(function (val) {
			ambient.intensity = val;
		});
		// guiRayCfg.open();

		const guiGroundCfg = gui.addFolder(`Ground params`);
		guiGroundCfg.add(groundMesh.position, 'x', -500, 500).name('x');
		guiGroundCfg.add(groundMesh.position, 'y', -500, 500).name('y');
		guiGroundCfg.add(groundMesh.position, 'z', -500, 500).name('z');
		// guiGroundCfg.open();

		const guiCloudsCfg = gui.addFolder(`Clouds params`);
		guiCloudsCfg.add(cloudsMesh.scale, 'x', 1, 5).step(0.1).name('scale x');
		guiCloudsCfg.add(cloudsMesh.scale, 'y', 1, 5).step(0.1).name('scale y');
		guiCloudsCfg.add(cloudsMesh.scale, 'z', 1, 5).step(0.1).name('scale z');
		guiCloudsCfg.add(cloudsMesh.position, 'x', -500, 500).name('pos x');
		guiCloudsCfg.add(cloudsMesh.position, 'y', -500, 500).name('pos y');
		guiCloudsCfg.add(cloudsMesh.position, 'z', -500, 500).name('pos z');
		guiCloudsCfg.add(cloudsMesh.rotation, 'x', -Math.PI, Math.PI).step(0.1).name('x deg');
		guiCloudsCfg.add(cloudsMesh.rotation, 'y', -Math.PI, Math.PI).step(0.1).name('y deg');
		guiCloudsCfg.add(cloudsMesh.rotation, 'z', -Math.PI, Math.PI).step(0.1).name('z deg');
		// guiCloudsCfg.open();

		const guiGroundCfg1 = gui.addFolder(`Ground params1`);
		guiGroundCfg1.add(groundMesh1.position, 'x', -500, 500).name('x');
		guiGroundCfg1.add(groundMesh1.position, 'y', -500, 500).name('y');
		guiGroundCfg1.add(groundMesh1.position, 'z', -500, 500).name('z');
		guiGroundCfg1.add(groundMesh1.rotation, 'x', -Math.PI, Math.PI).step(0.1).name('x');
		guiGroundCfg1.add(groundMesh1.rotation, 'y', -Math.PI, Math.PI).step(0.1).name('y');
		guiGroundCfg1.add(groundMesh1.rotation, 'z', -Math.PI, Math.PI).step(0.1).name('z');
		guiGroundCfg1.open();

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
		// window.addEventListener('wheel', onMouseWheel, false);

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
		cubeCamera.position.copy(groundMesh.position);
		cubeCamera.update(renderer, scene);

	}

	function simulateRain() {
		var pCount = particleCount;
		while (pCount--) {
			var particle = particles.vertices[pCount];
			if (particle.y < -200) {
				particle.y = 200;
				particle.velocity.y = 0;
			}
			particle.velocity.y -= Math.random() * .02;
			particle.y += particle.velocity.y;
		}
		particles.verticesNeedUpdate = true;
	};

	function onDocumentMouseMove(event) {

		controls.handleMouseMoveRotate(event);
		// console.log(`x:${camera.position.x}, y:${camera.position.y}, z:${camera.position.z} `)

	}

	function onMouseWheel( event ) {

		scene.rotation.y -= event.deltaY * 0.005

	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {

		if (statsEnabled) { stats.update() };

		updateCubeMap();

		controls.update();

		requestAnimationFrame(animate);
		render();
	}

	function randomInteger(min, max) {
		let rand = min + Math.random() * (max + 1 - min);
		return Math.floor(rand);
	}

	function render() {

		camera.lookAt( scene.position );

		let delta = clock.getDelta();
		let time = clock.getElapsedTime() * 10;
		let time2 = clock.getElapsedTime() * 0.25;
		let time3 = clock.getElapsedTime() * 0.075;

		let wavesAnimation = groundPlane.attributes.position;
		for (let i = 0; i <= wavesAnimation.count; i++) {
			let y = 5 * Math.sin(i + ((time + i) / 20) );
			wavesAnimation.setY(i, y);
		}
		wavesAnimation.needsUpdate = true;

		cloudsMesh.material.uniforms.time.value = time2;

		// particleSystem.rotation.y += 0.01;
		// simulateRain();

		renderer.render(scene, camera);
	}



}
