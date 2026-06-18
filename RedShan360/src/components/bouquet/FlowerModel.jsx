import React, { useRef, useMemo } from 'react';
import { useGLTF, Clone, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

// Map database stem IDs to GLB files in /models/
const MODEL_MAPPING = {
  '2': '/models/redChrysanthemums.glb', // Red Chrysanthemums
  '3': '/models/purplrcarnation.glb',   // Purple Carnation
  '5': '/models/pinkChrysanthemums.glb', // Pink Chrysanthemums
  '7': '/models/LilyHeadDress.glb',     // Lily Headdress
  '8': '/models/redrose.glb',           // Red Rose
  '10': '/models/Liliflowerpink.glb',   // Pink Lily
};

// Preload models to prevent stutter when adding new flowers
Object.values(MODEL_MAPPING).forEach((url) => {
  useGLTF.preload(url);
});

// 3D Stem Component connecting vase throat (0, 2.4, 0) to flower head
export function Stem({ start, end, color = '#5c7562', radius = 0.035 }) {
  const pStart = useMemo(() => new THREE.Vector3(...start), [start]);
  const pEnd = useMemo(() => new THREE.Vector3(...end), [end]);
  
  const { midpoint, length, quaternion } = useMemo(() => {
    const direction = new THREE.Vector3().subVectors(pEnd, pStart);
    const len = direction.length();
    const mid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), // Default cylinder orientation
      direction.clone().normalize()
    );
    return { midpoint: mid, length: len, quaternion: quat };
  }, [pStart, pEnd]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius * 1.3, length, 8]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

