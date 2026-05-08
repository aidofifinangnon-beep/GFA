/* ============================================
   BIOGRAPHIE PROFESSIONNELLE - GERAUD AIDOFI
   Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Lazy Image Fade-In ---
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded'));
    }
  });

  // --- Reading Progress Bar ---
  const progressBar = document.querySelector('.reading-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  }

  // --- Active Section Tracking ---
  const sections = document.querySelectorAll('section[id]');

  function updateActiveSection() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    // TOC active section
    const tocLinks = document.querySelectorAll('.toc-list a');
    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // --- Table of Contents Sidebar ---
  const tocToggleBtn = document.getElementById('tocToggleBtn');
  const tocSidebar = document.getElementById('tocSidebar');
  const tocClose = document.getElementById('tocClose');
  const tocOverlay = document.getElementById('tocOverlay');

  // Show/hide TOC toggle button based on scroll
  function handleTocToggleVisibility() {
    if (window.scrollY > 200) {
      tocToggleBtn.classList.add('visible');
    } else {
      tocToggleBtn.classList.remove('visible');
      // Also close sidebar if scrolled back to top
      if (tocSidebar.classList.contains('active')) {
        closeTOC();
      }
    }
  }

  function openTOC() {
    tocSidebar.classList.add('active');
    tocOverlay.classList.add('active');
    tocToggleBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeTOC() {
    tocSidebar.classList.remove('active');
    tocOverlay.classList.remove('active');
    tocToggleBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (tocToggleBtn) {
    tocToggleBtn.addEventListener('click', () => {
      if (tocSidebar.classList.contains('active')) {
        closeTOC();
      } else {
        openTOC();
      }
    });
  }

  if (tocClose) tocClose.addEventListener('click', closeTOC);
  if (tocOverlay) tocOverlay.addEventListener('click', closeTOC);

  const tocLinks = document.querySelectorAll('.toc-list a');
  tocLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeTOC();
    });
  });

  // --- Back to Top ---
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > window.innerHeight * 0.8) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Safety: make all reveal elements visible after 4 seconds (prevents invisible content on slow connections)
  setTimeout(() => {
    revealElements.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.add('reveal-timeout');
      }
    });
  }, 4000);

  // --- Software Card Hover Animation ---
  const softwareCards = document.querySelectorAll('.software-card');
  softwareCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--border-gold)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'var(--border-light)';
    });
  });

  // --- Lightbox for Realisations ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxPdf = document.getElementById('lightboxPdf');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxDownload = document.getElementById('lightboxDownload');
  const lightboxImgContainer = document.getElementById('lightboxImgContainer');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const zoomResetBtn = document.getElementById('zoomReset');

  const realisationCards = document.querySelectorAll('.realisation-card');
  let currentIndex = 0;
  let zoomLevel = 1;
  let panX = 0, panY = 0;
  let isDragging = false;
  let startX, startY;

  function getItemData(card) {
    const type = card.getAttribute('data-type') || 'image';
    const title = card.querySelector('.realisation-title');
    const desc = card.querySelector('.realisation-desc');
    
    if (type === 'pdf') {
      return {
        type: 'pdf',
        pdf: card.getAttribute('data-pdf') || '',
        thumb: card.getAttribute('data-thumb') || '',
        title: title ? title.textContent : '',
        desc: desc ? desc.textContent : '',
      };
    } else {
      // For image type, use data-src if available, otherwise fall back to img src
      const dataSrc = card.getAttribute('data-src');
      const img = card.querySelector('.realisation-img-wrap img');
      return {
        type: 'image',
        src: dataSrc || (img ? img.src : ''),
        alt: img ? img.alt : '',
        title: title ? title.textContent : '',
        desc: desc ? desc.textContent : '',
      };
    }
  }

  function openLightbox(index) {
    currentIndex = index;
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Clear PDF iframe src to stop rendering
    if (lightboxPdf) lightboxPdf.src = '';
    if (lightboxPdf) lightboxPdf.style.display = 'none';
    if (lightboxImg) lightboxImg.style.display = 'none';
  }

  function updateLightboxContent() {
    const card = realisationCards[currentIndex];
    if (!card) return;
    const data = getItemData(card);
    
    // Reset view state
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    
    if (data.type === 'pdf') {
      // Show PDF viewer
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxPdf) {
        lightboxPdf.src = data.pdf;
        lightboxPdf.style.display = 'block';
      }
      // Show download button
      if (lightboxDownload) {
        lightboxDownload.href = data.pdf;
        lightboxDownload.style.display = 'inline-flex';
      }
      // Hide zoom controls for PDFs
      const zoomControls = document.querySelector('.lightbox-zoom-controls');
      if (zoomControls) zoomControls.style.display = 'none';
    } else {
      // Show image
      if (lightboxPdf) {
        lightboxPdf.src = '';
        lightboxPdf.style.display = 'none';
      }
      if (lightboxImg) {
        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt;
        lightboxImg.style.display = 'block';
      }
      // Hide download button for images
      if (lightboxDownload) lightboxDownload.style.display = 'none';
      // Show zoom controls for images
      const zoomControls = document.querySelector('.lightbox-zoom-controls');
      if (zoomControls) zoomControls.style.display = 'flex';
      updateTransform();
    }
    
    lightboxTitle.textContent = data.title;
    lightboxDesc.textContent = data.desc;
    lightboxCounter.textContent = `${currentIndex + 1} / ${realisationCards.length}`;
  }

  function updateTransform() {
    if (lightboxImg && lightboxImg.style.display !== 'none') {
      lightboxImg.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
    }
  }

  function navigateLightbox(direction) {
    currentIndex = (currentIndex + direction + realisationCards.length) % realisationCards.length;
    updateLightboxContent();
  }

  // Click on cards to open lightbox
  realisationCards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  // Close lightbox
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Navigation
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

  // Zoom controls
  if (zoomInBtn) zoomInBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomLevel = Math.min(zoomLevel + 0.5, 5);
    updateTransform();
  });

  if (zoomOutBtn) zoomOutBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomLevel = Math.max(zoomLevel - 0.5, 1);
    if (zoomLevel === 1) { panX = 0; panY = 0; }
    updateTransform();
  });

  if (zoomResetBtn) zoomResetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    updateTransform();
  });

  // Mouse wheel zoom
  if (lightboxImgContainer) {
    lightboxImgContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomLevel = Math.min(zoomLevel + 0.25, 5);
      } else {
        zoomLevel = Math.max(zoomLevel - 0.25, 1);
        if (zoomLevel === 1) { panX = 0; panY = 0; }
      }
      updateTransform();
    }, { passive: false });
  }

  // Pan when zoomed (drag)
  if (lightboxImg) {
    lightboxImg.addEventListener('mousedown', (e) => {
      if (zoomLevel > 1) {
        isDragging = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        lightboxImg.classList.add('dragging');
        e.preventDefault();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        updateTransform();
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      lightboxImg.classList.remove('dragging');
    });

    // Touch support for pan
    lightboxImg.addEventListener('touchstart', (e) => {
      if (zoomLevel > 1 && e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - panX;
        startY = e.touches[0].clientY - panY;
        e.preventDefault();
      }
    }, { passive: false });

    lightboxImg.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        panX = e.touches[0].clientX - startX;
        panY = e.touches[0].clientY - startY;
        updateTransform();
        e.preventDefault();
      }
    }, { passive: false });

    lightboxImg.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === '+' || e.key === '=') { zoomLevel = Math.min(zoomLevel + 0.5, 5); updateTransform(); }
    if (e.key === '-') { zoomLevel = Math.max(zoomLevel - 0.5, 1); if (zoomLevel === 1) { panX = 0; panY = 0; } updateTransform(); }
    if (e.key === '0') { zoomLevel = 1; panX = 0; panY = 0; updateTransform(); }
  });

  // --- Cover Canvas Background (subtle gold particles) ---
  const canvas = document.getElementById('coverCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let animationId;
    const particles = [];

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create gold particles for dark cover
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 70;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.4 + 0.08,
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 168, 76, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Stop animation when not in view
    const coverObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(animationId);
        } else {
          animateParticles();
        }
      });
    }, { threshold: 0 });

    coverObserver.observe(canvas.parentElement);
  }

  // --- Smooth scroll for all anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- Consolidated Scroll Handler ---
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveSection();
        handleBackToTop();
        updateProgress();
        handleTocToggleVisibility();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial calls
  updateActiveSection();
  handleBackToTop();
  updateProgress();
  handleTocToggleVisibility();
});
