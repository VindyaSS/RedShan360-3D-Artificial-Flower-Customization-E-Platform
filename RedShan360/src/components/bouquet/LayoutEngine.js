/**
 * LayoutEngine.js
 * Contains the mathematical algorithms for automatic bouquet formation,
 * golden spiral dome coordinates, heart shapes, spirals, and collision relaxation.
 */

// Core Dome Constants (Tighter Florist Bouquet Bounds)
export const R_MAX_CLASSIC = 1.45;
export const R_MAX_SPIRAL = 1.55;
export const R_DOME = 2.8;
export const Y_MAX = 4.2;
export const Y_BASE = Y_MAX - R_DOME; // 1.4

// Configurable density parameter (smaller = tighter packing, default: 0.70)
const bouquetDensity = 0.70;

/**
 * Deterministic pseudo-random helper function (seed-based)
 * Returns a consistent float in range [0, 1) to prevent React re-render jitter.
 */
function pseudoRandom(seed) {
  const x = Math.sin(Number(seed) * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Calculates the dynamic maximum radius based on current flower count
 * Ensures small and medium bouquets sit in a compact, dense florist cluster.
 */
export function getMaxRadius(totalCount, bindingStyle = 'classic-dome', sizeConfig = {}) {
  const radiusMultiplier = Number(sizeConfig?.radiusMultiplier) || 1.0;
  const baseRMax = (bindingStyle === 'spiral-handtied' ? R_MAX_SPIRAL : R_MAX_CLASSIC) * bouquetDensity;
  const countScale = Math.min(1.0, Math.pow(Math.max(1, totalCount) / 16.0, 0.45));
  return Math.max(0.35, baseRMax * countScale * radiusMultiplier);
}

/**
 * Calculates the exact height Y on the unified hemisphere dome surface
 * based on the radial distance r from the center of the bouquet.
 */
export function getDomeHeight(r, bindingStyle = 'classic-dome', sizeConfig = {}, totalCount = 10) {
  const radiusMultiplier = Number(sizeConfig?.radiusMultiplier) || 1.0;
  const heightMultiplier = Number(sizeConfig?.heightMultiplier) || 1.0;

  const scaledRDome = Math.max(0.001, R_DOME * radiusMultiplier);
  const scaledYMax = Y_MAX * heightMultiplier;
  const scaledYBase = scaledYMax - scaledRDome;

  const R_max = getMaxRadius(totalCount, bindingStyle, sizeConfig);
  const safeR = Math.min(
    Math.max(0, Number(r) || 0),
    R_max,
    scaledRDome
  );

  const domeTerm = Math.max(0, scaledRDome * scaledRDome - safeR * safeR);
  return scaledYBase + Math.sqrt(domeTerm);
}

/**
 * Determines the layout layer. Kept for backwards compatibility.
 */
export function getFlowerLayer(stemId, category) {
  if (category === 'decorative-foliage' || stemId === 'faux-lavender') {
    return 'outer';
  }
  if (stemId === 'blushing-peony' || stemId === 'ethereal-orchid' || stemId === '10' || stemId === '7') {
    return 'center';
  }
  return 'mid';
}

/**
 * ROUND layout generator (ultra-dense florist rounded dome).
 */
export function generateRoundLayout(index, totalCount, bindingStyle = 'classic-dome', sizeConfig = {}) {
  const R_max = getMaxRadius(totalCount, bindingStyle, sizeConfig);
  const goldenAngle = 2.39996322978;

  let x = 0;
  let z = 0;
  let r = 0;

  if (totalCount === 1) {
    x = 0;
    z = 0;
    r = 0;
  } else if (index === 0) {
    // Focal central bloom
    x = 0;
    z = 0;
    r = 0;
  } else {
    // Area-weighted radial distribution prevents empty central voids
    const t = index / Math.max(1, totalCount - 0.5);
    r = R_max * Math.sqrt(t);
    const theta = index * goldenAngle;
    x = r * Math.cos(theta);
    z = r * Math.sin(theta);
  }

  // Base dome height + deterministic natural height micro-variation
  const baseHeight = getDomeHeight(r, bindingStyle, sizeConfig, totalCount);
  const heightJitter = (pseudoRandom(index * 17 + 3) - 0.5) * 0.14;
  const y = baseHeight + heightJitter;

  // Gentle upright divergence (8 to 15 degrees max tilt)
  const tiltFactor = Math.min(1.0, r / Math.max(0.1, R_max));
  const rotY = Math.atan2(x, z || 0.0001);
  const rotX = (tiltFactor * 0.20) + ((pseudoRandom(index * 23 + 5) - 0.5) * 0.08); // ~8 to 15 deg max tilt
  const rotZ = (pseudoRandom(index * 31 + 7) - 0.5) * 0.22;

  return {
    position: [x, y, z],
    rotation: [rotX, rotY, rotZ]
  };
}

/**
 * HEART layout generator (compact filled 3D heart shape).
 */
export function generateHeartLayout(index, totalCount, bindingStyle = 'classic-dome', sizeConfig = {}) {
  const heightMultiplier = Number(sizeConfig?.heightMultiplier) || 1.0;
  const R_max = getMaxRadius(totalCount, bindingStyle, sizeConfig);
  const yCenter = Y_BASE + (Y_MAX - Y_BASE) * heightMultiplier * 0.62;

  if (totalCount <= 3) {
    // 1-3 flowers: ultra-compact center cluster
    const offsetAngle = (2 * Math.PI / Math.max(1, totalCount)) * index;
    const rOffset = totalCount > 1 ? 0.20 : 0.0;
    const x = rOffset * Math.cos(offsetAngle);
    const y = yCenter + rOffset * Math.sin(offsetAngle);
    const z = 0.0;
    const rotZ = (pseudoRandom(index * 11) - 0.5) * 0.18;
    return {
      position: [x, y, z],
      rotation: [0, 0, rotZ]
    };
  } else if (totalCount <= 8) {
    // 4-8 flowers: tight heart contour
    const theta = (2 * Math.PI / totalCount) * index + Math.PI / 2;
    const heartX = Math.pow(Math.sin(theta), 3);
    const heartY = (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta)) / 16.0;

    const scale = R_max * 0.70;
    const x = scale * heartX;
    const y = yCenter + scale * heartY + scale * 0.08;
    const z = -0.12 * scale;

    const rotY = Math.atan2(x, 5.0);
    const rotX = -Math.atan2(y - yCenter, 5.0) + Math.PI / 2;
    const rotZ = (pseudoRandom(index * 19) - 0.5) * 0.18;

    return {
      position: [x, y, z],
      rotation: [rotX * 0.15, rotY, rotZ]
    };
  } else {
    // 9+ flowers: filled multi-layered heart
    const t = index / (totalCount - 1);
    const r = R_max * Math.sqrt(t);
    const goldenAngle = 2.39996322978;
    const theta = index * goldenAngle;

    const heartX = Math.pow(Math.sin(theta), 3);
    const heartY = (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta)) / 16.0;

    const scale = 0.70;
    const x = r * scale * heartX;
    const y = yCenter + r * scale * heartY + r * 0.08;
    const z = - (r * r) / (3.5 * Math.max(0.1, R_max));

    const rotY = Math.atan2(x, z + 5.0);
    const rotX = -Math.atan2(y - yCenter, 5.0) + Math.PI / 2;
    const rotZ = (pseudoRandom(index * 29) - 0.5) * 0.20;

    return {
      position: [x, y, z],
      rotation: [rotX * 0.15, rotY, rotZ]
    };
  }
}

