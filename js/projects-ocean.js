/* Projects — Three.js 3D Ocean + 漂流瓶 (Message Bottles)
   Self-contained module. Exports initProjectsOcean(section, projectData, onBottleClick). */

import * as THREE from 'three';

// ---- Gerstner wave parameters (shared between vertex shader and JS height sampling) ----
var WAVES = [
  { dirX: 0.6, dirY: 0.8, steepness: 0.12, wavelength: 8.0 },  // large swell
  { dirX: -0.4, dirY: 0.7, steepness: 0.16, wavelength: 4.5 }, // medium cross
  { dirX: 0.2, dirY: -0.5, steepness: 0.10, wavelength: 2.2 }, // small detail
  { dirX: -0.7, dirY: -0.3, steepness: 0.07, wavelength: 1.0 }  // ripple
];

// ---- JS-side wave height (must match vertex shader) ----
function gerstnerHeight(wave, x, z, time) {
  var k = 2 * Math.PI / wave.wavelength;
  var c = Math.sqrt(9.8 / k);
  var len = Math.sqrt(wave.dirX * wave.dirX + wave.dirY * wave.dirY);
  var dx = wave.dirX / len;
  var dy = wave.dirY / len;
  var f = k * (dx * x + dy * z - c * time);
  return (wave.steepness / k) * Math.sin(f);
}

function getWaveHeight(x, z, time) {
  var y = 0;
  for (var i = 0; i < WAVES.length; i++) {
    y += gerstnerHeight(WAVES[i], x, z, time);
  }
  return y;
}

function getWaveNormal(x, z, time) {
  var eps = 0.1;
  var hL = getWaveHeight(x - eps, z, time);
  var hR = getWaveHeight(x + eps, z, time);
  var hD = getWaveHeight(x, z - eps, time);
  var hU = getWaveHeight(x, z + eps, time);
  var nx = -(hR - hL) / (2 * eps);
  var nz = -(hU - hD) / (2 * eps);
  return new THREE.Vector3(nx, 1, nz).normalize();
}

