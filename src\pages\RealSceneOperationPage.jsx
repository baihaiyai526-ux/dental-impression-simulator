import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { AlertCircle, Check, CheckCircle2, Circle, RotateCcw, Sparkles, XCircle } from "lucide-react";
import NormalizedGLBModel from "../components/NormalizedGLBModel.jsx";
import {
  CameraMotion,
  OperationEffects,
  TrayGelOverlay
} from "../components/operation3d/OperationEffects.jsx";
import {
  STEP_ANIMATION_KEYS,
  emitOperationAudioCue,
  getAnimationPhase,
  getAnimationPreset
} from "../config/operationAnimationConfig.js";
import { clearRealSceneSession, loadRealSceneSession, saveRealSceneSession } from "../utils/trainingStorage.js";
import { assetPath } from "../utils/assetPath.js";

const MODEL_PATHS = {
  upperArch: assetPath("models/upper_arch.glb"),
  lowerArch: assetPath("models/lower_arch.glb"),
  upperTray: assetPath("models/upper_tray.glb"),
  lowerTray: assetPath("models/lower_tray.glb"),
  mixingBowl: assetPath("models/mixing_bowl.glb"),
  spatula: assetPath("models/spatula.glb"),
  alginate: assetPath("models/alginate.glb"),
  upperQualifiedImpression: assetPath("models/good_impression.glb"),
  // 将下颌合格印模 GLB 文件放到此路径
  lowerQualifiedImpression: assetPath("models/lower-qualified-impression.glb")
};

const OBJECT_NAMES = {
  upperGoodImpression: "上颌合格印模",
  lowerGoodImpression: "下颌合格印模"
};

const rawStepScores = [5, 8, 8, 5, 5, 10, 6, 8, 7, 6, 6, 8, 7, 6, 5, 10];
const rawTotal = rawStepScores.reduce((sum, value) => sum + value, 0);
const scaledStepScores = rawStepScores.map((value) => (value / rawTotal) * 100);

const genericWrong = "当前物体不属于本步骤操作对象，请根据任务提示选择正确器械或材料。";
const qualityWrong = "该印模存在气泡、边缘缺损或变形，不应判定为合格。";

const tutorTips = {
  case: "请先明确患者情况、取模目的和本次训练任务。",
  tray: "托盘应覆盖牙列及前庭沟区域，同时保留适当材料空间。",
  ratio: "水粉比例会影响藻酸盐材料的流动性、凝固时间和印模精度。",
  mix: "调拌应快速、均匀，避免粉液混合不均或材料提前凝固。",
  load: "装盘应均匀，避免前牙区、后牙区或舌侧材料不足。",
  upperSeat: "上颌托盘应沿正确方向平稳就位，避免偏斜和过度加压。",
  upperBorder: "上颌应注意唇颊侧前庭沟形态记录。",
  lowerSeat: "下颌托盘就位时应注意舌侧空间和材料分布。",
  lowerBorder: "下颌印模应注意舌侧边缘，可引导患者轻抬舌或活动舌体。",
  remove: "印模应沿正确方向一次性稳定取出，避免晃动造成变形。",
  disinfect: "印模取出后应及时冲洗和消毒，符合感染控制要求。",
  quality: "请重点观察牙列细节、边缘完整性、气泡、撕裂和整体变形。"
};

