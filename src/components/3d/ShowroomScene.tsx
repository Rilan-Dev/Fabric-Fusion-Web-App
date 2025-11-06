import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const Hotspot = ({ 
  position, 
  label, 
  route, 
  color = "#0F62FE" 
}: { 
  position: [number, number, number]; 
  label: string; 
  route: string;
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef} 
        onClick={() => navigate(route)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 0.8 : 0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Html center distanceFactor={10}>
        <div className={`
          bg-background/95 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium 
          whitespace-nowrap pointer-events-none border border-primary/20 shadow-lg
          transition-all duration-200 ${hovered ? 'scale-110' : 'scale-100'}
        `}>
          {label}
        </div>
      </Html>
    </group>
  );
};

const ProductShelf = ({ 
  position, 
  color, 
  label,
  products = 3
}: { 
  position: [number, number, number]; 
  color: string;
  label: string;
  products?: number;
}) => {
  return (
    <group position={position}>
      {/* Shelf base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      {/* Product representations */}
      {Array.from({ length: products }).map((_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.6, 0, 0]}>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {/* Label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.15}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const Room = () => {
  return (
    <>
      {/* Floor with tile pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#f0f0f0" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 3, -12]} receiveShadow>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>

      {/* Right Wall */}
      <mesh position={[15, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>

      {/* Women's Section - Left */}
      <group position={[-6, -1, -6]}>
        <ProductShelf position={[0, 0, 0]} color="#E91E63" label="Sarees" />
        <ProductShelf position={[3, 0, 0]} color="#9C27B0" label="Kurtis" />
        <Hotspot position={[1.5, 2.5, 0]} label="Women's Collection" route="/women" color="#E91E63" />
      </group>

      {/* Men's Section - Right */}
      <group position={[6, -1, -6]}>
        <ProductShelf position={[0, 0, 0]} color="#2196F3" label="Shirts" />
        <ProductShelf position={[-3, 0, 0]} color="#1976D2" label="Pants" />
        <Hotspot position={[-1.5, 2.5, 0]} label="Men's Collection" route="/men" color="#2196F3" />
      </group>

      {/* Kids Section - Center Left */}
      <group position={[-6, -1, 0]}>
        <ProductShelf position={[0, 0, 0]} color="#FF9800" label="Boys" />
        <ProductShelf position={[3, 0, 0]} color="#FFC107" label="Girls" />
        <Hotspot position={[1.5, 2.5, 0]} label="Kids Collection" route="/kids" color="#FF9800" />
      </group>

      {/* Home Textiles - Center Right */}
      <group position={[6, -1, 0]}>
        <ProductShelf position={[0, 0, 0]} color="#4CAF50" label="Bedding" />
        <ProductShelf position={[-3, 0, 0]} color="#8BC34A" label="Curtains" />
        <Hotspot position={[-1.5, 2.5, 0]} label="Home Textiles" route="/home-textiles" color="#4CAF50" />
      </group>

      {/* Central Display */}
      <mesh position={[0, 0, -3]} castShadow>
        <cylinderGeometry args={[1, 1, 0.3, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Text
        position={[0, 0.5, -3]}
        fontSize={0.3}
        color="#0F62FE"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        TextTiles
      </Text>

      {/* Ambient elements */}
      <mesh position={[-10, 6, -10]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[10, 6, -10]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
    </>
  );
};

const ShowroomScene = () => {
  return (
    <Canvas 
      shadows
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
      camera={{ 
        position: [0, 4, 12], 
        fov: 60,
        near: 0.1,
        far: 1000
      }}
      style={{ background: 'linear-gradient(to bottom, #e3f2fd, #ffffff)' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 15, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight 
        position={[-10, 15, -5]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.8}
        castShadow
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />
      
      <Room />
      
      <OrbitControls
        enablePan={true}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
        minDistance={5}
        maxDistance={20}
        enableDamping
        dampingFactor={0.05}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
      />
    </Canvas>
  );
};

export default ShowroomScene;
