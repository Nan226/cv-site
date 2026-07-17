/* ========================================
   CV-Site — 交互脚本
   导航撕碎效果 + Three.js 3D人物
   ======================================== */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { initProjectsOrbs } from './projects-orbs.js?v=20260717-8';

// ============================================================
//  导航栏「撕碎」效果
// ============================================================

(function initTearEffect() {
  const navLinks = document.querySelectorAll('.nav-item');

  navLinks.forEach(link => {
    // 跳过已处理
    if (link.parentElement.classList.contains('nav-tear-wrap')) return;

    const text = link.textContent;

    // 创建包裹层
    const wrap = document.createElement('span');
    wrap.className = 'nav-tear-wrap';

    // 把 <a> 移入包裹层
    link.parentElement.insertBefore(wrap, link);
    wrap.appendChild(link);
    link.classList.add('nav-tear-original');

    // 上半撕裂层
    const topHalf = document.createElement('span');
    topHalf.className = 'nav-tear-half nav-tear-top';
    topHalf.setAttribute('aria-hidden', 'true');
    topHalf.textContent = text;
    wrap.appendChild(topHalf);

    // 下半撕裂层
    const bottomHalf = document.createElement('span');
    bottomHalf.className = 'nav-tear-half nav-tear-bottom';
    bottomHalf.setAttribute('aria-hidden', 'true');
    bottomHalf.textContent = text;
    wrap.appendChild(bottomHalf);
  });
})();

// ---- 导航点击：平滑滚动到对应分区 ----
(function initNavClicks() {
  var sectionMap = {
    'About Me': 'about',
    'Internship': 'internship',
    'Projects': 'projects',
    'Skills & Learning': 'skills-learning',
    'Me & My Friends': 'travel-memory'
  };

  document.querySelectorAll('.nav-item').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = sectionMap[link.textContent.trim()];
      if (!targetId) return; // 未绑定分区的标签保持默认行为（#）

      e.preventDefault();
      var target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // HOME 图标点击：回到首页
  var homeBtn = document.getElementById('navHome');
  if (homeBtn) {
    homeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var home = document.getElementById('home');
      if (home) {
        home.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
})();


// ============================================================
//  标签「撕碎」— 点击撕裂，碎片消失
// ============================================================

(function initTagTearEffect() {
  const tags = document.querySelectorAll('.character-tags .tag');
  let tornCount = 0;
  const totalTags = tags.length;

  tags.forEach(tag => {
    if (tag.querySelector('.tag-inner')) return;

    const text = tag.textContent;
    const inner = document.createElement('span');
    inner.className = 'tag-inner';

    // 原始文字
    const orig = document.createElement('span');
    orig.className = 'tag-orig';
    orig.textContent = text;
    inner.appendChild(orig);

    // 左碎片
    const left = document.createElement('span');
    left.className = 'tag-shard shard-L';
    left.textContent = text;
    inner.appendChild(left);

    // 右碎片
    const right = document.createElement('span');
    right.className = 'tag-shard shard-R';
    right.textContent = text;
    inner.appendChild(right);

    tag.textContent = '';
    tag.appendChild(inner);

    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      if (inner.classList.contains('torn')) return;
      inner.classList.add('tearing', 'torn');
      // 动画播完后从布局中移除，防止暗黑模式切换后重现
      setTimeout(function () { tag.style.display = 'none'; }, 650);

      // 彩蛋计数器
      tornCount++;
      if (tornCount === totalTags) {
        // 隐藏提示文字
        const hint = document.getElementById('easterEggHint');
        if (hint) hint.classList.add('all-torn');
        // 触发彩蛋倒计时
        setTimeout(() => triggerEasterEgg(), 500);
      }
    });
  });

  // 暴露计数和重置（供调试 + 开灯后重置）
  window.__tornCount = () => tornCount;
  window.__resetAllTags = function () {
    tornCount = 0;
    tags.forEach(function (tag) {
      tag.style.display = '';
      var inner = tag.querySelector('.tag-inner');
      if (inner) {
        inner.classList.remove('tearing', 'torn');
      }
    });
    var hint = document.getElementById('easterEggHint');
    if (hint) hint.classList.remove('all-torn');
  };
})();


// ============================================================
//  Three.js 3D 人物
// ============================================================

