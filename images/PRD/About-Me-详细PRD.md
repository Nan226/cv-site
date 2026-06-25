# YE NAN Portfolio - About Me 页面详细 PRD

## 1. 文档信息

| 项目 | 内容 |
|---|---|
| 页面名称 | About Me |
| 文档版本 | V2.0 |
| 更新日期 | 2026-06-25 |
| 当前状态 | 待用户确认后开发 |
| 最新需求来源 | `images/PRD/About me --- Prd.md` |
| 视觉参考 | `images/About me/卡片样式参考.png` |
| 技术栈 | HTML、CSS、原生 JavaScript |

本文件是 About Me 页面的开发规格。若本文件与旧 PDF 或旧版详细 PRD 冲突，以 `About me --- Prd.md` 和本文件 V2.0 为准。

## 2. 页面目标

About Me 页面通过一条成长时间线和六张可环绕切换的卡片，快速呈现 Ye Nan 的基础信息、教育经历和实习路径。

页面需要让访问者在较短时间内理解：

1. Ye Nan 的个人背景与联系方式。
2. 本科和研究生教育经历。
3. 从大数据平台、空间计算到智能驾驶的实习路径。
4. 项目管理、跨团队沟通和技术理解能力的形成过程。

页面不是传统的长篇自我介绍，也不是 Internship 页面的重复版本。About Me 负责建立完整的人物成长叙事，详细工作成果后续再由 Internship 页面展开。

## 3. 核心约束

- 页面中所有可见内容必须使用英文。
- 页面延续 HOME 的白色、淡蓝色、淡粉色视觉。
- About Me 与 HOME 必须共享连续的页面背景，滚动或切换时不得出现颜色断层、接缝或突然改变的光晕。
- 主标题前必须有图标。
- 图标优先使用 Lucide 图标，不直接使用 emoji 字符。
- 中部必须有横向时间线。
- 时间线下方必须有六张对应卡片。
- 卡片需要形成中间突出、两侧缩小的环绕滚动效果。
- 当前卡片与当前时间节点必须始终同步。
- 桌面端优先保持单屏展示。
- 窄屏端允许卡片区内部横向交互，但页面不能出现布局溢出。

## 4. 用户与场景

### 4.1 主要用户

- Recruiters and hiring managers。
- Interviewers。
- Potential collaborators。
- Visitors interested in Ye Nan's education and career path。

### 4.2 核心场景

1. 用户从 HOME 点击 `About Me`。
2. 用户先看到标题和完整时间线。
3. 用户点击时间节点，查看对应卡片。
4. 用户拖动、滚轮或点击左右卡片切换经历。
5. 用户从 Base Info 卡片下载简历。
6. 用户从实习卡片进入对应详情区域。

## 5. 页面结构

页面分为四层：

1. **Global Navigation**
   - 延续 HOME 的顶部导航。
   - `About Me` 显示当前页状态。

2. **Page Header**
   - 主标题：`About Me`
   - 副标题：`00s INFJ PM, keep evolving!`
   - 副标题来源于最新参考图，大小和视觉权重低于主标题。

3. **Timeline**
   - 展示六个关键节点。
   - 每个节点显示时间和地点。
   - 点击节点切换对应卡片。

4. **Card Carousel**
   - 六张卡片形成环绕轮播。
   - 当前卡片居中并完整展示。
   - 左右卡片保留部分可见区域。

## 6. 页面文案规范

### 6.1 标题区

| 元素 | 英文文案 |
|---|---|
| 主标题 | `About Me` |
| 副标题 | `00s INFJ PM, keep evolving!` |
| 时间线区标签 | `Footprint` |

说明：

- `00s` 表示 2000 年代出生。
- `PM` 在当前语境中表示 Project Management。
- 若用户希望更正式，可在开发前改为 `A project-minded builder, always evolving.`。

### 6.2 日期格式

统一采用以下格式：

- 单月节点：`FEB 2003`
- 时间范围：`SEP 2020 - JUN 2024`
- 至今：`JUN 2026 - PRESENT`

页面中不混用 `2025.04`、`2025.9`、`2026.1` 等格式。

