import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  } catch (error) {
    fail(`${relativePath} 不是有效 JSON: ${error.message}`);
    return null;
  }
}

function walk(directory) {
  const absoluteDirectory = path.join(root, directory);
  if (!fs.existsSync(absoluteDirectory)) {
    return [];
  }

  return fs.readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(relativePath) : [relativePath];
  });
}

function readImageDimensions(relativePath) {
  const buffer = fs.readFileSync(path.join(root, relativePath));
  if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      while (buffer[offset] === 0xff) {
        offset += 1;
      }
      const marker = buffer[offset];
      offset += 1;
      if (marker === 0xd8 || marker === 0xd9) {
        continue;
      }
      const length = buffer.readUInt16BE(offset);
      const isStartOfFrame = marker >= 0xc0 && marker <= 0xc3;
      if (isStartOfFrame) {
        return {
          width: buffer.readUInt16BE(offset + 5),
          height: buffer.readUInt16BE(offset + 3),
        };
      }
      offset += length;
    }
  }

  return null;
}

function verifyImage(relativePath, width, height) {
  if (!exists(relativePath)) {
    fail(`缺少品牌素材: ${relativePath}`);
    return;
  }

  const dimensions = readImageDimensions(relativePath);
  if (!dimensions || dimensions.width !== width || dimensions.height !== height) {
    fail(`${relativePath} 应为 ${width}x${height}`);
  }
}

const requiredFiles = [
  'assets/scenes/Main.scene',
  'assets/scenes/Main.scene.meta',
  'assets/scripts/game/GameManager.ts',
  'assets/scripts/game/DailyChallengeManager.ts',
  'assets/scripts/platform/PlatformAdapter.ts',
  'assets/scripts/ui/SafeAreaLayout.ts',
  'assets/resources/audio/bgm_meadow_loop.mp3',
  'assets/resources/textures/gameplay/gameplay_background.jpg',
  'build-templates/wechatgame/game.json',
  'build-templates/bytedance-mini-game/game.json',
  'release-assets/STORE_LISTING.md',
  'release-assets/PRIVACY_POLICY_TEMPLATE.md',
  'release-assets/USER_AGREEMENT_TEMPLATE.md',
  'release-assets/ASSET_LICENSE_MANIFEST.md',
  'release-assets/SCREENSHOT_PLAN.md',
];

for (const file of requiredFiles) {
  if (!exists(file)) {
    fail(`缺少发布文件: ${file}`);
  }
}

for (const platform of ['wechatgame', 'bytedance-mini-game']) {
  const configPath = `build-templates/${platform}/game.json`;
  const config = readJson(configPath);
  if (config && config.deviceOrientation !== 'portrait') {
    fail(`${configPath} 必须固定为 portrait`);
  }
}

verifyImage('release-assets/branding/app_icon_1024.png', 1024, 1024);
verifyImage('release-assets/branding/launch_screen_1080x1920.jpg', 1080, 1920);
verifyImage('release-assets/branding/launch_screen_750x1334.jpg', 750, 1334);

for (const file of walk('release-assets/branding')) {
  const bytes = fs.statSync(path.join(root, file)).size;
  if (bytes > 2 * 1024 * 1024) {
    fail(`品牌素材超过 2 MB: ${file}`);
  }
}

for (const legalFile of [
  'release-assets/PRIVACY_POLICY_TEMPLATE.md',
  'release-assets/USER_AGREEMENT_TEMPLATE.md',
]) {
  if (exists(legalFile)) {
    const text = fs.readFileSync(path.join(root, legalFile), 'utf8');
    if (/\[[^\]]+\]/.test(text)) {
      warn(`${legalFile} 仍含待运营主体填写的占位符`);
    }
  }
}

const resources = walk('assets/resources');
let resourcesBytes = 0;
for (const file of resources) {
  if (file.endsWith('.meta') || file.endsWith('.DS_Store')) {
    continue;
  }
  const bytes = fs.statSync(path.join(root, file)).size;
  resourcesBytes += bytes;
  if (bytes > 2 * 1024 * 1024) {
    fail(`单个资源超过 2 MB: ${file} (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
  }
}

if (resourcesBytes > 10 * 1024 * 1024) {
  warn(`resources 当前为 ${(resourcesBytes / 1024 / 1024).toFixed(2)} MB，建议规划分包`);
}

const sourceFiles = walk('assets/scripts').filter((file) => file.endsWith('.ts'));
const sourceText = sourceFiles
  .map((file) => fs.readFileSync(path.join(root, file), 'utf8'))
  .join('\n');

if (!sourceText.includes('declare const wx')) {
  fail('平台适配层缺少微信小游戏 wx API 声明');
}
if (!sourceText.includes('declare const tt')) {
  fail('平台适配层缺少抖音小游戏 tt API 声明');
}
if (/console\.(log|debug)\s*\(/.test(sourceText)) {
  fail('业务 TypeScript 中仍包含 console.log/debug');
}
if (/\b(document|window)\s*\./.test(sourceText)) {
  fail('业务 TypeScript 中包含小游戏不兼容的浏览器 DOM API');
}
if (!sourceText.includes('profiler.hideStats()')) {
  warn('未检测到关闭 Cocos 性能统计的代码');
}
if (!sourceText.includes('recordRound') || !sourceText.includes('mole_strike_daily_challenge')) {
  fail('缺少每日挑战进度或持久化实现');
}

const projectAssets = walk('assets');
for (const file of projectAssets) {
  if (file.endsWith('.meta')) {
    continue;
  }
  if (!exists(`${file}.meta`)) {
    warn(`资源尚未生成 .meta，请用 Cocos Creator 导入: ${file}`);
  }
}

console.log(`发布审计: ${failures.length} 个错误, ${warnings.length} 个提醒`);
for (const message of failures) {
  console.error(`ERROR: ${message}`);
}
for (const message of warnings) {
  console.warn(`WARN: ${message}`);
}
console.log(`resources: ${(resourcesBytes / 1024 / 1024).toFixed(2)} MB`);

if (failures.length > 0) {
  process.exitCode = 1;
}