// ---- Ocean ShaderMaterial ----
function createOceanMaterial() {
  var vertexShader = [
    'uniform float uTime;',
    'varying vec3 vWorldPos;',
    'varying vec3 vNormal;',
    'varying vec2 vUv;',
    'varying float vHeight;',
    '',
    'vec3 gerstner(vec2 dir, float steepness, float wavelength, vec3 p, float time, inout vec3 tangent, inout vec3 binormal) {',
    '  float k = 6.2831853 / wavelength;',
    '  float c = sqrt(9.8 / k);',
    '  vec2 d = normalize(dir);',
    '  float f = k * (dot(d, p.xz) - c * time);',
    '  float a = steepness / k;',
    '',
    '  tangent += vec3(-d.x*d.x*(steepness*sin(f)), d.x*(steepness*cos(f)), -d.x*d.y*(steepness*sin(f)));',
    '  binormal += vec3(-d.x*d.y*(steepness*sin(f)), d.y*(steepness*cos(f)), -d.y*d.y*(steepness*sin(f)));',
    '',
    '  return vec3(d.x*(a*cos(f)), a*sin(f), d.y*(a*cos(f)));',
    '}',
    '',
    'void main() {',
    '  vec3 pos = position;',
    '  vec3 tangent = vec3(1.0, 0.0, 0.0);',
    '  vec3 binormal = vec3(0.0, 0.0, 1.0);',
    '  float time = uTime;',
    '',
    '  pos += gerstner(vec2(0.6,0.8), 0.12, 8.0, pos, time, tangent, binormal);',
    '  pos += gerstner(vec2(-0.4,0.7), 0.16, 4.5, pos, time, tangent, binormal);',
    '  pos += gerstner(vec2(0.2,-0.5), 0.10, 2.2, pos, time, tangent, binormal);',
    '  pos += gerstner(vec2(-0.7,-0.3), 0.07, 1.0, pos, time, tangent, binormal);',
    '',
    '  vec3 normal = normalize(cross(binormal, tangent));',
    '',
    '  vec4 worldPos = modelMatrix * vec4(pos, 1.0);',
    '  vWorldPos = worldPos.xyz;',
    '  vNormal = normalize(mat3(modelMatrix) * normal);',
    '  vUv = uv;',
    '  vHeight = pos.y;',
    '',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',
    '}'
  ].join('\n');

  var fragmentShader = [
    'uniform vec3 uDeepColor;',
    'uniform vec3 uShallowColor;',
    'uniform vec3 uFoamColor;',
    'uniform vec3 uSunDir;',
    'uniform vec3 uSunColor;',
    'uniform float uTime;',
    '',
    'varying vec3 vWorldPos;',
    'varying vec3 vNormal;',
    'varying vec2 vUv;',
    'varying float vHeight;',
    '',
    'void main() {',
    '  vec3 N = normalize(vNormal);',
    '  vec3 V = normalize(cameraPosition - vWorldPos);',
    '  vec3 L = normalize(uSunDir);',
    '',
    '  // Water depth blend',
    '  float hf = smoothstep(-1.2, 0.5, vHeight);',
    '  vec3 waterColor = mix(uDeepColor, uShallowColor, hf);',
    '',
    '  // Fresnel',
    '  float fresnel = pow(1.0 - abs(dot(N, V)), 3.5);',
    '  fresnel = mix(0.03, 0.52, fresnel);',
    '',
    '  // Blinn-Phong specular',
    '  vec3 H = normalize(L + V);',
    '  float spec = pow(max(dot(N, H), 0.0), 256.0);',
    '  spec *= 0.35 * (1.0 - fresnel);',
    '',
    '  // Diffuse',
    '  float diff = max(dot(N, L), 0.0) * 0.22;',
    '',
    '  // Foam on crests',
    '  float foamMask = smoothstep(0.22, 0.50, vHeight);',
    '  float foamNoise = sin(vWorldPos.x*18.0+uTime*0.8)*sin(vWorldPos.z*22.0-uTime*0.6)*0.5+0.5;',
    '  float foam = foamMask * foamNoise * 0.42;',
    '',
    '  vec3 color = waterColor;',
    '  color += uSunColor * (spec + diff);',
    '  color = mix(color, uFoamColor, foam);',
    '  color = mix(color, vec3(0.90,0.83,0.97), fresnel);',
    '',
    '  gl_FragColor = vec4(color, 0.94);',
    '}'
  ].join('\n');

  return new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color('#150830') },
      uShallowColor: { value: new THREE.Color('#4a2da0') },
      uFoamColor: { value: new THREE.Color('#e0d0f4') },
      uSunDir: { value: new THREE.Vector3(0.45, 0.75, 0.3).normalize() },
      uSunColor: { value: new THREE.Color('#fff6ee') }
    },
    transparent: true,
    depthWrite: true,
    side: THREE.DoubleSide
  });
}

// ---- Bottle creation ----
function createBottle(accentColor) {
  var group = new THREE.Group();

  // Bottle profile (radius, y)
  var profile = [
    new THREE.Vector2(0.00, -0.48),
    new THREE.Vector2(0.52, -0.48),
    new THREE.Vector2(0.50, -0.44),
    new THREE.Vector2(0.47, -0.28),
    new THREE.Vector2(0.50,  0.02),
    new THREE.Vector2(0.44,  0.22),
    new THREE.Vector2(0.17,  0.44),
    new THREE.Vector2(0.15,  0.60),
    new THREE.Vector2(0.21,  0.64),
    new THREE.Vector2(0.19,  0.68)
  ];

  var bottleGeo = new THREE.LatheGeometry(profile, 32);
  var glassColor = new THREE.Color(accentColor).multiplyScalar(0.55);
  glassColor.offsetHSL(0.08, 0, 0.04);
  var bottleMat = new THREE.MeshPhongMaterial({
    color: glassColor,
    specular: 0xccccff,
    shininess: 80,
    transparent: true,
    opacity: 0.72
  });
  var bottleMesh = new THREE.Mesh(bottleGeo, bottleMat);
  bottleMesh.castShadow = true;
  bottleMesh.name = 'bottleBody';
  group.add(bottleMesh);

  // Cork
  var corkGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.14, 16);
  var corkMat = new THREE.MeshStandardMaterial({ color: 0xc49a6c, roughness: 0.7 });
  var cork = new THREE.Mesh(corkGeo, corkMat);
  cork.position.y = 0.73;
  cork.name = 'cork';
  group.add(cork);

  // Inner scroll
  var scrollGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.32, 8);
  var scrollMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e0, roughness: 0.5 });
  var scroll = new THREE.Mesh(scrollGeo, scrollMat);
  scroll.position.y = 0.05;
  scroll.name = 'scroll';
  group.add(scroll);

  // Glow ring
  var ringGeo = new THREE.TorusGeometry(0.22, 0.022, 16, 32);
  var ringMat = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });
  var ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.44;
  ring.rotation.x = Math.PI / 2;
  ring.name = 'glowRing';
  group.add(ring);

  return group;
}