### 6.3 地点格式

| 中文含义 | 页面英文 |
|---|---|
| 福建泉州 | `Quanzhou, Fujian` |
| 福建厦门 | `Xiamen, Fujian` |
| 广东深圳 | `Shenzhen, Guangdong` |
| 香港红磡 | `Hung Hom, Hong Kong` |

## 7. 时间线规格

### 7.1 节点内容

| 序号 | 时间 | 地点 | 类型 | 对应卡片 |
|---|---|---|---|---|
| 01 | `FEB 2003` | `Quanzhou, Fujian` | Base Info | Base Information |
| 02 | `SEP 2020 - JUN 2024` | `Xiamen, Fujian` | Education | Huaqiao University |
| 03 | `APR 2025 - AUG 2025` | `Shenzhen, Guangdong` | Internship | Keendata |
| 04 | `SEP 2025` | `Hung Hom, Hong Kong` | Education | The Hong Kong Polytechnic University |
| 05 | `JAN 2026 - MAY 2026` | `Shenzhen, Guangdong` | Internship | XGRIDS |
| 06 | `JUN 2026 - PRESENT` | `Wuhu, Anhui` | Internship | CHERY |

### 7.2 节点视觉

- 时间线使用一条细线横向贯穿。
- 默认节点为低对比度空心圆。
- 当前节点为蓝粉渐变实心圆，并带轻微光晕。
- 已浏览节点可提高线条对比度。
- 当前节点的日期和地点使用深色文字。
- 非当前节点降低文字对比度，但仍保持可读。

### 7.3 节点交互

- 点击节点后切换到对应卡片。
- 卡片切换后时间线自动更新当前节点。
- 键盘焦点进入节点后可使用方向键移动。
- 当前节点设置 `aria-current="step"`。
- 窄屏时，当前节点自动滚动到时间线容器中央。

## 8. 卡片通用规格

### 8.1 卡片结构

每张卡片包含：

1. 顶部分类标签。
2. 主视觉图片。
3. Logo 或身份图标。
4. 图标加主标题。
5. 角色、专业或阶段说明。
6. 关键词或信息列表。
7. 可选操作按钮。

### 8.2 卡片字段

```js
{
  id: "base-info",
  period: "FEB 2003",
  location: "Quanzhou, Fujian",
  category: "Base Info",
  icon: "id-card",
  title: "Base Information",
  subtitle: "",
  image: "images/About me/照片1.JPEG",
  logo: "",
  items: [],
  action: null
}
```

### 8.3 卡片视觉

- 卡片参考 `卡片样式参考.png`。
- 圆角不超过 `8px`。
- 上半部分以图片为主。
- 图片底部使用白色透明渐隐衔接内容区。
- 分类标签位于卡片左上角。
- Logo、主标题和次级信息在内容区对齐。
- 关键词可使用紧凑胶囊标签，但不要把所有正文都做成胶囊。
- 当前卡片允许轻微阴影和蓝粉光晕。

## 9. 卡片一：Base Information

### 9.1 基础信息

| 字段 | 内容 |
|---|---|
| 时间 | `FEB 2003` |
| 地点 | `Quanzhou, Fujian` |
| 左上角标签 | `Base Info` |
| 图标 | Lucide `IdCard` |
| 主标题 | `Base Information` |
| 图片 | `images/About me/照片1.JPEG` |

### 9.2 英文内容

| 图标 | 标签 | 内容 |
|---|---|---|
| `CakeSlice` | `Date of Birth` | `February 26, 2003` |
| `Phone` | `Phone` | `183 5056 5182` |
| `MessageCircle` | `WeChat` | `kunan0226` |
| `Mail` | `Email` | `kunan0226@163.com` |

### 9.3 操作按钮

| 项目 | 规格 |
|---|---|
| 文案 | `Download Resume` |
| 图标 | Lucide `Download` |
| 行为 | 下载用户提供的英文或双语简历文件 |
| 状态 | 简历文件路径待用户提供 |

### 9.4 隐私要求

手机号和微信号属于公开发布风险较高的信息。上线前必须由用户明确确认以下二选一方案：

