(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page') || 'home';
  var numFmt = new Intl.NumberFormat('ar-EG');

  /* ============================================================
     الثيم — فاتح افتراضياً، داكن مشتق من لوني الهوية، محفوظ
     ============================================================ */
  var themeToggle = document.getElementById('theme-toggle');
  var iconMoon = document.getElementById('icon-moon');
  var iconSun = document.getElementById('icon-sun');

  function applyTheme(mode) {
    if (mode === 'dark') {
      root.classList.add('dark');
      iconMoon.classList.add('hidden');
      iconSun.classList.remove('hidden');
    } else {
      root.classList.remove('dark');
      iconMoon.classList.remove('hidden');
      iconSun.classList.add('hidden');
    }
  }

  var saved = null;
  try { saved = localStorage.getItem('tanasooq-theme'); } catch (e) {}
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  themeToggle.addEventListener('click', function () {
    var next = root.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('tanasooq-theme', next); } catch (e) {}
  });

  /* ============================================================
     حالة الهيدر عند التمرير (عبر Sentinel — بدون scroll listener)
     ============================================================ */
  var header = document.getElementById('site-header');
  var sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
  document.body.prepend(sentinel);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var scrolled = !entry.isIntersecting;
        header.classList.toggle('glass-panel', scrolled);
        header.classList.toggle('border-brand-100/70', scrolled);
        header.classList.toggle('shadow-card', scrolled);
        header.classList.toggle('dark:border-white/5', scrolled);
      });
    }).observe(sentinel);
  }

  /* ============================================================
     ظهور العناوين كلمة كلمة
     ============================================================ */
  var splitTitles = document.querySelectorAll('#hero-title, #works-title');
  if (!reduceMotion) {
    splitTitles.forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w, i) {
        return '<span class="word-mask"><span style="--wd:' + (i * 90 + 150) + 'ms">' + w + '</span></span> ';
      }).join('');
    });
  }

  /* عناصر الهيرو المتبقية */
  var heroEls = document.querySelectorAll('.hero-in');
  heroEls.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)';
    el.style.transitionDelay = (i * 110 + 300) + 'ms';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
  });

  /* ============================================================
     الكشف عند التمرير
     ============================================================ */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ============================================================
     عدادات إحصائية
     ============================================================ */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObs.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10);
        var start = performance.now();
        var duration = 1600;
        function tick(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = numFmt.format(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObs.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = numFmt.format(parseInt(el.dataset.count, 10)); });
  }

  /* ============================================================
     الزر المغناطيسي
     ============================================================ */
  var magnetic = document.querySelector('.magnetic');
  if (magnetic && window.matchMedia('(hover:hover)').matches && !reduceMotion) {
    var rect = null;
    magnetic.addEventListener('pointerenter', function () {
      rect = magnetic.getBoundingClientRect();
    });
    magnetic.addEventListener('pointermove', function (e) {
      if (!rect) return;
      var x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      var y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      magnetic.style.transform = 'translate(' + (x * 10) + 'px,' + (y * 8) + 'px)';
    });
    magnetic.addEventListener('pointerleave', function () {
      rect = null;
      magnetic.style.transform = '';
    });
  }

  /* ============================================================
     ميلان البطاقة البصرية (tilt 3D)
     ============================================================ */
  var tiltCard = document.getElementById('tilt-card');
  if (tiltCard && window.matchMedia('(hover:hover)').matches && !reduceMotion) {
    var visual = document.getElementById('hero-visual');
    var rafId = null;
    visual.addEventListener('pointermove', function (e) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        var r = visual.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tiltCard.style.transform =
          'rotateY(' + (px * 10) + 'deg) rotateX(' + (-py * 10) + 'deg)';
      });
    });
    visual.addEventListener('pointerleave', function () {
      if (rafId) cancelAnimationFrame(rafId);
      tiltCard.style.transform = '';
    });
  }

  /* ============================================================
     قائمة الجوال
     ============================================================ */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var iconOpen = document.getElementById('menu-icon-open');
  var iconClose = document.getElementById('menu-icon-close');

  function toggleMenu(force) {
    var show = force !== undefined ? force : mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', !show);
    iconOpen.classList.toggle('hidden', show);
    iconClose.classList.toggle('hidden', !show);
  }

  menuToggle.addEventListener('click', function () { toggleMenu(); });
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { toggleMenu(false); });
  });

  /* ============================================================
     تمييز الرابط النشط (صفحة الهبوط فقط)
     ============================================================ */
  var navLinks = document.querySelectorAll('#nav-links a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var sections = [];
    navLinks.forEach(function (link) {
      var sec = document.querySelector(link.getAttribute('href'));
      if (sec) sections.push(sec);
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('text-brand-700', active);
          link.classList.toggle('bg-brand-50/80', active);
          link.classList.toggle('dark:text-brand-200', active);
          link.classList.toggle('dark:bg-white/5', active);
        });
      });
    }, { rootMargin: '-38% 0px -55% 0px' });
    sections.forEach(function (sec) { spy.observe(sec); });
  }

  /* ============================================================
     زر العودة للأعلى
     ============================================================ */
  var backTop = document.getElementById('back-top');
  var backSentinel = document.getElementById('project') || document.querySelector('main > section');
  if (backTop && backSentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var visible = !entries[0].isIntersecting;
      backTop.classList.toggle('opacity-0', !visible);
      backTop.classList.toggle('translate-y-20', !visible);
    }, { rootMargin: '0px 0px -85% 0px' }).observe(backSentinel);
  }
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ============================================================
     بيانات الأعمال — فئات وتفاصيل
     ============================================================ */
  function pad(n) {
    return 'assets/img/gallery/work-' + (n < 10 ? '0' + n : n) + '.jpg';
  }

  var AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢', '١٣', '١٤', '١٥'];

  var WORKS = [
    {
      src: 'assets/img/identity-all.png',
      title: 'الهوية البصرية الكاملة',
      cat: 'identity',
      catLabel: 'الهوية الكاملة',
      desc: 'عرض شامل لمكونات هوية «تناسق»: الشعار، الألوان، الخطوط، والعناصر البصرية على لوحة واحدة.'
    }
  ];

  for (var m = 1; m <= 5; m++) {
    WORKS.push({
      src: pad(m),
      title: m === 1 ? 'موك أب مجلة A4' : 'موك أب كتاب دليل الهوية ' + AR[m - 1],
      cat: 'mockup',
      catLabel: 'الموك أب',
      desc: 'موك أب احترافي يعرض دليل الهوية البصرية على الوسائط المطبوعة بجودة إخراج عالية.'
    });
  }

  for (var g = 6; g <= 20; g++) {
    WORKS.push({
      src: pad(g),
      title: 'صفحة ' + AR[g - 6] + ' من دليل الهوية',
      cat: 'guide',
      catLabel: 'دليل الهوية',
      desc: 'صفحة من الدليل الإرشادي لهوية «تناسق للحلول الإبداعية» توثق قواعد الاستخدام والتطبيق.'
    });
  }

  var CATS = { all: 'الكل', identity: 'الهوية الكاملة', guide: 'دليل الهوية', mockup: 'الموك أب' };

  /* ============================================================
     معرض الأعمال — لمحة في الهبوط / كامل مع فلاتر في الصفحة الخاصة
     ============================================================ */
  var gallery = document.getElementById('gallery');
  var items = [];
  var currentFilter = 'all';
  var activeItems = [];

  if (gallery) {
    if (page === 'works') {
      items = WORKS;
      activeItems = items.slice();

      /* تحديث عدادات الفلاتر */
      Object.keys(CATS).forEach(function (key) {
        var el = document.querySelector('[data-count-for="' + key + '"]');
        if (el) el.textContent = numFmt.format(key === 'all' ? items.length : items.filter(function (w) { return w.cat === key; }).length);
      });
      var allCount = document.getElementById('count-all');
      if (allCount) allCount.textContent = numFmt.format(items.length);

      /* أزرار الفلترة */
      var chips = document.querySelectorAll('.filter-chip');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) {
            c.classList.remove('active', 'bg-hero-gradient', 'text-white', 'shadow-soft');
            c.classList.add('border-brand-200', 'bg-white/70', 'text-brand-700');
            c.classList.add('dark:border-white/10', 'dark:bg-night-900/70', 'dark:text-brand-200');
          });
          chip.classList.add('active', 'bg-hero-gradient', 'text-white', 'shadow-soft');
          chip.classList.remove('border-brand-200', 'bg-white/70', 'text-brand-700', 'dark:border-white/10', 'dark:bg-night-900/70', 'dark:text-brand-200');
          currentFilter = chip.dataset.filter;
          activeItems = currentFilter === 'all' ? items.slice() : items.filter(function (w) { return w.cat === currentFilter; });
          renderGallery(true);
        });
      });
    } else {
      /* الهبوط: لمحة مختارة */
      [0, 1, 2, 3, 4, 6, 7, 8].forEach(function (i) {
        if (WORKS[i]) items.push(WORKS[i]);
      });
      activeItems = items.slice();
    }

    function renderGallery(refresh) {
      gallery.innerHTML = '';
      var empty = document.getElementById('gallery-empty');
      if (empty) empty.classList.toggle('hidden', activeItems.length > 0);

      activeItems.forEach(function (item, idx) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'group relative overflow-hidden rounded-2xl border border-brand-100 bg-brand-50 text-right transition duration-500 hover:-translate-y-1.5 hover:shadow-glow dark:border-white/10 dark:bg-night-800';
        card.dataset.index = String(idx);
        card.setAttribute('aria-label', 'عرض ' + item.title);

        var inner = '<img src="' + item.src + '" alt="' + item.title + '" loading="lazy" class="w-full object-cover transition duration-700 ease-out group-hover:scale-110' + (page === 'works' ? ' aspect-square' : ' aspect-square') + '">' +
          '<span class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0816]/80 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100"></span>' +
          '<span class="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 opacity-0 transition duration-300 group-hover:opacity-100">' +
          '<span class="flex min-w-0 flex-col gap-1">' +
          '<span class="truncate text-sm font-medium text-white">' + item.title + '</span>';

        if (page === 'works') {
          inner += '<span class="text-[11px] text-white/60">' + item.catLabel + '</span>';
        }
        inner += '</span>' +
          '<span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">' +
          '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.3-4.3M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"/></svg>' +
          '</span></span>';

        if (page === 'works') {
          inner += '<span class="block border-t border-brand-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-night-900">' +
            '<span class="block text-sm font-medium text-[#231536] dark:text-white">' + item.title + '</span>' +
            '<span class="mt-0.5 block text-[11px] font-medium text-brand-500 dark:text-brand-300">' + item.catLabel + '</span>' +
            '</span>';
        }

        card.innerHTML = inner;
        card.addEventListener('click', function () { openLightbox(Number(card.dataset.index)); });
        if (refresh) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          card.style.transition = 'opacity .5s cubic-bezier(.22,1,.36,1), transform .5s cubic-bezier(.22,1,.36,1)';
          card.style.transitionDelay = (idx % 8) * 45 + 'ms';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.style.opacity = '1';
              card.style.transform = 'none';
            });
          });
        }
        gallery.appendChild(card);
      });
    }

    renderGallery(false);
  }

  /* ============================================================
     نافذة عرض الصور — مع تفاصيل في صفحة المعرض
     ============================================================ */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxBadge = document.getElementById('lightbox-badge');
  var lightboxTitle = document.getElementById('lightbox-title');
  var lightboxDesc = document.getElementById('lightbox-desc');
  var current = 0;

  function getItem(idx) {
    return activeItems[idx];
  }

  function openLightbox(idx) {
    if (!activeItems[idx]) return;
    current = idx;
    renderLightbox();
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    var item = getItem(current);
    if (!item) return;
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(.96)';
    setTimeout(function () {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      if (page === 'works') {
        lightboxBadge.textContent = CATS[item.cat] + ' — ' + numFmt.format(current + 1) + ' من ' + numFmt.format(activeItems.length);
        lightboxTitle.textContent = item.title;
        lightboxDesc.textContent = item.desc;
      } else {
        lightboxBadge.textContent = 'من دليل الهوية البصرية';
        lightboxTitle.textContent = item.title;
        lightboxDesc.textContent = '';
      }
      requestAnimationFrame(function () {
        lightboxImg.style.transition = 'opacity .35s ease, transform .5s cubic-bezier(.22,1,.36,1)';
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      });
    }, 120);
  }

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', function () {
    current = (current - 1 + activeItems.length) % activeItems.length;
    renderLightbox();
  });
  document.getElementById('lightbox-next').addEventListener('click', function () {
    current = (current + 1) % activeItems.length;
    renderLightbox();
  });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { current = (current + 1) % activeItems.length; renderLightbox(); }
    if (e.key === 'ArrowRight') { current = (current - 1 + activeItems.length) % activeItems.length; renderLightbox(); }
  });

  /* ============================================================
     عارض ملفات PDF (صفحة الهبوط فقط)
     ============================================================ */
  var frame = document.getElementById('pdf-frame');
  var openLink = document.getElementById('pdf-open');
  var downloadLink = document.getElementById('pdf-download');
  var docTitle = document.getElementById('pdf-doc-title');
  var docMeta = document.getElementById('pdf-doc-meta');
  var fullscreenBtn = document.getElementById('pdf-fullscreen');
  var stage = document.getElementById('pdf-stage');
  var tabs = document.querySelectorAll('.pdf-tab');

  if (frame && tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active', 'bg-hero-gradient', 'text-white', 'shadow-soft'); });
        tab.classList.add('active', 'bg-hero-gradient', 'text-white', 'shadow-soft');
        frame.style.opacity = '0';
        setTimeout(function () {
          frame.src = tab.dataset.src;
          openLink.href = tab.dataset.src;
          if (downloadLink) downloadLink.href = tab.dataset.src;
          if (docTitle) docTitle.textContent = tab.dataset.title || tab.textContent.trim();
          if (docMeta) docMeta.textContent = tab.dataset.meta || '';
          frame.style.opacity = '1';
        }, 180);
      });
    });

    fullscreenBtn.addEventListener('click', function () {
      if (!stage) return;
      if (!document.fullscreenElement) {
        if (stage.requestFullscreen) stage.requestFullscreen();
        else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    });

    document.querySelectorAll('.doc-go').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = link.dataset.src;
        var tab = Array.prototype.slice.call(tabs).filter(function (t) { return t.dataset.src === target; })[0];
        if (tab) { e.preventDefault(); tab.click(); }
        var files = document.getElementById('files');
        if (files) files.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ============================================================
     أهمية المشروع — أكورديون تفاعلي
     ============================================================ */
  var impactItems = document.querySelectorAll('[data-impact]');
  if (impactItems.length) {
    impactItems.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wasActive = btn.classList.contains('active');
        impactItems.forEach(function (b) {
          b.classList.remove('active');
          b.classList.add('border-brand-100', 'hover:border-brand-300');
          b.classList.remove('border-brand-300', 'shadow-glow');
        });
        if (!wasActive) {
          btn.classList.add('active', 'border-brand-300', 'shadow-glow');
          btn.classList.remove('border-brand-100', 'hover:border-brand-300');
        }
      });
    });
  }

  /* ============================================================
     حدود المشروع — مصنف عناصر تفاعلي
     ============================================================ */
  var scopeTray = document.getElementById('scope-tray');
  var scopeIn = document.getElementById('scope-in-list');
  var scopeOut = document.getElementById('scope-out-list');
  var scopeReset = document.getElementById('scope-reset');
  var scopeHint = document.getElementById('scope-hint');

  function scopeUpdateHint() {
    var total = document.querySelectorAll('.scope-chip').length;
    var placed = document.querySelectorAll('.scope-chip[data-placed]').length;
    if (total && placed === total) {
      scopeHint.innerHTML = '<span class="inline-flex items-center gap-1.5"><svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>اكتمل التصنيف — كل العناصر في مكانها الصحيح</span>';
      scopeHint.classList.add('text-emerald-600', 'dark:text-emerald-400');
    } else {
      scopeHint.textContent = 'اضغط على أي عنصر لوضعه في مكانه الصحيح — ' + (placed || 0) + ' من ' + total;
      scopeHint.classList.remove('text-emerald-600', 'dark:text-emerald-400');
    }
  }

  function scopeAnimate(chip) {
    chip.classList.remove('chip-enter');
    void chip.offsetWidth;
    chip.classList.add('chip-enter');
  }

  function scopePlace(chip) {
    var target = chip.dataset.side === 'in' ? scopeIn : scopeOut;
    chip.dataset.placed = '1';
    target.appendChild(chip);
    scopeAnimate(chip);
    scopeUpdateHint();
  }

  if (scopeTray && scopeIn && scopeOut && scopeHint) {
    document.querySelectorAll('.scope-chip').forEach(function (chip) {
      chip.addEventListener('click', function () { scopePlace(chip); });
    });
    scopeReset.addEventListener('click', function () {
      [scopeIn, scopeOut].forEach(function (list) {
        list.querySelectorAll('.scope-chip').forEach(function (chip) {
          delete chip.dataset.placed;
          scopeTray.appendChild(chip);
          scopeAnimate(chip);
        });
      });
      scopeUpdateHint();
    });
    scopeUpdateHint();
  }
})();
