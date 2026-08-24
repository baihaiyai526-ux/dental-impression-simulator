import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import NormalizedGLBModel from "./NormalizedGLBModel.jsx";

function ArchPlaceholder({ lower = false }) {
  const gumColor = lower ? "#f6a5a5" : "#f9b4b4";
  return (
    <group rotation={[0, 0, lower ? Math.PI : 0]}>
      <mesh position={[0, -0.05, -0.08]} scale={[1.75, 0.13, 0.96]}>
        <torusGeometry args={[0.78, 0.08, 18, 96, Math.PI]} />
        <meshStandardMaterial color={gumColor} roughness={0.6} />
      </mesh>
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 11) * Math.PI - Math.PI;
        const x = Math.cos(angle) * 1.22;
        const z = Math.sin(angle) * 0.68;
        const scale = index === 0 || index === 11 ? [0.16, 0.26, 0.2] : [0.18, 0.34, 0.22];
        return (
          <mesh key={index} position={[x, 0.18, z]} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#f8fbff" roughness={0.38} />
          </mesh>
        );
      })}
    </group>
  );
}

function TrayPlaceholder({ lower = false, active = false, filled = false }) {
  return (
    <group rotation={[0, 0, lower ? Math.PI : 0]}>
      <mesh position={[0, 0, -0.04]} scale={[1.82, 0.18, 0.95]}>
        <torusGeometry args={[0.8, 0.11, 18, 96, Math.PI]} />
        <meshStandardMaterial color={active ? "#22c55e" : "#60a5fa"} metalness={0.08} roughness={0.34} />
      </mesh>
      {filled && <AlginatePlaceholder position={[0, 0.15, -0.16]} scale={[1.35, 0.16, 0.58]} />}
      <mesh position={[0, -0.03, 0.28]} scale={[1.08, 0.08, 0.25]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2563eb" roughness={0.38} />
      </mesh>
    </group>
  );
}

function BowlPlaceholder() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.78, 0.13, 24, 96]} />
        <meshStandardMaterial color="#93c5fd" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.22, 0]} scale={[0.95, 0.32, 0.95]}>
        <sphereGeometry args={[0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#dbeafe" transparent opacity={0.78} roughness={0.32} />
      </mesh>
    </group>
  );
}

