
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleDynamicField() {
  const ref = useRef<THREE.Points>(null!);
  
  // Create a field of random points
  const points = useMemo(() => {
    const p = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15; // x
      p[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      p[i * 3 + 2] = (Math.random() - 0.5) * 15; // z
    }
    return p;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = time * 0.05;
    ref.current.rotation.x = Math.sin(time / 4) * 0.1;

    // React to scroll - we'll get scroll position from window
    const scrollY = window.scrollY;
    ref.current.position.z = -Math.min(scrollY * 0.005, 5); 
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#22d3ee"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function TradingGrid() {
  const gridRef = useRef<THREE.GridHelper>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = window.scrollY;
    
    // Tilt the grid based on scroll
    gridRef.current.rotation.x = -Math.PI / 2.5 + (scrollY * 0.0002);
    gridRef.current.position.y = -2 + (scrollY * 0.001);
  });

  return (
    <gridHelper 
      ref={gridRef} 
      args={[100, 50, '#22d3ee', '#0891b2']} 
      position={[0, -2, 0]} 
      rotation={[-Math.PI / 2.5, 0, 0]}
    />
  );
}

const TradingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={['#020617', 5, 15]} />
        <ambientLight intensity={0.5} />
        <ParticleDynamicField />
        <TradingGrid />
      </Canvas>
      
      {/* Subtle scanline overlay to keep consistent with existing aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
    </div>
  );
};

export default TradingBackground;
