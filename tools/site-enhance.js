/* 心理学增强脚本：可信度徽章 + 阅读进度条
 * 1. 建站天数徽章 —— 暗示"持续经营、值得信任"
 * 2. 顶部渐变进度条 —— 进度感知与阅读成就感
 * 注意：本文件会被 build-inject.js 单行化，JS 内统一用双引号，勿用单引号
 */
(function () {
  /* ---------- 1. 建站天数徽章 ---------- */
  var START = new Date("2026-08-16T00:00:00+08:00");
  function addUptimeBadge() {
    var info = document.getElementById("site-info");
    if (!info || document.getElementById("site-uptime")) return;
    var days = Math.max(1, Math.floor((Date.now() - START.getTime()) / 86400000) + 1);
    var b = document.createElement("div");
    b.id = "site-uptime";
    b.innerHTML = "<span class=\"uptime-dot\"></span>已稳定运行 " + days + " 天";
    info.appendChild(b);
  }
  addUptimeBadge();
  document.addEventListener("pjax:complete", addUptimeBadge);

  /* ---------- 2. 顶部阅读进度条 ---------- */
  var bar = document.createElement("div");
  bar.id = "reading-progress-bar";
  document.body.appendChild(bar);

  function updateProgress() {
    var st = window.scrollY || document.documentElement.scrollTop || 0;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? st / h : 0;
    bar.style.width = (p * 100).toFixed(2) + "%";
    bar.style.opacity = p > 0.005 ? "1" : "0";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();
