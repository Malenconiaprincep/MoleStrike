# 第二阶段扩展方案

## 1. 连击系统（已完成首版）

已新增模块：

```text
assets/scripts/game/ComboManager.ts
```

规则建议：

- 1 秒内连续命中刷新连击。
- 连击达到 5、10、20 时显示特效文案。
- 连击可提供分数倍率，但首版建议只做表现，避免数值失控。

接入点：

- `GameManager` 收到 `MoleManager` 的命中回调后调用 `ComboManager.addCombo()`。
- 地鼠超时未命中时调用 `ComboManager.breakCombo()`。

## 2. 排行榜

新增平台适配层：

```text
assets/scripts/platform/PlatformAdapter.ts
assets/scripts/platform/WechatAdapter.ts
assets/scripts/platform/DouyinAdapter.ts
```

设计原则：

- 游戏层只调用 `PlatformAdapter.submitScore(score)`。
- 微信小游戏使用开放数据域展示好友榜。
- 抖音小游戏使用对应平台排行榜接口。
- 编辑器预览环境使用 MockAdapter。

## 3. 本地存档（已完成最高分首版）

已新增模块：

```text
assets/scripts/core/StorageManager.ts
```

建议存储内容：

- 历史最高分
- 累计游玩次数
- 音效开关
- 新手引导进度

接口示例：

```ts
saveBestScore(score: number): void
getBestScore(): number
saveSoundEnabled(enabled: boolean): void
isSoundEnabled(): boolean
```

## 4. 不同类型地鼠（已完成首版）

扩展现有 `GameTypes.ts`：

- 普通地鼠：`+1`
- 金色地鼠：`+5`
- 炸弹地鼠：`-3`

实现方式：

- `MoleManager.pickMoleConfig()` 根据概率返回不同配置。
- `Mole` 根据 `MoleType` 切换 SpriteFrame 或 Prefab 变体。
- `ScoreManager.addScore()` 已支持负数并限制最低为 0。

## 5. 难度递增（已完成首版）

规则建议：

- 0-20 秒：地鼠停留 1 秒，生成间隔 0.4-0.8 秒。
- 20-40 秒：地鼠停留 0.8 秒，生成间隔 0.25-0.6 秒。
- 40-60 秒：地鼠停留 0.6 秒，生成间隔 0.15-0.45 秒。

实现方式：

- `TimerManager` 的 `onTick` 回调把剩余时间传给 `GameManager`。
- `GameManager` 根据时间调用 `MoleManager.setDifficulty(level)`。

## 6. 商业化工程建议

- 增加 `EventBus`，解耦 UI 动画、音效与玩法逻辑。
- 增加 `ConfigManager`，把数值配置放到 JSON。
- 使用资源分包，把主包控制在小游戏平台限制内。
- 已完成：统一埋点接口，记录启动、登录、开始、暂停、结算、复玩、分享和排行榜行为。
- 已完成：平台运行时错误、未处理 Promise 拒绝及最近 20 条本地诊断记录。
- 增加自动化冒烟测试文档，保证核心流程不回退。
