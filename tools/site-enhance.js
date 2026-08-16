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

  /* ---------- 3. 加密文章防暴力尝试（渐进锁定）---------- */
  function guardEncryptedPost() {
    var input = document.getElementById("hbePass");
    if (!input || input.__guarded) return;
    input.__guarded = true;

    var KEY = "hbeTries";
    var tries = 0;
    try { tries = parseInt(sessionStorage.getItem(KEY) || "0", 10) || 0; } catch (e) { tries = 0; }
    var locked = false;
    var lastAttempt = 0;

    function lockFor(seconds) {
      locked = true;
      input.disabled = true;
      var form = input.closest("form");
      var btn = form ? form.querySelector("button") : null;
      if (btn) btn.disabled = true;
      var tip = document.getElementById("hbe-lock-tip");
      if (!tip && input.parentNode) {
        tip = document.createElement("div");
        tip.id = "hbe-lock-tip";
        input.parentNode.insertBefore(tip, input.nextSibling);
      }
      var endAt = Date.now() + seconds * 1000;
      (function tick() {
        var left = Math.ceil((endAt - Date.now()) / 1000);
        if (left > 0) {
          if (tip) tip.textContent = "尝试次数过多，请 " + left + " 秒后再试";
          setTimeout(tick, 500);
        } else {
          if (tip) tip.textContent = "";
          locked = false;
          input.disabled = false;
          if (btn) btn.disabled = false;
          if (input.focus) input.focus();
        }
      })();
    }

    function onAttempt() {
      var now = Date.now();
      if (locked || now - lastAttempt < 400) return;
      lastAttempt = now;
      /* 1.6s 后若输入框仍在，说明密码错误（正确时整个输入区会被替换为正文） */
      setTimeout(function () {
        if (!document.getElementById("hbePass")) return;
        tries += 1;
        try { sessionStorage.setItem(KEY, String(tries)); } catch (e) {}
        if (tries >= 5) {
          lockFor(Math.min(300, 30 * Math.pow(2, tries - 5)));
        }
      }, 1600);
    }

    var form = input.closest("form");
    if (form) {
      form.addEventListener("submit", onAttempt, { passive: true });
      var btn = form.querySelector("button");
      if (btn) btn.addEventListener("click", onAttempt, { passive: true });
    }
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") onAttempt();
    });
  }
  guardEncryptedPost();
  document.addEventListener("pjax:complete", guardEncryptedPost);
})();
