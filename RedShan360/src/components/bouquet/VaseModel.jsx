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

export default function VaseModel({ wrappingId, bouquetSize = 'MEDIUM', sizeConfig = null }) {
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

  // Config for 3 Distinct Wrapping Paper Layers with Red, Yellow, and Dark Brown!
  const paperConfig = useMemo(() => {
    switch (activePaperId) {
      case 'kraft-paper':
        return {
          outerColor: '#d43f3f',  // Layer 1: Rich Warm Red (Outer)
          middleColor: '#f5b82e', // Layer 2: Vibrant Sunflower Yellow (Middle)
          innerColor: '#3d261a',  // Layer 3: Deep Mocha Dark Brown (Inner)
          useTexture: true,       // Vintage Botanical toile print decoration
          roughness: 0.80,
          metalness: 0.05,
          ribbonColor: '#f5b82e'  // Warm Yellow Satin Ribbon
        };
      case 'gold-paper':
        return {
          outerColor: '#d4af37',  // Layer 1: Royal Gold Metallic Paper (Outer)
          middleColor: '#f8f8f8', // Layer 2: Pure Crisp White (Middle)
          innerColor: '#141414',  // Layer 3: Onyx Black (Inner)
          useTexture: true,       // Vintage Botanical toile print decoration
          roughness: 0.35,
          metalness: 0.35,
          ribbonColor: '#d4af37'  // Gold Satin Ribbon
        };
      case 'botanical-toile':
      default:
        return {
          outerColor: '#1c3a27',  // Layer 1: Dark Green (Outer)
          middleColor: '#82be72', // Layer 2: Light Green (Middle)
          innerColor: '#121212',  // Layer 3: Onyx Black (Inner)
          useTexture: true,       // Vintage Botanical toile print decoration
          roughness: 0.80,
          metalness: 0.05,
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

        {/* STEM HANDLE BASE (Paper naturally gathered down to standing base) */}
        <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.44, 0.35, 1.1, 16]} />
          <meshStandardMaterial
            map={paperConfig.useTexture ? botanicalTexture : null}
            color={paperConfig.outerColor}
            roughness={paperConfig.roughness}
            metalness={paperConfig.metalness}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ========================================================================= */}
        {/* LAYER 3 (INNERMOST TISSUE LAYER - COLOR 3: Warm Ivory Tissue)              */}
        {/* Directly cradles flower stems peeking out highest under blooms           */}
        {/* ========================================================================= */}
        <group position={[0, 2.32, -0.05]} rotation={[-0.08, 0.02, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.82, 0.44, 2.25, 14, 1, true]} />
            <meshStandardMaterial
              color={paperConfig.innerColor}
              roughness={0.92}
              metalness={0.0}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Innermost soft tissue ruffles */}
          <mesh position={[-0.4, 0.6, 0.4]} rotation={[0.2, 0.2, -0.1]} castShadow>
            <planeGeometry args={[1.0, 1.0]} />
            <meshStandardMaterial color={paperConfig.innerColor} roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.4, 0.62, 0.4]} rotation={[0.2, -0.2, 0.1]} castShadow>
            <planeGeometry args={[1.0, 1.0]} />
            <meshStandardMaterial color={paperConfig.innerColor} roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* ========================================================================= */}
        {/* LAYER 2 (MIDDLE CONTRAST ACCENT PAPER - COLOR 2: Dusty Rose / Accent)     */}
        {/* Staggered framing layer visible clearly between Layer 1 & Layer 3         */}
        {/* ========================================================================= */}
        <group position={[0, 2.42, -0.20]} rotation={[-0.12, -0.02, -0.01]}>
          {/* Middle Back Fan Panel (Protrudes slightly wider than Layer 1 to create visible border) */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[2.05, 0.45, 2.45, 16, 1, true, -Math.PI * 0.72, Math.PI * 1.44]} />
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.middleColor}
              roughness={paperConfig.roughness}
              metalness={paperConfig.metalness}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Middle Layer Left Origami Ear */}
          <mesh position={[-1.2, 1.15, -0.04]} rotation={[0.12, 0.32, -0.34]} castShadow>
            <planeGeometry args={[1.35, 1.45]} />
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.middleColor}
              roughness={paperConfig.roughness}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Middle Layer Right Origami Ear */}
          <mesh position={[1.15, 1.18, -0.04]} rotation={[0.10, -0.26, 0.30]} castShadow>
            <planeGeometry args={[1.30, 1.38]} />
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.middleColor}
              roughness={paperConfig.roughness}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* ========================================================================= */}
        {/* LAYER 1 (OUTER MAIN PAPER WRAPPER - COLOR 1: Vintage Toile / Kraft / Gold) */}
        {/* Broadest outer fan envelope extending around back, sides, and front      */}
        {/* ========================================================================= */}
        <group position={[0, 2.50, -0.32]} rotation={[-0.16, -0.03, -0.02]}>
          {/* Main Outer Broad Back Fan Panel */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[2.25, 0.46, 2.65, 18, 1, true, -Math.PI * 0.75, Math.PI * 1.5]} />
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.outerColor}
              roughness={paperConfig.roughness}
              metalness={paperConfig.metalness}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Outer Layer Left Flared Ear */}
          <mesh position={[-1.32, 1.32, -0.05]} rotation={[0.14, 0.35, -0.38]} castShadow>
            <planeGeometry args={[1.45, 1.55]} />
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.outerColor}
              roughness={paperConfig.roughness}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Outer Layer Right Flared Ear */}
          <mesh position={[1.22, 1.25, -0.05]} rotation={[0.10, -0.28, 0.32]} castShadow>
            <planeGeometry args={[1.38, 1.45]} />
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.outerColor}
              roughness={paperConfig.roughness}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Outer Top Peak */}
          <mesh position={[0.15, 1.48, -0.15]} rotation={[0.18, 0.05, 0.04]} castShadow>
            <planeGeometry args={[1.5, 1.4]} />
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.outerColor}
              roughness={paperConfig.roughness}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* FRONT CRADLING ENVELOPE COLLAR (OUTER & MIDDLE FOLDS VISIBLE IN FRONT) */}
        <group position={[0, 1.88, 0.24]} rotation={[0.18, 0.02, 0]}>
          {/* Outer Envelope Front Cuff */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.68, 0.46, 1.75, 14, 1, true, -Math.PI * 0.35, Math.PI * 0.7]} />
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.outerColor}
              roughness={paperConfig.roughness}
              metalness={paperConfig.metalness}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Middle Layer Accent Cuff peeking out in front */}
          <mesh position={[0, 0.12, -0.04]} castShadow receiveShadow>
            <cylinderGeometry args={[1.62, 0.45, 1.70, 14, 1, true, -Math.PI * 0.32, Math.PI * 0.64]} />
            <meshStandardMaterial
              color={paperConfig.middleColor}
              roughness={paperConfig.roughness}
              metalness={paperConfig.metalness}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Front Left Overlapping Fold */}
          <mesh position={[-0.68, 0.32, 0.34]} rotation={[0.22, 0.45, -0.3]} castShadow>
            <planeGeometry args={[1.15, 1.15]} />
            <meshStandardMaterial
              map={paperConfig.useTexture ? botanicalTexture : null}
              color={paperConfig.outerColor}
              roughness={paperConfig.roughness}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Front Right Overlapping Fold */}
          <mesh position={[0.60, 0.36, 0.30]} rotation={[0.20, -0.38, 0.25]} castShadow>
            <planeGeometry args={[1.08, 1.12]} />
            <meshStandardMaterial
              color={paperConfig.middleColor}
              roughness={paperConfig.roughness}
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