(function initThreeJSCharacter() {
  const container = document.getElementById('characterContainer');
  const canvas = document.getElementById('threeCanvas');
  const fallbackImage = document.getElementById('characterFallbackImage');
  const interactHint = document.getElementById('interactHint');
  const easterEggHint = document.getElementById('easterEggHint');
  if (!container || !canvas) return;

  // ---- Scene / Camera / Renderer ----
  const scene = new THREE.Scene();

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (error) {
    const spinner = document.getElementById('loadingSpinner');
    const modelStatus = document.getElementById('modelStatus');
    if (spinner) spinner.classList.add('is-hidden');
    canvas.classList.add('is-hidden');
    if (fallbackImage) fallbackImage.classList.add('is-visible');
    if (interactHint) interactHint.classList.add('is-hidden');
    if (easterEggHint) easterEggHint.classList.add('is-hidden');
    if (modelStatus) {
      modelStatus.textContent = 'Static character preview';
      modelStatus.classList.add('is-hidden');
    }
    window.__threeCharacter = {
      unavailable: true,
      reason: 'webgl-unavailable',
    };
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.86;

  // 透视相机：与人眼接近
  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 50);
  camera.position.set(0, 0.15, 7.2);
  camera.lookAt(0, -0.15, 0);

  // ---- 光照 ----
  // 环境光
  const ambient = new THREE.AmbientLight('#f8f4fc', 1.55);
  scene.add(ambient);

  // 主方向光（模拟柔光）
  const keyLight = new THREE.DirectionalLight('#ffffff', 2.35);
  keyLight.position.set(3, 2, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(512, 512);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 20;
  scene.add(keyLight);

  // 补光
  const fillLight = new THREE.DirectionalLight('#e8ddf5', 1.25);
  fillLight.position.set(-2, 1, 1);
  scene.add(fillLight);

  // 底部柔光
  const rimLight = new THREE.DirectionalLight('#f0d8e0', 0.9);
  rimLight.position.set(0, -1, 2);
  scene.add(rimLight);

  function setEasterLighting(isActive) {
    ambient.intensity = isActive ? 1.8 : 1.55;
    fillLight.color.set(isActive ? '#d8c2ff' : '#e8ddf5');
    fillLight.intensity = isActive ? 1.6 : 1.25;
    rimLight.color.set(isActive ? '#b98cff' : '#f0d8e0');
    rimLight.intensity = isActive ? 2.7 : 0.9;
    renderer.toneMappingExposure = isActive ? 1.02 : 0.86;
  }

  // ---- 材质工厂 ----
  const skinMat = new THREE.MeshStandardMaterial({
    color: '#f2c4b0',
    roughness: 0.55,
    metalness: 0.02,
  });

  const skinDarkMat = new THREE.MeshStandardMaterial({
    color: '#e8b098',
    roughness: 0.55,
    metalness: 0.02,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: '#1a0a0a',
    roughness: 0.7,
    metalness: 0.05,
  });

  const scleraMat = new THREE.MeshStandardMaterial({
    color: '#fefefe',
    roughness: 0.15,
    metalness: 0.05,
  });

  const pupilMat = new THREE.MeshStandardMaterial({
    color: '#0d0d1a',
    roughness: 0.1,
    metalness: 0.1,
  });

  const clothesMat = new THREE.MeshStandardMaterial({
    color: '#aeb0b8',
    roughness: 0.72,
    metalness: 0.02,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: '#f4f1f5',
    roughness: 0.65,
    metalness: 0.05,
  });

  const shirtMat = new THREE.MeshStandardMaterial({
    color: '#fbfafc',
    roughness: 0.72,
  });

  const denimMat = new THREE.MeshStandardMaterial({
    color: '#8faed2',
    roughness: 0.74,
  });

  const shoeMat = new THREE.MeshStandardMaterial({
    color: '#f7f5f4',
    roughness: 0.62,
  });

  const clipMat = new THREE.MeshStandardMaterial({
    color: '#ff7a22',
    roughness: 0.38,
  });

  // ---- 构建人物 ----
  const character = new THREE.Group();
  const bodyParts = {};   // 记录各部位，用于点击检测
  character.position.y = 0.68;
  character.scale.setScalar(0.84);

  // 颈部
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.2, 0.25, 24),
    skinDarkMat
  );
  neck.position.y = 0.5;
  neck.castShadow = true;
  character.add(neck);

  // 躯干（上半身）
  const torsoGeo = new THREE.CapsuleGeometry(0.46, 0.58, 10, 24);
  const torso = new THREE.Mesh(torsoGeo, clothesMat);
  torso.position.y = -0.02;
  torso.scale.set(0.92, 1, 0.68);
  torso.castShadow = true;
  torso.name = 'body';
  bodyParts.body = torso;
  bodyParts.stomach = torso;
  character.add(torso);

  // 白色内搭
  const shirt = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.31, 0.42, 8, 20),
    shirtMat
  );
  shirt.position.set(0, -0.04, 0.31);
  shirt.scale.set(0.72, 0.94, 0.2);
  character.add(shirt);

  // 外套左右前襟
  for (const side of [-1, 1]) {
    const jacketPanel = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.18, 0.48, 8, 18),
      clothesMat
    );
    jacketPanel.position.set(side * 0.3, -0.03, 0.3);
    jacketPanel.scale.set(0.82, 1, 0.2);
    jacketPanel.rotation.z = side * -0.035;
    jacketPanel.castShadow = true;
    character.add(jacketPanel);
  }

  const zipper = new THREE.Mesh(
    new THREE.BoxGeometry(0.026, 0.75, 0.025),
    new THREE.MeshStandardMaterial({ color: '#d8d8dd', roughness: 0.42 })
  );
  zipper.position.set(0, -0.04, 0.43);
  character.add(zipper);

  function createStarGeometry(outerRadius = 0.05, innerRadius = 0.022) {
    const shape = new THREE.Shape();
    for (let index = 0; index < 10; index++) {
      const angle = -Math.PI / 2 + index * Math.PI / 5;
      const radius = index % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (index === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }

  const starMat = new THREE.MeshBasicMaterial({
    color: '#5f5b68',
    transparent: true,
    opacity: 0.76,
    side: THREE.DoubleSide,
  });
  [
    [-0.31, 0.18, 0.43, 0.15],
    [0.29, -0.13, 0.43, -0.1],
    [-0.27, -0.35, 0.42, 0.18],
  ].forEach(([x, y, z, rotation]) => {
    const star = new THREE.Mesh(createStarGeometry(), starMat);
    star.position.set(x, y, z);
    star.rotation.z = rotation;
    character.add(star);
  });

  // 肩膀
  const shoulderGeo = new THREE.SphereGeometry(0.28, 20, 16);
  const leftShoulder = new THREE.Mesh(shoulderGeo, clothesMat);
  leftShoulder.position.set(-0.53, 0.22, 0);
  leftShoulder.scale.set(0.8, 0.7, 0.6);
  leftShoulder.name = 'left-shoulder';
  character.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(shoulderGeo, clothesMat);
  rightShoulder.position.set(0.53, 0.22, 0);
  rightShoulder.scale.set(0.8, 0.7, 0.6);
  rightShoulder.name = 'right-shoulder';
  character.add(rightShoulder);

  // 毛绒衣领
  const collarGeo = new THREE.TorusGeometry(0.38, 0.105, 10, 30);
  const collar = new THREE.Mesh(collarGeo, accentMat);
  collar.position.set(0, 0.42, 0.02);
  collar.rotation.x = Math.PI * 0.5;
  collar.scale.y = 0.72;
  character.add(collar);

  const hoodBack = new THREE.Mesh(
    new THREE.TorusGeometry(0.43, 0.13, 10, 30, Math.PI * 1.25),
    accentMat
  );
  hoodBack.position.set(0, 0.44, -0.1);
  hoodBack.rotation.set(Math.PI * 0.5, 0, -Math.PI * 0.12);
  character.add(hoodBack);

  // 手臂关节
  function createArm(side) {
    const sign = side === 'left' ? -1 : 1;
    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(sign * 0.53, 0.23, 0);
    shoulderPivot.name = `${side}-shoulder`;

    const upperArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.12, 0.48, 8, 16),
      clothesMat
    );
    upperArm.position.y = -0.35;
    upperArm.castShadow = true;
    shoulderPivot.add(upperArm);

    const elbowPivot = new THREE.Group();
    elbowPivot.position.y = -0.68;
    shoulderPivot.add(elbowPivot);

    const lowerArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.105, 0.44, 8, 16),
      clothesMat
    );
    lowerArm.position.y = -0.3;
    lowerArm.castShadow = true;
    elbowPivot.add(lowerArm);

    const hand = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 18, 14),
      skinMat
    );
    hand.position.y = -0.61;
    hand.scale.set(0.82, 1.08, 0.58);
    hand.name = `${side}-hand`;
    hand.castShadow = true;
    elbowPivot.add(hand);

    character.add(shoulderPivot);
    bodyParts[`${side}-shoulder`] = shoulderPivot;
    bodyParts[`${side}-elbow`] = elbowPivot;
    bodyParts[`${side}-hand`] = hand;
    return { shoulder: shoulderPivot, elbow: elbowPivot, hand };
  }

  const leftArm = createArm('left');
  const rightArm = createArm('right');

  // 腰部和牛仔裤
  const hips = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.38, 0.24, 8, 22),
    denimMat
  );
  hips.position.y = -0.78;
  hips.scale.set(1.05, 0.85, 0.7);
  hips.name = 'hips';
  hips.castShadow = true;
  character.add(hips);
  bodyParts.hips = hips;

  function createLeg(side) {
    const sign = side === 'left' ? -1 : 1;
    const hipPivot = new THREE.Group();
    hipPivot.position.set(sign * 0.24, -0.88, 0);

    const upperLeg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.19, 0.7, 8, 18),
      denimMat
    );
    upperLeg.position.y = -0.48;
    upperLeg.castShadow = true;
    hipPivot.add(upperLeg);

    const kneePivot = new THREE.Group();
    kneePivot.position.y = -0.95;
    hipPivot.add(kneePivot);

    const lowerLeg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.17, 0.66, 8, 18),
      denimMat
    );
    lowerLeg.position.y = -0.45;
    lowerLeg.castShadow = true;
    kneePivot.add(lowerLeg);

    const foot = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.17, 0.28, 8, 18),
      shoeMat
    );
    foot.position.set(0, -0.89, 0.13);
    foot.rotation.x = Math.PI * 0.5;
    foot.scale.set(1.05, 1, 0.85);
    foot.name = `${side}-foot`;
    foot.castShadow = true;
    kneePivot.add(foot);

    character.add(hipPivot);
    bodyParts[`${side}-hip`] = hipPivot;
    bodyParts[`${side}-knee`] = kneePivot;
    bodyParts[`${side}-foot`] = foot;
    return { hip: hipPivot, knee: kneePivot, foot };
  }

  const leftLeg = createLeg('left');
  const rightLeg = createLeg('right');

  // 头部
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.02;
  headGroup.name = 'head';
  bodyParts.head = headGroup;

  // 脸
  const faceGeo = new THREE.SphereGeometry(0.35, 32, 28);
  const face = new THREE.Mesh(faceGeo, skinMat);
  face.scale.set(1, 1.08, 0.92);
  face.castShadow = true;
  headGroup.add(face);

  // 头发（后半 + 顶部）
  const hairMain = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 32, 24),
    hairMat
  );
  hairMain.position.y = 0.08;
  hairMain.position.z = -0.06;
  hairMain.scale.set(1.05, 1.1, 1.0);
  headGroup.add(hairMain);

  const hairBack = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.31, 0.7, 10, 22),
    hairMat
  );
  hairBack.position.set(0, -0.28, -0.14);
  hairBack.scale.set(1.08, 1, 0.7);
  headGroup.add(hairBack);

  // 刘海
  const bangsGeo = new THREE.SphereGeometry(0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const bangs = new THREE.Mesh(bangsGeo, hairMat);
  bangs.position.y = 0.22;
  bangs.position.z = 0.12;
  bangs.rotation.x = 0.35;
  bangs.scale.set(1.05, 0.85, 0.3);
  headGroup.add(bangs);

  // 长侧发
  for (const side of [-1, 1]) {
    const sideHair = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.13, 0.62, 8, 16),
      hairMat
    );
    sideHair.position.set(side * 0.31, -0.27, -0.02);
    sideHair.rotation.z = side * -0.08;
    sideHair.scale.set(0.72, 1.05, 0.62);
    headGroup.add(sideHair);
  }

  // 橙色发夹
  for (const offset of [0, 0.09]) {
    const clip = new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 12, 10),
      clipMat
    );
    clip.position.set(-0.31, 0.23 - offset, 0.18);
    headGroup.add(clip);
  }

  // 眼睛
  const eyesGroup = new THREE.Group();
  eyesGroup.position.y = 0.1;
  eyesGroup.position.z = 0.28;
  headGroup.add(eyesGroup);

  const eyePairs = [];
  for (const side of [-1, 1]) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.x = side * 0.12;

    // 眼白
    const sclera = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 8),
      scleraMat
    );
    sclera.scale.set(1.1, 0.7, 0.5);
    eyeGroup.add(sclera);

    // 瞳孔
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 6),
      pupilMat
    );
    pupil.position.z = 0.04;
    pupil.name = side === -1 ? 'pupil-left' : 'pupil-right';
    eyeGroup.add(pupil);
    eyePairs.push({ group: eyeGroup, pupil });

    eyesGroup.add(eyeGroup);
  }

  // 眉毛
  for (const side of [-1, 1]) {
    const browGeo = new THREE.BoxGeometry(0.1, 0.02, 0.03);
    const brow = new THREE.Mesh(browGeo, hairMat);
    brow.position.set(side * 0.12, 0.17, 0.29);
    brow.rotation.z = side * 0.08;
    headGroup.add(brow);
  }

  // 鼻子
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 6),
    skinDarkMat
  );
  nose.position.set(0, 0.05, 0.32);
  nose.scale.set(0.8, 0.6, 0.5);
  headGroup.add(nose);

  // 嘴巴
  const mouthGeo = new THREE.TorusGeometry(0.06, 0.012, 6, 10, Math.PI);
  const mouth = new THREE.Mesh(mouthGeo, new THREE.MeshStandardMaterial({
    color: '#c47060',
    roughness: 0.3,
    metalness: 0,
  }));
  mouth.position.set(0, -0.02, 0.32);
  mouth.rotation.z = Math.PI;
  mouth.rotation.y = Math.PI;
  mouth.scale.set(1.2, 0.5, 1);
  headGroup.add(mouth);

  // 腮红
  for (const side of [-1, 1]) {
    const cheek = new THREE.Mesh(
      new THREE.CircleGeometry(0.055, 16),
      new THREE.MeshBasicMaterial({
        color: '#f58fa0',
        transparent: true,
        opacity: 0.24,
      })
    );
    cheek.position.set(side * 0.22, 0.015, 0.337);
    headGroup.add(cheek);
  }

  character.add(headGroup);
  scene.add(character);
  character.visible = false;  // 加载期间隐藏简模

  // ---- 粒子装饰（角色周围淡紫微光） ----
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = 80;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.0 + Math.random() * 1.6;
    const height = (Math.random() - 0.5) * 2.2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.6 - 0.2;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({
    color: '#d4b8f0',
    size: 0.025,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // ---- 正式 GLB 模型状态 ----
  const modelStatus = document.getElementById('modelStatus');
  let activeCharacter = character;
  let activeBodyParts = bodyParts;
  let clickTargets = Object.values(bodyParts);
  let activeEyePairs = eyePairs;
  let animationMixer = null;
  let stopActiveReaction = null;
  const clock = new THREE.Clock();

  Object.values(activeBodyParts).forEach((part) => {
    part.userData.followBaseRotation = part.rotation.clone();
  });

  function updateModelStatus(message, state = '') {
    if (!modelStatus) return;
    modelStatus.textContent = message;
    modelStatus.classList.toggle('is-error', state === 'error');
    modelStatus.classList.remove('is-hidden');
  }

  function hideModelStatus(delay = 900) {
    if (!modelStatus) return;
    window.setTimeout(() => modelStatus.classList.add('is-hidden'), delay);
  }

  function findModelNode(root, patterns) {
    let match = null;
    root.traverse((node) => {
      if (match) return;
      const normalizedName = node.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (patterns.some((pattern) => pattern.test(normalizedName))) {
        match = node;
      }
    });
    return match;
  }

  function createHitProxy(group, name, geometry, position) {
    const proxy = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    proxy.position.copy(position);
    proxy.name = name;
    proxy.userData.interactionPart = name;
    proxy.renderOrder = -1;
    group.add(proxy);
    return proxy;
  }

  function buildInteractionRig(pivot, avatarRoot) {
    const mappedParts = {
      head: findModelNode(avatarRoot, [/^head$/]) || findModelNode(avatarRoot, [/neck/]) || avatarRoot,
      face: findModelNode(avatarRoot, [/^head$/]) || avatarRoot,
      body: findModelNode(avatarRoot, [/spine02/, /spine2/, /upperchest/, /chest/]) || avatarRoot,
      stomach: findModelNode(avatarRoot, [/spine01/, /spine1/, /waist/, /abdomen/, /belly/]) || avatarRoot,
      'left-shoulder': findModelNode(avatarRoot, [/^lupperarm$/, /leftupperarm/]) || findModelNode(avatarRoot, [/lclavicle/]) || avatarRoot,
      'right-shoulder': findModelNode(avatarRoot, [/^rupperarm$/, /rightupperarm/]) || findModelNode(avatarRoot, [/rclavicle/]) || avatarRoot,
      'left-elbow': findModelNode(avatarRoot, [/lforearm$/, /leftforearm/, /leftlowerarm/]) || avatarRoot,
      'right-elbow': findModelNode(avatarRoot, [/rforearm$/, /rightforearm/, /rightlowerarm/]) || avatarRoot,
      'left-hand': findModelNode(avatarRoot, [/lhand/, /lefthand/]) || avatarRoot,
      'right-hand': findModelNode(avatarRoot, [/rhand/, /righthand/]) || avatarRoot,
      hips: findModelNode(avatarRoot, [/^pelvis$/, /^hip$/, /^hips$/]) || avatarRoot,
      'left-hip': findModelNode(avatarRoot, [/lthigh$/, /leftthigh/, /leftupperleg/]) || avatarRoot,
      'right-hip': findModelNode(avatarRoot, [/rthigh$/, /rightthigh/, /rightupperleg/]) || avatarRoot,
      'left-knee': findModelNode(avatarRoot, [/lcalf$/, /leftcalf/, /leftlowerleg/, /leftshin/]) || avatarRoot,
      'right-knee': findModelNode(avatarRoot, [/rcalf$/, /rightcalf/, /rightlowerleg/, /rightshin/]) || avatarRoot,
      'left-foot': findModelNode(avatarRoot, [/lfoot/, /leftfoot/, /lefttoe/]) || avatarRoot,
      'right-foot': findModelNode(avatarRoot, [/rfoot/, /rightfoot/, /righttoe/]) || avatarRoot,
    };

    Object.values(mappedParts).forEach((part) => {
      if (!part.userData.followBaseRotation) {
        part.userData.followBaseRotation = part.rotation.clone();
      }
    });

    const hitAreaGroup = new THREE.Group();
    hitAreaGroup.name = 'interaction-hit-areas';
    pivot.add(hitAreaGroup);

    const proxies = [
      createHitProxy(hitAreaGroup, 'head', new THREE.SphereGeometry(0.28, 16, 12), new THREE.Vector3(0, 1.48, 0.18)),
      createHitProxy(hitAreaGroup, 'face', new THREE.SphereGeometry(0.22, 16, 12), new THREE.Vector3(0, 1.3, 0.35)),
      createHitProxy(hitAreaGroup, 'left-shoulder', new THREE.SphereGeometry(0.26, 14, 10), new THREE.Vector3(-0.48, 0.72, 0)),
      createHitProxy(hitAreaGroup, 'right-shoulder', new THREE.SphereGeometry(0.26, 14, 10), new THREE.Vector3(0.48, 0.72, 0)),
      createHitProxy(hitAreaGroup, 'left-hand', new THREE.SphereGeometry(0.22, 14, 10), new THREE.Vector3(-0.52, -0.05, 0.12)),
      createHitProxy(hitAreaGroup, 'right-hand', new THREE.SphereGeometry(0.22, 14, 10), new THREE.Vector3(0.52, -0.05, 0.12)),
      createHitProxy(hitAreaGroup, 'body', new THREE.BoxGeometry(0.82, 0.6, 0.52), new THREE.Vector3(0, 0.52, 0)),
      createHitProxy(hitAreaGroup, 'stomach', new THREE.SphereGeometry(0.36, 14, 10), new THREE.Vector3(0, 0.04, 0.1)),
      createHitProxy(hitAreaGroup, 'left-leg', new THREE.CapsuleGeometry(0.2, 0.62, 6, 12), new THREE.Vector3(-0.2, -0.72, 0.04)),
      createHitProxy(hitAreaGroup, 'right-leg', new THREE.CapsuleGeometry(0.2, 0.62, 6, 12), new THREE.Vector3(0.2, -0.72, 0.04)),
      createHitProxy(hitAreaGroup, 'left-foot', new THREE.SphereGeometry(0.29, 14, 10), new THREE.Vector3(-0.2, -1.5, 0.22)),
      createHitProxy(hitAreaGroup, 'right-foot', new THREE.SphereGeometry(0.29, 14, 10), new THREE.Vector3(0.2, -1.5, 0.22)),
    ];

    return { mappedParts, proxies };
  }

  function fitAvatarToFullBody(avatarRoot) {
    avatarRoot.scale.setScalar(3.5);
    avatarRoot.rotation.y = -Math.PI * 0.5;
    avatarRoot.position.set(0, -1.75, 0);
  }

  function loadProductionAvatar(attempt = 1) {
    const loader = new GLTFLoader();
    // Draco 解压支持
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./js/vendor/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    updateModelStatus(attempt === 1 ? 'Loading 3D character...' : 'Retrying 3D character...');

    loader.load(
      'images/HOME/完美娃娃-web.glb',
      (gltf) => {
        if (fallbackImage) fallbackImage.classList.remove('is-visible');
        canvas.classList.remove('is-hidden');
        if (interactHint) interactHint.classList.remove('is-hidden');
        if (easterEggHint) easterEggHint.classList.remove('is-hidden');

        const pivot = new THREE.Group();
        pivot.name = 'yenan-avatar-pivot';

        const avatarRoot = gltf.scene;
        avatarRoot.name = avatarRoot.name || 'yenan-avatar';
        fitAvatarToFullBody(avatarRoot);
        avatarRoot.traverse((node) => {
          if (!node.isMesh) return;
          node.castShadow = true;
          node.receiveShadow = true;
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.filter(Boolean).forEach((material) => {
            material.transparent = false;
            material.needsUpdate = true;
          });
        });

        pivot.add(avatarRoot);
        scene.add(pivot);

        const rig = buildInteractionRig(pivot, avatarRoot);
        activeCharacter = pivot;
        activeBodyParts = rig.mappedParts;
        clickTargets = rig.proxies;
        activeEyePairs = [];

        if (gltf.animations.length > 0) {
          animationMixer = new THREE.AnimationMixer(avatarRoot);
          const idleClip = gltf.animations.find((clip) => /idle/i.test(clip.name)) || gltf.animations[0];
          animationMixer.clipAction(idleClip).play();
        }

        character.visible = false;
        updateModelStatus('3D character ready');
        hideModelStatus();
        // 隐藏 loading spinner
        var spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.add('is-hidden');
      },
      undefined,
      () => {
        dracoLoader.dispose();

        if (attempt < 3) {
          window.setTimeout(() => loadProductionAvatar(attempt + 1), 1200);
          return;
        }

        // 连续加载失败后展示与正式角色一致的静态正面图。
        character.visible = false;
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.add('is-hidden');
        canvas.classList.add('is-hidden');
        if (fallbackImage) fallbackImage.classList.add('is-visible');
        if (interactHint) interactHint.classList.add('is-hidden');
        if (easterEggHint) easterEggHint.classList.add('is-hidden');
        updateModelStatus('Static character preview');
        hideModelStatus(0);
      }
    );
  }

  function buildFallbackHitRig() {
    const hitAreaGroup = new THREE.Group();
    hitAreaGroup.name = 'fallback-interaction-hit-areas';
    character.add(hitAreaGroup);

    return [
      createHitProxy(hitAreaGroup, 'head', new THREE.SphereGeometry(0.28, 16, 12), new THREE.Vector3(0, 1.34, 0.24)),
      createHitProxy(hitAreaGroup, 'face', new THREE.SphereGeometry(0.22, 16, 12), new THREE.Vector3(0, 1.0, 0.4)),
      createHitProxy(hitAreaGroup, 'left-shoulder', new THREE.SphereGeometry(0.28, 14, 10), new THREE.Vector3(-0.54, 0.22, 0)),
      createHitProxy(hitAreaGroup, 'right-shoulder', new THREE.SphereGeometry(0.28, 14, 10), new THREE.Vector3(0.54, 0.22, 0)),
      createHitProxy(hitAreaGroup, 'left-hand', new THREE.SphereGeometry(0.22, 14, 10), new THREE.Vector3(-0.54, -0.96, 0.02)),
      createHitProxy(hitAreaGroup, 'right-hand', new THREE.SphereGeometry(0.22, 14, 10), new THREE.Vector3(0.54, -0.96, 0.02)),
      createHitProxy(hitAreaGroup, 'body', new THREE.BoxGeometry(0.9, 0.56, 0.62), new THREE.Vector3(0, 0.18, 0)),
      createHitProxy(hitAreaGroup, 'stomach', new THREE.SphereGeometry(0.4, 14, 10), new THREE.Vector3(0, -0.36, 0.06)),
      createHitProxy(hitAreaGroup, 'left-leg', new THREE.CapsuleGeometry(0.19, 0.75, 6, 12), new THREE.Vector3(-0.24, -1.38, 0.06)),
      createHitProxy(hitAreaGroup, 'right-leg', new THREE.CapsuleGeometry(0.19, 0.75, 6, 12), new THREE.Vector3(0.24, -1.38, 0.06)),
      createHitProxy(hitAreaGroup, 'left-foot', new THREE.SphereGeometry(0.34, 14, 10), new THREE.Vector3(-0.24, -2.12, 0.34)),
      createHitProxy(hitAreaGroup, 'right-foot', new THREE.SphereGeometry(0.34, 14, 10), new THREE.Vector3(0.24, -2.12, 0.34)),
    ];
  }

  clickTargets = [];
  loadProductionAvatar();

  // 慢速网络只更新提示，绝不切换到简陋人偶。
  setTimeout(function () {
    var spinner = document.getElementById('loadingSpinner');
    if (spinner && !spinner.classList.contains('is-hidden')) {
      updateModelStatus('Still loading 3D character...');
    }
  }, 30000);

  // ---- 鼠标交互 ----
  const mouse = new THREE.Vector2();
  const mouseTarget = new THREE.Vector2();  // 平滑跟随
  let mouseOnCharacter = false;

  // Raycaster 用于点击检测
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.1;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseTarget.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseOnCharacter = true;

    raycaster.setFromCamera(mouseTarget, camera);
    var hoveredPart = raycaster.intersectObjects(clickTargets, true)[0];
    canvas.style.cursor = hoveredPart ? 'pointer' : 'grab';
  });

  container.addEventListener('mouseleave', () => {
    mouseTarget.set(0, 0);
    mouseOnCharacter = false;
    canvas.style.cursor = 'grab';
  });

  // 点击检测
  container.addEventListener('click', (e) => {

    const rect = container.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);

    // 检测身体部位
    const intersects = raycaster.intersectObjects(clickTargets, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.userData.interactionPart && !obj.name) {
        obj = obj.parent;
      }
      const partName = obj ? (obj.userData.interactionPart || obj.name) : null;
      if (partName) {
        triggerReaction(partName);
      }
    }
  });

  function triggerReaction(partName) {
    if (stopActiveReaction) stopActiveReaction();

    // GLB model has avatarRoot.rotation.y = -π/2, so visual left/right
    // is swapped relative to the skeleton bone names. Compensate here.
    var lookupName = partName;
    if (activeCharacter !== character) {
      var swapMap = {
        'left-shoulder': 'right-shoulder',
        'right-shoulder': 'left-shoulder',
        'left-hand': 'right-hand',
        'right-hand': 'left-hand',
        'left-leg': 'right-leg',
        'right-leg': 'left-leg',
        'left-foot': 'right-foot',
        'right-foot': 'left-foot',
      };
      lookupName = swapMap[partName] || partName;
    }

    // Map click target name to the body part to shake
    var partMap = {
      'head': activeBodyParts.head,
      'face': activeBodyParts.head,
      'body': activeBodyParts.body,
      'stomach': activeBodyParts.stomach || activeBodyParts.body,
      'left-shoulder': activeBodyParts['left-shoulder'],
      'right-shoulder': activeBodyParts['right-shoulder'],
      'left-hand': activeBodyParts['left-hand'],
      'right-hand': activeBodyParts['right-hand'],
      'left-leg': activeBodyParts['left-hip'],
      'right-leg': activeBodyParts['right-hip'],
      'left-foot': activeBodyParts['left-foot'],
      'right-foot': activeBodyParts['right-foot'],
    };
    var part = partMap[lookupName];
    if (!part) return;

    // Left-side parts shake one way, right-side the opposite
    var direction = partName.indexOf('left') === 0 ? -1 :
                    partName.indexOf('right') === 0 ? 1 : 0;

    var originalRotation = part.rotation.clone();
    var startTime = performance.now();
    var duration = 450;
    var frameId = 0;

    function restoreShake() {
      cancelAnimationFrame(frameId);
      part.rotation.copy(originalRotation);
      stopActiveReaction = null;
    }

    stopActiveReaction = restoreShake;

    function animateShake(now) {
      var elapsed = now - startTime;
      var t = Math.min(elapsed / duration, 1);
      // Gentle damped oscillation: 5 half-cycles, amplitude 0.06 rad
      var shake = Math.sin(t * Math.PI * 5) * (1 - t) * 0.06;

      part.rotation.copy(originalRotation);
      part.rotation.z += direction !== 0 ? shake * direction : shake;

      if (t < 1) {
        frameId = requestAnimationFrame(animateShake);
      } else {
        restoreShake();
      }
    }

    frameId = requestAnimationFrame(animateShake);
  }

  // ---- 渲染循环 ----
  function animate() {
    requestAnimationFrame(animate);

    // 平滑鼠标
    mouse.lerp(mouseTarget, 0.12);

    if (animationMixer) animationMixer.update(clock.getDelta());

    // 身体跟随鼠标转动，幅度加大
    const targetRotY = mouseOnCharacter ? mouse.x * 0.30 : 0;
    const targetRotX = mouseOnCharacter ? mouse.y * 0.12 : 0;

    if (!stopActiveReaction) {
      activeCharacter.rotation.y += (targetRotY - activeCharacter.rotation.y) * 0.10;
      activeCharacter.rotation.x += (targetRotX - activeCharacter.rotation.x) * 0.10;
    }

    // 头部跟随（比身体更灵敏）
    const activeHead = activeBodyParts.head;
    if (activeHead && !stopActiveReaction) {
      const baseRotation = activeHead.userData.followBaseRotation || new THREE.Euler();
      const headTargetY = baseRotation.y + (mouseOnCharacter ? mouse.x * 0.45 : 0);
      const headTargetX = baseRotation.x + (mouseOnCharacter ? mouse.y * 0.28 : 0);
      activeHead.rotation.y += (headTargetY - activeHead.rotation.y) * 0.12;
      activeHead.rotation.x += (headTargetX - activeHead.rotation.x) * 0.12;
    }

    // 瞳孔跟踪（范围加大，更灵敏）
    const lookX = mouseOnCharacter ? mouse.x * 0.14 : 0;
    const lookY = mouseOnCharacter ? mouse.y * 0.10 : 0;
    activeEyePairs.forEach(({ group }) => {
      group.children.forEach(child => {
        if (child.name && child.name.startsWith('pupil')) {
          child.position.x = lookX;
          child.position.y = lookY;
        }
      });
    });

    // 粒子缓慢旋转
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    renderer.render(scene, camera);
  }

  animate();

  // ---- 响应式处理 ----
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  });

  // 暴露引用
  window.__threeCharacter = {
    get character() { return activeCharacter; },
    get bodyParts() { return activeBodyParts; },
    scene,
    camera,
    triggerReaction,
    setEasterLighting,
  };
})();


