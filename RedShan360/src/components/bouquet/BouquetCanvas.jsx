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
        {/* Soft background light */}
        <ambientLight intensity={0.7} />

        {/* Dynamic Studio Key Light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />

        {/* Soft fill light */}
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />

        {/* Warm highlighting back light */}
        <pointLight position={[0, 5, -2]} intensity={0.8} color="#fbf4eb" />

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
            onSelectFlower={onSelectFlower}
            onUpdateFlowerTransform={onUpdateFlowerTransform}
          />

          {/* Soft ground shadows */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.6}
            scale={8}
            blur={1.5}
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
