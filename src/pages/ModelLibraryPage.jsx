import { Box, Database, Info } from "lucide-react";
import { useEffect, useState } from "react";
import ModelViewer from "../components/ModelViewer.jsx";
import { assetPath } from "../utils/assetPath.js";

const QUALIFIED_IMPRESSION_MODEL_PATHS = {
  upper: assetPath("models/good_impression.glb"),
  lower: assetPath("models/lower-qualified-impression.glb")
};

const placeholderModels = [
  {
    id: "upper_arch_placeholder",
    name: "upper_arch.glb",
    cnName: "上颌牙列",
    source: "用户提供的实物 GLB 模型",
    usage: "用于观察上颌牙弓形态、前庭沟区域和托盘覆盖范围。",
    keyPoint: "观察上颌牙弓、牙列细节及前庭沟区域，训练托盘覆盖和就位方向判断。",
    type: "upper_arch_placeholder",
    modelPath: assetPath("models/upper_arch.glb"),
    modelRotation: [-Math.PI / 2, 0, 0]
  },
  {
    id: "lower_arch_placeholder",
    name: "lower_arch.glb",
    cnName: "下颌牙列",
    source: "用户提供的实物 GLB 模型",
    usage: "用于观察下颌牙列、舌侧边缘和托盘就位方向。",
    keyPoint: "观察下颌牙弓、牙列细节及舌侧边缘，训练托盘覆盖和就位方向判断。",
    type: "lower_arch_placeholder",
    modelPath: assetPath("models/lower_arch.glb"),
    modelRotation: [-Math.PI / 2, 0, 0]
  },
  {
    id: "upper_tray_placeholder",
    name: "upper_tray.glb",
    cnName: "上颌印模托盘",
    source: "用户提供的实物 GLB 模型",
    usage: "用于训练上颌托盘选择、试戴和就位。",
    keyPoint: "观察托盘弧度、腭部覆盖和手柄方向，判断牙列覆盖范围与材料间隙。",
    type: "upper_tray_placeholder",
    modelPath: assetPath("models/upper_tray.glb"),
    modelRotation: [-Math.PI / 2, 0, 0]
  },
  {
    id: "lower_tray_placeholder",
    name: "lower_tray.glb",
    cnName: "下颌印模托盘",
    source: "用户提供的实物 GLB 模型",
    usage: "用于训练下颌托盘选择、舌侧边缘控制和就位。",
    keyPoint: "观察托盘弧度、手柄方向和舌侧空间，判断牙列覆盖范围与材料间隙。",
    type: "lower_tray_placeholder",
    modelPath: assetPath("models/lower_tray.glb"),
    modelRotation: [-Math.PI / 2, 0, 0]
  },
  {
    id: "mixing_bowl_placeholder",
    name: "mixing_bowl.glb",
    cnName: "调拌碗",
    source: "用户提供的实物 GLB 模型",
    usage: "用于藻酸盐材料调拌训练。",
    keyPoint: "可旋转观察碗壁、碗口和调拌空间，训练调拌刀贴壁刮压操作。",
    type: "mixing_bowl_placeholder",
    modelPath: assetPath("models/mixing_bowl.glb"),
    modelRotation: [-Math.PI / 2, 0, 0]
  },
  {
    id: "spatula_placeholder",
    name: "spatula.glb",
    cnName: "调拌刀",
    source: "用户提供的实物 GLB 模型",
    usage: "用于藻酸盐粉液混合与刮压调拌。",
    keyPoint: "观察刀柄与刮拌端形态，训练贴合碗壁快速刮压调拌。",
    type: "spatula_placeholder",
    modelPath: assetPath("models/spatula.glb"),
    modelRotation: [0, 0, -0.28]
  },
  {
    id: "alginate_placeholder",
    name: "alginate.glb",
    cnName: "藻酸盐材料",
    source: "用户提供的实物 GLB 模型",
    usage: "用于展示调拌后的半透明胶状材料。",
    keyPoint: "用于识别藻酸盐材料，并配合加粉、调拌和托盘装料流程进行训练。",
    type: "alginate_placeholder",
    modelPath: assetPath("models/alginate.glb"),
    modelRotation: [0, -0.28, 0]
  },
  {
    id: "upper_qualified_impression",
    name: "good_impression.glb",
    cnName: "上颌合格印模",
    source: "用户提供的实物 GLB 模型",
    usage: "用于观察上颌合格印模的牙列细节与边缘完整性。",
    keyPoint: "牙列细节连续、上颌边缘完整，关键区域无明显气泡或变形。",
    type: "good_impression_placeholder",
    modelPath: QUALIFIED_IMPRESSION_MODEL_PATHS.upper,
    modelRotation: [-Math.PI / 2, 0, 0],
    missingMessage: "请放置上颌合格印模模型文件"
  },
  {
    id: "lower_qualified_impression",
    name: "lower-qualified-impression.glb",
    cnName: "下颌合格印模",
    source: "用户提供的实物 GLB 模型",
    usage: "用于观察下颌合格印模的牙列细节与舌侧边缘。",
    keyPoint: "牙列细节连续、舌侧和后牙区边缘完整，整体无明显变形。",
    type: "good_impression_placeholder",
    modelPath: QUALIFIED_IMPRESSION_MODEL_PATHS.lower,
    modelRotation: [-Math.PI / 2, 0, 0],
    missingMessage: "请放置下颌合格印模模型文件"
  }
];

