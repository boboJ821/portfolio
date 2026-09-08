import {
  Component,
  Suspense,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { galleryProjects } from '@/data/galleryProjects';
import { galleryConfig } from './galleryConfig';
import ProjectCard from './ProjectCard';
import { useVirtualScroll, type GalleryMotionState } from './useVirtualScroll';
import './ProjectGallery.css';

type GalleryBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

class GalleryBoundary extends Component<GalleryBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const StaticGallery = () => (
  <div className="project-gallery__fallback" aria-label="静态作品画廊">
    {galleryProjects.slice(0, 3).map((project, index) => (
      <img
        key={project.id}
        src={project.image}
        alt={project.title}
        loading={index === 1 ? 'eager' : 'lazy'}
      />
    ))}
  </div>
);

const GalleryMotion = ({
  motion,
}: {
  motion: React.MutableRefObject<GalleryMotionState>;
}) => {
  useFrame((_, deltaTime) => {
    const state = motion.current;
    state.current = THREE.MathUtils.damp(
      state.current,
      state.target,
      galleryConfig.damping,
      deltaTime,
    );
    state.velocity = state.current - state.previous;
    state.previous = state.current;
    state.smoothedVelocity = THREE.MathUtils.damp(
      state.smoothedVelocity,
      state.velocity,
      galleryConfig.velocitySmoothing,
      deltaTime,
    );
  }, -1);

  return null;
};

const GalleryScene = ({
  motion,
}: {
  motion: React.MutableRefObject<GalleryMotionState>;
}) => (
  <>
    <color attach="background" args={[galleryConfig.backgroundColor]} />
    <GalleryMotion motion={motion} />

    {galleryConfig.showGrid && (
      <gridHelper
        args={[
          galleryConfig.gridSize,
          galleryConfig.gridDivisions,
          '#353538',
          '#1d1d20',
        ]}
        position={[0, galleryConfig.gridY, 0]}
      />
    )}

    {galleryProjects.map((project, index) => (
      <ProjectCard
        key={project.id}
        index={index}
        project={project}
        motion={motion}
      />
    ))}
  </>
);

const ProjectGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canUse3D, setCanUse3D] = useState(false);
  const [shouldMount, setShouldMount] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const motion = useVirtualScroll(
    containerRef,
    galleryProjects.length,
    canUse3D && shouldMount,
  );

  useEffect(() => {
    const desktopMedia = window.matchMedia(
      '(min-width: ' + galleryConfig.desktopMinWidth + 'px)',
    );
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateCapability = () => {
      setCanUse3D(desktopMedia.matches && !motionMedia.matches);
    };

    updateCapability();
    desktopMedia.addEventListener?.('change', updateCapability);
    motionMedia.addEventListener?.('change', updateCapability);

    return () => {
      desktopMedia.removeEventListener?.('change', updateCapability);
      motionMedia.removeEventListener?.('change', updateCapability);
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !canUse3D || !('IntersectionObserver' in window)) {
      setShouldMount(canUse3D);
      setIsVisible(canUse3D);
      return undefined;
    }

    const preloadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      galleryProjects.forEach((project) => {
        useLoader.preload(THREE.TextureLoader, project.image);
      });
      setShouldMount(true);
      preloadObserver.disconnect();
    }, { rootMargin: galleryConfig.preloadRootMargin });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.01 });

    preloadObserver.observe(element);
    visibilityObserver.observe(element);

    return () => {
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [canUse3D]);

  return (
    <div
      ref={containerRef}
      className="project-gallery"
      role="region"
      aria-label="使用鼠标滚轮连续浏览三维作品画廊"
    >
      {(!canUse3D || !shouldMount) && <StaticGallery />}

      {canUse3D && shouldMount && (
        <GalleryBoundary fallback={<StaticGallery />}>
          <Canvas
            frameloop={isVisible ? 'always' : 'never'}
            dpr={[1, galleryConfig.maxPixelRatio]}
            camera={{
              fov: galleryConfig.cameraFov,
              position: [0, galleryConfig.cameraY, galleryConfig.cameraZ],
              near: galleryConfig.cameraNear,
              far: galleryConfig.cameraFar,
            }}
            gl={{
              alpha: false,
              antialias: true,
              powerPreference: 'high-performance',
            }}
          >
            <Suspense fallback={null}>
              <GalleryScene motion={motion} />
            </Suspense>
          </Canvas>
        </GalleryBoundary>
      )}
    </div>
  );
};

export default ProjectGallery;
