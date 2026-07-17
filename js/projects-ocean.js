import * as THREE from 'three';

var DESKTOP_LAYOUT = {
  robotaxi: { x: -4.7, z: 5.4, scale: 0.62, tilt: -0.08, driftX: 0.55, driftZ: 0.72, speed: 0.13, phase: 0.25 },
  'ai-pm': { x: -2.2, z: 0.55, scale: 1.13, tilt: -0.11, driftX: 0.42, driftZ: 0.58, speed: 0.11, phase: 1.4 },
  metafit: { x: 2.25, z: -1.55, scale: 1.16, tilt: 0.1, driftX: 0.48, driftZ: 0.64, speed: 0.1, phase: 3.25 },
  'metaverse-classroom': { x: -0.4, z: -6.0, scale: 0.54, tilt: 0.08, driftX: 0.78, driftZ: 0.48, speed: 0.08, phase: 2.2 },
  'ar-showroom': { x: 0.25, z: 6.05, scale: 0.58, tilt: -0.05, driftX: 0.72, driftZ: 0.52, speed: 0.1, phase: 4.6 },
  'ai-research': { x: 4.7, z: 4.8, scale: 0.56, tilt: 0.06, driftX: 0.52, driftZ: 0.7, speed: 0.09, phase: 5.5 },
  'iot-garden': { x: 3.55, z: -5.75, scale: 0.52, tilt: -0.06, driftX: 0.64, driftZ: 0.48, speed: 0.085, phase: 0.9 },
  'data-viz': { x: -4.25, z: -3.05, scale: 0.57, tilt: 0.08, driftX: 0.5, driftZ: 0.66, speed: 0.095, phase: 3.8 }
};

var MOBILE_LAYOUT = {
  robotaxi: { x: -2.15, z: 5.25, scale: 0.47, tilt: -0.08, driftX: 0.28, driftZ: 0.5, speed: 0.13, phase: 0.25 },
  'ai-pm': { x: -1.0, z: 0.55, scale: 0.88, tilt: -0.1, driftX: 0.24, driftZ: 0.42, speed: 0.11, phase: 1.4 },
  metafit: { x: 1.05, z: -1.55, scale: 0.9, tilt: 0.1, driftX: 0.26, driftZ: 0.46, speed: 0.1, phase: 3.25 },
  'metaverse-classroom': { x: 0, z: -7.0, scale: 0.4, tilt: 0.08, driftX: 0.4, driftZ: 0.36, speed: 0.08, phase: 2.2 },
  'ar-showroom': { x: 0.15, z: 5.9, scale: 0.44, tilt: -0.05, driftX: 0.36, driftZ: 0.36, speed: 0.1, phase: 4.6 },
  'ai-research': { x: 2.15, z: 4.75, scale: 0.42, tilt: 0.06, driftX: 0.3, driftZ: 0.46, speed: 0.09, phase: 5.5 },
  'iot-garden': { x: 1.75, z: -6.35, scale: 0.4, tilt: -0.06, driftX: 0.32, driftZ: 0.34, speed: 0.085, phase: 0.9 },
  'data-viz': { x: -2.0, z: -3.8, scale: 0.42, tilt: 0.08, driftX: 0.28, driftZ: 0.44, speed: 0.095, phase: 3.8 }
};

function createGlowTexture() {
  var canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  var context = canvas.getContext('2d');
  var gradient = context.createRadialGradient(32, 32, 2, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,250,220,.95)');
  gradient.addColorStop(0.55, 'rgba(255,226,245,.46)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  var texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSkyDome() {
  var geometry = new THREE.SphereGeometry(48, 48, 24);
  var material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uTop: { value: new THREE.Color('#fffefe') },
      uUpper: { value: new THREE.Color('#fbfafd') },
      uHorizon: { value: new THREE.Color('#faedf5') },
      uLower: { value: new THREE.Color('#f0f7fa') }
    },
    vertexShader: [
      'varying vec3 vWorldPosition;',
      'void main(){',
      '  vec4 worldPosition=modelMatrix*vec4(position,1.0);',
      '  vWorldPosition=worldPosition.xyz;',
      '  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 uTop;',
      'uniform vec3 uUpper;',
      'uniform vec3 uHorizon;',
      'uniform vec3 uLower;',
      'varying vec3 vWorldPosition;',
      'void main(){',
      '  vec3 direction=normalize(vWorldPosition-cameraPosition);',
      '  float height=clamp(direction.y*.5+.5,0.0,1.0);',
      '  vec3 color=mix(uLower,uUpper,smoothstep(.18,.62,height));',
      '  color=mix(color,uTop,smoothstep(.62,1.0,height));',
      '  float horizon=exp(-pow(direction.y*8.5,2.0));',
      '  color=mix(color,uHorizon,horizon*.32);',
      '  gl_FragColor=vec4(color,1.0);',
      '}'
    ].join('\n')
  });
  return new THREE.Mesh(geometry, material);
}

function createOceanMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uNearColor: { value: new THREE.Color('#dcecf3') },
      uFarColor: { value: new THREE.Color('#eff7fa') },
      uHorizonColor: { value: new THREE.Color('#f9eef5') },
      uFogColor: { value: new THREE.Color('#f6f8fa') },
      uLightDirection: { value: new THREE.Vector3(-0.35, 0.82, 0.4).normalize() }
    },
    vertexShader: [
      'uniform float uTime;',
      'varying vec3 vWorldPosition;',
      'varying vec3 vWorldNormal;',
      'varying float vWave;',
      'float waveHeight(vec2 point){',
      '  float waveA=sin(dot(point,normalize(vec2(.82,.36)))*.72+uTime*.72)*.085;',
      '  float waveB=sin(dot(point,normalize(vec2(-.28,.96)))*1.12-uTime*.54)*.045;',
      '  float waveC=sin((point.x+point.y)*1.84+uTime*.42)*.018;',
      '  return waveA+waveB+waveC;',
      '}',
      'void main(){',
      '  vec3 displaced=position;',
      '  float height=waveHeight(position.xy);',
      '  float epsilon=.08;',
      '  float heightX=waveHeight(position.xy+vec2(epsilon,0.0));',
      '  float heightY=waveHeight(position.xy+vec2(0.0,epsilon));',
      '  displaced.z=height;',
      '  vec3 localNormal=normalize(vec3(-(heightX-height)/epsilon,-(heightY-height)/epsilon,1.0));',
      '  vec4 worldPosition=modelMatrix*vec4(displaced,1.0);',
      '  vWorldPosition=worldPosition.xyz;',
      '  vWorldNormal=normalize(normalMatrix*localNormal);',
      '  vWave=height;',
      '  gl_Position=projectionMatrix*modelViewMatrix*vec4(displaced,1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 uNearColor;',
      'uniform vec3 uFarColor;',
      'uniform vec3 uHorizonColor;',
      'uniform vec3 uFogColor;',
      'uniform vec3 uLightDirection;',
      'varying vec3 vWorldPosition;',
      'varying vec3 vWorldNormal;',
      'varying float vWave;',
      'void main(){',
      '  vec3 normal=normalize(vWorldNormal);',
      '  vec3 viewDirection=normalize(cameraPosition-vWorldPosition);',
      '  float fresnel=pow(1.0-max(dot(normal,viewDirection),0.0),3.0);',
      '  float distanceFade=smoothstep(3.0,27.0,distance(cameraPosition,vWorldPosition));',
      '  vec3 base=mix(uNearColor,uFarColor,distanceFade);',
      '  base=mix(base,uHorizonColor,distanceFade*.18);',
      '  vec3 halfDirection=normalize(uLightDirection+viewDirection);',
      '  float specular=pow(max(dot(normal,halfDirection),0.0),76.0);',
      '  float crest=smoothstep(.07,.14,vWave);',
      '  vec3 color=base+vec3(1.0,.99,.98)*specular*.36;',
      '  color=mix(color,vec3(.97,.99,1.0),fresnel*.3+crest*.08);',
      '  float fog=smoothstep(18.0,38.0,distance(cameraPosition,vWorldPosition));',
      '  color=mix(color,uFogColor,fog);',
      '  gl_FragColor=vec4(color,.76);',
      '}'
    ].join('\n')
  });
}

