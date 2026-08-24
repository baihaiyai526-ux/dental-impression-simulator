export const caseInfo = {
  patient: "女，22 岁",
  complaint: "因正畸治疗前需要制取上下颌牙列印模",
  oralStatus: "牙列基本完整，轻度牙列拥挤，口腔黏膜无明显异常",
  task: "完成上下颌牙列藻酸盐印模制取",
  goal:
    "选择合适托盘，规范调拌藻酸盐印模材料，完成托盘就位、边缘整塑、印模取出和质量评价"
};

export const knowledgeCards = [
  ["牙列印模的目的", "复制牙列、牙槽嵴和前庭沟形态，为诊断模型、正畸分析与治疗设计提供准确依据。"],
  ["托盘选择原则", "托盘应覆盖全部牙列和前庭沟，边缘距离黏膜转折处约 2-3 mm，并预留均匀材料空间。"],
  ["藻酸盐印模材料特点", "操作简便、弹性恢复较好、亲水性强，适用于常规牙列印模，但尺寸稳定性受时间和湿度影响。"],
  ["水粉比例与调拌时间", "按产品说明准确量取水粉，快速均匀调拌，一般控制在 45-60 秒内完成装盘前准备。"],
  ["上颌印模制取要点", "托盘由后向前稳定就位，注意唇颊侧边缘整塑，避免压迫软腭引发不适。"],
  ["下颌印模制取要点", "托盘沿牙列长轴就位，引导患者轻抬舌或活动舌体，获得完整舌侧边缘形态。"],
  ["印模质量评价标准", "牙列完整、边缘连续、无关键区气泡或撕裂，材料厚度均匀，托盘无外露。"],
  ["常见错误与处理方法", "托盘不合适、水粉比例错误、调拌过久、取出晃动等均应及时反馈并视质量重新制取。"]
];

export const scoreDimensions = [
  ["操作顺序", 20],
  ["托盘选择", 15],
  ["材料选择与调拌", 20],
  ["托盘就位与边缘整塑", 20],
  ["印模取出与消毒", 10],
  ["印模质量评价", 10],
  ["报告完整性", 5]
];

