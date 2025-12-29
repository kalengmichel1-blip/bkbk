"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

function ParticleGlobe(props: any) {
    const ref = useRef<THREE.Points>(null);
    const [sphere] = useState(() => random.inSphere(new Float32Array(6000), { radius: 1.2 }));

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            {/* Primary Brand Blue Layer */}
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#1C2B4B" // Brand Blue
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.5}
                />
            </Points>
            {/* Secondary Brand Red Layer (Subtle Accents) */}
            <Points positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#A61C1C" // Brand Red
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.3}
                />
            </Points>
        </group>
    );
}

export function HeroGlobe() {
    return (
        <div className="absolute inset-0 pointer-events-none fade-in" style={{ opacity: 0.8 }}>
            {/* Gradient Mask to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleGlobe />
            </Canvas>
        </div>
    );
}
