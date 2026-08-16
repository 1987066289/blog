/* 首页大横幅：第一次向下滚动时整屏跳转到内容区，本次访问内不再出现 */
(function () {
  var KEY = 'heroGone';
  var body = document.body;

  function applyGone() {
    body.classList.add('hero-gone');
    var h = document.getElementById('page-header');
    if (h) h.style.height = '';
  }

  var fresh = false;
  try { fresh = sessionStorage.getItem(KEY) !== '1'; } catch (e) { fresh = true; }
  if (!fresh) { applyGone(); return; }

  var locked = false;
  var finished = false;

  function dismiss() {
    if (locked || finished) return;
    var header = document.getElementById('page-header');
    var siteInfo = document.getElementById('site-info');
    if (!header || !siteInfo) return; /* 仅首页（有大标题横幅）生效 */
    locked = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    var h0 = header.offsetHeight;
    var y0 = window.scrollY || document.documentElement.scrollTop || 0;
    var dur = 300;
    var t0 = null;
    function frame(now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 2); /* easeOutQuad：干脆利落的跳转感 */
      header.style.overflow = 'hidden';
      header.style.height = (h0 * (1 - e)) + 'px';
      window.scrollTo(0, y0 + h0 * e); /* 横幅上收的同时内容整体上移一屏 */
      if (p < 1) { requestAnimationFrame(frame); }
      else { locked = false; finished = true; applyGone(); }
    }
    requestAnimationFrame(frame);
  }

  /* 第一次向下滚轮：瞬间跳到内容区，动画期间锁定滚动 */
  window.addEventListener('wheel', function (ev) {
    if (finished) return;
    if (locked) { ev.preventDefault(); return; }
    if (ev.deltaY > 2 && !ev.ctrlKey) { ev.preventDefault(); dismiss(); }
  }, { passive: false });

  /* 触屏：第一次下滑手势 */
  var touchY = null;
  window.addEventListener('touchstart', function (ev) { touchY = ev.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', function (ev) {
    if (finished) return;
    if (locked) { ev.preventDefault(); return; }
    if (touchY !== null && ev.touches[0].clientY < touchY - 15) { ev.preventDefault(); dismiss(); }
  }, { passive: false });

  /* 键盘翻页 / 拖动滚动条兜底 */
  window.addEventListener('scroll', function () {
    if (!finished && (window.scrollY || document.documentElement.scrollTop) > 60) dismiss();
  }, { passive: true });
})();
