import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import fragmentShader from './shaders/terrainFragment.glsl?raw'
import vertexShader from './shaders/terrainVertex.glsl?raw'

const CAMERA_RADIUS = 3.1
const CAMERA_START_ANGLE = -Math.PI / 4

const WaveTerrain = () => {
  const materialRef = useRef()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#020106').multiplyScalar(1.2) },
      uColorB: { value: new THREE.Color('#1a0934').multiplyScalar(1.2) },
      uColorC: { value: new THREE.Color('#4b1e77').multiplyScalar(1.2) },
      uColorD: { value: new THREE.Color('#9b4dca').multiplyScalar(0.9) },
      uColorE: { value: new THREE.Color('#b76eff') },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.elapsedTime * 0.05
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
      <planeGeometry args={[30, 30, 120, 120]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

const CameraController = () => {
  const { camera } = useThree()

  useEffect(() => {
    const x = Math.sin(CAMERA_START_ANGLE) * CAMERA_RADIUS
    const z = Math.cos(CAMERA_START_ANGLE) * CAMERA_RADIUS
    camera.position.set(x, 2.2, z)
    camera.lookAt(0, -0.3, 0)
  }, [camera])

  useEffect(() => {
    let frameId

    const updateCamera = () => {
      frameId = undefined
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = scrollRange > 0 ? window.scrollY / scrollRange : 0
      const angle = CAMERA_START_ANGLE + (scrollProgress * Math.PI) / 4

      gsap.to(camera.position, {
        x: Math.sin(angle) * CAMERA_RADIUS,
        y: 2.2 + scrollProgress * 0.9,
        z: Math.cos(angle) * CAMERA_RADIUS,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => camera.lookAt(scrollProgress * 0.8, -0.3, 0),
      })
    }

    const handleScroll = () => {
      if (frameId === undefined) frameId = requestAnimationFrame(updateCamera)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameId !== undefined) cancelAnimationFrame(frameId)
      gsap.killTweensOf(camera.position)
    }
  }, [camera])

  return null
}

const Scene = () => {
  const [pauseAnimation, setPauseAnimation] = useState(false)

  useEffect(() => {
    const projectsSection = document.getElementById('works')
    if (!projectsSection) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setPauseAnimation(entry.isIntersecting && entry.intersectionRatio > 0.15),
      { threshold: [0, 0.15, 0.6] },
    )
    observer.observe(projectsSection)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed left-0 top-0 h-full w-full bg-[#030108]" aria-hidden="true">
      <Canvas
        camera={{ position: [-2.2, 2.2, 2.2], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={pauseAnimation ? 'never' : 'always'}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        style={{ position: 'absolute' }}
      >
        <WaveTerrain />
        <CameraController />
      </Canvas>
    </div>
  )
}

export default Scene