// ============================================================
//  背景飘浮彩带
// ============================================================

(function initRibbons() {
  const container = document.getElementById('ribbonsContainer');
  if (!container) return;

  const colors = [
    '#a9d9ed', '#dff1f7', '#f8d2dc', '#f4b8c7',
    '#c3db7f', '#e9f1c9', '#fff0ab', '#eadff4',
  ];

  const ribbonCount = window.innerWidth < 768 ? 16 : 26;

  for (let i = 0; i < ribbonCount; i++) {
    const ribbon = document.createElement('div');
    ribbon.className = 'ribbon';

    // 随机尺寸
    const width = 4 + Math.random() * 7;
    const height = 18 + Math.random() * 34;

    // 随机位置
    const leftPos = Math.random() * 100;        // 0-100%

    // 随机动画参数
    const duration = 11 + Math.random() * 16;
    const delay = Math.random() * duration;      // 错开启动
    const drift = (Math.random() - 0.5) * 120;  // 水平飘移距离（px）
    const spin = (Math.random() - 0.5) * 360;   // 旋转角度

    ribbon.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      left: ${leftPos}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      --drift: ${drift}px;
      --spin: ${spin}deg;
    `;

    container.appendChild(ribbon);

    // 动画结束后重新生成（保持持续飘浮）
    ribbon.addEventListener('animationend', () => {
      ribbon.style.left = Math.random() * 100 + '%';
      ribbon.style.background = colors[Math.floor(Math.random() * colors.length)];
      ribbon.style.animationDuration = (12 + Math.random() * 20) + 's';
      ribbon.style.animationDelay = '0s';
      ribbon.style.setProperty('--drift', (Math.random() - 0.5) * 120 + 'px');
      ribbon.style.setProperty('--spin', (Math.random() - 0.5) * 360 + 'deg');
    });
  }

  const scrollContainer = document.getElementById('scrollContainer');
  const projectsSection = document.getElementById('projects');
  let visibilityFrame = 0;

  function syncRibbonVisibility() {
    visibilityFrame = 0;
    if (!scrollContainer || !projectsSection) return;
    const cutoff = projectsSection.offsetTop - window.innerHeight * 0.35;
    container.classList.toggle('is-hidden', scrollContainer.scrollTop >= cutoff);
  }

  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', function () {
      if (visibilityFrame) return;
      visibilityFrame = window.requestAnimationFrame(syncRibbonVisibility);
    }, { passive: true });
  }
  window.addEventListener('resize', syncRibbonVisibility);
  syncRibbonVisibility();
})();


// ============================================================
//  彩蛋系统 — 撕碎所有标签触发
// ============================================================

function triggerEasterEgg() {
  var overlay = document.getElementById('easterEggOverlay');
  var lidTop = document.getElementById('blinkLidTop');
  var lidBottom = document.getElementById('blinkLidBottom');
  var countdownDisplay = document.getElementById('countdownDisplay');
  var pullChain = document.getElementById('pullChain');
  var canvas = document.getElementById('threeCanvas');
  var ribbons = document.getElementById('ribbonsContainer');
  var charContainer = document.getElementById('characterContainer');

  if (!overlay || overlay.classList.contains('active')) return;
  overlay.classList.add('active');

  // ---- 粉尘粒子 ----
  var particleColors = [
    '#c8b0f0', '#a78bfa', '#b99af5', '#d2b5f2', '#eca1ca',
    '#e1c3e8', '#d4a8dd', '#f0b8d4', '#b890e8', '#c9a8f0',
  ];

  function burstParticles(callback) {
    if (!charContainer) { if (callback) callback(); return; }
    var rect = countdownDisplay.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var containerRect = charContainer.getBoundingClientRect();
    var relX = cx - containerRect.left;
    var relY = cy - containerRect.top;
    var count = 50 + Math.floor(Math.random() * 20);

    for (let i = 0; i < count; i++) {
      let p = document.createElement('span');
      p.className = 'countdown-particle';
      var angle = Math.random() * Math.PI * 2;
      var dist = 60 + Math.random() * 200;
      var px = Math.cos(angle) * dist;
      var py = Math.sin(angle) * dist;
      var size = 2 + Math.random() * 8;
      p.style.cssText =
        'left:' + relX + 'px;' +
        'top:' + relY + 'px;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'background:' + particleColors[Math.floor(Math.random() * particleColors.length)] + ';' +
        '--px:' + px + 'px;' +
        '--py:' + py + 'px;' +
        'animation-duration:' + (0.55 + Math.random() * 0.5) + 's';
      charContainer.appendChild(p);
      p.addEventListener('animationend', function () { p.remove(); });
    }
    if (callback) setTimeout(callback, 150);
  }

  // ---- 5秒倒计时 ----
  var count = 5;
  countdownDisplay.textContent = count;
  countdownDisplay.classList.add('show', 'pop');
  setTimeout(function () { countdownDisplay.classList.remove('pop'); }, 350);

  function nextCount() {
    count--;
    if (count <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.classList.remove('show');
      burstParticles(function () {
        countdownDisplay.textContent = '';
        startBlinkAndDarkMode();
      });
    } else {
      burstParticles(function () {
        countdownDisplay.textContent = count;
        countdownDisplay.classList.remove('pop');
        void countdownDisplay.offsetWidth;
        countdownDisplay.classList.add('pop');
        setTimeout(function () { countdownDisplay.classList.remove('pop'); }, 350);
      });
    }
  }

  var countdownInterval = setInterval(nextCount, 1000);

  function startBlinkAndDarkMode() {
    // 眨眼：上下眼睑闭合
    lidTop.classList.add('closing');
    lidBottom.classList.add('closing');

    // 闭合后保持 .38s，进入暗黑模式
    setTimeout(function () {
      overlay.classList.add('dark');
      overlay.style.setProperty('background',
        'radial-gradient(circle 130px at 50% 50%, transparent 0%, rgba(2,2,8,.94) 100%)');
      // 提升 canvas 到遮罩之上：改为 fixed 定位
      if (canvas) {
        var rect = canvas.getBoundingClientRect();
        canvas._origPosition = canvas.style.position;
        canvas._origZIndex = canvas.style.zIndex;
        canvas._origTop = canvas.style.top;
        canvas._origLeft = canvas.style.left;
        canvas._origWidth = canvas.style.width;
        canvas._origHeight = canvas.style.height;
        canvas.style.position = 'fixed';
        canvas.style.top = rect.top + 'px';
        canvas.style.left = rect.left + 'px';
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        canvas.style.zIndex = '10000';
        canvas.classList.add('is-easter-lit');
      }
      if (window.__threeCharacter && window.__threeCharacter.setEasterLighting) {
        window.__threeCharacter.setEasterLighting(true);
      }
      if (ribbons) ribbons.style.display = 'none';

      // 生成暗黑粒子
      spawnDarkParticles();

      // 眼睑重新拉开（移除 class，CSS transition 自动恢复）
      lidTop.classList.remove('closing');
      lidBottom.classList.remove('closing');
    }, 380);
  }

  // ---- 暗黑粒子 ----
  function spawnDarkParticles() {
    var container = document.getElementById('darkParticles');
    if (!container) return;
    container.innerHTML = '';

    var particleColors = [
      '#c8b0f0', '#d4b8f0', '#b890e8', '#eca1ca',
      '#f0b8d4', '#d2b5f2', '#e1c3e8', '#b99af5',
    ];

    var charRect = charContainer.getBoundingClientRect();
    var cx = charRect.left + charRect.width / 2;
    var cy = charRect.top + charRect.height / 2;
    var spreadX = charRect.width * 0.75;
    var spreadY = charRect.height * 0.7;

    for (let i = 0; i < 45; i++) {
      let p = document.createElement('span');
      p.className = 'dark-particle';
      var size = 2 + Math.random() * 5;
      var x = cx + (Math.random() - 0.5) * spreadX;
      var y = cy + (Math.random() - 0.5) * spreadY;
      p.style.cssText =
        'left:' + x + 'px;' +
        'top:' + y + 'px;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'background:' + particleColors[Math.floor(Math.random() * particleColors.length)] + ';' +
        'box-shadow: 0 0 ' + (3 + Math.random() * 6) + 'px ' + particleColors[Math.floor(Math.random() * particleColors.length)] + ';' +
        'animation-delay:' + (Math.random() * 6) + 's;' +
        'animation-duration:' + (5 + Math.random() * 7) + 's';
      container.appendChild(p);
    }
  }

  function clearDarkParticles() {
    var container = document.getElementById('darkParticles');
    if (container) container.innerHTML = '';
  }

  // ---- 鼠标聚光灯 ----
  function updateSpotlight(e) {
    if (!overlay.classList.contains('dark')) return;
    var x = (e.clientX / window.innerWidth) * 100;
    var y = (e.clientY / window.innerHeight) * 100;
    overlay.style.setProperty('background',
      'radial-gradient(circle 130px at ' + x + '% ' + y + '%, transparent 0%, rgba(2,2,8,.94) 100%)');
  }
  document.addEventListener('mousemove', updateSpotlight);

  // ---- 拉绳开关 ----
  if (pullChain) {
    pullChain.addEventListener('click', function (e) {
      e.stopPropagation();
      restoreNormalMode();
    });
  }

  function restoreNormalMode() {
    // 反向 blink：眼睑闭合
    lidTop.classList.add('closing');
    lidBottom.classList.add('closing');

    setTimeout(function () {
      overlay.classList.remove('dark', 'active');
      overlay.style.removeProperty('background');
      // 还原 canvas 定位
      if (canvas && canvas._origPosition !== undefined) {
        canvas.style.position = canvas._origPosition;
        canvas.style.zIndex = canvas._origZIndex;
        canvas.style.top = canvas._origTop;
        canvas.style.left = canvas._origLeft;
        canvas.style.width = canvas._origWidth;
        canvas.style.height = canvas._origHeight;
        canvas.classList.remove('is-easter-lit');
      }
      if (window.__threeCharacter && window.__threeCharacter.setEasterLighting) {
        window.__threeCharacter.setEasterLighting(false);
      }
      if (ribbons) ribbons.style.removeProperty('display');
      document.removeEventListener('mousemove', updateSpotlight);
      clearDarkParticles();

      // 眼睑重新拉开
      lidTop.classList.remove('closing');
      lidBottom.classList.remove('closing');

      // 重置所有标签，回到初始状态，可重新撕碎触发彩蛋
      if (window.__resetAllTags) window.__resetAllTags();

      // 等 blink 眼睑拉开后，自动下滑到 About Me
      setTimeout(function () {
        var aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 600);
    }, 400);
  }
}


// ============================================================
//  Internship — 实习旅程
// ============================================================

var INTERNSHIP_CARDS = [
  {
    id: 'keendata',
    company: 'Keendata',
    role: 'Data Development Intern',
    period: 'APR 2025 - AUG 2025',
    location: 'Shenzhen, Guangdong',
    image: 'images/Internship/卡片1.jpg',
    aboutImage: 'images/About me/照片3.png',
    logo: 'images/About me/Keendata.png',
    summary: 'Supported big data platform development, system deployment, and project delivery processes, combining software engineering practice with cross-functional collaboration.',
    tags: ['Big Data', 'Java Development', 'Hadoop', 'Bug Management'],
    responsibilities: [
      'Assisted in Hadoop cluster deployment and environment configuration, standardizing deployment workflows and documenting technical procedures',
      'Developed a Java-based internal notification module, including implementation, testing, and validation to support system communication requirements',
      'Supported customized project delivery by tracking 20+ system-level issues, coordinating bug verification, packaging, deployment, and release processes',
      'Collaborated with technical teams to troubleshoot system problems, maintain issue records, and ensure closed-loop defect resolution'
    ],
    methods: [
      'Java development and backend module implementation',
      'Hadoop cluster deployment and environment configuration',
      'Bug tracking, troubleshooting, and release validation',
      'Technical documentation and workflow standardization',
      'Cross-team communication and project progress tracking'
    ],
    highlights: [
      'Delivered a Java-based notification module from development to validation, ensuring successful feature integration',
      'Created standardized deployment documentation to improve environment setup efficiency and knowledge transfer',
      'Supported resolution of 20+ system-level issues, improving delivery quality through structured defect tracking and verification'
    ]
  },
  {
    id: 'xgrids',
    company: 'XGRIDS',
    role: 'Project Management Intern',
    period: 'JAN 2026 - MAY 2026',
    location: 'Shenzhen, Guangdong',
    image: 'images/Internship/卡片2.jpg',
    aboutImage: 'images/About me/照片5.png',
    logo: 'images/About me/XGRIDS.png',
    summary: 'Supported agile delivery, AI-driven process optimization, and software-hardware integrated product iteration for 3D reconstruction solutions.',
    tags: ['Agile Delivery', 'AI Automation', '3D Reconstruction', 'Project Management'],
    responsibilities: [
      'Supported agile iteration and delivery management for a software-hardware integrated 3D reconstruction handheld scanning product, tracking requirements, development progress, and release milestones',
      'Coordinated cross-functional collaboration among R&D, product, algorithm, hardware, and testing teams, ensuring alignment throughout the product lifecycle',
      'Managed 30+ core requirements across product iterations, supporting requirement review, prioritization, scheduling, testing, and release processes',
      'Conducted Bug tracking analysis and defect management, identifying issue patterns and improving team workflow efficiency through data-driven insights',
      'Leveraged AI tools to optimize project workflows and explore intelligent solutions for risk alerts, automated scheduling, and project status management'
    ],
    methods: [
      'Agile/Scrum framework with iterative planning and milestone tracking',
      'Jira backlog management and requirement lifecycle tracking',
      'Cross-functional coordination between product, engineering, and testing teams',
      'Bug analysis, issue prioritization, and defect lifecycle management',
      'AI-assisted workflow optimization and automation exploration'
    ],
    highlights: [
      'Coordinated 5 cross-functional teams and supported end-to-end delivery of software-hardware integrated product iterations',
      'Tracked and managed 30+ requirements, improving requirement visibility and delivery coordination',
      'Applied AI tools and data analysis to optimize Bug management processes and enhance project execution efficiency',
      'Supported SOP refinement and established standardized workflows to improve R&D collaboration efficiency'
    ]
  },
  {
    id: 'chery',
    company: 'CHERY',
    role: 'Intelligent Driving Project Management Intern',
    period: 'JUN 2026 - PRESENT',
    location: 'Wuhu, Anhui',
    image: 'images/Internship/卡片3.jpg',
    aboutImage: 'images/About me/照片6.png',
    logo: 'images/About me/CHERY.png',
    summary: 'Supported Robotaxi project delivery, cross-functional coordination, and PMO process optimization for intelligent driving development.',
    tags: ['Intelligent Driving', 'PMO', 'Jira Management', 'Project Coordination'],
    responsibilities: [
      'Supported project planning and execution management for the Robotaxi intelligent driving project, tracking development milestones, schedules, and delivery progress',
      'Coordinated communication between R&D, testing, and engineering teams, organizing project meetings, following up action items, and ensuring cross-team alignment',
      'Managed Jira issue lifecycle, including requirement tracking, defect follow-up, and workflow monitoring to improve issue visibility and resolution efficiency',
      'Collaborated with quality teams to optimize Bug tracking processes, establish reminder mechanisms, and support closed-loop issue management',
      'Assisted in project resource management, including vehicle resource tracking, test resource coordination, and partial cost monitoring'
    ],
    methods: [
      'Jira workflow management and issue lifecycle tracking',
      'Project schedule management and milestone tracking',
      'Cross-functional communication and meeting coordination',
      'Resource tracking and risk identification',
      'Digital tools for project transparency and automated reminders'
    ],
    highlights: [
      'Supported delivery management of a Robotaxi intelligent driving project, improving visibility of development progress and key milestones',
      'Established structured tracking and reminder mechanisms for Jira issues, enhancing overdue issue management and escalation efficiency',
      'Maintained project resource tracking processes covering vehicle resources, testing resources, and delivery readiness',
      'Improved PMO collaboration efficiency through standardized reporting and cross-team coordination workflows'
    ]
  }
];

var currentInternshipState = 'cards'; // cards | detail

function initInternshipJourney() {
  var stage = document.getElementById('internshipStage');
  var cardsContainer = document.getElementById('internshipCards');
  var detailContainer = document.getElementById('internshipDetail');
  if (!stage || !cardsContainer) return;
  if (stage.dataset.internshipReady === 'true') return;
  stage.dataset.internshipReady = 'true';

  // ---- 预加载图片 ----
  preloadInternshipImages();

  // ---- 构建卡片 ----
  buildInternshipCards(cardsContainer);

  // ---- 直接展示卡片，不再经过 intro → tearing → cards ----
  stage.classList.remove('is-intro', 'is-tearing', 'is-detail', 'is-opening-detail');
  stage.classList.add('is-cards');
  currentInternshipState = 'cards';
  cardsContainer.querySelectorAll('.internship-card').forEach(function (card) {
    card.classList.add('is-flipped');
  });

  // ---- 卡片点击 → 详情 ----
  cardsContainer.addEventListener('click', function (e) {
    var card = e.target.closest('.internship-card');
    if (!card) return;
    if (currentInternshipState !== 'cards') return;
    var cardId = card.getAttribute('data-card-id');
    if (cardId) {
      card.classList.add('is-flipping');
      openInternshipDetail(cardId, detailContainer, stage, card);
    }
  });

  // 键盘支持
  cardsContainer.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && currentInternshipState === 'cards') {
      var card = e.target.closest('.internship-card');
      if (card) {
        var cardId = card.getAttribute('data-card-id');
        if (cardId) {
          card.classList.add('is-flipping');
          openInternshipDetail(cardId, detailContainer, stage, card);
        }
      }
    }
  });
}

function preloadInternshipImages() {
  var images = ['images/Internship/主页面.jpg'];
  INTERNSHIP_CARDS.forEach(function (c) { images.push(c.image); });
  images.forEach(function (src) {
    var img = new Image();
    img.src = src;
  });
}

function buildInternshipCards(container) {
  if (!container) return;
  var html = '';
  INTERNSHIP_CARDS.forEach(function (cardData, index) {
    html += '<div class="internship-card" data-card-id="' + cardData.id + '" tabindex="0" role="button" aria-label="' + cardData.company + ' internship card">'
      + '<div class="internship-card-inner">'
      + '<div class="internship-card-front">'
      + '<img src="' + cardData.image + '" alt="' + cardData.company + ' internship card" loading="lazy">'
      + '<span class="card-front-number">' + String(index + 1).padStart(2, '0') + '</span>'
      + '</div>'
      + '<div class="internship-card-back">'
      + '<span class="card-back-kicker">Internship ' + String(index + 1).padStart(2, '0') + '</span>'
      + '<span class="card-back-company"><i data-lucide="building-2" class="card-back-company-icon" aria-hidden="true"></i>' + cardData.company + '</span>'
      + '<span class="card-back-role">' + cardData.role + '</span>'
      + '<span class="card-back-period">' + cardData.period + '</span>'
      + '<p class="card-back-summary">' + cardData.summary + '</p>'
      + '<div class="card-back-tags">'
      + cardData.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('')
      + '</div>'
      + '<span class="card-back-action">View Details <i data-lucide="arrow-right" class="card-back-action-icon" aria-hidden="true"></i></span>'
      + '</div>'
      + '</div>'
      + '</div>';
  });
  container.innerHTML = html;
  // 重新初始化 Lucide 图标
  if (window.lucide) lucide.createIcons();
}

function openInternshipDetail(cardId, detailContainer, stage, cardEl) {
  if (!detailContainer || !stage) return;
  var cardData = INTERNSHIP_CARDS.find(function (c) { return c.id === cardId; });
  if (!cardData) return;

  currentInternshipState = 'detail';
  stage.classList.remove('is-cards');
  stage.classList.add('is-detail');
  // is-opening-detail 在 HTML 渲染后再加上，触发翻转进场动画

  // 卡片翻转动画播放 200ms 后渲染 detail 内容
  var cardIndex = INTERNSHIP_CARDS.findIndex(function (c) { return c.id === cardId; });
  setTimeout(function () {
    var aboutImg = cardData.aboutImage || cardData.image;
    var logoHTML = cardData.logo
      ? '<span class="card-logo-wrap"><img src="' + cardData.logo + '" alt="" class="card-logo"></span>'
      : '<span class="card-icon-wrap"><i data-lucide="building-2" class="card-head-icon"></i></span>';
    var tagsHTML = cardData.tags.map(function (t) { return '<span class="card-tag">' + t + '</span>'; }).join('');

    var html = '<div class="internship-detail-card">'
      + '<div class="card-image-wrap">'
      + '<img src="' + aboutImg + '" alt="' + cardData.company + '">'
      + '<span class="card-number">' + String(cardIndex + 1).padStart(2, '0') + '</span>'
      + '</div>'
      + '<div class="card-body">'
      + '<div class="card-head">' + logoHTML
      + '<div><h3 class="card-title">' + cardData.company + '</h3>'
      + '<p class="card-subtitle">' + cardData.role + '</p></div>'
      + '</div>'
      + '<div class="card-items">' + tagsHTML + '</div>'
      + '</div>'
      + '<button class="internship-card-back-btn" id="internshipBackBtn"><i data-lucide="arrow-left" class="detail-back-icon" aria-hidden="true"></i> Back to Journey</button>'
      + '</div>'
      + '<div class="internship-detail-panel">'
      + '<span class="detail-company"><i data-lucide="building-2" class="detail-company-icon" aria-hidden="true"></i>' + cardData.company + '</span>'
      + '<div class="detail-role-period">'
      + '<span class="detail-role">' + cardData.role + '</span>'
      + '<span class="detail-period">' + cardData.period + '</span>'
      + '</div>'
      + '<span class="detail-location"><i data-lucide="map-pin" style="width:.6rem;height:.6rem"></i> ' + cardData.location + '</span>'
      + '<p class="detail-summary">' + cardData.summary + '</p>'
      + '<div class="detail-tags">' + cardData.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>'
      + '<div class="detail-section"><h4><i data-lucide="clipboard-list" class="detail-section-icon" aria-hidden="true"></i>Responsibilities</h4><ul>'
      + cardData.responsibilities.map(function (r) { return '<li>' + r + '</li>'; }).join('')
      + '</ul></div>'
      + '<div class="detail-section"><h4><i data-lucide="wrench" class="detail-section-icon" aria-hidden="true"></i>Tools & Methods</h4><ul>'
      + cardData.methods.map(function (m) { return '<li>' + m + '</li>'; }).join('')
      + '</ul></div>'
      + '<div class="detail-section"><h4><i data-lucide="sparkles" class="detail-section-icon" aria-hidden="true"></i>Highlights</h4><ul>'
      + cardData.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('')
      + '</ul></div>'
      + '</div>';

    detailContainer.innerHTML = html;
    // 渲染完 HTML 后触发翻转进场动画
    stage.classList.add('is-opening-detail');
    if (window.lucide) lucide.createIcons();

    // 返回按钮
    var backBtn = document.getElementById('internshipBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        closeInternshipDetail(detailContainer, stage);
      });
    }

    // 焦点移到返回按钮
    setTimeout(function () {
      if (backBtn) backBtn.focus();
    }, 100);
  }, 200);

  // 翻转动画收尾
  setTimeout(function () {
    stage.classList.remove('is-opening-detail');
    if (cardEl) cardEl.classList.remove('is-flipping');
  }, 820);
}

function closeInternshipDetail(detailContainer, stage) {
  if (!detailContainer || !stage) return;
  currentInternshipState = 'cards';
  stage.classList.remove('is-detail', 'is-opening-detail');
  stage.classList.add('is-cards');
  // 清除所有卡片的 is-flipping 状态
  var cards = document.querySelectorAll('.internship-card.is-flipping');
  for (var i = 0; i < cards.length; i++) { cards[i].classList.remove('is-flipping'); }
  detailContainer.innerHTML = '';
}

// ============================================================
//  Projects — Falling physics orbs
// ============================================================

var PROJECTS = [
  {
    id: 'robotaxi',
    title: 'Robotaxi Intelligent Driving',
    category: 'Technical',
    period: '2026',
    accent: '#8f7df4',
    state: 'pending',
    thumbnail: '',
    summary: 'A self-developed L4 Robotaxi intelligent driving system concept (placeholder).',
    description: 'A future L4 Robotaxi intelligent driving project placeholder, awaiting detailed content.',
    tags: ['Intelligent Driving', 'Robotaxi', 'VLA Model', 'Jira', 'PMO'],
    links: [],
    highlights: []
  },
  {
    id: 'ai-pm',
    title: 'AI-powered Project Management Platform',
    sceneTitle: 'AI Project Management',
    code: 'Project 01',
    category: 'Product Design',
    period: '2026',
    accent: '#e99ad6',
    state: 'active',
    thumbnail: '',
    tagline: 'An intelligent workflow system for improving project visibility and execution efficiency',
    summary: 'Designed a lightweight AI-powered project management platform to address challenges in project scheduling visibility, workflow complexity, and inefficient collaboration across PM, development, testing, and UI teams.',
    role: 'Product Manager / AI Solution Designer',
    description: 'Designed a lightweight AI-powered project management platform to address challenges in project scheduling visibility, workflow complexity, and inefficient collaboration across PM, development, testing, and UI teams.',
    status: 'MVP development and testing phase',
    techStack: ['AI Agent', 'Product Design', 'PMO', 'Workflow Automation'],
    tags: ['AI Agent', 'Product Design', 'PMO', 'Workflow Automation'],
    links: [],
    highlights: [
      'Conducted research with 17 R&D members and translated workflow pain points into product requirements and MVP roadmap',
      'Designed core data models connecting requirements, tasks, and Bugs, with a three-level permission system',
      'Proposed intelligent workflow mechanisms: project health indicators, drag-and-drop task boards with blocker alerts, automated escalation reminders for overdue tasks',
      'Designed AI Agent scenarios for risk prediction and schedule assistance, delay detection and notifications, and automated project reports and retrospectives'
    ]
  },
  {
    id: 'metafit',
    title: 'MetaFit — AI Fashion Recommendation & Virtual Try-on',
    sceneTitle: 'MetaFit Virtual Try-on',
    code: 'Project 02',
    category: 'Product Design',
    period: '2026',
    accent: '#7aa7e9',
    state: 'active',
    thumbnail: '',
    tagline: 'Combining LLM recommendation and AIGC virtual try-on for personalized shopping experiences',
    summary: 'Developed an end-to-end intelligent fashion system integrating LLM-based recommendation and AIGC virtual try-on to improve online shopping personalization and user experience.',
    role: 'Project Lead / AI Product Designer',
    description: 'Developed an end-to-end intelligent fashion system integrating LLM-based recommendation and AIGC virtual try-on to improve online shopping personalization and user experience.',
    status: 'MVP development and integration testing',
    techStack: ['LLM', 'RAG', 'AIGC', 'Computer Vision', 'Prompt Engineering'],
    tags: ['LLM', 'RAG', 'AIGC', 'Computer Vision', 'Prompt Engineering'],
    links: [],
    highlights: [
      'Participated in system architecture design, building a complete workflow: User Intent → RAG Recommendation → AIGC Virtual Try-on',
      'Defined MVP features and coordinated development progress across frontend and backend modules',
      'Designed and optimized structured prompts covering product category, material, style, and fit preferences',
      'Analyzed recommendation deviations and generation failures through Bad Case analysis, improving prompt robustness',
      'Coordinated integration testing and collected user feedback to guide iterative improvements'
    ]
  },
  {
    id: 'metaverse-classroom',
    title: 'Metaverse Classroom (Coming Soon)',
    category: 'Creative',
    period: '2026',
    accent: '#7aa7e9',
    state: 'pending',
    thumbnail: '',
    summary: 'A virtual reality classroom experience under design exploration.',
    description: 'Concept exploration for a Metaverse-enabled classroom product, integrating real-time 3D environments with collaborative learning workflows. The project is in early ideation stage, focusing on user experience design and technical feasibility studies.',
    tags: ['Metaverse', 'VR', 'EdTech'],
    links: [],
    highlights: []
  },
  {
    id: 'ar-showroom',
    title: 'AR Showroom (Coming Soon)',
    category: 'Creative',
    period: '2026',
    accent: '#a98ac9',
    state: 'pending',
    thumbnail: '',
    summary: 'Augmented reality product showroom under design exploration.',
    description: 'A product showroom concept leveraging augmented reality for immersive brand experiences. Researching AR frameworks, mobile compatibility, and 3D asset pipelines.',
    tags: ['AR', '3D', 'Brand'],
    links: [],
    highlights: []
  },
  {
    id: 'ai-research',
    title: 'AI Research Lab (Coming Soon)',
    category: 'Technical',
    period: '2026',
    accent: '#8f7df4',
    state: 'pending',
    thumbnail: '',
    summary: 'A research initiative exploring AI-driven product innovation.',
    description: 'Research-focused exploration of AI capabilities in real product scenarios, including LLM integration, prompt engineering, and applied machine learning.',
    tags: ['AI', 'LLM', 'Research'],
    links: [],
    highlights: []
  },
  {
    id: 'iot-garden',
    title: 'IoT Smart Garden (Coming Soon)',
    category: 'Technical',
    period: '2026',
    accent: '#7aa7e9',
    state: 'pending',
    thumbnail: '',
    summary: 'A smart gardening system with IoT sensors under early design.',
    description: 'IoT-based smart garden concept integrating soil sensors, automated watering, and a mobile dashboard. Currently in ideation and hardware feasibility stage.',
    tags: ['IoT', 'Hardware', 'Sensors'],
    links: [],
    highlights: []
  },
  {
    id: 'data-viz',
    title: 'Data Visualization (Coming Soon)',
    category: 'Creative',
    period: '2026',
    accent: '#e99ad6',
    state: 'pending',
    thumbnail: '',
    summary: 'An interactive data visualization tool under design.',
    description: 'A web-based data visualization platform concept, exploring interactive charts, real-time data streams, and aesthetic-driven storytelling.',
    tags: ['Data Viz', 'D3', 'Storytelling'],
    links: [],
    highlights: []
  }
];

var currentProjectState = 'orbs'; // orbs | expanded
var activeProjectId = null;
var projectsOrbsAPI = null;

function initProjects() {
  var stage = document.getElementById('projectsStage');
  var overlay = document.getElementById('projectsExpandOverlay');
  var section = document.getElementById('projects');
  if (!stage || !section || !overlay || stage.dataset.projectsInitialized === 'true') return;
  stage.dataset.projectsInitialized = 'true';

  projectsOrbsAPI = initProjectsOrbs(section, stage, PROJECTS, function (projectId) {
    if (currentProjectState === 'expanded') return;
    expandProject(projectId, stage, overlay);
  });

  // ---- 遮罩点击关闭 ----
  overlay.addEventListener('click', function () {
    if (currentProjectState === 'expanded') collapseProject(stage, overlay);
  });

  // ---- Escape 关闭 ----
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && currentProjectState === 'expanded') {
      collapseProject(stage, overlay);
    }
  });

}


function expandProject(projectId, stage, overlay) {
  var projectData = PROJECTS.find(function (p) { return p.id === projectId; });
  if (!projectData) return;

  currentProjectState = 'expanded';
  activeProjectId = projectId;
  stage.classList.add('is-expanded');

  // 找到与发光项目球同步的可访问点击区域
  var projectOriginEl = document.querySelector('.project-physics-orb.is-active[data-project-id="' + projectId + '"]');
  var projectOriginRect = projectOriginEl ? projectOriginEl.getBoundingClientRect() : null;
  // Fallback to morph origin
  if (!projectOriginRect) {
    var morphOrigin = document.getElementById('projectMorphOrigin');
    if (morphOrigin) projectOriginRect = morphOrigin.getBoundingClientRect();
  }

  // 构建详情面板
  var panel = document.createElement('div');
  panel.className = 'project-detail-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', projectData.title + ' details');

  var accent = projectData.accent || '#8f7df4';
  panel.style.setProperty('--project-accent', accent);

  var html = '<div class="project-detail-dragbar" data-project-drag-handle>'
    + '<span class="project-detail-drag-label"><i data-lucide="grip-horizontal" aria-hidden="true"></i><span>PROJECT FILE</span></span>'
    + '<span class="project-detail-window-code">' + (projectData.code || projectData.period || '') + '</span>'
    + '<button class="detail-close-btn" id="projectCloseBtn" type="button" title="Close" aria-label="Close project details"><i data-lucide="x" aria-hidden="true"></i></button>'
    + '</div>';
  // 顶部图（如果有 thumbnail；否则用渐变色条 + 项目编号）
  if (projectData.thumbnail) {
    html += '<img class="detail-top-image" src="' + projectData.thumbnail + '" alt="' + projectData.title + '">';
  } else {
    var kickerText = projectData.code || '';
    html += '<div class="detail-top-image detail-illustration" aria-hidden="true">';
    if (kickerText) {
      html += '<span class="detail-illustration-code">' + kickerText + '</span>';
    }
    html += '<span class="detail-illustration-initial">' + projectData.title.charAt(0) + '</span>'
      + '<span class="detail-illustration-star detail-illustration-star-one">✦</span>'
      + '<span class="detail-illustration-star detail-illustration-star-two">✦</span>';
    html += '</div>';
  }
  html += '<div class="detail-body">'
    + '<span class="detail-title">' + projectData.title + '</span>';
  if (projectData.tagline) {
    html += '<p class="detail-tagline">' + projectData.tagline + '</p>';
  }
  html += '<div class="detail-meta">'
    + '<span class="detail-category">' + projectData.category + '</span>'
    + '<span class="detail-period">' + projectData.period + '</span>'
    + '</div>';
  if (projectData.role) {
    html += '<div class="detail-role"><i data-lucide="user" style="width:.7rem;height:.7rem;color:var(--purple)"></i> ' + projectData.role + '</div>';
  }
  html += '<p class="detail-desc">' + projectData.description + '</p>'
    + '<div class="detail-tags">' + projectData.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>';
  if (projectData.links && projectData.links.length > 0) {
    html += '<div class="detail-links">'
      + projectData.links.map(function (l) { return '<a class="detail-link-btn" href="' + l.url + '" target="_blank" rel="noopener"><i data-lucide="' + l.icon + '" style="width:.7rem;height:.7rem"></i> ' + l.label + '</a>'; }).join('')
      + '</div>';
  }
  if (projectData.highlights && projectData.highlights.length > 0) {
    html += '<div class="detail-section"><h4><i data-lucide="sparkles" style="width:.75rem;height:.75rem;margin-right:.3rem;color:var(--purple)"></i>Highlights</h4><ul class="detail-highlights">'
      + projectData.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('')
      + '</ul></div>';
  }
  if (projectData.techStack && projectData.techStack.length > 0) {
    html += '<div class="detail-section"><h4><i data-lucide="layers" style="width:.75rem;height:.75rem;margin-right:.3rem;color:var(--purple)"></i>Tech Stack</h4><div class="detail-techstack">'
      + projectData.techStack.map(function (t) { return '<span>' + t + '</span>'; }).join('')
      + '</div></div>';
  }
  if (projectData.status) {
    html += '<div class="detail-status"><i data-lucide="activity" style="width:.65rem;height:.65rem;color:var(--purple)"></i> <b>Status:</b> ' + projectData.status + '</div>';
  }
  html += '</div>';

  panel.innerHTML = html;

  // 设置初始位置（从发光项目球位置出发）
  var startX, startY, startW, startH;
  if (projectOriginRect) {
    startX = projectOriginRect.left + projectOriginRect.width / 2;
    startY = projectOriginRect.top + projectOriginRect.height / 2;
    startW = projectOriginRect.width;
    startH = projectOriginRect.height;
  } else {
    startX = window.innerWidth / 2;
    startY = window.innerHeight / 2;
    startW = 180;
    startH = 180;
  }

  // 目标尺寸和位置
  var isNarrowProjectViewport = window.innerWidth < 700;
  var targetW = Math.min(window.innerWidth * (isNarrowProjectViewport ? .92 : .68), 760);
  var targetH = Math.min(window.innerHeight * (isNarrowProjectViewport ? .74 : .78), window.innerHeight - (isNarrowProjectViewport ? 24 : 100));

  // 设置起始状态
  panel.style.width = startW + 'px';
  panel.style.height = startH + 'px';
  panel.style.left = (startX - startW / 2) + 'px';
  panel.style.top = (startY - startH / 2) + 'px';
  panel.style.borderRadius = '8px';
  panel.style.transform = 'scale(1)';

  // 先添加到 DOM，opacity 0
  document.body.appendChild(panel);
  panel._dragCleanup = makeProjectPanelDraggable(panel);

  // 强制 reflow 后设置目标状态
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      panel.style.width = targetW + 'px';
      panel.style.height = targetH + 'px';
      panel.style.left = ((window.innerWidth - targetW) / 2) + 'px';
      panel.style.top = ((window.innerHeight - targetH) / 2) + 'px';
      panel.style.borderRadius = '8px';
      panel.classList.add('is-open');
    });
  });

  // 关闭按钮事件
  panel.addEventListener('click', function (e) {
    if (e.target.id === 'projectCloseBtn' || e.target.closest('#projectCloseBtn')) {
      collapseProject(stage, overlay);
    }
  });

  // 存储引用
  panel._projectData = projectData;
  panel._projectOriginEl = projectOriginEl;
  overlay._activePanel = panel;

  // 初始化 Lucide 图标
  if (window.lucide) lucide.createIcons();

  // 焦点移到关闭按钮
  setTimeout(function () {
    var closeBtn = document.getElementById('projectCloseBtn');
    if (closeBtn) closeBtn.focus();
  }, 600);
}

function makeProjectPanelDraggable(panel) {
  var handle = panel.querySelector('[data-project-drag-handle]');
  if (!handle) return function () {};

  var dragState = null;

  handle.addEventListener('pointerdown', function (event) {
    if (event.button !== 0 || event.target.closest('button,a')) return;
    var rect = panel.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top
    };
    panel.classList.add('is-dragging');
    if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  function movePanel(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    var margin = 8;
    var maxLeft = Math.max(margin, window.innerWidth - panel.offsetWidth - margin);
    var maxTop = Math.max(margin, window.innerHeight - panel.offsetHeight - margin);
    var nextLeft = Math.min(maxLeft, Math.max(margin, dragState.left + event.clientX - dragState.startX));
    var nextTop = Math.min(maxTop, Math.max(margin, dragState.top + event.clientY - dragState.startY));
    panel.style.left = nextLeft + 'px';
    panel.style.top = nextTop + 'px';
  }

  function finishDrag(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    if (handle.hasPointerCapture && handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    dragState = null;
    panel.classList.remove('is-dragging');
  }

  window.addEventListener('pointermove', movePanel);
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);

  return function () {
    window.removeEventListener('pointermove', movePanel);
    window.removeEventListener('pointerup', finishDrag);
    window.removeEventListener('pointercancel', finishDrag);
    dragState = null;
    panel.classList.remove('is-dragging');
  };
}

function collapseProject(stage, overlay) {
  if (currentProjectState !== 'expanded') return;

  var panel = overlay._activePanel;
  var projectOriginEl = panel ? panel._projectOriginEl : null;
  if (panel && panel._dragCleanup) {
    panel._dragCleanup();
    panel._dragCleanup = null;
  }

  // 获取发光项目球的当前位置
  var projectOriginRect = projectOriginEl ? projectOriginEl.getBoundingClientRect() : null;

  if (projectOriginRect && panel) {
    // Morph 回发光项目球
    panel.style.width = projectOriginRect.width + 'px';
    panel.style.height = projectOriginRect.height + 'px';
    panel.style.left = projectOriginRect.left + 'px';
    panel.style.top = projectOriginRect.top + 'px';
    panel.style.borderRadius = '8px';
    panel.classList.remove('is-open');
  }

  // 延迟移除面板
  setTimeout(function () {
    if (panel && panel.parentNode) {
      panel.parentNode.removeChild(panel);
    }
    overlay._activePanel = null;
  }, 550);

  currentProjectState = 'orbs';
  activeProjectId = null;
  stage.classList.remove('is-expanded');
  if (projectsOrbsAPI) projectsOrbsAPI.resetFocus();
}

// ============================================================
//  About Me — 数据 + 3D 环绕轮播
// ============================================================

var ABOUT_CARDS = [
  {
    id: 'base-info', period: 'FEB 2003', location: 'Quanzhou, Fujian',
    category: 'Base Info', icon: 'id-card', title: 'Base Information', subtitle: '',
    image: 'images/About me/照片1.JPEG', logo: 'images/照片.JPG',
    items: [],
    tags: [
      'enfp',
      'soft girl',
      '00s',
      'creator',
      'learner',
      { label: 'phone', value: '183 5056 5182' },
      { label: 'wechat', value: 'kunan0226' },
      { label: 'email', value: 'kunan0226@163.com' }
    ],
    action: { label: 'Resume', icon: 'download', disabled: false }
  },
  {
    id: 'huaqiao', period: 'SEP 2020 - JUN 2024', location: 'Xiamen, Fujian',
    category: 'Education', icon: 'graduation-cap', title: 'Huaqiao University', subtitle: '',
    image: 'images/About me/照片2.jpg', logo: 'images/About me/华侨大学校徽.png',
    items: [],
    tags: ['Top 10% GPA','First-Class Scholarship','IELTS 6.5','CET-6','Class Life Committee','Sangzi WeAssistant','Plant Art Club Lead'],
    action: null
  },
  {
    id: 'keendata', period: 'APR 2025 - AUG 2025', location: 'Shenzhen, Guangdong',
    category: 'Internship', icon: 'briefcase-business', title: 'Keendata',
    subtitle: 'Project Management Intern',
    image: 'images/About me/照片3.png', logo: 'images/About me/Keendata.png',
    items: [],
    tags: ['Big Data Platform','Issue Tracking','Requirements Management','Custom Delivery'],
    action: { label: 'View Details', icon: 'arrow-up-right', disabled: false }
  },
  {
    id: 'polyu', period: 'SEP 2025', location: 'Hung Hom, Hong Kong',
    category: 'Education', icon: 'graduation-cap',
    title: 'The Hong Kong Polytechnic University', subtitle: '',
    image: 'images/About me/照片4.png', logo: 'images/About me/香港理工大学校徽.png',
    items: [],
    tags: ['QS Top 50','Metaverse','Top 10% GPA'],
    action: null
  },
  {
    id: 'xgrids', period: 'JAN 2026 - MAY 2026', location: 'Shenzhen, Guangdong',
    category: 'Internship', icon: 'scan-line', title: 'XGRIDS',
    subtitle: 'Project Management Intern',
    image: 'images/About me/照片5.png', logo: 'images/About me/XGRIDS.png',
    items: [],
    tags: ['Software Delivery','3D Reconstruction','Spatial Computing'],
    action: { label: 'View Details', icon: 'arrow-up-right', disabled: false }
  },
  {
    id: 'chery', period: 'JUN 2026 - PRESENT', location: 'Wuhu, Anhui',
    category: 'Internship', icon: 'car-front', title: 'CHERY',
    subtitle: 'Project Management Intern',
    image: 'images/About me/照片6.png', logo: 'images/About me/CHERY.png',
    items: [],
    tags: ['Intelligent Driving','ADSD','Jira Governance','Quality Management','Robotaxi'],
    action: { label: 'View Details', icon: 'arrow-up-right', disabled: false }
  }
];

var carouselAngle = 0;       // 当前旋转角度 (度)
var carouselSpeed = 0;       // 瞬时速度
var carouselTarget = null;   // snap 目标角度
var carouselAuto = true;     // 是否自动旋转
var carouselRAF = null;

function initAboutMe() {
  var timelineTrack = document.getElementById('timelineTrack');
  var cardsContainer = document.getElementById('aboutCards');
  if (!timelineTrack || !cardsContainer) return;

  // 移动端判断：< 768px 关闭 3D 轮播，使用纯横滑（CSS 已用 !important 覆盖 transform）
  var isMobile = window.innerWidth < 768;

  // ---- 渲染时间线 ----
  ABOUT_CARDS.forEach(function (card, i) {
    var btn = document.createElement('button');
    btn.className = 'timeline-node' + (i === 0 ? ' active' : '');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', card.title);
    if (i === 0) btn.setAttribute('aria-current', 'step');
    btn.innerHTML =
      '<span class="timeline-dot"></span>' +
      '<span class="timeline-period">' + card.period + '</span>' +
      '<span class="timeline-location">' + card.location + '</span>';
    btn.addEventListener('click', function () { snapToCard(i); });
    timelineTrack.appendChild(btn);
  });

  // ---- 构建 3D 环绕 wrapper ----
  var wrapper = document.createElement('div');
  wrapper.className = 'carousel-wrapper';
  wrapper.id = 'carouselWrapper';
  cardsContainer.appendChild(wrapper);

  var cardCount = ABOUT_CARDS.length;
  var angleStep = 360 / cardCount;
  var radius = getCarouselRadius(); // translateZ 距离

  function setCardBaseTransforms() {
    var currentRadius = getCarouselRadius();
    wrapper.querySelectorAll('.about-card').forEach(function (cardEl, cardIndex) {
      cardEl.style.transform = 'rotateY(' + (cardIndex * angleStep) + 'deg) translateZ(' + currentRadius + 'px)';
    });
  }

  ABOUT_CARDS.forEach(function (card, i) {
    var el = document.createElement('div');
    el.className = 'about-card';
    el.dataset.cardId = card.id;
    el.setAttribute('aria-label', 'Slide ' + (i + 1) + ' of ' + cardCount + ': ' + card.title);

    // 初始 transform
    el.style.transform = 'rotateY(' + (i * angleStep) + 'deg) translateZ(' + radius + 'px)';

    // Image
    var imgHTML =
      '<div class="card-image-wrap">' +
        '<img src="' + card.image + '" alt="' + card.title + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '">' +
        '<span class="card-category">' + card.category + '</span>' +
        '<span class="card-number">' + String(i + 1).padStart(2, '0') + '</span>' +
      '</div>';

    // Head: logo or icon
    var headIconHTML = card.logo
      ? '<span class="card-logo-wrap"><img src="' + card.logo + '" alt="" class="card-logo"></span>'
      : '<span class="card-icon-wrap"><i data-lucide="' + card.icon + '" class="card-head-icon"></i></span>';
    var subtitleHTML = card.subtitle ? '<p class="card-subtitle">' + card.subtitle + '</p>' : '';

    // Items
    var itemsHTML = '';
    if (card.items.length > 0) {
      itemsHTML = '<div class="card-info-list">';
      card.items.forEach(function (item) {
        itemsHTML +=
          '<div class="card-info-item">' +
            '<i data-lucide="' + item.icon + '"></i>' +
            '<span>' + item.label + '</span>' +
            '<span class="card-info-value">' + item.value + '</span>' +
          '</div>';
      });
      itemsHTML += '</div>';
    } else if (card.tags.length > 0) {
      itemsHTML = '<div class="card-items">';
      card.tags.forEach(function (tag) {
        if (typeof tag === 'string') {
          itemsHTML += '<span class="card-tag">' + tag + '</span>';
        } else {
          itemsHTML +=
            '<span class="card-tag card-tag-private" tabindex="0" data-private-value="' + tag.value + '">' +
              tag.label +
            '</span>';
        }
      });
      itemsHTML += '</div>';
    }

    // Action
    var actionHTML = '';
    if (card.action) {
      actionHTML =
        '<div class="card-action">' +
          '<button class="card-action-btn"' + (card.action.disabled ? ' disabled title="Coming Soon"' : '') + '>' +
            '<i data-lucide="' + card.action.icon + '"></i>' +
            '<span>' + (card.action.disabled ? (card.action.disabledLabel || 'Coming Soon') : card.action.label) + '</span>' +
          '</button>' +
        '</div>';
    }

    el.innerHTML = imgHTML +
      '<div class="card-body">' +
        '<div class="card-head">' + headIconHTML +
          '<div><h3 class="card-title">' + card.title + '</h3>' + subtitleHTML + '</div>' +
        '</div>' +
        itemsHTML +
        actionHTML +
      '</div>';

    wrapper.appendChild(el);
  });

  // Lucide icons
  if (window.lucide) { lucide.createIcons(); }

  // ---- 卡片按钮 ----
  cardsContainer.addEventListener('click', function (e) {
    var btn = e.target.closest('.card-action-btn');
    if (!btn || btn.disabled) return;
    var cardEl = e.target.closest('.about-card');
    if (!cardEl) return;
    var cardId = cardEl.dataset.cardId;

    // Resume 按钮 → 打开下载弹框
    if (cardId === 'base-info') {
      e.preventDefault();
      e.stopPropagation();
      var overlay = document.getElementById('resumeDialogOverlay');
      if (overlay) {
        overlay.classList.add('is-open');
        if (window.lucide) lucide.createIcons();
      }
      return;
    }

    // View Details → 跳转到 Internship 详情
    var internshipIds = ['keendata', 'xgrids', 'chery'];
    if (internshipIds.indexOf(cardId) === -1) return;

    e.preventDefault();
    e.stopPropagation();

    // 滚动到 Internship section
    var internshipSection = document.getElementById('internship');
    if (internshipSection) {
      internshipSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 展开对应实习详情
    var internshipStage = document.getElementById('internshipStage');
    var internshipDetail = document.getElementById('internshipDetail');
    if (internshipStage && internshipDetail) {
      // 确保处于 cards 状态
      if (currentInternshipState === 'intro') {
        // 先触发切换到 cards 状态
        var stage = document.getElementById('internshipStage');
        if (stage) {
          stage.classList.remove('is-intro');
          stage.classList.add('is-cards');
          currentInternshipState = 'cards';
        }
      }
      // 延迟打开详情，等滚动到位
      setTimeout(function () {
        openInternshipDetail(cardId, internshipDetail, internshipStage);
      }, 800);
    }
  });

  // ---- 拖拽交互（仅桌面端启用；移动端用浏览器原生横滑） ----
  var dragging = false;
  var lastX = 0;
  var dragVelocity = 0;

  if (!isMobile) {
    cardsContainer.addEventListener('mousedown', function (e) {
      if (e.target.closest('button')) return;
      dragging = true;
      carouselAuto = false;
      carouselTarget = null;
      lastX = e.clientX;
      dragVelocity = 0;
      cardsContainer.classList.add('dragging');
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var delta = e.clientX - lastX;
      carouselAngle += delta * 0.35;
      dragVelocity = delta * 0.35;
      lastX = e.clientX;
      updateCarousel();
    });

    window.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false;
      cardsContainer.classList.remove('dragging');
      // 惯性衰减
      if (Math.abs(dragVelocity) > 0.5) {
        carouselSpeed = dragVelocity * 0.3;
        carouselAuto = true;
      } else {
        carouselAuto = true;
        carouselSpeed = 0;
      }
    });

    // 滚轮：横向滚动/触控板手势旋转轮播，纵向滚动留给页面滚动容器
    cardsContainer.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.6) {
        e.preventDefault();
        carouselAuto = false;
        carouselTarget = null;
        carouselAngle += e.deltaX * 0.3 + e.deltaY * 0.08;
        carouselSpeed = 0;
        updateCarousel();
        clearTimeout(cardsContainer._wheelTimeout);
        cardsContainer._wheelTimeout = setTimeout(function () { carouselAuto = true; }, 1500);
      }
    }, { passive: false });
  }

  // 触控：移动端不拦截（让浏览器原生横滑生效），桌面端保留以兼容触屏笔记本
  if (!isMobile) {
    var touchStartX = 0;
    cardsContainer.addEventListener('touchstart', function (e) {
      if (e.target.closest('button')) return;
      carouselAuto = false;
      carouselTarget = null;
      touchStartX = e.touches[0].clientX;
      lastX = touchStartX;
      dragVelocity = 0;
      cardsContainer.classList.add('dragging');
    }, { passive: true });

    cardsContainer.addEventListener('touchmove', function (e) {
      if (!cardsContainer.classList.contains('dragging')) return;
      var delta = e.touches[0].clientX - lastX;
      carouselAngle += delta * 0.35;
      dragVelocity = delta * 0.35;
      lastX = e.touches[0].clientX;
      updateCarousel();
    }, { passive: true });

    cardsContainer.addEventListener('touchend', function () {
      cardsContainer.classList.remove('dragging');
      if (Math.abs(dragVelocity) > 0.5) {
        carouselSpeed = dragVelocity * 0.3;
        carouselAuto = true;
      } else {
        carouselAuto = true;
        carouselSpeed = 0;
      }
    });
  }

  // ---- 自动旋转 loop（仅桌面端运行；移动端用浏览器原生滚动） ----
  if (!isMobile) {
    function carouselLoop() {
      if (carouselTarget !== null) {
        // snap 动画
        var diff = carouselTarget - carouselAngle;
        if (Math.abs(diff) < 0.3) {
          carouselAngle = carouselTarget;
          carouselTarget = null;
          carouselAuto = true;
          carouselSpeed = 0;
        } else {
          carouselAngle += diff * 0.08;
        }
      } else if (carouselAuto) {
        // 慢速自动旋转
        carouselSpeed += (0.015 - carouselSpeed) * 0.02;
        carouselAngle += carouselSpeed;
      }

      // 惯性衰减
      if (!carouselAuto && carouselTarget === null) {
        carouselSpeed *= 0.95;
        carouselAngle += carouselSpeed;
      }

      updateCarousel();
      carouselRAF = requestAnimationFrame(carouselLoop);
    }
    carouselLoop();

    window.addEventListener('resize', function () {
      setCardBaseTransforms();
      updateCarousel();
    });
  } else {
    // 移动端：监听 scroll 让时间线 active 跟随当前可见卡片
    var mobileNodeMap = [];
    timelineTrack.querySelectorAll('.timeline-node').forEach(function (n, idx) {
      mobileNodeMap.push({ node: n, index: idx });
    });
    function updateMobileActive() {
      // 取最接近视口中心的卡片作为 active
      var center = cardsContainer.scrollLeft + cardsContainer.clientWidth / 2;
      var closestIdx = 0;
      var closestDist = Infinity;
      var cards = wrapper.querySelectorAll('.about-card');
      cards.forEach(function (c, idx) {
        var r = c.offsetLeft + c.offsetWidth / 2;
        var d = Math.abs(r - center);
        if (d < closestDist) { closestDist = d; closestIdx = idx; }
      });
      mobileNodeMap.forEach(function (m) {
        m.node.classList.toggle('active', m.index === closestIdx);
      });
    }
    cardsContainer.addEventListener('scroll', updateMobileActive, { passive: true });
    updateMobileActive();
  }

  // ---- IntersectionObserver: 离开 HOME 时隐藏提示 ----
  if (window.IntersectionObserver) {
    var aboutSection = document.getElementById('about');
    var internshipSection = document.getElementById('internship');
    var projectsSection = document.getElementById('projects');
    var skillsLearningSection = document.getElementById('skills-learning');

    function hideHomeHints() {
      var ih = document.getElementById('interactHint');
      var eh = document.getElementById('easterEggHint');
      if (ih) ih.classList.add('is-hidden-by-about');
      if (eh) eh.classList.add('is-hidden-by-about');
    }

    var aboutObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          hideHomeHints();
          stabilizeAboutCarousel();
        }
      });
    }, { threshold: [0.5] });
    if (aboutSection) aboutObserver.observe(aboutSection);

    // Also hide hints on Internship section
    if (internshipSection) {
      var internObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            hideHomeHints();
          }
        });
      }, { threshold: [0.3] });
      internObserver.observe(internshipSection);
    }

    // Also hide hints on Projects section
    if (projectsSection) {
      var projObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            hideHomeHints();
          }
        });
      }, { threshold: [0.3] });
      projObserver.observe(projectsSection);
    }

    if (skillsLearningSection) {
      var skillsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            hideHomeHints();
          }
        });
      }, { threshold: [0.3] });
      skillsObserver.observe(skillsLearningSection);
    }

    // Show hints again when back on HOME
    var homeSection = document.getElementById('home');
    if (homeSection) {
      var homeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            var ih = document.getElementById('interactHint');
            var eh = document.getElementById('easterEggHint');
            if (ih) ih.classList.remove('is-hidden-by-about');
            if (eh) eh.classList.remove('is-hidden-by-about');
          }
        });
      }, { threshold: [0.5] });
      homeObserver.observe(homeSection);
    }
  }
}

function getCurrentAboutFrontIndex() {
  var cardCount = ABOUT_CARDS.length;
  var angleStep = 360 / cardCount;
  var norm = ((carouselAngle % 360) + 360) % 360;
  var index = Math.round((360 - norm) / angleStep) % cardCount;
  return index < 0 ? index + cardCount : index;
}

function stabilizeAboutCarousel() {
  if (window.innerWidth < 769) return;
  var index = getCurrentAboutFrontIndex();
  snapToCard(index);
}

function updateCarousel() {
  var wrapper = document.getElementById('carouselWrapper');
  if (!wrapper) return;

  var cardCount = ABOUT_CARDS.length;
  var angleStep = 360 / cardCount;
  // 归一化角度
  var norm = ((carouselAngle % 360) + 360) % 360;

  // 找到最接近正前方的卡片
  var frontIndex = Math.round((360 - norm) / angleStep) % cardCount;
  if (frontIndex < 0) frontIndex += cardCount;

  // 更新 wrapper 旋转
  wrapper.style.transform = 'rotateY(' + carouselAngle + 'deg)';

  // 更新每张卡片的角度感知（用于 front class）
  var cards = wrapper.querySelectorAll('.about-card');
  cards.forEach(function (el, i) {
    // 计算这张卡当前在视线中的偏移角
    var cardAngle = ((i * angleStep + norm) % 360 + 360) % 360;
    if (cardAngle > 180) cardAngle -= 360;

    // 是否在前面
    var isFront = Math.abs(cardAngle) < angleStep / 2 + 1;
    el.classList.toggle('front', isFront);

    // 透明度：前方最亮，后方渐暗
    var absAngle = Math.abs(cardAngle);
    var opacity = absAngle < 90 ? 1 - (absAngle / 90) * 0.55 : 0.45 - ((absAngle - 90) / 90) * 0.25;
    el.style.opacity = Math.max(0.2, opacity);
  });

  // 更新时间线高亮
  var nodes = document.querySelectorAll('#timelineTrack .timeline-node');
  nodes.forEach(function (node, i) {
    node.classList.toggle('active', i === frontIndex);
    if (i === frontIndex) {
      node.setAttribute('aria-current', 'step');
    } else {
      node.removeAttribute('aria-current');
    }
  });
}

function getCarouselRadius() {
  var width = window.innerWidth || 1200;
  if (width < 560) return 170;
  if (width < 900) return 240;
  return Math.min(360, Math.max(300, width * 0.24));
}

function snapToCard(index) {
  // 移动端：原生滚动到对应卡片
  if (window.innerWidth < 768) {
    var cardsContainer = document.getElementById('aboutCards');
    if (cardsContainer) {
      var card = cardsContainer.querySelectorAll('.about-card')[index];
      if (card) {
        var left = card.offsetLeft - (cardsContainer.clientWidth - card.offsetWidth) / 2;
        cardsContainer.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      }
    }
    return;
  }
  var angleStep = 360 / ABOUT_CARDS.length;
  var baseTarget = -index * angleStep;
  carouselTarget = baseTarget + Math.round((carouselAngle - baseTarget) / 360) * 360;
  carouselAuto = false;
}

var SKILLS_LEARNING_CARDS = [
  {
    index: '01', kind: 'skill', faceLabel: 'Skill 01', backLabel: 'Skill', accent: '#8f7df4',
    title: 'Scrum',
    description: 'Sprint planning, daily syncs, reviews and retrospectives with a delivery-first rhythm.'
  },
  {
    index: '02', kind: 'skill', faceLabel: 'Skill 02', backLabel: 'Showcase Skill', accent: '#e99ad6',
    title: 'AI Video Production',
    description: 'Prompt-led storyboards, generated visuals, editing and narrative assembly.',
    marker: 'VIDEO', showcase: 'ai-video'
  },
  {
    index: 'L1', kind: 'learning', faceLabel: 'Learning 01', backLabel: 'Learning', accent: '#79b7e8',
    title: 'Product Strategy',
    description: 'Connecting market signals, user value and business trade-offs.'
  },
  {
    index: '03', kind: 'skill', faceLabel: 'Skill 03', backLabel: 'Skill', accent: '#a579e8',
    title: 'Project Management',
    description: 'Turning ambiguous goals into owners, milestones, risks and decisions.'
  },
  {
    index: '04', kind: 'skill', faceLabel: 'Skill 04', backLabel: 'Skill', accent: '#f0a4c9',
    title: 'Cross-functional Collaboration',
    description: 'Keeping product, design, engineering and stakeholders aligned.'
  },
  {
    index: 'L2', kind: 'learning', faceLabel: 'Learning 02', backLabel: 'Learning', accent: '#6ebbc6',
    title: 'Generative AI Workflows',
    description: 'Testing agents, multimodal tools and repeatable AI-assisted systems.'
  },
  {
    index: '05', kind: 'skill', faceLabel: 'Skill 05', backLabel: 'Skill', accent: '#7aa7e9',
    title: 'Data Analysis',
    description: 'Using metrics, issue patterns and delivery signals for clearer decisions.'
  },
  {
    index: '06', kind: 'skill', faceLabel: 'Skill 06', backLabel: 'Skill', accent: '#ba8ed2',
    title: '3D & Spatial Computing',
    description: 'Hands-on exposure to reconstruction, SLAM and digital-twin workflows.'
  },
  {
    index: 'GO', kind: 'play', faceLabel: 'Play', backLabel: 'Memory Game', accent: '#e7b34f',
    title: 'Me & My Friends',
    description: 'Six pairs of people, places and little adventures.',
    marker: 'PLAY', target: 'travel-memory'
  }
];

function initSkillsLearning() {
  var grid = document.getElementById('skillsLearningGrid');
  if (!grid || grid.dataset.initialized === 'true') return;
  grid.dataset.initialized = 'true';
  var showcaseAPI = initSkillShowcaseWindow();
  var confirmAPI = initSkillActionConfirm();

  SKILLS_LEARNING_CARDS.forEach(function (item) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'skill-flip-card' + (item.kind === 'play' ? ' skill-play-card' : '') + (item.showcase ? ' has-showcase' : '');
    card.dataset.kind = item.kind;
    if (item.showcase) card.dataset.showcase = item.showcase;
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', 'Reveal ' + item.title);
    card.style.setProperty('--card-accent', item.accent);

    var inner = document.createElement('span');
    inner.className = 'skill-flip-inner';

    var front = document.createElement('span');
    front.className = 'skill-flip-face skill-flip-front';
    var frontType = document.createElement('span');
    frontType.className = 'skill-card-type';
    frontType.textContent = item.faceLabel;
    var question = document.createElement('span');
    question.className = 'skill-card-question';
    question.textContent = '?';
    var index = document.createElement('span');
    index.className = 'skill-card-index';
    index.textContent = item.index;
    front.append(frontType, question, index);

    var back = document.createElement('span');
    back.className = 'skill-flip-face skill-flip-back';
    var backType = document.createElement('span');
    backType.className = 'skill-card-type';
    backType.textContent = item.backLabel;
    var title = document.createElement('strong');
    title.textContent = item.title;
    var description = document.createElement('span');
    description.className = 'skill-card-description';
    description.textContent = item.description;
    back.append(backType, title, description);

    if (item.marker) {
      var marker = document.createElement('span');
      marker.className = 'skill-showcase-mark';
      marker.textContent = item.marker;
      back.appendChild(marker);
    }

    inner.append(front, back);
    card.appendChild(inner);
    card.addEventListener('click', function () {
      var isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
      card.setAttribute('aria-label', (isFlipped ? 'Hide ' : 'Reveal ') + item.title);
      if (isFlipped && item.showcase && showcaseAPI && confirmAPI) {
        window.setTimeout(function () {
          if (!card.classList.contains('is-flipped')) return;
          confirmAPI.open({
            action: 'video',
            kicker: 'VIDEO SHOWCASE',
            title: 'Open the AI Video showcase?',
            text: 'This will open a movable video window with sound controls.',
            confirmLabel: 'Open Video',
            cancelLabel: 'Not Now',
            onConfirm: showcaseAPI.open
          });
        }, 420);
      }
      if (isFlipped && item.target && confirmAPI) {
        window.setTimeout(function () {
          if (!card.classList.contains('is-flipped')) return;
          confirmAPI.open({
            action: 'play',
            kicker: 'BEFORE YOU GO',
            title: 'Start the flip-card game?',
            text: 'You will move to the next page and begin a six-pair memory round.',
            confirmLabel: 'Start Game',
            cancelLabel: 'Stay Here',
            onConfirm: function () {
              var target = document.getElementById(item.target);
              if (window.travelMemoryGame) window.travelMemoryGame.reset();
              if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }, 420);
      }
    });
    grid.appendChild(card);
  });
}

function initSkillActionConfirm() {
  var overlay = document.getElementById('skillActionConfirm');
  var dialog = overlay && overlay.querySelector('.skill-action-confirm-dialog');
  var kicker = document.getElementById('skillActionConfirmKicker');
  var title = document.getElementById('skillActionConfirmTitle');
  var text = document.getElementById('skillActionConfirmText');
  var cancelButton = document.getElementById('skillActionConfirmCancel');
  var submitButton = document.getElementById('skillActionConfirmSubmit');
  if (!overlay || !dialog || !kicker || !title || !text || !cancelButton || !submitButton) return null;
  if (overlay._confirmAPI) return overlay._confirmAPI;

  var confirmAction = null;
  var lastFocused = null;

  function close(confirmed) {
    if (!overlay.classList.contains('is-open')) return;
    var action = confirmed ? confirmAction : null;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    confirmAction = null;
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
    lastFocused = null;
    if (action) window.setTimeout(action, 0);
  }

  function open(options) {
    lastFocused = document.activeElement;
    overlay.dataset.action = options.action || 'default';
    kicker.textContent = options.kicker || 'BEFORE YOU GO';
    title.textContent = options.title || 'Continue?';
    text.textContent = options.text || 'Choose whether to continue.';
    cancelButton.textContent = options.cancelLabel || 'Not Now';
    submitButton.textContent = options.confirmLabel || 'Continue';
    confirmAction = typeof options.onConfirm === 'function' ? options.onConfirm : null;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(function () { cancelButton.focus(); });
  }

  cancelButton.addEventListener('click', function () { close(false); });
  submitButton.addEventListener('click', function () { close(true); });
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) close(false);
  });
  dialog.addEventListener('click', function (event) { event.stopPropagation(); });
  document.addEventListener('keydown', function (event) {
    if (!overlay.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close(false);
      return;
    }
    if (event.key !== 'Tab') return;
    var focusable = [cancelButton, submitButton];
    var currentIndex = focusable.indexOf(document.activeElement);
    if (event.shiftKey && currentIndex <= 0) {
      event.preventDefault();
      submitButton.focus();
    } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
      event.preventDefault();
      cancelButton.focus();
    }
  });

  overlay._confirmAPI = { open: open, close: close };
  return overlay._confirmAPI;
}

function initSkillShowcaseWindow() {
  var panel = document.getElementById('skillShowcaseWindow');
  var handle = document.getElementById('skillShowcaseDragHandle');
  var closeButton = document.getElementById('skillShowcaseClose');
  var video = document.getElementById('skillShowcaseVideo');
  var playToggle = document.getElementById('skillShowcasePlayToggle');
  var playGlyph = document.getElementById('skillShowcasePlayGlyph');
  var empty = document.getElementById('skillShowcaseEmpty');
  var emptyText = document.getElementById('skillShowcaseEmptyText');
  var status = document.getElementById('skillShowcaseStatus');
  if (!panel || !handle || !closeButton || !video || !playToggle || !playGlyph || !empty || !emptyText || !status) return null;

  var dragState = null;

  function clampPosition(left, top) {
    var panelWidth = panel.offsetWidth;
    var panelHeight = panel.offsetHeight;
    var nav = document.getElementById('mainNavbar');
    var minTop = nav ? nav.getBoundingClientRect().height + 8 : 8;
    var maxLeft = Math.max(8, window.innerWidth - panelWidth - 8);
    var maxTop = Math.max(minTop, window.innerHeight - panelHeight - 8);
    panel.style.left = Math.min(Math.max(8, left), maxLeft) + 'px';
    panel.style.top = Math.min(Math.max(minTop, top), maxTop) + 'px';
  }

  function centerPanel() {
    var panelWidth = panel.offsetWidth;
    var panelHeight = panel.offsetHeight;
    clampPosition((window.innerWidth - panelWidth) / 2, (window.innerHeight - panelHeight) / 2);
  }

  function setEmptyState(message, nextStatus) {
    panel.classList.remove('has-media');
    playToggle.classList.remove('is-playing');
    playGlyph.textContent = '\u25b6';
    playToggle.setAttribute('aria-label', 'Play video');
    emptyText.textContent = message;
    status.textContent = nextStatus;
  }

  function loadVideo() {
    var source = (panel.dataset.videoSrc || '').trim();
    video.pause();
    video.removeAttribute('src');
    video.load();
    if (!source) {
      setEmptyState('Video source pending', 'READY TO LOAD');
      return;
    }

    setEmptyState('Loading video...', 'LOADING');
    video.src = source;
    video.load();
  }

  function open() {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    closeButton.tabIndex = 0;
    if (!panel.dataset.positioned) {
      panel.dataset.positioned = 'true';
      window.requestAnimationFrame(centerPanel);
    } else {
      clampPosition(parseFloat(panel.style.left) || 0, parseFloat(panel.style.top) || 0);
    }
    loadVideo();
    if (window.lucide) window.lucide.createIcons();
  }

  function close() {
    panel.classList.remove('is-open', 'is-dragging', 'has-media');
    panel.setAttribute('aria-hidden', 'true');
    closeButton.tabIndex = -1;
    video.pause();
    playToggle.classList.remove('is-playing');
    playGlyph.textContent = '\u25b6';
    playToggle.setAttribute('aria-label', 'Play video');
    dragState = null;
  }

  function endDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    dragState = null;
    panel.classList.remove('is-dragging');
    if (handle.hasPointerCapture && handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
  }

  function moveDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    clampPosition(event.clientX - dragState.offsetX, event.clientY - dragState.offsetY);
  }

  handle.addEventListener('pointerdown', function (event) {
    if (event.target.closest('button')) return;
    var rect = panel.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    panel.classList.add('is-dragging');
    if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  handle.addEventListener('pointermove', moveDrag);
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
  window.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  closeButton.addEventListener('click', close);
  playToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    if (video.paused) {
      video.play().catch(function () { status.textContent = 'USE VIDEO CONTROLS'; });
    } else {
      video.pause();
    }
  });
  video.addEventListener('loadeddata', function () {
    panel.classList.add('has-media');
    status.textContent = 'PLAYABLE';
  });
  video.addEventListener('play', function () {
    playToggle.classList.add('is-playing');
    playGlyph.textContent = '\u23f8';
    playToggle.setAttribute('aria-label', 'Pause video');
  });
  video.addEventListener('pause', function () {
    playToggle.classList.remove('is-playing');
    playGlyph.textContent = '\u25b6';
    playToggle.setAttribute('aria-label', 'Play video');
  });
  video.addEventListener('error', function () {
    setEmptyState('Video could not be loaded', 'CHECK SOURCE');
  });
  panel.addEventListener('pointerdown', function () { panel.style.zIndex = '1201'; });
  window.addEventListener('resize', function () {
    if (panel.classList.contains('is-open')) {
      clampPosition(parseFloat(panel.style.left) || 0, parseFloat(panel.style.top) || 0);
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) close();
  });

  return { open: open, close: close };
}

// ---- 简历下载弹框 ----
(function initResumeDialog() {
  var overlay = document.getElementById('resumeDialogOverlay');
  if (!overlay) return;
  // 关闭按钮
  var closeBtn = document.getElementById('resumeDialogClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      overlay.classList.remove('is-open');
    });
  }
  // 点击遮罩关闭
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) overlay.classList.remove('is-open');
  });
  // Escape 关闭
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      overlay.classList.remove('is-open');
    }
  });
})();

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    initAboutMe();
    initInternshipJourney();
    initProjects();
    initSkillsLearning();
  });
} else {
  initAboutMe();
  initInternshipJourney();
  initProjects();
  initSkillsLearning();
}
