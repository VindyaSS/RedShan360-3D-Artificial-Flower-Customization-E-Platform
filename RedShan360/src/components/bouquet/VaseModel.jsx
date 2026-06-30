/**
 * VaseModel.jsx
 * Renders the 3D glass vase, water, wrapping paper, and ribbon accents.
 */
import React from 'react';
import * as THREE from 'three';

export default function VaseModel({ wrappingId, ribbonId }) {
  const isPaper = wrappingId === 'kraft-paper';
  const isRibbon = ribbonId === 'velvet-ribbon';

  return (
    <group>
      {/* 1. TABLE SURFACE (Grounded plane to rest the vase on) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#fbf9f6" 
          roughness={0.9} 
          metalness={0.0} 
        />
      </mesh>
      
      {/* Table grid pattern/accents */}
      <gridHelper args={[10, 10, '#ece7e2', '#f0ebe4']} position={[0, 0.001, 0]} />

      {/* 2. WATER (Cylinder inside the vase) */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.55, 0.58, 2.0, 16]} />
        <meshStandardMaterial 
          color="#a5dce4" 
          transparent 
          opacity={0.4} 
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Stems inside water (simulated refracted stems) */}
      <group opacity={0.6}>
        <mesh position={[-0.1, 1.0, 0.1]} rotation={[0.1, 0, -0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8]} />
          <meshStandardMaterial color="#4f6654" roughness={0.9} />
        </mesh>
        <mesh position={[0.1, 1.0, -0.1]} rotation={[-0.1, 0, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8]} />
          <meshStandardMaterial color="#4f6654" roughness={0.9} />
        </mesh>
        <mesh position={[0.0, 1.0, 0.0]} rotation={[0.05, 0, -0.05]}>
          <cylinderGeometry args={[0.03, 0.03, 1.9]} />
          <meshStandardMaterial color="#3f5243" roughness={0.9} />
        </mesh>
      </group>

      {/* 3. CRYSTAL VASE (Translucent Glass Container) */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.65, 2.4, 24, 1, false]} />
        {/* physical glass material */}
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.9} // Glass transparency
          thickness={0.5}    // Glass refractive thickness
          ior={1.5}          // Glass index of refraction
        />
      </mesh>

      {/* Vase Rim Highlight */}
      <mesh position={[0, 2.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.03, 8, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* 4. KRAFT WRAPPING PAPER (Flared open cylinder around stems) */}
      {isPaper && (
        <group position={[0, 2.8, 0]}>
          {/* Inner wrapping paper layer */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[2.0, 0.55, 2.0, 16, 1, true]} />
            <meshStandardMaterial 
              color="#d2b48c" // Kraft paper brown
              roughness={1.0}
              metalness={0.0}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Flared edge details (outer design envelope) */}
          <mesh position={[0, 0.8, 0]} rotation={[0, Math.PI / 8, 0]}>
            <cylinderGeometry args={[2.3, 1.8, 0.6, 8, 1, true]} />
            <meshStandardMaterial 
              color="#cbb08c" 
              roughness={1.0} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        </group>
      )}

      {/* 5. VELVET RIBBON (Bow ribbon wrapped around the vase neck) */}
      {isRibbon && (
        <group position={[0, 2.2, 0]}>
          {/* Main collar band */}
          <mesh castShadow>
            <torusGeometry args={[0.63, 0.05, 8, 24]} />
            <meshStandardMaterial 
              color="#5c2c2c" // Velvet Burgundy
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          
          {/* Decorative Bow representation */}
          <group position={[0, 0, 0.65]}>
            {/* Left bow loop */}
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0.2, -0.4]}>
              <torusGeometry args={[0.1, 0.03, 6, 16]} />
              <meshStandardMaterial color="#5c2c2c" roughness={0.9} />
            </mesh>
            {/* Right bow loop */}
            <mesh position={[0.15, 0, 0]} rotation={[0, -0.2, 0.4]}>
              <torusGeometry args={[0.1, 0.03, 6, 16]} />
              <meshStandardMaterial color="#5c2c2c" roughness={0.9} />
            </mesh>
            {/* Bow center knot */}
            <mesh rotation={[0, Math.PI/2, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#451c1c" roughness={0.8} />
            </mesh>
            {/* Tails */}
            <mesh position={[-0.08, -0.15, 0]} rotation={[0.2, 0, 0.3]}>
              <cylinderGeometry args={[0.015, 0.015, 0.3]} />
              <meshStandardMaterial color="#5c2c2c" roughness={0.9} />
            </mesh>
            <mesh position={[0.08, -0.15, 0]} rotation={[0.2, 0, -0.3]}>
              <cylinderGeometry args={[0.015, 0.015, 0.3]} />
              <meshStandardMaterial color="#5c2c2c" roughness={0.9} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