/**
 * SPIRAL layout generator (compact winding florist spiral).
 */
export function generateSpiralLayout(index, totalCount, bindingStyle = 'classic-dome', sizeConfig = {}) {
  const heightMultiplier = Number(sizeConfig?.heightMultiplier) || 1.0;
  const R_max = getMaxRadius(totalCount, bindingStyle, sizeConfig);

  const t = totalCount > 1 ? index / (totalCount - 1) : 0.0;
  const r = R_max * Math.pow(t, 0.55);
  const theta = index * 0.85; // Winding progression

  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);

  // Height progresses downwards as spiral moves outwards
  const yStart = Y_BASE + (Y_MAX - Y_BASE) * heightMultiplier * 0.95;
  const heightJitter = (pseudoRandom(index * 13 + 2) - 0.5) * 0.14;
  const y = yStart - (yStart - Y_BASE) * 0.30 * t + heightJitter;

  const rotY = Math.atan2(x, z || 0.0001);
  const rotX = (Math.PI / 8.0) * t;
  const rotZ = (pseudoRandom(index * 37 + 4) - 0.5) * 0.18;

  return {
    position: [x, y, z],
    rotation: [rotX, rotY, rotZ]
  };
}

/**
 * Runs a gentle relaxation pass to allow soft bloom touch & prevent severe clipping
 * without pushing flowers apart into wide gaps.
 */
