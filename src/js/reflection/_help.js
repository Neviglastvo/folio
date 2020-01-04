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
	`,
	cloudFragmentShader = `
	precision highp float;

	varying vec2 vUv;
	varying float vElevation;
	uniform float uHue;

	float hue2rgb(float f1, float f2, float hue) {
			if (hue < 0.0)
					hue += 1.0;
			else if (hue > 1.0)
					hue -= 1.0;
			float res;
			if ((6.0 * hue) < 1.0)
					res = f1 + (f2 - f1) * 6.0 * hue;
			else if ((2.0 * hue) < 1.0)
					res = f2;
			else if ((3.0 * hue) < 2.0)
					res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
			else
					res = f1;
			return res;
	}

	vec3 hsl2rgb(vec3 hsl) {
			vec3 rgb;

			if (hsl.y == 0.0) {
					rgb = vec3(hsl.z); // Luminance
			} else {
					float f2;

					if (hsl.z < 0.5)
							f2 = hsl.z * (1.0 + hsl.y);
					else
							f2 = hsl.z + hsl.y - hsl.y * hsl.z;

					float f1 = 2.0 * hsl.z - f2;

					rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
					rgb.g = hue2rgb(f1, f2, hsl.x);
					rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
			}
			return rgb;
	}

	vec3 hsl2rgb(float h, float s, float l) {
			return hsl2rgb(vec3(h, s, l));
	}

	void main () {
		float hue = uHue + vElevation * .05;
		hue += smoothstep(.6, 1.0, vElevation) * .2;

		float highlight = sin ( smoothstep(.6, .91, vElevation) * 3.14 );

		hue += highlight * .1;

		float saturation = vElevation * 1.1;
		float darkborders = sin(vUv.x * 3.14) * sin(vUv.y * 3.14);
		float brightness = pow( darkborders * .3 + vElevation, 3.5);
		brightness *= .5 + smoothstep(.6, 1.0, vElevation) * .5;

		brightness += highlight * .2;
		vec3 col = hsl2rgb(hue, saturation, brightness);

		gl_FragColor = vec4(col, 1.0);
	}`,
	cloudVertexShader = `
	attribute vec3 position;
		attribute vec2 uv;
		uniform mat4 projectionMatrix;
		uniform mat4 modelViewMatrix;
		uniform mat3 normalMatrix;
		uniform float time;
		uniform vec2 mousePosition;
		varying vec2 vUv;
		varying float vElevation;

		varying float vDisplacement;

		float PI = 3.141592;

		float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
		vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
		vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

		float rand(vec2 co){
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
		}

		float noise(vec3 p){
				vec3 a = floor(p);
				vec3 d = p - a;
				d = d * d * (3.5 - 2.5 * d);

				vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
				vec4 k1 = perm(b.xyxy);
				vec4 k2 = perm(k1.xyxy + b.zzww);

				vec4 c = k2 + a.zzzz;
				vec4 k3 = perm(c);
				vec4 k4 = perm(c + 1.0);

				vec4 o1 = fract(k3 * (1.0 / 41.0));
				vec4 o2 = fract(k4 * (1.0 / 41.0));

				vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
				vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

				return o4.y * d.y + o4.x * (1.0 - d.y);
		}

		float fbm(vec2 pos, float t){
			float r;
						r 	= 	noise( vec3( pos, t ) * 01.0 ) * 01.0000;
						r 	+= 	noise( vec3( pos, t ) * 02.0 ) * 00.5000;
						r 	+= 	noise( vec3( pos, t ) * 04.0 ) * 00.2500;
						r 	+= 	noise( vec3( pos, t ) * 08.0 ) * 00.1250;
						r 	+= 	noise( vec3( pos, t ) * 16.0 ) * 00.0625;
			return r / 1.9375;
		}

		void main() {
			vUv = uv;
			float t = time*.3 + sin(time) * .2;
			float t2 = time*.1 + cos(time * .2) * .05;
			vec2 pos = vUv * 2.0;

			vec2 displacement = vec2(t, t2) + (2.0 + mousePosition * .5);

			float p = fbm( displacement * 2.0 + pos * 2.0, t * 1.1);
			vec2 pos2 = pos + vec2(p);

			float q = fbm( displacement * 3.0 + pos2 * 2.0, t * 1.23);
			vec2 pos3 = pos + vec2(q);

			float r = fbm( displacement * 4.0 + pos3 * 2.0, t * 1.23);
			vec2 pos4 = pos + vec2(r);

			float s = fbm( displacement * 5.0 + pos4 * 2.0, t * 1.32);

			float d = length( vUv - (.5 + mousePosition));

			float ratioElevation = pow( (1.0 - d), 5.0);

			vElevation = s + .1 + ratioElevation * .2;

			vElevation *= 1.0 - smoothstep(0.0, 1.0, length(uv - .5));

			vec3 finalPos = position;
			finalPos.z = -30.0 + pow( s + ratioElevation, 2.0) * 25.0;

			gl_Position = projectionMatrix * modelViewMatrix * vec4 ( finalPos, 1.0);
		}
	`;
