# Internship 页面详细 PRD

## 1. 文档信息

| 项目 | 内容 |
|---|---|
| 页面名称 | Internship |
| 页面主题 | Internship Journey |
| 原始需求来源 | `images/PRD/Internship --- Prd.md` |
| 参考素材目录 | `images/Internship/` |
| 输出用途 | 交给 Claude Code 作为实现依据 |
| 当前状态 | 详细设计稿，实习正文内容后续可继续补充 |

## 2. 页面定位

Internship 页面用于承接 About Me 中的三段实习卡片，展示 Ye Nan 的实习经历路径。页面不做传统简历列表，而是做成“水彩卡牌展开”的交互体验：进入页面时先出现一张中心图片，随后分裂成三张 5:7 卡牌；卡牌翻转后露出公司名称和英文简介；点击任意卡牌后，卡牌移动到左侧，右侧展开对应公司的详细实习经历。

页面气质需要延续 HOME 和 About Me 的浅色蓝粉背景，不要突然变成深色页面。深粉、蓝、紫只用于卡牌本身和局部强调，整体仍保持轻、白、透气。

## 3. 目标与非目标

### 3.1 目标

- 新增一个完整的 `#internship` 页面分区，并让导航栏 `Internship` 可以平滑跳转到该分区。
- 首屏呈现 `Internship Journey` 标题和水彩开场动画。
- 开场中心视觉由 `images/Internship/卡片1.jpg`、`卡片2.jpg`、`卡片3.jpg` 横向拼合成一张宽图，像三张卡片暂时合在一起。
- `images/Internship/主页面.jpg` 只作为非常淡的背景纹理使用，不作为开场主卡图。
- 三张卡片长宽比固定为 `5:7`。
- 卡片翻转后显示公司名称、职位、英文简介和标签。
- 点击卡片后进入“左侧选中卡片 + 右侧详情面板”的状态。
- 详情内容允许先以结构化占位呈现，后续再填真实经历。
- 桌面和移动端都不能出现明显遮挡、文字溢出或布局失控。

### 3.2 非目标

- 本阶段不需要填写完整实习成果细节。
- 本阶段不需要制作 Projects、Skills、Learning 页面。
- 本阶段不需要更换技术栈，不新增 React、Vue、GSAP 等框架。
- 本阶段不需要修改 HOME 3D 娃娃逻辑。

## 4. 视觉参考与素材

### 4.1 已有素材

| 用途 | 文件 | 尺寸 | 说明 |
|---|---|---:|---|
| 开场主视觉 | `images/Internship/主页面.jpg` | `1595 x 1206` | 浅蓝粉水彩背景，适合做中心开场图或 section 背景纹理 |
| 卡片一 | `images/Internship/卡片1.jpg` | `1206 x 1600` | 蓝粉渐变蝴蝶，适合 Keendata |
| 卡片二 | `images/Internship/卡片2.jpg` | `1206 x 1602` | 蓝粉渐变双蝴蝶，适合 XGRIDS |
| 卡片三 | `images/Internship/卡片3.jpg` | `1206 x 1602` | 蓝粉渐变大蝴蝶，适合 CHERY |

### 4.2 视觉风格

- 背景：延续现有 `body` 的白底蓝粉淡渐变，可叠加非常轻的水彩纹理，但不要形成明显色块。
- 卡片：颜色可以比背景深一些，使用粉、蓝、紫渐变和图片叠加。
- 卡片边缘：轻微圆角，建议 `18px - 24px`，不做厚重相框。
- 阴影：柔和漂浮感，不要黑灰硬阴影。
- 字体：继续使用现有站点字体体系；标题可沿用 HOME/About 的大标题风格，但不要比 `YE NAN` 更抢眼。
- 文字颜色：深蓝紫或灰紫，不使用纯黑。

## 5. 页面结构

建议在 `index.html` 的 About Me section 后新增：

```html
<section id="internship" class="page-section internship-section">
  <div class="internship-stage" id="internshipStage">
    <!-- intro / cards / detail 三种状态都在这个舞台里切换 -->
  </div>
</section>
```

页面内部推荐拆成四层：

| 层级 | class 建议 | 作用 |
|---|---|---|
| Section | `.internship-section` | 100vh 页面容器，承接导航跳转 |
| Stage | `.internship-stage` | 动画舞台，负责 intro/cards/detail 状态切换 |
| Header | `.internship-header` | 英文标题和向下滚动提示 |
| Content | `.internship-content` | 开场图、卡片组、详情面板 |

## 6. 文案规范

### 6.1 页面标题

| 位置 | 文案 |
|---|---|
| 主标题 | `Internship Journey` |
| 英文辅助小字 | `Three chapters of practice` |
| 开场提示 | `Scroll to reveal internships` / `roll down to split the cards` |
| 卡片提示 | `Choose a card` |
| 详情返回按钮 | `Back to Journey` |