export function relaxOverlaps(flowers, stemsDatabaseOrOptions, iterations = 4, sizeConfig = {}) {
  let bindingStyle = 'classic-dome';
  let stemsDatabase = [];
  let sc = sizeConfig;
  let bStyle = 'ROUND';

  if (stemsDatabaseOrOptions && typeof stemsDatabaseOrOptions === 'object' && !Array.isArray(stemsDatabaseOrOptions)) {
    bindingStyle = stemsDatabaseOrOptions.bindingStyle || 'classic-dome';
    stemsDatabase = stemsDatabaseOrOptions.stemsDatabase || [];
    sc = stemsDatabaseOrOptions.sizeConfig || {};
    bStyle = stemsDatabaseOrOptions.bouquetStyle || 'ROUND';
  } else {
    stemsDatabase = stemsDatabaseOrOptions || [];
    bindingStyle = flowers.find(f => f.bindingStyle || f.style)?.bindingStyle || flowers.find(f => f.style)?.style || 'classic-dome';
    bStyle = flowers.find(f => f.bouquetStyle)?.bouquetStyle || 'ROUND';
  }

  const result = flowers.map(f => ({
    ...f,
    position: [...f.position],
    rotation: [...f.rotation],
    targetPosition: f.targetPosition ? [...f.targetPosition] : [...f.position]
  }));

  const R_max = getMaxRadius(result.length, bindingStyle, sc);
  // Low push force so flowers stay close together and do not push apart into wide gaps
  const pushForce = 0.02;

  const getRadius = (stemId) => {
    const dbItem = stemsDatabase.find(s => String(s.id) === String(stemId));
    let baseRadius = 0.45;
    if (!dbItem) baseRadius = 0.40;
    else if (dbItem.category === 'decorative-foliage') baseRadius = 0.35;
    else if (dbItem.id === 'blushing-peony' || dbItem.name?.toLowerCase().includes('lily')) baseRadius = 0.55;
    
    return baseRadius;
  };

  for (let step = 0; step < iterations; step++) {
    for (let i = 0; i < result.length; i++) {
      const f1 = result[i];
      const r1 = getRadius(f1.stemId);

      for (let j = i + 1; j < result.length; j++) {
        const f2 = result[j];
        const r2 = getRadius(f2.stemId);

        // Check horizontal distance
        const dx = f2.position[0] - f1.position[0];
        const dz = f2.position[2] - f1.position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        // Allow close bloom nestling (0.35 threshold)
        const minDist = (r1 + r2) * 0.35;

        if (dist < minDist && dist > 0.001) {
          const overlap = minDist - dist;
          const px = (dx / dist) * overlap;
          const pz = (dz / dist) * overlap;

          if (f1.isManuallyEdited && !f2.isManuallyEdited) {
            f2.position[0] += px * (pushForce * 2.0);
            f2.position[2] += pz * (pushForce * 2.0);
          } else if (!f1.isManuallyEdited && f2.isManuallyEdited) {
            f1.position[0] -= px * (pushForce * 2.0);
            f1.position[2] -= pz * (pushForce * 2.0);
          } else if (!f1.isManuallyEdited && !f2.isManuallyEdited) {
            f1.position[0] -= px * pushForce;
            f1.position[2] -= pz * pushForce;
            f2.position[0] += px * pushForce;
            f2.position[2] += pz * pushForce;
          }
        }
      }
    }

    // Apply limits, spring targets, and recompute Y coordinates
    for (let i = 0; i < result.length; i++) {
      const f = result[i];
      if (f.isManuallyEdited) continue;

      let x = f.position[0];
      let z = f.position[2];
      const r = Math.sqrt(x * x + z * z);

      if (bStyle === 'ROUND') {
        if (r > R_max) {
          x = (x / r) * R_max;
          z = (z / r) * R_max;
          f.position[0] = x;
          f.position[2] = z;
        }

        const currentR = Math.sqrt(x * x + z * z);
        const y = getDomeHeight(currentR, bindingStyle, sc, result.length);
        const heightJitter = (pseudoRandom(i * 17 + 3) - 0.5) * 0.14;
        f.position[1] = y + heightJitter;

        const tiltFactor = Math.min(1.0, currentR / Math.max(0.1, R_max));
        const rotY = Math.atan2(x, z || 0.0001);
        const rotX = (tiltFactor * 0.20) + ((pseudoRandom(i * 23 + 5) - 0.5) * 0.08);
        const rotZ = (pseudoRandom(i * 31 + 7) - 0.5) * 0.22;
        f.rotation = [rotX, rotY, rotZ];
      } else {
        // HEART or SPIRAL: pull towards generated layout targets to prevent shape degradation
        if (f.targetPosition) {
          f.position[0] += (f.targetPosition[0] - f.position[0]) * 0.15;
          f.position[1] += (f.targetPosition[1] - f.position[1]) * 0.15;
          f.position[2] += (f.targetPosition[2] - f.position[2]) * 0.15;
        }
      }
    }
  }

  return result;
}

