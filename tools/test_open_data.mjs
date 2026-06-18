import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const scripts = [
  ['微信', 'build-templates/wechatgame/open-data/index.js', 'wx'],
  ['抖音', 'build-templates/bytedance-mini-game/open-data/index.js', 'tt'],
];

for (const [label, file, globalName] of scripts) {
  const drawCalls = [];
  let messageHandler = null;
  let clearCount = 0;
  const context2d = {
    fillStyle: '',
    textAlign: '',
    font: '',
    clearRect() { clearCount += 1; },
    fillRect() {},
    fillText(text, x, y) { drawCalls.push({ text: String(text), x, y }); },
  };
  const platform = {
    onMessage(handler) { messageHandler = handler; },
    getFriendCloudStorage(options) {
      options.success({
        data: [
          { nickname: '新兵', KVDataList: [{ key: 'best_score', value: '12' }] },
          { nickname: '队长', KVDataList: [{ key: 'best_score', value: '48' }] },
        ],
      });
    },
  };
  const sandbox = {
    sharedCanvas: { width: 640, height: 960, getContext: () => context2d },
    [globalName]: platform,
  };

  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  assert.equal(typeof messageHandler, 'function', `${label}子域应注册消息监听`);
  messageHandler({ type: 'showLeaderboard' });

  const texts = drawCalls.map((call) => call.text);
  assert.ok(texts.includes('好友排行榜'), `${label}子域应绘制榜单标题`);
  assert.ok(texts.indexOf('队长') < texts.indexOf('新兵'), `${label}子域应按分数降序绘制`);
  assert.ok(texts.includes('48 分') && texts.includes('12 分'), `${label}子域应绘制好友分数`);

  const clearsBeforeHide = clearCount;
  messageHandler({ type: 'hideLeaderboard' });
  assert.ok(clearCount > clearsBeforeHide, `${label}子域关闭时应清空共享画布`);
}

console.log('开放数据域冒烟测试通过：微信、抖音');
