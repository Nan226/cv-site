# Projects 页面详细 PRD

## 1. 文档信息

| 项目 | 内容 |
|---|---|
| 页面名称 | Projects |
| 页面主题 | Project Showcase |
| 原始需求来源 | 用户基于现有 HOME/About/Internship 设计系统，要求设计 Projects section 大框架 |
| 参考素材目录 | `images/Projects/`（待用户提供项目封面图） |
| 输出用途 | 交给 Claude Code 作为实现依据 |
| 当前状态 | 详细设计稿，项目正文内容后续可由用户补充 |

## 2. 页面定位

Projects 页面用于展示 Ye Nan 的项目作品集，涵盖技术项目、学术项目、创意项目和专业项目四大类别。页面不做传统简历式列表，而是做成 **"Gallery Grid with Morph Expansion"** 的交互体验：

用户进入页面后看到一张响应式 CSS Grid 卡片网格，每张卡片展示封面图、标题、类别标签和一句话简述。hover 时卡片微升 + 图片微缩放。点击任意卡片后，该卡片在网格中原地 morph 展开为完整详情视图（描述、技术栈、链接、成果），其余卡片淡出模糊。点击关闭按钮/遮罩/Esc 后卡片收缩回原位，网格恢复。

与 About Me（3D 环绕轮播）和 Internship（水彩撕裂 + 翻转卡牌）形成明确差异化，三个 section 各有一种独立的视觉记忆点。

## 3. 目标与非目标

### 3.1 目标

- 新增 `#projects` 页面分区，导航栏 `Projects` 可平滑跳转。
- 首屏呈现 `Project Showcase` 标题和响应式卡片网格。
- 桌面 ≥3 列，平板 2 列，移动端 1 列。
- 卡片：封面图 + 类别标签 + 标题 + 简述。
- hover 微动效（上浮 + 阴影 + 图片缩放）。
- 类别筛选条（All / Technical / Academic / Creative / Professional）。
- 点击卡片 → morph 展开为详情视图，其余卡片淡出模糊。
- 展开状态可通过关闭按钮、点击遮罩、Escape 关闭。
- 桌面和移动端都不出现遮挡、溢出或布局失控。

### 3.2 非目标

- 不填写完整项目成果细节（占位数据）。
- 不制作 Skills、Learning 页面。
- 不引入新框架（React、Vue、GSAP 等）。
- 不修改 HOME 3D 娃娃、About Me 轮播、Internship 状态机。

## 4. 视觉风格

- 背景：白底蓝粉淡渐变，与现有 section 无缝衔接。
- 卡片：白色/半透明底（`rgba(255,255,255,0.85)`），顶部 3-4px 类别色条区分类别：
  - Technical → 紫色 `#8738e0`
  - Academic → 蓝色 `#7aa7e9`
  - Creative → 粉色 `#eca1ca`
  - Professional → 紫粉渐变
- 卡片圆角：16-20px。
- 阴影：柔和漂浮感，紫调。
- 字体：沿用现有体系；标题使用渐变 text-clip 风格。

## 5. 页面结构

```html
<section id="projects" class="page-section projects-section">
  <div class="projects-stage" id="projectsStage">
    <div class="projects-header">
      <h2>Project Showcase</h2>
      <p>Ideas turned into reality</p>
      <!-- 筛选条 -->
    </div>
    <div class="projects-grid" id="projectsGrid">
      <!-- JS 动态渲染卡片 -->
    </div>
    <!-- 展开遮罩 + 详情 (JS 动态创建) -->
  </div>
</section>
```

## 6. 文案规范

| 位置 | 文案 |
|---|---|
| 主标题 | `Project Showcase` |
| 副标题 | `Ideas turned into reality` |
| 筛选标签 | `All` / `Technical` / `Academic` / `Creative` / `Professional` |
| 关闭按钮 | `Close` |

### 建议初始数据（8个项目，占位）

| # | 标题 | 类别 | 时间 | 简述 |
|---|---:|---|---|---|
| 1 | AI Research Assistant | Technical | 2025 | LLM-powered research tool for automated literature review. |
| 2 | Personal Portfolio Site | Technical | 2026 | Interactive 3D portfolio website from scratch. |
| 3 | Metaverse Campus Explorer | Academic | 2025 | Virtual campus walkthrough with Unity and spatial mapping. |
| 4 | PM Workflow Automator | Professional | 2025 | Automated Jira-Notion sync and sprint reporting workflows. |
| 5 | Data Viz Dashboard | Technical | 2025 | Interactive dashboard for multi-source project metrics. |
| 6 | Digital Art Collection | Creative | 2024 | Generative art pieces exploring color theory and AI. |
| 7 | CS Research Paper | Academic | 2024 | Deep learning in urban planning — published at symposium. |
| 8 | Community Event Platform | Professional | 2024 | Digital infrastructure for 200+ attendee hackathon. |

## 7. 交互流程