最新用户要求为：整个页面保持英文。因此 Internship 页面所有可见 UI 文案均使用英文，中文只保留在 PRD 协作文档中。

### 6.2 三张卡片信息

| 序号 | 公司 | 职位 | 时间 | 英文简介 |
|---:|---|---|---|---|
| 1 | `Keendata` | `Project Management Intern` | `APR 2025 - AUG 2025` | `Coordinated requirements, issues, and custom delivery workflows for data platform projects.` |
| 2 | `XGRIDS` | `Project Management Intern` | `JAN 2026 - MAY 2026` | `Supported agile delivery, SOP refinement, and software iteration for spatial computing products.` |
| 3 | `CHERY` | `Project Management Intern` | `JUN 2026 - PRESENT` | `Worked on intelligent driving delivery governance, quality tracking, and cross-functional coordination.` |

### 6.3 标签建议

| 公司 | 标签 |
|---|---|
| Keendata | `Requirements`, `Issue Tracking`, `Data Platform`, `Delivery` |
| XGRIDS | `Agile`, `SOP`, `3D Reconstruction`, `Spatial Computing` |
| CHERY | `Jira`, `Quality`, `Intelligent Driving`, `Robotaxi` |

## 7. 交互流程

### 7.1 状态一：进入 Internship 页面

触发方式：

- 用户从 HOME/About 向下滚动到 Internship。
- 用户点击导航栏 `Internship`。

进入后：

- 页面背景保持浅蓝粉白。
- 中央出现由 `卡片1.jpg`、`卡片2.jpg`、`卡片3.jpg` 横向拼合的一张宽图，视觉上像三张卡片先合为一体。
- 图片动画为“唰地放大出现，再回落缩小”：
  - 初始：`opacity: 0`，`scale: 1.18`，轻微 `blur(8px)`。
  - 进入：`opacity: 1`，`scale: 1`，清晰。
  - 回落：`scale: .86 - .9`，保留“一张宽图”的完整感，并为后续横向分裂留空间。
- 标题 `Internship Journey` 在图片稳定后出现。
- 标题下方显示动态提示 `Scroll to reveal internships` / `roll down to split the cards`，可以带轻微上下浮动，并明确提示用户继续向下滑动。

### 7.2 状态二：图片分裂成三张卡片

触发方式：

- 用户在 Internship section 中第一次向下滚动。
- 或点击/触摸 `Scroll to reveal internships` 提示。
- 如果用户通过导航直接跳转，也可以在开场动画结束后自动进入卡片状态，但建议保留 800ms - 1200ms 让用户看到开场。

动画：

- 中央合成宽图淡出，三张卡片从同一个横向组合状态中分裂出来。
- 三张卡片从中心宽图位置横向分裂到左、中、右：
  - 左卡：`translateX(-115%) rotate(-5deg)`
  - 中卡：`translateX(0) rotate(0deg)`
  - 右卡：`translateX(115%) rotate(5deg)`
- 三张卡片保持 `aspect-ratio: 5 / 7`。
- 分裂完成后卡片执行一次 180 度翻转，露出公司信息面。
- 卡片翻转实现必须避免文字镜像：外层只负责移动和倾斜，内层 `.internship-card-inner` 负责 3D 翻转；`Internship 01` 等文字在翻转完成后必须正向显示。

### 7.3 状态三：三张卡片待选择

卡片状态：

- 默认轻微漂浮，不要持续大幅晃动。
- hover 时卡片上浮 `6px - 10px`，阴影增强，图片颜色略亮。
- hover 或 focus 时可以轻微旋转，但角度不超过 `3deg`。
- 卡片可点击，鼠标指针为 `pointer`。
- 键盘可 tab 聚焦，回车可打开详情。

卡片正反面建议：

| 面 | 内容 |
|---|---|
| 图片面 | 使用 `卡片1.jpg` / `卡片2.jpg` / `卡片3.jpg`，叠加轻微渐变 |
| 信息面 | 公司名、职位、英文简介、标签、`View Details` |

### 7.4 状态四：点击卡片进入详情

触发：

- 点击任意卡片。
- 或键盘聚焦卡片后按 Enter。

布局变化：

- 被点击卡片移动到屏幕左侧，保持 5:7 比例。
- 其余两张卡片淡出或缩到左侧后方作为小影子，不要抢主卡注意力。
- 右侧出现详情面板，占据桌面端约 `52vw - 58vw`。
- 详情面板从右侧轻滑入，透明度从 0 到 1；左侧主卡同步轻微漂入，过渡需要丝滑，不要硬切。
- 页面不应该跳出当前 section。

详情面板内容结构：