export const steps = [
  {
    title: "核对病例与操作任务",
    dimension: "操作顺序",
    tutor: "先确认病例、目标和印模类型，后续选择才有依据。",
    options: [
      { label: "核对患者信息、主诉和实验任务", correct: true, feedback: "病例与任务核对完成。" },
      { label: "直接开始选择材料", feedback: "开始操作前应先核对病例与任务，避免训练目标偏离。" },
      { label: "只查看患者年龄", feedback: "病例核对应包括患者信息、主诉、口内情况和实验任务。" }
    ]
  },
  {
    title: "选择个人防护用品",
    dimension: "操作顺序",
    tutor: "感染控制是口腔操作的第一道门槛。",
    options: [
      { label: "手套、口罩、护目镜和隔离衣", correct: true, feedback: "个人防护选择正确。" },
      { label: "只戴手套", feedback: "口腔操作存在飞沫和材料污染风险，应完成标准个人防护。" },
      { label: "不需要防护用品", feedback: "临床模拟训练也应执行感染控制要求。" }
    ]
  },
  {
    title: "检查口腔情况",
    dimension: "操作顺序",
    tutor: "检查牙列完整性、拥挤程度和黏膜状态，能帮助预判托盘与材料空间。",
    options: [
      { label: "检查牙列、前庭沟、黏膜和张口度", correct: true, feedback: "口内检查完成。" },
      { label: "只观察前牙", feedback: "印模需要覆盖全牙列，不能只观察前牙区域。" },
      { label: "跳过口腔检查", feedback: "未检查口腔情况会影响托盘大小和就位方向判断。" }
    ]
  },
  {
    title: "选择上颌托盘",
    dimension: "托盘选择",
    tutor: "上颌托盘应覆盖结节区和前庭沟，不能压迫软组织。",
    options: [
      { label: "中号上颌有孔托盘，覆盖完整且留有材料间隙", correct: true, feedback: "上颌托盘选择合适。" },
      { label: "大号上颌托盘", feedback: "托盘过大可能压迫软组织，影响患者舒适度，并导致印模边缘形态失真。" },
      { label: "小号上颌托盘", feedback: "托盘过小可能导致牙列或前庭沟区域未完全覆盖，影响印模完整性。" }
    ]
  },
  {
    title: "选择下颌托盘",
    dimension: "托盘选择",
    tutor: "下颌托盘还要兼顾舌侧空间和远中覆盖。",
    options: [
      { label: "中号下颌有孔托盘，舌侧和远中覆盖充分", correct: true, feedback: "下颌托盘选择合适。" },
      { label: "过大的下颌托盘", feedback: "托盘过大可能压迫软组织，影响患者舒适度，并导致印模边缘形态失真。" },
      { label: "过小的下颌托盘", feedback: "托盘过小可能导致牙列或前庭沟区域未完全覆盖，影响印模完整性。" }
    ]
  },
  {
    title: "试戴托盘",
    dimension: "托盘选择",
    tutor: "试戴可以提前发现覆盖不足、压迫和就位路径问题。",
    options: [
      { label: "分别试戴上下颌托盘并确认覆盖范围", correct: true, feedback: "试戴完成。" },
      { label: "未试戴托盘就直接取模", feedback: "取模前应先试戴托盘，确认托盘大小、覆盖范围和就位方向。" },
      { label: "只试戴上颌托盘", feedback: "上下颌均需试戴，不能只验证一侧。" }
    ]
  },
  {
    title: "选择藻酸盐印模材料",
    dimension: "材料选择与调拌",
    tutor: "本病例任务是上下颌牙列藻酸盐印模制取。",
    options: [
      { label: "选择藻酸盐印模材料", correct: true, feedback: "材料选择正确。" },
      { label: "选择硅橡胶咬合记录材料", feedback: "该材料不适合本任务的常规牙列印模训练目标。" },
      { label: "选择临时充填材料", feedback: "临时充填材料不能用于牙列印模制取。" }
    ]
  },
  {
    title: "按比例取水和粉",
    dimension: "材料选择与调拌",
    tutor: "水粉比例直接影响流动性、凝固时间和细节复制。",
    options: [
      { label: "按说明书量取水粉并保持比例准确", correct: true, feedback: "水粉比例正确。" },
      { label: "凭感觉多加水", feedback: "水粉比例不准确会影响藻酸盐材料的流动性、凝固时间和印模精度。" },
      { label: "粉量不足也继续调拌", feedback: "水粉比例不准确会影响藻酸盐材料的流动性、凝固时间和印模精度。" }
    ]
  },
  {
    title: "调拌印模材料",
    dimension: "材料选择与调拌",
    tutor: "调拌要迅速、均匀，避免结块和提前凝固。",
    options: [
      { label: "在规定时间内快速均匀调拌", correct: true, feedback: "调拌规范。" },
      { label: "调拌时间过长直到材料变硬", feedback: "调拌时间过长可能导致材料提前凝固，影响托盘就位和细节复制。" },
      { label: "轻轻搅几下保留干粉", feedback: "材料应均匀调拌，干粉会影响印模表面质量。" }
    ]
  },
  {
    title: "将材料装入托盘",
    dimension: "材料选择与调拌",
    tutor: "装盘要饱满、均匀，关键区域可适当补充材料。",
    options: [
      { label: "均匀装入托盘并修整表面", correct: true, feedback: "装盘完成。" },
      { label: "只在托盘前部装材料", feedback: "材料分布不均会造成后牙区复制不足。" },
      { label: "装盘后长时间等待", feedback: "藻酸盐材料工作时间有限，装盘后应及时就位。" }
    ]
  },
  {
    title: "上颌托盘口内就位",
    dimension: "托盘就位与边缘整塑",
    tutor: "上颌通常由后向前稳定就位，避免材料向咽侧过度流动。",
    options: [
      { label: "沿正确方向稳定就位上颌托盘", correct: true, feedback: "上颌托盘就位正确。" },
      { label: "托盘倾斜旋转压入", feedback: "托盘应沿牙列长轴方向稳定就位，避免材料分布不均或产生气泡。" },
      { label: "未试戴托盘就直接取模", feedback: "取模前应先试戴托盘，确认托盘大小、覆盖范围和就位方向。" }
    ]
  },
  {
    title: "上颌边缘整塑",
    dimension: "托盘就位与边缘整塑",
    tutor: "轻牵唇颊组织，让边缘形态更完整。",
    options: [
      { label: "进行唇颊部边缘整塑", correct: true, feedback: "上颌边缘整塑完成。" },
      { label: "完全不做边缘整塑", feedback: "上颌印模需要进行唇颊部边缘整塑，以获得完整的前庭沟形态。" },
      { label: "用力过大牵拉软组织", feedback: "边缘整塑应轻柔，避免造成组织变形和患者不适。" }
    ]
  },
  {
    title: "上颌印模取出",
    dimension: "印模取出与消毒",
    tutor: "凝固后一次性稳定脱位，减少变形风险。",
    options: [
      { label: "确认凝固后沿正确方向一次性取出", correct: true, feedback: "上颌印模取出规范。" },
      { label: "左右晃动后慢慢取出", feedback: "印模应沿正确方向一次性稳定取出，避免变形或撕裂。" },
      { label: "材料未凝固就取出", feedback: "未充分凝固会造成印模变形和细节丢失。" }
    ]
  },
  {
    title: "下颌托盘口内就位",
    dimension: "托盘就位与边缘整塑",
    tutor: "下颌就位要稳定，同时留意舌侧空间。",
    options: [
      { label: "沿牙列长轴稳定就位下颌托盘", correct: true, feedback: "下颌托盘就位正确。" },
      { label: "从一侧斜向压入", feedback: "托盘应沿牙列长轴方向稳定就位，避免材料分布不均或产生气泡。" },
      { label: "只压前牙区", feedback: "托盘需要整体稳定就位，保证后牙与舌侧区域材料厚度。" }
    ]
  },
  {
    title: "下颌边缘整塑",
    dimension: "托盘就位与边缘整塑",
    tutor: "下颌舌侧边缘是质量评价的重点之一。",
    options: [
      { label: "引导患者轻抬舌并活动舌体", correct: true, feedback: "下颌边缘整塑完成。" },
      { label: "不让患者抬舌或活动舌体", feedback: "下颌印模制取时应注意舌侧边缘形态，必要时引导患者轻抬舌或活动舌体。" },
      { label: "只牵拉颊侧，不关注舌侧", feedback: "下颌印模需要同时关注颊侧和舌侧边缘。" }
    ]
  },
  {
    title: "下颌印模取出",
    dimension: "印模取出与消毒",
    tutor: "取出动作越干净，印模变形越少。",
    options: [
      { label: "确认凝固后一次性稳定取出", correct: true, feedback: "下颌印模取出规范。" },
      { label: "左右晃动后取出", feedback: "印模应沿正确方向一次性稳定取出，避免变形或撕裂。" },
      { label: "拉扯局部材料取出", feedback: "局部拉扯容易造成撕裂，应整体稳定脱位。" }
    ]
  },
  {
    title: "冲洗消毒印模",
    dimension: "印模取出与消毒",
    tutor: "取出后立即处理，既是质量控制也是感染控制。",
    options: [
      { label: "及时冲洗、消毒并妥善保存", correct: true, feedback: "冲洗消毒完成。" },
      { label: "不冲洗消毒直接评价", feedback: "印模取出后应及时冲洗并消毒，符合临床感染控制要求。" },
      { label: "长时间暴露在空气中", feedback: "藻酸盐印模易失水变形，应及时处理并灌模或保湿保存。" }
    ]
  },
  {
    title: "检查印模质量",
    dimension: "印模质量评价",
    tutor: "重点看完整性、边缘、气泡、撕裂和托盘外露。",
    options: [
      { label: "按标准检查牙列、边缘、气泡和撕裂", correct: true, feedback: "质量检查完成。" },
      { label: "只看前牙是否清楚", feedback: "质量评价应覆盖全牙列和边缘区域，不能只看前牙。" },
      { label: "发现气泡也直接忽略", feedback: "关键区域气泡可能影响模型精度，应根据气泡位置和范围判断是否需要重新制取。" }
    ]
  },
  {
    title: "判断是否需要重新制取",
    dimension: "印模质量评价",
    tutor: "关键区域缺陷需要果断重取，非关键微小缺陷可记录说明。",
    options: [
      { label: "关键区域气泡或边缘缺损时判定需重取", correct: true, feedback: "重取判断正确。" },
      { label: "印模有气泡仍判定合格", feedback: "关键区域气泡可能影响模型精度，应根据气泡位置和范围判断是否需要重新制取。" },
      { label: "边缘缺损仍判定合格", feedback: "边缘缺损会影响模型完整性，尤其是前庭沟和牙列远中区域，应考虑重新制取。" }
    ]
  },
  {
    title: "生成实验报告",
    dimension: "报告完整性",
    tutor: "报告要能回放操作表现，也要给出改进建议。",
    options: [
      { label: "生成含病例、步骤、评分和建议的完整报告", correct: true, feedback: "实验报告已生成。" },
      { label: "只记录总分", feedback: "报告应包含病例信息、完成步骤、扣分点、错误与改进建议。" },
      { label: "不生成报告", feedback: "实验结束后应生成报告，便于复盘和教学评价。" }
    ]
  }
];