1. **Public**：完整展示手机号与微信号。
2. **Protected**：默认只展示邮箱，手机号和微信号点击后再显示，或仅放入下载简历。

当前 PRD 保留用户提供的完整信息，但开发默认推荐 `Protected` 方案。

## 10. 卡片二：Huaqiao University

### 10.1 基础信息

| 字段 | 内容 |
|---|---|
| 时间 | `SEP 2020 - JUN 2024` |
| 地点 | `Xiamen, Fujian` |
| 左上角标签 | `Education` |
| 图标 | Lucide `GraduationCap` |
| 主标题 | `Huaqiao University` |
| 图片 | `images/About me/照片2.jpg` |
| Logo | `images/About me/华侨大学校徽.png` |

### 10.2 英文内容

- `Top 10% GPA`
- `Class Life Committee Member`
- `Operations Team, Sangzi WeAssistant`
- `Lead, Plant Art Club`
- `First-Class College Scholarship`
- `Outstanding Social Practice Participant`
- `CET-6`
- `IELTS 6.5`

### 10.3 内容展示建议

- `Top 10% GPA`、`First-Class College Scholarship`、`IELTS 6.5` 作为重点标签。
- 学生工作和社团经历使用两行紧凑列表。
- 不在卡片中加入过长说明。

## 11. 卡片三：Keendata

### 11.1 基础信息

| 字段 | 内容 |
|---|---|
| 时间 | `APR 2025 - AUG 2025` |
| 地点 | `Shenzhen, Guangdong` |
| 左上角标签 | `Internship` |
| 图标 | Lucide `BriefcaseBusiness` |
| 主标题 | `Keendata` |
| 职位 | `Project Management Intern` |
| 图片 | `images/About me/照片3.png` |
| Logo | `images/About me/Keendata.png` |

### 11.2 英文内容

- `Big Data Platform`
- `Issue Tracking`
- `Requirements Management`
- `Custom Delivery Projects`

### 11.3 操作按钮

| 项目 | 规格 |
|---|---|
| 文案 | `View Details` |
| 图标 | Lucide `ArrowUpRight` |
| 行为 | 跳转到 Internship 页面中的 Keendata 详情 |
| 当前阶段 | Internship 页面未完成时按钮保持禁用或显示 `Coming Soon` |

## 12. 卡片四：The Hong Kong Polytechnic University

### 12.1 基础信息

| 字段 | 内容 |
|---|---|
| 时间 | `SEP 2025` |
| 地点 | `Hung Hom, Hong Kong` |
| 左上角标签 | `Education` |
| 图标 | Lucide `GraduationCap` |
| 主标题 | `The Hong Kong Polytechnic University` |
| 图片 | `images/About me/照片4.png` |
| Logo | `images/About me/香港理工大学校徽.png` |

### 12.2 英文内容

- `QS Top 50`
- `Metaverse`
- `Top 10% GPA`

### 12.3 发布前确认

- 补充准确学位名称和专业名称。
- 确认 `SEP 2025` 是入学时间还是完整就读时间。
- `QS Top 50` 属于会随年份变化的排名描述，发布前确认对应排名年份。

## 13. 卡片五：XGRIDS

### 13.1 基础信息

| 字段 | 内容 |
|---|---|
| 时间 | `JAN 2026 - MAY 2026` |
| 地点 | `Shenzhen, Guangdong` |
| 左上角标签 | `Internship` |
| 图标 | Lucide `ScanLine` |
| 主标题 | `XGRIDS` |
| 职位 | `Project Management Intern` |
| 图片 | `images/About me/照片5.png` |
| Logo | `images/About me/XGRIDS.png` |

### 13.2 英文内容

- `Agile Iteration`
- `Process SOPs`
- `Software Delivery`
- `3D Reconstruction`
- `Intelligent Spatial Computing`

### 13.3 操作按钮

| 项目 | 规格 |
|---|---|
| 文案 | `View Details` |
| 图标 | Lucide `ArrowUpRight` |
| 行为 | 跳转到 Internship 页面中的 XGRIDS 详情 |

## 14. 卡片六：CHERY

### 14.1 基础信息