1. 公司 logo 或首字母标识。
2. 公司名称。
3. 职位、时间、地点。
4. 一句话英文介绍。
5. Tags。
6. `Responsibilities` 占位列表。
7. `Tools & Methods` 占位列表。
8. `Highlights` 占位列表。
9. `Back to Journey` 按钮。

## 8. 数据结构建议

建议在 `js/main.js` 中新增数组，不要把文案分散写在 DOM 字符串里：

```js
const INTERNSHIP_CARDS = [
  {
    id: 'keendata',
    company: 'Keendata',
    role: 'Project Management Intern',
    period: 'APR 2025 - AUG 2025',
    location: 'Shenzhen, Guangdong',
    image: 'images/Internship/卡片1.jpg',
    logo: 'images/About me/Keendata.png',
    summary: 'Coordinated requirements, issues, and custom delivery workflows for data platform projects.',
    tags: ['Requirements', 'Issue Tracking', 'Data Platform', 'Delivery'],
    responsibilities: ['To be completed.'],
    methods: ['To be completed.'],
    highlights: ['To be completed.']
  },
  {
    id: 'xgrids',
    company: 'XGRIDS',
    role: 'Project Management Intern',
    period: 'JAN 2026 - MAY 2026',
    location: 'Shenzhen, Guangdong',
    image: 'images/Internship/卡片2.jpg',
    logo: 'images/About me/XGRIDS.png',
    summary: 'Supported agile delivery, SOP refinement, and software iteration for spatial computing products.',
    tags: ['Agile', 'SOP', '3D Reconstruction', 'Spatial Computing'],
    responsibilities: ['To be completed.'],
    methods: ['To be completed.'],
    highlights: ['To be completed.']
  },
  {
    id: 'chery',
    company: 'CHERY',
    role: 'Project Management Intern',
    period: 'JUN 2026 - PRESENT',
    location: 'Wuhu, Anhui',
    image: 'images/Internship/卡片3.jpg',
    logo: 'images/About me/CHERY.png',
    summary: 'Worked on intelligent driving delivery governance, quality tracking, and cross-functional coordination.',
    tags: ['Jira', 'Quality', 'Intelligent Driving', 'Robotaxi'],
    responsibilities: ['To be completed.'],
    methods: ['To be completed.'],
    highlights: ['To be completed.']
  }
];
```

注意：如果用户后续提供更准确地点、职位或成果描述，以用户新资料为准。

## 9. 桌面布局规格

目标视口：`1440 x 900`、`1280 x 800`。

### 9.1 Section

- `height: 100vh`
- `overflow: hidden`
- 顶部预留固定导航高度，建议 `padding-top: 6.5vh`
- 内容区高度用 `calc(100vh - 6.5vh)`

### 9.2 卡片组

- 卡片宽度：`clamp(180px, 18vw, 270px)`
- 卡片比例：`aspect-ratio: 5 / 7`
- 三卡之间保持明显呼吸空间，不要贴在一起。
- 标题在卡片上方，不遮挡卡片。
- 卡片底部按钮不能被裁切。

### 9.3 详情状态

- 左侧主卡：`width: clamp(210px, 24vw, 320px)`
- 右侧详情：`width: min(58vw, 760px)`
- 左右间距：`clamp(28px, 5vw, 76px)`
- 详情面板可内部滚动，但页面整体仍保持 section 级控制。

## 10. 移动端布局规格

目标视口：`390 x 844`、`430 x 932`。

- 导航仍固定在顶部。
- 开场标题不能被导航遮住。
- 三张卡片在移动端建议改为横向可滑动 carousel，或者纵向错落堆叠。
- 如果使用横向 carousel：
  - 单卡宽度：`min(72vw, 300px)`
  - 卡片仍保持 `5:7`
  - 中心卡清晰，旁边卡露出一部分。
- 点击卡片后详情面板在卡片下方或覆盖为单列布局。
- 详情面板允许内部滚动，避免内容挤出屏幕。

## 11. 动效约束

- 动效要柔和，不要像游戏抽卡一样过度夸张。
- 翻转卡片的 180 度动画时长建议 `650ms - 900ms`。
- 分裂动画时长建议 `700ms - 1000ms`。
- 详情面板滑入时长建议 `420ms - 620ms`。
- 使用 `prefers-reduced-motion: reduce` 时：
  - 关闭缩放、翻转、漂浮。
  - 直接显示三张卡片。
  - 点击后直接切换详情。

## 12. 实现建议

### 12.1 HTML

- 在 About Me section 后新增 Internship section。
- 将卡片和详情容器写成可由 JS 渲染的空容器，避免重复手写三套 DOM。
- 为交互按钮增加 `aria-label`。

### 12.2 CSS

