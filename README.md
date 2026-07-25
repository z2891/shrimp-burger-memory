# 🦐 虾米与汉堡的奇妙物语 🍔

一个只属于两个人的私密纪念网站 —— 温暖、手绘感、微童话风格的"秘密星球"。

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 🌐 访问入口

点谁的门，就以谁的身份进入。虾米和汉堡各自拥有代表色和专属视角。

> 无需密码，点击即入。秘密花园等私密页面可单独设置密码保护。

## 功能一览

### 时光地图（首页）
- 手绘风格的童话地图，可以拖动、缩放探索
- 回忆以坐标点散布在地图上，点击查看详情
- 筛选类型：全部 / 第一次 / 照片 / 日记 / 信件
- 点击地图可添加新的回忆坐标

### 交换日记
- 两人共同书写日记，支持主题式写作
- 写完后才能解锁对方的版本
- 内置灵感主题库，随机推荐话题
- 支持选择心情印记

### 照片功能
- **我们的第一次**：垂直时间线展示所有里程碑事件
- **秘密花园**：需要暗号才能进入的私密相册
- **上传照片**：支持添加心情印记
- **帮我记住信箱**：把想给对方看的瞬间放进信箱

### 时光信
- 写信给未来某天的对方
- 到期前会被封印，主页显示倒计时
- 可自定义封印颜色

### "我爱你"的100种表达
- 轮流写一句不直接说"我爱你"却能表达爱意的话
- 交替颜色卡片，滚动展示

### 秘密问答罐
- 摇一摇罐子，随机弹出深度问题
- 双方各自回答，都完成后才能揭晓

### 小卖部兑换券
- 制作电子兑换券发给对方
- 对方可以点击"兑换"，加盖已兑换戳记

### 一起倒数吧
- 设定共同期待的事件倒计时
- 实时更新的翻页时钟效果

### 纪念日彩蛋
- 纪念日、生日当天登录自动触发庆祝彩蛋

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18 + Vite | 前端框架 |
| React Router v7 | 路由 |
| Framer Motion | 动画 |
| CSS Custom Properties | 手绘风格样式 |
| ZCOOL KuaiLe + Noto Serif SC | 字体 |
| localStorage | 数据存储 |

## 项目结构

```
src/
├── contexts/          # AuthContext, DataContext
├── components/
│   ├── layout/        # Layout, NavBar, ProtectedRoute
│   ├── common/        # ConfettiOverlay, MoodStamp
│   ├── map/           # TimeMap, MapNode, MemoryPopup
│   └── diary/         # DiaryBook, DiaryEditor
├── pages/             # 所有页面组件
├── data/              # 模拟数据
└── utils/             # 常量、存储工具
```

## 自定义

- 修改纪念日：编辑 `src/utils/constants.js` 中的 `ANNIVERSARIES`
- 修改密码：编辑 `src/data/mockMemories.js` 中 `initializeMockData` 函数
- 修改主题色：编辑 `src/index.css` 中的 CSS 变量
- 添加题库：编辑 `src/pages/QuizPage.jsx` 中的 `QUESTIONS` 数组

---

愿虾米和汉堡一直幸福下去。