// Procedural Eucalyptus Foliage
function EucalyptusModel({ scale }) {
  return (
    <group scale={scale}>
      {/* Central main stem */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 2.0, 8]} />
        <meshStandardMaterial color="#6e8579" roughness={0.9} />
      </mesh>
      {/* Stacked round leaves */}
      {Array.from({ length: 8 }).map((_, i) => {
        const y = -0.8 + i * 0.25;
        const angle = i * 2.4; // Golden angle-like offset for spiral leaves
        const leafScale = 0.35 - (i * 0.015);
        return (
          <group key={i} position={[0, y, 0]} rotation={[0.2, angle, 0.1]}>
            {/* Left Leaf leaf */}
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0, -0.1]}>
              <sphereGeometry args={[0.2, 16, 8]} />
              <meshStandardMaterial color="#8fa89d" roughness={0.7} />
            </mesh>
            {/* Right Leaf leaf */}
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, 0.1]}>
              <sphereGeometry args={[0.2, 16, 8]} />
              <meshStandardMaterial color="#8fa89d" roughness={0.7} />
            </mesh>
            {/* Tiny node */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#576960" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Procedural Fern Leaf
function FernModel({ scale }) {
  return (
    <group scale={scale}>
      {/* Main leaf spine */}
      <mesh position={[0, -0.8, 0]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.025, 1.6, 8]} />
        <meshStandardMaterial color="#4d7260" roughness={0.9} />
      </mesh>
      {/* Branching leaflets */}
      {Array.from({ length: 12 }).map((_, i) => {
        const y = -0.7 + i * 0.13;
        const length = 0.4 - i * 0.025;
        const rotZ = 0.5 - (i * 0.02);
        return (
          <group key={i} position={[0, y, 0]}>
            {/* Left blade */}
            <mesh position={[-length * 0.5, 0, 0]} rotation={[0, 0.1, -rotZ]}>
              <boxGeometry args={[length, 0.02, 0.08]} />
              <meshStandardMaterial color="#5c8774" roughness={0.8} />
            </mesh>
            {/* Right blade */}
            <mesh position={[length * 0.5, 0, 0]} rotation={[0, -0.1, rotZ]}>
              <boxGeometry args={[length, 0.02, 0.08]} />
              <meshStandardMaterial color="#5c8774" roughness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Main Flower Model renderer wrapper
export default function FlowerModel({ flower, isSelected, onSelectFlower, onUpdateFlowerTransform, stemsDatabase }) {
  const { stemId, position, rotation, scale } = flower;
  const glbUrl = MODEL_MAPPING[stemId];
  const groupRef = useRef();

  // Load model if it exists
  const { scene } = glbUrl ? useGLTF(glbUrl) : { scene: null };

  // Adjust model orientation offset depending on GLB geometry defaults
  const rotationOffset = useMemo(() => {
    // Some models come horizontal or rotated; we align them to point upwards
    if (stemId === '8') return new THREE.Euler(0, 0, 0); // Red Rose default
    if (stemId === '10') return new THREE.Euler(Math.PI / 2, 0, 0); // Lily
    if (stemId === '7') return new THREE.Euler(0, 0, 0); // Headdress
    return new THREE.Euler(0, 0, 0);
  }, [stemId]);

  // Adjust model scale depending on natural flower size
  const modelScale = useMemo(() => {
    const defaultScale = 0.35;
    if (stemId === '8') return 0.4;  // Red Rose
    if (stemId === '10') return 0.22; // Pink Lily (heavy geometry, make compact)
    if (stemId === '7') return 0.28;  // Lily Headdress
    if (stemId === '2' || stemId === '5') return 0.35; // Chrysanthemums
    if (stemId === '3') return 0.35;  // Carnation
    return defaultScale;
  }, [stemId]);

  // Handle procedural foliage
  const isProcedural = !glbUrl;
  const isEucalyptus = stemId === 'silver-eucalyptus';
  const isFern = stemId === 'emerald-fern';

  // Dynamic selection ring/mesh color helper
  const dbItem = useMemo(() => stemsDatabase.find(s => s.id === stemId), [stemsDatabase, stemId]);
  const colorHex = dbItem?.color || '#a82c2c';

  // Capture final local position/rotation on drag release and sync to React
  const handleTransformEnd = () => {
    if (groupRef.current && onUpdateFlowerTransform) {
      const pos = groupRef.current.position;
      const rot = groupRef.current.rotation;
      onUpdateFlowerTransform(
        flower.id,
        [pos.x, pos.y, pos.z],
        [rot.x, rot.y, rot.z]
      );
    }
  };

  return (
    <group>
      {/* 1. Dynamic Stem Cylinder connecting vase neck (0, 2.4, 0) to flower head */}
      <Stem start={[0, 2.4, 0]} end={position} color="#57695a" />

      {/* 2. Flower Head / Foliage Group */}
      <group 
        ref={groupRef}
        position={position} 
        rotation={rotation}
        scale={scale}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (onSelectFlower) onSelectFlower(flower.id);
        }}
      >
        {isProcedural ? (
          // Render procedural elements
          isEucalyptus ? (
            <EucalyptusModel scale={0.7} />
          ) : isFern ? (
            <FernModel scale={0.8} />
          ) : (
            // Fallback generic flower shape if model doesn't exist
            <mesh castShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color={colorHex} roughness={0.6} />
            </mesh>
          )
        ) : (
          // Render cached GLB clone
          <group rotation={rotationOffset}>
            <Clone 
              object={scene} 
              scale={modelScale} 
              castShadow 
              receiveShadow 
            />
          </group>
        )}

        {/* 3. Selection outline highlight */}
        {isSelected && (
          <mesh>
            <sphereGeometry args={[isProcedural ? 0.45 : 0.6, 16, 16]} />
            <meshBasicMaterial 
              color="#8c5e5e" 
              wireframe 
              transparent 
              opacity={0.3} 
            />
          </mesh>
        )}
      </group>

      {/* 4. Transform Gizmo (Renders visual transform tools in Canvas) */}
      {isSelected && (
        <TransformControls 
          object={groupRef} 
          mode="translate" 
          size={0.85}
          onMouseUp={handleTransformEnd}
        />
      )}
    </group>
  );
}
