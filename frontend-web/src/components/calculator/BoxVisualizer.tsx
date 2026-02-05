import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { PackedItem } from '../../services/calculatorService';

interface BoxVisualizerProps {
    length: number;
    width: number;
    height: number;
    packedItems?: PackedItem[];
}

const BoxMesh: React.FC<BoxVisualizerProps> = ({ length, width, height, packedItems }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;
        }
    });

    // Normalize dimensions for display (scale down to fit view)
    const maxDim = Math.max(length, width, height);
    const scale = 3 / maxDim;

    // Center offset (to center the whole bin at 0,0,0)
    const offsetX = -length / 2;
    const offsetY = -height / 2;
    const offsetZ = -width / 2; // Note: In ThreeJS usually Y is Up. bp3d uses Width/Height/Depth. Mapping might be needed. 
    // Assuming: 
    // bp3d width -> x
    // bp3d height -> y
    // bp3d depth -> z

    // In our backend:
    // width = item.length (x)
    // height = item.width (y)
    // depth = item.height (z)

    // We used:
    // packer.addBin(new Bin(..., length, width, height...))
    // So bin.width = length, bin.height = width, bin.depth = height
    // This mapping seems consistent.

    return (
        <group ref={groupRef} scale={[scale, scale, scale]}>
            {/* The Container Box */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[length, width, height]} />
                <meshStandardMaterial
                    color="#94a3b8"
                    roughness={0.1}
                    metalness={0.1}
                    transparent
                    opacity={0.1}
                />
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(length, width, height)]} />
                    <lineBasicMaterial color="white" transparent opacity={0.3} />
                </lineSegments>
            </mesh>

            {/* Packed Items */}
            {packedItems?.map((item, idx) => (
                <mesh
                    key={`${item.name}-${idx}`}
                    position={[
                        offsetX + item.x + item.width / 2,
                        offsetY + item.y + item.height / 2,
                        offsetZ + item.z + item.depth / 2
                    ]}
                >
                    <boxGeometry args={[item.width, item.height, item.depth]} />
                    <meshStandardMaterial
                        color={`hsl(${(idx * 137.5) % 360}, 70%, 50%)`}
                        roughness={0.4}
                    />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.BoxGeometry(item.width, item.height, item.depth)]} />
                        <lineBasicMaterial color="black" transparent opacity={0.2} />
                    </lineSegments>
                </mesh>
            ))}
        </group>
    );
};

const BoxVisualizer: React.FC<BoxVisualizerProps> = (props) => {
    return (
        <div className="visualizer-canvas-wrapper">
            <Canvas>
                <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                <OrbitControls enableZoom={true} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <BoxMesh {...props} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default BoxVisualizer;