// ---- Foam particles ----
function createFoamParticles(count) {
  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(count * 3);
  for (var i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = Math.random() * 0.6 - 1.2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  var mat = new THREE.PointsMaterial({
    color: 0xe0d0f4,
    size: 0.06,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geo, mat);
}

// ---- Main export ----
export function initProjectsOcean(section, projectData, onBottleClick) {
  if (!section) return null;

  var rect = section.getBoundingClientRect();
  var width = rect.width || window.innerWidth;
  var height = rect.height || window.innerHeight;

  // Renderer
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.domElement.className = 'projects-ocean-canvas';
  renderer.domElement.style.cssText = 'position:absolute;inset:0;z-index:1;';
  var stage = section.querySelector('.projects-stage');
  if (stage) {
    section.insertBefore(renderer.domElement, stage);
  } else {
    section.appendChild(renderer.domElement);
  }

  // Scene
  var scene = new THREE.Scene();

  // Camera
  var camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 80);
  camera.position.set(0, 3.2, 8.5);
  camera.lookAt(0, -0.3, 0);

  // Lights
  scene.add(new THREE.AmbientLight('#d8c8f0', 0.7));
  var keyLight = new THREE.DirectionalLight('#fff4e8', 1.8);
  keyLight.position.set(5, 8, 3);
  scene.add(keyLight);
  var fillLight = new THREE.DirectionalLight('#c8d0ff', 0.6);
  fillLight.position.set(-3, 2, -2);
  scene.add(fillLight);
  var rimLight = new THREE.DirectionalLight('#f0d0e8', 0.5);
  rimLight.position.set(0, 0.5, 4);
  scene.add(rimLight);

  // Small PointLight under each bottle for glow
  function makeBottleLight(color) {
    var pl = new THREE.PointLight(color, 0.8, 2.5);
    return pl;
  }

  // Sky dome
  var skyGeo = new THREE.SphereGeometry(35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  var skyMat = new THREE.MeshBasicMaterial({ color: '#28184a', side: THREE.BackSide });
  scene.add(new THREE.Mesh(skyGeo, skyMat));

  // Ocean
  var oceanGeo = new THREE.PlaneGeometry(16, 10, 128, 128);
  oceanGeo.rotateX(-Math.PI / 2);
  var oceanMat = createOceanMaterial();
  var ocean = new THREE.Mesh(oceanGeo, oceanMat);
  ocean.position.y = -1.2;
  ocean.renderOrder = 0;
  scene.add(ocean);

  // Bottles
  var accents = ['#8f7df4', '#e99ad6', '#7aa7e9']; // from PROJECTS data
  var bottlePositions = [
    { x: -3.8, z: -1.2 },
    { x: 0, z: -2.0 },
    { x: 3.8, z: -1.2 }
  ];

  var bottles = [];
  var bottleLights = [];
  var bottleDataMap = [];

  for (var b = 0; b < 3; b++) {
    var bottleGroup = createBottle(accents[b]);
    bottleGroup.position.set(bottlePositions[b].x, 0, bottlePositions[b].z);
    bottleGroup.rotation.set(0, Math.random() * Math.PI * 2, 0);
    bottleGroup.scale.set(1, 1, 1);
    bottleGroup.renderOrder = 2;
    scene.add(bottleGroup);

    var bl = makeBottleLight(accents[b]);
    bl.position.copy(bottleGroup.position);
    bl.position.y += 0.5;
    scene.add(bl);

    bottles.push(bottleGroup);
    bottleLights.push(bl);
    bottleDataMap.push(projectData[b]);
  }

  // Foam particles
  var foamCount = window.innerWidth < 768 ? 100 : 200;
  var foam = createFoamParticles(foamCount);
  foam.position.y = -1.2;
  foam.renderOrder = 1;
  scene.add(foam);

  // Raycaster
  var raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.15;
  var mouse = new THREE.Vector2();
  var hoveredBottle = null;

  // Morph origin tracker
  var morphOrigin = document.getElementById('bottleMorphOrigin');
  if (!morphOrigin) {
    morphOrigin = document.createElement('div');
    morphOrigin.id = 'bottleMorphOrigin';
    morphOrigin.className = 'bottle-morph-origin';
    morphOrigin.setAttribute('aria-hidden', 'true');
    morphOrigin.style.cssText = 'position:absolute;width:60px;height:120px;pointer-events:none;z-index:5;opacity:0;';
    section.appendChild(morphOrigin);
  }

  // ---- Animation state ----
  var clock = new THREE.Clock();
  var elapsed = 0;
  var rafId = null;
  var running = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateBottleOnWave(bottleGroup, bottleLight, baseX, baseZ, time) {
    var h = getWaveHeight(baseX, baseZ, time);
    var n = getWaveNormal(baseX, baseZ, time);
    bottleGroup.position.y = ocean.position.y + h + 0.18;
    bottleLight.position.y = bottleGroup.position.y + 0.6;
    // Gentle tilt following wave normal
    bottleGroup.rotation.x += (Math.atan2(n.z, n.y) * 0.25 - bottleGroup.rotation.x) * 0.08;
    bottleGroup.rotation.z += (-Math.atan2(n.x, n.y) * 0.25 - bottleGroup.rotation.z) * 0.08;
    // Bobbing
    if (!reducedMotion) {
      bottleGroup.rotation.z += Math.sin(time * 1.4 + baseX * 0.5) * 0.001;
    }
  }

  function animate() {
    rafId = requestAnimationFrame(animate);

    var dt = clock.getDelta();
    if (!reducedMotion) {
      elapsed += dt;
    }
    oceanMat.uniforms.uTime.value = elapsed;

    // Update bottles
    for (var i = 0; i < bottles.length; i++) {
      updateBottleOnWave(bottles[i], bottleLights[i], bottlePositions[i].x, bottlePositions[i].z, elapsed);
      // Smooth scale lerp for hover
      var bg = bottles[i];
      var targetScale = bg._hoverTarget || 1.0;
      bg.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.12
      );
    }

    // Update foam
    var foamPos = foam.geometry.attributes.position.array;
    for (var j = 0; j < foamCount; j++) {
      var fx = foamPos[j * 3];
      var fz = foamPos[j * 3 + 2];
      foamPos[j * 3 + 1] = ocean.position.y + getWaveHeight(fx, fz, elapsed) + 0.02;
    }
    foam.geometry.attributes.position.needsUpdate = true;
    foam.rotation.y += 0.0003;

    // Raycaster hover
    raycaster.setFromCamera(mouse, camera);
    var targets = [];
    for (var k = 0; k < bottles.length; k++) { targets.push(bottles[k]); }
    var hits = raycaster.intersectObjects(targets, true);

    if (hits.length > 0) {
      var hitBottle = hits[0].object;
      while (hitBottle && targets.indexOf(hitBottle) === -1) {
        hitBottle = hitBottle.parent;
      }
      if (hitBottle && hitBottle !== hoveredBottle) {
        if (hoveredBottle) unhoverBottle(hoveredBottle);
        hoverBottle(hitBottle);
        hoveredBottle = hitBottle;
        renderer.domElement.style.cursor = 'pointer';
      }
    } else if (hoveredBottle) {
      unhoverBottle(hoveredBottle);
      hoveredBottle = null;
      renderer.domElement.style.cursor = 'default';
    }

    // Update morph origin position for active bottle
    if (morphOrigin && bottles.length > 0) {
      var activeBottle = bottles[1]; // default center
      for (var m = 0; m < bottles.length; m++) {
        if (bottles[m].visible) { activeBottle = bottles[m]; break; }
      }
      var screenPos = activeBottle.position.clone().project(camera);
      var r = section.getBoundingClientRect();
      var sw = r.width || window.innerWidth;
      var sh = r.height || window.innerHeight;
      var sx = (screenPos.x * 0.5 + 0.5) * sw;
      var sy = (-screenPos.y * 0.5 + 0.5) * sh;
      morphOrigin.style.left = sx + 'px';
      morphOrigin.style.top = sy + 'px';
    }

    renderer.render(scene, camera);
  }

  function hoverBottle(bg) {
    var ring = bg.getObjectByName('glowRing');
    if (ring) ring.material.opacity = 0.9;
    bg._hoverTarget = 1.1;
  }

  function unhoverBottle(bg) {
    var ring = bg.getObjectByName('glowRing');
    if (ring) ring.material.opacity = 0.55;
    bg._hoverTarget = 1.0;
  }

  function startRendering() {
    if (running) return;
    running = true;
    clock.start();
    rafId = requestAnimationFrame(animate);
  }

  function stopRendering() {
    if (!running) return;
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  // IntersectionObserver
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) startRendering();
      else stopRendering();
    });
  }, { threshold: 0.05 });
  observer.observe(section);

  // Resize
  function onResize() {
    var r = section.getBoundingClientRect();
    var w = r.width || window.innerWidth;
    var h = r.height || window.innerHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    width = w;
    height = h;
  }
  window.addEventListener('resize', onResize);

  // Click handler
  function onClick(e) {
    var r = section.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var targets = [];
    for (var i = 0; i < bottles.length; i++) { targets.push(bottles[i]); }
    var hits = raycaster.intersectObjects(targets, true);
    if (hits.length > 0) {
      var hitBottle = hits[0].object;
      while (hitBottle && targets.indexOf(hitBottle) === -1) {
        hitBottle = hitBottle.parent;
      }
      if (hitBottle) {
        var idx = targets.indexOf(hitBottle);
        if (idx >= 0 && idx < bottleDataMap.length && onBottleClick) {
          onBottleClick(bottleDataMap[idx].id);
        }
      }
    }
  }
  section.addEventListener('click', onClick);

  // Mousemove for hover tracking
  function onMouseMove(e) {
    var r = section.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  section.addEventListener('mousemove', onMouseMove);

  // Reduced motion listener
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
    reducedMotion = e.matches;
    if (reducedMotion) foam.visible = false;
    else foam.visible = true;
  });
  if (reducedMotion) foam.visible = false;

  // Start
  startRendering();

  // Return API
  return {
    scene: scene,
    renderer: renderer,
    camera: camera,
    ocean: ocean,
    oceanMat: oceanMat,
    bottles: bottles,
    bottleDataMap: bottleDataMap,
    morphOrigin: morphOrigin,
    setBottleVisible: function (idx, visible) {
      if (idx >= 0 && idx < bottles.length) {
        bottles[idx].visible = visible;
        if (bottleLights[idx]) bottleLights[idx].visible = visible;
      }
    },
    resize: onResize,
    dispose: function () {
      stopRendering();
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      section.removeEventListener('click', onClick);
      section.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      oceanGeo.dispose();
      oceanMat.dispose();
      for (var i = 0; i < bottles.length; i++) {
        bottles[i].traverse(function (child) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      }
      foam.geometry.dispose();
      foam.material.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
}
