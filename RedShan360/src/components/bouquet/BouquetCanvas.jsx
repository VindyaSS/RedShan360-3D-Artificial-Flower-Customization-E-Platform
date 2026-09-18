/**
 * BouquetCanvas.jsx
 * The React Three Fiber Canvas container with studio lighting, camera setup,
 * and background scene settings. (Step 2: No interactions).
 */
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import BouquetScene from './BouquetScene';

export default function BouquetCanvas({
  flowers = [],
  wrappingId = null,
  ribbonId = null,
  stemsDatabase = [],
  selectedFlowerId = null,
  selectedSwapFlowerId = null,
  isSwapMode = false,
  onSelectFlower = null,
  onUpdateFlowerTransform = null
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 7], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        onPointerMissed={() => onSelectFlower && onSelectFlower(null)}
      >
        {/* Soft natural ambient lighting */}
        <ambientLight intensity={0.85} color="#fffaee" />

        {/* Dynamic Studio Key Light */}
        <directionalLight
          position={[4, 7, 5]}
          intensity={1.6}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />

        {/* Soft cool rim fill light */}
        <directionalLight position={[-4, 4, -4]} intensity={0.6} color="#e8f0fe" />

        {/* Warm top highlighting light */}
        <pointLight position={[0, 6, 2]} intensity={1.0} color="#fff5ea" />

        <Suspense fallback={null}>
          {/* Studio HDRI Environment */}
          <Environment preset="studio" />

          {/* Core Bouquet 3D scene */}
          <BouquetScene
            flowers={flowers}
            wrappingId={wrappingId}
            ribbonId={ribbonId}
            stemsDatabase={stemsDatabase}
            selectedFlowerId={selectedFlowerId}
            selectedSwapFlowerId={selectedSwapFlowerId}
            isSwapMode={isSwapMode}
            onSelectFlower={onSelectFlower}
            onUpdateFlowerTransform={onUpdateFlowerTransform}
          />

          {/* Soft ground shadows */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.65}
            scale={9}
            blur={1.8}
            far={4}
          />
        </Suspense>

        {/* Camera Orbiting controls (Static/No interaction modifications yet) */}
        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={true}
          minDistance={3.5}
          maxDistance={12}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 + 0.1} // Prevent looking through the table floor
        />
      </Canvas>
    </div>
  );
}