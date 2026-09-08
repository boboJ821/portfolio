import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import type { GalleryProject } from '@/data/galleryProjects';
import { galleryConfig } from './galleryConfig';
import type { GalleryMotionState } from './useVirtualScroll';
import vertexShader from './shaders/projectVertex.glsl?raw';
import fragmentShader from './shaders/projectFragment.glsl?raw';

type ProjectCardProps = {
  index: number;
  project: GalleryProject;
  motion: React.MutableRefObject<GalleryMotionState>;
};

const ProjectCard = ({ index, project, motion }: ProjectCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useLoader(THREE.TextureLoader, project.image);

  useEffect(() => {
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = galleryConfig.textureAnisotropy;
    texture.needsUpdate = true;
  }, [texture]);

  const uniforms = useMemo(() => {
    const image = texture.image as {
      naturalWidth?: number;
      naturalHeight?: number;
      width?: number;
      height?: number;
    };

    return {
      uTexture: { value: texture },
      uTextureSize: {
        value: new THREE.Vector2(
          image?.naturalWidth || image?.width || 1,
          image?.naturalHeight || image?.height || 1,
        ),
      },
      uPlaneSize: {
        value: new THREE.Vector2(galleryConfig.cardWidth, galleryConfig.cardHeight),
      },
      uWidth: { value: galleryConfig.cardWidth },
      uBaseCurve: { value: galleryConfig.baseCurvature },
      uVelocity: { value: 0 },
      uBendStrength: { value: galleryConfig.bendStrength },
      uVerticalBendInfluence: { value: galleryConfig.verticalBendInfluence },
      uMaxBend: { value: galleryConfig.maxBend },
      uOpacity: { value: 1 },
    };
  }, [texture]);

  useFrame(() => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    const distance = index - motion.current.current;
    const absoluteDistance = Math.abs(distance);
    const depth = -Math.pow(absoluteDistance, galleryConfig.depthPower)
      * galleryConfig.depthStrength;
    const rotationY = THREE.MathUtils.clamp(
      -distance * galleryConfig.rotationStrength,
      -galleryConfig.maxRotation,
      galleryConfig.maxRotation,
    );
    const scaleReduction = Math.min(
      absoluteDistance * galleryConfig.scaleFalloff,
      galleryConfig.maxScaleReduction,
    );
    const scale = 1 - scaleReduction;
    const opacity = Math.max(
      galleryConfig.minimumOpacity,
      1 - absoluteDistance * galleryConfig.opacityFalloff,
    );
    const normalizedVelocity = THREE.MathUtils.clamp(
      motion.current.smoothedVelocity * galleryConfig.velocityMultiplier,
      -galleryConfig.maxVelocity,
      galleryConfig.maxVelocity,
    );

    mesh.position.set(distance * galleryConfig.cardSpacing, 0, depth);
    mesh.rotation.set(0, rotationY, 0);
    mesh.scale.setScalar(scale);
    mesh.visible = absoluteDistance <= galleryConfig.visibleDistance;

    material.uniforms.uVelocity.value = normalizedVelocity;
    material.uniforms.uOpacity.value = opacity;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry
        args={[
          galleryConfig.cardWidth,
          galleryConfig.cardHeight,
          galleryConfig.geometrySegmentsX,
          galleryConfig.geometrySegmentsY,
        ]}
      />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default ProjectCard;
