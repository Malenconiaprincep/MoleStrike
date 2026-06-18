# 场景与 Prefab 结构

## 主场景：Main.scene

```text
Canvas
├── Background
│   └── GrassBg(Sprite)
├── Managers
│   ├── GameManager(GameManager)
│   ├── ScoreManager(ScoreManager)
│   ├── TimerManager(TimerManager)
│   ├── MoleManager(MoleManager)
│   ├── UIManager(UIManager)
│   └── AudioManager(AudioSource, AudioManager)
├── HomePanel
│   ├── Title(Label: 地鼠突击队)
│   └── StartButton(Button)
│       └── Label(Label: 开始游戏)
├── GamePanel
│   ├── TopBar
│   │   ├── ScoreIcon(Sprite)
│   │   ├── ScoreLabel(Label: Score: 0)
│   │   ├── TimeIcon(Sprite)
│   │   └── TimeLabel(Label: 60)
│   ├── HoleRoot
│   │   ├── Hole_01
│   │   ├── Hole_02
│   │   ├── Hole_03
│   │   ├── Hole_04
│   │   ├── Hole_05
│   │   ├── Hole_06
│   │   ├── Hole_07
│   │   ├── Hole_08
│   │   └── Hole_09
│   └── PauseButton(Button)
├── PauseMask
│   └── PauseLabel(Label: 已暂停)
└── ResultPanel
    ├── Title(Label: 游戏结束)
    ├── FinalScoreLabel(Label: 最终得分：0)
    ├── ReplayButton(Button)
    │   └── Label(Label: 再来一次)
    └── HomeButton(Button)
        └── Label(Label: 返回首页)
```

## 关键节点设置

### Canvas

- 设计分辨率：`750 x 1334`
- Fit Width：开启
- Fit Height：开启
- 适合竖屏微信小游戏/抖音小游戏。

### Background

- 全屏草地背景。
- 建议使用 `Widget` 组件四边贴齐。

### HomePanel

- 默认显示。
- `StartButton` 的 ClickEvents 绑定：
  - Target：`Managers/GameManager`
  - Component：`GameManager`
  - Handler：`handleStartButton`

### GamePanel

- 默认隐藏。
- `HoleRoot` 建议使用 `Layout` 组件：
  - Type：Grid
  - Resize Mode：Container
  - Cell Size：`170 x 150`
  - Spacing X：`18`
  - Spacing Y：`20`
- `PauseButton` 的 ClickEvents 绑定 `GameManager.handlePauseButton`。

### ResultPanel

- 默认隐藏。
- `ReplayButton` 的 ClickEvents 绑定 `GameManager.handleReplayButton`。
- `HomeButton` 的 ClickEvents 绑定 `GameManager.handleHomeButton`。

## 管理器绑定关系

### GameManager

- `scoreManager`：拖入 `Managers/ScoreManager`
- `timerManager`：拖入 `Managers/TimerManager`
- `moleManager`：拖入 `Managers/MoleManager`
- `uiManager`：拖入 `Managers/UIManager`
- `audioManager`：拖入 `Managers/AudioManager`
- `gameSeconds`：`60`

### ScoreManager

- `scoreLabel`：拖入 `GamePanel/TopBar/ScoreLabel`

### TimerManager

- `timeLabel`：拖入 `GamePanel/TopBar/TimeLabel`

### MoleManager

- `holes`：依次拖入 `Hole_01` 到 `Hole_09`
- `molePrefab`：拖入 `assets/prefabs/Mole.prefab`
- `audioManager`：拖入 `Managers/AudioManager`
- `minSpawnDelay`：`0.2`
- `maxSpawnDelay`：`0.8`

### UIManager

- `homePanel`：拖入 `HomePanel`
- `gamePanel`：拖入 `GamePanel`
- `resultPanel`：拖入 `ResultPanel`
- `pauseMask`：拖入 `PauseMask`
- `finalScoreLabel`：拖入 `ResultPanel/FinalScoreLabel`

### AudioManager

- 节点上添加 `AudioSource`。
- `audioSource`：拖入同节点 `AudioSource`。
- 其他字段拖入对应 AudioClip。

## Prefab：Mole.prefab

```text
Mole(Node)
├── Body(Sprite, Mole)
├── EyeLeft(Sprite)
├── EyeRight(Sprite)
└── HitArea(UITransform)
```

推荐做法：

- `Mole` 根节点挂载 `Mole` 脚本。
- 根节点需要 `UITransform`，尺寸建议 `120 x 120`。
- 地鼠主体 Sprite 可直接放在根节点，也可以使用 `Body` 子节点。
- `bodySprite` 字段拖入主体 Sprite。
- Anchor Y 建议设为 `0`，从洞口向上冒出更自然。

## Prefab：Hole.prefab

```text
Hole(Node)
├── HoleBack(Sprite)
├── MoleSpawnPoint(Node)
└── HoleFront(Sprite)
```

当前代码直接把 `Mole.prefab` 加到 `Hole_XX` 下并放在 `Vec3.ZERO`。如果使用前后层洞口，可把 `MoleSpawnPoint` 作为洞节点或调整洞节点锚点，使地鼠层级在 `HoleBack` 与 `HoleFront` 之间。

## Prefab：CartoonButton.prefab

```text
CartoonButton(Button)
├── Background(Sprite)
└── Label(Label)
```

建议按钮状态：

- Normal：暖黄色或橙黄色
- Pressed：略暗、缩放到 `0.96`
- Disabled：降低饱和度

