"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, Float } from "@react-three/drei";

function Gem({ position, scale, color }: any) {
    const ref = useRef<any>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.2;
            ref.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Icosahedron
                args={[1, 0]}
                ref={ref}
                position={position}
                scale={hovered ? scale * 1.1 : scale}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.2}
                    wireframe
                />
            </Icosahedron>
        </Float>
    );
}

export default function FloatingGeometry() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />

                {/* Randomly placed gems */}
                <Gem position={[-2, 1, 0]} scale={0.5} color="#bb1919" />
                <Gem position={[2, -1, -2]} scale={0.7} color="#075fa5" />
                <Gem position={[0, 2, -3]} scale={0.4} color="#bb1919" />
                <Gem position={[-1.5, -2, -1]} scale={0.6} color="#gray" />
            </Canvas>
        </div>
    );
}
