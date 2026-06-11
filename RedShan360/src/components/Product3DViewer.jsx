import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={1.2} />;
}

export default function Product3DViewer({ model }) {
    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>

                {/* Lights */}
                <ambientLight intensity={1} />
                <directionalLight position={[5, 5, 5]} intensity={2} />

                <Suspense fallback={null}>
                    <Environment preset="studio" />

                    <Center>
                        <Model url={model || '/models/redrose.glb'} />
                    </Center>
                </Suspense>

                {/* 360 Controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    autoRotate={true}
                    autoRotateSpeed={1}
                />

            </Canvas>
        </div>
    );
}