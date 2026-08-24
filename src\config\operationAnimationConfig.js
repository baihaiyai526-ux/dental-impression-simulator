export const STEP_ANIMATION_KEYS = [
  "caseConfirm",
  "upperTraySelect",
  "lowerTraySelect",
  "addWater",
  "addPowder",
  "mixAlginate",
  "loadUpperTray",
  "seatUpperTray",
  "shapeUpperBorder",
  "removeUpperImpression",
  "loadLowerTray",
  "seatLowerTray",
  "shapeLowerBorder",
  "removeLowerImpression",
  "disinfectImpressions",
  "evaluateQuality"
];

const STANDARD_PHASES = [
  { until: 0.2, label: "准备" },
  { until: 0.86, label: "执行" },
  { until: 1, label: "结束" }
];

export const OPERATION_ANIMATION_CONFIG = {
  presets: {
    caseConfirm: { duration: 850, path: "softArc", arcHeight: 0.08 },
    upperTraySelect: { duration: 1900, path: "liftArc", arcHeight: 0.48, hover: true },
    lowerTraySelect: { duration: 1900, path: "liftArc", arcHeight: 0.48, hover: true },
    addWater: { duration: 1500, path: "pourArc", arcHeight: 0.34 },
    addPowder: { duration: 1500, path: "pourArc", arcHeight: 0.32 },
    mixAlginate: {
      duration: 3800,
      path: "mixingOrbit",
      arcHeight: 0.34,
      orbitTurns: 5.5,
      orbitRadius: 0.18,
      phases: [
        { until: 0.18, label: "调拌刀就位" },
        { until: 0.82, label: "均匀刮压调拌" },
        { until: 1, label: "抬起并检查材料" }
      ]
    },
    loadUpperTray: { duration: 2700, path: "gelTransfer", arcHeight: 0.58 },
    seatUpperTray: {
      duration: 2800,
      path: "seatPress",
      arcHeight: 0.24,
      phases: [
        { until: 0.22, label: "校正就位方向" },
        { until: 0.76, label: "缓慢压入取模" },
        { until: 1, label: "保持稳定，等待材料凝固" }
      ]
    },
    shapeUpperBorder: { duration: 1700, path: "softPulse", arcHeight: 0.08 },
    removeUpperImpression: {
      duration: 3200,
      path: "releaseArc",
      arcHeight: 0.62,
      startOverrides: { upperGoodImpression: [-0.25, 0.48, -0.35] },
      phases: [
        { until: 0.24, label: "等待凝固并轻微松动" },
        { until: 0.8, label: "沿正确方向稳定取出" },
        { until: 1, label: "展示上颌印模细节" }
      ]
    },
    loadLowerTray: { duration: 2700, path: "gelTransfer", arcHeight: 0.58 },
    seatLowerTray: {
      duration: 2800,
      path: "seatPress",
      arcHeight: 0.24,
      phases: [
        { until: 0.22, label: "校正舌侧空间" },
        { until: 0.76, label: "缓慢压入取模" },
        { until: 1, label: "保持稳定，等待材料凝固" }
      ]
    },
    shapeLowerBorder: { duration: 1700, path: "softPulse", arcHeight: 0.08 },
    removeLowerImpression: {
      duration: 3200,
      path: "releaseArc",
      arcHeight: 0.62,
      startOverrides: { lowerGoodImpression: [0.25, 0.43, -0.35] },
      phases: [
        { until: 0.24, label: "等待凝固并轻微松动" },
        { until: 0.8, label: "沿正确方向稳定取出" },
        { until: 1, label: "展示下颌印模细节" }
      ]
    },
    disinfectImpressions: {
      duration: 3000,
      path: "cleaningArc",
      arcHeight: 0.42,
      phases: [
        { until: 0.28, label: "移动至冲洗消毒区" },
        { until: 0.72, label: "流动水冲洗" },
        { until: 1, label: "完成消毒并恢复清洁表面" }
      ]
    },
    evaluateQuality: {
      duration: 2500,
      path: "inspectionArc",
      arcHeight: 0.35,
      phases: [
        { until: 0.26, label: "切换至质量评价区" },
        { until: 0.78, label: "聚焦印模细节" },
        { until: 1, label: "完成质量判定" }
      ]
    }
  },
  material: {
    wetColor: "#79e2c7",
    mixedColor: "#8ed9c4",
    setColor: "#a9d8cd",
    wetRoughness: 0.18,
    setRoughness: 0.56,
    opacity: 0.7
  },
  particles: {
    desktopCount: 24,
    mobileCount: 10,
    waterColor: "#7dd3fc",
    disinfectColor: "#93c5fd"
  },
  camera: {
    defaultPosition: [0, 4.25, 5.8],
    qualityPosition: [0.4, 3.45, 4.95]
  }
};

export function getAnimationPreset(key, reducedMotion = false) {
  const preset = OPERATION_ANIMATION_CONFIG.presets[key] || {
    duration: 1000,
    path: "softArc",
    arcHeight: 0.12
  };

  return {
    ...preset,
    duration: Math.round(preset.duration * (reducedMotion ? 0.62 : 1)),
    phases: preset.phases || STANDARD_PHASES
  };
}

export function getAnimationPhase(preset, progress) {
  return preset.phases.find((phase) => progress <= phase.until)?.label || "结束";
}

export function emitOperationAudioCue(cue, detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("operation-audio-cue", { detail: { cue, ...detail } }));
}
