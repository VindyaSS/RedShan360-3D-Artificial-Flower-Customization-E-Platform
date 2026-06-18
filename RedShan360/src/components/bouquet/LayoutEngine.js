/**
 * LayoutEngine.js
 * Contains the mathematical algorithms for automatic bouquet formation,
 * golden spiral dome coordinates, and XZ-only collision relaxation.
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
 * 
 * @param {number} r - Radial distance from the bouquet center
 * @param {string} style - Layout style ('classic-dome' | 'spiral-handtied')
 * @returns {number} Height Y on the dome surface
 */
export function getDomeHeight(r, style = 'classic-dome') {
  const R_max = (style === 'spiral-handtied' ? R_MAX_SPIRAL : R_MAX_CLASSIC) * bouquetDensity;
  // Clamp r to prevent imaginary numbers in square root
  const clampedR = Math.min(Math.max(0, r), R_max);
  return Y_BASE + Math.sqrt(R_DOME * R_DOME - clampedR * clampedR);
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
 * Calculates a unified dome Fermat spiral position for a flower.
 * 
 * @param {number} index - Index of the flower in the bouquet (0-based)
 * @param {number} totalCount - Total count of auto-placed flowers
 * @param {string} style - 'classic-dome' | 'spiral-handtied'
 * @returns {object} { position: [x,y,z], rotation: [x,y,z] }
 */
export function calculateFlowerPosition(index, totalCount, style = 'classic-dome') {
  const R_max = (style === 'spiral-handtied' ? R_MAX_SPIRAL : R_MAX_CLASSIC) * bouquetDensity;
  const goldenAngle = 2.39996322978; // 137.5 degrees in radians

  // Determine radial distance using golden spiral with denser power curve (0.65)
  const t = totalCount > 1 ? index / (totalCount - 1) : 0.0;
  const r = R_max * Math.pow(t, 0.65);

  // Golden angle angle offset
  const theta = index * goldenAngle;

  // Project coordinates onto the horizontal plane
  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);

  // Get height strictly from the unified dome equation
  const y = getDomeHeight(r, style);

  // Rotation faces outwards away from the dome normal (centered at 0, Y_BASE, 0)
  const dx = x;
  const dy = y - Y_BASE;
  const dz = z;
  const rotY = Math.atan2(dx, dz);
  const rotX = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) + Math.PI / 2;

  return {
    position: [x, y, z],
    rotation: [rotX * 0.4, rotY, 0] // Slightly damped pitch for natural appearance
  };
}

/**
 * Runs a relaxation pass to resolve overlapping flower heads.
 * Collisions are solved in the XZ plane only; Y heights are recalculated
 * strictly using the unified dome surface equation.
 */
