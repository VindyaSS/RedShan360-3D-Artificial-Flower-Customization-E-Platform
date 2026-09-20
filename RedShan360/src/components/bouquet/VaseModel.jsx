/**
 * VaseModel.jsx
 * Renders an ultra-realistic 3D florist hand-tied bouquet wrapping.
 * Features 3 distinct curved paper layers with 3 distinct colors (Outer Fan, Middle Contrast Border,
 * and Inner Soft Tissue Lining) to fully cover the bouquet while displaying the flowers clearly.
 */
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { BOUQUET_SIZE_CONFIG } from './sizeConfig';

// Generate procedural vintage botanical script toile pattern canvas texture
const createBotanicalToileTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // 1. Crisp white base canvas so material color shines through cleanly
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle linen paper fiber texture noise
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    ctx.fillRect(x, y, 2.2, 2.2);
  }

  // 2. Draw subtle dark charcoal & gold botanical leaf scrollwork sprigs
  const drawLeafScroll = (cx, cy, scale, angle) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    // Main stem curve
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(40, -70, 100, -40, 130, -110);
    ctx.strokeStyle = '#2c251d';
    ctx.lineWidth = 4.5;
    ctx.stroke();

    // Leaves
    const leafPositions = [
      { x: 35, y: -48, r: 0.5 },
      { x: 75, y: -62, r: -0.35 },
      { x: 105, y: -90, r: 0.65 }
    ];

    leafPositions.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);

      // Leaf body
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#3a3227';
      ctx.fill();
      ctx.strokeStyle = '#1a1510';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Leaf veins (Antique Gold accent)
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(16, 0);
      ctx.strokeStyle = '#e6ca65';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.restore();
    });

    // Gold floral tendril
    ctx.beginPath();
    ctx.arc(60, -30, 22, 0, Math.PI * 1.5);
    ctx.strokeStyle = '#e6ca65';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Elegant botanical cursive script lines
    ctx.font = 'italic bold 18px serif';
    ctx.fillStyle = 'rgba(35, 28, 20, 0.75)';
    ctx.fillText('Botanique Speciale', 15, 25);
    ctx.fillText('Florist Curation Nº 360', 25, 48);

    ctx.restore();
  };

  // Asymmetrical placement of decorative prints
  const offsets = [
    { x: 140, y: 180, s: 1.3, a: 0.25 },
    { x: 700, y: 220, s: 1.15, a: -0.75 },
    { x: 300, y: 660, s: 1.35, a: 1.4 },
    { x: 820, y: 780, s: 1.05, a: -2.0 },
    { x: 460, y: 420, s: 0.95, a: 2.7 }
  ];

  offsets.forEach(o => drawLeafScroll(o.x, o.y, o.s, o.a));

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
};

// Generate procedural rustic wood texture for tabletop
const createWoodTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base warm rustic wood color
  ctx.fillStyle = '#c5a076';
  ctx.fillRect(0, 0, 512, 512);

  // Wood grain lines
  ctx.strokeStyle = 'rgba(110, 75, 45, 0.18)';
  ctx.lineWidth = 3;
  for (let y = 0; y < 512; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.random() - 0.5) * 4);
    ctx.bezierCurveTo(170, y + (Math.random() - 0.5) * 8, 340, y + (Math.random() - 0.5) * 8, 512, y + (Math.random() - 0.5) * 4);
    ctx.stroke();
  }

  // Soft wood plank lines
  ctx.strokeStyle = 'rgba(70, 45, 25, 0.22)';
  ctx.lineWidth = 2.5;
  for (let x = 128; x < 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
};

/**
 * RibbonTailMesh
 * Creates a supple 3D satin ribbon tail using a 3D CatmullRom spline curve.
 */