function createBottle(project, glowTexture) {
  var active = project.state === 'active';
  var group = new THREE.Group();
  group.userData.project = project;
  group.userData.active = active;

  var profile = [
    new THREE.Vector2(0, -0.72),
    new THREE.Vector2(0.34, -0.72),
    new THREE.Vector2(0.43, -0.65),
    new THREE.Vector2(0.47, -0.42),
    new THREE.Vector2(0.48, 0.1),
    new THREE.Vector2(0.42, 0.36),
    new THREE.Vector2(0.25, 0.56),
    new THREE.Vector2(0.15, 0.67),
    new THREE.Vector2(0.15, 0.92),
    new THREE.Vector2(0.2, 0.96),
    new THREE.Vector2(0.2, 1.03),
    new THREE.Vector2(0, 1.03)
  ];
  var glassGeometry = new THREE.LatheGeometry(profile, 40);
  var glassMaterial = new THREE.MeshPhysicalMaterial({
    color: active ? '#d9eff8' : '#8f9da9',
    roughness: active ? 0.18 : 0.5,
    metalness: 0,
    transmission: 0,
    thickness: 0.32,
    ior: 1.45,
    transparent: true,
    opacity: active ? 0.56 : 0.48,
    emissive: active ? '#8fc9df' : '#000000',
    emissiveIntensity: active ? 0.08 : 0,
    clearcoat: active ? 0.72 : 0.18,
    clearcoatRoughness: 0.18,
    depthWrite: false
  });
  var glass = new THREE.Mesh(glassGeometry, glassMaterial);
  glass.name = 'glass';
  glass.renderOrder = 3;
  group.add(glass);

  var rimGeometry = new THREE.TorusGeometry(0.18, 0.027, 12, 32);
  var rimMaterial = new THREE.MeshStandardMaterial({
    color: active ? '#eaf7fb' : '#9ba6b0',
    roughness: active ? 0.18 : 0.5,
    transparent: true,
    opacity: active ? 0.72 : 0.42
  });
  var rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.y = 1.02;
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  var corkGeometry = new THREE.CylinderGeometry(0.135, 0.155, 0.22, 24);
  var corkMaterial = new THREE.MeshStandardMaterial({
    color: active ? '#d5aa78' : '#8f877f',
    roughness: 0.82,
    metalness: 0
  });
  var cork = new THREE.Mesh(corkGeometry, corkMaterial);
  cork.position.y = 1.12;
  group.add(cork);

  if (active) {
    var paperMaterial = new THREE.MeshStandardMaterial({
      color: '#fff4df',
      roughness: 0.72,
      side: THREE.DoubleSide
    });
    var paper = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.68, 28, 1, true), paperMaterial);
    paper.position.set(0, -0.05, 0);
    paper.rotation.z = project.id === 'ai-pm' ? -0.2 : 0.18;
    paper.rotation.y = 0.35;
    group.add(paper);

    var accent = new THREE.Color(project.accent || '#e99ad6');
    var starGroup = new THREE.Group();
    var starMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: accent,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    for (var i = 0; i < 10; i++) {
      var star = new THREE.Sprite(starMaterial.clone());
      star.position.set(
        (Math.random() - 0.5) * 0.48,
        -0.42 + Math.random() * 1.05,
        (Math.random() - 0.5) * 0.34
      );
      var size = 0.08 + Math.random() * 0.08;
      star.scale.set(size, size, 1);
      star.userData.phase = Math.random() * Math.PI * 2;
      starGroup.add(star);
    }
    starGroup.name = 'stars';
    starGroup.renderOrder = 4;
    group.add(starGroup);

    var light = new THREE.PointLight(accent, 0.72, 2.8, 2);
    light.position.set(0, 0.02, 0.15);
    light.name = 'innerLight';
    group.add(light);
  }

  var wakeMaterial = new THREE.MeshBasicMaterial({
    color: active ? '#f9fdff' : '#c7d1da',
    transparent: true,
    opacity: active ? 0.34 : 0.14,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  var wake = new THREE.Mesh(new THREE.RingGeometry(0.38, 0.52, 48), wakeMaterial);
  wake.rotation.x = -Math.PI / 2;
  wake.position.y = -0.48;
  wake.name = 'wake';
  group.add(wake);

  return group;
}

function sampleWaveHeight(x, z, time) {
  var waveA = Math.sin((x * 0.82 + z * 0.36) * 0.72 + time * 0.72) * 0.085;
  var waveB = Math.sin((x * -0.28 + z * 0.96) * 1.12 - time * 0.54) * 0.045;
  var waveC = Math.sin((x + z) * 1.84 + time * 0.42) * 0.018;
  return waveA + waveB + waveC;
}

function createFallback(shell, projects, onBottleClick) {
  shell.classList.add('is-fallback');
  var fallback = document.createElement('div');
  fallback.className = 'projects-ocean-fallback';
  var title = document.createElement('p');
  title.textContent = 'The tide is resting.';
  var actions = document.createElement('div');
  actions.className = 'projects-ocean-fallback-actions';
  projects.filter(function (project) { return project.state === 'active'; }).forEach(function (project) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = project.title;
    button.addEventListener('click', function () { onBottleClick(project.id); });
    actions.appendChild(button);
  });
  fallback.append(title, actions);
  shell.appendChild(fallback);
  return {
    resetCamera: function () {},
    resize: function () {},
    dispose: function () { if (fallback.parentNode) fallback.parentNode.removeChild(fallback); }
  };
}

