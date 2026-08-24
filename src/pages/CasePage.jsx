import { ArrowRight, ClipboardList, UserRound } from "lucide-react";
import { caseInfo } from "../data/simulationData.js";

export default function CasePage({ setPage }) {
  const rows = [
    ["患者", caseInfo.patient],
    ["主诉", caseInfo.complaint],
    ["口内情况", caseInfo.oralStatus],
    ["实验任务", caseInfo.task],
    ["训练目标", caseInfo.goal]
  ];

  return (
    <section className="rounded-lg border border-blue-100 bg-white/90 p-6 shadow-medical lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="rounded-lg bg-blue-50 p-3 text-blue-700">
          <ClipboardList className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-950">病例导入</h1>
          <p className="text-sm text-slate-500">进入操作前，请完成病例评估和任务确认。</p>
        </div>
      </div>
      <div className="grid gap-4">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-blue-700">
              <UserRound className="h-4 w-4" />
              {label}
            </p>
            <p className="leading-7 text-slate-700">{value}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setPage("knowledge")}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        进入知识学习
        <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}
