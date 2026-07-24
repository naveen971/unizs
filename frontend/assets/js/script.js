(function() {
  'use strict';

  // ─── Loading Screen ───
  setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);

  // ─── Navbar Scroll ───
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // ─── Active Nav Link ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(function(section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ─── Mobile Nav ───
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  hamburger.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hamburger.click();
    }
  });

  // ─── Hero Canvas Particles ───
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;
  let canvasW, canvasH;

  function resizeCanvas() {
    const hero = document.getElementById('hero');
    canvasW = canvas.width = hero.offsetWidth;
    canvasH = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvasW * canvasH) / 8000), 120);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.5 ? 'rgba(74,158,255,' : 'rgba(212,168,67,',
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    particles.forEach(function(p) {
      p.pulse += 0.02;
      const o = p.opacity + Math.sin(p.pulse) * 0.15;
      // Mouse parallax
      const dx = (mouseX - canvasW / 2) * 0.003;
      const dy = (mouseY - canvasH / 2) * 0.003;
      p.x += p.speedX + dx * p.size * 0.1;
      p.y += p.speedY + dy * p.size * 0.1;
      // Wrap
      if (p.x < 0) p.x = canvasW;
      if (p.x > canvasW) p.x = 0;
      if (p.y < 0) p.y = canvasH;
      if (p.y > canvasH) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0.05, o) + ')';
      ctx.fill();
      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0.01, o * 0.15) + ')';
      ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  createParticles();
  animateParticles();
  window.addEventListener('resize', function() {
    resizeCanvas();
    createParticles();
  });
  document.getElementById('hero').addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // ─── Scroll Reveal (Intersection Observer) ───
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealElements.forEach(function(el) {
    revealObserver.observe(el);
  });

  // ─── Animated Counters ───
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.parentElement ? el.parentElement.querySelector('.suffix') : null;
    const duration = 2000;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
        if (suffix) suffix.classList.add('visible');
      }
    }
    requestAnimationFrame(update);
  }

  const counterElements = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterElements.forEach(function(el) {
    counterObserver.observe(el);
  });

  // Hero stat counters
  const heroStatNums = document.querySelectorAll('.hero-stat-num');
  const heroCounterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();
        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = current + (progress >= 1 ? suffix : '');
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        heroCounterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  heroStatNums.forEach(function(el) {
    heroCounterObserver.observe(el);
  });

  // ─── Timeline animation ───
  const timeline = document.getElementById('timeline');
  if (timeline) {
    const timelineObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.2 });
    timelineObserver.observe(timeline);
  }

  // ─── Product Tabs ───
  const productTabs = document.querySelectorAll('.product-tab');
  productTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      productTabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      document.querySelectorAll('.product-panel').forEach(function(panel) {
        panel.classList.remove('active');
      });
      document.getElementById('panel-' + target).classList.add('active');
      // Re-trigger reveal
      document.querySelectorAll('#panel-' + target + ' .reveal').forEach(function(el) {
        el.classList.remove('visible');
        setTimeout(function() { el.classList.add('visible'); }, 50);
      });
    });
  });

  // ─── Testimonial Slider ───
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length > 0) {
    function showSlide(index) {
      slides.forEach(function(s) { s.classList.remove('active'); });
      dots.forEach(function(d) { d.classList.remove('active'); });
      currentSlide = index;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % slides.length);
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        clearInterval(slideInterval);
        showSlide(parseInt(dot.getAttribute('data-slide')));
        slideInterval = setInterval(nextSlide, 4000);
      });
    });

    slideInterval = setInterval(nextSlide, 4000);
  }

  // ─── Rotating gradient border for project cards ───
  let cardAngle = 0;
  function rotateCardGradients() {
    cardAngle += 0.5;
    document.querySelectorAll('.project-card').forEach(function(card) {
      card.style.setProperty('--card-angle', cardAngle + 'deg');
    });
    requestAnimationFrame(rotateCardGradients);
  }
  rotateCardGradients();

  // ─── Contact Form ───
  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #D4A843, #B8882F)';
    setTimeout(function() {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
    }, 3000);
  });

  // ─── Unified Topic & Detail Modal Popup Logic ───
  const serviceData = {
    // Services
    "rd": {
      title: "Research & Development",
      img: "assets/images/service_rd.png",
      badge: "UNIZS Service Expertise",
      desc: "Custom R&D programs driving technological breakthroughs from foundational scientific principles to market-ready innovations. We partner with enterprises, universities, and defense clients to build next-generation hardware and software technologies.",
      features: ["Feasibility & Proof of Concept", "Technology Roadmap & IP Strategy", "Advanced Prototype Development", "Multidisciplinary Research Labs"]
    },
    "ai": {
      title: "AI Solutions",
      img: "assets/images/service_ai.png",
      badge: "UNIZS Service Expertise",
      desc: "End-to-end artificial intelligence and machine learning solutions, including computer vision, natural language processing, predictive modeling, and intelligent autonomous systems.",
      features: ["Computer Vision & Surveillance", "Predictive Analytics Engines", "Custom Neural Network Training", "Edge AI Hardware Integration"]
    },
    "embedded": {
      title: "Embedded Systems",
      img: "assets/images/service_embedded.png",
      badge: "UNIZS Service Expertise",
      desc: "High-reliability embedded hardware design, custom micro-controller firmware development, real-time operating systems (RTOS), and hardware-software co-design for critical applications.",
      features: ["ARM & RISC-V Architecture", "Real-Time OS (RTOS) Firmware", "Low-Power & Battery Optimization", "Custom Board Support Packages"]
    },
    "robotics": {
      title: "Robotics Development",
      img: "assets/images/service_robotics.png",
      badge: "UNIZS Service Expertise",
      desc: "Autonomous robotic platform design, mobile robots (AGVs/AMRs), manipulator arms, kinematics, ROS2 framework development, and industrial automation solutions.",
      features: ["ROS/ROS2 Framework Architecture", "Autonomous Navigation & SLAM", "Custom Grippers & Actuation", "Human-Robot Collaboration"]
    },
    "drones": {
      title: "Drone Solutions",
      img: "assets/images/service_drones.png",
      badge: "UNIZS Service Expertise",
      desc: "Specialized UAV/UAS drone hardware, custom flight controllers, payload integration, long-range telemetry, and automated aerial surveillance and inspection software.",
      features: ["Custom UAV Airframe Engineering", "Autonomous Flight Controllers", "Thermal & LiDAR Payloads", "Aerial AI Inspection Software"]
    },
    "iot": {
      title: "IoT Development",
      img: "assets/images/service_iot.png",
      badge: "UNIZS Service Expertise",
      desc: "End-to-end IoT ecosystems connecting sensors, microcontrollers, wireless gateways, cloud telemetry platforms, and real-time interactive analytics dashboards.",
      features: ["LoRaWAN, Cellular & WiFi Gateways", "Secure Cloud MQTT Infrastructure", "Real-time Analytics Dashboard", "Industrial Sensor Nodes"]
    },
    "pcb": {
      title: "PCB Design",
      img: "assets/images/service_pcb.png",
      badge: "UNIZS Service Expertise",
      desc: "Professional multi-layer PCB layout engineering, high-speed digital design, RF circuitry, signal integrity analysis, thermal management, and manufacturing prototyping.",
      features: ["Multi-layer High Density PCB", "High-Speed Signal Integrity", "DFM & DFA Optimization", "Rapid Prototype Assembly"]
    },
    "prototyping": {
      title: "Rapid Prototyping",
      img: "assets/images/service_prototyping.png",
      badge: "UNIZS Service Expertise",
      desc: "Accelerated physical product prototyping leveraging industrial 3D printing (SLA/FDM/SLS), precision CNC machining, sheet metal fabrication, and rapid iterations.",
      features: ["Industrial SLA / SLS 3D Printing", "High-Precision CNC Machining", "Enclosure & Chassis Fabrication", "Fast Functional Assembly"]
    },
    "automation": {
      title: "Industrial Automation",
      img: "assets/images/service_automation.png",
      badge: "UNIZS Service Expertise",
      desc: "Industry 4.0 smart factory transformation, PLC/SCADA programming, automated quality inspection systems, robotics integration, and industrial IoT monitoring.",
      features: ["PLC & SCADA System Design", "Machine Vision Quality Check", "Smart Factory Data Analytics", "Industrial Control Panels"]
    },
    "product_eng": {
      title: "Product Engineering",
      img: "assets/images/service_product_eng.png",
      desc: "Full lifecycle hardware & software product engineering from initial concept napkin sketch to mass-manufacturing readiness and certified product deployment.",
      features: ["Concept-to-Production Lifecycle", "Regulatory Compliance Support", "BOM & Supply Chain Management", "Firmware & App Synchronization"]
    }
  };

  const modal = document.getElementById('serviceModal');
  const modalImg = document.getElementById('modalServiceImg');
  const modalTitle = document.getElementById('modalServiceTitle');
  const modalDesc = document.getElementById('modalServiceDesc');
  const modalFeatures = document.getElementById('modalServiceFeatures');
  const closeBtns = document.querySelectorAll('.service-modal-close, .modal-cancel-btn');

  function openServiceModal(key) {
    const data = serviceData[key];
    if (!data) return;
    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    
    modalFeatures.innerHTML = '';
    data.features.forEach(function(feat) {
      const li = document.createElement('li');
      li.innerHTML = '<span style="color:var(--accent-gold);">✦</span> ' + feat;
      modalFeatures.appendChild(li);
    });

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.service-link[data-service]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const serviceKey = this.getAttribute('data-service');
      openServiceModal(serviceKey);
    });
  });

  closeBtns.forEach(function(btn) {
    btn.addEventListener('click', closeServiceModal);
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeServiceModal();
    }
  });

  const modalInquire = document.getElementById('modalInquireBtn');
  if (modalInquire) {
    modalInquire.addEventListener('click', function() {
      closeServiceModal();
    });
  }

})();