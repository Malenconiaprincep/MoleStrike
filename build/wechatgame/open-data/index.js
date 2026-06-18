'use strict';

var platform = typeof wx !== 'undefined' ? wx : typeof tt !== 'undefined' ? tt : null;
var canvas = typeof sharedCanvas !== 'undefined' ? sharedCanvas : null;
var context = canvas ? canvas.getContext('2d') : null;
var visible = false;

function drawMessage(message) {
  if (!context || !canvas) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#fff7ce';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#5b341f';
  context.textAlign = 'center';
  context.font = '30px sans-serif';
  context.fillText(message, canvas.width / 2, canvas.height / 2);
}

function scoreOf(player) {
  var list = player.KVDataList || [];
  var score = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].key === 'best_score') score = Number(list[i].value) || 0;
  }
  return score;
}

function drawRanking(players) {
  if (!visible || !context || !canvas) return;
  var ranking = players.slice().sort(function (a, b) { return scoreOf(b) - scoreOf(a); }).slice(0, 10);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#fff7ce';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#5b341f';
  context.textAlign = 'center';
  context.font = 'bold 38px sans-serif';
  context.fillText('好友排行榜', canvas.width / 2, 58);
  context.textAlign = 'left';
  context.font = '28px sans-serif';

  if (ranking.length === 0) {
    context.textAlign = 'center';
    context.fillText('完成一局后即可登榜', canvas.width / 2, 180);
    return;
  }

  ranking.forEach(function (player, index) {
    var y = 125 + index * 68;
    context.fillStyle = index < 3 ? '#ad6e37' : '#66512f';
    context.fillText(String(index + 1), 42, y);
    context.fillStyle = '#4a2d1c';
    var nickname = (player.nickname || '突击队员').slice(0, 10);
    context.fillText(nickname, 105, y);
    context.textAlign = 'right';
    context.fillText(scoreOf(player) + ' 分', canvas.width - 42, y);
    context.textAlign = 'left';
  });
}

function refreshRanking() {
  if (!platform || typeof platform.getFriendCloudStorage !== 'function') {
    drawMessage('当前平台暂不支持好友榜');
    return;
  }
  drawMessage('排行榜加载中…');
  platform.getFriendCloudStorage({
    keyList: ['best_score'],
    success: function (result) { drawRanking(result.data || []); },
    fail: function () { drawMessage('排行榜加载失败，请稍后重试'); },
  });
}

if (platform && typeof platform.onMessage === 'function') {
  platform.onMessage(function (message) {
    if (!message || message.type === 'engine') return;
    if (message.type === 'showLeaderboard') {
      visible = true;
      refreshRanking();
    } else if (message.type === 'hideLeaderboard') {
      visible = false;
      if (context && canvas) context.clearRect(0, 0, canvas.width, canvas.height);
    } else if (message.type === 'submitScore' && visible) {
      refreshRanking();
    }
  });
}