const steps = [
  {
    title: "病例确认",
    expectedTargetIds: ["caseCard"],
    targetLabel: "caseCard",
    task: "点击病例卡片，确认本次任务为正畸治疗前上下颌牙列藻酸盐印模制取。",
    correct: "病例确认完成，进入托盘选择环节。",
    wrong: genericWrong,
    tip: tutorTips.case,
    animation: { caseCard: [-2.6, 0.18, -1.25] }
  },
  {
    title: "选择上颌托盘",
    expectedTargetIds: ["upperTray"],
    targetLabel: "upperTray",
    task: "点击合适的上颌托盘。",
    correct: "上颌托盘选择正确，覆盖范围符合要求。",
    wrong: "托盘选择错误可能导致覆盖不足或压迫软组织。",
    tip: tutorTips.tray,
    animation: { upperTray: [-0.65, 0.55, 0.15] }
  },
  {
    title: "选择下颌托盘",
    expectedTargetIds: ["lowerTray"],
    targetLabel: "lowerTray",
    task: "点击合适的下颌托盘。",
    correct: "下颌托盘选择正确，能够覆盖牙列并保留材料空间。",
    wrong: "下颌托盘不合适会影响舌侧边缘记录。",
    tip: tutorTips.tray,
    animation: { lowerTray: [0.75, 0.55, 0.15] }
  },
  {
    title: "加入水",
    expectedTargetIds: ["waterCup"],
    targetLabel: "waterCup",
    task: "点击水杯，将适量水加入调拌碗。",
    correct: "已加入适量水。",
    wrong: "水量不当会影响材料流动性和凝固时间。",
    tip: tutorTips.ratio,
    animation: { waterCup: [-2.1, 0.62, 0.45] }
  },
  {
    title: "加入藻酸盐粉",
    expectedTargetIds: ["powderSpoon"],
    targetLabel: "powderSpoon",
    task: "点击粉勺，将藻酸盐粉加入调拌碗。",
    correct: "已加入适量藻酸盐粉。",
    wrong: "粉量不当会影响材料精度和强度。",
    tip: tutorTips.ratio,
    animation: { powderSpoon: [-2.1, 0.62, 0.25] }
  },
  {
    title: "调拌材料",
    expectedTargetIds: ["spatula"],
    targetLabel: "spatula",
    task: "点击调拌刀，在调拌碗中完成材料调拌。",
    correct: "调拌均匀，材料适合装盘。",
    wrong: "调拌不足或时间过长都会影响印模质量。",
    tip: tutorTips.mix,
    animation: { spatula: [-2.05, 0.68, 0.35], alginate: [-2.05, 0.48, 0.35] },
    spin: "spatula"
  },
  {
    title: "上颌托盘装料",
    expectedTargetIds: ["alginate"],
    targetLabel: "alginate",
    task: "点击藻酸盐材料，将材料装入上颌托盘。",
    correct: "上颌托盘装料完成，材料分布均匀。",
    wrong: "装盘不均可能导致牙列细节缺失。",
    tip: tutorTips.load,
    animation: { alginate: [-0.65, 0.7, 0.08], upperTray: [-0.65, 0.52, 0.08] }
  },
  {
    title: "上颌托盘就位",
    expectedTargetIds: ["upperTray"],
    targetLabel: "upperTray",
    task: "点击上颌托盘，使其平稳就位到上颌牙列。",
    correct: "上颌托盘就位方向正确，材料分布均匀。",
    wrong: "托盘偏斜可能引起气泡或边缘变形。",
    tip: tutorTips.upperSeat,
    animation: { upperTray: [-0.25, 0.48, -0.35], alginate: [-0.25, 0.58, -0.35] }
  },
  {
    title: "上颌边缘整塑",
    expectedTargetIds: ["upperArch"],
    targetLabel: "upperArch",
    task: "点击上颌牙列边缘区域，完成唇颊侧边缘整塑。",
    correct: "上颌边缘整塑完成，前庭沟记录更完整。",
    wrong: "未整塑会导致边缘记录不足。",
    tip: tutorTips.upperBorder,
    animation: { upperArch: [-0.25, 0.18, -0.42] }
  },
  {
    title: "上颌印模取出",
    expectedTargetIds: ["upperTray"],
    targetLabel: "upperTray",
    task: "点击上颌托盘，模拟稳定一次性取出印模。",
    correct: "上颌印模取出方式正确。",
    wrong: "晃动取出可能导致印模撕裂或变形。",
    tip: tutorTips.remove,
    animation: { upperTray: [1.85, 0.55, -0.35], upperGoodImpression: [1.85, 0.5, -0.35], alginate: [1.85, 0.52, -0.35] }
  },
  {
    title: "下颌托盘装料",
    expectedTargetIds: ["alginate"],
    targetLabel: "alginate",
    task: "点击藻酸盐材料，将材料装入下颌托盘。",
    correct: "下颌托盘装料完成。",
    wrong: "装盘不均会影响舌侧或后牙区记录。",
    tip: tutorTips.load,
    animation: { alginate: [0.75, 0.7, 0.08], lowerTray: [0.75, 0.52, 0.08] }
  },
  {
    title: "下颌托盘就位",
    expectedTargetIds: ["lowerTray"],
    targetLabel: "lowerTray",
    task: "点击下颌托盘，使其平稳就位到下颌牙列。",
    correct: "下颌托盘就位正确，注意舌侧边缘空间。",
    wrong: "下颌托盘偏斜会造成局部材料不足或气泡。",
    tip: tutorTips.lowerSeat,
    animation: { lowerTray: [0.25, 0.43, -0.35], alginate: [0.25, 0.55, -0.35] }
  },
  {
    title: "下颌边缘整塑",
    expectedTargetIds: ["lowerArch"],
    targetLabel: "lowerArch",
    task: "点击下颌舌侧边缘区域，模拟引导舌体活动并完成边缘整塑。",
    correct: "下颌舌侧边缘记录较完整。",
    wrong: "未引导舌体活动可能导致舌侧边缘缺损。",
    tip: tutorTips.lowerBorder,
    animation: { lowerArch: [0.25, 0.14, -0.42] }
  },
  {
    title: "下颌印模取出",
    expectedTargetIds: ["lowerTray"],
    targetLabel: "lowerTray",
    task: "点击下颌托盘，模拟稳定一次性取出印模。",
    correct: "下颌印模取出方式正确。",
    wrong: "晃动取出可能导致印模变形。",
    tip: tutorTips.remove,
    animation: { lowerTray: [2.35, 0.52, 0.1], lowerGoodImpression: [2.35, 0.52, 0.1], alginate: [2.35, 0.52, 0.1] }
  },
  {
    title: "冲洗消毒",
    expectedTargetIds: ["upperGoodImpression", "lowerGoodImpression"],
    targetLabel: "upperGoodImpression / lowerGoodImpression",
    task: "点击印模，将印模移动到冲洗消毒区域。",
    correct: "印模已完成冲洗消毒，符合感染控制要求。",
    wrong: "印模取出后不可直接结束，应进行冲洗消毒。",
    tip: tutorTips.disinfect,
    animation: { upperGoodImpression: [2.55, 0.45, -1.35], lowerGoodImpression: [2.55, 0.45, -0.95] }
  },
  {
    title: "印模质量评价",
    expectedTargetIds: ["upperGoodImpression", "lowerGoodImpression"],
    targetLabel: "upperGoodImpression / lowerGoodImpression",
    task: "展示四个印模结果，让学生点击合格印模。",
    correct: "判断正确，合格印模边缘完整、牙列细节清晰、无关键区域气泡。",
    wrong: qualityWrong,
    tip: tutorTips.quality,
    qualityMode: true,
    animation: { upperGoodImpression: [0.5, 0.48, -1.2], lowerGoodImpression: [1.25, 0.48, -1.2] }
  }
].map((step, index) => ({
  ...step,
  id: index + 1,
  score: scaledStepScores[index]
}));

