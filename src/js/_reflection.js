import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
// shader injection for box projected cube environment mapping

export default function reflection() {

	var worldposReplace = `
	#define BOX_PROJECTED_ENV_MAP
	#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )
	vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );
	#ifdef BOX_PROJECTED_ENV_MAP
	vWorldPosition = worldPosition.xyz;
	#endif
	#endif
	`;
	var envmapPhysicalParsReplace = `
	#if defined( USE_ENVMAP )
	#define BOX_PROJECTED_ENV_MAP
	#ifdef BOX_PROJECTED_ENV_MAP
	uniform vec3 cubeMapSize;
	uniform vec3 cubeMapPos;
	varying vec3 vWorldPosition;
	vec3 parallaxCorrectNormal( vec3 v, vec3 cubeSize, vec3 cubePos ) {
		vec3 nDir = normalize( v );
		vec3 rbmax = ( .5 * cubeSize + cubePos - vWorldPosition ) / nDir;
		vec3 rbmin = ( -.5 * cubeSize + cubePos - vWorldPosition ) / nDir;
		vec3 rbminmax;
		rbminmax.x = ( nDir.x > 0. ) ? rbmax.x : rbmin.x;
		rbminmax.y = ( nDir.y > 0. ) ? rbmax.y : rbmin.y;
		rbminmax.z = ( nDir.z > 0. ) ? rbmax.z : rbmin.z;
		float correction = min( min( rbminmax.x, rbminmax.y ), rbminmax.z );
		vec3 boxIntersection = vWorldPosition + nDir * correction;
		return boxIntersection - cubePos;
	}
	#endif
	#ifdef ENVMAP_MODE_REFRACTION
	uniform float refractionRatio;
	#endif
	vec3 getLightProbeIndirectIrradiance( const in GeometricContext geometry, const in int maxMIPLevel ) {
		vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
		#ifdef ENVMAP_TYPE_CUBE
		vec3 worldNormalFinal = worldNormal;
		#ifdef BOX_PROJECTED_ENV_MAP
		worldNormalFinal = parallaxCorrectNormal( worldNormal, cubeMapSize, cubeMapPos );
		#endif
		vec3 queryVec = vec3( flipEnvMap * worldNormalFinal.x, worldNormalFinal.yz );
		#ifdef TEXTURE_LOD_EXT
		vec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );
		#else
		vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );
		#endif
		envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );
		vec4 envMapColor = textureCubeUV( envMap, queryVec, 1.0 );
		#else
		vec4 envMapColor = vec4( 0.0 );
		#endif
		return PI * envMapColor.rgb * envMapIntensity;
	}
	float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {
		float maxMIPLevelScalar = float( maxMIPLevel );
		float desiredMIPLevel = maxMIPLevelScalar + 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );
		return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
	}
	vec3 getLightProbeIndirectRadiance( const in vec3 viewDir, const in vec3 normal, const in float blinnShininessExponent, const in int maxMIPLevel ) {
		#ifdef ENVMAP_MODE_REFLECTION
		vec3 reflectVec = reflect( -viewDir, normal );
		#else
		vec3 reflectVec = refract( -viewDir, normal, refractionRatio );
		#endif
		reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
		float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );
		#ifdef ENVMAP_TYPE_CUBE
		vec3 reflectVecFinal = reflectVec;
		#ifdef BOX_PROJECTED_ENV_MAP
		reflectVecFinal = parallaxCorrectNormal( reflectVec, cubeMapSize, cubeMapPos );
		#endif
		vec3 queryReflectVec = vec3( flipEnvMap * reflectVecFinal.x, reflectVecFinal.yz );
		#ifdef TEXTURE_LOD_EXT
		vec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );
		#else
		vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );
		#endif
		envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );
		vec4 envMapColor = textureCubeUV( envMap, queryReflectVec, BlinnExponentToGGXRoughness(blinnShininessExponent ));
		#elif defined( ENVMAP_TYPE_EQUIREC )
		vec2 sampleUV;
		sampleUV.y = asin( clamp( reflectVec.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
		sampleUV.x = atan( reflectVec.z, reflectVec.x ) * RECIPROCAL_PI2 + 0.5;
		#ifdef TEXTURE_LOD_EXT
		vec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );
		#else
		vec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );
		#endif
		envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_SPHERE )
		vec3 reflectView = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0,0.0,1.0 ) );
		#ifdef TEXTURE_LOD_EXT
		vec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );
		#else
		vec4 envMapColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );
		#endif
		envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#endif
		return envMapColor.rgb * envMapIntensity;
	}
	#endif
	`;
	let fps = 60;
	let WIDTH = window.innerWidth;
	let HEIGHT = window.innerHeight;
	// camera
	let VIEW_ANGLE = 45;
	let ASPECT = WIDTH / HEIGHT;
	let NEAR = 1;
	let FAR = 800;
	let camera, cubeCamera, scene, renderer;
	let controls;
	let ground, wallMat;

	let renderRequested = false;

	let stats;
	let statsEnabled = true;

	let targetX = 0;
	let targetY = 0;
	let windowHalfX = window.innerWidth / 2;
	let windowHalfY = window.innerHeight / 2;

	let mouseDown = false,
		mouseX = 0,
		mouseY = 0;



	function onMouseMove(evt) {

		evt.preventDefault();

		var deltaX = evt.clientX - mouseX,
			deltaY = evt.clientY - mouseY;
		mouseX = evt.clientX;
		mouseY = evt.clientY;
		rotateScene(deltaX, deltaY);
	}

	function rotateScene(deltaX, deltaY) {
		camera.rotation.y += deltaX / 10000;
		camera.rotation.x += deltaY / 10000;
	}

	init();
	animate();

	function init() {

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

		var container = document.getElementById('jsReflection');

		// renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(WIDTH, HEIGHT);
		container.appendChild(renderer.domElement);



		// scene
		scene = new THREE.Scene();



		// camera
		camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		camera.position.set(100, 0, 0);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.autoRotate = false;
		controls.autoRotateSpeed = 1;

		controls.target.set(0, 0, 0);
		controls.maxPolarAngle = Math.PI / 2
		controls.enableZoom = false;
		controls.enablePan = false;
		controls.enableDamping = true;
		controls.dampingFactor = 0.005;
		controls.rotateSpeed = 0.005;
		// controls.screenSpacePanning = false;
		console.log(controls.getAzimuthalAngle());
		console.log(controls.getPolarAngle());


		controls.dispose();
		controls.update();

		// controls.addEventListener('change', render);
		document.addEventListener('mousemove', onDocumentMouseMove, false);
		// controls.update();

		console.log(controls);


		// cube camera for environment map
		cubeCamera = new THREE.CubeCamera(1, 1000, 512);
		cubeCamera.renderTarget.texture.generateMipmaps = true;
		cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
		cubeCamera.renderTarget.texture.mapping = THREE.CubeReflectionMapping;
		cubeCamera.position.set(100, 50, 100);
		scene.add(cubeCamera);

		console.log(cubeCamera);


		// ground ( with box projected environment mapping )
		var loader = new THREE.TextureLoader();
		var rMap = loader.load('img/textures/lava/lavatile.jpg');
		rMap.wrapS = THREE.RepeatWrapping;
		rMap.wrapT = THREE.RepeatWrapping;
		rMap.repeat.set(2, 1);
		var defaultMat = new THREE.MeshPhysicalMaterial({
			roughness: 1,
			envMap: cubeCamera.renderTarget.texture,
			roughnessMap: rMap
		});
		var boxProjectedMat = new THREE.MeshPhysicalMaterial({
			color: new THREE.Color('#ffffff'),
			roughness: 1,
			envMap: cubeCamera.renderTarget.texture,
			roughnessMap: rMap
		});
		boxProjectedMat.onBeforeCompile = function (shader) {
			//these parameters are for the cubeCamera texture
			shader.uniforms.cubeMapSize = { value: new THREE.Vector3(200, 200, 100) };
			shader.uniforms.cubeMapPos = { value: new THREE.Vector3(0, 0, 0) };
			shader.uniforms.flipEnvMap.value = true;
			//replace shader chunks with box projection chunks
			shader.vertexShader = 'varying vec3 vWorldPosition;\n' + shader.vertexShader;
			shader.vertexShader = shader.vertexShader.replace(
				'#include <worldpos_vertex>',
				worldposReplace
			);
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <envmap_physical_pars_fragment>',
				envmapPhysicalParsReplace
			);
		};
		ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 600, 0), boxProjectedMat);
		ground.rotateX(- Math.PI / 2);
		ground.position.set(0, - 49, 0);
		scene.add(ground);

		console.log(ground);

		// walls
		var diffuseTex = loader.load('img/textures/brick_diffuse.jpg', function () {
			updateCubeMap();
		});
		var bumpTex = loader.load('img/textures/brick_bump.jpg', function () {
			updateCubeMap();
		});
		wallMat = new THREE.MeshPhysicalMaterial({
			map: diffuseTex,
			bumpMap: bumpTex,
			bumpScale: 0.5,
		});
		var planeGeo = new THREE.PlaneBufferGeometry(100, 100);
		var planeBack1 = new THREE.Mesh(planeGeo, wallMat);
		planeBack1.position.z = - 200;
		planeBack1.position.x = - 200;
		scene.add(planeBack1);
		var planeFront1 = new THREE.Mesh(planeGeo, wallMat);
		planeFront1.position.z = 50;
		planeFront1.position.x = - 50;
		planeFront1.rotateY(Math.PI);
		scene.add(planeFront1);
		//ray
		var rayWidth = 10;
		var rayHeight = 300;
		var intensity = 10;
		var rayColor = 0xEDAE49;
		var rayColorReflection = 0xEDAE49;
		RectAreaLightUniformsLib.init();
		var ray = new THREE.RectAreaLight(rayColorReflection, intensity, rayWidth, rayHeight);
		ray.position.set(-150, 100, 0);
		ray.lookAt(0, 100, 0);
		scene.add(ray);
		console.log(ray);

		var rayHelper = new THREE.RectAreaLightHelper(ray, rayColor);
		ray.add(rayHelper);

		console.log(scene);



		//stats
		if (statsEnabled) {
			stats = new Stats();
			container.appendChild(stats.dom);
		}

		// gui controls
		var gui = new GUI();

		var params = { 'box projected': true };

		const guiBP = gui.add(params, 'box projected');
		guiBP.onChange(function (value) {
			if (value) {
				ground.material = boxProjectedMat;
			} else {
				ground.material = defaultMat;
			}
			render();
		});

		const guiCameraCfg = gui.addFolder(`Camera params`);
		guiCameraCfg.add(scene.position, 'x', -300, 300).name('position x').onChange(requestRenderIfNotRequested);
		guiCameraCfg.add(scene.position, 'y', -300, 300).name('position y').onChange(requestRenderIfNotRequested);
		guiCameraCfg.add(scene.position, 'z', -300, 300).name('position z').onChange(requestRenderIfNotRequested);
		guiCameraCfg.add(camera.position, 'x', -500, 500).name('position x').onChange(requestRenderIfNotRequested);
		guiCameraCfg.add(camera.position, 'y', -500, 500).name('position y').onChange(requestRenderIfNotRequested);
		guiCameraCfg.add(camera.position, 'z', -500, 500).name('position z').onChange(requestRenderIfNotRequested);
		guiCameraCfg.add(camera.rotation, 'x', -Math.PI, Math.PI).name('rotation x').onChange(requestRenderIfNotRequested);
		guiCameraCfg.add(camera.rotation, 'y', -Math.PI, Math.PI).name('rotation y').onChange(requestRenderIfNotRequested);
		guiCameraCfg.add(camera.rotation, 'z', -Math.PI, Math.PI).name('rotation z').onChange(requestRenderIfNotRequested);
		guiCameraCfg.open();

		const guiRayCfg = gui.addFolder(`Ray params`);
		guiRayCfg.addColor(new ColorGUIHelper(ray, 'color'), 'value').name('color').onChange(requestRenderIfNotRequested);
		guiRayCfg.add(ray, 'width', 0, 100).name('width').onChange(requestRenderIfNotRequested);
		guiRayCfg.add(ray, 'height', 0, 500).name('height').onChange(requestRenderIfNotRequested);
		guiRayCfg.add(ray, 'intensity', 0, 100).name('intensity').onChange(requestRenderIfNotRequested);
		guiRayCfg.add(ray.position, 'x', -500, 500).name('x').onChange(requestRenderIfNotRequested);
		guiRayCfg.add(ray.position, 'y', -500, 500).name('y').onChange(requestRenderIfNotRequested);
		guiRayCfg.add(ray.position, 'z', -500, 500).name('z').onChange(requestRenderIfNotRequested);
		guiRayCfg.open();

		const guiGroundCfg = gui.addFolder(`Ground params`);
		guiGroundCfg.add(ground.geometry.parameters, 'width', 0, 1000).name('width').onChange(requestRenderIfNotRequested);
		guiGroundCfg.add(ground.geometry.parameters, 'height', 0, 1000).name('height').onChange(requestRenderIfNotRequested);
		guiGroundCfg.add(ground.position, 'x', -500, 500).name('x').onChange(requestRenderIfNotRequested);
		guiGroundCfg.add(ground.position, 'y', -500, 500).name('y').onChange(requestRenderIfNotRequested);
		guiGroundCfg.add(ground.position, 'z', -500, 500).name('z').onChange(requestRenderIfNotRequested);
		guiGroundCfg.open();

		console.log();

		window.addEventListener('resize', onWindowResize, false);

	}

	function updateCubeMap() {
		//disable specular highlights on walls in the environment map
		wallMat.roughness = 1;
		ground.visible = false;
		cubeCamera.position.copy(ground.position);
		cubeCamera.update(renderer, scene);
		wallMat.roughness = 0.6;
		ground.visible = true;

		render();
	}

	function onDocumentMouseMove(event) {
		// Manually fire the event in OrbitControls
		controls.handleMouseMoveRotate(event);
	}

	function onDocumentMouseMove2(event) {
		mouseX = (event.clientX - windowHalfX);
		mouseY = (event.clientY - windowHalfY);

		console.log(`mouseX:${mouseX} mouseY:${mouseY} `);

		targetX = mouseX * .01;
		targetY = mouseY * .01;

		// console.log(`targetX:${targetX} targetY:${targetY} `);

		var x = 10 * (targetX - camera.rotation.y);
		var y = 10 * (targetY - camera.rotation.x);

		camera.rotation.set(x, 0, 0);


		console.log(camera);
		console.log(controls.target);


	}

	function requestRenderIfNotRequested() {
		if (!renderRequested) {
			renderRequested = true;
			requestAnimationFrame(render);
		}
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

	function render() {
		renderRequested = true;

		renderer.render(scene, camera);
	}



}
