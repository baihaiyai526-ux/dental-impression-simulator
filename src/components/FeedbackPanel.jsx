import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function FeedbackPanel({ feedback }) {
  if (!feedback) return null;
  const Icon = feedback.type === "success" ? CheckCircle2 : AlertCircle;
  const tone =
    feedback.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className={`flex gap-3 rounded-lg border p-4 text-sm shadow-sm ${tone}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <p>{feedback.message}</p>
    </div>
  );
}