const idlePositions = {
  caseCard: [-2.75, 0.18, -1.25],
  upperArch: [-0.35, 0.18, -0.42],
  lowerArch: [0.55, 0.14, -0.42],
  upperTray: [-0.95, 0.28, 0.78],
  lowerTray: [0.95, 0.28, 0.78],
  mixingBowl: [-2.05, 0.24, 0.35],
  spatula: [-2.65, 0.38, 0.85],
  alginate: [-1.55, 0.28, 0.92],
  waterCup: [-2.78, 0.32, 0.02],
  powderSpoon: [-2.78, 0.3, 0.48],
  upperGoodImpression: [2.45, 0.26, -0.2],
  lowerGoodImpression: [2.45, 0.26, 0.52]
};

function getGrade(score) {
  if (score >= 90) return "优秀";
  if (score >= 80) return "良好";
  if (score >= 70) return "合格";
  return "需继续训练";
}

function scoreFromCompleted(completedMap) {
  return Math.round(steps.reduce((sum, step, index) => sum + (completedMap[index] ? step.score : 0), 0));
}

function positionsBeforeStep(stepIndex, completedMap) {
  const positions = { ...idlePositions };
  for (let index = 0; index < stepIndex; index += 1) {
    if (completedMap[index]) Object.assign(positions, steps[index].animation || {});
  }
  return positions;
}

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function sampleMotionPosition(start, end, progress, preset, objectId) {
  const eased = easeInOutCubic(progress);
  const position = new THREE.Vector3().lerpVectors(start, end, eased);
  const arc = Math.sin(Math.PI * eased) * (preset.arcHeight || 0);

  if (preset.path === "mixingOrbit" && objectId === "spatula") {
    if (progress < 0.18) {
      const approach = easeInOutCubic(progress / 0.18);
      position.lerpVectors(start, new THREE.Vector3(end.x, end.y + 0.06, end.z), approach);
      position.y += Math.sin(Math.PI * approach) * 0.3;
      return position;
    }
    if (progress < 0.82) {
      const orbit = (progress - 0.18) / 0.64;
      const angle = orbit * Math.PI * 2 * (preset.orbitTurns || 5);
      position.set(
        end.x + Math.cos(angle) * (preset.orbitRadius || 0.18),
        end.y - 0.08 + Math.sin(angle * 0.55) * 0.055,
        end.z + Math.sin(angle) * (preset.orbitRadius || 0.18)
      );
      return position;
    }
    const lift = easeInOutCubic((progress - 0.82) / 0.18);
    position.set(end.x, end.y + (1 - lift) * 0.18, end.z);
    position.y += Math.sin(Math.PI * lift) * 0.06;
    return position;
  }

  if (preset.path === "releaseArc") {
    if (progress < 0.22) {
      const loosen = progress / 0.22;
      position.copy(start);
      position.x += Math.sin(loosen * Math.PI * 4) * 0.018 * loosen;
      position.z += Math.cos(loosen * Math.PI * 3) * 0.012 * loosen;
      position.y += Math.sin(loosen * Math.PI) * 0.035;
      return position;
    }
    const release = easeInOutCubic((progress - 0.22) / 0.78);
    position.lerpVectors(start, end, release);
    position.y += Math.sin(Math.PI * release) * (preset.arcHeight || 0.5);
    return position;
  }

  if (preset.path === "seatPress") {
    position.y += arc;
    if (progress > 0.72) {
      const press = (progress - 0.72) / 0.28;
      position.y -= Math.sin(Math.PI * press) * 0.055;
      position.x += Math.sin(press * Math.PI * 5) * 0.004 * (1 - press);
    }
    return position;
  }

  if (preset.path === "softPulse") {
    position.y += Math.sin(progress * Math.PI * 3) * 0.025 * (1 - progress);
    position.x += Math.sin(progress * Math.PI * 4) * 0.018 * (1 - progress);
    return position;
  }

  position.y += arc;
  if (preset.hover && progress > 0.74) {
    const hover = (progress - 0.74) / 0.26;
    position.y += Math.sin(hover * Math.PI * 3) * 0.025 * (1 - hover);
  }
  return position;
}

