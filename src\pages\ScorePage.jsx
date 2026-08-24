import { ArrowRight, RotateCcw } from "lucide-react";
import { scoreDimensions } from "../data/simulationData.js";

export default function ScorePage({ score, dimensionScores, errors, setPage, resetSimulation }) {
  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-blue-100 bg-white/90 p-6 shadow-medical">
        <p className="text-sm font-semibold text-blue-700">自动评分</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">总分 {score} / 100</h1>
            <p className="mt-2 text-slate-600">{score >= 80 ? "训练结果：通过" : "训练结果：需继续练习"}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={resetSimulation} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
              <RotateCcw className="h-4 w-4" />
              重新训练
            </button>
            <button onClick={() => setPage("report")} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
              查看实验报告
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {scoreDimensions.map(([name, total]) => {
          const value = Math.round(dimensionScores[name] || 0);
          return (
            <div key={name} className="rounded-lg border border-blue-100 bg-white/90 p-5 shadow-sm">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-800">{name}</span>
                <span className="text-blue-700">{value} / {total}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${(value / total) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border border-red-100 bg-white/90 p-5 shadow-sm">
        <h2 className="mb-3 font-bold text-slate-950">扣分点与错误反馈</h2>
        {errors.length === 0 ? (
          <p className="text-sm text-emerald-700">本次训练未记录错误操作。</p>
        ) : (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={`${error.step}-${index}`} className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                <strong>{error.step}：</strong>{error.feedback}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
