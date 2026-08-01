/* ============================================================
   منصة العرض التقديمي — slides.js
   تنقل بين الشرائح: أزرار، لوحة مفاتيح، لمس، فهرس، ملء شاشة
   ============================================================ */
(function () {
  'use strict';

  var AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢', '١٣', '١٤', '١٥', '١٦', '١٧', '١٨', '١٩'];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- المظهر ---------- */
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('tanasooq-theme'); } catch (e) {}
  var themeBtn = document.getElementById('theme-toggle');
  var themeIconMoon = document.getElementById('icon-moon');
  var themeIconSun = document.getElementById('icon-sun');

  function applyTheme() {
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    if (themeIconMoon && themeIconSun) {
      var dark = document.documentElement.classList.contains('dark');
      themeIconMoon.classList.toggle('hidden', dark);
      themeIconSun.classList.toggle('hidden', !dark);
    }
  }
  applyTheme();
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      savedTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      try { localStorage.setItem('tanasooq-theme', savedTheme); } catch (e) {}
      applyTheme();
    });
  }

  /* ---------- عناصر المنصة ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var total = slides.length;
  if (!total) return;

  var counterEl = document.getElementById('slide-counter');
  var totalEl = document.getElementById('slide-total');
  var titleEl = document.getElementById('slide-title');
  var progressEl = document.getElementById('slide-progress');
  var prevBtn = document.getElementById('slide-prev');
  var nextBtn = document.getElementById('slide-next');
  var tocBtn = document.getElementById('slide-toc-btn');
  var tocPanel = document.getElementById('slide-toc');
  var tocList = document.getElementById('slide-toc-list');
  var fullBtn = document.getElementById('slide-full');
  var notesBtn = document.getElementById('slide-notes-btn');
  var current = 0;

  if (totalEl) totalEl.textContent = AR[total - 1];

  /* ---------- الفهرس ---------- */
  if (tocList) {
    slides.forEach(function (s, i) {
      var t = s.getAttribute('data-title') || ('شريحة ' + AR[i]);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flex items-center gap-3 rounded-2xl border border-brand-100 bg-white/70 px-4 py-3 text-right transition hover:border-brand-300 hover:bg-white dark:border-white/10 dark:bg-night-900/70 dark:hover:border-brand-700';
      btn.innerHTML =
        '<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-hero-gradient text-xs font-semibold text-white">' + AR[i] + '</span>' +
        '<span class="min-w-0 flex-1 truncate text-sm font-medium text-[#231536] dark:text-white">' + t + '</span>';
      btn.addEventListener('click', function () { goTo(i); closeToc(); });
      tocList.appendChild(btn);
    });
  }

  function openToc() {
    if (tocPanel) tocPanel.classList.add('open');
  }
  function closeToc() {
    if (tocPanel) tocPanel.classList.remove('open');
  }
  function toggleToc() {
    if (tocPanel && tocPanel.classList.contains('open')) closeToc(); else openToc();
  }
  if (tocBtn) tocBtn.addEventListener('click', toggleToc);
  var tocClose = document.getElementById('slide-toc-close');
  if (tocClose) tocClose.addEventListener('click', closeToc);
  if (tocPanel) {
    tocPanel.addEventListener('click', function (e) {
      if (e.target === tocPanel) closeToc();
    });
  }

  /* ---------- التنقل ---------- */
  function goTo(n, instant) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === current && slides[current].classList.contains('is-active')) { update(); return; }
    current = n;
    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === n);
      if (i === n && !instant) s.scrollTop = 0;
    });
    update();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function update() {
    if (counterEl) counterEl.textContent = AR[current];
    if (titleEl) titleEl.textContent = slides[current].getAttribute('data-title') || '';
    if (progressEl) progressEl.style.width = ((current + 1) / total * 100).toFixed(2) + '%';
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;
    var notes = slides[current].querySelector('.slide-notes');
    if (notesBtn) {
      var open = notes && notes.classList.contains('open');
      notesBtn.classList.toggle('text-accent-600', !!open);
    }
  }
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  /* ---------- ملاحظات المتحدث ---------- */
  if (notesBtn) {
    notesBtn.addEventListener('click', function () {
      var notes = slides[current].querySelector('.slide-notes');
      if (!notes) return;
      notes.classList.toggle('open');
      update();
    });
  }

  /* ---------- ملء الشاشة ---------- */
  if (fullBtn) {
    fullBtn.addEventListener('click', function () {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(function () {});
      } else {
        document.documentElement.requestFullscreen().catch(function () {});
      }
    });
  }

  /* ---------- لوحة المفاتيح ---------- */
  document.addEventListener('keydown', function (e) {
    if (tocPanel && tocPanel.classList.contains('open')) {
      if (e.key === 'Escape') closeToc();
      return;
    }
    switch (e.key) {
      case 'ArrowLeft': case 'PageDown': case ' ': case 'Enter':
        if (e.key === ' ' || e.key === 'Enter') e.preventDefault();
        next();
        break;
      case 'ArrowRight': case 'PageUp':
        prev();
        break;
      case 'Home': goTo(0); break;
      case 'End': goTo(total - 1); break;
      case 'Escape':
        if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
        break;
      case 'f': case 'F':
        if (fullBtn) fullBtn.click();
        break;
      case 'n': case 'N':
        if (notesBtn) notesBtn.click();
        break;
      case 't': case 'T':
        toggleToc();
        break;
    }
  });

  /* ---------- اللمس ---------- */
  var touchX = null;
  document.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) { if (dx < 0) next(); else prev(); }
    touchX = null;
  }, { passive: true });

  /* ---------- بدء ---------- */
  goTo(0, true);
})();
