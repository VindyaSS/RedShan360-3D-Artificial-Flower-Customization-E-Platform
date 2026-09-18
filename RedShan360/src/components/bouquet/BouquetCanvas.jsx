import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import BouquetScene from './BouquetScene';

/**
 * Inner component to handle WebGL diagnostics and store the R3F invalidate function.
 */
function CanvasDiagnostics({ onCanvasCreated, invalidateRef }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    invalidateRef.current = invalidate;

    if (onCanvasCreated) {
      onCanvasCreated(gl.domElement);
    }

    const domElement = gl.domElement;

    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn('[DEBUG WEBGL] webglcontextlost event fired!');
      console.log('[DEBUG WEBGL] Renderer memory at context loss:', {
        memory: gl.info?.memory,
        render: gl.info?.render
      });
    };

    const handleContextRestored = () => {
      console.log('[DEBUG WEBGL] webglcontextrestored event fired! Redrawing scene...');
      invalidate();
    };

    domElement.addEventListener('webglcontextlost', handleContextLost, false);
    domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      domElement.removeEventListener('webglcontextlost', handleContextLost);
      domElement.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl, invalidate, onCanvasCreated, invalidateRef]);

  return null;
}

export default function BouquetCanvas({
  flowers = [],
  wrappingId = null,
  ribbonId = null,
  stemsDatabase = [],
  selectedFlowerId = null,
  selectedSwapFlowerId = null,
  isSwapMode = false,
  onSelectFlower = null,
  onUpdateFlowerTransform = null,
  onCanvasCreated = null
}) {
  const containerRef = useRef(null);
  const invalidateRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  // IntersectionObserver to pause R3F frameloop when canvas is off-screen
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        console.log(`[DEBUG WEBGL] Canvas visibility: ${visible ? 'VISIBLE (frameloop=always)' : 'OFF-SCREEN (frameloop=demand)'}`);
        setIsVisible(visible);

        if (visible && invalidateRef.current) {
          console.log('[DEBUG WEBGL] Canvas resumed: calling invalidate() to force redraw');
          invalidateRef.current();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        shadows
        frameloop={isVisible ? 'always' : 'demand'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 2, 7], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        onPointerMissed={() => onSelectFlower && onSelectFlower(null)}
      >
        <CanvasDiagnostics onCanvasCreated={onCanvasCreated} invalidateRef={invalidateRef} />

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


