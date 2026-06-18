# 地鼠突击队（Mole Strike）

一个面向 Cocos Creator 3.8 LTS 的 2D 入门小游戏项目，玩法为 60 秒限时打地鼠。项目代码按真实商业项目拆分模块，兼容微信小游戏与抖音小游戏的工程习惯。

## 技术栈

- Cocos Creator 3.8 LTS
- TypeScript
- 2D Canvas/UI 节点
- 微信小游戏兼容
- 抖音小游戏兼容

## 当前玩法

- 开始游戏后倒计时 60 秒
- 中央 3x3 共 9 个地鼠洞
- 地鼠随机从洞中出现
- 同一时间最多 1 只地鼠
- 点击普通地鼠获得 1 分
- 地鼠停留 1 秒后自动缩回
- 时间结束后显示结算界面

## 项目结构

```text
MoleStrike/
├── assets/
│   ├── resources/          # 运行时加载的正式美术与音效
│   ├── prefabs/            # Mole、Hole、Button 等 Prefab
│   ├── scenes/             # Main.scene
│   ├── scripts/
│   │   ├── core/           # 公共类型、音效管理
│   │   ├── game/           # 玩法模块
│   │   └── ui/             # UI 模块
│   └── textures/           # 预留的编辑器绑定贴图
├── docs/
│   ├── ART_AUDIO_SPEC.md
│   ├── SCENE_AND_PREFAB.md
│   └── STAGE_TWO_PLAN.md
├── release-assets/        # 图标、启动图、商店文案与合规模板
├── settings/               # Cocos 项目设置预留目录
├── package.json
├── project.json
└── tsconfig.json
```

## 核心模块

| 模块 | 路径 | 职责 |
| --- | --- | --- |
| GameManager | `assets/scripts/game/GameManager.ts` | 游戏状态管理与模块编排 |
| ScoreManager | `assets/scripts/game/ScoreManager.ts` | 分数数据与分数显示 |
| TimerManager | `assets/scripts/game/TimerManager.ts` | 60 秒倒计时 |
| MoleManager | `assets/scripts/game/MoleManager.ts` | 地鼠随机生成与回收 |
| Mole | `assets/scripts/game/Mole.ts` | 单只地鼠出现、命中、缩回 |
| UIManager | `assets/scripts/ui/UIManager.ts` | 开始、游戏、结算页面切换 |
| SafeAreaLayout | `assets/scripts/ui/SafeAreaLayout.ts` | 微信/抖音异形屏安全区适配 |
| AudioManager | `assets/scripts/core/AudioManager.ts` | 音效播放 |
| ArtResourceManager | `assets/scripts/core/ArtResourceManager.ts` | 正式美术预载、缓存与降级 |
| ComboManager | `assets/scripts/game/ComboManager.ts` | 连击计算与连击显示 |
| StorageManager | `assets/scripts/core/StorageManager.ts` | 本地最高分存档 |

## 已接入体验反馈

- 点击地鼠后显示 `+1` 飘字。
- 连续命中会显示 `Combo xN`。
- 地鼠超时未命中会断连。
- 结算页显示历史最高分。
- 已支持普通地鼠、金色地鼠、炸弹地鼠三种类型。
- 已支持 60 秒内难度递增。
- 已支持地鼠对象池，减少游戏中频繁创建销毁节点。
- 已支持音效开关与本地保存。
- 结算页已支持评级和新纪录提示。
- 已新增微信/抖音平台适配层，接入震动、分享和排行榜入口。
- 音效通过 `assets/resources/audio` 自动加载，无需手动拖拽 AudioClip。
- 正式草地背景、三种地鼠和木质洞口通过 `assets/resources/textures/gameplay` 自动加载。
- 已加入统一按钮按压反馈、分类命中光圈、炸弹震动、暂停淡入淡出和结算登场动画。
- 已加入首次开始三页新手引导、完成存档和跳过功能。
- 已加入独立背景音乐轨道，支持与音效一起开关和自动循环。
- 已加入每日挑战、跨局进度保存和勋章奖励，形成基础复玩目标。
- 已提供微信/抖音竖屏构建模板和 `npm run verify:release` 发布审计。
- 已生成平台图标、启动图，并准备商店文案、隐私政策和用户协议模板。

## 编辑器接入流程

1. 使用 Cocos Creator 3.8 LTS 打开本目录。
2. 等待资源管理器完成新增 TypeScript 与贴图的导入。
3. 打开 `assets/scenes/Main.scene`，确认 Canvas 上挂载 `AutoGameBootstrap`。
4. 运行预览，确认开始、暂停、计分、倒计时、正式贴图和结算流程。

## 小游戏发布建议

- 不使用浏览器 DOM API；本地存档后续通过平台适配层统一封装。
- 音频通过 Cocos `AudioSource` 播放，适配微信/抖音小游戏运行时。
- 资源尺寸控制在移动端友好范围，建议单张贴图不超过 1024x1024。
- 后续排行榜分别接入微信开放数据域或抖音小游戏排行榜能力，业务代码通过适配层隔离平台差异。