export function relaxOverlaps(flowers, stemsDatabase, iterations = 8) {
  // Deep clone flower array positions to modify
  const result = flowers.map(f => ({
    ...f,
    position: [...f.position],
    rotation: [...f.rotation]
  }));

  // Detect style from current flowers
  const style = flowers.find(f => f.style)?.style || 'classic-dome';
  const R_max = (style === 'spiral-handtied' ? R_MAX_SPIRAL : R_MAX_CLASSIC) * bouquetDensity;

  // Separation strength (15-20% of overlap distance)
  const pushForce = 0.18;

  // Define collision radii for types
  const getRadius = (stemId) => {
    const dbItem = stemsDatabase.find(s => s.id === stemId);
    if (!dbItem) return 0.85;
    if (dbItem.category === 'decorative-foliage') return 0.65; // Foliage leaves
    if (dbItem.id === 'blushing-peony' || dbItem.name?.toLowerCase().includes('lily')) return 1.25; // Large flowers
    return 0.95; // Roses and normal size flowers
  };

  for (let step = 0; step < iterations; step++) {
    for (let i = 0; i < result.length; i++) {
      const f1 = result[i];
      const r1 = getRadius(f1.stemId);

      for (let j = i + 1; j < result.length; j++) {
        const f2 = result[j];
        const r2 = getRadius(f2.stemId);

        // Collision checked and solved in XZ plane ONLY
        const dx = f2.position[0] - f1.position[0];
        const dz = f2.position[2] - f1.position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        const minDist = (r1 + r2) * 0.82; // Allow small organic overlap

        if (dist < minDist && dist > 0.001) {
          const overlap = minDist - dist;
          const px = (dx / dist) * overlap;
          const pz = (dz / dist) * overlap;

          // Push them apart: split force if both can move, or apply full force if one is static
          if (f1.isManuallyEdited && !f2.isManuallyEdited) {
            f2.position[0] += px * (pushForce * 2.0); // 36% displacement push
            f2.position[2] += pz * (pushForce * 2.0);
          } else if (!f1.isManuallyEdited && f2.isManuallyEdited) {
            f1.position[0] -= px * (pushForce * 2.0);
            f1.position[2] -= pz * (pushForce * 2.0);
          } else if (!f1.isManuallyEdited && !f2.isManuallyEdited) {
            f1.position[0] -= px * pushForce; // 18% displacement push each
            f1.position[2] -= pz * pushForce;
            f2.position[0] += px * pushForce;
            f2.position[2] += pz * pushForce;
          }
        }
      }
    }

    // Apply boundary limits and recompute Y coordinates on the dome surface
    for (let i = 0; i < result.length; i++) {
      const f = result[i];
      if (f.isManuallyEdited) continue;

      let x = f.position[0];
      let z = f.position[2];
      const r = Math.sqrt(x * x + z * z);

      // 1. Clamp horizontal coordinates within R_max
      if (r > R_max) {
        x = (x / r) * R_max;
        z = (z / r) * R_max;
        f.position[0] = x;
        f.position[2] = z;
      }

      // 2. Recalculate Y height strictly from the dome equation based on current radius
      const currentR = Math.sqrt(x * x + z * z);
      const y = getDomeHeight(currentR, style);
      f.position[1] = y;

      // 3. Re-align rotation to point outwards along the dome normal
      const targetDx = x;
      const targetDy = y - Y_BASE;
      const targetDz = z;
      const rotY = Math.atan2(targetDx, targetDz);
      const rotX = -Math.atan2(targetDy, Math.sqrt(targetDx * targetDx + targetDz * targetDz)) + Math.PI / 2;
      f.rotation = [rotX * 0.4, rotY, 0];
    }
  }

  return result;
}

/**
 * Recalculates all auto-placed flowers in the bouquet.
 * Filters out manual edits, computes Fermat spiral positions for the rest,
 * and runs collision relaxation.
 * 
 * @param {Array} flowers - Current flower instances state
 * @param {string} style - 'classic-dome' | 'spiral-handtied'
 * @param {Array} stemsDatabase - The catalog database
 * @returns {Array} Updated flower instances list with positions and rotations
 */
export function arrangeBouquet(flowers, style = 'classic-dome', stemsDatabase) {
  // 1. Filter out manually edited flowers
  // Keep their index ordering in the list to maintain stable spiral placement
  const nonEdited = flowers.filter(f => !f.isManuallyEdited);
  const totalCount = nonEdited.length;

  // 2. Assign Fermat spiral positions
  const positionedFlowers = flowers.map((flower) => {
    if (flower.isManuallyEdited) {
      return {
        ...flower,
        style
      };
    }

    // Find the relative index of this flower within the non-edited list
    const idx = nonEdited.findIndex(f => f.id === flower.id);
    const { position, rotation } = calculateFlowerPosition(idx, totalCount, style);

    return {
      ...flower,
      position,
      rotation,
      scale: flower.scale || [1, 1, 1],
      style
    };
  });

  // 3. Relax overlaps (run collision resolution)
  return relaxOverlaps(positionedFlowers, stemsDatabase, 8);
}
