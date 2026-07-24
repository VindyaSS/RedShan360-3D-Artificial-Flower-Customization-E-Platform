/**
 * LayoutEngine.js
 * Contains the mathematical algorithms for automatic bouquet formation,
 * golden spiral dome coordinates, heart shapes, spirals, and collision relaxation.
 */

// Core Dome Constants
export const R_MAX_CLASSIC = 2.8;
export const R_MAX_SPIRAL = 3.1;
export const R_DOME = 3.6;
export const Y_MAX = 4.6;
export const Y_BASE = Y_MAX - R_DOME; // 1.0

// Configurable density parameter (smaller = tighter packing, default: 0.75)
const bouquetDensity = 0.75;

/**
 * Calculates the exact height Y on the unified hemisphere dome surface
 * based on the radial distance r from the center of the bouquet.
 */
export function getDomeHeight(r, bindingStyle = 'classic-dome', sizeConfig = {}) {
  const radiusMultiplier = Number(sizeConfig?.radiusMultiplier) || 1.0;
  const heightMultiplier = Number(sizeConfig?.heightMultiplier) || 1.0;

  const scaledRDome = Math.max(0.001, R_DOME * radiusMultiplier);
  const scaledYMax = Y_MAX * heightMultiplier;
  const scaledYBase = scaledYMax - scaledRDome;

  const R_max = (bindingStyle === 'spiral-handtied' ? R_MAX_SPIRAL : R_MAX_CLASSIC) * bouquetDensity * radiusMultiplier;
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
 * ROUND layout generator (traditional symmetric dome).
 */
export function generateRoundLayout(index, totalCount, bindingStyle = 'classic-dome', sizeConfig = {}) {
  const radiusMultiplier = Number(sizeConfig?.radiusMultiplier) || 1.0;
  const heightMultiplier = Number(sizeConfig?.heightMultiplier) || 1.0;

  const R_max = (bindingStyle === 'spiral-handtied' ? R_MAX_SPIRAL : R_MAX_CLASSIC) * bouquetDensity * radiusMultiplier;
  const goldenAngle = 2.39996322978;

  const t = totalCount > 1 ? index / (totalCount - 1) : 0.0;
  const r = R_max * Math.pow(t, 0.65);
  const theta = index * goldenAngle;

  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);
  const y = getDomeHeight(r, bindingStyle, sizeConfig);

  const scaledRDome = Math.max(0.001, R_DOME * radiusMultiplier);
  const scaledYMax = Y_MAX * heightMultiplier;
  const scaledYBase = scaledYMax - scaledRDome;

  const dx = x;
  const dy = y - scaledYBase;
  const dz = z;
  const rotY = Math.atan2(dx, dz);
  const rotX = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) + Math.PI / 2;

  return {
    position: [x, y, z],
    rotation: [rotX * 0.4, rotY, 0]
  };
}

/**
 * HEART layout generator (filled heart projection facing front).
 */
export function generateHeartLayout(index, totalCount, bindingStyle = 'classic-dome', sizeConfig = {}) {
  const radiusMultiplier = Number(sizeConfig?.radiusMultiplier) || 1.0;
  const heightMultiplier = Number(sizeConfig?.heightMultiplier) || 1.0;

  const R_max = (bindingStyle === 'spiral-handtied' ? R_MAX_SPIRAL : R_MAX_CLASSIC) * bouquetDensity * radiusMultiplier;
  const yCenter = Y_BASE + (Y_MAX - Y_BASE) * heightMultiplier * 0.65;
  const zCenter = 0.0;

  if (totalCount <= 3) {
    // 1-3 flowers: compact center layout
    const offsetAngle = (2 * Math.PI / Math.max(1, totalCount)) * index;
    const rOffset = totalCount > 1 ? 0.35 : 0.0;
    const x = rOffset * Math.cos(offsetAngle);
    const y = yCenter + rOffset * Math.sin(offsetAngle);
    const z = zCenter;
    return {
      position: [x, y, z],
      rotation: [0, 0, 0]
    };
  } else if (totalCount <= 8) {
    // 4-8 flowers: simplified heart outline
    const theta = (2 * Math.PI / totalCount) * index + Math.PI / 2;
    const heartX = Math.pow(Math.sin(theta), 3);
    const heartY = (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta)) / 16.0;

    const x = R_max * 0.95 * heartX;
    const y = yCenter + R_max * 0.95 * heartY + R_max * 0.15;
    const z = -0.2 * R_max;

    const rotY = Math.atan2(x, 6.0);
    const rotX = -Math.atan2(y - yCenter, 6.0) + Math.PI / 2;

    return {
      position: [x, y, z],
      rotation: [rotX * 0.2, rotY, 0]
    };
  } else {
    // 9+ flowers: filled heart distribution
    const t = index / (totalCount - 1);
    const r = R_max * Math.pow(t, 0.65);
    const goldenAngle = 2.39996322978;
    const theta = index * goldenAngle;

    const heartX = Math.pow(Math.sin(theta), 3);
    const heartY = (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta)) / 16.0;

    const x = r * heartX;
    const y = yCenter + r * heartY + r * 0.15;
    const z = - (r * r) / (2.5 * R_max); // Controlled parabolic depth

    const rotY = Math.atan2(x, z + 6.0);
    const rotX = -Math.atan2(y - yCenter, 6.0) + Math.PI / 2;

    return {
      position: [x, y, z],
      rotation: [rotX * 0.3, rotY, 0]
    };
  }
}

