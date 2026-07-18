export const BOUQUET_STYLE_CONFIG = {
  ROUND: {
    key: 'ROUND',
    label: 'Round',
    description: 'Traditional symmetric rounded dome arrangement',
    layoutGenerator: 'generateRoundLayout'
  },
  HEART: {
    key: 'HEART',
    label: 'Heart',
    description: 'Heart-shaped arrangement facing the front',
    layoutGenerator: 'generateHeartLayout'
  },
  SPIRAL: {
    key: 'SPIRAL',
    label: 'Spiral',
    description: 'Natural 3D spiral pattern winding outwards',
    layoutGenerator: 'generateSpiralLayout'
  }
};

export const BOUQUET_STYLE_OPTIONS = Object.values(BOUQUET_STYLE_CONFIG);
