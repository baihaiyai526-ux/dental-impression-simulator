import { ClipboardCheck, ListChecks, XCircle } from "lucide-react";

export default function ScoreSummary({ score, completed, total, errors }) {
  const items = [
    { label: "当前得分", value: `${score}/100`, icon: ClipboardCheck },
    { label: "已完成步骤", value: `${completed}/${total}`, icon: ListChecks },
    { label: "错误次数", value: errors, icon: XCircle }
  ];

  return (
    <aside className="space-y-3 rounded-lg border border-blue-100 bg-white/90 p-4 shadow-medical">
      <h3 className="font-semibold text-slate-900">操作状态</h3>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <Icon className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="font-semibold text-slate-900">{item.value}</p>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