/**
 * SPIRAL layout generator (winding spiral winding outwards and downwards).
 */
export function generateSpiralLayout(index, totalCount, bindingStyle = 'classic-dome', sizeConfig = {}) {
  const radiusMultiplier = Number(sizeConfig?.radiusMultiplier) || 1.0;
  const heightMultiplier = Number(sizeConfig?.heightMultiplier) || 1.0;

  const R_max = (bindingStyle === 'spiral-handtied' ? R_MAX_SPIRAL : R_MAX_CLASSIC) * bouquetDensity * radiusMultiplier;

  const t = totalCount > 1 ? index / (totalCount - 1) : 0.0;
  const r = R_max * t;
  const theta = index * 0.95; // Distinct slow winding progression

  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);

  // Height progresses downwards as spiral moves outwards
  const yStart = Y_BASE + (Y_MAX - Y_BASE) * heightMultiplier;
  const y = yStart - (yStart - Y_BASE) * 0.4 * t;

  const rotY = Math.atan2(x, z);
  const rotX = Math.PI / 5 * t;

  return {
    position: [x, y, z],
    rotation: [rotX, rotY, 0]
  };
}

/**
 * Runs a relaxation pass to resolve overlapping flower heads.
 */
export function relaxOverlaps(flowers, stemsDatabaseOrOptions, iterations = 8, sizeConfig = {}) {
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

  const radiusMultiplier = Number(sc?.radiusMultiplier) || 1.0;
  const heightMultiplier = Number(sc?.heightMultiplier) || 1.0;
  const spacingMultiplier = Number(sc?.spacingMultiplier) || 1.0;

  const scaledRDome = Math.max(0.001, R_DOME * radiusMultiplier);
  const scaledYMax = Y_MAX * heightMultiplier;
  const scaledYBase = scaledYMax - scaledRDome;

  const R_max = (bindingStyle === 'spiral-handtied' ? R_MAX_SPIRAL : R_MAX_CLASSIC) * bouquetDensity * radiusMultiplier;
  const pushForce = 0.18;

  const getRadius = (stemId) => {
    const dbItem = stemsDatabase.find(s => String(s.id) === String(stemId));
    let baseRadius = 0.95;
    if (!dbItem) baseRadius = 0.85;
    else if (dbItem.category === 'decorative-foliage') baseRadius = 0.65;
    else if (dbItem.id === 'blushing-peony' || dbItem.name?.toLowerCase().includes('lily')) baseRadius = 1.25;
    
    return baseRadius * spacingMultiplier;
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
        const minDist = (r1 + r2) * 0.82;

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
        const y = getDomeHeight(currentR, bindingStyle, sc);
        f.position[1] = y;

        const targetDx = x;
        const targetDy = y - scaledYBase;
        const targetDz = z;
        const rotY = Math.atan2(targetDx, targetDz);
        const rotX = -Math.atan2(targetDy, Math.sqrt(targetDx * targetDx + targetDz * targetDz)) + Math.PI / 2;
        f.rotation = [rotX * 0.4, rotY, 0];
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
  }, 8);
}
