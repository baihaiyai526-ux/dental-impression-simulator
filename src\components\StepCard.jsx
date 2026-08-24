import { CircleDot, Stethoscope } from "lucide-react";
import InstrumentSelector from "./InstrumentSelector.jsx";

export default function StepCard({ step, index, total, onChoose, locked }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white/95 p-5 shadow-medical">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
            <CircleDot className="h-4 w-4" />
            第 {index + 1} / {total} 步
          </div>
          <h2 className="text-xl font-bold text-slate-950">{step.title}</h2>
          <p className="mt-2 text-sm text-slate-500">请选择最符合规范流程的操作。</p>
        </div>
        <div className="hidden rounded-lg bg-blue-50 p-3 text-blue-700 sm:block">
          <Stethoscope className="h-7 w-7" />
        </div>
      </div>
      <InstrumentSelector options={step.options} onChoose={onChoose} locked={locked} />
    </section>
  );
}
