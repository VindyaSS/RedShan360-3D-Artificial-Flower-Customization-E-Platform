import { useRef, useMemo, Component } from 'react';
import { useGLTF, Clone, TransformControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// URL validator to ensure a path is non-empty and structurally usable
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  if (trimmed === '' || trimmed.includes('undefined') || trimmed.includes('null')) return false;
  return true;
};

// R3F-safe Error Boundary class component that renders valid 3D groups on failure
class GLBErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.warn('GLBErrorBoundary caught loading failure for URL:', this.props.url, error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Lightweight procedural fallback flower mesh
function FallbackFlowerMesh({ color = '#a82c2c', scale = 1 }) {
  return (
    <group scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#eedd82" roughness={0.7} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 5;
        const x = Math.cos(angle) * 0.16;
        const z = Math.sin(angle) * 0.16;
        return (
          <mesh key={i} position={[x, 0.04, z]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

// Dedicated child component wrapping useGLTF and Clone
function DynamicGLBFlower({ url, scale, rotationOffset }) {
  const { scene } = useGLTF(url);
  return (
    <group rotation={rotationOffset}>
      <Clone object={scene} scale={scale} castShadow receiveShadow />
    </group>
  );
}

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
export default function FlowerModel({ 
  flower, 
  isSelected, 
  isSwapFirst,
  isSwapMode,
  onSelectFlower, 
  onUpdateFlowerTransform, 
  stemsDatabase 
}) {
  const { stemId, position, rotation, scale } = flower;
  const dbItem = useMemo(() => stemsDatabase.find(s => String(s.id) === String(stemId)), [stemsDatabase, stemId]);
  
  // Resolve model URL with dynamic -> legacy ordering
  const glbUrl = useMemo(() => {
    if (dbItem && isValidUrl(dbItem.modelUrl)) {
      return dbItem.modelUrl;
    }
    const legacyPath = MODEL_MAPPING[stemId];
    if (isValidUrl(legacyPath)) {
      return legacyPath;
    }
    return null;
  }, [dbItem, stemId]);

  const groupRef = useRef();
  const stemRef = useRef();

  // Adjust model orientation offset depending on GLB geometry defaults
  const rotationOffset = useMemo(() => {
    // Some models come horizontal or rotated; we align them to point upwards
    if (stemId === '8') return new THREE.Euler(0, 0, 0); // Red Rose default
    if (stemId === '10') return new THREE.Euler(Math.PI / 2, 0, 0); // Lily
    if (stemId === '7') return new THREE.Euler(0, 0, 0); // Headdress
    return new THREE.Euler(0, 0, 0);
  }, [stemId]);

  // Adjust model scale depending on natural flower size (~12-14% fuller bloom scale)
  const modelScale = useMemo(() => {
    const defaultScale = 0.50;
    if (stemId === '8') return 0.56;  // Red Rose (+12%)
    if (stemId === '10') return 0.32; // Pink Lily (+14%)
    if (stemId === '7') return 0.40;  // Lily Headdress (+14%)
    if (stemId === '2' || stemId === '5') return 0.50; // Chrysanthemums (+14%)
    if (stemId === '3') return 0.50;  // Carnation (+14%)
    return defaultScale;
  }, [stemId]);

  // Handle procedural foliage
  const isProcedural = !glbUrl;
  const isEucalyptus = stemId === 'silver-eucalyptus';
  const isFern = stemId === 'emerald-fern';

  // Dynamic selection ring/mesh color helper
  const colorHex = dbItem?.color || '#a82c2c';

  // Vector / Euler targets for smooth lerping
  const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const targetRot = useMemo(() => new THREE.Euler(...rotation), [rotation]);

  // Smooth slide animation in useFrame
  useFrame((state, delta) => {
    if (groupRef.current) {
      // 1. Position/Rotation Lerp
      if (isSelected && !isSwapMode) {
        // Snap instantly when selected in normal mode to prevent lag during active dragging
        groupRef.current.position.copy(targetPos);
        groupRef.current.rotation.copy(targetRot);
      } else {
        // Lerp position smoothly (~0.5s transition)
        groupRef.current.position.lerp(targetPos, delta * 6.5);
        
        // Lerp rotation Euler coordinates
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.x, delta * 6.5);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot.y, delta * 6.5);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.z, delta * 6.5);
      }

      // 2. Dynamic stem scaling to connect central throat [0, 2.35, 0] to the flower head position
      if (stemRef.current) {
        const pStart = new THREE.Vector3(0, 2.35, 0);
        const pEnd = groupRef.current.position;
        const direction = new THREE.Vector3().subVectors(pEnd, pStart);
        const len = direction.length();
        const mid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.clone().normalize()
        );

        stemRef.current.position.copy(mid);
        stemRef.current.quaternion.copy(quat);
        stemRef.current.scale.set(1, Math.max(0.1, len), 1);
      }
    }
  });

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
      {/* 1. Dynamic Stem Cylinder (converging to narrow central throat) */}
      <mesh ref={stemRef}>
        <cylinderGeometry args={[0.025, 0.032, 1.0, 8]} />
        <meshStandardMaterial color="#465a4a" roughness={0.85} />
      </mesh>

      {/* 2. Flower Head / Foliage Group */}
      <group 
        ref={groupRef}
        scale={scale}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (onSelectFlower) onSelectFlower(flower.id);
        }}
      >
        {isProcedural ? (
          // Render procedural elements
          isEucalyptus ? (
            <EucalyptusModel scale={0.95} />
          ) : isFern ? (
            <FernModel scale={1.05} />
          ) : (
            // Fallback lightweight daisy shape if model doesn't exist
            <FallbackFlowerMesh color={colorHex} scale={1.7} />
          )
        ) : (
          // Render cached GLB clone wrapped in ErrorBoundary with unique url key
          <GLBErrorBoundary key={glbUrl} url={glbUrl} fallback={<FallbackFlowerMesh color={colorHex} scale={1.7} />}>
            <DynamicGLBFlower url={glbUrl} scale={modelScale} rotationOffset={rotationOffset} />
          </GLBErrorBoundary>
        )}

        {/* 3. Selection outline highlight (standard mode) */}
        {isSelected && !isSwapMode && (
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

        {/* 4. Swap selection outline highlight (gold outline for target) */}
        {isSwapFirst && (
          <mesh>
            <sphereGeometry args={[isProcedural ? 0.48 : 0.63, 16, 16]} />
            <meshBasicMaterial 
              color="#ffd700" 
              wireframe 
              transparent 
              opacity={0.6} 
            />
          </mesh>
        )}
      </group>

      {/* 5. Transform Gizmo (Renders visual transform tools in Canvas) */}
      {isSelected && !isSwapMode && (
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