function InteractiveObject({
  id,
  name,
  position,
  highlighted,
  success,
  danger,
  disabled,
  inspection,
  visible = true,
  animationRun,
  onClick,
  children
}) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const target = useMemo(() => new THREE.Vector3(...position), [position]);
  const motionRef = useRef({ token: null, elapsed: 0, start: target.clone(), rotationY: 0 });

  useLayoutEffect(() => {
    if (ref.current) ref.current.position.copy(target);
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const objectTarget = animationRun?.targets?.[id];

    if (objectTarget) {
      if (motionRef.current.token !== animationRun.token) {
        motionRef.current.token = animationRun.token;
        motionRef.current.elapsed = 0;
        motionRef.current.start.copy(ref.current.position);
        motionRef.current.rotationY = ref.current.rotation.y;
        const startOverride = animationRun.preset.startOverrides?.[id];
        if (startOverride) {
          motionRef.current.start.set(...startOverride);
          ref.current.position.set(...startOverride);
        }
      }

      motionRef.current.elapsed += delta * 1000;
      const localProgress = THREE.MathUtils.clamp(
        motionRef.current.elapsed / animationRun.duration,
        0,
        1
      );
      const end = new THREE.Vector3(...objectTarget);
      ref.current.position.copy(
        sampleMotionPosition(motionRef.current.start, end, localProgress, animationRun.preset, id)
      );

      const rotationEnvelope = Math.sin(Math.PI * localProgress);
      if (animationRun.preset.path === "mixingOrbit" && id === "spatula") {
        ref.current.rotation.y = motionRef.current.rotationY + localProgress * Math.PI * 7;
        ref.current.rotation.z = Math.sin(localProgress * Math.PI * 12) * 0.16;
      } else if (animationRun.preset.path === "releaseArc") {
        ref.current.rotation.z = Math.sin(localProgress * Math.PI * 4) * 0.035 * (1 - localProgress);
        ref.current.rotation.y = motionRef.current.rotationY * (1 - localProgress) + rotationEnvelope * 0.12;
      } else {
        ref.current.rotation.z = rotationEnvelope * 0.12;
        ref.current.rotation.y = motionRef.current.rotationY * (1 - localProgress) + rotationEnvelope * 0.08;
      }

      if (animationRun.preset.path === "seatPress" && localProgress > 0.72) {
        ref.current.scale.y = 1 - Math.sin(((localProgress - 0.72) / 0.28) * Math.PI) * 0.035;
      } else {
        ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, 1, 0.15);
      }
    } else {
      motionRef.current.token = null;
      ref.current.position.lerp(target, Math.min(1, delta * 5.4));
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, Math.min(1, delta * 5));
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, Math.min(1, delta * 5));
      if (inspection) {
        ref.current.rotation.y += delta * 0.28;
      } else {
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, Math.min(1, delta * 3.5));
      }
      if (highlighted && !disabled) ref.current.position.y += Math.sin(Date.now() / 250) * 0.0015;
    }
  });

  return (
    <group
      ref={ref}
      visible={visible}
      onClick={(event) => {
        event.stopPropagation();
        if (disabled) return;
        onClick(id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = disabled ? "wait" : "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {children}
      {(highlighted || success || danger) && (
        <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 48]} />
          <meshBasicMaterial color={success ? "#22c55e" : danger ? "#ef4444" : "#2563eb"} transparent opacity={0.55} />
        </mesh>
      )}
      {(hovered || highlighted) && !disabled && (
        <Html position={[0, 0.68, 0]} center>
          <div className="whitespace-nowrap rounded-md bg-slate-900/85 px-2 py-1 text-xs font-semibold text-white shadow">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

function ArchMesh({ lower = false }) {
  return (
    <group rotation={[0, lower ? Math.PI : 0, 0]}>
      <mesh position={[0, -0.03, 0]} scale={[1.42, 0.12, 0.78]}>
        <torusGeometry args={[0.72, 0.08, 16, 88, Math.PI]} />
        <meshStandardMaterial color="#f7b4b4" roughness={0.55} />
      </mesh>
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 11) * Math.PI - Math.PI;
        return (
          <mesh key={index} position={[Math.cos(angle) * 1.02, 0.18, Math.sin(angle) * 0.52]} scale={[0.15, 0.28, 0.18]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#f8fbff" roughness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

function TrayMesh({ lower = false }) {
  return (
    <group rotation={[0, lower ? Math.PI : 0, 0]}>
      <mesh scale={[1.45, 0.16, 0.75]}>
        <torusGeometry args={[0.72, 0.1, 16, 88, Math.PI]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.08} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.28]} scale={[0.95, 0.06, 0.22]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
    </group>
  );
}

function BowlMesh() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.08, 20, 72]} />
        <meshStandardMaterial color="#93c5fd" />
      </mesh>
      <mesh position={[0, -0.12, 0]} scale={[0.6, 0.24, 0.6]}>
        <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#dbeafe" transparent opacity={0.78} />
      </mesh>
    </group>
  );
}

function SpatulaMesh() {
  return (
    <group rotation={[0.25, 0.15, -0.55]}>
      <mesh scale={[0.08, 0.04, 0.78]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#64748b" metalness={0.2} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.48]} scale={[0.28, 0.04, 0.28]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

function AlginateMesh() {
  return (
    <mesh scale={[0.38, 0.17, 0.32]}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshStandardMaterial color="#86efac" transparent opacity={0.64} roughness={0.18} />
    </mesh>
  );
}

function WaterCupMesh() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.18, 0.16, 0.42, 32]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.42} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.15, 0.14, 0.25, 32]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.48} />
      </mesh>
    </group>
  );
}

function PowderSpoonMesh() {
  return (
    <group rotation={[0.15, 0.25, -0.45]}>
      <mesh position={[0.26, 0, 0]} scale={[0.52, 0.04, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-0.08, 0, 0]} scale={[0.16, 0.05, 0.16]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  );
}

function ImpressionMesh({ lower = false }) {
  return (
    <group rotation={[0, lower ? Math.PI : 0, 0]}>
      <mesh scale={[1.08, 0.17, 0.62]}>
        <torusGeometry args={[0.56, 0.12, 18, 72, Math.PI]} />
        <meshStandardMaterial color="#bfdbfe" roughness={0.42} />
      </mesh>
    </group>
  );
}

function OptionalGLBModel({ path, fallback, targetSize, rotation, missingHint }) {
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    let active = true;
    fetch(path, { method: "HEAD" })
      .then((response) => {
        const contentType = response.headers.get("content-type") || "";
        active && setAvailable(response.ok && !contentType.includes("text/html"));
      })
      .catch(() => active && setAvailable(false));

    return () => {
      active = false;
    };
  }, [path]);

  if (!available) {
    return (
      <group>
        {fallback}
        {available === false && missingHint && (
          <Html position={[0, 0.42, 0]} center>
            <div className="whitespace-nowrap rounded-md border border-amber-200 bg-amber-50/95 px-2 py-1 text-xs font-semibold text-amber-800 shadow">
              {missingHint}
            </div>
          </Html>
        )}
      </group>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <NormalizedGLBModel path={path} targetSize={targetSize} rotation={rotation} />
    </Suspense>
  );
}

