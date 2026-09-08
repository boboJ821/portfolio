import { type RefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { galleryConfig } from './galleryConfig';

export type GalleryMotionState = {
  target: number;
  current: number;
  previous: number;
  velocity: number;
  smoothedVelocity: number;
};

export const useVirtualScroll = (
  containerRef: RefObject<HTMLElement>,
  projectCount: number,
  enabled = true,
) => {
  const initial = THREE.MathUtils.clamp(
    galleryConfig.initialProgress,
    0,
    Math.max(projectCount - 1, 0),
  );
  const motion = useRef<GalleryMotionState>({
    target: initial,
    current: initial,
    previous: initial,
    velocity: 0,
    smoothedVelocity: 0,
  });

  useEffect(() => {
    const element = containerRef.current;
    if (!enabled || !element || projectCount < 2) return undefined;

    const maxProgress = projectCount - 1;
    const handleWheel = (event: WheelEvent) => {
      const state = motion.current;
      const movingBackward = event.deltaY < 0;
      const movingForward = event.deltaY > 0;
      const atStart = state.target <= 0.0001;
      const atEnd = state.target >= maxProgress - 0.0001;

      // The gallery is embedded in a longer portfolio. Release the wheel at
      // both ends so visitors can continue to the surrounding sections.
      if ((atStart && movingBackward) || (atEnd && movingForward)) return;

      if (galleryConfig.captureWheel) event.preventDefault();
      state.target = THREE.MathUtils.clamp(
        state.target + event.deltaY * galleryConfig.wheelSensitivity,
        0,
        maxProgress,
      );
    };

    element.addEventListener('wheel', handleWheel, {
      passive: !galleryConfig.captureWheel,
    });

    return () => element.removeEventListener('wheel', handleWheel);
  }, [containerRef, enabled, projectCount]);

  return motion;
};