function SpatulaPlaceholder({ position = [0, 0, 0] }) {
  return (
    <group position={position} rotation={[0.25, 0.35, -0.55]}>
      <mesh scale={[0.1, 0.05, 1.25]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#64748b" metalness={0.2} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.78]} scale={[0.34, 0.04, 0.34]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

function AlginatePlaceholder({ position = [0, 0, 0], scale = [0.8, 0.22, 0.48] }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshStandardMaterial color="#7dd3fc" transparent opacity={0.58} roughness={0.18} />
    </mesh>
  );
}

function ImpressionPlaceholder({ variant = "good" }) {
  const isDistorted = variant === "distorted";
  const color = variant === "good" ? "#bfdbfe" : variant === "bubble" ? "#bae6fd" : variant === "defect" ? "#c7d2fe" : "#ddd6fe";
  return (
    <group rotation={isDistorted ? [0.22, 0.08, -0.2] : [0, 0, 0]} scale={isDistorted ? [1.1, 0.85, 1.2] : [1, 1, 1]}>
      <mesh scale={[1.64, 0.22, 0.92]}>
        <torusGeometry args={[0.74, 0.16, 22, 96, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.42} />
      </mesh>
      {variant === "bubble" &&
        [0, 1, 2, 3].map((item) => (
          <mesh key={item} position={[-0.52 + item * 0.35, 0.16, -0.28]} scale={[0.07, 0.04, 0.07]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}
      {variant === "defect" && (
        <mesh position={[0.9, 0.08, -0.44]} scale={[0.35, 0.16, 0.2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      )}
      {variant === "distorted" && (
        <mesh position={[0.16, 0.2, -0.1]} rotation={[0.3, 0.2, 0.5]} scale={[1.2, 0.08, 0.16]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      )}
    </group>
  );
}

function PlaceholderByType({ type, active = false, filled = false }) {
  if (type === "upper_arch_placeholder" || type === "upperArch") return <ArchPlaceholder />;
  if (type === "lower_arch_placeholder" || type === "lowerArch") return <ArchPlaceholder lower />;
  if (type === "upper_tray_placeholder" || type === "upperTray") return <TrayPlaceholder active={active} filled={filled} />;
  if (type === "lower_tray_placeholder" || type === "lowerTray") return <TrayPlaceholder lower active={active} filled={filled} />;
  if (type === "mixing_bowl_placeholder" || type === "bowl") return <BowlPlaceholder />;
  if (type === "spatula_placeholder" || type === "spatula") return <SpatulaPlaceholder />;
  if (type === "alginate_placeholder") return <AlginatePlaceholder />;
  if (type === "good_impression_placeholder" || type === "qualified") return <ImpressionPlaceholder variant="good" />;
  if (type === "bubble_impression_placeholder" || type === "bubble") return <ImpressionPlaceholder variant="bubble" />;
  if (type === "defect_impression_placeholder" || type === "edgeDefect") return <ImpressionPlaceholder variant="defect" />;
  if (type === "distorted_impression_placeholder" || type === "deformed") return <ImpressionPlaceholder variant="distorted" />;
  return <ArchPlaceholder />;
}

function OperationScene({ stage }) {
  const isLower = stage.includes("lower");
  const showFilledTray = ["upperLoad", "upperSeat", "upperBorder", "lowerLoad", "lowerSeat", "lowerBorder"].includes(stage);
  const trayActive = ["upperSeat", "upperBorder", "lowerSeat", "lowerBorder"].includes(stage);
  const showUpperImpression = stage === "upperRemove";
  const showLowerImpression = stage === "lowerRemove";
  const qualityStage = stage === "quality";

  return (
    <group>
      {!qualityStage && !showUpperImpression && !showLowerImpression && (
        <group position={[0, -0.15, 0]}>
          <ArchPlaceholder lower={isLower} />
          <group position={trayActive ? [0, 0.42, 0.05] : [0, 1.15, 0.18]} rotation={trayActive ? [0, 0, 0] : [0.05, 0.1, 0]}>
            <TrayPlaceholder lower={isLower} active={trayActive} filled={showFilledTray} />
          </group>
        </group>
      )}
      {["ratio", "mixTime", "upperLoad", "lowerLoad"].includes(stage) && (
        <group position={[-1.45, -0.35, 0.45]} scale={[0.72, 0.72, 0.72]}>
          <BowlPlaceholder />
          <AlginatePlaceholder position={[0, 0.06, 0]} scale={[0.5, 0.16, 0.5]} />
          <SpatulaPlaceholder position={[0.75, 0.25, 0.1]} />
        </group>
      )}
      {showUpperImpression && <ImpressionPlaceholder variant="good" />}
      {showLowerImpression && <ImpressionPlaceholder variant="good" />}
      {qualityStage && (
        <group>
          <group position={[-1.45, 0, 0]} scale={[0.62, 0.62, 0.62]}><ImpressionPlaceholder variant="good" /></group>
          <group position={[-0.48, 0, 0]} scale={[0.62, 0.62, 0.62]}><ImpressionPlaceholder variant="bubble" /></group>
          <group position={[0.48, 0, 0]} scale={[0.62, 0.62, 0.62]}><ImpressionPlaceholder variant="defect" /></group>
          <group position={[1.45, 0, 0]} scale={[0.62, 0.62, 0.62]}><ImpressionPlaceholder variant="distorted" /></group>
        </group>
      )}
    </group>
  );
}

export default function ModelViewer({ model, sceneMode = "single", operationStage = "case" }) {
  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-br from-white to-blue-50 shadow-medical">
      <Canvas camera={{ position: [0, 2.45, 4.35], fov: 45 }}>
        <ambientLight intensity={0.76} />
        <directionalLight position={[3, 5, 4]} intensity={1.1} />
        <Center>
          <Suspense fallback={<PlaceholderByType type={model?.type} />}>
            {sceneMode === "operation" ? (
              <OperationScene stage={operationStage} />
            ) : model?.modelPath ? (
              <NormalizedGLBModel
                path={model.modelPath}
                targetSize={2.4}
                rotation={model.modelRotation || [0, 0, 0]}
              />
            ) : (
              <PlaceholderByType type={model?.type} />
            )}
          </Suspense>
        </Center>
        <ContactShadows position={[0, -1.25, 0]} opacity={0.25} scale={8} blur={2.4} />
        <Environment preset="city" />
        <OrbitControls enablePan enableZoom enableRotate makeDefault />
      </Canvas>
    </div>
  );
}
