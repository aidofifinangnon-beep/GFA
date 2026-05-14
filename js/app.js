/* ========================================
   BIOGRAPHIE - app.js
   Geraud Finangnon AIDOFI - v5
   Enhanced with new features
   ======================================== */

(function () {
  'use strict';

  // Progressive enhancement: enable JS-only features
  document.documentElement.classList.add('js-active');

  // --- Safety timeout: force reveal all elements after 4s ---
  setTimeout(function () {
    var els = document.querySelectorAll('.reveal');
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add('revealed');
    }
  }, 4000);

  // --- Loading Screen ---
  function initLoader() {
    var loader = document.getElementById('loader');
    var fill = document.querySelector('.loader-bar-fill');
    if (!loader) return;

    var progress = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 25 + 10;
      if (progress > 100) progress = 100;
      if (fill) fill.style.width = progress + '%';
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(function () {
          loader.classList.add('hidden');
          // Start typing animation after loader
          initTyping();
        }, 400);
      }
    }, 200);
  }

  // --- Typing Animation ---
  function initTyping() {
    var tagline = document.getElementById('coverTagline');
    if (!tagline) return;

    var text = tagline.getAttribute('data-text') || '';
    tagline.textContent = '';
    tagline.classList.add('typing-cursor');

    var index = 0;
    var speed = 45;

    function type() {
      if (index < text.length) {
        tagline.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        // Remove cursor after typing is done
        setTimeout(function () {
          tagline.classList.remove('typing-cursor');
        }, 1500);
      }
    }

    // Start typing after a short delay
    setTimeout(type, 600);
  }

  // --- Gold Dust Particles Animation (Enhanced Sparkle) ---
  function initGoldDust() {
    var canvas = document.getElementById('goldCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var sparkles = [];
    var particleCount = 140;
    var sparkleCount = 50;
    var time = 0;

    // Gold color palette - multiple shades for richness
    var goldShades = [
      { r: 212, g: 175, b: 55 },   // Rich gold
      { r: 194, g: 120, b: 73 },   // Copper gold
      { r: 224, g: 154, b: 107 },  // Light copper
      { r: 255, g: 215, b: 0 },    // Pure gold
      { r: 218, g: 165, b: 32 },   // Goldenrod
      { r: 184, g: 134, b: 11 },   // Dark goldenrod
      { r: 255, g: 223, b: 120 },  // Pale gold
      { r: 245, g: 196, b: 80 },   // Warm gold
    ];

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticle(fromBottom) {
      var shade = goldShades[Math.floor(Math.random() * goldShades.length)];
      var isLarge = Math.random() < 0.15; // 15% chance of larger sparkle
      var radius = isLarge ? (Math.random() * 2.8 + 1.2) : (Math.random() * 1.6 + 0.2);
      return {
        x: Math.random() * canvas.width,
        y: fromBottom ? (canvas.height + Math.random() * 50) : (Math.random() * canvas.height),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.15, // Gentle upward drift
        radius: radius,
        opacity: Math.random() * 0.6 + 0.15,
        life: Math.random() * 300 + 150,
        maxLife: 0,
        shade: shade,
        twinkleSpeed: Math.random() * 0.08 + 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.3 - 0.15, // Slight horizontal drift
        isLarge: isLarge
      };
    }

    function createSparkle() {
      // Star-shaped sparkles that twinkle briefly
      var shade = goldShades[Math.floor(Math.random() * goldShades.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        life: Math.random() * 60 + 20,
        maxLife: 0,
        shade: shade,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1
      };
    }

    function init() {
      resize();
      particles = [];
      sparkles = [];
      for (var i = 0; i < particleCount; i++) {
        var p = createParticle(false);
        p.maxLife = p.life;
        particles.push(p);
      }
      for (var i = 0; i < sparkleCount; i++) {
        var s = createSparkle();
        s.maxLife = s.life;
        sparkles.push(s);
      }
    }

    function drawStar(cx, cy, size, rotation, alpha, shade) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();
      // 4-pointed star
      for (var i = 0; i < 4; i++) {
        var angle = (i * Math.PI / 2);
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
      }
      ctx.strokeStyle = 'rgba(' + shade.r + ',' + shade.g + ',' + shade.b + ',' + (alpha * 0.8) + ')';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + shade.r + ',' + shade.g + ',' + shade.b + ',' + alpha + ')';
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // Draw dust particles
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        // Smooth upward motion with gentle sinusoidal drift
        p.x += p.vx + Math.sin(time * p.twinkleSpeed * 10 + p.twinklePhase) * p.drift;
        p.y += p.vy;
        p.life--;

        var lifeRatio = p.life / p.maxLife;
        // Twinkling effect - oscillating opacity
        var twinkle = 0.5 + 0.5 * Math.sin(time * p.twinkleSpeed * 60 + p.twinklePhase);
        var alpha = p.opacity * lifeRatio * (0.6 + 0.4 * twinkle);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.shade.r + ',' + p.shade.g + ',' + p.shade.b + ',' + alpha + ')';
        ctx.fill();

        // Soft glow around larger particles
        if (p.radius > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + p.shade.r + ',' + p.shade.g + ',' + p.shade.b + ',' + (alpha * 0.1) + ')';
          ctx.fill();
        }

        // Extra glow for large sparkles
        if (p.isLarge) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 7, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + p.shade.r + ',' + p.shade.g + ',' + p.shade.b + ',' + (alpha * 0.04) + ')';
          ctx.fill();
          // Cross flare for largest sparkles
          if (p.radius > 2) {
            ctx.beginPath();
            ctx.moveTo(p.x - p.radius * 5, p.y);
            ctx.lineTo(p.x + p.radius * 5, p.y);
            ctx.strokeStyle = 'rgba(' + p.shade.r + ',' + p.shade.g + ',' + p.shade.b + ',' + (alpha * 0.12) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - p.radius * 5);
            ctx.lineTo(p.x, p.y + p.radius * 5);
            ctx.stroke();
          }
        }

        // Respawn particle from bottom
        if (p.life <= 0 || p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particles[i] = createParticle(true);
          particles[i].maxLife = particles[i].life;
        }
      }

      // Draw star sparkles
      for (var i = sparkles.length - 1; i >= 0; i--) {
        var s = sparkles[i];
        s.life--;
        s.rotation += s.rotSpeed;

        var lifeRatio = s.life / s.maxLife;
        // Fade in and out
        var fadeIn = Math.min(1, (s.maxLife - s.life) / 10);
        var fadeOut = Math.min(1, s.life / 15);
        var alpha = fadeIn * fadeOut * 0.7;

        drawStar(s.x, s.y, s.size, s.rotation, alpha, s.shade);

        // Respawn sparkle at random position
        if (s.life <= 0) {
          sparkles[i] = createSparkle();
          sparkles[i].maxLife = sparkles[i].life;
        }
      }

      requestAnimationFrame(draw);
    }

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      init();
      draw();
      window.addEventListener('resize', function () {
        resize();
      });
    }
  }

  // --- Scroll Reveal with IntersectionObserver ---
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < reveals.length; i++) {
        reveals[i].classList.add('revealed');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('revealed');
          observer.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    for (var i = 0; i < reveals.length; i++) {
      observer.observe(reveals[i]);
    }
  }

  // --- Reading Progress Bar ---
  function initProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;

    function updateProgress() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // --- Back to Top Button ---
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    function toggleButton() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleButton, { passive: true });
    toggleButton();
  }

  // --- TOC Panel ---
  function initTOC() {
    var toggle = document.querySelector('.toc-toggle');
    var panel = document.querySelector('.toc-panel');
    var overlay = document.querySelector('.toc-overlay');

    if (!toggle || !panel) return;

    function openTOC() {
      panel.classList.add('open');
      if (overlay) overlay.classList.add('open');
    }

    function closeTOC() {
      panel.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    }

    toggle.addEventListener('click', function () {
      if (panel.classList.contains('open')) {
        closeTOC();
      } else {
        openTOC();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeTOC);
    }

    var links = panel.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', closeTOC);
    }

    // Active section highlighting
    var sections = document.querySelectorAll('.chapter[id]');
    if ('IntersectionObserver' in window) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            var id = entries[i].target.id;
            var tocLinks = panel.querySelectorAll('a');
            for (var j = 0; j < tocLinks.length; j++) {
              tocLinks[j].classList.remove('active');
              if (tocLinks[j].getAttribute('href') === '#' + id) {
                tocLinks[j].classList.add('active');
              }
            }
          }
        }
      }, { threshold: 0.2 });

      for (var i = 0; i < sections.length; i++) {
        sectionObserver.observe(sections[i]);
      }
    }
  }

  // --- Lightbox ---
  function initLightbox() {
    var lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    var contentEl = lightbox.querySelector('.lightbox-content');
    var titleEl = lightbox.querySelector('.lightbox-title');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var zoomIn = lightbox.querySelector('.zoom-in');
    var zoomOut = lightbox.querySelector('.zoom-out');
    var zoomReset = lightbox.querySelector('.zoom-reset');
    var downloadBtn = lightbox.querySelector('.lightbox-download');

    var currentItems = [];
    var currentIndex = 0;
    var currentZoom = 1;

    function openLightbox(items, index) {
      currentItems = items;
      currentIndex = index;
      currentZoom = 1;
      showItem();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      contentEl.innerHTML = '';
    }

    function showItem() {
      var item = currentItems[currentIndex];
      contentEl.innerHTML = '';
      currentZoom = 1;
      applyZoom();

      if (item.type === 'pdf') {
        var iframe = document.createElement('iframe');
        iframe.src = item.src;
        iframe.style.width = '100%';
        iframe.style.height = '80vh';
        iframe.style.border = 'none';
        iframe.setAttribute('loading', 'lazy');
        contentEl.appendChild(iframe);
        if (downloadBtn) {
          downloadBtn.href = item.src;
          downloadBtn.setAttribute('download', '');
          downloadBtn.style.display = 'flex';
        }
      } else {
        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title || '';
        contentEl.appendChild(img);
        // Show download button for images too (HD download)
        if (downloadBtn) {
          downloadBtn.href = item.src;
          downloadBtn.setAttribute('download', '');
          downloadBtn.style.display = 'flex';
        }
      }

      if (titleEl) {
        titleEl.textContent = item.title || '';
      }

      if (prevBtn) prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
      if (nextBtn) nextBtn.style.display = currentIndex < currentItems.length - 1 ? 'flex' : 'none';
    }

    function applyZoom() {
      var el = contentEl.querySelector('img, iframe');
      if (el) {
        el.style.transform = 'scale(' + currentZoom + ')';
        el.style.transformOrigin = 'center center';
        el.style.transition = 'transform .3s ease';
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; showItem(); }
      if (e.key === 'ArrowRight' && currentIndex < currentItems.length - 1) { currentIndex++; showItem(); }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (currentIndex > 0) { currentIndex--; showItem(); }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (currentIndex < currentItems.length - 1) { currentIndex++; showItem(); }
      });
    }

    if (zoomIn) zoomIn.addEventListener('click', function (e) { e.stopPropagation(); currentZoom = Math.min(currentZoom + 0.25, 3); applyZoom(); });
    if (zoomOut) zoomOut.addEventListener('click', function (e) { e.stopPropagation(); currentZoom = Math.max(currentZoom - 0.25, 0.5); applyZoom(); });
    if (zoomReset) zoomReset.addEventListener('click', function (e) { e.stopPropagation(); currentZoom = 1; applyZoom(); });
    if (downloadBtn) downloadBtn.addEventListener('click', function (e) { e.stopPropagation(); });

    // Bind project cards
    var projectCards = document.querySelectorAll('[data-lightbox]');
    for (var i = 0; i < projectCards.length; i++) {
      (function (card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('.project-card-download')) return;

          var group = card.getAttribute('data-lightbox');
          var groupCards = document.querySelectorAll('[data-lightbox="' + group + '"]');
          var items = [];
          var idx = 0;

          for (var j = 0; j < groupCards.length; j++) {
            var c = groupCards[j];
            items.push({
              type: c.getAttribute('data-type') || 'image',
              src: c.getAttribute('data-src'),
              title: c.getAttribute('data-title') || ''
            });
            if (c === card) idx = j;
          }

          if (items.length > 0) {
            openLightbox(items, idx);
          }
        });
      })(projectCards[i]);
    }

    // Bind gallery items
    var galleryItems = document.querySelectorAll('[data-gallery]');
    for (var i = 0; i < galleryItems.length; i++) {
      (function (item) {
        item.addEventListener('click', function (e) {
          // Ignore clicks on download buttons
          if (e.target.closest('.realisation-card-download')) return;

          var group = item.getAttribute('data-gallery');
          var groupItems = document.querySelectorAll('[data-gallery="' + group + '"]');
          var items = [];
          var idx = 0;

          for (var j = 0; j < groupItems.length; j++) {
            var g = groupItems[j];
            items.push({
              type: 'image',
              src: g.getAttribute('data-src'),
              title: g.getAttribute('data-title') || ''
            });
            if (g === item) idx = j;
          }

          if (items.length > 0) {
            openLightbox(items, idx);
          }
        });
      })(galleryItems[i]);
    }
  }

  // --- Lazy Load Images with Blur-Up ---
  function initLazyLoad() {
    var images = document.querySelectorAll('img[loading="lazy"]');
    for (var i = 0; i < images.length; i++) {
      (function (img) {
        if (img.complete) {
          img.classList.add('loaded');
          img.style.opacity = '1';
          img.style.filter = 'blur(0)';
        } else {
          img.style.opacity = '0';
          img.style.filter = 'blur(8px)';
          img.addEventListener('load', function () {
            img.classList.add('loaded');
            img.style.opacity = '1';
            img.style.filter = 'blur(0)';
          });
        }
        img.addEventListener('error', function () {
          img.style.opacity = '0.3';
          img.style.filter = 'blur(0)';
          img.style.minHeight = '100px';
        });
      })(images[i]);
    }
  }

  // --- Toast Notification System ---
  function showToast(message, icon) {
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = (icon ? '<span class="toast-icon">' + icon + '</span>' : '') + message;
    container.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3200);
  }

  // --- Dark Mode ---
  function initDarkMode() {
    var saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      document.body.classList.add('dark-mode');
    }

    window.toggleDarkMode = function () {
      document.body.classList.toggle('dark-mode');
      var isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark);
      showToast(isDark ? 'Mode sombre activ\u00e9' : 'Mode clair activ\u00e9', isDark ? '\ud83c\udf19' : '\u2600\ufe0f');
    };
  }

  // --- FAB (Floating Action Button) ---
  function initFAB() {
    var fabMain = document.getElementById('fabMain');
    var fabOptions = document.getElementById('fabOptions');
    if (!fabMain || !fabOptions) return;

    var isOpen = false;

    fabMain.addEventListener('click', function () {
      isOpen = !isOpen;
      fabMain.classList.toggle('open', isOpen);
      fabOptions.classList.toggle('open', isOpen);
    });

    // Close FAB when clicking outside
    document.addEventListener('click', function (e) {
      if (isOpen && !e.target.closest('.fab-container')) {
        isOpen = false;
        fabMain.classList.remove('open');
        fabOptions.classList.remove('open');
      }
    });

    // FAB option actions
    var options = fabOptions.querySelectorAll('.fab-option');
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', function () {
        var action = this.getAttribute('data-action');

        // Close FAB
        isOpen = false;
        fabMain.classList.remove('open');
        fabOptions.classList.remove('open');

        switch (action) {
          case 'darkmode':
            window.toggleDarkMode();
            break;
          case 'fontsize':
            window.toggleFontSize();
            break;
          case 'bookmark':
            window.bookmarkPosition();
            break;
          case 'search':
            window.openSearch();
            break;
          case 'share':
            window.sharePage();
            break;
          case 'print':
            window.print();
            showToast('Pr\u00e9paration de l\u2019impression...', '\ud83d\udda8\ufe0f');
            break;
        }
      });
    }
  }

  // --- Side Navigation Dots ---
  function initSideNav() {
    var sideNav = document.getElementById('sideNav');
    if (!sideNav) return;

    var dots = sideNav.querySelectorAll('.side-nav-dot');
    var sections = document.querySelectorAll('.chapter[id], header[id]');

    // Click handlers
    for (var i = 0; i < dots.length; i++) {
      dots[i].addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('data-section');
        var target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Active dot on scroll
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            var id = entries[i].target.id;
            for (var j = 0; j < dots.length; j++) {
              dots[j].classList.remove('active');
              if (dots[j].getAttribute('data-section') === id) {
                dots[j].classList.add('active');
              }
            }
          }
        }
      }, { threshold: 0.2, rootMargin: '-10% 0px -60% 0px' });

      for (var i = 0; i < sections.length; i++) {
        observer.observe(sections[i]);
      }
    }
  }

  // --- Search ---
  function initSearch() {
    var overlay = document.getElementById('searchOverlay');
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var closeBtn = document.getElementById('searchClose');
    if (!overlay || !input) return;

    // Build search index from chapters
    var searchIndex = [];
    var chapters = document.querySelectorAll('.chapter, header.cover');
    for (var i = 0; i < chapters.length; i++) {
      var ch = chapters[i];
      var id = ch.id || '';
      var heading = ch.querySelector('h2, h1');
      var title = heading ? heading.textContent : '';
      var paragraphs = ch.querySelectorAll('p');
      var content = '';
      for (var j = 0; j < paragraphs.length; j++) {
        content += paragraphs[j].textContent + ' ';
      }
      searchIndex.push({ id: id, title: title, content: content.trim() });
    }

    window.openSearch = function () {
      overlay.classList.add('open');
      setTimeout(function () { input.focus(); }, 100);
    };

    window.closeSearch = function () {
      overlay.classList.remove('open');
      input.value = '';
      results.innerHTML = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', window.closeSearch);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) window.closeSearch();
    });

    input.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      results.innerHTML = '';

      if (query.length < 2) return;

      var found = [];
      for (var i = 0; i < searchIndex.length; i++) {
        var item = searchIndex[i];
        if (item.title.toLowerCase().indexOf(query) !== -1 || item.content.toLowerCase().indexOf(query) !== -1) {
          // Extract snippet
          var snippet = '';
          var idx = item.content.toLowerCase().indexOf(query);
          if (idx !== -1) {
            var start = Math.max(0, idx - 50);
            var end = Math.min(item.content.length, idx + query.length + 80);
            snippet = (start > 0 ? '...' : '') + item.content.substring(start, end) + (end < item.content.length ? '...' : '');
          } else {
            snippet = item.content.substring(0, 120) + '...';
          }
          found.push({ id: item.id, title: item.title, snippet: snippet });
        }
      }

      if (found.length === 0) {
        results.innerHTML = '<div class="search-empty">Aucun r\u00e9sultat pour "' + query + '"</div>';
        return;
      }

      for (var i = 0; i < found.length; i++) {
        var el = document.createElement('div');
        el.className = 'search-result-item';
        el.innerHTML = '<h4>' + found[i].title + '</h4><p>' + found[i].snippet + '</p>';
        el.setAttribute('data-id', found[i].id);
        el.addEventListener('click', function () {
          var targetId = this.getAttribute('data-id');
          var target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
          window.closeSearch();
        });
        results.appendChild(el);
      }
    });
  }

  // --- Keyboard Shortcuts ---
  function initKeyboardShortcuts() {
    var kbdHelp = document.getElementById('kbdHelp');
    var kbdHelpClose = document.getElementById('kbdHelpClose');

    document.addEventListener('keydown', function (e) {
      // Ctrl+K: Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.openSearch();
        return;
      }

      // Ctrl+D: Dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        window.toggleDarkMode();
        return;
      }

      // Ctrl+P: Print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
        showToast('Pr\u00e9paration de l\u2019impression...', '\ud83d\udda8\ufe0f');
        return;
      }

      // ?: Show keyboard help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
        if (kbdHelp) kbdHelp.classList.toggle('open');
        return;
      }

      // Esc: Close overlays
      if (e.key === 'Escape') {
        if (kbdHelp && kbdHelp.classList.contains('open')) {
          kbdHelp.classList.remove('open');
        }
        var searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay && searchOverlay.classList.contains('open')) {
          window.closeSearch();
        }
      }
    });

    if (kbdHelpClose) {
      kbdHelpClose.addEventListener('click', function () {
        kbdHelp.classList.remove('open');
      });
    }

    if (kbdHelp) {
      kbdHelp.addEventListener('click', function (e) {
        if (e.target === kbdHelp) kbdHelp.classList.remove('open');
      });
    }
  }

  // --- Share Page ---
  function initShare() {
    window.sharePage = function () {
      var url = window.location.href;
      var title = document.title;

      if (navigator.share) {
        navigator.share({
          title: title,
          text: 'D\u00e9couvrez la biographie professionnelle de G\u00e9raud Finangnon AIDOFI',
          url: url
        }).then(function () {
          showToast('Lien partag\u00e9 avec succ\u00e8s!', '\u2714\ufe0f');
        }).catch(function () {
          fallbackShare(url);
        });
      } else {
        fallbackShare(url);
      }
    };

    function fallbackShare(url) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          showToast('Lien copi\u00e9 dans le presse-papier!', '\ud83d\udccb');
        }).catch(function () {
          showToast('Impossible de copier le lien', '\u274c');
        });
      } else {
        showToast('Partage non support\u00e9 sur ce navigateur', '\u274c');
      }
    }
  }

  // --- Animated Counters ---
  function initCounters() {
    var statsBar = document.getElementById('statsBar');
    if (!statsBar) return;

    var counted = false;

    function animateCounters() {
      if (counted) return;
      counted = true;

      var numbers = document.querySelectorAll('.stat-number');
      for (var i = 0; i < numbers.length; i++) {
        (function (el) {
          var target = parseInt(el.getAttribute('data-target'), 10);
          var current = 0;
          var duration = 1500;
          var step = Math.ceil(target / (duration / 30));

          var timer = setInterval(function () {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current;
          }, 30);
        })(numbers[i]);
      }
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            animateCounters();
            observer.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.3 });

      observer.observe(statsBar);
    } else {
      // Fallback: animate when visible
      animateCounters();
    }
  }

  // --- Parallax Effect on Cover ---
  function initParallax() {
    var cover = document.querySelector('.cover');
    if (!cover) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      var coverHeight = cover.offsetHeight;
      if (scrollY < coverHeight) {
        var layout = cover.querySelector('.cover-layout');
        if (layout) {
          layout.style.transform = 'translateY(' + (scrollY * 0.25) + 'px)';
          layout.style.opacity = 1 - (scrollY / coverHeight) * 0.6;
        }
        // Parallax on photo section (slower)
        var photoSection = cover.querySelector('.cover-photo-section');
        if (photoSection) {
          photoSection.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
        }
      }
    }, { passive: true });
  }

  // --- Topographic Contour Animation (Enhanced) ---
  function initTopoCanvas() {
    var canvas = document.getElementById('topoCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var time = 0;

    // Contour line colors - subtle gold variations
    var contourColors = [
      { r: 194, g: 120, b: 73 },   // Copper
      { r: 212, g: 175, b: 55 },   // Rich gold
      { r: 107, g: 143, b: 113 },  // Sage green
      { r: 218, g: 165, b: 32 },   // Goldenrod
    ];

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function drawContours() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var centerX = canvas.width * 0.6;
      var centerY = canvas.height * 0.5;
      var numContours = 12;

      for (var i = 0; i < numContours; i++) {
        var baseRadius = 50 + i * 50;
        var alpha = 0.03 + (i * 0.008);
        var color = contourColors[i % contourColors.length];
        ctx.beginPath();
        for (var angle = 0; angle < Math.PI * 2; angle += 0.02) {
          var noise = Math.sin(angle * 3 + time * 0.3 + i * 0.5) * 25 +
                      Math.sin(angle * 5 - time * 0.2 + i * 0.3) * 12 +
                      Math.cos(angle * 2 + time * 0.15) * 18;
          var r = baseRadius + noise;
          var x = centerX + Math.cos(angle) * r;
          var y = centerY + Math.sin(angle) * r;
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
        ctx.lineWidth = i % 3 === 0 ? 1.2 : 0.7;
        ctx.stroke();
      }

      time += 0.008;
      requestAnimationFrame(drawContours);
    }

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      resize();
      drawContours();
      window.addEventListener('resize', function () { resize(); });
    }
  }

  // --- Back to Top with Progress Ring ---
  function initBackToTopRing() {
    var ringProgress = document.querySelector('.ring-progress');
    if (!ringProgress) return;
    var circumference = 2 * Math.PI * 22; // r=22
    ringProgress.style.strokeDasharray = circumference;
    ringProgress.style.strokeDashoffset = circumference;

    function updateRing() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      var offset = circumference - (progress * circumference);
      ringProgress.style.strokeDashoffset = offset;
    }

    window.addEventListener('scroll', updateRing, { passive: true });
    updateRing();
  }

  // --- Reading Time Calculator ---
  function initReadingTime() {
    var el = document.getElementById('readingTimeText');
    if (!el) return;
    var body = document.querySelector('body');
    if (!body) return;
    var text = body.innerText || body.textContent || '';
    var words = text.trim().split(/\s+/).length;
    var minutes = Math.max(1, Math.ceil(words / 200));
    el.textContent = 'Temps de lecture estim\u00e9 : ' + minutes + ' min';
  }

  // --- Font Size Toggle ---
  function initFontSize() {
    var saved = localStorage.getItem('fontSize');
    if (saved) {
      document.documentElement.style.fontSize = saved;
    }

    window.toggleFontSize = function () {
      var sizes = ['16px', '18px', '20px'];
      var current = document.documentElement.style.fontSize || '16px';
      var idx = sizes.indexOf(current);
      var next = sizes[(idx + 1) % sizes.length];
      document.documentElement.style.fontSize = next;
      localStorage.setItem('fontSize', next);
      var labels = { '16px': 'Taille normale', '18px': 'Taille grande', '20px': 'Taille extra-large' };
      showToast(labels[next] || 'Taille modifi\u00e9e', 'Aa');
    };
  }

  // --- Bookmark / Restore Position ---
  function initBookmark() {
    var saved = localStorage.getItem('bookmarkPosition');
    if (saved) {
      var data = JSON.parse(saved);
      var now = Date.now();
      if (now - data.timestamp < 86400000) {
        setTimeout(function () {
          showToast('Reprendre l\u00e0 o\u00f9 vous \u00e9tiez ? Cliquez ici.', '');
          var container = document.getElementById('toastContainer');
          if (container) {
            var lastToast = container.lastChild;
            if (lastToast) {
              lastToast.style.cursor = 'pointer';
              lastToast.addEventListener('click', function () {
                window.scrollTo({ top: data.position, behavior: 'smooth' });
                showToast('Position restaur\u00e9e!', '');
              });
            }
          }
        }, 2000);
      }
      localStorage.removeItem('bookmarkPosition');
    }

    window.bookmarkPosition = function () {
      var pos = window.pageYOffset || document.documentElement.scrollTop;
      localStorage.setItem('bookmarkPosition', JSON.stringify({ position: pos, timestamp: Date.now() }));
      showToast('Position sauvegard\u00e9e!', '');
    };
  }

  // --- Swipe Support for Lightbox ---
  function initSwipe() {
    var lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    var startX = 0;
    var startY = 0;
    var threshold = 50;

    lightbox.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      var endX = e.changedTouches[0].screenX;
      var endY = e.changedTouches[0].screenY;
      var diffX = endX - startX;
      var diffY = endY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        var prevBtn = lightbox.querySelector('.lightbox-prev');
        var nextBtn = lightbox.querySelector('.lightbox-next');
        if (diffX > 0 && prevBtn && prevBtn.style.display !== 'none') {
          prevBtn.click();
        } else if (diffX < 0 && nextBtn && nextBtn.style.display !== 'none') {
          nextBtn.click();
        }
      }
    }, { passive: true });
  }

  // --- Init all ---
  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initGoldDust();
    initTopoCanvas();
    initReveal();
    initProgressBar();
    initBackToTop();
    initBackToTopRing();
    initTOC();
    initLightbox();
    initLazyLoad();
    initDarkMode();
    initFAB();
    initSideNav();
    initSearch();
    initKeyboardShortcuts();
    initShare();
    initCounters();
    initParallax();
    initReadingTime();
    initFontSize();
    initBookmark();
    initSwipe();
  });

})();
