import React, { useMemo } from 'react';
import BouquetCanvas from './BouquetCanvas';

export default function BouquetPreview({ snapshot, stemsDatabase = [] }) {
  const flowersMapped = useMemo(() => {
    if (!snapshot || !snapshot.flowers) return [];
    return snapshot.flowers.map((f) => {
      // Map coordinate objects from snapshot back to arrays of 3 numbers
      const pos = f.position ? [f.position.x, f.position.y, f.position.z] : [0, 2.5, 0];
      const rot = f.rotation ? [f.rotation.x, f.rotation.y, f.rotation.z] : [0, 0, 0];
      const scl = f.scale ? [f.scale.x, f.scale.y, f.scale.z] : [1, 1, 1];

      return {
        id: f.instanceId,
        stemId: String(f.productId),
        position: pos,
        rotation: rot,
        scale: scl,
        isManuallyEdited: true
      };
    });
  }, [snapshot]);

  if (!snapshot) return null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '400px' }}>
      <BouquetCanvas
        flowers={flowersMapped}
        wrappingId={snapshot.wrappingId}
        ribbonId={snapshot.ribbonId}
        stemsDatabase={stemsDatabase}
        selectedFlowerId={null}
        selectedSwapFlowerId={null}
        isSwapMode={false}
        onSelectFlower={null}
        onUpdateFlowerTransform={null}
      />
    </div>
  );
}