| 字段 | 内容 |
|---|---|
| 时间 | `JUN 2026 - PRESENT` |
| 地点 | 待用户确认 |
| 左上角标签 | `Internship` |
| 图标 | Lucide `CarFront` |
| 主标题 | `CHERY` |
| 职位 | `Project Management Intern` |
| 图片 | `images/About me/照片6.png` |
| Logo | `images/About me/CHERY.png` |

### 14.2 英文内容

- `Intelligent Driving`
- `ADSD`
- `Jira Governance`
- `Quality Management`
- `Robotaxi`
- `Cross-functional Communication`

### 14.3 操作按钮

| 项目 | 规格 |
|---|---|
| 文案 | `View Details` |
| 图标 | Lucide `ArrowUpRight` |
| 行为 | 跳转到 Internship 页面中的 CHERY 详情 |

### 14.4 发布前确认

- 确认工作地点。
- 确认 `ADSD` 是否为正确英文缩写。
- 确认品牌展示使用 `CHERY` 还是更具体的团队或事业部名称。

## 15. 环绕轮播交互

### 15.1 默认状态

- 默认激活第一张 Base Information 卡片。
- 当前卡片居中。
- 左右各至少露出一张卡片。
- 时间线第一个节点同步激活。

### 15.2 桌面端操作

- 点击时间线节点切换。
- 点击左右卡片切换。
- 点击左右箭头切换。
- 鼠标按住拖动切换。
- 鼠标滚轮在卡片区域内横向切换。
- 键盘 `ArrowLeft` 和 `ArrowRight` 切换。

### 15.3 移动端操作

- 左右滑动切换。
- 点击时间线节点切换。
- 点击左右箭头切换。
- 当前卡片占主要宽度，两侧只露出边缘。

### 15.4 卡片位置规则

| 位置 | 缩放 | 透明度 | Y 轴旋转 | 层级 |
|---|---:|---:|---:|---:|
| 当前卡片 | `1` | `1` | `0deg` | 最高 |
| 相邻卡片 | `0.84 - 0.9` | `0.7 - 0.82` | `±16deg` | 中 |
| 远端卡片 | `0.68 - 0.78` | `0.25 - 0.5` | `±25deg` | 低 |

- 卡片首尾允许循环。
- 循环切换不能出现明显跳帧。
- 快速连续操作时以最后一个目标索引为准。
- 动画时长建议为 `420 - 560ms`。

## 16. 视觉规范

### 16.1 色彩

| 用途 | 建议值 |
|---|---|
| 页面背景 | `#FFFFFF` |
| 主文字 | `#20222A` |
| 次级文字 | `#6B6E7A` |
| 蓝色强调 | `#79B8FF` |
| 粉色强调 | `#FF9CCB` |
| 紫粉过渡 | `#B69CFF` |
| 卡片背景 | `rgba(255, 255, 255, 0.9)` |
| 卡片边框 | `rgba(126, 112, 180, 0.14)` |

- 页面不使用大面积纯紫色。
- 背景光晕必须柔和融合，不能形成明显色条。
- 每张卡片可根据学校或公司 Logo 使用少量局部品牌色。

### 16.2 与 HOME 的背景连续性

- HOME 与 About Me 使用同一个全局背景层，不分别绘制两套互不相连的 section 背景。
- About Me 的基础底色、蓝粉光晕浓度和整体明度必须与 HOME 保持一致。
- 两个页面交界位置不能出现边框、阴影、纯色横条或突然变化的渐变起点。
- 背景光晕可以随页面内容缓慢延伸，但颜色和透明度变化必须连续。
- 当前已有的全局彩带或背景装饰可跨 section 延续，不能在进入 About Me 时突然重置位置。
- About Me 内容层保持透明背景，让全局背景从 HOME 自然贯穿。
- 如需提高卡片区域可读性，只能在局部使用非常淡的透明雾化层，不得为整个 About section 增加独立实色背景。
- 桌面端与窄屏端均需检查 HOME 到 About Me 的过渡位置。

### 16.3 字体

