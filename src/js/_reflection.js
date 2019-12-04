import * as THREE from 'three';
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
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	// camera
	var VIEW_ANGLE = 45;
	var ASPECT = WIDTH / HEIGHT;
	var NEAR = 1;
	var FAR = 800;
	var camera, cubeCamera, scene, renderer;
	var cameraControls;
	var groundPlane, wallMat;
	init();



	function init() {
		var container = document.getElementById( 'jsReflection' );

	// renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(WIDTH, HEIGHT);
	container.appendChild(renderer.domElement);
	// gui controls
	var gui = new GUI();
	var params = {
		'box projected': true
	};
	var bpcemGui = gui.add(params, 'box projected');
	bpcemGui.onChange(function (value) {
		if (value) {
			groundPlane.material = boxProjectedMat;
		} else {
			groundPlane.material = defaultMat;
		}
		render();
	});
	// scene
	scene = new THREE.Scene();
	// camera
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set(280, 0, 0);
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, - 10, 0);
	// cameraControls.maxDistance = 400;
	// cameraControls.minDistance = 10;
	cameraControls.addEventListener('change', render);
	cameraControls.update();
	// cube camera for environment map
	cubeCamera = new THREE.CubeCamera(1, 1000, 512);
	cubeCamera.renderTarget.texture.generateMipmaps = true;
	cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
	cubeCamera.renderTarget.texture.mapping = THREE.CubeReflectionMapping;
	cubeCamera.position.set(0, - 100, 0);
	scene.add(cubeCamera);
	// ground floor ( with box projected environment mapping )
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
		shader.uniforms.cubeMapPos = { value: new THREE.Vector3(0, - 50, 0) };
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
	groundPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 150), boxProjectedMat);
	groundPlane.rotateX(- Math.PI / 2);
	groundPlane.position.set(0, - 49, 0);
	scene.add(groundPlane);
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
		bumpScale: 0.3,
	});
	var planeGeo = new THREE.PlaneBufferGeometry(100, 100);
	var planeBack1 = new THREE.Mesh(planeGeo, wallMat);
	planeBack1.position.z = - 50;
	planeBack1.position.x = - 50;
	scene.add(planeBack1);
	var planeFront1 = new THREE.Mesh(planeGeo, wallMat);
	planeFront1.position.z = 50;
	planeFront1.position.x = - 50;
	planeFront1.rotateY(Math.PI);
	scene.add(planeFront1);
	//lights
	var width = 50;
	var height = 100;
	var intensity = 5;
	RectAreaLightUniformsLib.init();
	var redRectLight = new THREE.RectAreaLight(0x9aaeff, intensity, width, height);
	redRectLight.position.set(- 99, 5, 0);
	redRectLight.lookAt(0, 5, 0);
	scene.add(redRectLight);
	var redRectLightHelper = new THREE.RectAreaLightHelper(redRectLight, 0xffffff);
	redRectLight.add(redRectLightHelper);
	render();
}
function updateCubeMap() {
	//disable specular highlights on walls in the environment map
	wallMat.roughness = 1;
	groundPlane.visible = false;
	cubeCamera.position.copy(groundPlane.position);
	cubeCamera.update(renderer, scene);
	wallMat.roughness = 0.6;
	groundPlane.visible = true;
	render();
}
function render() {
	renderer.render(scene, camera);
}

}
