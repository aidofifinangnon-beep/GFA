/* ========================================
   BIOGRAPHIE - app.js
   Geraud Finangnon AIDOFI - v4
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

  // --- Cover Constellation Canvas ---
  function initConstellation() {
    var canvas = document.getElementById('coverCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 80;
    var maxDist = 130;
    var animId;

    function resize() {
      var parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.5 + 0.15,
        color: Math.random() > 0.7 ? 'amber' : (Math.random() > 0.5 ? 'cyan' : 'emerald')
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    }

    function getColor(c, alpha) {
      if (c === 'amber') return 'rgba(245,158,11,' + alpha + ')';
      if (c === 'cyan') return 'rgba(6,182,212,' + alpha + ')';
      return 'rgba(16,185,129,' + alpha + ')';
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = getColor(p.color, p.opacity);
        ctx.fill();

        // Draw connections
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            var alpha = 0.08 * (1 - dist / maxDist);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = getColor(p.color, alpha);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    // Respect reduced motion
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      init();
      draw();
      window.addEventListener('resize', function () { resize(); });
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
        // Show download button for PDFs
        if (downloadBtn) {
          downloadBtn.href = item.src;
          downloadBtn.style.display = 'flex';
        }
      } else {
        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title || '';
        contentEl.appendChild(img);
        // Hide download button for images
        if (downloadBtn) {
          downloadBtn.style.display = 'none';
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
          // Don't open lightbox if download button was clicked
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
        item.addEventListener('click', function () {
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

  // --- Lazy Load Images ---
  function initLazyLoad() {
    var images = document.querySelectorAll('img[loading="lazy"]');
    for (var i = 0; i < images.length; i++) {
      (function (img) {
        img.addEventListener('load', function () {
          img.style.opacity = '1';
        });
        img.addEventListener('error', function () {
          img.style.opacity = '0.3';
          img.style.minHeight = '100px';
        });
        if (!img.complete) {
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.5s ease';
        }
      })(images[i]);
    }
  }

  // --- Init all ---
  document.addEventListener('DOMContentLoaded', function () {
    initConstellation();
    initReveal();
    initProgressBar();
    initBackToTop();
    initTOC();
    initLightbox();
    initLazyLoad();
  });

})();
