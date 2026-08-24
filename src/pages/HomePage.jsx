import { ArrowRight, CheckCircle2, Repeat, ShieldCheck, TriangleAlert } from "lucide-react";
import ToothIcon from "../components/ToothIcon.jsx";

const pains = ["真实训练机会有限", "材料消耗高", "学生操作失误难以及时反馈", "印模质量评价主观"];
const advantages = ["流程标准化", "可重复练习", "实时错误反馈", "自动评分", "报告生成"];

export default function HomePage({ setPage }) {
  return (
    <div className="space-y-6">
      <section className="grid items-center gap-8 rounded-lg border border-blue-100 bg-white/90 p-6 shadow-medical lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            口腔医学教学展示原型
          </p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-slate-950 sm:text-5xl">
            口腔牙列印模制取虚拟仿真实训系统
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">用于模拟口腔牙列印模制取全过程，帮助学生在标准化、可反馈、可复盘的环境中完成实训。</p>
          <button
            onClick={() => setPage("case")}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            开始实验
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-center">
          <div className="relative rounded-lg border border-blue-100 bg-blue-50/70 p-8">
            <ToothIcon />
            <div className="absolute -right-5 top-8 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-medical">托盘匹配</div>
            <div className="absolute -bottom-4 -left-5 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-medical">质量评价</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <InfoBlock title="项目痛点" icon={TriangleAlert} items={pains} tone="red" />
        <InfoBlock title="项目优势" icon={CheckCircle2} items={advantages} tone="blue" />
      </section>
    </div>
  );
}

function InfoBlock({ title, icon: Icon, items, tone }) {
  const color = tone === "red" ? "text-red-600 bg-red-50" : "text-blue-700 bg-blue-50";
  return (
    <div className="rounded-lg border border-blue-100 bg-white/90 p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-950">
        <span className={`rounded-lg p-2 ${color}`}>
          <Icon className="h-5 w-5" />
        </span>
        {title}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
            <Repeat className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