function CaseCardMesh() {
  return (
    <group>
      <mesh scale={[0.7, 0.04, 0.46]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Text position={[0, 0.04, 0.02]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.08} color="#1d4ed8" anchorX="center">
        病例卡片
      </Text>
    </group>
  );
}

function ObjectMesh({ id, visualState }) {
  if (id === "caseCard") return <CaseCardMesh />;
  if (id === "upperArch") {
    return (
      <Suspense fallback={<ArchMesh />}>
        <NormalizedGLBModel
          path={MODEL_PATHS.upperArch}
          targetSize={1.45}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </Suspense>
    );
  }
  if (id === "lowerArch") {
    return (
      <Suspense fallback={<ArchMesh lower />}>
        <NormalizedGLBModel
          path={MODEL_PATHS.lowerArch}
          targetSize={1.45}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </Suspense>
    );
  }
  if (id === "upperTray") {
    return (
      <group>
        <Suspense fallback={<TrayMesh />}>
          <NormalizedGLBModel
            path={MODEL_PATHS.upperTray}
            targetSize={1.9}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </Suspense>
        <TrayGelOverlay
          active={visualState.upperLoaded}
          seating={visualState.animationKey === "seatUpperTray"}
          setting={visualState.upperSetting}
        />
      </group>
    );
  }
  if (id === "lowerTray") {
    return (
      <group>
        <Suspense fallback={<TrayMesh lower />}>
          <NormalizedGLBModel
            path={MODEL_PATHS.lowerTray}
            targetSize={1.9}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </Suspense>
        <TrayGelOverlay
          active={visualState.lowerLoaded}
          seating={visualState.animationKey === "seatLowerTray"}
          setting={visualState.lowerSetting}
        />
      </group>
    );
  }
  if (id === "mixingBowl") {
    return (
      <Suspense fallback={<BowlMesh />}>
        <NormalizedGLBModel
          path={MODEL_PATHS.mixingBowl}
          targetSize={1.45}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </Suspense>
    );
  }
  if (id === "spatula") {
    return (
      <Suspense fallback={<SpatulaMesh />}>
        <NormalizedGLBModel
          path={MODEL_PATHS.spatula}
          targetSize={1.35}
          rotation={[-Math.PI / 2, 0, -0.42]}
        />
      </Suspense>
    );
  }
  if (id === "alginate") {
    return (
      <Suspense fallback={<AlginateMesh />}>
        <NormalizedGLBModel
          path={MODEL_PATHS.alginate}
          targetSize={1.05}
          rotation={[0, -0.38, 0]}
        />
      </Suspense>
    );
  }
  if (id === "waterCup") return <WaterCupMesh />;
  if (id === "powderSpoon") return <PowderSpoonMesh />;
  if (id === "upperGoodImpression") {
    return (
      <OptionalGLBModel
        path={MODEL_PATHS.upperQualifiedImpression}
        fallback={<ImpressionMesh />}
        targetSize={1.3}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    );
  }
  if (id === "lowerGoodImpression") {
    return (
      <OptionalGLBModel
        path={MODEL_PATHS.lowerQualifiedImpression}
        fallback={<ImpressionMesh lower />}
        targetSize={1.3}
        rotation={[-Math.PI / 2, 0, 0]}
        missingHint="请放置下颌合格印模 GLB 文件"
      />
    );
  }
  return null;
}

function OperationScene({
  currentStep,
  objectPositions,
  completedMap,
  errorFlash,
  successFlash,
  animationRun,
  animationProgress,
  isAnimating,
  mobile,
  resetToken,
  onObjectClick
}) {
  const visibleIds = [
    "caseCard",
    "upperArch",
    "lowerArch",
    "upperTray",
    "lowerTray",
    "mixingBowl",
    "spatula",
    "alginate",
    "waterCup",
    "powderSpoon",
    "upperGoodImpression",
    "lowerGoodImpression"
  ];

  const current = steps[currentStep];
  const qualityMode = current.qualityMode;
  const stepKey = STEP_ANIMATION_KEYS[currentStep];
  const animationKey = animationRun?.key || null;
  const visualState = {
    animationKey,
    upperLoaded: Boolean(completedMap[6] || (animationKey === "loadUpperTray" && animationProgress > 0.48)),
    lowerLoaded: Boolean(completedMap[10] || (animationKey === "loadLowerTray" && animationProgress > 0.48)),
    upperSetting: Boolean(completedMap[7] || animationKey === "removeUpperImpression"),
    lowerSetting: Boolean(completedMap[11] || animationKey === "removeLowerImpression")
  };
  const objectVisible = (id) => {
    if (id === "upperGoodImpression") {
      return Boolean(completedMap[9] || currentStep >= 14 || (animationKey === "removeUpperImpression" && animationProgress > 0.2));
    }
    if (id === "lowerGoodImpression") {
      return Boolean(completedMap[13] || currentStep >= 14 || (animationKey === "removeLowerImpression" && animationProgress > 0.2));
    }
    return true;
  };
  const transitionOpacity = animationKey === "evaluateQuality"
    ? Math.max(0, 0.28 - Math.abs(animationProgress - 0.16) * 1.75)
    : 0;

  return (
    <div className="relative h-[620px] overflow-hidden rounded-lg border border-blue-100 bg-sky-50 shadow-medical">
      <Canvas camera={{ position: [0, 4.25, 5.8], fov: 45 }}>
        <ambientLight intensity={0.82} />
        <directionalLight position={[3, 6, 4]} intensity={1.15} />
        <mesh position={[0, -0.04, 0]} receiveShadow>
          <boxGeometry args={[6.4, 0.08, 4.2]} />
          <meshStandardMaterial color="#dbeafe" transparent opacity={0.88} roughness={0.42} />
        </mesh>
        <mesh position={[2.45, 0.02, -1.15]}>
          <boxGeometry args={[1.3, 0.04, 0.7]} />
          <meshStandardMaterial color="#c7f9e5" transparent opacity={0.7} />
        </mesh>
        <Text position={[2.45, 0.08, -1.15]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.1} color="#047857">
          冲洗消毒区
        </Text>
        {qualityMode && (
          <Text position={[2.05, 0.08, 1.68]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.1} color="#1d4ed8">
            质量评价区
          </Text>
        )}
        {visibleIds.map((id) => (
          <InteractiveObject
            key={id}
            id={id}
            name={OBJECT_NAMES[id] || id}
            position={objectPositions[id] || idlePositions[id]}
            highlighted={current.expectedTargetIds.includes(id) && !isAnimating}
            success={successFlash === id}
            danger={errorFlash === id}
            disabled={isAnimating}
            inspection={qualityMode && (id === "upperGoodImpression" || id === "lowerGoodImpression")}
            visible={objectVisible(id)}
            animationRun={animationRun}
            onClick={onObjectClick}
          >
            <ObjectMesh id={id} visualState={visualState} />
          </InteractiveObject>
        ))}
        <OperationEffects
          animationKey={animationKey}
          stepKey={stepKey}
          progress={animationProgress}
          completedMap={completedMap}
          mobile={mobile}
        />
        <CameraMotion animationKey={animationKey} progress={animationProgress} resetToken={resetToken} />
        <Environment preset="city" />
        <OrbitControls enablePan enableZoom enableRotate enabled={!isAnimating} makeDefault />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: transitionOpacity }}
        aria-hidden="true"
      />
    </div>
  );
}

