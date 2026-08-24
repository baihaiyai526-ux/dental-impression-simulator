import { useEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OPERATION_ANIMATION_CONFIG } from "../../config/operationAnimationConfig.js";

const BOWL_CENTER = new THREE.Vector3(-2.05, 0.45, 0.35);
const WET_GEL_COLOR = new THREE.Color(OPERATION_ANIMATION_CONFIG.material.wetColor);
const MIXED_GEL_COLOR = new THREE.Color(OPERATION_ANIMATION_CONFIG.material.mixedColor);

function PlacementGuide({ lower = false, visible }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current || !visible) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 3.2) * 0.06;
    ref.current.scale.setScalar(pulse);
  });

  if (!visible) return null;
  return (
    <group ref={ref} position={[lower ? 0.25 : -0.25, 0.09, -0.38]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[0.48, 0.56, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.34} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -0.012]}>
        <circleGeometry args={[0.45, 48]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GelMixture({ visible, mixing, mixed, progress }) {
  const group = useRef();
  const ripple = useRef();
  const material = useRef();
  const mixedAmount = mixed ? 1 : mixing ? Math.min(1, progress / 0.82) : 0;

  useFrame(({ clock }) => {
    if (!group.current || !visible) return;
    const time = clock.elapsedTime;
    group.current.rotation.y += mixing ? 0.028 : 0.004;
    group.current.scale.y = 1 + Math.sin(time * (mixing ? 7 : 2.2)) * (mixing ? 0.08 : 0.025);
    if (ripple.current) {
      ripple.current.rotation.z = -time * (mixing ? 2.4 : 0.35);
      ripple.current.scale.setScalar(1 + Math.sin(time * 3.4) * 0.06);
    }
    if (material.current) {
      material.current.color.lerp(mixedAmount > 0.55 ? MIXED_GEL_COLOR : WET_GEL_COLOR, 0.08);
      material.current.roughness = THREE.MathUtils.lerp(
        OPERATION_ANIMATION_CONFIG.material.wetRoughness,
        0.34,
        mixedAmount
      );
    }
  });

  if (!visible) return null;
  return (
    <group ref={group} position={BOWL_CENTER.toArray()}>
      <mesh scale={[0.38, 0.07, 0.34]}>
        <sphereGeometry args={[1, 24, 12]} />
        <meshPhysicalMaterial
          ref={material}
          color={OPERATION_ANIMATION_CONFIG.material.mixedColor}
          transparent
          opacity={OPERATION_ANIMATION_CONFIG.material.opacity}
          roughness={OPERATION_ANIMATION_CONFIG.material.wetRoughness}
          transmission={0.08}
          clearcoat={0.55}
        />
      </mesh>
      <mesh ref={ripple} position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.018, 8, 36]} />
        <meshBasicMaterial color="#d1fae5" transparent opacity={mixing ? 0.52 : 0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}

function TransferGel({ animationKey, progress }) {
  const upper = animationKey === "loadUpperTray";
  const lower = animationKey === "loadLowerTray";
  if ((!upper && !lower) || progress < 0.12 || progress > 0.94) return null;

  const target = new THREE.Vector3(upper ? -0.65 : 0.75, 0.67, 0.08);
  const travel = THREE.MathUtils.clamp((progress - 0.12) / 0.72, 0, 1);
  const points = [0, 0.09, 0.18, 0.27].map((lag) => {
    const t = Math.max(0, travel - lag);
    const position = new THREE.Vector3().lerpVectors(BOWL_CENTER, target, t);
    position.y += Math.sin(Math.PI * t) * 0.58;
    return position;
  });

  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point.toArray()} scale={[0.14 - index * 0.018, 0.07, 0.11]}>
          <sphereGeometry args={[1, 16, 10]} />
          <meshPhysicalMaterial
            color={OPERATION_ANIMATION_CONFIG.material.mixedColor}
            transparent
            opacity={0.76 - index * 0.1}
            roughness={0.22}
            clearcoat={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function SpatulaAdhesion({ animationKey, progress }) {
  if (animationKey !== "mixAlginate" || progress < 0.2 || progress > 0.92) return null;
  const orbitProgress = THREE.MathUtils.clamp((progress - 0.18) / 0.64, 0, 1);
  const angle = orbitProgress * Math.PI * 11;
  return (
    <mesh
      position={[
        BOWL_CENTER.x + Math.cos(angle) * 0.18,
        BOWL_CENTER.y + 0.16 + Math.sin(angle * 0.5) * 0.035,
        BOWL_CENTER.z + Math.sin(angle) * 0.18
      ]}
      scale={[0.06, 0.13, 0.06]}
    >
      <sphereGeometry args={[1, 14, 8]} />
      <meshPhysicalMaterial color="#98e2ce" transparent opacity={0.72} roughness={0.2} />
    </mesh>
  );
}

function CleaningParticles({ active, progress, mobile }) {
  const pointsRef = useRef();
  const count = mobile
    ? OPERATION_ANIMATION_CONFIG.particles.mobileCount
    : OPERATION_ANIMATION_CONFIG.particles.desktopCount;
  const initial = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = 2.18 + (index % 6) * 0.12;
      values[index * 3 + 1] = 0.35 + ((index * 7) % 11) * 0.07;
      values[index * 3 + 2] = -1.42 + ((index * 5) % 9) * 0.07;
    }
    return values;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    const positions = pointsRef.current.geometry.attributes.position.array;
    for (let index = 0; index < count; index += 1) {
      positions[index * 3 + 1] -= delta * (0.55 + (index % 4) * 0.09);
      if (positions[index * 3 + 1] < 0.12) positions[index * 3 + 1] = 1.05;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active || progress < 0.25) return null;
  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initial, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={OPERATION_ANIMATION_CONFIG.particles.waterColor}
          size={0.045}
          transparent
          opacity={progress > 0.76 ? 0.35 : 0.78}
          depthWrite={false}
        />
      </points>
      {progress > 0.68 && (
        <mesh position={[2.48, 0.28, -1.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.48, 48]} />
          <meshBasicMaterial color="#93c5fd" transparent opacity={(1 - progress) * 1.8} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function QualityHighlight({ active, progress }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    ref.current.rotation.z = clock.elapsedTime * 0.35;
  });

  if (!active || progress < 0.2) return null;
  return (
    <group ref={ref} position={[0.88, 0.14, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[0.68, 0.73, 64]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.32} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function CameraMotion({ animationKey, progress, resetToken }) {
  const { camera } = useThree();
  const defaultPosition = OPERATION_ANIMATION_CONFIG.camera.defaultPosition;
  const qualityPosition = OPERATION_ANIMATION_CONFIG.camera.qualityPosition;

  useFrame(() => {
    if (animationKey !== "evaluateQuality") return;
    const target = new THREE.Vector3(...qualityPosition);
    camera.position.lerp(target, Math.min(0.08, 0.02 + progress * 0.05));
    camera.lookAt(0.4, 0.15, -0.55);
  });

  useEffect(() => {
    camera.position.set(...defaultPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, defaultPosition, resetToken]);

  return null;
}

export function OperationEffects({ animationKey, stepKey, progress, completedMap, mobile }) {
  const isMixing = animationKey === "mixAlginate";
  const mixtureReady = Boolean(completedMap[5]);
  const showGel = Boolean((completedMap[3] || completedMap[4] || isMixing) && !completedMap[10]);
  const upperGuide = ["upperTraySelect", "seatUpperTray"].includes(stepKey);
  const lowerGuide = ["lowerTraySelect", "seatLowerTray"].includes(stepKey);
  const seatActive = animationKey === "seatUpperTray" || animationKey === "seatLowerTray";

  return (
    <group>
      <PlacementGuide visible={upperGuide} />
      <PlacementGuide lower visible={lowerGuide} />
      <GelMixture visible={showGel} mixing={isMixing} mixed={mixtureReady} progress={progress} />
      <SpatulaAdhesion animationKey={animationKey} progress={progress} />
      <TransferGel animationKey={animationKey} progress={progress} />
      <CleaningParticles active={animationKey === "disinfectImpressions"} progress={progress} mobile={mobile} />
      <QualityHighlight active={animationKey === "evaluateQuality"} progress={progress} />
      {seatActive && progress > 0.72 && (
        <Html position={[0, 0.95, -0.45]} center>
          <div className="whitespace-nowrap rounded-md border border-blue-200 bg-white/95 px-3 py-2 text-xs font-semibold text-blue-800 shadow">
            保持稳定，等待材料凝固
          </div>
        </Html>
      )}
    </group>
  );
}

export function TrayGelOverlay({ active, seating, setting }) {
  const ref = useRef();
  const material = useRef();

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const compression = seating
      ? 0.7 + Math.sin(clock.elapsedTime * 5) * 0.025
      : setting
        ? 0.86
        : 1;
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, compression, 0.12);
    if (material.current) {
      material.current.roughness = THREE.MathUtils.lerp(
        material.current.roughness,
        setting ? OPERATION_ANIMATION_CONFIG.material.setRoughness : OPERATION_ANIMATION_CONFIG.material.wetRoughness,
        0.08
      );
    }
  });

  if (!active) return null;
  return (
    <mesh ref={ref} position={[0, 0.09, -0.08]} scale={[0.72, 0.08, 0.42]}>
      <sphereGeometry args={[1, 24, 12]} />
      <meshPhysicalMaterial
        ref={material}
        color={setting ? OPERATION_ANIMATION_CONFIG.material.setColor : OPERATION_ANIMATION_CONFIG.material.mixedColor}
        transparent
        opacity={0.72}
        roughness={OPERATION_ANIMATION_CONFIG.material.wetRoughness}
        clearcoat={setting ? 0.1 : 0.5}
      />
    </mesh>
  );
}