function RibbonTailMesh({ controlPoints, width = 0.16, color = '#b86b76' }) {
  const geometry = useMemo(() => {
    const vectors = controlPoints.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const curve = new THREE.CatmullRomCurve3(vectors, false, 'centripetal', 0.5);

    const segments = 45;
    const points = curve.getSpacedPoints(segments);
    const frenetFrames = curve.computeFrenetFrames(segments, false);

    const positions = [];
    const uvs = [];
    const normals = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const p = points[i];
      const binormal = frenetFrames.binormals[i];
      const normal = frenetFrames.normals[i];
      const u = i / segments;

      const currentWidth = width * (1.0 - u * 0.08);
      const halfW = currentWidth * 0.5;

      const vLeft = new THREE.Vector3().copy(p).addScaledVector(binormal, halfW);
      const vRight = new THREE.Vector3().copy(p).addScaledVector(binormal, -halfW);

      positions.push(vLeft.x, vLeft.y, vLeft.z);
      positions.push(vRight.x, vRight.y, vRight.z);

      uvs.push(0, u);
      uvs.push(1, u);

      normals.push(normal.x, normal.y, normal.z);
      normals.push(normal.x, normal.y, normal.z);
    }

    for (let i = 0; i < segments; i++) {
      const idx = i * 2;
      indices.push(idx, idx + 1, idx + 2);
      indices.push(idx + 1, idx + 3, idx + 2);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return geo;
  }, [controlPoints, width]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={0.28}
        metalness={0.14}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Helper: Generates a single continuous 360-degree florist sleeve geometry
 * with a subtle front overlap fold, irregular scalloped peaks, vertical fold creases,
 * and a gathered stem waist.
 */
function createContinuousFloristSleeveGeometry({
  rTop = 1.4,
  rBottom = 0.4,
  height = 2.2,
  targetBloomBaseY = 2.9,
  overlapAngle = Math.PI * 0.15, // ~27 deg subtle front overlap fold
  peakHeightScale = 0.26,
  creaseDepth = 0.05,
  asymmetrySeed = 0,
  radialSegments = 36,
  heightSegments = 16
}) {
  const positions = [];
  const uvs = [];
  const indices = [];

  // Arc starts at back (-Z) wrapping full 360 deg to front (+Z) with subtle overlap
  const arcStart = -Math.PI * 0.95;
  const arcTotal = Math.PI * 1.90 + overlapAngle;

  for (let j = 0; j <= heightSegments; j++) {
    const v = j / heightSegments; // 0 at waist bottom, 1 at top rim
    const baseR = rBottom + (rTop - rBottom) * Math.pow(v, 1.15);
    const currentY = (v - 0.5) * height;

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments; // 0 to 1 around circumference
      const angle = arcStart + u * arcTotal;

      // 1. Organic peak height modulation (pronounced at top v -> 1)
      const wave1 = Math.sin(angle * 3 + asymmetrySeed) * peakHeightScale;
      const wave2 = Math.cos(angle * 5 + asymmetrySeed * 1.5) * (peakHeightScale * 0.4);
      // Back wall taller, front scoop lower
      const backWallTilt = -Math.cos(angle) * 0.16;
      
      let deltaY = v * v * (wave1 + wave2 + backWallTilt);
      // Safety clamp: top rim never exceeds bloom base height
      if (currentY + deltaY > targetBloomBaseY - 0.25) {
        deltaY = targetBloomBaseY - 0.25 - currentY;
      }

      // 2. Vertical fold creases & subtle seam radial offset for overlap
      const creaseWave = Math.sin(angle * 6 + asymmetrySeed * 2) * creaseDepth;
      
      // Subtle radial step for overlapping front flap
      let seamOffset = 0;
      if (u > 0.85) {
        seamOffset = (u - 0.85) * 0.04;
      }

      const currentR = baseR + v * creaseWave + seamOffset;

      // Final vertex positions
      const x = Math.sin(angle) * currentR;
      const y = currentY + deltaY;
      const z = Math.cos(angle) * currentR;

      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  // Generate indices for triangles
  for (let j = 0; j < heightSegments; j++) {
    for (let i = 0; i < radialSegments; i++) {
      const first = j * (radialSegments + 1) + i;
      const second = first + radialSegments + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  return geo;
}

export default function VaseModel({
  wrappingId,
  bouquetSize = 'MEDIUM',
  sizeConfig = null,
  bouquetRadius = 1.45,
  bloomBaseY = 2.3
}) {
  const botanicalTexture = useMemo(() => createBotanicalToileTexture(), []);
  const woodTexture = useMemo(() => createWoodTexture(), []);

  const activePaperId = wrappingId || 'botanical-toile';

  // Compute 3D wrapping paper scale factors based on selected bouquet size (Small, Medium, Large, Extra Large)
  const scaleVector = useMemo(() => {
    const config = sizeConfig || BOUQUET_SIZE_CONFIG[bouquetSize] || BOUQUET_SIZE_CONFIG.MEDIUM;
    const rMult = Number(config?.radiusMultiplier) || 1.0;
    const hMult = Number(config?.heightMultiplier) || 1.0;
    return [rMult, hMult, rMult];
  }, [bouquetSize, sizeConfig]);

  // Derive dynamic layer top radii directly from bouquetRadius with modest offsets:
  // inner: 1.01, middle: 1.04, outer: 1.08
  const baseR = Number(bouquetRadius) || 1.4;
  const innerTopR = baseR * 1.01;
  const middleTopR = baseR * 1.04;
  const outerTopR = baseR * 1.08;

  // Calculate vertical frustum height so paper rim comes up right to lower bloom cluster, eliminating empty stem gap
  const targetBloomBaseY = Number(bloomBaseY) || 2.9;
  const wrapH = Math.max(2.0, Math.min(2.8, targetBloomBaseY - 0.65));
  const wrapY = 1.05 + wrapH * 0.5;

  // Layer 1: Primary Continuous Outer Florist Sleeve
  const layer1Geo = useMemo(() => {
    return createContinuousFloristSleeveGeometry({
      rTop: outerTopR,
      rBottom: 0.42,
      height: wrapH + 0.15,
      targetBloomBaseY,
      overlapAngle: Math.PI * 0.15,
      peakHeightScale: 0.28,
      creaseDepth: 0.05,
      asymmetrySeed: 5.2
    });
  }, [outerTopR, wrapH, targetBloomBaseY]);

  // Layer 2: Lightweight Middle Contrast Accent Rim
  const layer2Geo = useMemo(() => {
    return createContinuousFloristSleeveGeometry({
      rTop: middleTopR,
      rBottom: 0.40,
      height: wrapH,
      targetBloomBaseY,
      overlapAngle: Math.PI * 0.12,
      peakHeightScale: 0.22,
      creaseDepth: 0.04,
      asymmetrySeed: 3.5
    });
  }, [middleTopR, wrapH, targetBloomBaseY]);

  // Layer 3: Lightweight Innermost Soft Tissue Collar
  const layer3Geo = useMemo(() => {
    return createContinuousFloristSleeveGeometry({
      rTop: innerTopR,
      rBottom: 0.38,
      height: wrapH - 0.08,
      targetBloomBaseY,
      overlapAngle: Math.PI * 0.10,
      peakHeightScale: 0.20,
      creaseDepth: 0.03,
      asymmetrySeed: 0.8
    });
  }, [innerTopR, wrapH, targetBloomBaseY]);

  // Config for 3 Distinct Wrapping Paper Layers with Red, Yellow, and Dark Brown!
  const paperConfig = useMemo(() => {
    switch (activePaperId) {
      case 'kraft-paper':
        return {
          outerColor: '#d43f3f',  // Layer 1: Rich Warm Red (Outer)
          middleColor: '#f5b82e', // Layer 2: Vibrant Sunflower Yellow (Middle)
          innerColor: '#3d261a',  // Layer 3: Deep Mocha Dark Brown (Inner)
          useTexture: true,       // Vintage Botanical toile print decoration
          roughness: 0.85,
          metalness: 0.02,
          ribbonColor: '#f5b82e'  // Warm Yellow Satin Ribbon
        };
      case 'gold-paper':
        return {
          outerColor: '#d4af37',  // Layer 1: Royal Gold Metallic Paper (Outer)
          middleColor: '#f8f8f8', // Layer 2: Pure Crisp White (Middle)
          innerColor: '#141414',  // Layer 3: Onyx Black (Inner)
          useTexture: true,       // Vintage Botanical toile print decoration
          roughness: 0.40,
          metalness: 0.30,
          ribbonColor: '#d4af37'  // Gold Satin Ribbon
        };
      case 'botanical-toile':
      default:
        return {
          outerColor: '#1c3a27',  // Layer 1: Dark Green (Outer)
          middleColor: '#82be72', // Layer 2: Light Green (Middle)
          innerColor: '#121212',  // Layer 3: Onyx Black (Inner)
          useTexture: true,       // Vintage Botanical toile print decoration
          roughness: 0.85,
          metalness: 0.02,
          ribbonColor: '#82be72'  // Light Green Satin Ribbon
        };
    }
  }, [activePaperId]);

  // Organic 3D spline control points for Left Ribbon Tail
  const leftTailPoints = useMemo(() => [
    [-0.06, 1.08, 0.52],
    [-0.14, 0.74, 0.56],
    [-0.24, 0.40, 0.65],
    [-0.32, 0.06, 0.78],
    [-0.45, 0.024, 0.98],
    [-0.58, 0.020, 1.22],
    [-0.72, 0.016, 1.48]
  ], []);

  // Organic 3D spline control points for Right Ribbon Tail
  const rightTailPoints = useMemo(() => [
    [0.06, 1.08, 0.52],
    [0.16, 0.72, 0.58],
    [0.26, 0.38, 0.68],
    [0.38, 0.06, 0.85],
    [0.55, 0.024, 1.10],
    [0.72, 0.020, 1.38],
    [0.90, 0.016, 1.62]
  ], []);

  return (
    <group>
      {/* 1. RUSTIC WOODEN TABLE SURFACE */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#d5b48e"
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>

      {/* Main Bouquet Wrapper Structure (Scales dynamically with bouquet size) */}
      <group position={[0, 0, 0]} scale={scaleVector}>

        {/* STEM HANDLE BASE (Paper gathered down to standing base) */}
        <mesh castShadow receiveShadow position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.42, 0.34, 1.05, 16]} />
          <meshStandardMaterial
            map={paperConfig.useTexture ? botanicalTexture : null}
            color={paperConfig.outerColor}
            roughness={paperConfig.roughness}
            metalness={paperConfig.metalness}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ========================================================================= */}
        {/* LAYER 3 (INNERMOST TISSUE COLLAR - Soft dark tissue lining flower stems)   */}
        {/* Soft tissue collar peeking out right beneath lower blooms                */}
        {/* ========================================================================= */}
        <group position={[0, wrapY - 0.05, 0]} rotation={[-0.04, -0.15, 0.03]}>
          <mesh geometry={layer3Geo} castShadow receiveShadow>
            <meshStandardMaterial
              color={paperConfig.innerColor}
              roughness={0.92}
              metalness={0.0}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* ========================================================================= */}
        {/* LAYER 2 (MIDDLE CONTRAST ACCENT RIM - Lightweight contrast border)         */}
        {/* Continuous accent rim peeking between tissue collar and outer envelope   */}
        {/* ========================================================================= */}
        <group position={[0, wrapY - 0.02, 0]} rotation={[-0.06, 0.10, -0.02]}>
          <mesh geometry={layer2Geo} castShadow receiveShadow>
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.middleColor}
              roughness={paperConfig.roughness}
              metalness={paperConfig.metalness}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* ========================================================================= */}
        {/* LAYER 1 (PRIMARY CONTINUOUS OUTER FLORIST SLEEVE)                         */}
        {/* Full 360-degree continuous tapered sleeve with subtle front overlap fold   */}
        {/* ========================================================================= */}
        <group position={[0, wrapY, 0]} rotation={[-0.08, 0, 0]}>
          <mesh geometry={layer1Geo} castShadow receiveShadow>
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.outerColor}
              roughness={paperConfig.roughness}
              metalness={paperConfig.metalness}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* GATHERED WAIST & SILKY DUSTY PINK SATIN RIBBON BOW */}
        <group position={[0, 1.1, 0]}>
          {/* Satin Ribbon Band */}
          <mesh castShadow>
            <torusGeometry args={[0.47, 0.055, 10, 32]} />
            <meshStandardMaterial
              color={paperConfig.ribbonColor}
              roughness={0.28}
              metalness={0.14}
            />
          </mesh>

          {/* Plush Double-Loop Satin Ribbon Bow */}
          <group position={[0, 0, 0.50]}>
            {/* Center Bow Knot */}
            <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
              <sphereGeometry args={[0.09, 14, 14]} />
              <meshStandardMaterial
                color={paperConfig.ribbonColor}
                roughness={0.28}
                metalness={0.14}
              />
            </mesh>

            {/* Left Satin Bow Loop */}
            <group position={[-0.26, 0.04, 0.02]} rotation={[0.1, 0.32, -0.38]}>
              <mesh castShadow scale={[1.4, 0.78, 0.85]}>
                <torusGeometry args={[0.16, 0.045, 10, 24]} />
                <meshStandardMaterial
                  color={paperConfig.ribbonColor}
                  roughness={0.28}
                  metalness={0.14}
                />
              </mesh>
            </group>

            {/* Right Satin Bow Loop */}
            <group position={[0.26, 0.04, 0.02]} rotation={[0.1, -0.32, 0.38]}>
              <mesh castShadow scale={[1.4, 0.78, 0.85]}>
                <torusGeometry args={[0.16, 0.045, 10, 24]} />
                <meshStandardMaterial
                  color={paperConfig.ribbonColor}
                  roughness={0.28}
                  metalness={0.14}
                />
              </mesh>
            </group>
          </group>

          {/* SMOOTH 3D CATMULL-ROM SPLINE RIBBON TAILS */}
          <RibbonTailMesh
            controlPoints={leftTailPoints}
            width={0.16}
            color={paperConfig.ribbonColor}
          />
          <RibbonTailMesh
            controlPoints={rightTailPoints}
            width={0.17}
            color={paperConfig.ribbonColor}
          />
        </group>

      </group>
    </group>
  );
}




