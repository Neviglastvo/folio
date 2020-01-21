import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";

import {
	ToonShader1,
	ToonShader2,
	ToonShaderHatching,
	ToonShaderDotted
} from "three/examples/jsm/shaders/ToonShader.js";

// import * as h from './_help'

export default function bg() {
	var container,
		stats,
		statsEnabled = true,
		production = false;

	var camera, scene, renderer;

	var materials, current_material;

	var light, pointLight, ambientLight;

	var effect, resolution;

	var effectController;
	var groundPlane1, groundPlane1;

	var time = 0;
	var clock = new THREE.Clock();

	init();
	animate();

	function init() {
		container = document.getElementById("jsBg");

		// CAMERA

		camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			1,
			10000
		);
		camera.position.set(0, 0, 1850);

		// SCENE

		scene = new THREE.Scene();

		// LIGHTS

		light = new THREE.DirectionalLight(0xffffff);
		light.position.set(0.5, 0.5, 1);
		scene.add(light);

		pointLight = new THREE.PointLight(0xff3300);
		pointLight.position.set(0, 0, 100);
		scene.add(pointLight);

		ambientLight = new THREE.AmbientLight(0x080808);
		scene.add(ambientLight);

		// MATERIALS

		materials = generateMaterials();
		current_material = "matte";

		// MARCHING CUBES

		resolution = 10;

		effect = new MarchingCubes(
			resolution,
			materials[current_material].m,
			true,
			true
		);
		effect.position.set(0, 0, 0);
		effect.scale.set(2600, 2000, 1000);

		effect.enableUvs = false;
		effect.enableColors = false;

		scene.add(effect);

		// RENDERER

		renderer = new THREE.WebGLRenderer({
			// antialias: true,
			// alpha: true
		});
		renderer.outputEncoding = THREE.sRGBEncoding;
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);

		renderer.domElement.style.position = "fixed";
		renderer.domElement.style.top = "0px";
		renderer.domElement.style.left = "0px";
		renderer.setClearColor(0x000000, 0);

		container.appendChild(renderer.domElement);

		// GUI

		setupGui();

		// EVENTS

		window.addEventListener("resize", onWindowResize, false);

		$(container).hasClass("js-production")
			? (production = true)
			: (production = false);

		if (production === true) {
			statsEnabled = false;
			$(".dg.ac").remove();
		} else {
			statsEnabled = true;

			if (statsEnabled) {
				stats = new Stats();
				container.appendChild(stats.dom);
			}
		}

		// STATS

		stats = new Stats();
		if (statsEnabled) {
			container.appendChild(stats.dom);
		}
	}

	//

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function generateMaterials() {
		// environment map

		var materials = {
			matte: {
				m: new THREE.MeshPhongMaterial({
					color: 0x000000,
					specular: 0x000000,
					shininess: 0
				}),
				h: 0,
				s: 0,
				l: 1
			},

			flat: {
				m: new THREE.MeshLambertMaterial({
					color: 0x000000,
					flatShading: true
				}),
				h: 0,
				s: 0,
				l: 1
			},

			colors: {
				m: new THREE.MeshPhongMaterial({
					color: 0xffffff,
					specular: 0xffffff,
					shininess: 2,
					vertexColors: THREE.VertexColors
				}),
				h: 0,
				s: 0,
				l: 1
			},

			multiColors: {
				m: new THREE.MeshPhongMaterial({
					shininess: 2,
					vertexColors: THREE.VertexColors
				}),
				h: 0,
				s: 0,
				l: 1
			}
		};

		return materials;
	}

	function setupGui() {
		var createHandler = function(id) {
			return function() {
				var mat_old = materials[current_material];
				mat_old.h = m_h.getValue();
				mat_old.s = m_s.getValue();
				mat_old.l = m_l.getValue();

				current_material = id;

				var mat = materials[id];
				effect.material = mat.m;

				m_h.setValue(mat.h);
				m_s.setValue(mat.s);
				m_l.setValue(mat.l);

				effect.enableUvs =
					current_material === "textured" ? true : false;
				effect.enableColors =
					current_material === "colors" ||
					current_material === "multiColors"
						? true
						: false;
			};
		};

		effectController = {
			material: "shiny",

			speed: 0.25,
			numBlobs: 20,
			resolution: 30,
			isolation: 150,

			floor: false,
			wallz: true,
			wallx: false,
			roof: false,
			wallz2: false,
			wallx2: false,

			hue: 0,
			saturation: 0,
			lightness: 0.8,

			lhue: 0,
			lsaturation: 0,
			llightness: 0.7,

			lx: 0.45,
			ly: -0.775,
			lz: 0.55,

			dummy: function() {}
		};

		var h, m_h, m_s, m_l;

		var gui = new GUI();

		// material (type)

		h = gui.addFolder("Materials");

		for (var m in materials) {
			effectController[m] = createHandler(m);
			h.add(effectController, m).name(m);
		}

		// material (color)

		h = gui.addFolder("Material color");

		m_h = h.add(effectController, "hue", 0.0, 1.0, 0.025);
		m_s = h.add(effectController, "saturation", 0.0, 1.0, 0.025);
		m_l = h.add(effectController, "lightness", 0.0, 1.0, 0.025);

		// light (point)

		h = gui.addFolder("Point light color");

		h.add(effectController, "lhue", 0.0, 1.0, 0.025).name("hue");
		h.add(effectController, "lsaturation", 0.0, 1.0, 0.025).name(
			"saturation"
		);
		h.add(effectController, "llightness", 0.0, 1.0, 0.025).name(
			"lightness"
		);

		// light (directional)

		h = gui.addFolder("Directional light orientation");

		h.add(effectController, "lx", -1.0, 1.0, 0.025).name("x");
		h.add(effectController, "ly", -1.0, 1.0, 0.025).name("y");
		h.add(effectController, "lz", -1.0, 1.0, 0.025).name("z");

		// simulation

		h = gui.addFolder("Simulation");

		h.add(effectController, "speed", 0.1, 8.0, 0.05);
		h.add(effectController, "numBlobs", 1, 50, 1);
		h.add(effectController, "resolution", 14, 100, 1);
		h.add(effectController, "isolation", 10, 300, 1);

		h.add(effectController, "floor");
		h.add(effectController, "roof");
		h.add(effectController, "wallz");
		h.add(effectController, "wallz2");
		h.add(effectController, "wallx");
		h.add(effectController, "wallx2");
		// h.open();

		const guiCameraCfg = gui.addFolder(`Camera params`);
		guiCameraCfg
			.add(camera.position, "x", -2500, 2500)
			.step(1)
			.name("position x");
		guiCameraCfg
			.add(camera.position, "y", -2500, 2500)
			.step(1)
			.name("position y");
		guiCameraCfg
			.add(camera.position, "z", -2500, 2500)
			.step(1)
			.name("position z");
		guiCameraCfg.open();

		const guiEffectCfg = gui.addFolder(`Effect params`);
		guiEffectCfg
			.add(effect.position, "x", -2500, 2500)
			.step(1)
			.name("position x");
		guiEffectCfg
			.add(effect.position, "y", -2500, 2500)
			.step(1)
			.name("position y");
		guiEffectCfg
			.add(effect.position, "z", -2500, 2500)
			.step(1)
			.name("position z");
		guiEffectCfg
			.add(effect.scale, "x", 1, 5000)
			.step(0.1)
			.name("scale x");
		guiEffectCfg
			.add(effect.scale, "y", 1, 5000)
			.step(0.1)
			.name("scale y");
		guiEffectCfg
			.add(effect.scale, "z", 1, 5000)
			.step(0.1)
			.name("scale z");
		guiEffectCfg.open();
	}

	// this controls content of marching cubes voxel field

	function updateCubes(
		object,
		time,
		numblobs,
		floor,
		roof,
		wallz,
		wallz2,
		wallx,
		wallx2
	) {
		object.reset();

		// fill the field with some metaballs

		var i, ballx, bally, ballz, subtract, strength;
		var rainbow = [
			new THREE.Color(0xff0000),
			new THREE.Color(0xff7f00),
			new THREE.Color(0xffff00),
			new THREE.Color(0x00ff00),
			new THREE.Color(0x0000ff),
			new THREE.Color(0x4b0082),
			new THREE.Color(0x9400d3)
		];
		subtract = 12;
		strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

		for (i = 0; i < numblobs; i++) {
			ballx =
				Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) *
					0.27 +
				0.5;
			bally =
				Math.abs(
					Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))
				) * 0.77; // dip into the floor
			ballz =
				Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) *
					0.27 +
				0.5;

			if (current_material === "multiColors") {
				object.addBall(
					ballx,
					bally,
					ballz,
					strength,
					subtract,
					rainbow[i % 7]
				);
			} else {
				object.addBall(ballx, bally, ballz, strength, subtract);
			}
		}

		if (floor) object.addPlaneY(2, 12);
		if (roof) {
			object.addPlaneY(32, 200);
		}
		if (wallz) object.addPlaneZ(2, 12);
		if (wallz2) object.addPlaneZ(12, 2);
		if (wallx) object.addPlaneX(2, 12);
		if (wallx2) object.addPlaneY(2, 12);
	}

	//

	function animate() {
		requestAnimationFrame(animate);

		render();
		if (statsEnabled) {
			stats.update();
		}
	}

	function render() {
		var delta = clock.getDelta();

		time += delta * effectController.speed * 0.5;

		// marching cubes

		if (effectController.resolution !== resolution) {
			resolution = effectController.resolution;
			effect.init(Math.floor(resolution));
		}

		if (effectController.isolation !== effect.isolation) {
			effect.isolation = effectController.isolation;
		}

		updateCubes(
			effect,
			time,
			effectController.numBlobs,
			effectController.floor,
			effectController.roof,
			effectController.wallz,
			effectController.wallz2,
			effectController.wallx,
			effectController.wallx2
		);

		// materials

		if (effect.material instanceof THREE.ShaderMaterial) {
			effect.material.uniforms["uBaseColor"].value.setHSL(
				effectController.hue,
				effectController.saturation,
				effectController.lightness
			);
		} else {
			effect.material.color.setHSL(
				effectController.hue,
				effectController.saturation,
				effectController.lightness
			);
		}

		// lights

		light.position.set(
			effectController.lx,
			effectController.ly,
			effectController.lz
		);
		light.position.normalize();

		pointLight.color.setHSL(
			effectController.lhue,
			effectController.lsaturation,
			effectController.llightness
		);

		// render

		renderer.render(scene, camera);
	}
}
