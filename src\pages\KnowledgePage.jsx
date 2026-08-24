import { ArrowRight, BookOpen, Lightbulb } from "lucide-react";
import { knowledgeCards } from "../data/simulationData.js";

export default function KnowledgePage({ setPage, resetSimulation }) {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-white/90 p-6 shadow-medical">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
          <BookOpen className="h-4 w-4" />
          标准化知识学习
        </p>
        <h1 className="text-2xl font-bold text-slate-950">牙列印模制取核心知识</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {knowledgeCards.map(([title, content]) => (
          <article key={title} className="rounded-lg border border-blue-100 bg-white/90 p-5 shadow-sm">
            <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-700">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h2 className="mb-2 font-bold text-slate-950">{title}</h2>
            <p className="text-sm leading-6 text-slate-600">{content}</p>
          </article>
        ))}
      </div>
      <button
        onClick={resetSimulation}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        开始虚拟操作
        <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}
