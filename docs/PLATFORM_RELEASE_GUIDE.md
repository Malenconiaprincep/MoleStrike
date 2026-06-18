# 微信/抖音小游戏发布接入指南

本文档记录当前项目距离微信/抖音小游戏上线的发布接入事项。

## 当前已接入能力

- 平台适配层：`assets/scripts/platform/PlatformAdapter.ts`
- 微信/抖音震动反馈：命中地鼠时调用统一 `vibrateShort`
- 分享入口：结算页 `分享战绩`
- 排行榜入口：结算页 `排行榜`
- 平台静默登录：启动时调用 `wx.login` / `tt.login` 获取临时凭证
- 云端最高分：结算时通过 `setUserCloudStorage` 写入 `best_score`
- 好友排行榜：开放数据域读取、排序并绘制前 10 名
- 编辑器排行榜降级提示与关闭流程
- 编辑器预览安全降级：非小游戏环境不会报错

## Cocos 构建建议

项目已提供：

- `build-templates/wechatgame/game.json`
- `build-templates/bytedance-mini-game/game.json`

两个模板均固定为竖屏。抖音模板同时关闭系统状态栏。正式 AppID 属于平台账号信息，不写入仓库，应在 Cocos 构建面板或对应开发者工具中填写。

构建前先运行：

```bash
npm run verify:release
```

审计必须保持 `0 个错误`。新增资源出现 `.meta` 提醒时，先用 Cocos Creator 打开项目并等待导入完成，再重新运行。

### 微信小游戏

1. 打开 Cocos Creator 顶部菜单 `项目 -> 构建发布`。
2. 发布平台选择 `微信小游戏`，内部平台标识为 `wechatgame`。
3. 填写正式 AppID。
4. 勾选压缩选项，构建后用微信开发者工具打开。
5. 在微信开发者工具里测试：
   - 开始游戏
   - 分享战绩
   - 震动反馈
   - 排行榜加载、关闭和最高分更新
   - 排行榜加载、关闭和最高分更新
   - 真机预览

### 抖音小游戏

1. 打开 Cocos Creator 顶部菜单 `项目 -> 构建发布`。
2. 发布平台选择 `抖音小游戏`，内部平台标识为 `bytedance-mini-game`。
3. 填写正式 AppID。
4. 构建后用抖音开发者工具打开。
5. 在抖音开发者工具里测试：
   - 开始游戏
   - 分享战绩
   - 震动反馈
   - 真机预览

## 排行榜说明

两个构建模板均包含兼容 ES5 的 `open-data/index.js`，主域通过 `SubContextView` 显示共享画布。微信构建明确配置开放数据域；抖音构建器会移除该字段，因此运行时按 `tt.getOpenDataContext` / `tt.setUserCloudStorage` 能力检测，不支持时展示安全降级。开放数据域使用 `best_score` 作为唯一排行榜键；平台后台的数据权限、排行榜开关和正式 AppID 仍需运营账号配置后真机确认。

`PlatformAdapter.login()` 只获取临时 code。正式用户会话必须由业务服务端使用平台密钥交换并签发；严禁把 AppSecret 写入客户端工程。

## 上线前必须替换/确认

- 正式 AppID。
- 从 `release-assets/branding` 选择平台要求尺寸的图标和启动图。
- 使用 `release-assets/STORE_LISTING.md` 填写名称、简介和审核备注。
- 填写并审核 `PRIVACY_POLICY_TEMPLATE.md` 与 `USER_AGREEMENT_TEMPLATE.md`。
- 复核 `ASSET_LICENSE_MANIFEST.md` 素材来源记录。
- 按 `SCREENSHOT_PLAN.md` 采集真实开发者工具与真机截图。
- 平台构建面板中的正式 AppID。
- Cocos 已为所有新增资源生成 `.meta`。
- `npm run verify:release` 为 0 个错误。
- 真机测试报告。

## 平台 API 维护策略

平台 API 可能更新，项目代码采用“可选调用 + 安全降级”：

- 编辑器里没有 `wx` 或 `tt` 时，不执行平台能力。
- 微信环境优先调用 `wx`。
- 抖音环境调用 `tt`。
- 玩法模块只调用 `PlatformAdapter`，不直接调用平台全局对象。