function StepTimeline({ currentStep, completedMap, errorSteps, isAnimating, onSelect }) {
  return (
    <aside className="rounded-lg border border-blue-100 bg-white/90 p-4 shadow-medical">
      <h2 className="mb-4 text-lg font-bold text-slate-950">实验步骤时间轴</h2>
      <div className="space-y-2">
        {steps.map((step, index) => {
          const done = completedMap[index];
          const hasError = errorSteps.includes(index);
          const active = currentStep === index;
          return (
            <button
              key={step.title}
              disabled={isAnimating}
              onClick={() => onSelect(index)}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                active
                  ? "border-blue-300 bg-blue-50 text-blue-800"
                  : done
                    ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                    : hasError
                      ? "border-red-100 bg-red-50 text-red-800"
                      : "border-slate-100 bg-slate-50 text-slate-500"
              } disabled:cursor-wait`}
            >
              {done ? <Check className="h-4 w-4 shrink-0" /> : hasError ? <XCircle className="h-4 w-4 shrink-0" /> : <Circle className="h-4 w-4 shrink-0" />}
              <span>{index + 1}. {step.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function OperationControlPanel({
  currentStep,
  completed,
  score,
  errors,
  feedback,
  isAnimating,
  animationProgress,
  animationPhase,
  onResetStep,
  onRestart,
  onNext
}) {
  const step = steps[currentStep];
  return (
    <aside className="space-y-4">
      <div className="rounded-lg border border-blue-100 bg-white/90 p-5 shadow-medical">
        <p className="text-sm font-semibold text-blue-700">第 {currentStep + 1} / {steps.length} 步</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{step.title}</h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <InfoLine label="当前任务" value={step.task} />
          <InfoLine label="应点击物体" value={step.targetLabel} />
        </div>
      </div>
      <div className="rounded-lg border border-blue-100 bg-blue-50/80 p-5 text-blue-900 shadow-medical">
        <div className="mb-2 flex items-center gap-2 font-bold">
          <Sparkles className="h-5 w-5" />
          AI 虚拟导师提示
        </div>
        <p className="text-sm leading-6">{step.tip}</p>
      </div>
      <div className="rounded-lg border border-blue-100 bg-white/90 p-5 shadow-medical">
        <h3 className="mb-3 font-bold text-slate-950">训练状态</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-xs text-slate-500">当前得分</p>
            <p className="text-2xl font-bold text-blue-700">{score}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-xs text-slate-500">错误次数</p>
            <p className="text-2xl font-bold text-red-700">{errors.length}</p>
          </div>
        </div>
        {isAnimating && (
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-blue-800">
              <span>{animationPhase}</span>
              <span>{Math.round(animationProgress * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-[width] duration-100"
                style={{ width: `${Math.round(animationProgress * 100)}%` }}
              />
            </div>
          </div>
        )}
        {feedback && (
          <div className={`mt-4 flex gap-2 rounded-lg p-3 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800"
              : feedback.type === "progress"
                ? "bg-blue-50 text-blue-800"
                : "bg-red-50 text-red-800"
          }`}>
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : feedback.type === "progress" ? (
              <Sparkles className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
        <div className="mt-4 grid gap-3">
          <button onClick={onResetStep} className="rounded-lg border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
            重置当前步骤
          </button>
          <button onClick={onRestart} className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            重新开始训练
          </button>
          <button
            disabled={!completed || isAnimating}
            onClick={onNext}
            className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            下一步
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-red-100 bg-white/90 p-5 shadow-medical">
        <h3 className="mb-3 font-bold text-slate-950">扣分点</h3>
        {errors.length === 0 ? (
          <p className="text-sm text-emerald-700">暂无错误记录。</p>
        ) : (
          <div className="max-h-48 space-y-2 overflow-auto">
            {errors.map((error, index) => (
              <p key={`${error.step}-${index}`} className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                {error.step}：{error.feedback}
              </p>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function InfoLine({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-blue-700">{label}</p>
      <p>{value}</p>
    </div>
  );
}

export default function RealSceneOperationPage({ setRealSceneRecord }) {
  const [savedSession] = useState(loadRealSceneSession);
  const [currentStep, setCurrentStep] = useState(() => Math.min(Math.max(savedSession?.currentStep || 0, 0), steps.length - 1));
  const [completedMap, setCompletedMap] = useState(() => savedSession?.completedMap || {});
  const [clickRecords, setClickRecords] = useState(() => savedSession?.clickRecords || []);
  const [errors, setErrors] = useState(() => savedSession?.errors || []);
  const [feedback, setFeedback] = useState(null);
  const [objectPositions, setObjectPositions] = useState(() => savedSession?.objectPositions || idlePositions);
  const [successFlash, setSuccessFlash] = useState(null);
  const [errorFlash, setErrorFlash] = useState(null);
  const [animationRun, setAnimationRun] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [animationPhase, setAnimationPhase] = useState("准备");
  const [isAnimating, setIsAnimating] = useState(false);
  const [sceneResetToken, setSceneResetToken] = useState(0);
  const animationFrameRef = useRef(null);
  const animationTokenRef = useRef(0);
  const animationLockedRef = useRef(false);
  const transientTimersRef = useRef([]);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const mobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);

  const score = useMemo(() => scoreFromCompleted(completedMap), [completedMap]);
  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const progress = Math.round((completedCount / steps.length) * 100);
  const current = steps[currentStep];
  const currentCompleted = Boolean(completedMap[currentStep]);
  const errorSteps = [...new Set(errors.map((item) => item.stepIndex))];

  const clearTransientTimers = () => {
    transientTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    transientTimersRef.current = [];
  };

  const scheduleTransient = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    transientTimersRef.current.push(timer);
  };

  const cancelAnimation = () => {
    animationLockedRef.current = false;
    animationTokenRef.current += 1;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
    setAnimationRun(null);
    setAnimationProgress(0);
    setAnimationPhase("准备");
    setIsAnimating(false);
    clearTransientTimers();
  };

  const updateReport = (nextCompletedMap, nextClickRecords, nextErrors, nextScore) => {
    const grade = getGrade(nextScore);
    setRealSceneRecord({
      mode: "可点击移动式实景虚拟操作训练",
      usedModels: Object.keys(MODEL_PATHS).map((key) => `${key}: ${MODEL_PATHS[key]}`),
      completedSteps: steps.map((step, index) => ({
        title: step.title,
        completed: Boolean(nextCompletedMap[index]),
        score: Math.round(nextCompletedMap[index] ? step.score : 0)
      })),
      clickRecords: nextClickRecords,
      totalScore: nextScore,
      score: nextScore,
      grade,
      errorCount: nextErrors.length,
      errors: nextErrors,
      deductions: nextErrors.map((item) => `${item.step}：${item.feedback}`),
      finalComment:
        nextScore >= 80
          ? "流程完成度较好，能够按任务提示完成关键器械与材料操作。"
          : "需要继续强化托盘选择、材料调拌、就位取出和质量评价的步骤意识。",
      suggestions: nextErrors.length
        ? ["按步骤识别当前目标物体，避免提前或跳步操作。", "重点练习托盘装料、就位方向和取出稳定性。", "质量评价时重点观察气泡、边缘缺损和整体变形。"]
        : ["操作路径清晰，可进入真实扫描模型替换后的进阶训练。"],
      passed: nextScore >= 80
    });
  };

  useEffect(() => {
    updateReport(completedMap, clickRecords, errors, score);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveRealSceneSession({
        currentStep,
        completedMap,
        clickRecords,
        errors,
        objectPositions
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [currentStep, completedMap, clickRecords, errors, objectPositions]);

  useEffect(() => () => {
    animationTokenRef.current += 1;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    transientTimersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const handleObjectClick = (objectId) => {
    if (animationLockedRef.current || isAnimating) return;
    const isCorrect = current.expectedTargetIds.includes(objectId);
    const isQualifiedImpression = objectId === "upperGoodImpression" || objectId === "lowerGoodImpression";
    const message = isCorrect ? current.correct : !isQualifiedImpression && current.qualityMode ? qualityWrong : current.wrong || genericWrong;
    const clickRecord = {
      stepIndex: currentStep,
      step: current.title,
      clickedObjectId: objectId,
      correct: isCorrect,
      feedback: message
    };
    const nextClickRecords = [...clickRecords, clickRecord];

    if (!isCorrect) {
      const nextErrors = [
        ...errors,
        {
          stepIndex: currentStep,
          step: current.title,
          clickedObjectId: objectId,
          feedback: message
        }
      ];
      setErrors(nextErrors);
      setClickRecords(nextClickRecords);
      setFeedback({ type: "error", message });
      setErrorFlash(objectId);
      emitOperationAudioCue("error", { step: current.title, objectId });
      scheduleTransient(() => setErrorFlash(null), 800);
      updateReport(completedMap, nextClickRecords, nextErrors, score);
      return;
    }

    setClickRecords(nextClickRecords);
    animationLockedRef.current = true;
    setFeedback({ type: "progress", message: `正在执行：${current.title}` });
    setIsAnimating(true);
    setAnimationProgress(0);

    const animationKey = STEP_ANIMATION_KEYS[currentStep];
    const preset = getAnimationPreset(animationKey, reducedMotion);
    const token = animationTokenRef.current + 1;
    animationTokenRef.current = token;
    setAnimationPhase(getAnimationPhase(preset, 0));
    setAnimationRun({
      token,
      key: animationKey,
      preset,
      duration: preset.duration,
      targets: current.animation || {}
    });
    emitOperationAudioCue("animation-start", { step: current.title, animationKey, objectId });

    const startedAt = performance.now();
    let lastRenderedPercent = -1;
    const tick = (now) => {
      if (animationTokenRef.current !== token) return;
      const progressValue = THREE.MathUtils.clamp((now - startedAt) / preset.duration, 0, 1);
      const renderedPercent = Math.round(progressValue * 100);
      if (renderedPercent !== lastRenderedPercent) {
        lastRenderedPercent = renderedPercent;
        setAnimationProgress(progressValue);
        setAnimationPhase(getAnimationPhase(preset, progressValue));
      }

      if (progressValue < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      animationFrameRef.current = null;
      setObjectPositions((positions) => ({ ...positions, ...current.animation }));
      setAnimationRun(null);
      animationLockedRef.current = false;
      setIsAnimating(false);
      setAnimationProgress(1);
      setAnimationPhase("结束");

      const nextCompletedMap = { ...completedMap, [currentStep]: true };
      const nextScore = scoreFromCompleted(nextCompletedMap);
      setCompletedMap(nextCompletedMap);
      setFeedback({ type: "success", message });
      setSuccessFlash(objectId);
      emitOperationAudioCue("animation-complete", { step: current.title, animationKey, objectId });
      scheduleTransient(() => setSuccessFlash(null), 900);
      updateReport(nextCompletedMap, nextClickRecords, errors, nextScore);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const resetCurrentStep = () => {
    cancelAnimation();
    setCompletedMap((items) => {
      const next = { ...items };
      delete next[currentStep];
      const nextScore = scoreFromCompleted(next);
      updateReport(next, clickRecords, errors, nextScore);
      return next;
    });
    setFeedback(null);
    setSuccessFlash(null);
    setErrorFlash(null);
    setObjectPositions(positionsBeforeStep(currentStep, completedMap));
    setSceneResetToken((token) => token + 1);
    emitOperationAudioCue("step-reset", { step: current.title });
  };

  const restartTraining = () => {
    cancelAnimation();
    clearRealSceneSession();
    setCurrentStep(0);
    setCompletedMap({});
    setClickRecords([]);
    setErrors([]);
    setFeedback(null);
    setSuccessFlash(null);
    setErrorFlash(null);
    setObjectPositions(idlePositions);
    setSceneResetToken((token) => token + 1);
    updateReport({}, [], [], 0);
    emitOperationAudioCue("training-restart");
  };

  const nextStep = () => {
    if (!currentCompleted || isAnimating) return;
    setFeedback(null);
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-blue-100 bg-white/90 p-5 shadow-medical">
        <p className="text-sm font-semibold text-blue-700">React Three Fiber 交互操作台</p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">可点击移动式实景虚拟操作训练</h1>
            <p className="mt-2 text-slate-600">通过点击器械与材料完成口腔牙列印模制取流程</p>
          </div>
          <div className="min-w-56">
            <div className="mb-2 flex justify-between text-sm text-slate-600">
              <span>训练进度</span>
              <span className="font-semibold text-blue-700">{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[290px_1fr_340px]">
        <StepTimeline
          currentStep={currentStep}
          completedMap={completedMap}
          errorSteps={errorSteps}
          isAnimating={isAnimating}
          onSelect={setCurrentStep}
        />
        <OperationScene
          currentStep={currentStep}
          objectPositions={objectPositions}
          completedMap={completedMap}
          errorFlash={errorFlash}
          successFlash={successFlash}
          animationRun={animationRun}
          animationProgress={animationProgress}
          isAnimating={isAnimating}
          mobile={mobile}
          resetToken={sceneResetToken}
          onObjectClick={handleObjectClick}
        />
        <OperationControlPanel
          currentStep={currentStep}
          completed={currentCompleted}
          score={score}
          errors={errors}
          feedback={feedback}
          isAnimating={isAnimating}
          animationProgress={animationProgress}
          animationPhase={animationPhase}
          onResetStep={resetCurrentStep}
          onRestart={restartTraining}
          onNext={nextStep}
        />
      </div>
    </section>
  );
}
