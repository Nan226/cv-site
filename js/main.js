/* ========================================
   CV-Site — 交互脚本
   导航撕碎效果 + Three.js 3D人物
   ======================================== */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { initProjectsOrbs } from './projects-orbs.js?v=20260719-1';

const LANGUAGE_KEY = 'cv-site-language';
const DEFAULT_LANGUAGE = 'en';
const I18N = {
  en: {
    languageGate: {
      kicker: 'WELCOME FILE',
      title: 'Choose Your Language',
      text: 'Select a language while the site prepares the magic.',
      loading: 'Preparing images, model and video...'
    },
    tools: { language: '中文', resume: 'Resume', expand: 'Expand quick actions', collapse: 'Collapse quick actions' },
    nav: {
      home: 'Home',
      homeTitle: 'Back to Home',
      about: 'About Me',
      internship: 'Internship',
      projects: 'Projects',
      skills: 'Skills & Learning',
      friends: 'Me & My Friends'
    },
    home: {
      subtitle: 'Builder · Dreamer · Braver',
      interactHint: 'Click the character to interact',
      easterHint: 'Tear all tags to unlock easter egg',
      loading: 'loading',
      modelPreparing: 'Preparing 3D character...',
      modelLoading: 'Loading 3D character...',
      modelRetrying: 'Retrying 3D character...',
      modelReady: '3D character ready',
      modelStillLoading: 'Still loading 3D character...',
      modelStatic: 'Static character preview',
      tagPmo: 'PMO',
      tagEnfp: 'ENFP',
      tagMetaverse: 'Metaverse',
      tagCommunicator: 'Cross-functional Communicator',
      tagAi: 'AI Enthusiast',
      tagLearner: 'Fast Learner',
      tagCreative: 'Creative',
      tagExecution: 'Strong Execution',
      tagData: 'Data-driven',
      tagCs: 'CS Background',
      footer: 'COURAGE MATTERS MORE THAN COMPETENCE'
    },
    about: { title: 'About Me', timeline: 'Timeline' },
    internship: {
      title: 'Internship Journey',
      subtitle: 'Three chapters of practice',
      cardKicker: 'Internship',
      viewDetails: 'View Details',
      back: 'Back to Journey',
      responsibilities: 'Responsibilities',
      methods: 'Tools & Methods',
      highlights: 'Highlights'
    },
    projects: {
      title: 'Project Showcase',
      tagline: 'Click the glowing orbs to explore each project.',
      sceneAria: 'Interactive project sphere field',
      file: 'PROJECT FILE',
      closeAria: 'Close project details',
      highlights: 'Highlights',
      techStack: 'Tech Stack',
      status: 'Status',
      openAriaPrefix: 'Open',
      openAriaSuffix: 'project details',
      illuminated: 'ILLUMINATED PROJECT'
    },
    skills: {
      kicker: 'PROFILE DECK 09',
      titleA: 'Skills',
      titleB: '& Learning',
      tagline: 'Built through practice. Expanded through curiosity.',
      countsAria: 'Deck contents',
      countSkills: 'Skills',
      countLearning: 'Learning',
      countPlay: 'Play',
      boardSkill: 'SKILL',
      boardLearning: 'LEARNING / PLAY',
      gridAria: 'Skills and learning flip cards',
      crew: 'CURIOSITY CREW',
      note: 'Keep learning.<br>Keep playing.',
      reveal: 'Reveal',
      hide: 'Hide',
      videoKicker: 'VIDEO SHOWCASE',
      videoTitle: 'Open the AI Video showcase?',
      videoText: 'This will open a movable video window with sound controls.',
      videoConfirm: 'Open Video',
      videoCancel: 'Not Now',
      playKicker: 'BEFORE YOU GO',
      playTitle: 'Start the flip-card game?',
      playText: 'You will move to the next page and begin a six-pair memory round.',
      playConfirm: 'Start Game',
      playCancel: 'Stay Here'
    },
    memory: {
      kicker: 'MEMORY FILE 06',
      title: 'Me &amp; My<br> Friends',
      titleAria: 'Me & My Friends',
      matches: 'Matches',
      moves: 'Moves',
      backAria: 'Back to Skills and Learning',
      resetAria: 'Shuffle and restart',
      boardAria: 'Me and my friends memory card game',
      boardHeaderA: 'PAIR THE STAMPS',
      boardHeaderB: '12 CARDS',
      crew: 'MEMORY CREW',
      note: 'Little moments,<br>kept together.',
      completeTitle: 'All memories found',
      playAgain: 'Play Again'
    },
    easter: {
      left: 'SHATTER THE<br>LABELS.',
      right: 'BEYOND<br>DEFINITION.',
      pullHint: 'Pull the chain to bring back the light'
    },
    showcase: {
      kicker: 'AI VIDEO',
      title: 'SHOWCASE',
      closeAria: 'Close AI Video Production showcase',
      videoAria: 'AI Video Production video',
      playAria: 'Play video',
      pauseAria: 'Pause video',
      emptyTitle: 'AI Video Production',
      emptyText: 'Video source pending',
      buffering: 'Buffering video...',
      couldNotLoad: 'Video could not be loaded',
      meta: 'AI-assisted storytelling',
      statusReadyToLoad: 'READY TO LOAD',
      statusPreloading: 'PRELOADING',
      statusPlayable: 'PLAYABLE',
      statusReady: 'READY',
      statusControls: 'USE VIDEO CONTROLS',
      statusCheckSource: 'CHECK SOURCE'
    },
    confirm: {
      kicker: 'BEFORE YOU GO',
      title: 'Continue?',
      text: 'Choose whether to continue.',
      cancel: 'Not Now',
      submit: 'Continue'
    },
    resume: {
      title: 'Download Resume',
      subtitle: 'Choose your preferred language',
      closeAria: 'Close',
      downloadCn: 'PDF · Download',
      downloadEn: 'PDF · Download'
    }
  },
  zh: {
    languageGate: {
      kicker: '欢迎档案',
      title: '选择网站语言',
      text: '你选择语言的时候，我会先把图片、模型和视频悄悄准备好。',
      loading: '正在预加载图片、模型和视频...'
    },
    tools: { language: 'English', resume: '简历', expand: '展开快捷按钮', collapse: '收起快捷按钮' },
    nav: {
      home: '首页',
      homeTitle: '回到首页',
      about: '关于我',
      internship: '实习经历',
      projects: '项目展示',
      skills: '技能与学习',
      friends: '我和朋友们'
    },
    home: {
      subtitle: '建造者 · 造梦者 · 勇敢者',
      interactHint: '点击人物进行互动',
      easterHint: '撕碎所有标签解锁彩蛋',
      loading: '加载中',
      modelPreparing: '正在准备 3D 人物...',
      modelLoading: '正在加载 3D 人物...',
      modelRetrying: '正在重试加载 3D 人物...',
      modelReady: '3D 人物已准备好',
      modelStillLoading: '3D 人物仍在加载中...',
      modelStatic: '静态人物预览',
      tagPmo: 'PMO',
      tagEnfp: 'ENFP',
      tagMetaverse: '元宇宙',
      tagCommunicator: '跨团队沟通',
      tagAi: 'AI 爱好者',
      tagLearner: '快速学习',
      tagCreative: '创意表达',
      tagExecution: '执行力强',
      tagData: '数据驱动',
      tagCs: '计算机背景',
      footer: '勇气比能力更重要'
    },
    about: { title: '关于我', timeline: '时间线' },
    internship: {
      title: '实习旅程',
      subtitle: '三段实践章节',
      cardKicker: '实习',
      viewDetails: '查看详情',
      back: '返回旅程',
      responsibilities: '主要职责',
      methods: '工具与方法',
      highlights: '亮点成果'
    },
    projects: {
      title: '项目展示',
      tagline: '点击发光小球查看具体项目。',
      sceneAria: '可互动的项目小球场',
      file: '项目档案',
      closeAria: '关闭项目详情',
      highlights: '项目亮点',
      techStack: '技术栈',
      status: '状态',
      openAriaPrefix: '打开',
      openAriaSuffix: '项目详情',
      illuminated: '发光项目'
    },
    skills: {
      kicker: '能力卡组 09',
      titleA: '技能',
      titleB: '与学习',
      tagline: '在实践中建立，在好奇里扩展。',
      countsAria: '卡组内容',
      countSkills: '技能',
      countLearning: '学习',
      countPlay: '游戏',
      boardSkill: '技能',
      boardLearning: '学习 / 游戏',
      gridAria: '技能与学习翻牌卡片',
      crew: '好奇小队',
      note: '保持学习。<br>保持玩心。',
      reveal: '翻开',
      hide: '收起',
      videoKicker: '视频展示',
      videoTitle: '打开 AI Video 展示窗口吗？',
      videoText: '这会打开一个可移动的视频窗口，并带有声音控制。',
      videoConfirm: '打开视频',
      videoCancel: '暂时不要',
      playKicker: '出发之前',
      playTitle: '开始翻牌游戏吗？',
      playText: '你会移动到下一屏，开始一轮六组配对的记忆游戏。',
      playConfirm: '开始游戏',
      playCancel: '留在这里'
    },
    memory: {
      kicker: '回忆档案 06',
      title: '我和<br>朋友们',
      titleAria: '我和朋友们',
      matches: '配对',
      moves: '步数',
      backAria: '返回技能与学习',
      resetAria: '重新洗牌开始',
      boardAria: '我和朋友们的记忆翻牌游戏',
      boardHeaderA: '配对这些印章',
      boardHeaderB: '12 张卡片',
      crew: '回忆小队',
      note: '小小瞬间，<br>一起收藏。',
      completeTitle: '全部回忆已找到',
      playAgain: '再玩一次'
    },
    easter: {
      left: '撕碎<br>标签。',
      right: '超越<br>定义。',
      pullHint: '拉动开关，把光带回来'
    },
    showcase: {
      kicker: 'AI 视频',
      title: '展示',
      closeAria: '关闭 AI Video Production 展示窗口',
      videoAria: 'AI Video Production 视频',
      playAria: '播放视频',
      pauseAria: '暂停视频',
      emptyTitle: 'AI Video Production',
      emptyText: '视频资源待加载',
      buffering: '正在缓冲视频...',
      couldNotLoad: '视频加载失败',
      meta: 'AI 辅助叙事',
      statusReadyToLoad: '准备加载',
      statusPreloading: '预加载中',
      statusPlayable: '可播放',
      statusReady: '已就绪',
      statusControls: '请使用视频控件',
      statusCheckSource: '检查资源'
    },
    confirm: {
      kicker: '出发之前',
      title: '继续吗？',
      text: '请选择是否继续。',
      cancel: '暂时不要',
      submit: '继续'
    },
    resume: {
      title: '下载简历',
      subtitle: '请选择你想下载的语言版本',
      closeAria: '关闭',
      downloadCn: 'PDF · 下载',
      downloadEn: 'PDF · Download'
    }
  }
};

const ABOUT_TRANSLATIONS = {
  zh: {
    'base-info': {
      period: '2003 年 2 月',
      location: '福建泉州',
      category: '基础信息',
      title: '基础信息',
      tags: ['enfp', '软妹', '00 后', '创作者', '学习者', { label: '电话', value: '183 5056 5182' }, { label: '微信', value: 'kunan0226' }, { label: '邮箱', value: 'kunan0226@163.com' }],
      action: '简历'
    },
    huaqiao: {
      period: '2020 年 9 月 - 2024 年 6 月',
      location: '福建厦门',
      category: '教育经历',
      title: '华侨大学',
      tags: ['GPA 前 10%', '一等奖学金', 'IELTS 6.5', 'CET-6', '班级生活委员', '桑梓微助理', '植物艺术社负责人']
    },
    keendata: {
      period: '2025 年 4 月 - 2025 年 8 月',
      location: '广东深圳',
      category: '实习经历',
      title: 'Keendata',
      subtitle: '项目管理实习生',
      tags: ['大数据平台', '问题跟踪', '需求管理', '定制化交付'],
      action: '查看详情'
    },
    polyu: {
      period: '2025 年 9 月',
      location: '香港红磡',
      category: '教育经历',
      title: '香港理工大学',
      tags: ['QS 前 50', '元宇宙', 'GPA 前 10%']
    },
    xgrids: {
      period: '2026 年 1 月 - 2026 年 5 月',
      location: '广东深圳',
      category: '实习经历',
      title: 'XGRIDS',
      subtitle: '项目管理实习生',
      tags: ['软件交付', '3D 重建', '空间计算'],
      action: '查看详情'
    },
    chery: {
      period: '2026 年 5 月 - 至今',
      location: '安徽芜湖',
      category: '实习经历',
      title: '奇瑞',
      subtitle: '智能驾驶项目管理实习生',
      tags: ['智能驾驶', 'ADSD', 'Jira 治理', '质量管理', 'Robotaxi'],
      action: '查看详情'
    }
  }
};

const INTERNSHIP_TRANSLATIONS = {
  zh: {
    keendata: {
      role: '数据开发实习生',
      period: '2025 年 4 月 - 2025 年 8 月',
      location: '广东深圳',
      summary: '支持大数据平台开发、系统部署和项目交付流程，把软件工程实践与跨团队协作结合起来。',
      tags: ['大数据', 'Java 开发', 'Hadoop', 'Bug 管理'],
      responsibilities: [
        '协助 Hadoop 集群部署与环境配置，梳理部署流程并沉淀技术文档',
        '开发 Java 内部通知模块，完成实现、测试与验证，支撑系统通信需求',
        '跟踪 20+ 个系统级问题，协调 Bug 验证、打包、部署与发布流程',
        '与技术团队协作排查系统问题，维护问题记录并推动缺陷闭环'
      ],
      methods: ['Java 后端模块开发', 'Hadoop 集群部署与环境配置', 'Bug 跟踪、排查与发布验证', '技术文档与流程标准化', '跨团队沟通与进度跟踪'],
      highlights: ['完成 Java 通知模块从开发到验证的交付', '沉淀标准化部署文档，提高环境搭建和知识转移效率', '支持 20+ 个系统级问题闭环，提升交付质量']
    },
    xgrids: {
      role: '项目管理实习生',
      period: '2026 年 1 月 - 2026 年 5 月',
      location: '广东深圳',
      summary: '支持 3D 重建软硬件一体产品的敏捷交付、AI 流程优化与产品迭代。',
      tags: ['敏捷交付', 'AI 自动化', '3D 重建', '项目管理'],
      responsibilities: [
        '支持 3D 重建手持扫描产品的软件硬件一体化迭代与交付管理，跟踪需求、进度和发布节点',
        '协调研发、产品、算法、硬件、测试等团队，保障产品生命周期中的信息对齐',
        '管理 30+ 个核心需求，支持需求评审、优先级排序、排期、测试与发布',
        '进行 Bug 跟踪分析与缺陷管理，通过数据洞察提升团队流程效率',
        '使用 AI 工具探索风险提醒、自动排期和项目状态管理等智能化方案'
      ],
      methods: ['敏捷/Scrum 迭代规划与里程碑跟踪', 'Jira backlog 与需求生命周期管理', '产品、工程和测试跨团队协作', 'Bug 分析、优先级排序与缺陷生命周期管理', 'AI 辅助流程优化与自动化探索'],
      highlights: ['协调 5 个跨职能团队，支持软硬件一体产品端到端交付', '跟踪管理 30+ 个需求，提升需求可见性与交付协同', '应用 AI 工具和数据分析优化 Bug 管理流程', '支持 SOP 优化，提升研发协作效率']
    },
    chery: {
      company: '奇瑞',
      role: '智能驾驶项目管理实习生',
      period: '2026 年 5 月 - 至今',
      location: '安徽芜湖',
      summary: '支持 Robotaxi 项目交付、跨团队协同和智能驾驶开发中的 PMO 流程优化。',
      tags: ['智能驾驶', 'PMO', 'Jira 管理', '项目协同'],
      responsibilities: [
        '支持 Robotaxi 智能驾驶项目规划与执行管理，跟踪开发里程碑、排期与交付进度',
        '协调研发、测试和工程团队沟通，组织项目会议、跟进待办事项并推动跨团队对齐',
        '管理 Jira 问题生命周期，包括需求跟踪、缺陷跟进和流程监控，提升问题可见性与解决效率',
        '与质量团队协作优化 Bug 跟踪流程，建立提醒机制，支持问题闭环管理',
        '协助项目资源管理，包括车辆资源、测试资源协调和部分成本跟踪'
      ],
      methods: ['Jira 流程管理与问题生命周期跟踪', '项目排期管理与里程碑跟踪', '跨职能沟通与会议协调', '资源跟踪与风险识别', '提升项目透明度和自动提醒的数字化工具'],
      highlights: ['支持 Robotaxi 智能驾驶项目交付管理，提升开发进度和关键里程碑可见性', '建立 Jira 问题跟踪与提醒机制，提升逾期问题管理和升级效率', '维护车辆、测试与交付准备相关资源跟踪流程', '通过标准化汇报和跨团队协作提升 PMO 效率']
    }
  }
};

