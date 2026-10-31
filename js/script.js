document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.site-nav');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const progressBar = document.querySelector('.scroll-progress');
  const revealItems = document.querySelectorAll('.reveal-up');
  const statCards = document.querySelectorAll('.stat-card');
  const statsGrid = document.querySelector('.stats-grid');
  const projectCards = document.querySelectorAll('.project-card');
  const skillCards = document.querySelectorAll('.skill-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ambientBackdrop = document.getElementById('ambient-backdrop');
  const ambientParticles = document.getElementById('ambient-particles');
  const ambientCanvas = document.getElementById('ambient-three');

  const createAmbientParticles = () => {
    if (!ambientParticles) return;
    const isCompact = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    const count = isCompact ? 14 : 34;
    const kinds = ['pearl', 'heart', 'sparkle', 'bubble', 'flower', 'pearl', 'sparkle', 'heart-fill'];
    const glyphs = ['✦', '✧', '⋆'];
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement('span');
      const kind = kinds[Math.floor(Math.random() * kinds.length)];
      const duration = 28 + Math.random() * 34;
      const drift = -26 + Math.random() * 52;
      const turn = -40 + Math.random() * 80;
      particle.className = 'ambient-particle';
      particle.dataset.kind = kind;
      particle.dataset.depth = (0.35 + Math.random() * 0.9).toFixed(2);
      particle.style.setProperty('--particle-x', `${Math.random() * 100}%`);
      particle.style.setProperty('--particle-y', `${Math.random() * 88}%`);
      particle.style.setProperty('--particle-size', `${kind === 'bubble' ? 12 + Math.random() * 24 : 8 + Math.random() * 12}px`);
      particle.style.setProperty('--particle-duration', `${duration.toFixed(1)}s`);
      particle.style.setProperty('--particle-delay', `${(-Math.random() * duration).toFixed(1)}s`);
      particle.style.setProperty('--particle-drift', `${drift.toFixed(1)}px`);
      particle.style.setProperty('--particle-end-drift', `${(-drift * 0.35).toFixed(1)}px`);
      particle.style.setProperty('--particle-turn', `${turn.toFixed(1)}deg`);
      particle.style.setProperty('--particle-end-turn', `${(-turn * 0.6).toFixed(1)}deg`);
      particle.style.setProperty('--particle-opacity', `${(0.2 + Math.random() * 0.34).toFixed(2)}`);
      particle.style.setProperty('--particle-color', ['#d99aa9', '#e7b5c4', '#c995a4', '#ead5c4'][Math.floor(Math.random() * 4)]);
      if (kind === 'sparkle') particle.dataset.glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      fragment.appendChild(particle);
    }
    ambientParticles.replaceChildren(fragment);
  };

  const initializeAmbientInteractions = () => {
    if (!ambientBackdrop) return;
    const sections = [...document.querySelectorAll('main > section[id]')];
    const updateActiveScene = () => {
      const center = window.innerHeight / 2;
      let nearestSection = null;
      let nearestDistance = Infinity;
      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        const distance = center < bounds.top ? bounds.top - center : center > bounds.bottom ? center - bounds.bottom : 0;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestSection = section;
        }
      });
      if (nearestSection && ambientBackdrop.dataset.scene !== nearestSection.id) {
        ambientBackdrop.dataset.scene = nearestSection.id;
      }
    };
    window.addEventListener('scroll', updateActiveScene, { passive: true });
    window.addEventListener('resize', updateActiveScene, { passive: true });
    updateActiveScene();
    if (reducedMotion) return;

    const parallaxItems = ambientBackdrop.querySelectorAll('[data-depth]');
    const pointer = { x: 0, y: 0 };
    let parallaxFrame = 0;
    const updateParallax = () => {
      parallaxFrame = 0;
      const scrollOffset = Math.sin(window.scrollY * 0.0006) * 5;
      parallaxItems.forEach((item) => {
        const depth = Number(item.dataset.depth || 0.5);
        item.style.setProperty('--shift-x', `${(pointer.x * depth).toFixed(2)}px`);
        item.style.setProperty('--shift-y', `${(pointer.y * depth + scrollOffset * depth).toFixed(2)}px`);
      });
    };
    const scheduleParallax = () => {
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
    };
    window.addEventListener('scroll', scheduleParallax, { passive: true });
    if (!window.matchMedia('(pointer: coarse)').matches) {
      window.addEventListener('pointermove', (event) => {
        pointer.x = ((event.clientX / window.innerWidth) - 0.5) * 8;
        pointer.y = ((event.clientY / window.innerHeight) - 0.5) * 8;
        scheduleParallax();
      }, { passive: true });
      window.addEventListener('pointerleave', () => { pointer.x = 0; pointer.y = 0; scheduleParallax(); });
    }

    const interactive = 'a, button, .project-card, .certificate-card, .contact-card, .org-card';
    document.body.addEventListener('pointerover', (event) => {
      if (event.target instanceof Element && event.target.closest(interactive)) ambientBackdrop.classList.add('is-engaged');
    });
    document.body.addEventListener('pointerout', (event) => {
      const target = event.target instanceof Element && event.target.closest(interactive);
      const next = event.relatedTarget instanceof Element && event.relatedTarget.closest(interactive);
      if (target && !next) ambientBackdrop.classList.remove('is-engaged');
    });
  };

  createAmbientParticles();
  initializeAmbientInteractions();

  const updateHeaderState = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  const updateScrollProgress = () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const getStatCount = (card) => {
    if (card.dataset.countSource === 'certificates') {
      return window.portfolioCertificates?.length || 0;
    }

    const selector = card.dataset.countSelector;
    if (!selector) return 0;

    return [...document.querySelectorAll(selector)].filter((item) => {
      const style = window.getComputedStyle(item);
      return !item.closest('[hidden], [aria-hidden="true"]')
        && style.display !== 'none'
        && style.visibility !== 'hidden'
        && item.getClientRects().length > 0;
    }).length;
  };

  const animateStat = (card) => {
    const target = getStatCount(card);
    const valueEl = card.querySelector('strong');
    const duration = 1800;
    const start = performance.now();

    const step = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      valueEl.textContent = String(Math.floor(easedProgress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        valueEl.textContent = String(target);
      }
    };

    requestAnimationFrame(step);
  };

  if (reducedMotion) {
    statCards.forEach((card) => {
      card.querySelector('strong').textContent = String(getStatCount(card));
    });
  } else if (statsGrid) {
    const statObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statCards.forEach(animateStat);
            observer.unobserve(statsGrid);
          }
        });
      },
      { threshold: 0.5 }
    );

    statObserver.observe(statsGrid);
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const applyTilt = (element, event) => {
    if (reducedMotion || window.innerWidth < 768) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = (0.5 - (y / rect.height)) * 10;

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const resetTilt = (element) => {
    element.style.transform = '';
  };

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => applyTilt(card, event));
    card.addEventListener('mouseleave', () => resetTilt(card));
  });

  skillCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => applyTilt(card, event));
    card.addEventListener('mouseleave', () => resetTilt(card));
  });

  const openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  };

  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    const src = trigger.dataset.lightbox;
    trigger.addEventListener('click', () => openLightbox(src));
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(src);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (!reducedMotion && !window.matchMedia('(pointer: coarse)').matches) {
    const activateCursor = () => {
      cursorDot.classList.add('active');
      cursorRing.classList.add('active');
    };

    activateCursor();

    window.addEventListener('pointermove', (event) => {
      cursorDot.style.left = `${event.clientX}px`;
      cursorDot.style.top = `${event.clientY}px`;
      cursorRing.style.left = `${event.clientX}px`;
      cursorRing.style.top = `${event.clientY}px`;
    });

    document.querySelectorAll('a, button, .project-card, .skill-card, .contact-card, .certificate-card, .org-card').forEach((element) => {
      element.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      element.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
  }

  updateHeaderState();
  updateScrollProgress();
  window.addEventListener('scroll', () => {
    updateHeaderState();
    updateScrollProgress();
  });

  const createAmbientScene = () => {
    if (!ambientCanvas || !window.THREE || reducedMotion || window.matchMedia('(max-width: 760px), (pointer: coarse)').matches) return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 13;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.05));
      renderer.setSize(window.innerWidth, window.innerHeight);
      ambientCanvas.appendChild(renderer.domElement);
      scene.add(new THREE.AmbientLight(0xfff8fa, 1.1));
      const light = new THREE.PointLight(0xffe8ef, 1.2, 60);
      light.position.set(-5, 7, 9);
      scene.add(light);

      const count = 24;
      const positions = new Float32Array(count * 3);
      const drift = [];
      for (let index = 0; index < count; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 17;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 4;
        drift.push({ x: positions[index * 3], y: positions[index * 3 + 1], phase: Math.random() * Math.PI * 2 });
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xf0c8d4, size: 0.075, transparent: true, opacity: 0.42, depthWrite: false }));
      scene.add(particles);

      const pearlGeometry = new THREE.SphereGeometry(0.075, 12, 10);
      const pearlMaterial = new THREE.MeshPhysicalMaterial({ color: 0xfffafd, roughness: 0.18, clearcoat: 0.9, transparent: true, opacity: 0.56 });
      const pearls = [];
      for (let index = 0; index < 8; index += 1) {
        const pearl = new THREE.Mesh(pearlGeometry, pearlMaterial);
        pearl.userData.base = {
          x: (Math.random() - 0.5) * 16,
          y: (Math.random() - 0.5) * 9,
          z: -1 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.22 + Math.random() * 0.24
        };
        pearl.position.set(pearl.userData.base.x, pearl.userData.base.y, pearl.userData.base.z);
        scene.add(pearl);
        pearls.push(pearl);
      }

      const pointer = { x: 0, y: 0 };
      const target = { x: 0, y: 0 };
      window.addEventListener('pointermove', (event) => {
        target.x = (event.clientX / window.innerWidth - 0.5) * 0.16;
        target.y = -(event.clientY / window.innerHeight - 0.5) * 0.12;
      }, { passive: true });
      window.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; });

      let lastFrame = 0;
      const animate = (time) => {
        if (time - lastFrame < 33) return;
        lastFrame = time;
        const seconds = time * 0.001;
        pointer.x += (target.x - pointer.x) * 0.025;
        pointer.y += (target.y - pointer.y) * 0.025;
        particles.rotation.z = Math.sin(seconds * 0.08) * 0.025 + pointer.x;
        particles.rotation.x = pointer.y;
        drift.forEach((item, index) => {
          positions[index * 3] = item.x + Math.sin(seconds * 0.22 + item.phase) * 0.12;
          positions[index * 3 + 1] = item.y + Math.sin(seconds * 0.18 + item.phase) * 0.14;
        });
        geometry.attributes.position.needsUpdate = true;
        pearls.forEach((pearl) => {
          const base = pearl.userData.base;
          pearl.position.x = base.x + pointer.x * 2 + Math.sin(seconds * base.speed + base.phase) * 0.13;
          pearl.position.y = base.y + pointer.y * 2 + Math.cos(seconds * base.speed + base.phase) * 0.12;
          pearl.rotation.y += 0.001;
        });
        renderer.render(scene, camera);
      };
      renderer.setAnimationLoop(animate);

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
      document.addEventListener('visibilitychange', () => renderer.setAnimationLoop(document.hidden ? null : animate));
      ambientCanvas.dataset.ready = 'true';
    } catch (error) {
      ambientCanvas.replaceChildren();
    }
  };

  const createHeroScene = () => {
    const container = document.getElementById('hero-3d');
    if (!container || !window.THREE) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xfff4f8, 1.2);
      scene.add(ambient);

      const pointLight = new THREE.PointLight(0xffdfe8, 1.8, 100);
      pointLight.position.set(8, 10, 10);
      scene.add(pointLight);

      const orbGeometry = new THREE.SphereGeometry(1.9, 48, 48);
      const orbMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf3bfd0,
        transparent: true,
        opacity: 0.85,
        transmission: 0.52,
        thickness: 0.8,
        roughness: 0.18,
        metalness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
        emissive: 0xf8dfe8,
        emissiveIntensity: 0.3
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(0, 0.2, 0.5);
      scene.add(orb);

      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = prefersReduced ? 24 : 36;
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 9;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
        sizes[i] = Math.random() * 0.16 + 0.06;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const particleMaterial = new THREE.PointsMaterial({
        color: 0xf6d2dc,
        size: 0.08,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
      });
      const particles = new THREE.Points(particlesGeometry, particleMaterial);
      scene.add(particles);

      const smallSpheres = [];
      for (let i = 0; i < 10; i += 1) {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(Math.random() * 0.16 + 0.08, 18, 18),
          new THREE.MeshPhysicalMaterial({
            color: i % 2 === 0 ? 0xf9f3f4 : 0xf6d8e2,
            transmission: 0.7,
            transparent: true,
            opacity: 0.8,
            roughness: 0.2
          })
        );
        mesh.position.set(
          (Math.random() - 0.5) * 5.5,
          (Math.random() - 0.5) * 3.5,
          (Math.random() - 0.5) * 4
        );
        scene.add(mesh);
        smallSpheres.push(mesh);
      }

      camera.position.z = 8;
      const mouse = { x: 0, y: 0 };

      const onPointerMove = (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.x = x * 0.45;
        mouse.y = y * 0.35;
      };

      window.addEventListener('pointermove', onPointerMove);

      const animate = () => {
        const t = performance.now() * 0.001;

        if (!prefersReduced) {
          orb.rotation.y += 0.0035;
          orb.rotation.x = Math.sin(t * 0.7) * 0.28;
          orb.position.x = mouse.x * 0.7;
          orb.position.y = mouse.y * 0.5 + 0.2;

          particles.rotation.y += 0.0015;
          particles.rotation.x += 0.0008;

          smallSpheres.forEach((sphere, index) => {
            sphere.position.x += Math.sin(t + index) * 0.0015;
            sphere.position.y += Math.cos(t * 1.2 + index) * 0.0015;
          });
        }

        renderer.render(scene, camera);
      };

      if (!prefersReduced) {
        renderer.setAnimationLoop(animate);
      } else {
        renderer.render(scene, camera);
      }

      const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', resize);
      resize();

      container.dataset.ready = 'true';
    } catch (error) {
      const fallbackOrb = container.parentElement.querySelector('.fallback-orb');
      if (fallbackOrb) {
        fallbackOrb.style.display = 'block';
      }
    }
  };

  const createContactScene = () => {
    const container = document.getElementById('contact-3d');
    if (!container || !window.THREE) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xfff8fa, 1.4);
      scene.add(ambient);

      const light = new THREE.PointLight(0xffdfe8, 1.9, 100);
      light.position.set(6, 5, 10);
      scene.add(light);

      const shape = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.5, 0.32, 128, 24, 2, 3),
        new THREE.MeshPhysicalMaterial({
          color: 0xf2bfd1,
          transparent: true,
          opacity: 0.8,
          transmission: 0.5,
          thickness: 1,
          roughness: 0.18,
          metalness: 0.06,
          clearcoat: 1,
          emissive: 0xf8dfe6,
          emissiveIntensity: 0.3
        })
      );
      scene.add(shape);

      const particleCount = prefersReduced ? 18 : 32;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 8;
        positions[i + 1] = (Math.random() - 0.5) * 8;
        positions[i + 2] = (Math.random() - 0.5) * 7;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particles = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          color: 0xf5d9e4,
          size: 0.08,
          transparent: true,
          opacity: 0.85
        })
      );
      scene.add(particles);

      camera.position.z = 8;
      const mouse = { x: 0, y: 0 };
      window.addEventListener('pointermove', (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.x = x * 0.4;
        mouse.y = y * 0.3;
      });

      const animate = () => {
        const t = performance.now() * 0.001;
        if (!prefersReduced) {
          shape.rotation.x += 0.006;
          shape.rotation.y += 0.008;
          shape.position.x = mouse.x * 0.8;
          shape.position.y = mouse.y * 0.6;
          particles.rotation.y += 0.0012;
        }
        renderer.render(scene, camera);
      };

      if (!prefersReduced) {
        renderer.setAnimationLoop(animate);
      } else {
        renderer.render(scene, camera);
      }

      const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', resize);
      resize();
    } catch (error) {
      const fallback = container.parentElement.querySelector('.contact-fallback');
      if (fallback) fallback.style.display = 'block';
    }
  };

  const createAboutScene = () => {
    const container = document.getElementById('about-3d');
    if (!container || !window.THREE || window.matchMedia('(max-width: 760px), (pointer: coarse)').matches) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xfff5f7, 1.8));
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(-3, 5, 8);
      scene.add(keyLight);
      const roseLight = new THREE.PointLight(0xf1c6d3, 1.5, 18);
      roseLight.position.set(3, 2, 4);
      scene.add(roseLight);

      const artwork = new THREE.Group();
      scene.add(artwork);

      const material = (color, roughness = 0.38, metalness = 0) => new THREE.MeshPhysicalMaterial({
        color,
        roughness,
        metalness,
        clearcoat: 0.8,
        clearcoatRoughness: 0.22
      });
      const cream = material(0xfffdf9, 0.3, 0.08);
      const screen = material(0xfff7f8, 0.45);
      const blush = material(0xe9b8c8, 0.25, 0.08);
      const paleRose = material(0xf5dce4, 0.32);
      const gold = material(0xd5b893, 0.3, 0.38);

      const laptop = new THREE.Group();
      artwork.add(laptop);
      const screenShell = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.25, 0.12), cream);
      screenShell.position.set(0, 0.08, 0);
      laptop.add(screenShell);
      const display = new THREE.Mesh(new THREE.BoxGeometry(3.28, 2.02, 0.025), screen);
      display.position.set(0, 0.08, 0.075);
      laptop.add(display);

      const addPanel = (x, y, width, height, color = 0xffeaf0) => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.025), material(color, 0.54));
        panel.position.set(x, y, 0.105);
        laptop.add(panel);
        return panel;
      };

      for (let index = 0; index < 3; index += 1) {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), index === 1 ? gold : blush);
        dot.position.set(-1.42 + index * 0.13, 0.93, 0.12);
        laptop.add(dot);
      }
      addPanel(-0.68, 0.4, 1.42, 0.72, 0xfffbfc);
      addPanel(0.91, 0.4, 0.68, 0.72, 0xfff9fa);
      addPanel(-0.68, -0.48, 1.42, 0.76, 0xfff9fa);
      addPanel(0.91, -0.48, 0.68, 0.76, 0xfffbfc);

      for (let index = 0; index < 6; index += 1) {
        const height = 0.18 + (index % 3) * 0.11;
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.105, height, 0.035), blush);
        bar.position.set(-1.15 + index * 0.19, 0.18 + height / 2, 0.145);
        laptop.add(bar);
      }
      for (let row = 0; row < 3; row += 1) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.42 - row * 0.06, 0.035, 0.035), row === 0 ? blush : paleRose);
        line.position.set(0.91, 0.55 - row * 0.18, 0.145);
        laptop.add(line);
      }
      for (let index = 0; index < 4; index += 1) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.58 - (index % 2) * 0.15, 0.035, 0.035), index === 0 ? blush : paleRose);
        line.position.set(-0.68, -0.27 - index * 0.14, 0.145);
        laptop.add(line);
      }

      const base = new THREE.Mesh(new THREE.BoxGeometry(3.95, 0.16, 0.72), cream);
      base.position.set(0, -1.15, 0.2);
      laptop.add(base);
      const trackpad = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.018, 0.3), material(0xf0e6e7, 0.42));
      trackpad.position.set(0, -1.064, 0.34);
      laptop.add(trackpad);
      for (let row = 0; row < 2; row += 1) {
        for (let column = 0; column < 12; column += 1) {
          const key = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.025, 0.07), paleRose);
          key.position.set(-1.35 + column * 0.245, -1.055, -0.03 + row * 0.12);
          laptop.add(key);
        }
      }

      const orbGroup = new THREE.Group();
      orbGroup.position.set(-2.05, 1.48, 0.48);
      artwork.add(orbGroup);
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.66, 40, 40), new THREE.MeshPhysicalMaterial({
        color: 0xe7b0c2,
        roughness: 0.14,
        metalness: 0.03,
        transmission: 0.72,
        thickness: 1.1,
        transparent: true,
        opacity: 0.88,
        clearcoat: 1,
        emissive: 0xffeaf0,
        emissiveIntensity: 0.18
      }));
      orbGroup.add(orb);
      const orbitRings = [];
      [0.82, 0.92, 1.02].forEach((radius, index) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.012, 8, 80),
          new THREE.MeshPhysicalMaterial({ color: index === 1 ? 0xffffff : 0xe7c6cf, transparent: true, opacity: 0.72, roughness: 0.2, metalness: 0.12 })
        );
        ring.rotation.set(0.8 + index * 0.24, index * 0.48, 0.3);
        orbGroup.add(ring);
        orbitRings.push(ring);
      });

      const floatingObjects = [];
      const addPearl = (x, y, z, size) => {
        const pearl = new THREE.Mesh(new THREE.SphereGeometry(size, 20, 20), new THREE.MeshPhysicalMaterial({
          color: 0xfffbfd,
          roughness: 0.16,
          metalness: 0.08,
          clearcoat: 1
        }));
        pearl.position.set(x, y, z);
        artwork.add(pearl);
        floatingObjects.push({ mesh: pearl, x, y, phase: floatingObjects.length * 1.7, speed: 0.55 + floatingObjects.length * 0.08 });
      };
      addPearl(-2.9, 0.28, 0.55, 0.13);
      addPearl(-1.45, 2.55, -0.1, 0.1);
      addPearl(2.48, 1.35, 0.25, 0.16);
      addPearl(2.95, -0.7, 0.4, 0.11);
      addPearl(-2.55, -1.6, 0.2, 0.09);

      const flower = new THREE.Group();
      flower.position.set(2.45, -1.2, 0.15);
      artwork.add(flower);
      for (let index = 0; index < 6; index += 1) {
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 12), material(0xfff8f8, 0.3));
        petal.scale.set(0.78, 1.45, 0.42);
        petal.position.set(Math.cos(index * Math.PI / 3) * 0.19, Math.sin(index * Math.PI / 3) * 0.19, 0);
        petal.rotation.z = index * Math.PI / 3;
        flower.add(petal);
      }
      const flowerCenter = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), gold);
      flower.add(flowerCenter);
      floatingObjects.push({ mesh: flower, x: 2.45, y: -1.2, phase: 1.2, speed: 0.4 });

      const sparkles = new THREE.Group();
      artwork.add(sparkles);
      for (let index = 0; index < 22; index += 1) {
        const size = 0.018 + Math.random() * 0.028;
        const particle = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), index % 4 === 0 ? gold : material(0xffffff, 0.18));
        particle.position.set((Math.random() - 0.5) * 7.6, (Math.random() - 0.5) * 5.8, (Math.random() - 0.5) * 1.3);
        sparkles.add(particle);
      }

      camera.position.set(0, 0.08, 9.4);
      camera.lookAt(0, 0, 0);
      const pointer = { x: 0, y: 0 };
      const target = { x: 0, y: 0 };
      const onPointerMove = (event) => {
        const bounds = container.getBoundingClientRect();
        target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.32;
        target.y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 0.24;
      };
      const onPointerLeave = () => { target.x = 0; target.y = 0; };
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerleave', onPointerLeave);

      const render = () => renderer.render(scene, camera);
      const animate = () => {
        const time = performance.now() * 0.001;
        pointer.x += (target.x - pointer.x) * 0.025;
        pointer.y += (target.y - pointer.y) * 0.025;
        artwork.rotation.y = pointer.x;
        artwork.rotation.x = pointer.y;
        laptop.position.y = Math.sin(time * 0.55) * 0.045;
        laptop.rotation.y = pointer.x * 0.25;
        orb.rotation.y += 0.002;
        orb.rotation.x = Math.sin(time * 0.35) * 0.08;
        orbitRings.forEach((ring, index) => { ring.rotation.z += (index % 2 === 0 ? 1 : -1) * 0.0008; });
        floatingObjects.forEach(({ mesh, x, y, phase, speed }) => {
          mesh.position.x = x + pointer.x * 0.4;
          mesh.position.y = y + Math.sin(time * speed + phase) * 0.045 + pointer.y * 0.35;
        });
        sparkles.rotation.y += 0.00035;
        render();
      };

      const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        render();
      };

      window.addEventListener('resize', resize);
      resize();
      if (!prefersReduced) renderer.setAnimationLoop(animate);
      container.dataset.ready = 'true';
    } catch (error) {
      container.replaceChildren();
    }
  };

  createAmbientScene();
  createHeroScene();
  createAboutScene();
  createContactScene();
});