- `About Me` 使用与 HOME `YE NAN` 一致的展示字体气质。
- 主标题可使用蓝粉渐变。
- 卡片标题使用中等或半粗字重。
- 正文使用清晰无衬线字体。
- 页面字距统一为 `0`。

### 16.4 图标

- 使用 Lucide 图标。
- 图标与标题同行显示。
- 图标尺寸与文字层级匹配，不使用大面积装饰图标。
- 不直接使用 `🆔`、`🐣`、`📱`、`💬`、`📮` 等 emoji 作为正式 UI。

## 17. 图片与 Logo 处理

### 17.1 素材对应

| 卡片 | 主图 | Logo |
|---|---|---|
| Base Information | `照片1.JPEG` | 使用 `IdCard` 图标 |
| Huaqiao University | `照片2.jpg` | `华侨大学校徽.png` |
| Keendata | `照片3.png` | `Keendata.png` |
| PolyU | `照片4.png` | `香港理工大学校徽.png` |
| XGRIDS | `照片5.png` | `XGRIDS.png` |
| CHERY | `照片6.png` | `CHERY.png` |

### 17.2 图片要求

- 保留原图，不覆盖或删除。
- 开发时生成网页优化副本。
- 优先使用 WebP。
- 单张卡片图片建议控制在 250 KB 内。
- 卡片图片使用稳定宽高比，避免切换时布局抖动。
- 人像图片裁切时不得截断面部和关键服装信息。
- 公司场景图片需保留可识别的品牌或产品主体。

## 18. 响应式布局

### 18.1 桌面端

- 目标视口：`1280 x 720` 及以上。
- 页面保持单屏展示。
- 标题区约占高度 16%。
- 时间线约占高度 18%。
- 卡片区约占高度 56%。
- 当前卡片建议宽度 `280 - 340px`。

### 18.2 平板端

- 时间线仍保持横向。
- 卡片区展示当前卡片和两个相邻卡片。
- 减小卡片间距和透视角度。

### 18.3 窄屏端

- 标题字号降低，但保持完整显示。
- 时间线使用横向滚动容器。
- 当前卡片宽度不超过视口的 84%。
- 相邻卡片只露出 8% 至 14%。
- 卡片正文过多时允许卡片内部有限滚动，页面本身仍避免横向溢出。
- 联系方式不得因文字过长超出卡片。

## 19. 状态设计

### 19.1 图片加载

- 图片加载前显示柔和占位色。
- 图片失败时显示 Logo 和文字信息。
- 图片失败不能导致卡片塌陷。

### 19.2 详情页未完成

- `View Details` 按钮显示禁用状态。
- 可使用文案 `Coming Soon`。
- 不允许点击后跳转到空白页面。

### 19.3 简历文件未提供

- `Download Resume` 按钮保持禁用。
- 不生成无效下载链接。

### 19.4 减少动效

当系统开启 `prefers-reduced-motion: reduce`：

- 关闭明显透视旋转。
- 切换改为淡入淡出。
- 不自动播放轮播。

## 20. 无障碍要求

- 时间线节点使用 `button`。
- 当前节点使用 `aria-current="step"`。
- 轮播使用 `aria-roledescription="carousel"`。
- 每张卡片提供明确标签，如 `Slide 2 of 6: Huaqiao University`。
- 图片必须有准确英文 `alt`。
- 所有操作均支持键盘。
- 焦点状态清晰可见。
- 图标不能成为唯一信息来源。
- 正文对比度满足 WCAG AA。

## 21. 性能要求

- 图片使用优化副本和懒加载。
- 当前卡片图片优先加载。
- 相邻卡片图片次优先加载。
- 远端卡片图片延迟加载。
- 动画只使用 `transform` 和 `opacity`。
- 不使用新的大型 3D 场景实现卡片轮播。
- About 页面新增资源建议控制在 2 MB 内。
- 首次进入页面后，当前卡片应在 1.5 秒内具备完整可读内容。

## 22. 数据结构建议