const PROJECT_TRANSLATIONS = {
  zh: {
    robotaxi: {
      title: 'Robotaxi 智能驾驶',
      category: '技术',
      summary: '自研 L4 Robotaxi 智能驾驶系统概念占位。',
      description: '未来 L4 Robotaxi 智能驾驶项目占位，等待补充详细内容。',
      tags: ['智能驾驶', 'Robotaxi', 'VLA 模型', 'Jira', 'PMO']
    },
    'ai-pm': {
      title: 'AI 驱动的项目管理平台',
      sceneTitle: 'AI 项目管理',
      category: '产品设计',
      tagline: '用于提升项目可见性与执行效率的智能工作流系统',
      summary: '设计轻量级 AI 项目管理平台，解决排期可见性不足、流程复杂和跨 PM、开发、测试、UI 团队协作低效的问题。',
      role: '产品经理 / AI 方案设计',
      description: '设计轻量级 AI 项目管理平台，解决排期可见性不足、流程复杂和跨 PM、开发、测试、UI 团队协作低效的问题。',
      status: 'MVP 开发与测试阶段',
      techStack: ['AI Agent', '产品设计', 'PMO', '工作流自动化'],
      tags: ['AI Agent', '产品设计', 'PMO', '工作流自动化'],
      highlights: [
        '访谈 17 位研发成员，将协作痛点转化为产品需求和 MVP 路线图',
        '设计连接需求、任务和 Bug 的核心数据模型，并规划三级权限体系',
        '提出项目健康度、可拖拽任务看板、阻塞提醒和逾期自动升级等智能工作流机制',
        '设计风险预测、排期辅助、延迟识别通知、自动项目报告和复盘等 AI Agent 场景'
      ]
    },
    metafit: {
      title: 'MetaFit - AI 时尚推荐与虚拟试穿',
      sceneTitle: 'MetaFit 虚拟试穿',
      category: '产品设计',
      tagline: '结合 LLM 推荐与 AIGC 虚拟试穿，提升个性化购物体验',
      summary: '开发端到端智能时尚系统，集成 LLM 推荐和 AIGC 虚拟试穿，提升线上购物个性化和用户体验。',
      role: '项目负责人 / AI 产品设计',
      description: '开发端到端智能时尚系统，集成 LLM 推荐和 AIGC 虚拟试穿，提升线上购物个性化和用户体验。',
      status: 'MVP 开发与集成测试',
      techStack: ['LLM', 'RAG', 'AIGC', '计算机视觉', 'Prompt Engineering'],
      tags: ['LLM', 'RAG', 'AIGC', '计算机视觉', 'Prompt Engineering'],
      highlights: [
        '参与系统架构设计，构建完整流程：用户意图 -> RAG 推荐 -> AIGC 虚拟试穿',
        '定义 MVP 功能并协调前后端模块开发进度',
        '设计并优化覆盖品类、材质、风格和版型偏好的结构化提示词',
        '通过 Bad Case 分析推荐偏差和生成失败，提升提示词鲁棒性',
        '协调集成测试并收集用户反馈，指导后续迭代'
      ]
    },
    'metaverse-classroom': { title: '元宇宙课堂（即将更新）', category: '创意', summary: '正在探索中的虚拟现实课堂体验。', description: '元宇宙课堂产品概念探索，结合实时 3D 环境与协作学习流程，目前处于早期构思阶段。', tags: ['元宇宙', 'VR', '教育科技'] },
    'ar-showroom': { title: 'AR 展厅（即将更新）', category: '创意', summary: '正在探索中的增强现实产品展厅。', description: '基于增强现实的产品展厅概念，探索沉浸式品牌体验、移动端兼容和 3D 资产流程。', tags: ['AR', '3D', '品牌'] },
    'ai-research': { title: 'AI 研究实验室（即将更新）', category: '技术', summary: '探索 AI 驱动产品创新的研究项目。', description: '围绕真实产品场景探索 AI 能力，包括 LLM 集成、提示词工程和应用型机器学习。', tags: ['AI', 'LLM', '研究'] },
    'iot-garden': { title: 'IoT 智能花园（即将更新）', category: '技术', summary: '早期设计中的 IoT 智能园艺系统。', description: '基于 IoT 的智能花园概念，整合土壤传感器、自动浇水和移动端看板。', tags: ['IoT', '硬件', '传感器'] },
    'data-viz': { title: '数据可视化（即将更新）', category: '创意', summary: '设计中的交互式数据可视化工具。', description: 'Web 数据可视化平台概念，探索交互图表、实时数据流和审美化叙事。', tags: ['数据可视化', 'D3', '叙事'] }
  }
};

const SKILL_TRANSLATIONS = {
  zh: {
    0: { faceLabel: '技能 01', backLabel: '技能', title: 'Scrum', description: '围绕冲刺规划、每日同步、评审和复盘建立交付节奏。' },
    1: { faceLabel: '技能 02', backLabel: '展示技能', title: 'AI Video 制作', description: '通过提示词构建分镜、生成视觉、剪辑并完成叙事组装。' },
    2: { faceLabel: '学习 01', backLabel: '学习', title: '产品策略', description: '连接市场信号、用户价值和业务取舍。' },
    3: { faceLabel: '技能 03', backLabel: '技能', title: '项目管理', description: '把模糊目标拆成负责人、里程碑、风险和决策。' },
    4: { faceLabel: '技能 04', backLabel: '技能', title: '跨职能协作', description: '让产品、设计、工程和利益相关方保持对齐。' },
    5: { faceLabel: '学习 02', backLabel: '学习', title: '生成式 AI 工作流', description: '测试 Agent、多模态工具和可复用的 AI 辅助系统。' },
    6: { faceLabel: '技能 05', backLabel: '技能', title: '数据分析', description: '用指标、问题模式和交付信号辅助更清晰的判断。' },
    7: { faceLabel: '技能 06', backLabel: '技能', title: '3D 与空间计算', description: '接触 3D 重建、SLAM 和数字孪生相关工作流。' },
    8: { faceLabel: '游戏', backLabel: '记忆游戏', title: '我和朋友们', description: '六组人物、地点和小小冒险的配对记忆。' }
  }
};

const WARMUP_ASSETS = [
  'assets/home/character-fallback.webp',
  'assets/home/character.glb',
  'assets/about/profile.webp',
  'assets/about/huaqiao.webp',
  'assets/about/keendata.webp',
  'assets/about/polyu.webp',
  'assets/about/xgrids.webp',
  'assets/about/chery.webp',
  'assets/internship/keendata.webp',
  'assets/internship/xgrids.webp',
  'assets/internship/chery.webp',
  'assets/projects/chiikawa-spring.webp',
  'assets/play/companion.webp',
  'assets/play/pair-01-a.webp',
  'assets/play/pair-01-b.webp',
  'assets/play/pair-02-a.webp',
  'assets/play/pair-02-b.webp',
  'assets/play/pair-03-a.webp',
  'assets/play/pair-03-b.webp',
  'assets/play/pair-04-a.webp',
  'assets/play/pair-04-b.webp',
  'assets/play/pair-05-a.webp',
  'assets/play/pair-05-b.webp',
  'assets/play/pair-06-a.webp',
  'assets/play/pair-06-b.webp'
];

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE;
let warmupStarted = false;

function t(key, lang) {
  var source = I18N[lang || currentLanguage] || I18N[DEFAULT_LANGUAGE];
  return key.split('.').reduce(function (value, part) {
    return value && Object.prototype.hasOwnProperty.call(value, part) ? value[part] : undefined;
  }, source) ?? key;
}

function getLocalized(base, translations, id) {
  var localized = translations[currentLanguage] && translations[currentLanguage][id];
  return localized ? Object.assign({}, base, localized) : base;
}

function updateTearText(el, value) {
  var wrap = el.closest('.nav-tear-wrap');
  el.textContent = value;
  el.dataset.text = value;
  if (!wrap) return;
  wrap.querySelectorAll('.nav-tear-half').forEach(function (half) {
    half.textContent = value;
  });
}

function updateTagText(el, value) {
  var inner = el.querySelector('.tag-inner');
  if (!inner) {
    el.textContent = value;
    return;
  }
  inner.querySelectorAll('.tag-orig,.tag-shard').forEach(function (part) {
    part.textContent = value;
  });
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var value = t(el.dataset.i18n);
    if (el.classList.contains('nav-item')) updateTearText(el, value);
    else if (el.classList.contains('tag')) updateTagText(el, value);
    else el.textContent = value;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
    el.setAttribute('title', t(el.dataset.i18nTitle));
  });
  var dock = document.getElementById('floatingTools');
  var handle = document.getElementById('floatingToolsHandle');
  var collapsed = dock && dock.dataset.collapsed === 'true';
  if (handle) {
    handle.setAttribute('aria-label', collapsed ? t('tools.expand') : t('tools.collapse'));
    handle.setAttribute('title', collapsed ? t('tools.expand') : t('tools.collapse'));
  }
}

function startWarmupResources() {
  if (warmupStarted) return;
  warmupStarted = true;
  WARMUP_ASSETS.forEach(function (src, index) {
    window.setTimeout(function () {
      if (src.endsWith('.glb')) {
        var link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'fetch';
        link.href = src;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        return;
      }
      var image = new Image();
      image.decoding = 'async';
      image.loading = 'eager';
      image.src = src;
    }, index < 6 ? 0 : index * 35);
  });
  window.setTimeout(function () {
    var source = document.getElementById('skillShowcaseWindow')?.dataset.videoSrc;
    if (!source) return;
    var video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.src = source;
    video.load();
  }, 600);
}

function setLanguage(nextLanguage, options) {
  if (!I18N[nextLanguage]) nextLanguage = DEFAULT_LANGUAGE;
  currentLanguage = nextLanguage;
  if (!options || options.persist !== false) localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  applyStaticTranslations();
  if (typeof refreshAboutLanguage === 'function') refreshAboutLanguage();
  if (typeof refreshInternshipLanguage === 'function') refreshInternshipLanguage();
  if (typeof refreshProjectsLanguage === 'function') refreshProjectsLanguage();
  if (typeof refreshSkillsLanguage === 'function') refreshSkillsLanguage();
  window.dispatchEvent(new CustomEvent('cv-language-change', { detail: { language: currentLanguage } }));
  if (window.lucide) window.lucide.createIcons();
}

function initLanguageGateAndTools() {
  var storedLanguage = localStorage.getItem(LANGUAGE_KEY);
  var gate = document.getElementById('languageGate');
  var dock = document.getElementById('floatingTools');
  var handle = document.getElementById('floatingToolsHandle');
  var collapseButton = document.getElementById('floatingToolsCollapse');
  var languageButton = document.getElementById('languageToggleBtn');
  var resumeButton = document.getElementById('resumeToolBtn');

  startWarmupResources();
  if (gate && !storedLanguage) {
    gate.classList.add('is-open');
    gate.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(function () { gate.querySelector('[data-language-choice="en"]')?.focus(); });
  } else {
    document.documentElement.dataset.languageReady = 'true';
  }

  document.querySelectorAll('[data-language-choice]').forEach(function (button) {
    button.addEventListener('click', function () {
      setLanguage(button.dataset.languageChoice || DEFAULT_LANGUAGE);
      if (gate) {
        gate.classList.remove('is-open');
        gate.setAttribute('aria-hidden', 'true');
      }
      document.documentElement.dataset.languageReady = 'true';
    });
  });

  if (languageButton) {
    languageButton.addEventListener('click', function () {
      setLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
    });
  }
  if (resumeButton) {
    resumeButton.addEventListener('click', function () {
      var overlay = document.getElementById('resumeDialogOverlay');
      if (overlay) overlay.classList.add('is-open');
      if (window.lucide) window.lucide.createIcons();
    });
  }
  function setDockCollapsed(collapsed) {
    if (!dock) return;
    dock.dataset.collapsed = collapsed ? 'true' : 'false';
    applyStaticTranslations();
  }
  if (handle) handle.addEventListener('click', function () { setDockCollapsed(!(dock && dock.dataset.collapsed === 'true')); });
  if (collapseButton) collapseButton.addEventListener('click', function () { setDockCollapsed(true); });
}

setLanguage(currentLanguage, { persist: false });
initLanguageGateAndTools();

// ============================================================
//  导航栏「撕碎」效果
// ============================================================

(function initTearEffect() {
  const navLinks = document.querySelectorAll('.nav-item');

  navLinks.forEach(link => {
    // 跳过已处理
    if (link.parentElement.classList.contains('nav-tear-wrap')) return;

    const text = link.textContent;

    // 创建包裹层
    const wrap = document.createElement('span');
    wrap.className = 'nav-tear-wrap';

    // 把 <a> 移入包裹层
    link.parentElement.insertBefore(wrap, link);
    wrap.appendChild(link);
    link.classList.add('nav-tear-original');

    // 上半撕裂层
    const topHalf = document.createElement('span');
    topHalf.className = 'nav-tear-half nav-tear-top';
    topHalf.setAttribute('aria-hidden', 'true');
    topHalf.textContent = text;
    wrap.appendChild(topHalf);

    // 下半撕裂层
    const bottomHalf = document.createElement('span');
    bottomHalf.className = 'nav-tear-half nav-tear-bottom';
    bottomHalf.setAttribute('aria-hidden', 'true');
    bottomHalf.textContent = text;
    wrap.appendChild(bottomHalf);
  });
})();

// ---- 导航点击：平滑滚动到对应分区 ----
(function initNavClicks() {
  document.querySelectorAll('.nav-item').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.dataset.section;
      if (!targetId) return; // 未绑定分区的标签保持默认行为（#）

      e.preventDefault();
      var target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // HOME 图标点击：回到首页
  var homeBtn = document.getElementById('navHome');
  if (homeBtn) {
    homeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var home = document.getElementById('home');
      if (home) {
        home.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
})();


// ============================================================
//  标签「撕碎」— 点击撕裂，碎片消失
// ============================================================

(function initTagTearEffect() {
  const tags = document.querySelectorAll('.character-tags .tag');
  let tornCount = 0;
  const totalTags = tags.length;

  tags.forEach(tag => {
    if (tag.querySelector('.tag-inner')) return;

    const text = tag.textContent;
    const inner = document.createElement('span');
    inner.className = 'tag-inner';

    // 原始文字
    const orig = document.createElement('span');
    orig.className = 'tag-orig';
    orig.textContent = text;
    inner.appendChild(orig);

    // 左碎片
    const left = document.createElement('span');
    left.className = 'tag-shard shard-L';
    left.textContent = text;
    inner.appendChild(left);

    // 右碎片
    const right = document.createElement('span');
    right.className = 'tag-shard shard-R';
    right.textContent = text;
    inner.appendChild(right);

    tag.textContent = '';
    tag.appendChild(inner);

    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      if (inner.classList.contains('torn')) return;
      inner.classList.add('tearing', 'torn');
      // 动画播完后从布局中移除，防止暗黑模式切换后重现
      setTimeout(function () { tag.style.display = 'none'; }, 650);

      // 彩蛋计数器
      tornCount++;
      if (tornCount === totalTags) {
        // 隐藏提示文字
        const hint = document.getElementById('easterEggHint');
        if (hint) hint.classList.add('all-torn');
        // 触发彩蛋倒计时
        setTimeout(() => triggerEasterEgg(), 500);
      }
    });
  });

  // 暴露计数和重置（供调试 + 开灯后重置）
  window.__tornCount = () => tornCount;
  window.__resetAllTags = function () {
    tornCount = 0;
    tags.forEach(function (tag) {
      tag.style.display = '';
      var inner = tag.querySelector('.tag-inner');
      if (inner) {
        inner.classList.remove('tearing', 'torn');
      }
    });
    var hint = document.getElementById('easterEggHint');
    if (hint) hint.classList.remove('all-torn');
  };
})();


// ============================================================
//  Three.js 3D 人物
// ============================================================