- 新增 Internship 独立样式块，避免污染 HOME/About。
- 使用 CSS 变量复用现有颜色：
  - `--text-dark`
  - `--text-mid`
  - `--pink-soft`
  - `--purple-light`
  - `--white`
- 对卡片使用 `transform-style: preserve-3d`、`backface-visibility: hidden`。
- 不要给整页加深色大背景。

### 12.3 JavaScript

- 新增 `initInternshipJourney()`。
- 将状态控制为：
  - `intro`
  - `cards`
  - `detail`
- 用 class 切换状态，例如：
  - `.internship-stage.is-intro`
  - `.internship-stage.is-cards`
  - `.internship-stage.is-detail`
- 监听 section 内第一次 wheel/touch/click，用于从 intro 进入 cards。
- 点击卡片后调用 `openInternshipDetail(cardId)`。
- 返回按钮调用 `closeInternshipDetail()`。
- 更新导航映射：

```js
var sectionMap = {
  'About Me': 'about',
  'Internship': 'internship'
};
```

## 13. 可访问性要求

- 卡片必须是 `<button>` 或带 `role="button"`、`tabindex="0"` 的可聚焦元素。
- 键盘可以完成打开详情和返回。
- 详情面板打开后，焦点移动到详情标题或返回按钮。
- 图片要有 alt：
  - `Keendata internship card`
  - `XGRIDS internship card`
  - `CHERY internship card`
- 动画不应依赖颜色传达全部信息。

## 14. 性能要求

- `主页面.jpg` 和三张卡片图是较大 JPG，建议在 HTML 或 JS 中预加载。
- 卡片图片使用 `object-fit: cover`。
- 不要把图片转成 base64 写入代码。
- 动画优先使用 `transform` 和 `opacity`，避免频繁改 `width/top/left`。
- 不新增大型动画库。

## 15. 与现有页面的衔接

- HOME、About、Internship 三页都在同一个 `.scroll-container` 中。
- 不改变 HOME 现有人物加载逻辑。
- 不改变 About Me 已有卡片轮播逻辑。
- Internship 导航点击应滚动到 `#internship`。
- About 卡片中的 `View Details` 后续可以跳到对应 Internship 详情：
  - `#internship?card=keendata`
  - `#internship?card=xgrids`
  - `#internship?card=chery`

当前阶段可以先不实现 URL 参数，但数据结构和 card id 要提前保留。

## 16. 验收标准

### 16.1 功能验收

- 点击导航栏 `Internship` 能平滑到 Internship 页面。
- 页面显示标题 `Internship Journey`。
- 开场能看到中央水彩主图。
- 滚动或点击提示后，主图能展开为三张卡片。
- 三张卡片比例为 `5:7`。
- 三张卡片翻转后显示公司信息。
- 点击每张卡片，左侧显示选中卡，右侧显示对应详情。
- 点击 `Back to Journey` 能回到三卡选择状态。

### 16.2 视觉验收

- 页面背景和 HOME/About 连贯，不出现突兀深色整屏。
- 卡片使用粉、蓝、紫，但不压过页面主体。
- 桌面视口下标题、卡片、详情互不遮挡。
- 移动端视口下卡片不溢出屏幕。
- 卡片按钮和标签不被裁切。

### 16.3 技术验收

- `node --check js/main.js` 通过。
- `git diff --check` 通过。
- 浏览器控制台无明显报错。
- 桌面 `1440 x 900` 和移动 `390 x 844` 截图检查通过。
- 修改内容已写入当天 `Logs/YYYY-MM-DD.md`。

## 17. Claude Code 实施步骤建议

1. 阅读 `AGENTS.md`、当天最新日志、`images/PRD/Internship --- Prd.md`、本详细 PRD。
2. 检查当前 `index.html`、`css/style.css`、`js/main.js`，确认已有 HOME/About 结构。
3. 在 `index.html` 中新增 `#internship` section。
4. 在 `js/main.js` 中新增 `INTERNSHIP_CARDS` 数据和 `initInternshipJourney()`。
5. 更新导航映射，让 `Internship` 指向 `#internship`。
6. 在 `css/style.css` 中新增 Internship 样式，先完成静态布局。
7. 再补开场、分裂、翻转、详情切换动画。
8. 做桌面和移动端验证，确认无遮挡。
9. 将命令、文件修改和验证结果写入当天日志。

## 18. 待用户后续补充

- Keendata 的具体实习职责、成果、工具和项目细节。
- XGRIDS 的具体实习职责、成果、工具和项目细节。
- CHERY 的具体实习职责、成果、工具和项目细节。
- 是否要在详情页展示真实公司 logo。
- CHERY 工作地点是否最终使用 `Wuhu, Anhui`。
- About 页面 `View Details` 是否需要直接跳到对应 Internship 卡片详情。
