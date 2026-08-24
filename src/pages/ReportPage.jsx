import { CheckCircle2, FileText, XCircle } from "lucide-react";
import { caseInfo } from "../data/simulationData.js";

export default function ReportPage({ studentName, setStudentName, completedSteps, score, errors, realSceneRecord }) {
  const basePassed = score >= 80;
  const sceneScore = realSceneRecord?.totalScore ?? realSceneRecord?.score ?? 0;
  const scenePassed = realSceneRecord?.passed ?? sceneScore >= 80;
  const sceneCompleted = realSceneRecord?.completedSteps || [];
  const sceneErrors = realSceneRecord?.errors || [];
  const sceneDeductions = realSceneRecord?.deductions || [];
  const sceneSuggestions = realSceneRecord?.suggestions || ["完成可点击移动式实景训练后生成改进建议。"];

  return (
    <section className="space-y-5 rounded-lg border border-blue-100 bg-white/90 p-6 shadow-medical lg:p-8">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-blue-50 p-3 text-blue-700">
          <FileText className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-950">实验报告</h1>
          <p className="text-sm text-slate-500">自动生成训练表现、扣分点和改进建议。</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReportBlock title="学生姓名">
          <input
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 outline-none focus:border-blue-400"
          />
        </ReportBlock>
        <ReportBlock title="基础虚拟操作是否通过">
          <PassBadge passed={basePassed} />
        </ReportBlock>
        <ReportBlock title="病例信息">{caseInfo.patient}；{caseInfo.oralStatus}</ReportBlock>
        <ReportBlock title="实验任务">{caseInfo.task}</ReportBlock>
        <ReportBlock title="基础虚拟操作总分">{score} / 100</ReportBlock>
        <ReportBlock title="基础虚拟操作完成步骤">
          {completedSteps.length ? `${completedSteps.length} 个步骤已完成` : "尚未完成基础虚拟操作"}
        </ReportBlock>
      </div>

      <ReportBlock title="基础虚拟操作扣分点">
        {errors.length ? errors.map((item, index) => <p key={index}>- {item.step}：{item.feedback}</p>) : "无扣分点"}
      </ReportBlock>

      <div className="rounded-lg border border-blue-100 bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-slate-950">可点击移动式实景虚拟操作训练记录</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ReportBlock title="训练模式">{realSceneRecord?.mode || "可点击移动式实景虚拟操作训练"}</ReportBlock>
          <ReportBlock title="是否通过训练"><PassBadge passed={scenePassed} /></ReportBlock>
          <ReportBlock title="实景操作总分">{sceneScore} / 100</ReportBlock>
          <ReportBlock title="等级">{realSceneRecord?.grade || "未完成"}</ReportBlock>
          <ReportBlock title="错误次数">{realSceneRecord?.errorCount ?? sceneErrors.length}</ReportBlock>
          <ReportBlock title="实景虚拟操作总评">{realSceneRecord?.finalComment || "尚未完成实景操作训练。"}</ReportBlock>
        </div>

        <ReportBlock title="实景操作步骤完成情况">
          {sceneCompleted.length ? (
            <div className="grid gap-2 md:grid-cols-2">
              {sceneCompleted.map((item, index) => (
                <div key={`${item.title}-${index}`} className={`rounded-lg px-3 py-2 ${item.completed ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                  {index + 1}. {item.title}：{item.completed ? "已完成" : "未完成"}
                </div>
              ))}
            </div>
          ) : (
            "尚未产生实景步骤记录"
          )}
        </ReportBlock>

        <ReportBlock title="每一步点击记录">
          {realSceneRecord?.clickRecords?.length ? (
            realSceneRecord.clickRecords.map((item, index) => (
              <p key={`${item.step}-${index}`}>
                - {item.step}：点击 {item.clickedObjectId}，{item.correct ? "正确" : "错误"}；{item.feedback}
              </p>
            ))
          ) : (
            "暂无点击记录"
          )}
        </ReportBlock>

        <ReportBlock title="错误步骤">
          {sceneErrors.length ? sceneErrors.map((item, index) => <p key={index}>- {item.step}：点击 {item.clickedObjectId}</p>) : "暂无错误步骤"}
        </ReportBlock>

        <ReportBlock title="扣分点">
          {sceneDeductions.length ? sceneDeductions.map((item) => <p key={item}>- {item}</p>) : "暂无扣分点"}
        </ReportBlock>

        <ReportBlock title="AI 改进建议">
          {sceneSuggestions.map((item) => <p key={item}>- {item}</p>)}
        </ReportBlock>
      </div>
    </section>
  );
}

function PassBadge({ passed }) {
  return (
    <div className={`flex items-center gap-2 font-bold ${passed ? "text-emerald-700" : "text-red-700"}`}>
      {passed ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
      {passed ? "通过" : "未通过"}
    </div>
  );
}

function ReportBlock({ title, children }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-slate-50 p-4">
      <h2 className="mb-2 text-sm font-semibold text-blue-700">{title}</h2>
      <div className="text-sm leading-7 text-slate-700">{children}</div>
    </div>
  );
}