/**
 * Arranges the bouquet layout based on binding style and bouquet style.
 */
export function arrangeBouquet(flowers, styleOrOptions = 'classic-dome', stemsDatabase, sizeConfig = {}, bouquetStyle = 'ROUND') {
  let bindingStyle = 'classic-dome';
  let db = stemsDatabase;
  let sc = sizeConfig;
  let bStyle = bouquetStyle;

  if (styleOrOptions && typeof styleOrOptions === 'object' && !Array.isArray(styleOrOptions)) {
    bindingStyle = styleOrOptions.bindingStyle || 'classic-dome';
    db = styleOrOptions.stemsDatabase || [];
    sc = styleOrOptions.sizeConfig || {};
    bStyle = styleOrOptions.bouquetStyle || 'ROUND';
  } else {
    db = stemsDatabase || [];
    bindingStyle = styleOrOptions;
  }

  const nonEdited = flowers.filter(f => !f.isManuallyEdited);
  const totalCount = nonEdited.length;

  const positionedFlowers = flowers.map((flower) => {
    if (flower.isManuallyEdited) {
      return {
        ...flower,
        bindingStyle,
        bouquetStyle: flower.bouquetStyle || bStyle
      };
    }

    const idx = nonEdited.findIndex(f => f.id === flower.id);
    let layout;

    if (bStyle === 'HEART') {
      layout = generateHeartLayout(idx, totalCount, bindingStyle, sc);
    } else if (bStyle === 'SPIRAL') {
      layout = generateSpiralLayout(idx, totalCount, bindingStyle, sc);
    } else {
      layout = generateRoundLayout(idx, totalCount, bindingStyle, sc);
    }

    return {
      ...flower,
      position: layout.position,
      rotation: layout.rotation,
      scale: flower.scale || [1, 1, 1],
      targetPosition: [...layout.position], // Temporary target anchor for overlap pass
      bindingStyle,
      bouquetStyle: bStyle
    };
  });

  return relaxOverlaps(positionedFlowers, {
    bindingStyle,
    stemsDatabase: db,
    sizeConfig: sc,
    bouquetStyle: bStyle
  }, 4);
}


