'use client'

import React,{ useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, GradientTexture, MeshDistortMaterial } from '@react-three/drei'

// This component creates the moving gradient background
const GradientBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  // useFrame is a hook that runs on every single frame, allowing for animation
  useFrame((_state, delta) => {
    // Slowly rotate the mesh for a dynamic effect
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={15}>
      {/* A plane that fills the background */}
      <planeGeometry args={[1, 1]} />
      {/* A material with a gradient texture */}
      <meshStandardMaterial>
        <GradientTexture
          stops={[0, 1]} // Two colors in the gradient
          colors={["#000428", "#004e92"]} // Your blue and purple colors
          size={1024}
        />
      </meshStandardMaterial>
    </mesh>
  );
};

// This is the main 3D component
const ThreeDScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      {/* This light illuminates the entire scene */}
      <ambientLight intensity={2} />
      
      {/* The moving gradient background */}
      <GradientBackground />
    </Canvas>
  )
}

export default ThreeDScene