export const modelAssets = [
  {
    id: "upper-arch",
    name: "上颌牙列模型",
    source: "口腔扫描模型占位",
    usage: "观察上颌牙弓形态、前庭沟区域和托盘覆盖范围。",
    keyPoint: "重点观察上颌结节区、前庭沟深度和托盘材料间隙。",
    type: "upperArch",
    modelUrl: ""
  },
  {
    id: "lower-arch",
    name: "下颌牙列模型",
    source: "口腔扫描模型占位",
    usage: "观察下颌牙列、舌侧边缘和托盘就位方向。",
    keyPoint: "注意舌侧边缘空间、后牙远中覆盖和就位路径。",
    type: "lowerArch",
    modelUrl: ""
  },
  {
    id: "upper-tray",
    name: "上颌印模托盘",
    source: "器械扫描模型占位",
    usage: "训练上颌托盘选择、试戴和就位。",
    keyPoint: "托盘边缘应覆盖前庭沟区域，避免过大压迫软组织。",
    type: "upperTray",
    modelUrl: ""
  },
  {
    id: "lower-tray",
    name: "下颌印模托盘",
    source: "器械扫描模型占位",
    usage: "训练下颌托盘选择、舌侧边缘控制和就位。",
    keyPoint: "观察舌侧开口和牙列长轴方向，保证托盘稳定就位。",
    type: "lowerTray",
    modelUrl: ""
  },
  {
    id: "mixing-bowl",
    name: "调拌碗",
    source: "器械扫描模型占位",
    usage: "用于藻酸盐材料调拌训练。",
    keyPoint: "调拌应快速、均匀，避免粉液混合不充分。",
    type: "bowl",
    modelUrl: ""
  },
  {
    id: "spatula",
    name: "调拌刀",
    source: "器械扫描模型占位",
    usage: "用于藻酸盐粉液混合与刮压调拌。",
    keyPoint: "贴壁刮压可减少结块并提高调拌均匀性。",
    type: "spatula",
    modelUrl: ""
  },
  {
    id: "qualified-impression",
    name: "合格印模",
    source: "印模扫描模型占位",
    usage: "展示边缘完整、牙列细节清晰、无关键区域气泡的标准印模。",
    keyPoint: "边缘连续、细节清楚、无撕裂和托盘外露。",
    type: "qualified",
    modelUrl: ""
  },
  {
    id: "bubble-impression",
    name: "气泡印模",
    source: "缺陷印模扫描占位",
    usage: "关键牙面或边缘区域出现气泡，应判断是否需要重取。",
    keyPoint: "关键区域气泡会影响模型精度，不能简单判定合格。",
    type: "bubble",
    modelUrl: ""
  },
  {
    id: "edge-defect-impression",
    name: "边缘缺损印模",
    source: "缺陷印模扫描占位",
    usage: "前庭沟或远中区域缺损，影响模型完整性。",
    keyPoint: "边缘缺损常提示托盘覆盖不足或边缘整塑不充分。",
    type: "edgeDefect",
    modelUrl: ""
  },
  {
    id: "deformed-impression",
    name: "变形印模",
    source: "缺陷印模扫描占位",
    usage: "取出方向不稳或材料凝固不足导致形态变形。",
    keyPoint: "变形印模会影响后续灌模和咬合分析，应考虑重新制取。",
    type: "deformed",
    modelUrl: ""
  }
];

