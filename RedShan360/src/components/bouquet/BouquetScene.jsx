/**
 * BouquetScene.jsx
 * Coordinates the rendering of all flowers and the vase in the 3D scene.
 */
import React, { useMemo } from 'react';
import VaseModel from './VaseModel';
import FlowerModel from './FlowerModel';

export default function BouquetScene({
  flowers = [],
  wrappingId = null,
  ribbonId = null,
  bouquetSize = 'MEDIUM',
  sizeConfig = null,
  selectedFlowerId = null,
  selectedSwapFlowerId = null,
  isSwapMode = false,
  onSelectFlower = null,
  onUpdateFlowerTransform = null,
  stemsDatabase = []
}) {
  // Dynamically calculate actual visual bouquet radius and bloom base height from flower transforms
  const bouquetMetrics = useMemo(() => {
    if (!flowers || flowers.length === 0) {
      return { bouquetRadius: 1.4, bloomBaseY: 2.9 };
    }

    // 1. Calculate centroid in horizontal X/Z plane
    let sumX = 0;
    let sumZ = 0;
    let sumY = 0;
    let minY = Infinity;
    let maxY = -Infinity;

    flowers.forEach((f) => {
      const pos = f.position || [0, 2.5, 0];
      sumX += pos[0];
      sumZ += pos[2];
      sumY += pos[1];
      if (pos[1] < minY) minY = pos[1];
      if (pos[1] > maxY) maxY = pos[1];
    });

    const count = flowers.length;
    const cx = sumX / count;
    const cz = sumZ / count;

    // 2. Maximum radial distance from centroid in X/Z
    let maxR = 0;
    flowers.forEach((f) => {
      const pos = f.position || [0, 2.5, 0];
      const dx = pos[0] - cx;
      const dz = pos[2] - cz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > maxR) maxR = dist;
    });

    // 3. Visual radius with small bloom size allowance (+0.20)
    const visualBouquetRadius = Math.max(1.1, maxR + 0.20);

    // 4. Bloom base area height (brings wrapper top edge cleanly up to lower bloom mass)
    const avgY = sumY / count;
    const bloomBaseY = Math.max(2.4, Math.min(maxY - 0.35, avgY + 0.15));

    return {
      bouquetRadius: visualBouquetRadius,
      bloomBaseY
    };
  }, [flowers]);

  return (
    <group position={[0, -1.8, 0]}>
      {/* 1. Base Vase Model with dynamic bouquet metrics */}
      <VaseModel
        wrappingId={wrappingId}
        ribbonId={ribbonId}
        bouquetSize={bouquetSize}
        sizeConfig={sizeConfig}
        bouquetRadius={bouquetMetrics.bouquetRadius}
        bloomBaseY={bouquetMetrics.bloomBaseY}
      />

      {/* 2. Placed Flowers List */}
      {flowers.map((flower) => {
        const isSelected = flower.id === selectedFlowerId;
        return (
          <FlowerModel
            key={flower.id}
            flower={flower}
            isSelected={isSelected}
            isSwapFirst={flower.id === selectedSwapFlowerId}
            isSwapMode={isSwapMode}
            onSelectFlower={onSelectFlower}
            onUpdateFlowerTransform={onUpdateFlowerTransform}
            stemsDatabase={stemsDatabase}
          />
        );
      })}
    </group>
  );
}
