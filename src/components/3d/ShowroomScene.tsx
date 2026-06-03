import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Html,
  Text,
  Float,
  Sparkles,
  Environment,
  ContactShadows,
  RoundedBox,
  Torus,
  Cylinder,
} from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

/* ------------------------------ Hotspot ------------------------------ */
const Hotspot = ({
  position,
  label,
  route,
  color = '#0F62FE',
}: {
  position: [number, number, number];
  label: string;
  route: string;
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t;
      meshRef.current.position.y = Math.sin(t * 2) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      const s = 1 + Math.sin(t * 3) * 0.1;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={() => navigate(route)}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1 : 0.6}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.03, 16, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
      <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div
          className={`bg-background/95 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-primary/20 shadow-lg transition-all duration-200 ${
            hovered ? 'scale-110' : 'scale-100'
          }`}
        >
          {label}
        </div>
      </Html>
    </group>
  );
};

/* ----------------------- Animated Draped Fabric ----------------------- */
const DrapedFabric = ({
  position,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const geom = ref.current.geometry as THREE.PlaneGeometry;
    const pos = geom.attributes.position;
    const t = state.clock.elapsedTime * speed;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 2 + t) * 0.08 + Math.cos(y * 2 + t) * 0.08;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh ref={ref} position={position} rotation={[0, 0, 0]}>
      <planeGeometry args={[1.4, 2.2, 32, 32]} />
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
};

/* ----------------------------- Mannequin ----------------------------- */
const Mannequin = ({
  position,
  color = '#d8c3a5',
}: {
  position: [number, number, number];
  color?: string;
}) => {
  return (
    <group position={position}>
      {/* base */}
      <Cylinder args={[0.4, 0.5, 0.1, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2b2b2b" metalness={0.5} roughness={0.4} />
      </Cylinder>
      {/* pole */}
      <Cylinder args={[0.05, 0.05, 0.6, 16]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </Cylinder>
      {/* torso */}
      <mesh position={[0, 1.2, 0]}>
        <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* head */}
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
};

/* ------------------------- Section / Booth -------------------------- */
const Section = ({
  position,
  rotation = [0, 0, 0],
  title,
  route,
  primary,
  secondary,
  accent,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  route: string;
  primary: string;
  secondary: string;
  accent: string;
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Booth back wall */}
      <RoundedBox args={[5, 3.5, 0.15]} radius={0.1} position={[0, 1.5, -1.2]}>
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </RoundedBox>

      {/* Display rugs / fabric panels */}
      <DrapedFabric position={[-1.5, 1.6, -1.05]} color={primary} speed={0.8} />
      <DrapedFabric position={[0, 1.6, -1.05]} color={secondary} speed={1.1} />
      <DrapedFabric position={[1.5, 1.6, -1.05]} color={accent} speed={0.9} />

      {/* Mannequins on either side */}
      <Mannequin position={[-1.8, -0.5, 0.2]} color={primary} />
      <Mannequin position={[1.8, -0.5, 0.2]} color={accent} />

      {/* Floor plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[2.6, 48]} />
        <meshStandardMaterial color="#f3eee6" roughness={0.9} />
      </mesh>

      {/* Title text */}
      <Text
        position={[0, 3.3, -1.1]}
        fontSize={0.32}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* Floating hotspot */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Hotspot position={[0, 2.2, 0.5]} label={title} route={route} color={primary} />
      </Float>

      <Sparkles count={30} scale={[5, 3, 2]} size={2} speed={0.4} color={primary} />
    </group>
  );
};

/* ------------------------------ Room ------------------------------ */
const Room = () => {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#ece6dc" roughness={0.9} />
      </mesh>

      {/* Ceiling subtle */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* Center pedestal */}
      <group position={[0, -1.7, 0]}>
        <Cylinder args={[1.2, 1.4, 0.4, 48]}>
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.4} />
        </Cylinder>
        <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
          <Torus args={[0.6, 0.15, 24, 64]} position={[0, 1.4, 0]}>
            <meshStandardMaterial color="#0F62FE" metalness={0.7} roughness={0.2} emissive="#0F62FE" emissiveIntensity={0.3} />
          </Torus>
        </Float>
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.35}
          color="#0F62FE"
          anchorX="center"
          anchorY="middle"
        >
          TextTiles Showroom
        </Text>
      </group>

      {/* Four section booths arranged around the room */}
      <Section
        position={[-7, 0, -6]}
        title="Women"
        route="/women"
        primary="#E91E63"
        secondary="#FF80AB"
        accent="#AD1457"
      />
      <Section
        position={[7, 0, -6]}
        title="Men"
        route="/men"
        primary="#2196F3"
        secondary="#64B5F6"
        accent="#1565C0"
      />
      <Section
        position={[-7, 0, 4]}
        rotation={[0, Math.PI, 0]}
        title="Kids"
        route="/kids"
        primary="#FF9800"
        secondary="#FFB74D"
        accent="#F57C00"
      />
      <Section
        position={[7, 0, 4]}
        rotation={[0, Math.PI, 0]}
        title="Home Textiles"
        route="/home-textiles"
        primary="#4CAF50"
        secondary="#81C784"
        accent="#2E7D32"
      />

      {/* Hanging lights */}
      {[-6, 0, 6].map((x) => (
        <group key={x} position={[x, 6.5, 0]}>
          <Cylinder args={[0.02, 0.02, 1.5]} position={[0, -0.75, 0]}>
            <meshStandardMaterial color="#444" />
          </Cylinder>
          <mesh position={[0, -1.6, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color="#fff7d6"
              emissive="#fff2b8"
              emissiveIntensity={1.2}
            />
          </mesh>
          <pointLight position={[0, -1.6, 0]} intensity={0.6} color="#fff2b8" distance={10} />
        </group>
      ))}

      <ContactShadows position={[0, -1.99, 0]} opacity={0.5} scale={40} blur={2.4} far={6} />
    </>
  );
};

/* ----------------------------- Loader ----------------------------- */
const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      Loading 3D models…
    </div>
  </Html>
);

/* --------------------------- Main Scene --------------------------- */
const ShowroomScene = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 4, 14], fov: 55, near: 0.1, far: 1000 }}
      style={{ background: 'linear-gradient(to bottom, #e3f2fd 0%, #fafafa 60%, #f5e9d8 100%)' }}
    >
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#ffffff', '#b8a98f', 0.4]} />
        <directionalLight
          position={[10, 15, 8]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight position={[-10, 12, -5]} angle={0.4} penumbra={1} intensity={0.7} castShadow />

        <Environment preset="apartment" />
        <Room />
      </Suspense>

      <OrbitControls
        enablePan
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 6}
        minDistance={5}
        maxDistance={24}
        enableDamping
        dampingFactor={0.06}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />
    </Canvas>
  );
};

export default ShowroomScene;