export const realSceneSteps = [
  ["选择上颌牙列模型", "模型识别与托盘选择"],
  ["选择合适上颌托盘", "模型识别与托盘选择"],
  ["拖拽托盘到牙列模型", "托盘试戴与覆盖范围判断"],
  ["判断托盘覆盖范围", "托盘试戴与覆盖范围判断"],
  ["调拌藻酸盐印模材料", "材料调拌与装盘"],
  ["将材料装入托盘", "材料调拌与装盘"],
  ["模拟托盘口内就位", "口内就位与边缘整塑"],
  ["模拟边缘整塑", "口内就位与边缘整塑"],
  ["模拟印模取出", "印模取出与质量评价"],
  ["检查上颌印模质量", "印模取出与质量评价"],
  ["选择下颌牙列模型", "模型识别与托盘选择"],
  ["选择合适下颌托盘", "模型识别与托盘选择"],
  ["模拟下颌托盘口内就位", "口内就位与边缘整塑"],
  ["引导舌体活动/边缘整塑", "口内就位与边缘整塑"],
  ["模拟下颌印模取出", "印模取出与质量评价"],
  ["检查下颌印模质量", "印模取出与质量评价"],
  ["生成实景操作评分", "印模取出与质量评价"]
].map(([title, dimension], index) => ({ title, dimension, index }));

export const realSceneDimensionTotals = {
  模型识别与托盘选择: 20,
  托盘试戴与覆盖范围判断: 20,
  材料调拌与装盘: 20,
  口内就位与边缘整塑: 20,
  印模取出与质量评价: 20
};

export const realSceneFeedback = {
  smallTray: "托盘偏小：牙列或前庭沟区域覆盖不足，可能导致印模不完整。",
  largeTray: "托盘偏大：可能压迫软组织，造成患者不适或边缘形态失真。",
  tiltedTray: "托盘就位偏斜：材料厚度不均，容易形成气泡或局部变形。",
  insufficientMix: "材料调拌不足：粉液混合不均，影响印模细节复制。",
  overMix: "调拌时间过长：材料进入凝固期，流动性下降。",
  unevenLoad: "装盘不均匀：托盘局部材料不足，可能造成牙列细节缺失。",
  noBorder: "未做边缘整塑：前庭沟或舌侧边缘形态记录不足。",
  shakyRemoval: "取出时晃动：可能导致印模撕裂、变形或边缘缺损。",
  noEvaluation: "未进行质量评价：无法判断印模是否满足灌模要求。",
  wrongQuality: "对缺陷印模误判合格：关键区域缺陷会影响后续模型精度。"
};
