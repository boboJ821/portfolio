export const galleryConfig = {
  // Virtual scroll
  initialProgress: 1,
  wheelSensitivity: 0.00135,
  damping: 7.8,
  captureWheel: true,

  // Card geometry and layout
  cardWidth: 5.2,
  cardHeight: 3.3,
  cardSpacing: 5.8,
  geometrySegmentsX: 48,
  geometrySegmentsY: 32,
  visibleDistance: 3.5,

  // Perspective layout
  depthStrength: 0.82,
  depthPower: 1.22,
  rotationStrength: 0.2,
  maxRotation: 0.42,
  scaleFalloff: 0.075,
  maxScaleReduction: 0.18,
  opacityFalloff: 0.19,
  minimumOpacity: 0.16,

  // Camera
  cameraFov: 40,
  cameraZ: 10,
  cameraY: 0,
  cameraNear: 0.1,
  cameraFar: 100,

  // Shader deformation
  baseCurvature: 0.075,
  velocityMultiplier: 28,
  bendStrength: 0.34,
  verticalBendInfluence: 0.07,
  maxVelocity: 1,
  maxBend: 0.36,
  velocitySmoothing: 8.5,

  // Rendering
  backgroundColor: '#0d0d0f',
  maxPixelRatio: 1.65,
  textureAnisotropy: 8,
  showGrid: false,
  gridSize: 30,
  gridDivisions: 30,
  gridY: -2.8,

  // Progressive enhancement
  desktopMinWidth: 900,
  preloadRootMargin: '120% 0px',
} as const;

export type GalleryConfig = typeof galleryConfig;