export default function ModelLibraryPage() {
  const [selectedId, setSelectedId] = useState(placeholderModels[0].id);
  const [modelAvailability, setModelAvailability] = useState({});
  const selected = placeholderModels.find((model) => model.id === selectedId) || placeholderModels[0];
  const selectedModelAvailable = selected.modelPath ? modelAvailability[selected.modelPath] : false;
  const viewerModel = selectedModelAvailable ? selected : { ...selected, modelPath: undefined };

  useEffect(() => {
    const modelPaths = [...new Set(placeholderModels.map((model) => model.modelPath).filter(Boolean))];
    let active = true;

    modelPaths.forEach((path) => {
      fetch(path, { method: "HEAD" })
        .then((response) => {
          const contentType = response.headers.get("content-type") || "";
          if (active) {
            setModelAvailability((current) => ({
              ...current,
              [path]: response.ok && !contentType.includes("text/html")
            }));
          }
        })
        .catch(() => {
          if (active) setModelAvailability((current) => ({ ...current, [path]: false }));
        });
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="grid gap-5 xl:grid-cols-[330px_1fr_300px]">
      <div className="rounded-lg border border-blue-100 bg-white/90 p-4 shadow-medical">
        <div className="mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-700" />
          <h1 className="text-xl font-bold text-slate-950">实物三维建模展示</h1>
        </div>
        <div className="space-y-3">
          {placeholderModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedId(model.id)}
              className={`w-full rounded-lg border p-4 text-left transition hover:border-blue-300 ${
                selectedId === model.id ? "border-blue-300 bg-blue-50" : "border-slate-100 bg-white"
              }`}
            >
              <p className="font-semibold text-slate-950">{model.cnName}</p>
              <p className="mt-1 text-xs font-mono text-blue-700">{model.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{model.usage}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-blue-100 bg-white/90 p-5 shadow-medical">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-700">3D 模型查看器</p>
              <h2 className="text-2xl font-bold text-slate-950">{selected.cnName}</h2>
            </div>
            <span className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              selected.modelPath && modelAvailability[selected.modelPath] === false
                ? "bg-amber-50 text-amber-700"
                : selectedModelAvailable
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-blue-50 text-blue-700"
            }`}>
              {selected.modelPath && modelAvailability[selected.modelPath] === false
                ? "模型待放置"
                : selectedModelAvailable
                  ? "真实 GLB 模型"
                  : selected.modelPath
                    ? "正在检查模型"
                    : "简化几何体"}
            </span>
          </div>
          <ModelViewer model={viewerModel} />
          <p className="mt-3 text-sm text-slate-500">
            鼠标拖动旋转，滚轮缩放，右键或双指平移。已提供 GLB 文件的对象会显示真实模型，其余对象继续使用基础几何体占位。
          </p>
        </div>
      </div>

      <aside className="rounded-lg border border-blue-100 bg-white/90 p-5 shadow-medical">
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-700" />
          <h2 className="font-bold text-slate-950">教学说明</h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-slate-700">
          <InfoRow label={selected.modelPath ? "模型文件" : "占位模型"} value={selected.name} />
          <InfoRow label="中文名称" value={selected.cnName} />
          <InfoRow label="来源" value={selected.source} />
          <InfoRow label="用途" value={selected.usage} />
          <InfoRow label="操作要点" value={selected.keyPoint} />
          <div className="rounded-lg bg-blue-50 p-4 text-blue-900">
            <Box className="mb-2 h-5 w-5" />
            {selected.modelPath && modelAvailability[selected.modelPath] === false
              ? selected.missingMessage || "请放置对应的 GLB 模型文件"
              : selectedModelAvailable
                ? "当前对象已接入真实 GLB 文件，并自动完成居中与尺寸适配。"
                : selected.modelPath
                  ? "正在检查模型文件，查看器暂时显示稳定占位模型。"
                  : "当前对象使用占位模型，后续可替换为真实扫描模型。"}
          </div>
        </div>
      </aside>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-blue-700">{label}</p>
      <p>{value}</p>
    </div>
  );
}
