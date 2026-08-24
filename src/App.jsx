import { useEffect, useMemo, useState } from "react";
import { Activity, BookOpen, Boxes, ClipboardList, Home, PlayCircle, ScrollText, ScanLine } from "lucide-react";
import HomePage from "./pages/HomePage.jsx";
import CasePage from "./pages/CasePage.jsx";
import KnowledgePage from "./pages/KnowledgePage.jsx";
import SimulationPage from "./pages/SimulationPage.jsx";
import ScorePage from "./pages/ScorePage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import ModelLibraryPage from "./pages/ModelLibraryPage.jsx";
import RealSceneOperationPage from "./pages/RealSceneOperationPage.jsx";
import PwaInstallButton from "./components/PwaInstallButton.jsx";
import { scoreDimensions, steps } from "./data/simulationData.js";
import { loadTrainingState, saveTrainingState } from "./utils/trainingStorage.js";

const pages = [
  { id: "home", label: "首页", icon: Home },
  { id: "case", label: "病例导入", icon: ClipboardList },
  { id: "knowledge", label: "知识学习", icon: BookOpen },
  { id: "simulation", label: "虚拟操作", icon: PlayCircle },
  { id: "models", label: "实物建模展示", icon: Boxes },
  { id: "realScene", label: "可点击实景训练", icon: ScanLine },
  { id: "score", label: "自动评分", icon: Activity },
  { id: "report", label: "实验报告", icon: ScrollText }
];

const pageIds = new Set(pages.map((item) => item.id));

const dimensionStepCount = steps.reduce((acc, step) => {
  acc[step.dimension] = (acc[step.dimension] || 0) + 1;
  return acc;
}, {});

const dimensionTotals = Object.fromEntries(scoreDimensions);

function buildInitialDimensionScores() {
  return Object.fromEntries(scoreDimensions.map(([name]) => [name, 0]));
}

const initialRealSceneRecord = {
  mode: "可点击移动式实景虚拟操作训练",
  usedModels: [],
  completedSteps: [],
  clickRecords: [],
  totalScore: 0,
  score: 0,
  grade: "未完成",
  errorCount: 0,
  errors: [],
  deductions: [],
  finalComment: "尚未完成实景操作训练。",
  suggestions: ["完成可点击移动式实景训练后自动生成建议。"],
  passed: false
};

export default function App() {
  const [savedState] = useState(loadTrainingState);
  const [page, setPage] = useState(() => (pageIds.has(savedState?.page) ? savedState.page : "home"));
  const [studentName, setStudentName] = useState(() => savedState?.studentName || "示例学生");
  const [currentStep, setCurrentStep] = useState(() => Math.min(Math.max(savedState?.currentStep || 0, 0), steps.length - 1));
  const [completedSteps, setCompletedSteps] = useState(() => savedState?.completedSteps || []);
  const [dimensionScores, setDimensionScores] = useState(() => ({
    ...buildInitialDimensionScores(),
    ...(savedState?.dimensionScores || {})
  }));
  const [errors, setErrors] = useState(() => savedState?.errors || []);
  const [stepErrors, setStepErrors] = useState(() => savedState?.stepErrors || {});
  const [realSceneRecord, setRealSceneRecord] = useState(() => savedState?.realSceneRecord || initialRealSceneRecord);

  const totalScore = useMemo(
    () => Math.round(Object.values(dimensionScores).reduce((sum, value) => sum + value, 0)),
    [dimensionScores]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveTrainingState({
        page,
        studentName,
        currentStep,
        completedSteps,
        dimensionScores,
        errors,
        stepErrors,
        realSceneRecord
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [page, studentName, currentStep, completedSteps, dimensionScores, errors, stepErrors, realSceneRecord]);

  const resetSimulation = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setDimensionScores(buildInitialDimensionScores());
    setErrors([]);
    setStepErrors({});
    setPage("simulation");
  };

  const handleChoice = (option) => {
    const step = steps[currentStep];

    if (!option.correct) {
      setErrors((current) => [
        ...current,
        {
          step: step.title,
          choice: option.label,
          feedback: option.feedback
        }
      ]);
      setStepErrors((current) => ({
        ...current,
        [currentStep]: (current[currentStep] || 0) + 1
      }));
      return { type: "error", message: option.feedback };
    }

    const fullPoint = dimensionTotals[step.dimension] / dimensionStepCount[step.dimension];
    const earned = stepErrors[currentStep] ? fullPoint * 0.5 : fullPoint;

    setDimensionScores((current) => ({
      ...current,
      [step.dimension]: Math.min(dimensionTotals[step.dimension], current[step.dimension] + earned)
    }));
    setCompletedSteps((current) => [...current, step.title]);

    if (currentStep === steps.length - 1) {
      setTimeout(() => setPage("score"), 500);
    } else {
      setCurrentStep((index) => index + 1);
    }

    return { type: "success", message: option.feedback };
  };

  const shared = {
    setPage,
    resetSimulation,
    studentName,
    setStudentName,
    score: totalScore,
    dimensionScores,
    completedSteps,
    errors,
    realSceneRecord,
    setRealSceneRecord
  };

  const activePage = {
    home: <HomePage {...shared} />,
    case: <CasePage {...shared} />,
    knowledge: <KnowledgePage {...shared} />,
    simulation: (
      <SimulationPage
        {...shared}
        currentStep={currentStep}
        onChoice={handleChoice}
        errorCount={errors.length}
      />
    ),
    models: <ModelLibraryPage {...shared} />,
    realScene: <RealSceneOperationPage {...shared} />,
    score: <ScorePage {...shared} />,
    report: <ReportPage {...shared} />
  }[page];

  return (
    <div className="min-h-screen">
      <header className="pwa-safe-header sticky top-0 z-20 border-b border-blue-100 bg-white/85 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3">
          <div className="mr-2 flex shrink-0 items-center gap-2 font-bold text-blue-800">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">牙</span>
            <span className="hidden sm:inline">虚拟仿真实训</span>
          </div>
          {pages.map((item) => {
            const Icon = item.icon;
            const active = item.id === page;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  active ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
          <PwaInstallButton />
        </nav>
      </header>
      <main className="medical-grid mx-auto max-w-7xl px-4 py-6 sm:py-8">{activePage}</main>
    </div>
  );
}