```js
const aboutCards = [
  {
    id: "base-info",
    period: "FEB 2003",
    location: "Quanzhou, Fujian",
    category: "Base Info",
    icon: "id-card",
    title: "Base Information",
    image: "images/About me/照片1.JPEG",
    logo: null,
    items: [
      { icon: "cake-slice", label: "Date of Birth", value: "February 26, 2003" },
      { icon: "phone", label: "Phone", value: "183 5056 5182" },
      { icon: "message-circle", label: "WeChat", value: "kunan0226" },
      { icon: "mail", label: "Email", value: "kunan0226@163.com" }
    ],
    action: {
      label: "Download Resume",
      type: "download",
      target: null
    }
  }
];
```

要求：

- 六张卡片使用同一数据结构。
- 页面结构与数据分离。
- 不复制六套切换逻辑。
- 敏感信息可以通过配置决定是否公开。
- 详情按钮目标由后续 Internship 页面统一配置。

## 23. 开发步骤

### 第一步：静态结构

- 替换现有 About 占位内容。
- 创建标题区。
- 创建六节点时间线。
- 创建六张静态卡片。
- 使用本地图片和 Logo。
- 完成桌面端基础布局。

完成后展示给用户确认，不继续实现复杂轮播。

### 第二步：基础切换

- 建立结构化卡片数据。
- 实现时间线点击切换。
- 实现左右箭头和键盘切换。
- 同步当前节点与当前卡片。

完成后再次等待用户确认。

### 第三步：环绕动效

- 实现卡片缩放、透明度和透视。
- 实现点击相邻卡片。
- 实现拖动、滚轮和触控。
- 实现首尾循环。

### 第四步：响应式与发布检查

- 优化窄屏布局。
- 压缩图片。
- 增加无障碍状态。
- 验证下载和详情按钮。
- 检查个人信息公开策略。
- 完成桌面与窄屏截图验收。

## 24. 验收标准

### 24.1 内容

- 页面所有可见文字均为英文。
- 六个时间节点与六张卡片一一对应。
- 日期和地点格式统一。
- 学校、公司和职位名称准确。
- 页面没有中文占位文字。

### 24.2 视觉

- 延续 HOME 的白底蓝粉渐变。
- HOME 与 About Me 的背景连续贯通，页面交界处不可见背景接缝或色差。
- 滚动经过两个 section 的边界时，光晕和背景装饰不得突然跳变或重新开始。
- 卡片样式与参考图方向一致。
- 当前卡片突出，两侧卡片形成环绕纵深。
- Logo、标题、图片和列表层级清晰。
- 桌面和窄屏均无重叠或溢出。

### 24.3 交互

- 点击节点能切换到正确卡片。
- 切换卡片后节点同步更新。
- 箭头、拖动、滚轮、触控和键盘行为稳定。
- 首尾循环没有明显跳帧。
- 快速操作不会导致卡片索引错乱。

### 24.4 功能

- 简历存在时可以正确下载。
- 详情页存在时可以正确跳转。
- 未完成的按钮不会跳转到空白页面。
- 图片加载失败时仍可阅读卡片核心内容。

### 24.5 性能

- 页面切换流畅。
- 卡片动画接近 60 FPS。
- 当前卡片首屏图片优先加载。
- About 页面新增资源控制在合理范围。

## 25. 开发前待确认

1. Base Info 卡片是否公开完整手机号和微信号。
2. `Download Resume` 对应的简历文件路径。
3. Huaqiao University 的准确专业和学位名称。
4. PolyU 的准确专业、学位和预计毕业时间。
5. `QS Top 50` 对应的排名年份。
6. CHERY 的工作地点。
7. `ADSD` 是否为正确缩写。
8. 三个 `View Details` 按钮在 Internship 页面完成前是禁用，还是显示 `Coming Soon`。
9. 副标题是否最终使用 `00s INFJ PM, keep evolving!`。

## 26. 当前推荐决策

- 使用 `00s INFJ PM, keep evolving!` 作为第一版副标题。
- Base Info 默认只公开邮箱，手机号和微信号采用点击显示。
- 默认从第一张 Base Info 卡片开始。
- 卡片允许无限循环。
- 第一阶段只完成静态结构，确认视觉后再做环绕交互。
- 所有图片先使用原图开发，发布前再生成 WebP 优化副本。
- Internship 详情页未完成前，详情按钮显示 `Coming Soon`。
