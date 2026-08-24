import { useState } from "react";
import FeedbackPanel from "../components/FeedbackPanel.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import ScoreSummary from "../components/ScoreSummary.jsx";
import StepCard from "../components/StepCard.jsx";
import TutorPanel from "../components/TutorPanel.jsx";
import { steps } from "../data/simulationData.js";

export default function SimulationPage({ currentStep, onChoice, score, completedSteps, errorCount }) {
  const [feedback, setFeedback] = useState(null);
  const step = steps[currentStep] || steps[steps.length - 1];

  const choose = (option) => {
    const result = onChoice(option);
    setFeedback(result);
  };

  return (
    <div className="space-y-4">
      <ProgressBar current={completedSteps.length} total={steps.length} />
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <StepCard step={step} index={currentStep} total={steps.length} onChoose={choose} />
          <FeedbackPanel feedback={feedback} />
          <TutorPanel tip={step.tutor} />
        </div>
        <div className="space-y-4">
          <ScoreSummary score={score} completed={completedSteps.length} total={steps.length} errors={errorCount} />
          <div className="rounded-lg border border-blue-100 bg-white/90 p-4 shadow-sm">
            <h3 className="mb-3 font-semibold text-slate-900">操作时间轴</h3>
            <div className="max-h-[460px] space-y-2 overflow-auto pr-1">
              {steps.map((item, index) => {
                const done = index < completedSteps.length;
                const active = index === currentStep;
                return (
                  <div
                    key={item.title}
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      done
                        ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                        : active
                          ? "border-blue-200 bg-blue-50 text-blue-800"
                          : "border-slate-100 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {index + 1}. {item.title}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
