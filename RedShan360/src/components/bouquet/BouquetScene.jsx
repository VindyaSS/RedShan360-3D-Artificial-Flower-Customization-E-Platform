/**
 * BouquetScene.jsx
 * Coordinates the rendering of all flowers and the vase in the 3D scene.
 */
import React from 'react';
import VaseModel from './VaseModel';
import FlowerModel from './FlowerModel';

export default function BouquetScene({
  flowers = [],
  wrappingId = null,
  ribbonId = null,
  selectedFlowerId = null,
  selectedSwapFlowerId = null,
  isSwapMode = false,
  onSelectFlower = null,
  onUpdateFlowerTransform = null,
  stemsDatabase = []
}) {
  return (
    <group position={[0, -1.8, 0]}>
      {/* 1. Base Vase Model */}
      <VaseModel wrappingId={wrappingId} ribbonId={ribbonId} />

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
