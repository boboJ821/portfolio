import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, SoftShadows } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

function WaveTerrain() {
  const meshRef = useRef()
  const materialRef = useRef()

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime() * 0.05 // 降低动画速度
    }
  })

  const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vNormal;
    uniform float uTime;

    //	Classic Perlin 3D Noise 
    //	by Stefan Gustavson
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec3 P){
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }

    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float noiseFreq = 0.08;    // 进一步降低频率，使沙丘更大
      float noiseAmp = 2.2;      // 增加振幅，加强起伏
      
      // 主要沙丘形态
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z * noiseFreq + uTime);
      float noise1 = cnoise(noisePos);
      
      // 添加大尺度变化
      float largeScale = cnoise(noisePos * 0.5) * 2.0;
      
      // 细节变化
      float noise2 = cnoise(noisePos * 1.2) * 0.3;
      float noise3 = cnoise(noisePos * 1.8) * 0.1;
      
      // 组合不同尺度的噪声
      float baseElevation = noise1 + largeScale;
      float details = noise2 + noise3;
      
      // 使用平滑函数创建更有机的形态
      float elevation = (baseElevation * 0.7 + details * 0.3) * noiseAmp;
      elevation = smoothstep(-1.0, 1.0, elevation) * noiseAmp * 0.7;
      
      // 添加渐进的高度衰减（边缘更平缓）
      float distanceFromCenter = length(pos.xy) / 12.0;
      float falloff = 1.0 - smoothstep(0.0, 1.0, distanceFromCenter);
      elevation *= falloff;
      
      pos.z += elevation;
      
      // 计算法线
      vec3 transformed = pos;
      vec3 objectNormal = normalize(normal);
      vNormal = normalMatrix * objectNormal;
      
      vElevation = elevation * 0.4; // 进一步降低高度对颜色的影响
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  const fragmentShader = `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform vec3 uColorD;
    uniform vec3 uColorE;
    uniform float uTime;
    varying float vElevation;
    varying vec3 vNormal;

    // 添加辅助函数来创建柔和的色彩变化
    vec3 addColorVariation(vec3 baseColor, float factor) {
      float variation = sin(uTime * 0.2) * 0.1 + 0.9;
      return baseColor * variation * factor;
    }

    void main() {
      // 基础色彩定义
      vec3 deepPurple = addColorVariation(uColorA, 1.0);      // 深紫色底色
      vec3 midPurple = addColorVariation(uColorB, 1.1);       // 中紫色
      vec3 brightPurple = addColorVariation(uColorC, 1.2);    // 亮紫色
      vec3 highlightColor = uColorD;                          // 高光色
      vec3 edgeColor = uColorE;                               // 边缘光色
      
      // 基础颜色渐变
      vec3 color = deepPurple;
      
      // 主要颜色过渡
      float midTransition = smoothstep(-0.4, -0.1, vElevation);
      float brightTransition = smoothstep(0.2, 0.5, vElevation);
      
      // 添加细微的色相变化
      vec3 midTone = mix(
        midPurple,
        midPurple * vec3(1.0, 0.95, 1.05),
        sin(vElevation * 4.0) * 0.5 + 0.5
      );
      
      vec3 brightTone = mix(
        brightPurple,
        brightPurple * vec3(1.1, 1.0, 1.2),
        cos(vElevation * 3.0) * 0.5 + 0.5
      );
      
      color = mix(color, midTone, midTransition);
      color = mix(color, brightTone, brightTransition);
      
      // 光照效果
      vec3 light = normalize(vec3(1.0, 2.0, 1.5));
      float diffuse = max(0.0, dot(vNormal, light));
      color = mix(color * 0.2, color * 1.15, pow(diffuse, 1.3));
      
      // 边缘光效果
      float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
      vec3 fresnelColor = mix(edgeColor, edgeColor * vec3(1.2, 1.0, 1.4), fresnel);
      color += fresnelColor * fresnel * 0.4;
      
      // 高光效果
      float highlight = pow(max(0.0, dot(reflect(-light, vNormal), vec3(0.0, 0.0, 1.0))), 32.0);
      color += highlightColor * highlight * 0.4;
      
      // 顶部渐变
      float topHighlight = smoothstep(0.3, 0.6, vElevation);
      vec3 topColor = mix(
        highlightColor,
        highlightColor * vec3(1.1, 1.0, 1.3),
        topHighlight
      );
      color = mix(color, color + topColor * 0.25, topHighlight);
      
      // 整体色调调整
      color *= 1.1;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
      <planeGeometry args={[30, 30, 180, 180]} /> {/* 增加地形尺寸和细分 */}
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color('#020106').multiplyScalar(1.2) },  // 更深的底色
          uColorB: { value: new THREE.Color('#1A0934').multiplyScalar(1.2) },  // 带一点蓝的中紫色
          uColorC: { value: new THREE.Color('#4B1E77').multiplyScalar(1.2) },  // 主紫色
          uColorD: { value: new THREE.Color('#9B4DCA').multiplyScalar(0.9) }, // 高光色
          uColorE: { value: new THREE.Color('#B76EFF') }                      // 边缘光色
        }}
      />
    </mesh>
  )
}

function CameraController() {
  const { camera } = useThree()
  const radius = 3.1
  const startAngle = -Math.PI / 4
  
  useEffect(() => {
    const x = Math.sin(startAngle) * radius
    const z = Math.cos(startAngle) * radius
    camera.position.set(x, 2.2, z)
    camera.lookAt(0, -0.3, 0)
  }, [camera])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      
      // 减少圆弧范围到45度
      const angle = startAngle + (scrollPercent * Math.PI / 4)
      const newX = Math.sin(angle) * radius
      const newZ = Math.cos(angle) * radius
      
      gsap.to(camera.position, {
        x: newX,
        y: 2.2 + scrollPercent * 0.9, // 减少上升高度
        z: newZ,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          const lookAtX = scrollPercent * 0.8 // 减少视线移动范围
          camera.lookAt(lookAtX, -0.3, 0)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [camera])

  return null
}

export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#030108]">
      <Canvas
        camera={{ position: [-2.2, 2.2, 2.2], fov: 45 }}
        style={{ position: 'absolute' }}
        shadows
      >
        <fog attach="fog" args={['#030108', 4, 12]} /> {/* 调整雾效范围 */}
        <ambientLight intensity={0.2} /> {/* 增加环境光 */}
        <directionalLight 
          position={[2, 4, 2]} 
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight 
          position={[-2, 3, -2]} 
          intensity={0.7} 
          color="#4B1E77"
        />
        <spotLight
          position={[0, 5, 0]}
          intensity={0.6}
          angle={0.4}
          penumbra={1}
          color="#9B4DCA"
        />
        <pointLight
          position={[0, 4, 0]}
          intensity={0.5}
          color="#C17FFF"
          distance={8}
        />
        {/* 添加额外的边缘光源 */}
        <pointLight
          position={[3, 2, 3]}
          intensity={0.4}
          color="#C17FFF"
          distance={10}
        />
        <WaveTerrain />
        <CameraController />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 3}
        />
        <SoftShadows size={5} samples={24} focus={0.8} />
      </Canvas>
    </div>
  )
} 