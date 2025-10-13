import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const Hotspot = ({ position, label, route }: { position: [number, number, number]; label: string; route: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const navigate = useNavigate();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={position} onClick={() => navigate(route)}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#0F62FE" emissive="#0F62FE" emissiveIntensity={0.5} />
      <Html center>
        <div className="bg-background/90 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none">
          {label}
        </div>
      </Html>
    </mesh>
  );
};

const Room = () => {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 3, -10]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Display Stands */}
      <mesh position={[-3, -1, -3]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#0F62FE" />
      </mesh>

      <mesh position={[3, -1, -3]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#8B5CF6" />
      </mesh>

      <mesh position={[0, -1, -5]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#EC4899" />
      </mesh>

      {/* Hotspots */}
      <Hotspot position={[-3, 1, -3]} label="Women's Collection" route="/category/women" />
      <Hotspot position={[3, 1, -3]} label="Men's Collection" route="/category/men" />
      <Hotspot position={[0, 1, -5]} label="Home Textiles" route="/category/home-textiles" />
    </>
  );
};

const ShowroomScene = () => {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Room />
      
      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={15}
      />
    </Canvas>
  );
};

export default ShowroomScene;
