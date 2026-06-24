# YE NAN 3D 模型接入说明

当前正式模型文件：

`images/HOME/有骨骼的娃娃.glb`

## 视觉要求

- 3D 动画电影风女性角色
- 深棕色长发与橙色发夹
- 灰色星纹毛绒连帽外套
- 白色内搭
- 浅蓝色牛仔裤
- 页面默认展示完整全身，人物居中，左右保留标签空间

## 模型要求

- 推荐使用带骨骼的 GLB 2.0 文件
- 骨骼名称尽量包含 `Head`、`Neck`、`Spine`、`Shoulder`、`UpperArm`、`Hand`
- 如需眨眼或微笑，模型应包含名称带 `blink`、`smile` 或 `happy` 的 morph target
- 模型正面朝向摄像机，Y 轴向上
- 建议压缩后不超过 8 MB
- 建议提供可控制的肩、肘、手、髋、膝、脚骨骼
- 建议提供 `blink`、`smile`、`angry`、`puff` 或相近命名的表情 morph target

模型缺失或加载失败时，页面会自动使用现有 Three.js 简模。