(function initThreeJSCharacter() {
  const container = document.getElementById('characterContainer');
  const canvas = document.getElementById('threeCanvas');
  const fallbackImage = document.getElementById('characterFallbackImage');
  const interactHint = document.getElementById('interactHint');
  const easterEggHint = document.getElementById('easterEggHint');
  if (!container || !canvas) return;

  function revealFallbackImage() {
    if (!fallbackImage) return;
    if (!fallbackImage.getAttribute('src') && fallbackImage.dataset.src) {
      fallbackImage.src = fallbackImage.dataset.src;
    }
    fallbackImage.classList.add('is-visible');
  }

  // ---- Scene / Camera / Renderer ----
  const scene = new THREE.Scene();

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (error) {
    const spinner = document.getElementById('loadingSpinner');
    const modelStatus = document.getElementById('modelStatus');
    if (spinner) spinner.classList.add('is-hidden');
    canvas.classList.add('is-hidden');
    revealFallbackImage();
    if (interactHint) interactHint.classList.add('is-hidden');
    if (easterEggHint) easterEggHint.classList.add('is-hidden');
    if (modelStatus) {
      modelStatus.textContent = t('home.modelStatic');
      modelStatus.classList.add('is-hidden');
    }
    window.__threeCharacter = {
      unavailable: true,
      reason: 'webgl-unavailable',
    };
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.86;

  // 透视相机：与人眼接近
  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 50);
  camera.position.set(0, 0.15, 7.2);
  camera.lookAt(0, -0.15, 0);

  // ---- 光照 ----
  // 环境光
  const ambient = new THREE.AmbientLight('#f8f4fc', 1.55);
  scene.add(ambient);

  // 主方向光（模拟柔光）
  const keyLight = new THREE.DirectionalLight('#ffffff', 2.35);
  keyLight.position.set(3, 2, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(512, 512);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 20;
  scene.add(keyLight);

  // 补光
  const fillLight = new THREE.DirectionalLight('#e8ddf5', 1.25);
  fillLight.position.set(-2, 1, 1);
  scene.add(fillLight);

  // 底部柔光
  const rimLight = new THREE.DirectionalLight('#f0d8e0', 0.9);
  rimLight.position.set(0, -1, 2);
  scene.add(rimLight);

  function setEasterLighting(isActive) {
    ambient.intensity = isActive ? 1.8 : 1.55;
    fillLight.color.set(isActive ? '#d8c2ff' : '#e8ddf5');
    fillLight.intensity = isActive ? 1.6 : 1.25;
    rimLight.color.set(isActive ? '#b98cff' : '#f0d8e0');
    rimLight.intensity = isActive ? 2.7 : 0.9;
    renderer.toneMappingExposure = isActive ? 1.02 : 0.86;
  }

  // ---- 材质工厂 ----
  const skinMat = new THREE.MeshStandardMaterial({
    color: '#f2c4b0',
    roughness: 0.55,
    metalness: 0.02,
  });

  const skinDarkMat = new THREE.MeshStandardMaterial({
    color: '#e8b098',
    roughness: 0.55,
    metalness: 0.02,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: '#1a0a0a',
    roughness: 0.7,
    metalness: 0.05,
  });

  const scleraMat = new THREE.MeshStandardMaterial({
    color: '#fefefe',
    roughness: 0.15,
    metalness: 0.05,
  });

  const pupilMat = new THREE.MeshStandardMaterial({
    color: '#0d0d1a',
    roughness: 0.1,
    metalness: 0.1,
  });

  const clothesMat = new THREE.MeshStandardMaterial({
    color: '#aeb0b8',
    roughness: 0.72,
    metalness: 0.02,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: '#f4f1f5',
    roughness: 0.65,
    metalness: 0.05,
  });

  const shirtMat = new THREE.MeshStandardMaterial({
    color: '#fbfafc',
    roughness: 0.72,
  });

  const denimMat = new THREE.MeshStandardMaterial({
    color: '#8faed2',
    roughness: 0.74,
  });

  const shoeMat = new THREE.MeshStandardMaterial({
    color: '#f7f5f4',
    roughness: 0.62,
  });

  const clipMat = new THREE.MeshStandardMaterial({
    color: '#ff7a22',
    roughness: 0.38,
  });

  // ---- 构建人物 ----
  const character = new THREE.Group();
  const bodyParts = {};   // 记录各部位，用于点击检测
  character.position.y = 0.68;
  character.scale.setScalar(0.84);

  // 颈部
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.2, 0.25, 24),
    skinDarkMat
  );
  neck.position.y = 0.5;
  neck.castShadow = true;
  character.add(neck);

  // 躯干（上半身）
  const torsoGeo = new THREE.CapsuleGeometry(0.46, 0.58, 10, 24);
  const torso = new THREE.Mesh(torsoGeo, clothesMat);
  torso.position.y = -0.02;
  torso.scale.set(0.92, 1, 0.68);
  torso.castShadow = true;
  torso.name = 'body';
  bodyParts.body = torso;
  bodyParts.stomach = torso;
  character.add(torso);

  // 白色内搭
  const shirt = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.31, 0.42, 8, 20),
    shirtMat
  );
  shirt.position.set(0, -0.04, 0.31);
  shirt.scale.set(0.72, 0.94, 0.2);
  character.add(shirt);

  // 外套左右前襟
  for (const side of [-1, 1]) {
    const jacketPanel = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.18, 0.48, 8, 18),
      clothesMat
    );
    jacketPanel.position.set(side * 0.3, -0.03, 0.3);
    jacketPanel.scale.set(0.82, 1, 0.2);
    jacketPanel.rotation.z = side * -0.035;
    jacketPanel.castShadow = true;
    character.add(jacketPanel);
  }

  const zipper = new THREE.Mesh(
    new THREE.BoxGeometry(0.026, 0.75, 0.025),
    new THREE.MeshStandardMaterial({ color: '#d8d8dd', roughness: 0.42 })
  );
  zipper.position.set(0, -0.04, 0.43);
  character.add(zipper);

  function createStarGeometry(outerRadius = 0.05, innerRadius = 0.022) {
    const shape = new THREE.Shape();
    for (let index = 0; index < 10; index++) {
      const angle = -Math.PI / 2 + index * Math.PI / 5;
      const radius = index % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (index === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }

  const starMat = new THREE.MeshBasicMaterial({
    color: '#5f5b68',
    transparent: true,
    opacity: 0.76,
    side: THREE.DoubleSide,
  });
  [
    [-0.31, 0.18, 0.43, 0.15],
    [0.29, -0.13, 0.43, -0.1],
    [-0.27, -0.35, 0.42, 0.18],
  ].forEach(([x, y, z, rotation]) => {
    const star = new THREE.Mesh(createStarGeometry(), starMat);
    star.position.set(x, y, z);
    star.rotation.z = rotation;
    character.add(star);
  });

  // 肩膀
  const shoulderGeo = new THREE.SphereGeometry(0.28, 20, 16);
  const leftShoulder = new THREE.Mesh(shoulderGeo, clothesMat);
  leftShoulder.position.set(-0.53, 0.22, 0);
  leftShoulder.scale.set(0.8, 0.7, 0.6);
  leftShoulder.name = 'left-shoulder';
  character.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(shoulderGeo, clothesMat);
  rightShoulder.position.set(0.53, 0.22, 0);
  rightShoulder.scale.set(0.8, 0.7, 0.6);
  rightShoulder.name = 'right-shoulder';
  character.add(rightShoulder);

  // 毛绒衣领
  const collarGeo = new THREE.TorusGeometry(0.38, 0.105, 10, 30);
  const collar = new THREE.Mesh(collarGeo, accentMat);
  collar.position.set(0, 0.42, 0.02);
  collar.rotation.x = Math.PI * 0.5;
  collar.scale.y = 0.72;
  character.add(collar);

  const hoodBack = new THREE.Mesh(
    new THREE.TorusGeometry(0.43, 0.13, 10, 30, Math.PI * 1.25),
    accentMat
  );
  hoodBack.position.set(0, 0.44, -0.1);
  hoodBack.rotation.set(Math.PI * 0.5, 0, -Math.PI * 0.12);
  character.add(hoodBack);

  // 手臂关节
  function createArm(side) {
    const sign = side === 'left' ? -1 : 1;
    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(sign * 0.53, 0.23, 0);
    shoulderPivot.name = `${side}-shoulder`;

    const upperArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.12, 0.48, 8, 16),
      clothesMat
    );
    upperArm.position.y = -0.35;
    upperArm.castShadow = true;
    shoulderPivot.add(upperArm);

    const elbowPivot = new THREE.Group();
    elbowPivot.position.y = -0.68;
    shoulderPivot.add(elbowPivot);

    const lowerArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.105, 0.44, 8, 16),
      clothesMat
    );
    lowerArm.position.y = -0.3;
    lowerArm.castShadow = true;
    elbowPivot.add(lowerArm);

    const hand = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 18, 14),
      skinMat
    );
    hand.position.y = -0.61;
    hand.scale.set(0.82, 1.08, 0.58);
    hand.name = `${side}-hand`;
    hand.castShadow = true;
    elbowPivot.add(hand);

    character.add(shoulderPivot);
    bodyParts[`${side}-shoulder`] = shoulderPivot;
    bodyParts[`${side}-elbow`] = elbowPivot;
    bodyParts[`${side}-hand`] = hand;
    return { shoulder: shoulderPivot, elbow: elbowPivot, hand };
  }

  const leftArm = createArm('left');
  const rightArm = createArm('right');

  // 腰部和牛仔裤
  const hips = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.38, 0.24, 8, 22),
    denimMat
  );
  hips.position.y = -0.78;
  hips.scale.set(1.05, 0.85, 0.7);
  hips.name = 'hips';
  hips.castShadow = true;
  character.add(hips);
  bodyParts.hips = hips;

  function createLeg(side) {
    const sign = side === 'left' ? -1 : 1;
    const hipPivot = new THREE.Group();
    hipPivot.position.set(sign * 0.24, -0.88, 0);

    const upperLeg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.19, 0.7, 8, 18),
      denimMat
    );
    upperLeg.position.y = -0.48;
    upperLeg.castShadow = true;
    hipPivot.add(upperLeg);

    const kneePivot = new THREE.Group();
    kneePivot.position.y = -0.95;
    hipPivot.add(kneePivot);

    const lowerLeg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.17, 0.66, 8, 18),
      denimMat
    );
    lowerLeg.position.y = -0.45;
    lowerLeg.castShadow = true;
    kneePivot.add(lowerLeg);

    const foot = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.17, 0.28, 8, 18),
      shoeMat
    );
    foot.position.set(0, -0.89, 0.13);
    foot.rotation.x = Math.PI * 0.5;
    foot.scale.set(1.05, 1, 0.85);
    foot.name = `${side}-foot`;
    foot.castShadow = true;
    kneePivot.add(foot);

    character.add(hipPivot);
    bodyParts[`${side}-hip`] = hipPivot;
    bodyParts[`${side}-knee`] = kneePivot;
    bodyParts[`${side}-foot`] = foot;
    return { hip: hipPivot, knee: kneePivot, foot };
  }

  const leftLeg = createLeg('left');
  const rightLeg = createLeg('right');

  // 头部
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.02;
  headGroup.name = 'head';
  bodyParts.head = headGroup;

  // 脸
  const faceGeo = new THREE.SphereGeometry(0.35, 32, 28);
  const face = new THREE.Mesh(faceGeo, skinMat);
  face.scale.set(1, 1.08, 0.92);
  face.castShadow = true;
  headGroup.add(face);

  // 头发（后半 + 顶部）
  const hairMain = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 32, 24),
    hairMat
  );
  hairMain.position.y = 0.08;
  hairMain.position.z = -0.06;
  hairMain.scale.set(1.05, 1.1, 1.0);
  headGroup.add(hairMain);

  const hairBack = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.31, 0.7, 10, 22),
    hairMat
  );
  hairBack.position.set(0, -0.28, -0.14);
  hairBack.scale.set(1.08, 1, 0.7);
  headGroup.add(hairBack);

  // 刘海
  const bangsGeo = new THREE.SphereGeometry(0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const bangs = new THREE.Mesh(bangsGeo, hairMat);
  bangs.position.y = 0.22;
  bangs.position.z = 0.12;
  bangs.rotation.x = 0.35;
  bangs.scale.set(1.05, 0.85, 0.3);
  headGroup.add(bangs);

  // 长侧发
  for (const side of [-1, 1]) {
    const sideHair = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.13, 0.62, 8, 16),
      hairMat
    );
    sideHair.position.set(side * 0.31, -0.27, -0.02);
    sideHair.rotation.z = side * -0.08;
    sideHair.scale.set(0.72, 1.05, 0.62);
    headGroup.add(sideHair);
  }

  // 橙色发夹
  for (const offset of [0, 0.09]) {
    const clip = new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 12, 10),
      clipMat
    );
    clip.position.set(-0.31, 0.23 - offset, 0.18);
    headGroup.add(clip);
  }

  // 眼睛
  const eyesGroup = new THREE.Group();
  eyesGroup.position.y = 0.1;
  eyesGroup.position.z = 0.28;
  headGroup.add(eyesGroup);

  const eyePairs = [];
  for (const side of [-1, 1]) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.x = side * 0.12;

    // 眼白
    const sclera = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 8),
      scleraMat
    );
    sclera.scale.set(1.1, 0.7, 0.5);
    eyeGroup.add(sclera);

    // 瞳孔
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 6),
      pupilMat
    );
    pupil.position.z = 0.04;
    pupil.name = side === -1 ? 'pupil-left' : 'pupil-right';
    eyeGroup.add(pupil);
    eyePairs.push({ group: eyeGroup, pupil });

    eyesGroup.add(eyeGroup);
  }

  // 眉毛
  for (const side of [-1, 1]) {
    const browGeo = new THREE.BoxGeometry(0.1, 0.02, 0.03);
    const brow = new THREE.Mesh(browGeo, hairMat);
    brow.position.set(side * 0.12, 0.17, 0.29);
    brow.rotation.z = side * 0.08;
    headGroup.add(brow);
  }

  // 鼻子
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 6),
    skinDarkMat
  );
  nose.position.set(0, 0.05, 0.32);
  nose.scale.set(0.8, 0.6, 0.5);
  headGroup.add(nose);

  // 嘴巴
  const mouthGeo = new THREE.TorusGeometry(0.06, 0.012, 6, 10, Math.PI);
  const mouth = new THREE.Mesh(mouthGeo, new THREE.MeshStandardMaterial({
    color: '#c47060',
    roughness: 0.3,
    metalness: 0,
  }));
  mouth.position.set(0, -0.02, 0.32);
  mouth.rotation.z = Math.PI;
  mouth.rotation.y = Math.PI;
  mouth.scale.set(1.2, 0.5, 1);
  headGroup.add(mouth);

  // 腮红
  for (const side of [-1, 1]) {
    const cheek = new THREE.Mesh(
      new THREE.CircleGeometry(0.055, 16),
      new THREE.MeshBasicMaterial({
        color: '#f58fa0',
        transparent: true,
        opacity: 0.24,
      })
    );
    cheek.position.set(side * 0.22, 0.015, 0.337);
    headGroup.add(cheek);
  }

  character.add(headGroup);
  scene.add(character);
  character.visible = false;  // 加载期间隐藏简模

  // ---- 粒子装饰（角色周围淡紫微光） ----
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = 80;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.0 + Math.random() * 1.6;
    const height = (Math.random() - 0.5) * 2.2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.6 - 0.2;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({
    color: '#d4b8f0',
    size: 0.025,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // ---- 正式 GLB 模型状态 ----
  const modelStatus = document.getElementById('modelStatus');
  let activeCharacter = character;
  let activeBodyParts = bodyParts;
  let clickTargets = Object.values(bodyParts);
  let activeEyePairs = eyePairs;
  let animationMixer = null;
  let stopActiveReaction = null;
  const clock = new THREE.Clock();

  Object.values(activeBodyParts).forEach((part) => {
    part.userData.followBaseRotation = part.rotation.clone();
  });

  function updateModelStatus(message, state = '') {
    if (!modelStatus) return;
    modelStatus.textContent = message;
    modelStatus.classList.toggle('is-error', state === 'error');
    modelStatus.classList.remove('is-hidden');
  }

  function hideModelStatus(delay = 900) {
    if (!modelStatus) return;
    window.setTimeout(() => modelStatus.classList.add('is-hidden'), delay);
  }

  function findModelNode(root, patterns) {
    let match = null;
    root.traverse((node) => {
      if (match) return;
      const normalizedName = node.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (patterns.some((pattern) => pattern.test(normalizedName))) {
        match = node;
      }
    });
    return match;
  }

  function createHitProxy(group, name, geometry, position) {
    const proxy = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    proxy.position.copy(position);
    proxy.name = name;
    proxy.userData.interactionPart = name;
    proxy.renderOrder = -1;
    group.add(proxy);
    return proxy;
  }

  function buildInteractionRig(pivot, avatarRoot) {
    const mappedParts = {
      head: findModelNode(avatarRoot, [/^head$/]) || findModelNode(avatarRoot, [/neck/]) || avatarRoot,
      face: findModelNode(avatarRoot, [/^head$/]) || avatarRoot,
      body: findModelNode(avatarRoot, [/spine02/, /spine2/, /upperchest/, /chest/]) || avatarRoot,
      stomach: findModelNode(avatarRoot, [/spine01/, /spine1/, /waist/, /abdomen/, /belly/]) || avatarRoot,
      'left-shoulder': findModelNode(avatarRoot, [/^lupperarm$/, /leftupperarm/]) || findModelNode(avatarRoot, [/lclavicle/]) || avatarRoot,
      'right-shoulder': findModelNode(avatarRoot, [/^rupperarm$/, /rightupperarm/]) || findModelNode(avatarRoot, [/rclavicle/]) || avatarRoot,
      'left-elbow': findModelNode(avatarRoot, [/lforearm$/, /leftforearm/, /leftlowerarm/]) || avatarRoot,
      'right-elbow': findModelNode(avatarRoot, [/rforearm$/, /rightforearm/, /rightlowerarm/]) || avatarRoot,
      'left-hand': findModelNode(avatarRoot, [/lhand/, /lefthand/]) || avatarRoot,
      'right-hand': findModelNode(avatarRoot, [/rhand/, /righthand/]) || avatarRoot,
      hips: findModelNode(avatarRoot, [/^pelvis$/, /^hip$/, /^hips$/]) || avatarRoot,
      'left-hip': findModelNode(avatarRoot, [/lthigh$/, /leftthigh/, /leftupperleg/]) || avatarRoot,
      'right-hip': findModelNode(avatarRoot, [/rthigh$/, /rightthigh/, /rightupperleg/]) || avatarRoot,
      'left-knee': findModelNode(avatarRoot, [/lcalf$/, /leftcalf/, /leftlowerleg/, /leftshin/]) || avatarRoot,
      'right-knee': findModelNode(avatarRoot, [/rcalf$/, /rightcalf/, /rightlowerleg/, /rightshin/]) || avatarRoot,
      'left-foot': findModelNode(avatarRoot, [/lfoot/, /leftfoot/, /lefttoe/]) || avatarRoot,
      'right-foot': findModelNode(avatarRoot, [/rfoot/, /rightfoot/, /righttoe/]) || avatarRoot,
    };

    Object.values(mappedParts).forEach((part) => {
      if (!part.userData.followBaseRotation) {
        part.userData.followBaseRotation = part.rotation.clone();
      }
    });

    const hitAreaGroup = new THREE.Group();
    hitAreaGroup.name = 'interaction-hit-areas';
    pivot.add(hitAreaGroup);

    const proxies = [
      createHitProxy(hitAreaGroup, 'head', new THREE.SphereGeometry(0.28, 16, 12), new THREE.Vector3(0, 1.48, 0.18)),
      createHitProxy(hitAreaGroup, 'face', new THREE.SphereGeometry(0.22, 16, 12), new THREE.Vector3(0, 1.3, 0.35)),
      createHitProxy(hitAreaGroup, 'left-shoulder', new THREE.SphereGeometry(0.26, 14, 10), new THREE.Vector3(-0.48, 0.72, 0)),
      createHitProxy(hitAreaGroup, 'right-shoulder', new THREE.SphereGeometry(0.26, 14, 10), new THREE.Vector3(0.48, 0.72, 0)),
      createHitProxy(hitAreaGroup, 'left-hand', new THREE.SphereGeometry(0.22, 14, 10), new THREE.Vector3(-0.52, -0.05, 0.12)),
      createHitProxy(hitAreaGroup, 'right-hand', new THREE.SphereGeometry(0.22, 14, 10), new THREE.Vector3(0.52, -0.05, 0.12)),
      createHitProxy(hitAreaGroup, 'body', new THREE.BoxGeometry(0.82, 0.6, 0.52), new THREE.Vector3(0, 0.52, 0)),
      createHitProxy(hitAreaGroup, 'stomach', new THREE.SphereGeometry(0.36, 14, 10), new THREE.Vector3(0, 0.04, 0.1)),
      createHitProxy(hitAreaGroup, 'left-leg', new THREE.CapsuleGeometry(0.2, 0.62, 6, 12), new THREE.Vector3(-0.2, -0.72, 0.04)),
      createHitProxy(hitAreaGroup, 'right-leg', new THREE.CapsuleGeometry(0.2, 0.62, 6, 12), new THREE.Vector3(0.2, -0.72, 0.04)),
      createHitProxy(hitAreaGroup, 'left-foot', new THREE.SphereGeometry(0.29, 14, 10), new THREE.Vector3(-0.2, -1.5, 0.22)),
      createHitProxy(hitAreaGroup, 'right-foot', new THREE.SphereGeometry(0.29, 14, 10), new THREE.Vector3(0.2, -1.5, 0.22)),
    ];

    return { mappedParts, proxies };
  }

  function fitAvatarToFullBody(avatarRoot) {
    avatarRoot.scale.setScalar(3.5);
    avatarRoot.rotation.y = -Math.PI * 0.5;
    avatarRoot.position.set(0, -1.75, 0);
  }

  function loadProductionAvatar(attempt = 1) {
    const loader = new GLTFLoader();
    // Draco 解压支持
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./js/vendor/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    updateModelStatus(attempt === 1 ? t('home.modelLoading') : t('home.modelRetrying'));

    loader.load(
      'assets/home/character.glb',
      (gltf) => {
        if (fallbackImage) fallbackImage.classList.remove('is-visible');
        canvas.classList.remove('is-hidden');
        if (interactHint) interactHint.classList.remove('is-hidden');
        if (easterEggHint) easterEggHint.classList.remove('is-hidden');

        const pivot = new THREE.Group();
        pivot.name = 'yenan-avatar-pivot';

        const avatarRoot = gltf.scene;
        avatarRoot.name = avatarRoot.name || 'yenan-avatar';
        fitAvatarToFullBody(avatarRoot);
        avatarRoot.traverse((node) => {
          if (!node.isMesh) return;
          node.castShadow = true;
          node.receiveShadow = true;
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.filter(Boolean).forEach((material) => {
            material.transparent = false;
            material.needsUpdate = true;
          });
        });

        pivot.add(avatarRoot);
        scene.add(pivot);

        const rig = buildInteractionRig(pivot, avatarRoot);
        activeCharacter = pivot;
        activeBodyParts = rig.mappedParts;
        clickTargets = rig.proxies;
        activeEyePairs = [];

        if (gltf.animations.length > 0) {
          animationMixer = new THREE.AnimationMixer(avatarRoot);
          const idleClip = gltf.animations.find((clip) => /idle/i.test(clip.name)) || gltf.animations[0];
          animationMixer.clipAction(idleClip).play();
        }

        character.visible = false;
        updateModelStatus(t('home.modelReady'));
        hideModelStatus();
        // 隐藏 loading spinner
        var spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.add('is-hidden');
      },
      undefined,
      () => {
        dracoLoader.dispose();

        if (attempt < 3) {
          window.setTimeout(() => loadProductionAvatar(attempt + 1), 1200);
          return;
        }

        // 连续加载失败后展示与正式角色一致的静态正面图。
        character.visible = false;
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.add('is-hidden');
        canvas.classList.add('is-hidden');
        revealFallbackImage();
        if (interactHint) interactHint.classList.add('is-hidden');
        if (easterEggHint) easterEggHint.classList.add('is-hidden');
        updateModelStatus(t('home.modelStatic'));
        hideModelStatus(0);
      }
    );
  }

  function buildFallbackHitRig() {
    const hitAreaGroup = new THREE.Group();
    hitAreaGroup.name = 'fallback-interaction-hit-areas';
    character.add(hitAreaGroup);

    return [
      createHitProxy(hitAreaGroup, 'head', new THREE.SphereGeometry(0.28, 16, 12), new THREE.Vector3(0, 1.34, 0.24)),
      createHitProxy(hitAreaGroup, 'face', new THREE.SphereGeometry(0.22, 16, 12), new THREE.Vector3(0, 1.0, 0.4)),
      createHitProxy(hitAreaGroup, 'left-shoulder', new THREE.SphereGeometry(0.28, 14, 10), new THREE.Vector3(-0.54, 0.22, 0)),
      createHitProxy(hitAreaGroup, 'right-shoulder', new THREE.SphereGeometry(0.28, 14, 10), new THREE.Vector3(0.54, 0.22, 0)),
      createHitProxy(hitAreaGroup, 'left-hand', new THREE.SphereGeometry(0.22, 14, 10), new THREE.Vector3(-0.54, -0.96, 0.02)),
      createHitProxy(hitAreaGroup, 'right-hand', new THREE.SphereGeometry(0.22, 14, 10), new THREE.Vector3(0.54, -0.96, 0.02)),
      createHitProxy(hitAreaGroup, 'body', new THREE.BoxGeometry(0.9, 0.56, 0.62), new THREE.Vector3(0, 0.18, 0)),
      createHitProxy(hitAreaGroup, 'stomach', new THREE.SphereGeometry(0.4, 14, 10), new THREE.Vector3(0, -0.36, 0.06)),
      createHitProxy(hitAreaGroup, 'left-leg', new THREE.CapsuleGeometry(0.19, 0.75, 6, 12), new THREE.Vector3(-0.24, -1.38, 0.06)),
      createHitProxy(hitAreaGroup, 'right-leg', new THREE.CapsuleGeometry(0.19, 0.75, 6, 12), new THREE.Vector3(0.24, -1.38, 0.06)),
      createHitProxy(hitAreaGroup, 'left-foot', new THREE.SphereGeometry(0.34, 14, 10), new THREE.Vector3(-0.24, -2.12, 0.34)),
      createHitProxy(hitAreaGroup, 'right-foot', new THREE.SphereGeometry(0.34, 14, 10), new THREE.Vector3(0.24, -2.12, 0.34)),
    ];
  }

  clickTargets = [];
  loadProductionAvatar();

  // 慢速网络只更新提示，绝不切换到简陋人偶。
  setTimeout(function () {
    var spinner = document.getElementById('loadingSpinner');
    if (spinner && !spinner.classList.contains('is-hidden')) {
      updateModelStatus(t('home.modelStillLoading'));
    }
  }, 30000);

  // ---- 鼠标交互 ----
  const mouse = new THREE.Vector2();
  const mouseTarget = new THREE.Vector2();  // 平滑跟随
  let mouseOnCharacter = false;

  // Raycaster 用于点击检测
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.1;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseTarget.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseOnCharacter = true;

    raycaster.setFromCamera(mouseTarget, camera);
    var hoveredPart = raycaster.intersectObjects(clickTargets, true)[0];
    canvas.style.cursor = hoveredPart ? 'pointer' : 'grab';
  });

  container.addEventListener('mouseleave', () => {
    mouseTarget.set(0, 0);
    mouseOnCharacter = false;
    canvas.style.cursor = 'grab';
  });

  // 点击检测
  container.addEventListener('click', (e) => {

    const rect = container.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);

    // 检测身体部位
    const intersects = raycaster.intersectObjects(clickTargets, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.userData.interactionPart && !obj.name) {
        obj = obj.parent;
      }
      const partName = obj ? (obj.userData.interactionPart || obj.name) : null;
      if (partName) {
        triggerReaction(partName);
      }
    }
  });

  function triggerReaction(partName) {
    if (stopActiveReaction) stopActiveReaction();

    // GLB model has avatarRoot.rotation.y = -π/2, so visual left/right
    // is swapped relative to the skeleton bone names. Compensate here.
    var lookupName = partName;
    if (activeCharacter !== character) {
      var swapMap = {
        'left-shoulder': 'right-shoulder',
        'right-shoulder': 'left-shoulder',
        'left-hand': 'right-hand',
        'right-hand': 'left-hand',
        'left-leg': 'right-leg',
        'right-leg': 'left-leg',
        'left-foot': 'right-foot',
        'right-foot': 'left-foot',
      };
      lookupName = swapMap[partName] || partName;
    }

    // Map click target name to the body part to shake
    var partMap = {
      'head': activeBodyParts.head,
      'face': activeBodyParts.head,
      'body': activeBodyParts.body,
      'stomach': activeBodyParts.stomach || activeBodyParts.body,
      'left-shoulder': activeBodyParts['left-shoulder'],
      'right-shoulder': activeBodyParts['right-shoulder'],
      'left-hand': activeBodyParts['left-hand'],
      'right-hand': activeBodyParts['right-hand'],
      'left-leg': activeBodyParts['left-hip'],
      'right-leg': activeBodyParts['right-hip'],
      'left-foot': activeBodyParts['left-foot'],
      'right-foot': activeBodyParts['right-foot'],
    };
    var part = partMap[lookupName];
    if (!part) return;

    // Left-side parts shake one way, right-side the opposite
    var direction = partName.indexOf('left') === 0 ? -1 :
                    partName.indexOf('right') === 0 ? 1 : 0;

    var originalRotation = part.rotation.clone();
    var startTime = performance.now();
    var duration = 450;
    var frameId = 0;

    function restoreShake() {
      cancelAnimationFrame(frameId);
      part.rotation.copy(originalRotation);
      stopActiveReaction = null;
    }

    stopActiveReaction = restoreShake;

    function animateShake(now) {
      var elapsed = now - startTime;
      var t = Math.min(elapsed / duration, 1);
      // Gentle damped oscillation: 5 half-cycles, amplitude 0.06 rad
      var shake = Math.sin(t * Math.PI * 5) * (1 - t) * 0.06;

      part.rotation.copy(originalRotation);
      part.rotation.z += direction !== 0 ? shake * direction : shake;

      if (t < 1) {
        frameId = requestAnimationFrame(animateShake);
      } else {
        restoreShake();
      }
    }

    frameId = requestAnimationFrame(animateShake);
  }

  // ---- 渲染循环 ----
  function animate() {
    requestAnimationFrame(animate);

    // 平滑鼠标
    mouse.lerp(mouseTarget, 0.12);

    if (animationMixer) animationMixer.update(clock.getDelta());

    // 身体跟随鼠标转动，幅度加大
    const targetRotY = mouseOnCharacter ? mouse.x * 0.30 : 0;
    const targetRotX = mouseOnCharacter ? mouse.y * 0.12 : 0;

    if (!stopActiveReaction) {
      activeCharacter.rotation.y += (targetRotY - activeCharacter.rotation.y) * 0.10;
      activeCharacter.rotation.x += (targetRotX - activeCharacter.rotation.x) * 0.10;
    }

    // 头部跟随（比身体更灵敏）
    const activeHead = activeBodyParts.head;
    if (activeHead && !stopActiveReaction) {
      const baseRotation = activeHead.userData.followBaseRotation || new THREE.Euler();
      const headTargetY = baseRotation.y + (mouseOnCharacter ? mouse.x * 0.45 : 0);
      const headTargetX = baseRotation.x + (mouseOnCharacter ? mouse.y * 0.28 : 0);
      activeHead.rotation.y += (headTargetY - activeHead.rotation.y) * 0.12;
      activeHead.rotation.x += (headTargetX - activeHead.rotation.x) * 0.12;
    }

    // 瞳孔跟踪（范围加大，更灵敏）
    const lookX = mouseOnCharacter ? mouse.x * 0.14 : 0;
    const lookY = mouseOnCharacter ? mouse.y * 0.10 : 0;
    activeEyePairs.forEach(({ group }) => {
      group.children.forEach(child => {
        if (child.name && child.name.startsWith('pupil')) {
          child.position.x = lookX;
          child.position.y = lookY;
        }
      });
    });

    // 粒子缓慢旋转
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    renderer.render(scene, camera);
  }

  animate();

  // ---- 响应式处理 ----
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  });

  // 暴露引用
  window.__threeCharacter = {
    get character() { return activeCharacter; },
    get bodyParts() { return activeBodyParts; },
    scene,
    camera,
    triggerReaction,
    setEasterLighting,
  };
})();


