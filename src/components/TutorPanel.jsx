import { Sparkles } from "lucide-react";

export default function TutorPanel({ tip }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/80 p-4 text-sm text-blue-900">
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <Sparkles className="h-4 w-4" />
        AI 虚拟导师提示
      </div>
      <p>{tip}</p>
    </div>
  );
}
