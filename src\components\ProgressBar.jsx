export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="rounded-lg border border-blue-100 bg-white/85 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>实验进度</span>
        <span className="font-semibold text-blue-700">{percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-blue-100">
        <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