// ============================================================
//  背景飘浮彩带
// ============================================================

(function initRibbons() {
  const container = document.getElementById('ribbonsContainer');
  if (!container) return;

  const colors = [
    '#a9d9ed', '#dff1f7', '#f8d2dc', '#f4b8c7',
    '#c3db7f', '#e9f1c9', '#fff0ab', '#eadff4',
  ];

  const ribbonCount = window.innerWidth < 768 ? 16 : 26;

  for (let i = 0; i < ribbonCount; i++) {
    const ribbon = document.createElement('div');
    ribbon.className = 'ribbon';

    // 随机尺寸
    const width = 4 + Math.random() * 7;
    const height = 18 + Math.random() * 34;

    // 随机位置
    const leftPos = Math.random() * 100;        // 0-100%

    // 随机动画参数
    const duration = 11 + Math.random() * 16;
    const delay = Math.random() * duration;      // 错开启动
    const drift = (Math.random() - 0.5) * 120;  // 水平飘移距离（px）
    const spin = (Math.random() - 0.5) * 360;   // 旋转角度

    ribbon.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      left: ${leftPos}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      --drift: ${drift}px;
      --spin: ${spin}deg;
    `;

    container.appendChild(ribbon);

    // 动画结束后重新生成（保持持续飘浮）
    ribbon.addEventListener('animationend', () => {
      ribbon.style.left = Math.random() * 100 + '%';
      ribbon.style.background = colors[Math.floor(Math.random() * colors.length)];
      ribbon.style.animationDuration = (12 + Math.random() * 20) + 's';
      ribbon.style.animationDelay = '0s';
      ribbon.style.setProperty('--drift', (Math.random() - 0.5) * 120 + 'px');
      ribbon.style.setProperty('--spin', (Math.random() - 0.5) * 360 + 'deg');
    });
  }

  const scrollContainer = document.getElementById('scrollContainer');
  const projectsSection = document.getElementById('projects');
  let visibilityFrame = 0;

  function syncRibbonVisibility() {
    visibilityFrame = 0;
    if (!scrollContainer || !projectsSection) return;
    const cutoff = projectsSection.offsetTop - window.innerHeight * 0.35;
    container.classList.toggle('is-hidden', scrollContainer.scrollTop >= cutoff);
  }

  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', function () {
      if (visibilityFrame) return;
      visibilityFrame = window.requestAnimationFrame(syncRibbonVisibility);
    }, { passive: true });
  }
  window.addEventListener('resize', syncRibbonVisibility);
  syncRibbonVisibility();
})();


// ============================================================
//  彩蛋系统 — 撕碎所有标签触发
// ============================================================

function triggerEasterEgg() {
  var overlay = document.getElementById('easterEggOverlay');
  var lidTop = document.getElementById('blinkLidTop');
  var lidBottom = document.getElementById('blinkLidBottom');
  var countdownDisplay = document.getElementById('countdownDisplay');
  var pullChain = document.getElementById('pullChain');
  var canvas = document.getElementById('threeCanvas');
  var ribbons = document.getElementById('ribbonsContainer');
  var charContainer = document.getElementById('characterContainer');

  if (!overlay || overlay.classList.contains('active')) return;
  overlay.classList.add('active');

  // ---- 粉尘粒子 ----
  var particleColors = [
    '#c8b0f0', '#a78bfa', '#b99af5', '#d2b5f2', '#eca1ca',
    '#e1c3e8', '#d4a8dd', '#f0b8d4', '#b890e8', '#c9a8f0',
  ];

  function burstParticles(callback) {
    if (!charContainer) { if (callback) callback(); return; }
    var rect = countdownDisplay.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var containerRect = charContainer.getBoundingClientRect();
    var relX = cx - containerRect.left;
    var relY = cy - containerRect.top;
    var count = 50 + Math.floor(Math.random() * 20);

    for (let i = 0; i < count; i++) {
      let p = document.createElement('span');
      p.className = 'countdown-particle';
      var angle = Math.random() * Math.PI * 2;
      var dist = 60 + Math.random() * 200;
      var px = Math.cos(angle) * dist;
      var py = Math.sin(angle) * dist;
      var size = 2 + Math.random() * 8;
      p.style.cssText =
        'left:' + relX + 'px;' +
        'top:' + relY + 'px;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'background:' + particleColors[Math.floor(Math.random() * particleColors.length)] + ';' +
        '--px:' + px + 'px;' +
        '--py:' + py + 'px;' +
        'animation-duration:' + (0.55 + Math.random() * 0.5) + 's';
      charContainer.appendChild(p);
      p.addEventListener('animationend', function () { p.remove(); });
    }
    if (callback) setTimeout(callback, 150);
  }

  // ---- 5秒倒计时 ----
  var count = 5;
  countdownDisplay.textContent = count;
  countdownDisplay.classList.add('show', 'pop');
  setTimeout(function () { countdownDisplay.classList.remove('pop'); }, 350);

  function nextCount() {
    count--;
    if (count <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.classList.remove('show');
      burstParticles(function () {
        countdownDisplay.textContent = '';
        startBlinkAndDarkMode();
      });
    } else {
      burstParticles(function () {
        countdownDisplay.textContent = count;
        countdownDisplay.classList.remove('pop');
        void countdownDisplay.offsetWidth;
        countdownDisplay.classList.add('pop');
        setTimeout(function () { countdownDisplay.classList.remove('pop'); }, 350);
      });
    }
  }

  var countdownInterval = setInterval(nextCount, 1000);

  function startBlinkAndDarkMode() {
    // 眨眼：上下眼睑闭合
    lidTop.classList.add('closing');
    lidBottom.classList.add('closing');

    // 闭合后保持 .38s，进入暗黑模式
    setTimeout(function () {
      overlay.classList.add('dark');
      overlay.style.setProperty('background',
        'radial-gradient(circle 130px at 50% 50%, transparent 0%, rgba(2,2,8,.94) 100%)');
      // 提升 canvas 到遮罩之上：改为 fixed 定位
      if (canvas) {
        var rect = canvas.getBoundingClientRect();
        canvas._origPosition = canvas.style.position;
        canvas._origZIndex = canvas.style.zIndex;
        canvas._origTop = canvas.style.top;
        canvas._origLeft = canvas.style.left;
        canvas._origWidth = canvas.style.width;
        canvas._origHeight = canvas.style.height;
        canvas.style.position = 'fixed';
        canvas.style.top = rect.top + 'px';
        canvas.style.left = rect.left + 'px';
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        canvas.style.zIndex = '10000';
        canvas.classList.add('is-easter-lit');
      }
      if (window.__threeCharacter && window.__threeCharacter.setEasterLighting) {
        window.__threeCharacter.setEasterLighting(true);
      }
      if (ribbons) ribbons.style.display = 'none';

      // 生成暗黑粒子
      spawnDarkParticles();

      // 眼睑重新拉开（移除 class，CSS transition 自动恢复）
      lidTop.classList.remove('closing');
      lidBottom.classList.remove('closing');
    }, 380);
  }

  // ---- 暗黑粒子 ----
  function spawnDarkParticles() {
    var container = document.getElementById('darkParticles');
    if (!container) return;
    container.innerHTML = '';

    var particleColors = [
      '#c8b0f0', '#d4b8f0', '#b890e8', '#eca1ca',
      '#f0b8d4', '#d2b5f2', '#e1c3e8', '#b99af5',
    ];

    var charRect = charContainer.getBoundingClientRect();
    var cx = charRect.left + charRect.width / 2;
    var cy = charRect.top + charRect.height / 2;
    var spreadX = charRect.width * 0.75;
    var spreadY = charRect.height * 0.7;

    for (let i = 0; i < 45; i++) {
      let p = document.createElement('span');
      p.className = 'dark-particle';
      var size = 2 + Math.random() * 5;
      var x = cx + (Math.random() - 0.5) * spreadX;
      var y = cy + (Math.random() - 0.5) * spreadY;
      p.style.cssText =
        'left:' + x + 'px;' +
        'top:' + y + 'px;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'background:' + particleColors[Math.floor(Math.random() * particleColors.length)] + ';' +
        'box-shadow: 0 0 ' + (3 + Math.random() * 6) + 'px ' + particleColors[Math.floor(Math.random() * particleColors.length)] + ';' +
        'animation-delay:' + (Math.random() * 6) + 's;' +
        'animation-duration:' + (5 + Math.random() * 7) + 's';
      container.appendChild(p);
    }
  }

  function clearDarkParticles() {
    var container = document.getElementById('darkParticles');
    if (container) container.innerHTML = '';
  }

  // ---- 鼠标聚光灯 ----
  function updateSpotlight(e) {
    if (!overlay.classList.contains('dark')) return;
    var x = (e.clientX / window.innerWidth) * 100;
    var y = (e.clientY / window.innerHeight) * 100;
    overlay.style.setProperty('background',
      'radial-gradient(circle 130px at ' + x + '% ' + y + '%, transparent 0%, rgba(2,2,8,.94) 100%)');
  }
  document.addEventListener('mousemove', updateSpotlight);

  // ---- 拉绳开关 ----
  if (pullChain) {
    pullChain.addEventListener('click', function (e) {
      e.stopPropagation();
      restoreNormalMode();
    });
  }

  function restoreNormalMode() {
    // 反向 blink：眼睑闭合
    lidTop.classList.add('closing');
    lidBottom.classList.add('closing');

    setTimeout(function () {
      overlay.classList.remove('dark', 'active');
      overlay.style.removeProperty('background');
      // 还原 canvas 定位
      if (canvas && canvas._origPosition !== undefined) {
        canvas.style.position = canvas._origPosition;
        canvas.style.zIndex = canvas._origZIndex;
        canvas.style.top = canvas._origTop;
        canvas.style.left = canvas._origLeft;
        canvas.style.width = canvas._origWidth;
        canvas.style.height = canvas._origHeight;
        canvas.classList.remove('is-easter-lit');
      }
      if (window.__threeCharacter && window.__threeCharacter.setEasterLighting) {
        window.__threeCharacter.setEasterLighting(false);
      }
      if (ribbons) ribbons.style.removeProperty('display');
      document.removeEventListener('mousemove', updateSpotlight);
      clearDarkParticles();

      // 眼睑重新拉开
      lidTop.classList.remove('closing');
      lidBottom.classList.remove('closing');

      // 重置所有标签，回到初始状态，可重新撕碎触发彩蛋
      if (window.__resetAllTags) window.__resetAllTags();

      // 等 blink 眼睑拉开后，自动下滑到 About Me
      setTimeout(function () {
        var aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 600);
    }, 400);
  }
}


// ============================================================
//  Internship — 实习旅程
// ============================================================

var INTERNSHIP_CARDS = [
  {
    id: 'keendata',
    company: 'Keendata',
    role: 'Data Development Intern',
    period: 'APR 2025 - AUG 2025',
    location: 'Shenzhen, Guangdong',
    image: 'assets/internship/keendata.webp',
    aboutImage: 'assets/about/keendata.webp',
    logo: 'assets/about/keendata-logo.png',
    summary: 'Supported big data platform development, system deployment, and project delivery processes, combining software engineering practice with cross-functional collaboration.',
    tags: ['Big Data', 'Java Development', 'Hadoop', 'Bug Management'],
    responsibilities: [
      'Assisted in Hadoop cluster deployment and environment configuration, standardizing deployment workflows and documenting technical procedures',
      'Developed a Java-based internal notification module, including implementation, testing, and validation to support system communication requirements',
      'Supported customized project delivery by tracking 20+ system-level issues, coordinating bug verification, packaging, deployment, and release processes',
      'Collaborated with technical teams to troubleshoot system problems, maintain issue records, and ensure closed-loop defect resolution'
    ],
    methods: [
      'Java development and backend module implementation',
      'Hadoop cluster deployment and environment configuration',
      'Bug tracking, troubleshooting, and release validation',
      'Technical documentation and workflow standardization',
      'Cross-team communication and project progress tracking'
    ],
    highlights: [
      'Delivered a Java-based notification module from development to validation, ensuring successful feature integration',
      'Created standardized deployment documentation to improve environment setup efficiency and knowledge transfer',
      'Supported resolution of 20+ system-level issues, improving delivery quality through structured defect tracking and verification'
    ]
  },
  {
    id: 'xgrids',
    company: 'XGRIDS',
    role: 'Project Management Intern',
    period: 'JAN 2026 - MAY 2026',
    location: 'Shenzhen, Guangdong',
    image: 'assets/internship/xgrids.webp',
    aboutImage: 'assets/about/xgrids.webp',
    logo: 'assets/about/xgrids-logo.png',
    summary: 'Supported agile delivery, AI-driven process optimization, and software-hardware integrated product iteration for 3D reconstruction solutions.',
    tags: ['Agile Delivery', 'AI Automation', '3D Reconstruction', 'Project Management'],
    responsibilities: [
      'Supported agile iteration and delivery management for a software-hardware integrated 3D reconstruction handheld scanning product, tracking requirements, development progress, and release milestones',
      'Coordinated cross-functional collaboration among R&D, product, algorithm, hardware, and testing teams, ensuring alignment throughout the product lifecycle',
      'Managed 30+ core requirements across product iterations, supporting requirement review, prioritization, scheduling, testing, and release processes',
      'Conducted Bug tracking analysis and defect management, identifying issue patterns and improving team workflow efficiency through data-driven insights',
      'Leveraged AI tools to optimize project workflows and explore intelligent solutions for risk alerts, automated scheduling, and project status management'
    ],
    methods: [
      'Agile/Scrum framework with iterative planning and milestone tracking',
      'Jira backlog management and requirement lifecycle tracking',
      'Cross-functional coordination between product, engineering, and testing teams',
      'Bug analysis, issue prioritization, and defect lifecycle management',
      'AI-assisted workflow optimization and automation exploration'
    ],
    highlights: [
      'Coordinated 5 cross-functional teams and supported end-to-end delivery of software-hardware integrated product iterations',
      'Tracked and managed 30+ requirements, improving requirement visibility and delivery coordination',
      'Applied AI tools and data analysis to optimize Bug management processes and enhance project execution efficiency',
      'Supported SOP refinement and established standardized workflows to improve R&D collaboration efficiency'
    ]
  },
  {
    id: 'chery',
    company: 'CHERY',
    role: 'Intelligent Driving Project Management Intern',
    period: 'MAY 2026 - PRESENT',
    location: 'Wuhu, Anhui',
    image: 'assets/internship/chery.webp',
    aboutImage: 'assets/about/chery.webp',
    logo: 'assets/about/chery-logo.png',
    summary: 'Supported Robotaxi project delivery, cross-functional coordination, and PMO process optimization for intelligent driving development.',
    tags: ['Intelligent Driving', 'PMO', 'Jira Management', 'Project Coordination'],
    responsibilities: [
      'Supported project planning and execution management for the Robotaxi intelligent driving project, tracking development milestones, schedules, and delivery progress',
      'Coordinated communication between R&D, testing, and engineering teams, organizing project meetings, following up action items, and ensuring cross-team alignment',
      'Managed Jira issue lifecycle, including requirement tracking, defect follow-up, and workflow monitoring to improve issue visibility and resolution efficiency',
      'Collaborated with quality teams to optimize Bug tracking processes, establish reminder mechanisms, and support closed-loop issue management',
      'Assisted in project resource management, including vehicle resource tracking, test resource coordination, and partial cost monitoring'
    ],
    methods: [
      'Jira workflow management and issue lifecycle tracking',
      'Project schedule management and milestone tracking',
      'Cross-functional communication and meeting coordination',
      'Resource tracking and risk identification',
      'Digital tools for project transparency and automated reminders'
    ],
    highlights: [
      'Supported delivery management of a Robotaxi intelligent driving project, improving visibility of development progress and key milestones',
      'Established structured tracking and reminder mechanisms for Jira issues, enhancing overdue issue management and escalation efficiency',
      'Maintained project resource tracking processes covering vehicle resources, testing resources, and delivery readiness',
      'Improved PMO collaboration efficiency through standardized reporting and cross-team coordination workflows'
    ]
  }
];

var currentInternshipState = 'cards'; // cards | detail
var activeInternshipId = null;

function getInternshipCardData(card) {
  return getLocalized(card, INTERNSHIP_TRANSLATIONS, card.id);
}

function initInternshipJourney() {
  var stage = document.getElementById('internshipStage');
  var cardsContainer = document.getElementById('internshipCards');
  var detailContainer = document.getElementById('internshipDetail');
  if (!stage || !cardsContainer) return;
  if (stage.dataset.internshipReady === 'true') return;
  stage.dataset.internshipReady = 'true';

  // ---- 构建卡片 ----
  buildInternshipCards(cardsContainer);

  // ---- 直接展示卡片 ----
  stage.classList.remove('is-detail', 'is-opening-detail');
  stage.classList.add('is-cards');
  currentInternshipState = 'cards';
  cardsContainer.querySelectorAll('.internship-card').forEach(function (card) {
    card.classList.add('is-flipped');
  });

  // ---- 卡片点击 → 详情 ----
  cardsContainer.addEventListener('click', function (e) {
    var card = e.target.closest('.internship-card');
    if (!card) return;
    if (currentInternshipState !== 'cards') return;
    var cardId = card.getAttribute('data-card-id');
    if (cardId) {
      card.classList.add('is-flipping');
      openInternshipDetail(cardId, detailContainer, stage, card);
    }
  });

  // 键盘支持
  cardsContainer.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && currentInternshipState === 'cards') {
      var card = e.target.closest('.internship-card');
      if (card) {
        var cardId = card.getAttribute('data-card-id');
        if (cardId) {
          card.classList.add('is-flipping');
          openInternshipDetail(cardId, detailContainer, stage, card);
        }
      }
    }
  });
}

function buildInternshipCards(container) {
  if (!container) return;
  var html = '';
  INTERNSHIP_CARDS.forEach(function (cardData, index) {
    var cardText = getInternshipCardData(cardData);
    html += '<div class="internship-card" data-card-id="' + cardData.id + '" tabindex="0" role="button" aria-label="' + cardText.company + ' internship card">'
      + '<div class="internship-card-inner">'
      + '<div class="internship-card-front">'
      + '<img src="' + cardData.image + '" alt="' + cardText.company + ' internship card" loading="eager" decoding="async" fetchpriority="low">'
      + '<span class="card-front-number">' + String(index + 1).padStart(2, '0') + '</span>'
      + '</div>'
      + '<div class="internship-card-back">'
      + '<span class="card-back-kicker">' + t('internship.cardKicker') + ' ' + String(index + 1).padStart(2, '0') + '</span>'
      + '<span class="card-back-company"><i data-lucide="building-2" class="card-back-company-icon" aria-hidden="true"></i>' + cardText.company + '</span>'
      + '<span class="card-back-role">' + cardText.role + '</span>'
      + '<span class="card-back-period">' + cardText.period + '</span>'
      + '<p class="card-back-summary">' + cardText.summary + '</p>'
      + '<div class="card-back-tags">'
      + cardText.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join('')
      + '</div>'
      + '<span class="card-back-action">' + t('internship.viewDetails') + ' <i data-lucide="arrow-right" class="card-back-action-icon" aria-hidden="true"></i></span>'
      + '</div>'
      + '</div>'
      + '</div>';
  });
  container.innerHTML = html;
  // 重新初始化 Lucide 图标
  if (window.lucide) lucide.createIcons();
}

function openInternshipDetail(cardId, detailContainer, stage, cardEl) {
  if (!detailContainer || !stage) return;
  var cardData = INTERNSHIP_CARDS.find(function (c) { return c.id === cardId; });
  if (!cardData) return;
  var cardText = getInternshipCardData(cardData);

  currentInternshipState = 'detail';
  activeInternshipId = cardId;
  stage.classList.remove('is-cards');
  stage.classList.add('is-detail');
  // is-opening-detail 在 HTML 渲染后再加上，触发翻转进场动画

  // 卡片翻转动画播放 200ms 后渲染 detail 内容
  var cardIndex = INTERNSHIP_CARDS.findIndex(function (c) { return c.id === cardId; });
  setTimeout(function () {
    var aboutImg = cardData.aboutImage || cardData.image;
    var logoHTML = cardData.logo
      ? '<span class="card-logo-wrap"><img src="' + cardData.logo + '" alt="" class="card-logo"></span>'
      : '<span class="card-icon-wrap"><i data-lucide="building-2" class="card-head-icon"></i></span>';
    var tagsHTML = cardText.tags.map(function (tag) { return '<span class="card-tag">' + tag + '</span>'; }).join('');

    var html = '<div class="internship-detail-card">'
      + '<div class="card-image-wrap">'
      + '<img src="' + aboutImg + '" alt="' + cardText.company + '">'
      + '<span class="card-number">' + String(cardIndex + 1).padStart(2, '0') + '</span>'
      + '</div>'
      + '<div class="card-body">'
      + '<div class="card-head">' + logoHTML
      + '<div><h3 class="card-title">' + cardText.company + '</h3>'
      + '<p class="card-subtitle">' + cardText.role + '</p></div>'
      + '</div>'
      + '<div class="card-items">' + tagsHTML + '</div>'
      + '</div>'
      + '<button class="internship-card-back-btn" id="internshipBackBtn"><i data-lucide="arrow-left" class="detail-back-icon" aria-hidden="true"></i> ' + t('internship.back') + '</button>'
      + '</div>'
      + '<div class="internship-detail-panel">'
      + '<span class="detail-company"><i data-lucide="building-2" class="detail-company-icon" aria-hidden="true"></i>' + cardText.company + '</span>'
      + '<div class="detail-role-period">'
      + '<span class="detail-role">' + cardText.role + '</span>'
      + '<span class="detail-period">' + cardText.period + '</span>'
      + '</div>'
      + '<span class="detail-location"><i data-lucide="map-pin" style="width:.6rem;height:.6rem"></i> ' + cardText.location + '</span>'
      + '<p class="detail-summary">' + cardText.summary + '</p>'
      + '<div class="detail-tags">' + cardText.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join('') + '</div>'
      + '<div class="detail-section"><h4><i data-lucide="clipboard-list" class="detail-section-icon" aria-hidden="true"></i>' + t('internship.responsibilities') + '</h4><ul>'
      + cardText.responsibilities.map(function (r) { return '<li>' + r + '</li>'; }).join('')
      + '</ul></div>'
      + '<div class="detail-section"><h4><i data-lucide="wrench" class="detail-section-icon" aria-hidden="true"></i>' + t('internship.methods') + '</h4><ul>'
      + cardText.methods.map(function (m) { return '<li>' + m + '</li>'; }).join('')
      + '</ul></div>'
      + '<div class="detail-section"><h4><i data-lucide="sparkles" class="detail-section-icon" aria-hidden="true"></i>' + t('internship.highlights') + '</h4><ul>'
      + cardText.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('')
      + '</ul></div>'
      + '</div>';

    detailContainer.innerHTML = html;
    // 渲染完 HTML 后触发翻转进场动画
    stage.classList.add('is-opening-detail');
    if (window.lucide) lucide.createIcons();

    // 返回按钮
    var backBtn = document.getElementById('internshipBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        closeInternshipDetail(detailContainer, stage);
      });
    }

    // 焦点移到返回按钮
    setTimeout(function () {
      if (backBtn) backBtn.focus();
    }, 100);
  }, 200);

  // 翻转动画收尾
  setTimeout(function () {
    stage.classList.remove('is-opening-detail');
    if (cardEl) cardEl.classList.remove('is-flipping');
  }, 820);
}

function closeInternshipDetail(detailContainer, stage) {
  if (!detailContainer || !stage) return;
  currentInternshipState = 'cards';
  activeInternshipId = null;
  stage.classList.remove('is-detail', 'is-opening-detail');
  stage.classList.add('is-cards');
  // 清除所有卡片的 is-flipping 状态
  var cards = document.querySelectorAll('.internship-card.is-flipping');
  for (var i = 0; i < cards.length; i++) { cards[i].classList.remove('is-flipping'); }
  detailContainer.innerHTML = '';
}

function refreshInternshipLanguage() {
  if (!Array.isArray(INTERNSHIP_CARDS)) return;
  var stage = document.getElementById('internshipStage');
  var cardsContainer = document.getElementById('internshipCards');
  var detailContainer = document.getElementById('internshipDetail');
  if (!stage || !cardsContainer) return;
  if (currentInternshipState === 'detail' && activeInternshipId && detailContainer) {
    openInternshipDetail(activeInternshipId, detailContainer, stage);
    return;
  }
  buildInternshipCards(cardsContainer);
  cardsContainer.querySelectorAll('.internship-card').forEach(function (card) {
    card.classList.add('is-flipped');
  });
}

// ============================================================
//  Projects — Falling physics orbs
// ============================================================

var PROJECTS = [
  {
    id: 'robotaxi',
    title: 'Robotaxi Intelligent Driving',
    category: 'Technical',
    period: '2026',
    accent: '#8f7df4',
    state: 'pending',
    thumbnail: '',
    summary: 'A self-developed L4 Robotaxi intelligent driving system concept (placeholder).',
    description: 'A future L4 Robotaxi intelligent driving project placeholder, awaiting detailed content.',
    tags: ['Intelligent Driving', 'Robotaxi', 'VLA Model', 'Jira', 'PMO'],
    links: [],
    highlights: []
  },
  {
    id: 'ai-pm',
    title: 'AI-powered Project Management Platform',
    sceneTitle: 'AI Project Management',
    code: 'Project 01',
    category: 'Product Design',
    period: '2026',
    accent: '#e99ad6',
    state: 'active',
    thumbnail: '',
    tagline: 'An intelligent workflow system for improving project visibility and execution efficiency',
    summary: 'Designed a lightweight AI-powered project management platform to address challenges in project scheduling visibility, workflow complexity, and inefficient collaboration across PM, development, testing, and UI teams.',
    role: 'Product Manager / AI Solution Designer',
    description: 'Designed a lightweight AI-powered project management platform to address challenges in project scheduling visibility, workflow complexity, and inefficient collaboration across PM, development, testing, and UI teams.',
    status: 'MVP development and testing phase',
    techStack: ['AI Agent', 'Product Design', 'PMO', 'Workflow Automation'],
    tags: ['AI Agent', 'Product Design', 'PMO', 'Workflow Automation'],
    links: [],
    highlights: [
      'Conducted research with 17 R&D members and translated workflow pain points into product requirements and MVP roadmap',
      'Designed core data models connecting requirements, tasks, and Bugs, with a three-level permission system',
      'Proposed intelligent workflow mechanisms: project health indicators, drag-and-drop task boards with blocker alerts, automated escalation reminders for overdue tasks',
      'Designed AI Agent scenarios for risk prediction and schedule assistance, delay detection and notifications, and automated project reports and retrospectives'
    ]
  },
  {
    id: 'metafit',
    title: 'MetaFit — AI Fashion Recommendation & Virtual Try-on',
    sceneTitle: 'MetaFit Virtual Try-on',
    code: 'Project 02',
    category: 'Product Design',
    period: '2026',
    accent: '#7aa7e9',
    state: 'active',
    thumbnail: '',
    tagline: 'Combining LLM recommendation and AIGC virtual try-on for personalized shopping experiences',
    summary: 'Developed an end-to-end intelligent fashion system integrating LLM-based recommendation and AIGC virtual try-on to improve online shopping personalization and user experience.',
    role: 'Project Lead / AI Product Designer',
    description: 'Developed an end-to-end intelligent fashion system integrating LLM-based recommendation and AIGC virtual try-on to improve online shopping personalization and user experience.',
    status: 'MVP development and integration testing',
    techStack: ['LLM', 'RAG', 'AIGC', 'Computer Vision', 'Prompt Engineering'],
    tags: ['LLM', 'RAG', 'AIGC', 'Computer Vision', 'Prompt Engineering'],
    links: [],
    highlights: [
      'Participated in system architecture design, building a complete workflow: User Intent → RAG Recommendation → AIGC Virtual Try-on',
      'Defined MVP features and coordinated development progress across frontend and backend modules',
      'Designed and optimized structured prompts covering product category, material, style, and fit preferences',
      'Analyzed recommendation deviations and generation failures through Bad Case analysis, improving prompt robustness',
      'Coordinated integration testing and collected user feedback to guide iterative improvements'
    ]
  },
  {
    id: 'metaverse-classroom',
    title: 'Metaverse Classroom (Coming Soon)',
    category: 'Creative',
    period: '2026',
    accent: '#7aa7e9',
    state: 'pending',
    thumbnail: '',
    summary: 'A virtual reality classroom experience under design exploration.',
    description: 'Concept exploration for a Metaverse-enabled classroom product, integrating real-time 3D environments with collaborative learning workflows. The project is in early ideation stage, focusing on user experience design and technical feasibility studies.',
    tags: ['Metaverse', 'VR', 'EdTech'],
    links: [],
    highlights: []
  },
  {
    id: 'ar-showroom',
    title: 'AR Showroom (Coming Soon)',
    category: 'Creative',
    period: '2026',
    accent: '#a98ac9',
    state: 'pending',
    thumbnail: '',
    summary: 'Augmented reality product showroom under design exploration.',
    description: 'A product showroom concept leveraging augmented reality for immersive brand experiences. Researching AR frameworks, mobile compatibility, and 3D asset pipelines.',
    tags: ['AR', '3D', 'Brand'],
    links: [],
    highlights: []
  },
  {
    id: 'ai-research',
    title: 'AI Research Lab (Coming Soon)',
    category: 'Technical',
    period: '2026',
    accent: '#8f7df4',
    state: 'pending',
    thumbnail: '',
    summary: 'A research initiative exploring AI-driven product innovation.',
    description: 'Research-focused exploration of AI capabilities in real product scenarios, including LLM integration, prompt engineering, and applied machine learning.',
    tags: ['AI', 'LLM', 'Research'],
    links: [],
    highlights: []
  },
  {
    id: 'iot-garden',
    title: 'IoT Smart Garden (Coming Soon)',
    category: 'Technical',
    period: '2026',
    accent: '#7aa7e9',
    state: 'pending',
    thumbnail: '',
    summary: 'A smart gardening system with IoT sensors under early design.',
    description: 'IoT-based smart garden concept integrating soil sensors, automated watering, and a mobile dashboard. Currently in ideation and hardware feasibility stage.',
    tags: ['IoT', 'Hardware', 'Sensors'],
    links: [],
    highlights: []
  },
  {
    id: 'data-viz',
    title: 'Data Visualization (Coming Soon)',
    category: 'Creative',
    period: '2026',
    accent: '#e99ad6',
    state: 'pending',
    thumbnail: '',
    summary: 'An interactive data visualization tool under design.',
    description: 'A web-based data visualization platform concept, exploring interactive charts, real-time data streams, and aesthetic-driven storytelling.',
    tags: ['Data Viz', 'D3', 'Storytelling'],
    links: [],
    highlights: []
  }
];

var currentProjectState = 'orbs'; // orbs | expanded
var activeProjectId = null;
var projectsOrbsAPI = null;

function getProjectDisplayData(project) {
  var display = getLocalized(project, PROJECT_TRANSLATIONS, project.id);
  display.openAria = t('projects.openAriaPrefix') + ' ' + display.title + ' ' + t('projects.openAriaSuffix');
  display.illuminatedLabel = t('projects.illuminated');
  return display;
}

function getLocalizedProjects() {
  return PROJECTS.map(function (project) { return getProjectDisplayData(project); });
}

function initProjects() {
  var stage = document.getElementById('projectsStage');
  var overlay = document.getElementById('projectsExpandOverlay');
  var section = document.getElementById('projects');
  if (!stage || !section || !overlay || stage.dataset.projectsInitialized === 'true') return;
  stage.dataset.projectsInitialized = 'true';

  projectsOrbsAPI = initProjectsOrbs(section, stage, getLocalizedProjects(), function (projectId) {
    if (currentProjectState === 'expanded') return;
    expandProject(projectId, stage, overlay);
  });

  // ---- 遮罩点击关闭 ----
  overlay.addEventListener('click', function () {
    if (currentProjectState === 'expanded') collapseProject(stage, overlay);
  });

  // ---- Escape 关闭 ----
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && currentProjectState === 'expanded') {
      collapseProject(stage, overlay);
    }
  });

}


function expandProject(projectId, stage, overlay) {
  var projectData = PROJECTS.find(function (p) { return p.id === projectId; });
  if (!projectData) return;
  projectData = getProjectDisplayData(projectData);

  currentProjectState = 'expanded';
  activeProjectId = projectId;
  stage.classList.add('is-expanded');

  // 找到与发光项目球同步的可访问点击区域
  var projectOriginEl = document.querySelector('.project-physics-orb.is-active[data-project-id="' + projectId + '"]');
  var projectOriginRect = projectOriginEl ? projectOriginEl.getBoundingClientRect() : null;
  // Fallback to morph origin
  if (!projectOriginRect) {
    var morphOrigin = document.getElementById('projectMorphOrigin');
    if (morphOrigin) projectOriginRect = morphOrigin.getBoundingClientRect();
  }

  // 构建详情面板
  var panel = document.createElement('div');
  panel.className = 'project-detail-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', projectData.title + ' details');

  var accent = projectData.accent || '#8f7df4';
  panel.style.setProperty('--project-accent', accent);

  var html = '<div class="project-detail-dragbar" data-project-drag-handle>'
    + '<span class="project-detail-drag-label"><i data-lucide="grip-horizontal" aria-hidden="true"></i><span>' + t('projects.file') + '</span></span>'
    + '<span class="project-detail-window-code">' + (projectData.code || projectData.period || '') + '</span>'
    + '<button class="detail-close-btn" id="projectCloseBtn" type="button" title="' + t('projects.closeAria') + '" aria-label="' + t('projects.closeAria') + '"><i data-lucide="x" aria-hidden="true"></i></button>'
    + '</div>';
  // 顶部图（如果有 thumbnail；否则用渐变色条 + 项目编号）
  if (projectData.thumbnail) {
    html += '<img class="detail-top-image" src="' + projectData.thumbnail + '" alt="' + projectData.title + '">';
  } else {
    var kickerText = projectData.code || '';
    html += '<div class="detail-top-image detail-illustration" aria-hidden="true">';
    if (kickerText) {
      html += '<span class="detail-illustration-code">' + kickerText + '</span>';
    }
    html += '<span class="detail-illustration-initial">' + projectData.title.charAt(0) + '</span>'
      + '<span class="detail-illustration-star detail-illustration-star-one">✦</span>'
      + '<span class="detail-illustration-star detail-illustration-star-two">✦</span>';
    html += '</div>';
  }
  html += '<div class="detail-body">'
    + '<span class="detail-title">' + projectData.title + '</span>';
  if (projectData.tagline) {
    html += '<p class="detail-tagline">' + projectData.tagline + '</p>';
  }
  html += '<div class="detail-meta">'
    + '<span class="detail-category">' + projectData.category + '</span>'
    + '<span class="detail-period">' + projectData.period + '</span>'
    + '</div>';
  if (projectData.role) {
    html += '<div class="detail-role"><i data-lucide="user" style="width:.7rem;height:.7rem;color:var(--purple)"></i> ' + projectData.role + '</div>';
  }
  html += '<p class="detail-desc">' + projectData.description + '</p>'
    + '<div class="detail-tags">' + projectData.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>';
  if (projectData.links && projectData.links.length > 0) {
    html += '<div class="detail-links">'
      + projectData.links.map(function (l) { return '<a class="detail-link-btn" href="' + l.url + '" target="_blank" rel="noopener"><i data-lucide="' + l.icon + '" style="width:.7rem;height:.7rem"></i> ' + l.label + '</a>'; }).join('')
      + '</div>';
  }
  if (projectData.highlights && projectData.highlights.length > 0) {
    html += '<div class="detail-section"><h4><i data-lucide="sparkles" style="width:.75rem;height:.75rem;margin-right:.3rem;color:var(--purple)"></i>' + t('projects.highlights') + '</h4><ul class="detail-highlights">'
      + projectData.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('')
      + '</ul></div>';
  }
  if (projectData.techStack && projectData.techStack.length > 0) {
    html += '<div class="detail-section"><h4><i data-lucide="layers" style="width:.75rem;height:.75rem;margin-right:.3rem;color:var(--purple)"></i>' + t('projects.techStack') + '</h4><div class="detail-techstack">'
      + projectData.techStack.map(function (t) { return '<span>' + t + '</span>'; }).join('')
      + '</div></div>';
  }
  if (projectData.status) {
    html += '<div class="detail-status"><i data-lucide="activity" style="width:.65rem;height:.65rem;color:var(--purple)"></i> <b>' + t('projects.status') + ':</b> ' + projectData.status + '</div>';
  }
  html += '</div>';

  panel.innerHTML = html;

  // 设置初始位置（从发光项目球位置出发）
  var startX, startY, startW, startH;
  if (projectOriginRect) {
    startX = projectOriginRect.left + projectOriginRect.width / 2;
    startY = projectOriginRect.top + projectOriginRect.height / 2;
    startW = projectOriginRect.width;
    startH = projectOriginRect.height;
  } else {
    startX = window.innerWidth / 2;
    startY = window.innerHeight / 2;
    startW = 180;
    startH = 180;
  }

  // 目标尺寸和位置
  var isNarrowProjectViewport = window.innerWidth < 700;
  var targetW = Math.min(window.innerWidth * (isNarrowProjectViewport ? .92 : .68), 760);
  var targetH = Math.min(window.innerHeight * (isNarrowProjectViewport ? .74 : .78), window.innerHeight - (isNarrowProjectViewport ? 24 : 100));

  // 设置起始状态
  panel.style.width = startW + 'px';
  panel.style.height = startH + 'px';
  panel.style.left = (startX - startW / 2) + 'px';
  panel.style.top = (startY - startH / 2) + 'px';
  panel.style.borderRadius = '8px';
  panel.style.transform = 'scale(1)';

  // 先添加到 DOM，opacity 0
  document.body.appendChild(panel);
  panel._dragCleanup = makeProjectPanelDraggable(panel);

  // 强制 reflow 后设置目标状态
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      panel.style.width = targetW + 'px';
      panel.style.height = targetH + 'px';
      panel.style.left = ((window.innerWidth - targetW) / 2) + 'px';
      panel.style.top = ((window.innerHeight - targetH) / 2) + 'px';
      panel.style.borderRadius = '8px';
      panel.classList.add('is-open');
    });
  });

  // 关闭按钮事件
  panel.addEventListener('click', function (e) {
    if (e.target.id === 'projectCloseBtn' || e.target.closest('#projectCloseBtn')) {
      collapseProject(stage, overlay);
    }
  });

  // 存储引用
  panel._projectData = projectData;
  panel._projectOriginEl = projectOriginEl;
  overlay._activePanel = panel;

  // 初始化 Lucide 图标
  if (window.lucide) lucide.createIcons();

  // 焦点移到关闭按钮
  setTimeout(function () {
    var closeBtn = document.getElementById('projectCloseBtn');
    if (closeBtn) closeBtn.focus();
  }, 600);
}

function refreshProjectsLanguage() {
  if (projectsOrbsAPI && typeof projectsOrbsAPI.updateProjects === 'function') {
    projectsOrbsAPI.updateProjects(getLocalizedProjects());
  }
}

function makeProjectPanelDraggable(panel) {
  var handle = panel.querySelector('[data-project-drag-handle]');
  if (!handle) return function () {};

  var dragState = null;

  handle.addEventListener('pointerdown', function (event) {
    if (event.button !== 0 || event.target.closest('button,a')) return;
    var rect = panel.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top
    };
    panel.classList.add('is-dragging');
    if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  function movePanel(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    var margin = 8;
    var maxLeft = Math.max(margin, window.innerWidth - panel.offsetWidth - margin);
    var maxTop = Math.max(margin, window.innerHeight - panel.offsetHeight - margin);
    var nextLeft = Math.min(maxLeft, Math.max(margin, dragState.left + event.clientX - dragState.startX));
    var nextTop = Math.min(maxTop, Math.max(margin, dragState.top + event.clientY - dragState.startY));
    panel.style.left = nextLeft + 'px';
    panel.style.top = nextTop + 'px';
  }

  function finishDrag(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    if (handle.hasPointerCapture && handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    dragState = null;
    panel.classList.remove('is-dragging');
  }

  window.addEventListener('pointermove', movePanel);
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);

  return function () {
    window.removeEventListener('pointermove', movePanel);
    window.removeEventListener('pointerup', finishDrag);
    window.removeEventListener('pointercancel', finishDrag);
    dragState = null;
    panel.classList.remove('is-dragging');
  };
}

function collapseProject(stage, overlay) {
  if (currentProjectState !== 'expanded') return;

  var panel = overlay._activePanel;
  var projectOriginEl = panel ? panel._projectOriginEl : null;
  if (panel && panel._dragCleanup) {
    panel._dragCleanup();
    panel._dragCleanup = null;
  }

  // 获取发光项目球的当前位置
  var projectOriginRect = projectOriginEl ? projectOriginEl.getBoundingClientRect() : null;

  if (projectOriginRect && panel) {
    // Morph 回发光项目球
    panel.style.width = projectOriginRect.width + 'px';
    panel.style.height = projectOriginRect.height + 'px';
    panel.style.left = projectOriginRect.left + 'px';
    panel.style.top = projectOriginRect.top + 'px';
    panel.style.borderRadius = '8px';
    panel.classList.remove('is-open');
  }

  // 延迟移除面板
  setTimeout(function () {
    if (panel && panel.parentNode) {
      panel.parentNode.removeChild(panel);
    }
    overlay._activePanel = null;
  }, 550);

  currentProjectState = 'orbs';
  activeProjectId = null;
  stage.classList.remove('is-expanded');
  if (projectsOrbsAPI) projectsOrbsAPI.resetFocus();
}

// ============================================================
//  About Me — 数据 + 3D 环绕轮播
// ============================================================

var ABOUT_CARDS = [
  {
    id: 'base-info', period: 'FEB 2003', location: 'Quanzhou, Fujian',
    category: 'Base Info', icon: 'id-card', title: 'Base Information', subtitle: '',
    image: 'assets/about/profile.webp', logo: 'assets/about/profile-logo.webp',
    items: [],
    tags: [
      'enfp',
      'soft girl',
      '00s',
      'creator',
      'learner',
      { label: 'phone', value: '183 5056 5182' },
      { label: 'wechat', value: 'kunan0226' },
      { label: 'email', value: 'kunan0226@163.com' }
    ],
    action: { label: 'Resume', icon: 'download', disabled: false }
  },
  {
    id: 'huaqiao', period: 'SEP 2020 - JUN 2024', location: 'Xiamen, Fujian',
    category: 'Education', icon: 'graduation-cap', title: 'Huaqiao University', subtitle: '',
    image: 'assets/about/huaqiao.webp', logo: 'assets/about/huaqiao-logo.png',
    items: [],
    tags: ['Top 10% GPA','First-Class Scholarship','IELTS 6.5','CET-6','Class Life Committee','Sangzi WeAssistant','Plant Art Club Lead'],
    action: null
  },
  {
    id: 'keendata', period: 'APR 2025 - AUG 2025', location: 'Shenzhen, Guangdong',
    category: 'Internship', icon: 'briefcase-business', title: 'Keendata',
    subtitle: 'Project Management Intern',
    image: 'assets/about/keendata.webp', logo: 'assets/about/keendata-logo.png',
    items: [],
    tags: ['Big Data Platform','Issue Tracking','Requirements Management','Custom Delivery'],
    action: { label: 'View Details', icon: 'arrow-up-right', disabled: false }
  },
  {
    id: 'polyu', period: 'SEP 2025', location: 'Hung Hom, Hong Kong',
    category: 'Education', icon: 'graduation-cap',
    title: 'The Hong Kong Polytechnic University', subtitle: '',
    image: 'assets/about/polyu.webp', logo: 'assets/about/polyu-logo.png',
    items: [],
    tags: ['QS Top 50','Metaverse','Top 10% GPA'],
    action: null
  },
  {
    id: 'xgrids', period: 'JAN 2026 - MAY 2026', location: 'Shenzhen, Guangdong',
    category: 'Internship', icon: 'scan-line', title: 'XGRIDS',
    subtitle: 'Project Management Intern',
    image: 'assets/about/xgrids.webp', logo: 'assets/about/xgrids-logo.png',
    items: [],
    tags: ['Software Delivery','3D Reconstruction','Spatial Computing'],
    action: { label: 'View Details', icon: 'arrow-up-right', disabled: false }
  },
  {
    id: 'chery', period: 'MAY 2026 - PRESENT', location: 'Wuhu, Anhui',
    category: 'Internship', icon: 'car-front', title: 'CHERY',
    subtitle: 'Project Management Intern',
    image: 'assets/about/chery.webp', logo: 'assets/about/chery-logo.png',
    items: [],
    tags: ['Intelligent Driving','ADSD','Jira Governance','Quality Management','Robotaxi'],
    action: { label: 'View Details', icon: 'arrow-up-right', disabled: false }
  }
];

var carouselAngle = 0;       // 当前旋转角度 (度)
var carouselSpeed = 0;       // 瞬时速度
var carouselTarget = null;   // snap 目标角度
var carouselAuto = true;     // 是否自动旋转
var carouselRAF = null;

function getAboutCardData(card) {
  return getLocalized(card, ABOUT_TRANSLATIONS, card.id);
}

function initAboutMe() {
  var timelineTrack = document.getElementById('timelineTrack');
  var cardsContainer = document.getElementById('aboutCards');
  if (!timelineTrack || !cardsContainer) return;

  // 移动端判断：< 768px 关闭 3D 轮播，使用纯横滑（CSS 已用 !important 覆盖 transform）
  var isMobile = window.innerWidth < 768;

  // ---- 渲染时间线 ----
  ABOUT_CARDS.forEach(function (card, i) {
    var cardText = getAboutCardData(card);
    var btn = document.createElement('button');
    btn.className = 'timeline-node' + (i === 0 ? ' active' : '');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', cardText.title);
    if (i === 0) btn.setAttribute('aria-current', 'step');
    btn.innerHTML =
      '<span class="timeline-dot"></span>' +
      '<span class="timeline-period">' + cardText.period + '</span>' +
      '<span class="timeline-location">' + cardText.location + '</span>';
    btn.addEventListener('click', function () { snapToCard(i); });
    timelineTrack.appendChild(btn);
  });

  // ---- 构建 3D 环绕 wrapper ----
  var wrapper = document.createElement('div');
  wrapper.className = 'carousel-wrapper';
  wrapper.id = 'carouselWrapper';
  cardsContainer.appendChild(wrapper);

  var cardCount = ABOUT_CARDS.length;
  var angleStep = 360 / cardCount;
  var radius = getCarouselRadius(); // translateZ 距离

  function setCardBaseTransforms() {
    var currentRadius = getCarouselRadius();
    wrapper.querySelectorAll('.about-card').forEach(function (cardEl, cardIndex) {
      cardEl.style.transform = 'rotateY(' + (cardIndex * angleStep) + 'deg) translateZ(' + currentRadius + 'px)';
    });
  }

  ABOUT_CARDS.forEach(function (card, i) {
    var cardText = getAboutCardData(card);
    var el = document.createElement('div');
    el.className = 'about-card';
    el.dataset.cardId = card.id;
    el.setAttribute('aria-label', 'Slide ' + (i + 1) + ' of ' + cardCount + ': ' + cardText.title);

    // 初始 transform
    el.style.transform = 'rotateY(' + (i * angleStep) + 'deg) translateZ(' + radius + 'px)';

    // Image
    var imgHTML =
      '<div class="card-image-wrap">' +
        '<img src="' + card.image + '" alt="' + cardText.title + '" loading="eager" decoding="async" fetchpriority="low">' +
        '<span class="card-category">' + cardText.category + '</span>' +
        '<span class="card-number">' + String(i + 1).padStart(2, '0') + '</span>' +
      '</div>';

    // Head: logo or icon
    var headIconHTML = card.logo
      ? '<span class="card-logo-wrap"><img src="' + card.logo + '" alt="" class="card-logo"></span>'
      : '<span class="card-icon-wrap"><i data-lucide="' + card.icon + '" class="card-head-icon"></i></span>';
    var subtitleHTML = cardText.subtitle ? '<p class="card-subtitle">' + cardText.subtitle + '</p>' : '';

    // Items
    var itemsHTML = '';
    if (cardText.items.length > 0) {
      itemsHTML = '<div class="card-info-list">';
      cardText.items.forEach(function (item) {
        itemsHTML +=
          '<div class="card-info-item">' +
            '<i data-lucide="' + item.icon + '"></i>' +
            '<span>' + item.label + '</span>' +
            '<span class="card-info-value">' + item.value + '</span>' +
          '</div>';
      });
      itemsHTML += '</div>';
    } else if (cardText.tags.length > 0) {
      itemsHTML = '<div class="card-items">';
      cardText.tags.forEach(function (tag) {
        if (typeof tag === 'string') {
          itemsHTML += '<span class="card-tag">' + tag + '</span>';
        } else {
          itemsHTML +=
            '<span class="card-tag card-tag-private" tabindex="0" data-private-value="' + tag.value + '">' +
              tag.label +
            '</span>';
        }
      });
      itemsHTML += '</div>';
    }

    // Action
    var actionHTML = '';
    if (card.action) {
      var actionLabel = cardText.action || card.action.label;
      actionHTML =
        '<div class="card-action">' +
          '<button class="card-action-btn"' + (card.action.disabled ? ' disabled title="Coming Soon"' : '') + '>' +
            '<i data-lucide="' + card.action.icon + '"></i>' +
            '<span>' + (card.action.disabled ? (card.action.disabledLabel || 'Coming Soon') : actionLabel) + '</span>' +
          '</button>' +
        '</div>';
    }

    el.innerHTML = imgHTML +
      '<div class="card-body">' +
        '<div class="card-head">' + headIconHTML +
          '<div><h3 class="card-title">' + cardText.title + '</h3>' + subtitleHTML + '</div>' +
        '</div>' +
        itemsHTML +
        actionHTML +
      '</div>';

    wrapper.appendChild(el);
  });

  // Lucide icons
  if (window.lucide) { lucide.createIcons(); }

  // ---- 卡片按钮 ----
  cardsContainer.addEventListener('click', function (e) {
    var btn = e.target.closest('.card-action-btn');
    if (!btn || btn.disabled) return;
    var cardEl = e.target.closest('.about-card');
    if (!cardEl) return;
    var cardId = cardEl.dataset.cardId;

    // Resume 按钮 → 打开下载弹框
    if (cardId === 'base-info') {
      e.preventDefault();
      e.stopPropagation();
      var overlay = document.getElementById('resumeDialogOverlay');
      if (overlay) {
        overlay.classList.add('is-open');
        if (window.lucide) lucide.createIcons();
      }
      return;
    }

    // View Details → 跳转到 Internship 详情
    var internshipIds = ['keendata', 'xgrids', 'chery'];
    if (internshipIds.indexOf(cardId) === -1) return;

    e.preventDefault();
    e.stopPropagation();

    // 滚动到 Internship section
    var internshipSection = document.getElementById('internship');
    if (internshipSection) {
      internshipSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 展开对应实习详情
    var internshipStage = document.getElementById('internshipStage');
    var internshipDetail = document.getElementById('internshipDetail');
    if (internshipStage && internshipDetail) {
      // 延迟打开详情，等滚动到位
      setTimeout(function () {
        openInternshipDetail(cardId, internshipDetail, internshipStage);
      }, 800);
    }
  });

  // ---- 拖拽交互（仅桌面端启用；移动端用浏览器原生横滑） ----
  var dragging = false;
  var lastX = 0;
  var dragVelocity = 0;

  if (!isMobile) {
    cardsContainer.addEventListener('mousedown', function (e) {
      if (e.target.closest('button')) return;
      dragging = true;
      carouselAuto = false;
      carouselTarget = null;
      lastX = e.clientX;
      dragVelocity = 0;
      cardsContainer.classList.add('dragging');
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var delta = e.clientX - lastX;
      carouselAngle += delta * 0.35;
      dragVelocity = delta * 0.35;
      lastX = e.clientX;
      updateCarousel();
    });

    window.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false;
      cardsContainer.classList.remove('dragging');
      // 惯性衰减
      if (Math.abs(dragVelocity) > 0.5) {
        carouselSpeed = dragVelocity * 0.3;
        carouselAuto = true;
      } else {
        carouselAuto = true;
        carouselSpeed = 0;
      }
    });

    // 滚轮：横向滚动/触控板手势旋转轮播，纵向滚动留给页面滚动容器
    cardsContainer.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.6) {
        e.preventDefault();
        carouselAuto = false;
        carouselTarget = null;
        carouselAngle += e.deltaX * 0.3 + e.deltaY * 0.08;
        carouselSpeed = 0;
        updateCarousel();
        clearTimeout(cardsContainer._wheelTimeout);
        cardsContainer._wheelTimeout = setTimeout(function () { carouselAuto = true; }, 1500);
      }
    }, { passive: false });
  }

  // 触控：移动端不拦截（让浏览器原生横滑生效），桌面端保留以兼容触屏笔记本
  if (!isMobile) {
    var touchStartX = 0;
    cardsContainer.addEventListener('touchstart', function (e) {
      if (e.target.closest('button')) return;
      carouselAuto = false;
      carouselTarget = null;
      touchStartX = e.touches[0].clientX;
      lastX = touchStartX;
      dragVelocity = 0;
      cardsContainer.classList.add('dragging');
    }, { passive: true });

    cardsContainer.addEventListener('touchmove', function (e) {
      if (!cardsContainer.classList.contains('dragging')) return;
      var delta = e.touches[0].clientX - lastX;
      carouselAngle += delta * 0.35;
      dragVelocity = delta * 0.35;
      lastX = e.touches[0].clientX;
      updateCarousel();
    }, { passive: true });

    cardsContainer.addEventListener('touchend', function () {
      cardsContainer.classList.remove('dragging');
      if (Math.abs(dragVelocity) > 0.5) {
        carouselSpeed = dragVelocity * 0.3;
        carouselAuto = true;
      } else {
        carouselAuto = true;
        carouselSpeed = 0;
      }
    });
  }

  // ---- 自动旋转 loop（仅桌面端运行；移动端用浏览器原生滚动） ----
  if (!isMobile) {
    function carouselLoop() {
      if (carouselTarget !== null) {
        // snap 动画
        var diff = carouselTarget - carouselAngle;
        if (Math.abs(diff) < 0.3) {
          carouselAngle = carouselTarget;
          carouselTarget = null;
          carouselAuto = true;
          carouselSpeed = 0;
        } else {
          carouselAngle += diff * 0.08;
        }
      } else if (carouselAuto) {
        // 慢速自动旋转
        carouselSpeed += (0.015 - carouselSpeed) * 0.02;
        carouselAngle += carouselSpeed;
      }

      // 惯性衰减
      if (!carouselAuto && carouselTarget === null) {
        carouselSpeed *= 0.95;
        carouselAngle += carouselSpeed;
      }

      updateCarousel();
      carouselRAF = requestAnimationFrame(carouselLoop);
    }
    carouselLoop();

    window.addEventListener('resize', function () {
      setCardBaseTransforms();
      updateCarousel();
    });
  } else {
    // 移动端：监听 scroll 让时间线 active 跟随当前可见卡片
    var mobileNodeMap = [];
    timelineTrack.querySelectorAll('.timeline-node').forEach(function (n, idx) {
      mobileNodeMap.push({ node: n, index: idx });
    });
    function updateMobileActive() {
      // 取最接近视口中心的卡片作为 active
      var center = cardsContainer.scrollLeft + cardsContainer.clientWidth / 2;
      var closestIdx = 0;
      var closestDist = Infinity;
      var cards = wrapper.querySelectorAll('.about-card');
      cards.forEach(function (c, idx) {
        var r = c.offsetLeft + c.offsetWidth / 2;
        var d = Math.abs(r - center);
        if (d < closestDist) { closestDist = d; closestIdx = idx; }
      });
      mobileNodeMap.forEach(function (m) {
        m.node.classList.toggle('active', m.index === closestIdx);
        if (m.index === closestIdx) {
          m.node.setAttribute('aria-current', 'step');
        } else {
          m.node.removeAttribute('aria-current');
        }
      });
    }
    cardsContainer.addEventListener('scroll', updateMobileActive, { passive: true });
    updateMobileActive();
  }

  // ---- IntersectionObserver: 离开 HOME 时隐藏提示 ----
  if (window.IntersectionObserver) {
    var aboutSection = document.getElementById('about');
    var internshipSection = document.getElementById('internship');
    var projectsSection = document.getElementById('projects');
    var skillsLearningSection = document.getElementById('skills-learning');

    function hideHomeHints() {
      var ih = document.getElementById('interactHint');
      var eh = document.getElementById('easterEggHint');
      if (ih) ih.classList.add('is-hidden-by-about');
      if (eh) eh.classList.add('is-hidden-by-about');
    }

    var aboutObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          hideHomeHints();
          stabilizeAboutCarousel();
        }
      });
    }, { threshold: [0.5] });
    if (aboutSection) aboutObserver.observe(aboutSection);

    // Also hide hints on Internship section
    if (internshipSection) {
      var internObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            hideHomeHints();
          }
        });
      }, { threshold: [0.3] });
      internObserver.observe(internshipSection);
    }

    // Also hide hints on Projects section
    if (projectsSection) {
      var projObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            hideHomeHints();
          }
        });
      }, { threshold: [0.3] });
      projObserver.observe(projectsSection);
    }

    if (skillsLearningSection) {
      var skillsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            hideHomeHints();
          }
        });
      }, { threshold: [0.3] });
      skillsObserver.observe(skillsLearningSection);
    }

    // Show hints again when back on HOME
    var homeSection = document.getElementById('home');
    if (homeSection) {
      var homeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            var ih = document.getElementById('interactHint');
            var eh = document.getElementById('easterEggHint');
            if (ih) ih.classList.remove('is-hidden-by-about');
            if (eh) eh.classList.remove('is-hidden-by-about');
          }
        });
      }, { threshold: [0.5] });
      homeObserver.observe(homeSection);
    }
  }
}

function getCurrentAboutFrontIndex() {
  var cardCount = ABOUT_CARDS.length;
  var angleStep = 360 / cardCount;
  var norm = ((carouselAngle % 360) + 360) % 360;
  var index = Math.round((360 - norm) / angleStep) % cardCount;
  return index < 0 ? index + cardCount : index;
}

function refreshAboutLanguage() {
  if (!Array.isArray(ABOUT_CARDS)) return;
  var timelineTrack = document.getElementById('timelineTrack');
  var wrapper = document.getElementById('carouselWrapper');
  if (timelineTrack) {
    timelineTrack.querySelectorAll('.timeline-node').forEach(function (node, index) {
      var card = ABOUT_CARDS[index];
      if (!card) return;
      var cardText = getAboutCardData(card);
      node.setAttribute('aria-label', cardText.title);
      var period = node.querySelector('.timeline-period');
      var location = node.querySelector('.timeline-location');
      if (period) period.textContent = cardText.period;
      if (location) location.textContent = cardText.location;
    });
  }
  if (!wrapper) return;
  wrapper.querySelectorAll('.about-card').forEach(function (cardEl, index) {
    var card = ABOUT_CARDS[index];
    if (!card) return;
    var cardText = getAboutCardData(card);
    cardEl.setAttribute('aria-label', (currentLanguage === 'zh' ? '第 ' + (index + 1) + ' / ' + ABOUT_CARDS.length + ' 张：' : 'Slide ' + (index + 1) + ' of ' + ABOUT_CARDS.length + ': ') + cardText.title);
    var image = cardEl.querySelector('.card-image-wrap img');
    var category = cardEl.querySelector('.card-category');
    var title = cardEl.querySelector('.card-title');
    var subtitle = cardEl.querySelector('.card-subtitle');
    var items = cardEl.querySelector('.card-items');
    var actionLabel = cardEl.querySelector('.card-action-btn span');
    if (image) image.alt = cardText.title;
    if (category) category.textContent = cardText.category;
    if (title) title.textContent = cardText.title;
    if (subtitle) subtitle.textContent = cardText.subtitle || '';
    if (items) {
      items.innerHTML = '';
      cardText.tags.forEach(function (tag) {
        var span = document.createElement('span');
        span.className = typeof tag === 'string' ? 'card-tag' : 'card-tag card-tag-private';
        if (typeof tag === 'string') {
          span.textContent = tag;
        } else {
          span.tabIndex = 0;
          span.dataset.privateValue = tag.value;
          span.textContent = tag.label;
        }
        items.appendChild(span);
      });
    }
    if (actionLabel && card.action && !card.action.disabled) {
      actionLabel.textContent = cardText.action || card.action.label;
    }
  });
}

function stabilizeAboutCarousel() {
  if (window.innerWidth < 769) return;
  var index = getCurrentAboutFrontIndex();
  snapToCard(index);
}

function updateCarousel() {
  var wrapper = document.getElementById('carouselWrapper');
  if (!wrapper) return;

  var cardCount = ABOUT_CARDS.length;
  var angleStep = 360 / cardCount;
  // 归一化角度
  var norm = ((carouselAngle % 360) + 360) % 360;

  // 找到最接近正前方的卡片
  var frontIndex = Math.round((360 - norm) / angleStep) % cardCount;
  if (frontIndex < 0) frontIndex += cardCount;

  // 更新 wrapper 旋转
  wrapper.style.transform = 'rotateY(' + carouselAngle + 'deg)';

  // 更新每张卡片的角度感知（用于 front class）
  var cards = wrapper.querySelectorAll('.about-card');
  cards.forEach(function (el, i) {
    // 计算这张卡当前在视线中的偏移角
    var cardAngle = ((i * angleStep + norm) % 360 + 360) % 360;
    if (cardAngle > 180) cardAngle -= 360;

    // 是否在前面
    var isFront = Math.abs(cardAngle) < angleStep / 2 + 1;
    el.classList.toggle('front', isFront);

    // 透明度：前方最亮，后方渐暗
    var absAngle = Math.abs(cardAngle);
    var opacity = absAngle < 90 ? 1 - (absAngle / 90) * 0.55 : 0.45 - ((absAngle - 90) / 90) * 0.25;
    el.style.opacity = Math.max(0.2, opacity);
  });

  // 更新时间线高亮
  var nodes = document.querySelectorAll('#timelineTrack .timeline-node');
  nodes.forEach(function (node, i) {
    node.classList.toggle('active', i === frontIndex);
    if (i === frontIndex) {
      node.setAttribute('aria-current', 'step');
    } else {
      node.removeAttribute('aria-current');
    }
  });
}

function getCarouselRadius() {
  var width = window.innerWidth || 1200;
  if (width < 560) return 170;
  if (width < 900) return 240;
  return Math.min(360, Math.max(300, width * 0.24));
}

function snapToCard(index) {
  // 移动端：原生滚动到对应卡片
  if (window.innerWidth < 768) {
    var cardsContainer = document.getElementById('aboutCards');
    if (cardsContainer) {
      var card = cardsContainer.querySelectorAll('.about-card')[index];
      if (card) {
        var left = card.offsetLeft - (cardsContainer.clientWidth - card.offsetWidth) / 2;
        cardsContainer.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      }
    }
    return;
  }
  var angleStep = 360 / ABOUT_CARDS.length;
  var baseTarget = -index * angleStep;
  carouselTarget = baseTarget + Math.round((carouselAngle - baseTarget) / 360) * 360;
  carouselAuto = false;
}

var SKILLS_LEARNING_CARDS = [
  {
    index: '01', kind: 'skill', faceLabel: 'Skill 01', backLabel: 'Skill', accent: '#8f7df4',
    title: 'Scrum',
    description: 'Sprint planning, daily syncs, reviews and retrospectives with a delivery-first rhythm.'
  },
  {
    index: '02', kind: 'skill', faceLabel: 'Skill 02', backLabel: 'Showcase Skill', accent: '#e99ad6',
    title: 'AI Video Production',
    description: 'Prompt-led storyboards, generated visuals, editing and narrative assembly.',
    marker: 'VIDEO', showcase: 'ai-video'
  },
  {
    index: 'L1', kind: 'learning', faceLabel: 'Learning 01', backLabel: 'Learning', accent: '#79b7e8',
    title: 'Product Strategy',
    description: 'Connecting market signals, user value and business trade-offs.'
  },
  {
    index: '03', kind: 'skill', faceLabel: 'Skill 03', backLabel: 'Skill', accent: '#a579e8',
    title: 'Project Management',
    description: 'Turning ambiguous goals into owners, milestones, risks and decisions.'
  },
  {
    index: '04', kind: 'skill', faceLabel: 'Skill 04', backLabel: 'Skill', accent: '#f0a4c9',
    title: 'Cross-functional Collaboration',
    description: 'Keeping product, design, engineering and stakeholders aligned.'
  },
  {
    index: 'L2', kind: 'learning', faceLabel: 'Learning 02', backLabel: 'Learning', accent: '#6ebbc6',
    title: 'Generative AI Workflows',
    description: 'Testing agents, multimodal tools and repeatable AI-assisted systems.'
  },
  {
    index: '05', kind: 'skill', faceLabel: 'Skill 05', backLabel: 'Skill', accent: '#7aa7e9',
    title: 'Data Analysis',
    description: 'Using metrics, issue patterns and delivery signals for clearer decisions.'
  },
  {
    index: '06', kind: 'skill', faceLabel: 'Skill 06', backLabel: 'Skill', accent: '#ba8ed2',
    title: '3D & Spatial Computing',
    description: 'Hands-on exposure to reconstruction, SLAM and digital-twin workflows.'
  },
  {
    index: 'GO', kind: 'play', faceLabel: 'Play', backLabel: 'Memory Game', accent: '#e7b34f',
    title: 'Me & My Friends',
    description: 'Six pairs of people, places and little adventures.',
    marker: 'PLAY', target: 'travel-memory'
  }
];

function getSkillCardData(item, index) {
  return getLocalized(item, SKILL_TRANSLATIONS, String(index));
}

function initSkillsLearning() {
  var grid = document.getElementById('skillsLearningGrid');
  if (!grid || grid.dataset.initialized === 'true') return;
  grid.dataset.initialized = 'true';
  var showcaseAPI = initSkillShowcaseWindow();
  var confirmAPI = initSkillActionConfirm();

  SKILLS_LEARNING_CARDS.forEach(function (item, itemIndex) {
    var cardText = getSkillCardData(item, itemIndex);
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'skill-flip-card' + (item.kind === 'play' ? ' skill-play-card' : '') + (item.showcase ? ' has-showcase' : '');
    card.dataset.kind = item.kind;
    card.dataset.cardIndex = String(itemIndex);
    if (item.showcase) card.dataset.showcase = item.showcase;
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', t('skills.reveal') + ' ' + cardText.title);
    card.style.setProperty('--card-accent', item.accent);

    var inner = document.createElement('span');
    inner.className = 'skill-flip-inner';

    var front = document.createElement('span');
    front.className = 'skill-flip-face skill-flip-front';
    var frontType = document.createElement('span');
    frontType.className = 'skill-card-type';
    frontType.textContent = cardText.faceLabel;
    var question = document.createElement('span');
    question.className = 'skill-card-question';
    question.textContent = '?';
    var index = document.createElement('span');
    index.className = 'skill-card-index';
    index.textContent = item.index;
    front.append(frontType, question, index);

    var back = document.createElement('span');
    back.className = 'skill-flip-face skill-flip-back';
    var backType = document.createElement('span');
    backType.className = 'skill-card-type';
    backType.textContent = cardText.backLabel;
    var title = document.createElement('strong');
    title.textContent = cardText.title;
    var description = document.createElement('span');
    description.className = 'skill-card-description';
    description.textContent = cardText.description;
    back.append(backType, title, description);

    if (item.marker) {
      var marker = document.createElement('span');
      marker.className = 'skill-showcase-mark';
      marker.textContent = item.marker;
      back.appendChild(marker);
    }

    inner.append(front, back);
    card.appendChild(inner);
    card.addEventListener('click', function () {
      var isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
      card.setAttribute('aria-label', (isFlipped ? t('skills.hide') : t('skills.reveal')) + ' ' + getSkillCardData(item, itemIndex).title);
      if (isFlipped && item.showcase && showcaseAPI && confirmAPI) {
        window.setTimeout(function () {
          if (!card.classList.contains('is-flipped')) return;
          confirmAPI.open({
            action: 'video',
            kicker: t('skills.videoKicker'),
            title: t('skills.videoTitle'),
            text: t('skills.videoText'),
            confirmLabel: t('skills.videoConfirm'),
            cancelLabel: t('skills.videoCancel'),
            onConfirm: showcaseAPI.open
          });
        }, 420);
      }
      if (isFlipped && item.target && confirmAPI) {
        window.setTimeout(function () {
          if (!card.classList.contains('is-flipped')) return;
          confirmAPI.open({
            action: 'play',
            kicker: t('skills.playKicker'),
            title: t('skills.playTitle'),
            text: t('skills.playText'),
            confirmLabel: t('skills.playConfirm'),
            cancelLabel: t('skills.playCancel'),
            onConfirm: function () {
              var target = document.getElementById(item.target);
              if (window.travelMemoryGame) window.travelMemoryGame.reset();
              if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }, 420);
      }
    });
    grid.appendChild(card);
  });
}

function refreshSkillsLanguage() {
  if (!Array.isArray(SKILLS_LEARNING_CARDS)) return;
  var grid = document.getElementById('skillsLearningGrid');
  if (!grid) return;
  grid.querySelectorAll('.skill-flip-card').forEach(function (card) {
    var index = Number(card.dataset.cardIndex);
    var item = SKILLS_LEARNING_CARDS[index];
    if (!item) return;
    var cardText = getSkillCardData(item, index);
    var faceType = card.querySelector('.skill-flip-front .skill-card-type');
    var backType = card.querySelector('.skill-flip-back .skill-card-type');
    var title = card.querySelector('.skill-flip-back strong');
    var description = card.querySelector('.skill-card-description');
    if (faceType) faceType.textContent = cardText.faceLabel;
    if (backType) backType.textContent = cardText.backLabel;
    if (title) title.textContent = cardText.title;
    if (description) description.textContent = cardText.description;
    card.setAttribute('aria-label', (card.classList.contains('is-flipped') ? t('skills.hide') : t('skills.reveal')) + ' ' + cardText.title);
  });
}

function initSkillActionConfirm() {
  var overlay = document.getElementById('skillActionConfirm');
  var dialog = overlay && overlay.querySelector('.skill-action-confirm-dialog');
  var kicker = document.getElementById('skillActionConfirmKicker');
  var title = document.getElementById('skillActionConfirmTitle');
  var text = document.getElementById('skillActionConfirmText');
  var cancelButton = document.getElementById('skillActionConfirmCancel');
  var submitButton = document.getElementById('skillActionConfirmSubmit');
  if (!overlay || !dialog || !kicker || !title || !text || !cancelButton || !submitButton) return null;
  if (overlay._confirmAPI) return overlay._confirmAPI;

  var confirmAction = null;
  var lastFocused = null;

  function close(confirmed) {
    if (!overlay.classList.contains('is-open')) return;
    var action = confirmed ? confirmAction : null;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    confirmAction = null;
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
    lastFocused = null;
    if (action) window.setTimeout(action, 0);
  }

  function open(options) {
    lastFocused = document.activeElement;
    overlay.dataset.action = options.action || 'default';
    kicker.textContent = options.kicker || t('confirm.kicker');
    title.textContent = options.title || t('confirm.title');
    text.textContent = options.text || t('confirm.text');
    cancelButton.textContent = options.cancelLabel || t('confirm.cancel');
    submitButton.textContent = options.confirmLabel || t('confirm.submit');
    confirmAction = typeof options.onConfirm === 'function' ? options.onConfirm : null;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(function () { cancelButton.focus(); });
  }

  cancelButton.addEventListener('click', function () { close(false); });
  submitButton.addEventListener('click', function () { close(true); });
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) close(false);
  });
  dialog.addEventListener('click', function (event) { event.stopPropagation(); });
  document.addEventListener('keydown', function (event) {
    if (!overlay.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close(false);
      return;
    }
    if (event.key !== 'Tab') return;
    var focusable = [cancelButton, submitButton];
    var currentIndex = focusable.indexOf(document.activeElement);
    if (event.shiftKey && currentIndex <= 0) {
      event.preventDefault();
      submitButton.focus();
    } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
      event.preventDefault();
      cancelButton.focus();
    }
  });

  overlay._confirmAPI = { open: open, close: close };
  return overlay._confirmAPI;
}

function initSkillShowcaseWindow() {
  var panel = document.getElementById('skillShowcaseWindow');
  var handle = document.getElementById('skillShowcaseDragHandle');
  var closeButton = document.getElementById('skillShowcaseClose');
  var video = document.getElementById('skillShowcaseVideo');
  var playToggle = document.getElementById('skillShowcasePlayToggle');
  var playGlyph = document.getElementById('skillShowcasePlayGlyph');
  var empty = document.getElementById('skillShowcaseEmpty');
  var emptyText = document.getElementById('skillShowcaseEmptyText');
  var status = document.getElementById('skillShowcaseStatus');
  if (!panel || !handle || !closeButton || !video || !playToggle || !playGlyph || !empty || !emptyText || !status) return null;

  var dragState = null;
  var videoPrepared = false;

  function clampPosition(left, top) {
    var panelWidth = panel.offsetWidth;
    var panelHeight = panel.offsetHeight;
    var nav = document.getElementById('mainNavbar');
    var minTop = nav ? nav.getBoundingClientRect().height + 8 : 8;
    var maxLeft = Math.max(8, window.innerWidth - panelWidth - 8);
    var maxTop = Math.max(minTop, window.innerHeight - panelHeight - 8);
    panel.style.left = Math.min(Math.max(8, left), maxLeft) + 'px';
    panel.style.top = Math.min(Math.max(minTop, top), maxTop) + 'px';
  }

  function centerPanel() {
    var panelWidth = panel.offsetWidth;
    var panelHeight = panel.offsetHeight;
    clampPosition((window.innerWidth - panelWidth) / 2, (window.innerHeight - panelHeight) / 2);
  }

  function setEmptyState(message, nextStatus) {
    panel.classList.remove('has-media');
    playToggle.classList.remove('is-playing');
    playGlyph.textContent = '\u25b6';
    playToggle.setAttribute('aria-label', t('showcase.playAria'));
    emptyText.textContent = message;
    status.textContent = nextStatus;
  }

  function prepareVideo() {
    if (videoPrepared) return;
    var source = (panel.dataset.videoSrc || '').trim();
    if (!source) {
      setEmptyState(t('showcase.emptyText'), t('showcase.statusReadyToLoad'));
      return;
    }

    videoPrepared = true;
    video.preload = 'auto';
    setEmptyState(t('showcase.buffering'), t('showcase.statusPreloading'));
    video.src = source;
    video.load();
  }

  function open() {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    closeButton.tabIndex = 0;
    if (!panel.dataset.positioned) {
      panel.dataset.positioned = 'true';
      window.requestAnimationFrame(centerPanel);
    } else {
      clampPosition(parseFloat(panel.style.left) || 0, parseFloat(panel.style.top) || 0);
    }
    prepareVideo();
    if (video.readyState >= 2) {
      panel.classList.add('has-media');
      status.textContent = video.readyState >= 4 ? t('showcase.statusReady') : t('showcase.statusPlayable');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function close() {
    panel.classList.remove('is-open', 'is-dragging');
    panel.setAttribute('aria-hidden', 'true');
    closeButton.tabIndex = -1;
    video.pause();
    playToggle.classList.remove('is-playing');
    playGlyph.textContent = '\u25b6';
    playToggle.setAttribute('aria-label', t('showcase.playAria'));
    dragState = null;
  }

  function endDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    dragState = null;
    panel.classList.remove('is-dragging');
    if (handle.hasPointerCapture && handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
  }

  function moveDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    clampPosition(event.clientX - dragState.offsetX, event.clientY - dragState.offsetY);
  }

  handle.addEventListener('pointerdown', function (event) {
    if (event.target.closest('button')) return;
    var rect = panel.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    panel.classList.add('is-dragging');
    if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  handle.addEventListener('pointermove', moveDrag);
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
  window.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  closeButton.addEventListener('click', close);
  playToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    if (video.paused) {
      video.play().catch(function () { status.textContent = t('showcase.statusControls'); });
    } else {
      video.pause();
    }
  });
  video.addEventListener('loadeddata', function () {
    panel.classList.add('has-media');
    status.textContent = t('showcase.statusPlayable');
  });
  video.addEventListener('canplaythrough', function () {
    panel.classList.add('has-media');
    status.textContent = t('showcase.statusReady');
  });
  video.addEventListener('play', function () {
    playToggle.classList.add('is-playing');
    playGlyph.textContent = '\u23f8';
    playToggle.setAttribute('aria-label', t('showcase.pauseAria'));
  });
  video.addEventListener('pause', function () {
    playToggle.classList.remove('is-playing');
    playGlyph.textContent = '\u25b6';
    playToggle.setAttribute('aria-label', t('showcase.playAria'));
  });
  video.addEventListener('error', function () {
    setEmptyState(t('showcase.couldNotLoad'), t('showcase.statusCheckSource'));
  });
  panel.addEventListener('pointerdown', function () { panel.style.zIndex = '1201'; });
  window.addEventListener('resize', function () {
    if (panel.classList.contains('is-open')) {
      clampPosition(parseFloat(panel.style.left) || 0, parseFloat(panel.style.top) || 0);
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) close();
  });

  var preloadTrigger = document.getElementById('internship');
  var scrollRoot = document.getElementById('scrollContainer');
  if (preloadTrigger && 'IntersectionObserver' in window) {
    var preloadObserver = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      prepareVideo();
      preloadObserver.disconnect();
    }, {
      root: scrollRoot,
      rootMargin: '50% 0px',
      threshold: 0.01
    });
    preloadObserver.observe(preloadTrigger);
  } else {
    window.setTimeout(prepareVideo, 5000);
  }

  return { open: open, close: close, prepare: prepareVideo };
}

// ---- 简历下载弹框 ----
(function initResumeDialog() {
  var overlay = document.getElementById('resumeDialogOverlay');
  if (!overlay) return;
  // 关闭按钮
  var closeBtn = document.getElementById('resumeDialogClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      overlay.classList.remove('is-open');
    });
  }
  // 点击遮罩关闭
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) overlay.classList.remove('is-open');
  });
  // Escape 关闭
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      overlay.classList.remove('is-open');
    }
  });
})();

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    initAboutMe();
    initInternshipJourney();
    initProjects();
    initSkillsLearning();
  });
} else {
  initAboutMe();
  initInternshipJourney();
  initProjects();
  initSkillsLearning();
}
