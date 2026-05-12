/* ═══════════════════════════════════════════════════
   YASSINE KLT — Portfolio JavaScript
   main.js
═══════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────
   1. TYPED TITLE EFFECT
   Cycles through role titles in the hero h1
────────────────────────────────────────────────── */
(function initTyped() {
  const titles = [
    'Software Engineer',
    'Network Architect',
    'Cybersec Expert',
    'Full-Stack Developer',
    'Cisco Specialist',
  ];

  const el = document.getElementById('typedTitle');
  if (!el) return;

  let titleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPaused   = false;

  // Inject blinking cursor
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  el.after(cursor);

  function type() {
    const current = titles[titleIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(type, 1800);
      return;
    }

    if (!isDeleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        isPaused   = true;
        isDeleting = true;
        setTimeout(type, 80);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting  = false;
        titleIndex  = (titleIndex + 1) % titles.length;
      }
    }

    setTimeout(type, isDeleting ? 45 : 90);
  }

  setTimeout(type, 800);
})();


/* ──────────────────────────────────────────────────
   2. NAVBAR — scroll shrink + active link highlight
────────────────────────────────────────────────── */
(function initNavbar() {
  const nav     = document.getElementById('navbar');
  const links   = document.querySelectorAll('nav a');
  const toggle  = document.getElementById('navToggle');
  const menu    = document.getElementById('navMenu');

  // Shrink on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile hamburger
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  // Active link based on scroll position
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();


/* ──────────────────────────────────────────────────
   3. SCROLL REVEAL — fade-up sections on enter
────────────────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────
   4. SKILL BAR ANIMATION — fill on scroll into view
────────────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.dataset.width || 0;
        bar.style.width = `${width}%`;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ──────────────────────────────────────────────────
   5. COUNTER ANIMATION — stats bar numbers
────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '+';
      const step   = Math.ceil(target / 40);
      let   count  = 0;

      const tick = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count + suffix;
        if (count >= target) clearInterval(tick);
      }, 40);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────
   6. PROJECT FILTER
────────────────────────────────────────────────── */
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cats = card.dataset.category || '';

        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
          // Stagger re-entrance
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ──────────────────────────────────────────────────
   7. CONTACT FORM VALIDATION & FEEDBACK
────────────────────────────────────────────────── */
(function initContactForm() {
  const sendBtn  = document.getElementById('sendBtn');
  const feedback = document.getElementById('formFeedback');
  if (!sendBtn) return;

  const nameInput  = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const msgInput   = document.getElementById('msgInput');

  function validate() {
    let valid = true;

    [nameInput, emailInput, msgInput].forEach(el => el.classList.remove('error'));

    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      valid = false;
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(emailInput.value.trim())) {
      emailInput.classList.add('error');
      valid = false;
    }

    if (!msgInput.value.trim()) {
      msgInput.classList.add('error');
      valid = false;
    }

    return valid;
  }

  sendBtn.addEventListener('click', () => {
    feedback.textContent = '';
    feedback.className   = 'form-feedback';

    if (!validate()) {
      feedback.textContent = '// Please fill in all fields correctly.';
      feedback.classList.add('error');
      return;
    }

    // Simulate sending (replace with real fetch/emailjs call)
    sendBtn.textContent  = 'Sending…';
    sendBtn.disabled     = true;

    setTimeout(() => {
      feedback.textContent = '// Message sent successfully. I\'ll get back to you soon!';
      feedback.classList.add('success');
      sendBtn.textContent  = 'Send Message →';
      sendBtn.disabled     = false;
      nameInput.value  = '';
      emailInput.value = '';
      msgInput.value   = '';
    }, 1400);
  });
})();


/* ──────────────────────────────────────────────────
   8. BACK TO TOP BUTTON
────────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ──────────────────────────────────────────────────
   9. PARTICLE CANVAS — floating network nodes
────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx   = canvas.getContext('2d');
  const COLOR = '#00d4ff';
  const COUNT = 55;
  let   W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = COLOR;
          ctx.globalAlpha = (1 - dist / 120) * 0.12;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    ctx.globalAlpha = 0.35;
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = COLOR;
      ctx.fill();
      p.update();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    // Re-clamp particles inside new bounds
    particles.forEach(p => {
      p.x = Math.min(p.x, W);
      p.y = Math.min(p.y, H);
    });
  });

  init();
  draw();
})();


/* ──────────────────────────────────────────────────
   10. CURSOR TRAIL — subtle cyan dots following mouse
────────────────────────────────────────────────── */
(function initCursorTrail() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const MAX   = 10;
  const trail = [];

  for (let i = 0; i < MAX; i++) {
    const dot = document.createElement('div');
    Object.assign(dot.style, {
      position:     'fixed',
      width:        '5px',
      height:       '5px',
      borderRadius: '50%',
      background:   '#00d4ff',
      pointerEvents:'none',
      zIndex:       '9999',
      opacity:      '0',
      transition:   'opacity 0.3s',
      transform:    'translate(-50%,-50%)',
    });
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mx = 0, my = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function animate() {
    let px = mx, py = my;
    trail.forEach((dot, i) => {
      const alpha = (1 - i / MAX) * 0.35;
      dot.el.style.opacity  = String(alpha);
      dot.el.style.left     = px + 'px';
      dot.el.style.top      = py + 'px';
      dot.el.style.transform= `translate(-50%,-50%) scale(${1 - i * 0.07})`;

      const nx = px;
      const ny = py;
      px = dot.x + (nx - dot.x) * 0.6;
      py = dot.y + (ny - dot.y) * 0.6;
      dot.x = nx;
      dot.y = ny;
    });
    requestAnimationFrame(animate);
  })();
})();