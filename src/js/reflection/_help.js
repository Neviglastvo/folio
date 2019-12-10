export let worldposReplace = `
	#define BOX_PROJECTED_ENV_MAP
	#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )
	vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );
	#ifdef BOX_PROJECTED_ENV_MAP
	vWorldPosition = worldPosition.xyz;
	#endif
	#endif
    `,
    envmapPhysicalParsReplace = `
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
