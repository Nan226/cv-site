var ORB_PALETTES = [
  { color: '#9bcde5', light: '#dff2f9', dark: '#70a7bf', glow: 'rgba(112,167,191,.25)' },
  { color: '#f2b7c2', light: '#fde1e6', dark: '#d78e9b', glow: 'rgba(215,142,155,.25)' },
  { color: '#fff0c9', light: '#fff9e6', dark: '#d9bd7e', glow: 'rgba(217,189,126,.24)' },
  { color: '#fffdf1', light: '#ffffff', dark: '#d9d2bc', glow: 'rgba(217,210,188,.22)' },
  { color: '#c3db7f', light: '#e9f2bd', dark: '#8faa52', glow: 'rgba(143,170,82,.22)' },
  { color: '#d2c2df', light: '#eee7f3', dark: '#a18bb3', glow: 'rgba(161,139,179,.23)' }
];

var ACTIVE_PALETTES = {
  'ai-pm': { color: '#ef9fb5', light: '#ffe5ed', dark: '#c66f88', glow: 'rgba(239,159,181,.54)' },
  metafit: { color: '#87bfe0', light: '#dff3fb', dark: '#518baa', glow: 'rgba(135,191,224,.54)' }
};

function createSeededRandom(seed) {
  var value = seed >>> 0;
  return function () {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function setOrbPalette(element, palette) {
  element.style.setProperty('--orb-color', palette.color);
  element.style.setProperty('--orb-light', palette.light);
  element.style.setProperty('--orb-dark', palette.dark);
  element.style.setProperty('--orb-glow', palette.glow);
}

function createOrbElement(definition) {
  var project = definition.project;
  var element = document.createElement(project ? 'button' : 'span');
  element.className = 'project-physics-orb' + (project ? ' is-active' : ' is-decorative');
  element.style.width = definition.diameter + 'px';
  element.style.height = definition.diameter + 'px';
  var shapes = [
    '48% 52% 49% 51% / 51% 48% 52% 49%',
    '52% 48% 51% 49% / 48% 52% 49% 51%',
    '49% 51% 47% 53% / 52% 49% 51% 48%',
    '51% 49% 53% 47% / 49% 51% 48% 52%'
  ];
  element.style.setProperty('--orb-shape', shapes[(definition.order || 0) % shapes.length]);
  setOrbPalette(element, definition.palette);

  var visual = document.createElement('span');
  visual.className = 'project-physics-orb-visual';
  element.appendChild(visual);

  if (!project) {
    element.setAttribute('aria-hidden', 'true');
    return element;
  }

  element.type = 'button';
  element.dataset.projectId = project.id;
  element.setAttribute('aria-label', 'Open ' + project.title + ' project details');

  var star = document.createElement('span');
  star.className = 'project-physics-orb-star';
  star.setAttribute('aria-hidden', 'true');
  star.textContent = '✦';

  var label = document.createElement('span');
  label.className = 'project-physics-orb-label';
  var code = document.createElement('small');
  code.textContent = project.code || 'ILLUMINATED PROJECT';
  var title = document.createElement('strong');
  title.textContent = project.sceneTitle || project.title;
  label.append(code, title);
  element.append(star, label);
  return element;
}

function createFallback(shell, projects, onProjectClick) {
  shell.classList.add('is-fallback');
  var layer = document.createElement('div');
  layer.className = 'projects-physics-layer is-static-fallback';
  var random = createSeededRandom(20260717);

  for (var i = 0; i < 24; i++) {
    var diameter = 28 + random() * 58;
    var orb = createOrbElement({
      diameter: diameter,
      palette: ORB_PALETTES[Math.floor(random() * ORB_PALETTES.length)],
      project: null
    });
    orb.style.left = (random() * 92 + 4) + '%';
    orb.style.top = (58 + random() * 36) + '%';
    orb.style.transform = 'translate(-50%,-50%)';
    layer.appendChild(orb);
  }

  projects.filter(function (project) { return project.state === 'active'; }).forEach(function (project, index) {
    var orb = createOrbElement({
      diameter: 92,
      palette: ACTIVE_PALETTES[project.id] || ORB_PALETTES[index],
      project: project
    });
    orb.style.left = (index === 0 ? 34 : 66) + '%';
    orb.style.top = '66%';
    orb.style.transform = 'translate(-50%,-50%)';
    orb.addEventListener('click', function () { onProjectClick(project.id); });
    layer.appendChild(orb);
  });

  shell.appendChild(layer);
  return {
    resetFocus: function () {},
    resize: function () {},
    dispose: function () {
      shell.classList.remove('is-fallback');
      shell.textContent = '';
    }
  };
}

export function initProjectsOrbs(section, stage, projectData, onProjectClick) {
  if (!section || !stage) return null;
  var shell = document.getElementById('projectsSceneShell');
  if (!shell) return null;
  shell.textContent = '';
  shell.classList.remove('is-fallback');

  var Matter = window.Matter;
  if (!Matter) return createFallback(shell, projectData, onProjectClick);

  var Engine = Matter.Engine;
  var Bodies = Matter.Bodies;
  var Body = Matter.Body;
  var Composite = Matter.Composite;
  var Sleeping = Matter.Sleeping;

  var engine = Engine.create({ enableSleeping: true });
  engine.gravity.y = 0.96;
  engine.gravity.scale = 0.001;

  var layer = document.createElement('div');
  layer.className = 'projects-physics-layer';
  shell.appendChild(layer);

  var activeProjects = projectData.filter(function (project) { return project.state === 'active'; }).slice(0, 2);
  var entries = [];
  var selectedEntry = null;
  var clickTimer = null;
  var rafId = null;
  var resizeTimer = null;
  var running = false;
  var previousFrameTime = 0;
  var isMobile = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pointerState = { x: -1000, y: -1000, lastX: -1000, lastY: -1000, lastTime: 0 };

  function addBoundaries(width, height) {
    var thickness = 160;
    var floorY = height - 6;
    var wallOptions = { isStatic: true, friction: 0.004, restitution: 0.66 };
    var walls = [
      Bodies.rectangle(width / 2, floorY + thickness / 2, width + thickness * 2, thickness, wallOptions),
      Bodies.rectangle(-thickness / 2, -height * 0.55, thickness, height * 4.2, wallOptions),
      Bodies.rectangle(width + thickness / 2, -height * 0.55, thickness, height * 4.2, wallOptions)
    ];

    Composite.add(engine.world, walls);
  }

  function createDefinitions(width, height) {
    var random = createSeededRandom(isMobile ? 390844 : 1440900);
    var total = isMobile ? 30 : 52;
    var definitions = [];
    var activeCount = Math.min(activeProjects.length, 2);
    var decorativeCount = total - activeCount;
    var minDiameter = isMobile ? 22 : 30;
    var maxDiameter = Math.min(isMobile ? 68 : 108, width * (isMobile ? 0.18 : 0.085));

    for (var i = 0; i < decorativeCount; i++) {
      var sizeProgress = Math.pow(random(), 1.65);
      definitions.push({
        diameter: minDiameter + (maxDiameter - minDiameter) * sizeProgress,
        palette: ORB_PALETTES[Math.floor(random() * ORB_PALETTES.length)],
        project: null,
        random: random(),
        order: i
      });
    }

    activeProjects.slice(0, 2).forEach(function (project, index) {
      definitions.push({
        diameter: isMobile ? (index === 0 ? 72 : 78) : (index === 0 ? 104 : 116),
        palette: ACTIVE_PALETTES[project.id] || ORB_PALETTES[index],
        project: project,
        random: index === 0 ? 0.32 : 0.68,
        order: decorativeCount + index
      });
    });

    return definitions;
  }

  function buildWorld() {
    var rect = shell.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    isMobile = rect.width < 720;
    Composite.clear(engine.world, false, true);
    layer.textContent = '';
    entries = [];
    selectedEntry = null;
    addBoundaries(rect.width, rect.height);

    var definitions = createDefinitions(rect.width, rect.height);
    var bodies = [];
    definitions.forEach(function (definition, index) {
      var radius = definition.diameter / 2;
      var x;
      var y;

      if (definition.project) {
        x = rect.width * definition.random;
        y = -radius - rect.height * (0.55 + (index % 2) * 0.16);
      } else {
        x = radius + definition.random * Math.max(1, rect.width - radius * 2);
        y = -radius - ((index * 43) % Math.round(rect.height * 0.68)) - Math.floor(index / 10) * 28;
      }

      var body = Bodies.circle(x, y, radius, {
        restitution: definition.project ? 0.82 : 0.74,
        friction: 0.002,
        frictionStatic: 0.006,
        frictionAir: definition.project ? 0.0018 : 0.003,
        density: definition.project ? 0.00068 : 0.001 + (index % 5) * 0.00012,
        sleepThreshold: 62
      });
      var element = createOrbElement(definition);
      var entry = { body: body, element: element, definition: definition };
      entries.push(entry);
      bodies.push(body);
      layer.appendChild(element);

      if (definition.project) {
        element.addEventListener('pointerenter', function () {
          if (body.isStatic) return;
          Body.setVelocity(body, { x: body.velocity.x * 0.32, y: body.velocity.y * 0.32 });
          Body.setAngularVelocity(body, body.angularVelocity * 0.32);
        });
        element.addEventListener('click', function () {
          if (selectedEntry) return;
          selectedEntry = entry;
          element.classList.add('is-selected');
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
          Body.setStatic(body, true);
          clickTimer = window.setTimeout(function () {
            clickTimer = null;
            onProjectClick(definition.project.id);
          }, reducedMotion ? 0 : 180);
        });
      }
    });

    Composite.add(engine.world, bodies);

    if (reducedMotion) {
      for (var step = 0; step < 420; step++) Engine.update(engine, 1000 / 60);
      entries.forEach(function (entry) { Body.setStatic(entry.body, true); });
      renderEntries();
    }
  }

  function renderEntries() {
    entries.forEach(function (entry) {
      var body = entry.body;
      var radius = entry.definition.diameter / 2;
      entry.element.style.transform = 'translate3d(' + (body.position.x - radius).toFixed(2) + 'px,' + (body.position.y - radius).toFixed(2) + 'px,0)';
      entry.element.style.setProperty('--orb-angle', body.angle.toFixed(3) + 'rad');
    });
  }

  function animate(time) {
    if (!running) return;
    rafId = window.requestAnimationFrame(animate);
    var delta = previousFrameTime ? Math.min(time - previousFrameTime, 33.333) : 16.667;
    previousFrameTime = time;
    Engine.update(engine, delta);
    renderEntries();
  }

  function start() {
    if (running || reducedMotion) return;
    running = true;
    previousFrameTime = 0;
    rafId = window.requestAnimationFrame(animate);
  }

  function stop() {
    if (!running) return;
    running = false;
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  function handlePointerMove(event) {
    if (event.pointerType === 'touch' || reducedMotion) return;
    var rect = shell.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var now = event.timeStamp || Date.now();
    var pointerDx = pointerState.lastTime ? x - pointerState.lastX : 0;
    var pointerDy = pointerState.lastTime ? y - pointerState.lastY : 0;
    var pointerSpeed = Math.min(42, Math.hypot(pointerDx, pointerDy));
    var influenceRadius = isMobile ? 138 : 190;
    var hoveredActive = event.target && event.target.closest
      ? event.target.closest('.project-physics-orb.is-active')
      : null;

    pointerState.x = x;
    pointerState.y = y;
    pointerState.lastX = x;
    pointerState.lastY = y;
    pointerState.lastTime = now;

    entries.forEach(function (entry) {
      var body = entry.body;
      if (body.isStatic) return;
      if (hoveredActive === entry.element) {
        Body.setVelocity(body, { x: body.velocity.x * 0.72, y: body.velocity.y * 0.72 });
        Body.setAngularVelocity(body, body.angularVelocity * 0.72);
        return;
      }
      var dx = body.position.x - x;
      var dy = body.position.y - y;
      var distanceSquared = dx * dx + dy * dy;
      if (distanceSquared >= influenceRadius * influenceRadius) return;

      var distance = Math.max(12, Math.sqrt(distanceSquared));
      var proximity = 1 - distance / influenceRadius;
      var movementBoost = 0.72 + pointerSpeed / 24;
      var force = body.mass * 0.0032 * proximity * movementBoost;
      Body.applyForce(body, body.position, {
        x: dx / distance * force + pointerDx * body.mass * 0.000014,
        y: dy / distance * force + pointerDy * body.mass * 0.000014
      });
      Body.setAngularVelocity(body, body.angularVelocity + pointerDx * 0.0018 * proximity);
      if (Sleeping) Sleeping.set(body, false);
    });
  }

  function handlePointerLeave() {
    pointerState.lastTime = 0;
    pointerState.lastX = -1000;
    pointerState.lastY = -1000;
  }

  function resize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      buildWorld();
      if (!reducedMotion && section.getBoundingClientRect().bottom > 0 && section.getBoundingClientRect().top < window.innerHeight) start();
    }, 160);
  }

  function resetFocus() {
    if (clickTimer) window.clearTimeout(clickTimer);
    clickTimer = null;
    if (!selectedEntry) return;
    selectedEntry.element.classList.remove('is-selected');
    if (!reducedMotion) {
      Body.setStatic(selectedEntry.body, false);
      Body.applyForce(selectedEntry.body, selectedEntry.body.position, { x: 0, y: -selectedEntry.body.mass * 0.004 });
    }
    selectedEntry = null;
  }

  var observer = new IntersectionObserver(function (observations) {
    observations.forEach(function (observation) {
      if (observation.isIntersecting) start();
      else stop();
    });
  }, { threshold: 0.03 });

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function handleMotionChange(event) {
    reducedMotion = event.matches;
    stop();
    buildWorld();
    if (!reducedMotion) start();
  }

  observer.observe(section);
  shell.addEventListener('pointermove', handlePointerMove);
  shell.addEventListener('pointerleave', handlePointerLeave);
  window.addEventListener('resize', resize);
  motionQuery.addEventListener('change', handleMotionChange);
  buildWorld();
  if (section.getBoundingClientRect().bottom > 0 && section.getBoundingClientRect().top < window.innerHeight) start();

  return {
    resetFocus: resetFocus,
    resize: resize,
    dispose: function () {
      stop();
      observer.disconnect();
      shell.removeEventListener('pointermove', handlePointerMove);
      shell.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', resize);
      motionQuery.removeEventListener('change', handleMotionChange);
      window.clearTimeout(resizeTimer);
      if (clickTimer) window.clearTimeout(clickTimer);
      Composite.clear(engine.world, false, true);
      Engine.clear(engine);
      shell.textContent = '';
    }
  };
}