export function initProjectsOcean(section, stage, projectData, onBottleClick) {
  if (!section || !stage) return null;
  var shell = document.getElementById('projectsSceneShell');
  if (!shell) return null;
  shell.textContent = '';

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: 'high-performance' });
  } catch (error) {
    return createFallback(shell, projectData, onBottleClick);
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.domElement.className = 'projects-ocean-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  shell.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  scene.background = new THREE.Color('#fbfbfd');
  scene.fog = new THREE.Fog('#eef4f7', 16, 39);

  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  var defaultCameraPosition = new THREE.Vector3(0, 5.9, 11.8);
  var defaultLookAt = new THREE.Vector3(0, 0.08, -1.5);
  var cameraGoal = defaultCameraPosition.clone();
  var lookGoal = defaultLookAt.clone();
  var smoothedLookAt = defaultLookAt.clone();
  camera.position.copy(defaultCameraPosition);
  camera.lookAt(defaultLookAt);

  var sky = createSkyDome();
  scene.add(sky);
  scene.add(new THREE.HemisphereLight('#fffaff', '#b8d0da', 1.75));
  var sunLight = new THREE.DirectionalLight('#fff9f5', 1.8);
  sunLight.position.set(-4, 9, 5);
  scene.add(sunLight);
  var pinkFill = new THREE.DirectionalLight('#f6dce9', 0.42);
  pinkFill.position.set(6, 3, -2);
  scene.add(pinkFill);

  var seaFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(46, 56),
    new THREE.MeshBasicMaterial({ color: '#e8f2f6' })
  );
  seaFloor.rotation.x = -Math.PI / 2;
  seaFloor.position.set(0, -0.24, -8);
  scene.add(seaFloor);

  var oceanGeometry = new THREE.PlaneGeometry(46, 56, 100, 120);
  var oceanMaterial = createOceanMaterial();
  var ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(0, 0, -8);
  ocean.renderOrder = 1;
  scene.add(ocean);

  var glowTexture = createGlowTexture();
  var bottleEntries = [];
  var markerLayer = document.createElement('div');
  markerLayer.className = 'projects-ocean-markers';
  shell.appendChild(markerLayer);

  var isMobile = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoveredEntry = null;
  var focusedEntry = null;
  var elapsed = 0;
  var previousTime = 0;
  var rafId = null;
  var running = false;
  var clickTimer = null;
  var pointerTarget = new THREE.Vector2();
  var pointerSmoothed = new THREE.Vector2();

  projectData.forEach(function (project, index) {
    var root = createBottle(project, glowTexture);
    root.userData.phase = index * 0.73 + Math.random() * 0.4;
    root.userData.hover = 0;
    root.userData.shake = 0;
    root.userData.baseRotationY = (Math.random() - 0.5) * 0.55;
    scene.add(root);

    var marker = document.createElement('button');
    marker.type = 'button';
    marker.className = 'projects-ocean-marker ' + (project.state === 'active' ? 'is-active' : 'is-pending');
    marker.dataset.projectId = project.id;
    marker.setAttribute('aria-label', project.state === 'active'
      ? 'Open ' + project.title + ' project details'
      : project.title + '. Awaiting Starlight.');

    var label = document.createElement('span');
    label.className = 'projects-ocean-marker-label';
    var kicker = document.createElement('small');
    kicker.textContent = project.state === 'active' ? (project.code || 'ILLUMINATED PROJECT') : 'UNLIT MESSAGE';
    var labelTitle = document.createElement('strong');
    labelTitle.textContent = project.state === 'active' ? (project.sceneTitle || project.title) : 'Awaiting Starlight';
    label.append(kicker, labelTitle);
    marker.appendChild(label);
    markerLayer.appendChild(marker);

    var entry = { project: project, root: root, marker: marker, layout: null, focusPosition: null };
    bottleEntries.push(entry);

    function setHover(next) {
      if (next) {
        if (hoveredEntry && hoveredEntry !== entry) hoveredEntry.marker.classList.remove('is-hovered');
        hoveredEntry = entry;
        marker.classList.add('is-hovered');
      } else if (hoveredEntry === entry && document.activeElement !== marker) {
        hoveredEntry = null;
        marker.classList.remove('is-hovered');
      }
    }

    marker.addEventListener('pointerenter', function () { setHover(true); });
    marker.addEventListener('pointerleave', function () { setHover(false); });
    marker.addEventListener('focus', function () { setHover(true); });
    marker.addEventListener('blur', function () { setHover(false); });
    marker.addEventListener('click', function () {
      if (project.state !== 'active') {
        root.userData.shake = 1;
        marker.classList.add('is-awaiting');
        window.setTimeout(function () { marker.classList.remove('is-awaiting'); }, 560);
        return;
      }
      if (focusedEntry) return;
      focusedEntry = entry;
      entry.focusPosition = { x: entry.root.position.x, z: entry.root.position.z };
      marker.classList.add('is-selected');
      cameraGoal.set(entry.focusPosition.x * 0.52, isMobile ? 4.2 : 3.8, entry.focusPosition.z + (isMobile ? 6.4 : 5.8));
      lookGoal.set(entry.focusPosition.x, 0.42, entry.focusPosition.z);
      var openDetails = function () { onBottleClick(project.id); };
      if (reducedMotion) openDetails();
      else clickTimer = window.setTimeout(openDetails, 420);
    });
  });

  function applyLayout() {
    var layoutMap = isMobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT;
    bottleEntries.forEach(function (entry) {
      var layout = layoutMap[entry.project.id];
      entry.layout = layout;
      entry.root.position.set(layout.x, 0.2, layout.z);
      entry.root.scale.setScalar(layout.scale);
      entry.root.rotation.set(0.04, entry.root.userData.baseRotationY, layout.tilt);
      entry.marker.style.setProperty('--marker-size', (entry.project.state === 'active' ? 138 : 92) * layout.scale + 'px');
    });
  }

  function resize() {
    var rect = shell.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    isMobile = rect.width < 720;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.fov = isMobile ? 56 : 50;
    defaultCameraPosition.set(0, isMobile ? 7.0 : 5.9, isMobile ? 14.8 : 11.8);
    defaultLookAt.set(0, isMobile ? 0.04 : 0.08, isMobile ? -2.0 : -1.5);
    if (!focusedEntry) {
      cameraGoal.copy(defaultCameraPosition);
      lookGoal.copy(defaultLookAt);
    }
    camera.updateProjectionMatrix();
    applyLayout();
  }

  function updateMarker(entry) {
    var point = entry.root.position.clone();
    point.y += 0.46 * entry.layout.scale;
    point.project(camera);
    var width = shell.clientWidth;
    var height = shell.clientHeight;
    var left = (point.x * 0.5 + 0.5) * width;
    var top = (-point.y * 0.5 + 0.5) * height;
    entry.marker.style.left = left + 'px';
    entry.marker.style.top = top + 'px';
    entry.marker.style.zIndex = String(Math.max(1, Math.round(20 + entry.root.position.z)));
    entry.marker.classList.toggle('is-offscreen', point.z > 1 || left < -80 || left > width + 80 || top < -100 || top > height + 100);
  }

  function animate(time) {
    rafId = window.requestAnimationFrame(animate);
    var delta = previousTime ? Math.min((time - previousTime) / 1000, 0.08) : 0;
    previousTime = time;
    if (!reducedMotion) elapsed += delta;
    oceanMaterial.uniforms.uTime.value = elapsed;

    pointerSmoothed.lerp(pointerTarget, 0.035);
    var desiredCamera = cameraGoal.clone();
    if (!focusedEntry && !reducedMotion) {
      desiredCamera.x += pointerSmoothed.x * 0.2;
      desiredCamera.y += pointerSmoothed.y * 0.08;
    }
    camera.position.lerp(desiredCamera, reducedMotion ? 1 : 0.045);
    smoothedLookAt.lerp(lookGoal, reducedMotion ? 1 : 0.05);
    camera.lookAt(smoothedLookAt);

    bottleEntries.forEach(function (entry) {
      var root = entry.root;
      var layout = entry.layout;
      var hoverTarget = hoveredEntry === entry || focusedEntry === entry ? 1 : 0;
      root.userData.hover += (hoverTarget - root.userData.hover) * 0.09;
      root.userData.shake *= 0.86;
      var driftTime = elapsed * layout.speed + layout.phase;
      var driftX = reducedMotion ? 0 : Math.sin(driftTime) * layout.driftX;
      var driftZ = reducedMotion ? 0 : Math.cos(driftTime * 0.82) * layout.driftZ;
      var currentX = focusedEntry === entry && entry.focusPosition ? entry.focusPosition.x : layout.x + driftX;
      var currentZ = focusedEntry === entry && entry.focusPosition ? entry.focusPosition.z : layout.z + driftZ;
      var wave = sampleWaveHeight(currentX, -(currentZ + 8), elapsed);
      var bob = reducedMotion ? 0 : Math.sin(elapsed * 0.72 + root.userData.phase) * 0.035;
      var shake = Math.sin(elapsed * 32) * 0.08 * root.userData.shake;
      root.position.x = currentX + shake;
      root.position.y = layout.scale * 0.48 + wave + bob + root.userData.hover * 0.2;
      root.position.z = currentZ;
      root.rotation.z = layout.tilt + (reducedMotion ? 0 : Math.sin(elapsed * 0.48 + root.userData.phase) * 0.035);
      root.rotation.x = 0.04 + (reducedMotion ? 0 : Math.sin(elapsed * 0.35 + root.userData.phase) * 0.025);
      var currentHeading = root.userData.baseRotationY + (reducedMotion ? 0 : Math.sin(driftTime + 0.8) * 0.12);
      root.rotation.y += ((hoverTarget ? 0 : currentHeading) - root.rotation.y) * 0.06;
      var scale = layout.scale * (1 + root.userData.hover * 0.055);
      root.scale.setScalar(scale);

      var wake = root.getObjectByName('wake');
      if (wake) {
        var wakePulse = 1 + (reducedMotion ? 0 : Math.sin(elapsed * 1.5 + root.userData.phase) * 0.08);
        wake.scale.set(wakePulse, wakePulse, 1);
      }
      var stars = root.getObjectByName('stars');
      if (stars) {
        stars.rotation.y += reducedMotion ? 0 : delta * 0.18;
        stars.children.forEach(function (star) {
          star.material.opacity = 0.52 + root.userData.hover * 0.34 + (reducedMotion ? 0 : Math.sin(elapsed * 2.2 + star.userData.phase) * 0.14);
        });
      }
      var light = root.getObjectByName('innerLight');
      if (light) light.intensity = 0.68 + root.userData.hover * 0.58;
      updateMarker(entry);
    });

    renderer.render(scene, camera);
  }

  function start() {
    if (running) return;
    running = true;
    previousTime = 0;
    rafId = window.requestAnimationFrame(animate);
  }

  function stop() {
    if (!running) return;
    running = false;
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  function resetCamera() {
    if (clickTimer) window.clearTimeout(clickTimer);
    clickTimer = null;
    if (focusedEntry) {
      focusedEntry.marker.classList.remove('is-selected');
      focusedEntry.focusPosition = null;
    }
    focusedEntry = null;
    cameraGoal.copy(defaultCameraPosition);
    lookGoal.copy(defaultLookAt);
  }

  function handlePointerMove(event) {
    var rect = shell.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerTarget.y = -(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function handlePointerLeave() {
    pointerTarget.set(0, 0);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) start();
      else stop();
    });
  }, { threshold: 0.04 });
  observer.observe(section);

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function handleMotionChange(event) { reducedMotion = event.matches; }
  motionQuery.addEventListener('change', handleMotionChange);
  shell.addEventListener('pointermove', handlePointerMove);
  shell.addEventListener('pointerleave', handlePointerLeave);
  window.addEventListener('resize', resize);

  resize();
  start();

  return {
    resetCamera: resetCamera,
    resize: resize,
    dispose: function () {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      shell.removeEventListener('pointermove', handlePointerMove);
      shell.removeEventListener('pointerleave', handlePointerLeave);
      motionQuery.removeEventListener('change', handleMotionChange);
      if (clickTimer) window.clearTimeout(clickTimer);
      scene.traverse(function (object) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          var materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(function (material) {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        }
      });
      glowTexture.dispose();
      renderer.dispose();
      shell.textContent = '';
    }
  };
}
