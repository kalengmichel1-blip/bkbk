"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

function Wave(props: any) {
    const ref = useRef<any>(null);

    // @ts-ignore
    const sphere = random.inSphere(new Float32Array(1200), { radius: 1.5 });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
            // Simple breathing effect
            ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime / 2) * 0.1);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#bb1919"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function ParticleWave() {
    return (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Wave />
            </Canvas>
        </div>
    );
}