### 7.1 默认状态：Grid Overview

- Section 进入视口 → 标题渐变淡入
- 卡片从下方 stagger 淡入（每张间隔 60-80ms）
- 类别筛选条默认选中 `All`

### 7.2 类别筛选

- 点击 pill → 非匹配卡片缩小淡出（scale 0.92, opacity 0）
- 匹配卡片保持原位
- 点击 `All` 恢复全部
- 空状态显示：`No projects in this category yet.`

### 7.3 Hover/Focus

- 卡片上浮 6-8px，阴影增强，封面图 scale 1.04
- transition 280-350ms ease-out
- 键盘 Tab 移动焦点，Enter/Space 展开

### 7.4 Morph Expansion（核心交互）

点击卡片 → 3 阶段动画（总时长 500-650ms）：

**阶段一 (0-150ms)：** 获取卡片位置 → 脱离网格流(fixed定位) → 其余卡片 fade out + blur

**阶段二 (150-450ms)：** 卡片 morph 到视口中央 → 尺寸扩大为 `min(72vw, 900px)` × `max 78vh` → 内部布局切换（封面→顶部横幅，下方展开详情）

**阶段三 (450-650ms)：** 详情内容 fade in + slide up → 关闭按钮出现 → 焦点移入

展开内容结构：封面横幅 → 类别+时间 → 全称 → 详细描述 → 标签 → 链接按钮 → 成果列表 → 关闭按钮

### 7.5 关闭

- 关闭按钮 / 点击遮罩 / Escape 键
- 逆向 morph：内容收起 → 卡片缩回 → 移回网格原位 → 其余卡片恢复清晰
- 总时长 380-480ms
- 焦点返回原卡片

## 8. 数据结构

```js
var PROJECTS = [
  {
    id: 'ai-research-assistant',
    title: 'AI Research Assistant',
    category: 'technical',
    period: '2025',
    thumbnail: 'images/Projects/project-01.jpg',
    summary: 'Built an LLM-powered research tool for automated literature review.',
    description: '...',
    tags: ['Python', 'LangChain', 'OpenAI API', 'Streamlit'],
    links: [{ label: 'View on GitHub', icon: 'github', url: '#' }],
    highlights: ['...']
  },
  // ... 7 more
];
```

## 9. 桌面布局

- Section: 100vh, padding-top: 6.5vh
- 标题区: 12-15% 高度
- 主标题: `clamp(2.15rem, 4.4vw, 3.8rem)`, 900 weight, 渐变 text-clip
- 筛选条: pill 按钮, border-radius 999px, 0.65rem
- 网格: `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`, gap 18-28px
- 卡片: min 240px, max 320px, 封面 16:10
- 展开: width min(72vw, 900px), max-height 78vh, position fixed 居中

## 10. 移动端 (≤768px)

- 标题缩小
- 筛选条横向滚动
- 网格单列，卡片 min(88vw, 360px)
- 展开占 92vw × 80vh
- 支持下滑手势关闭

## 11. 动效约束

- hover: 280-350ms ease-out
- stagger入场: 60-80ms/张
- morph展开: 500-650ms cubic-bezier(0.22, 0.61, 0.36, 1)
- 关闭: 380-480ms
- 筛选切换: 300-400ms
- prefers-reduced-motion: 全部降级为 instant

## 12. 实现建议

- JS: `initProjects()`, `buildProjectsGrid()`, `filterProjects()`, `expandProject()`, `collapseProject()`
- 展开使用 FLIP 技术 (getBoundingClientRect → fixed定位 → transition morph)
- 更新 sectionMap: `'Projects': 'projects'`
- IntersectionObserver 触发卡片入场动画
- 展开时 aria-modal="true" + role="dialog"
- 封面图 loading="lazy", <150KB, 推荐 WebP

## 13. 与技术页面的衔接

- 4个 section 共用 `.scroll-container` + scroll-snap
- 不改变 HOME/About/Internship 已有逻辑
- Projects 作为第4个 section，在 Internship 下方自然承接
- 后续 About Me `View Details` 可跨 section 跳转到特定项目

## 14. 验收标准

- 导航 `Projects` 平滑跳转到 `#projects`
- 标题、筛选条、卡片网格正常显示
- 筛选功能正常工作，动画平滑
- 卡片 hover 效果正常
- 展开/关闭 morph 动画流畅
- 桌面 3-4 列，移动端 1 列
- 键盘导航完整（Tab/Enter/Escape/方向键）
- prefers-reduced-motion 降级正常
- node --check 通过，控制台无报错

## 15. 待用户补充

- 8 个项目的真实名称、描述、封面图、标签、链接、成果
- 封面图是否用 CSS 渐变占位还是真实图片
- 类别分类是否准确，是否增减类别
- 链接按钮的实际 URL
- 是否需要展开态的项目间前后切换箭头
- 移动端下滑关闭的灵敏度偏好
