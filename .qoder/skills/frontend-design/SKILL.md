---
name: frontend-design
description: 专业的前端设计指南，用于创建美观、现代的用户界面。在构建落地页、仪表盘或任何用户界面时使用。
---

# 前端设计技能

在创建 UI 组件、落地页、仪表盘或任何前端设计工作时使用此技能。

## 设计工作流程

遵循以下结构化方法进行 UI 设计：

1. **布局设计** — 思考组件结构，创建 ASCII 线框图
2. **主题设计** — 定义颜色、字体、间距、阴影
3. **动画设计** — 规划微交互和过渡效果
4. **代码实现** — 生成实际代码

### 1. 布局设计

编码之前，先用 ASCII 格式绘制布局草图：

```
┌─────────────────────────────────────┐
│         头部 / 导航栏               │
├─────────────────────────────────────┤
│                                     │
│            英雄区域                 │
│         (标题 + 行动号召)           │
│                                     │
├─────────────────────────────────────┤
│   功能卡片  │  功能卡片  │  功能卡片 │
├─────────────────────────────────────┤
│            页脚                     │
└─────────────────────────────────────┘
```

### 2. 主题指南

**颜色规范：**
- 绝对不要使用通用的 Bootstrap 风格蓝色 (#007bff) — 看起来过时
- 优先使用 oklch() 定义现代颜色
- 使用语义化颜色变量 (--primary, --secondary, --muted 等)
- 从一开始就考虑亮色和暗色模式

**字体选择 (Google Fonts)：**
```
无衬线字体: Inter, Roboto, Poppins, Montserrat, Outfit, Plus Jakarta Sans, DM Sans, Space Grotesk
等宽字体: JetBrains Mono, Fira Code, Source Code Pro, IBM Plex Mono, Space Mono, Geist Mono
衬线字体: Merriweather, Playfair Display, Lora, Source Serif Pro, Libre Baskerville
展示字体: Architects Daughter, Oxanium
```

**间距与阴影：**
- 使用一致的间距比例 (0.25rem 为基准)
- 阴影应柔和微妙 — 避免厚重的投影
- 阴影颜色也可考虑使用 oklch()

### 3. 主题模式

**现代暗色模式 (Vercel/Linear 风格)：**
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.970 0 0);
  --muted: oklch(0.970 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --border: oklch(0.922 0 0);
  --radius: 0.625rem;
  --font-sans: Inter, system-ui, sans-serif;
}
```

**新野蛮主义 (90年代网页复兴)：**
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0 0 0);
  --primary: oklch(0.649 0.237 26.97);
  --secondary: oklch(0.968 0.211 109.77);
  --accent: oklch(0.564 0.241 260.82);
  --border: oklch(0 0 0);
  --radius: 0px;
  --shadow: 4px 4px 0px 0px hsl(0 0% 0%);
  --font-sans: DM Sans, sans-serif;
  --font-mono: Space Mono, monospace;
}
```

**毛玻璃效果：**
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
}
```

### 4. 动画指南

**微交互速记语法：**
```
按钮按下: 150ms [S1→0.95→1] press
悬停效果: 200ms [Y0→-2, shadow↗]
淡入: 400ms ease-out [Y+20→0, α0→1]
滑入: 350ms ease-out [X-100→0, α0→1]
弹跳: 600ms [S0.95→1.05→1]
```

**常用模式：**
- 入场动画: 300-500ms, ease-out
- 悬停状态: 150-200ms
- 按钮按下: 100-150ms
- 页面过渡: 300-400ms

### 5. 实现规范

**Tailwind CSS：**
```html
<!-- 原型开发时通过 CDN 引入 -->
<script src="https://cdn.tailwindcss.com"></script>
```

**Flowbite (组件库)：**
```html
<link href="https://cdn.jsdelivr.net/npm/flowbite@2.0.0/dist/flowbite.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/flowbite@2.0.0/dist/flowbite.min.js"></script>
```

**图标 (Lucide)：**
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>lucide.createIcons();</script>
```

**图片：**
- 使用真实的占位图服务：Unsplash, placehold.co
- 绝不编造图片 URL
- 示例: `https://images.unsplash.com/photo-xxx?w=800&h=600`

### 6. 响应式设计

始终采用移动优先的响应式设计：

```css
/* 移动端优先 */
.container { padding: 1rem; }

/* 平板端 */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* 桌面端 */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
}
```

### 7. 无障碍访问

- 使用语义化 HTML (header, main, nav, section, article)
- 保持正确的标题层级 (h1 → h2 → h3)
- 为交互元素添加 aria-label
- 确保足够的颜色对比度 (最低 4.5:1)
- 支持键盘导航

### 8. 组件设计技巧

**卡片：**
- 使用柔和阴影，不要厚重投影
- 保持一致的内边距 (p-4 到 p-6)
- 悬停状态：轻微上浮 + 阴影增强

**按钮：**
- 清晰的视觉层级 (主要、次要、幽灵按钮)
- 足够的触摸目标尺寸 (最小 44x44px)
- 加载中和禁用状态

**表单：**
- 输入框上方放置清晰的标签
- 可见的聚焦状态
- 行内验证反馈
- 字段之间保持适当间距

**导航：**
- 长页面使用粘性头部
- 清晰的当前激活状态指示
- 移动端友好的汉堡菜单

---

## 快速参考

| 元素 | 建议 |
|------|------|
| 主字体 | Inter, Outfit, DM Sans |
| 代码字体 | JetBrains Mono, Fira Code |
| 圆角 | 0.5rem - 1rem (现代风), 0 (野蛮主义风) |
| 阴影 | 柔和微妙，最多 1-2 层 |
| 间距 | 4px 基本单位 (0.25rem) |
| 动画 | 150-400ms, ease-out |
| 颜色 | 使用 oklch() 定义，避免通用蓝色 |
