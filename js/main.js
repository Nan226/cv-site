/* ========================================
   CV-Site — 交互脚本
   导航撕碎效果 + Three.js 3D人物
   ======================================== */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

  // 暴露计数（供调试）
  window.__tornCount = () => tornCount;
})();


// ============================================================
//  Three.js 3D 人物
// ============================================================

(function initThreeJSCharacter() {
  const container = document.getElementById('characterContainer');
  const canvas = document.getElementById('threeCanvas');
  if (!container || !canvas) return;

  // ---- Scene / Camera / Renderer ----
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
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
  let activeMorphTargets = [];
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

  function collectMorphTargets(root) {
    const targets = [];
    root.traverse((node) => {
      if (!node.isMesh || !node.morphTargetDictionary || !node.morphTargetInfluences) return;
      Object.entries(node.morphTargetDictionary).forEach(([name, index]) => {
        targets.push({ mesh: node, index, name: name.toLowerCase() });
      });
    });
    return targets;
  }

  function setMorphInfluence(patterns, value) {
    activeMorphTargets.forEach((target) => {
      if (patterns.some((pattern) => pattern.test(target.name))) {
        target.mesh.morphTargetInfluences[target.index] = value;
      }
    });
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

  function loadProductionAvatar() {
    const loader = new GLTFLoader();
    updateModelStatus('Loading 3D character...');

    loader.load(
      'images/HOME/有骨骼的娃娃.glb',
      (gltf) => {
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
        activeMorphTargets = collectMorphTargets(avatarRoot);

        if (gltf.animations.length > 0) {
          animationMixer = new THREE.AnimationMixer(avatarRoot);
          const idleClip = gltf.animations.find((clip) => /idle/i.test(clip.name)) || gltf.animations[0];
          animationMixer.clipAction(idleClip).play();
        }

        character.visible = false;
        updateModelStatus('3D character ready');
        hideModelStatus();
      },
      undefined,
      () => {
        updateModelStatus('Preview character ready');
        hideModelStatus(1200);
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

  clickTargets = buildFallbackHitRig();
  loadProductionAvatar();

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
    const hoveredPart = raycaster.intersectObjects(clickTargets, true)[0];
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

  // 反应动画
  function aimFallbackArm(side, elbowTarget, handTarget, amount) {
    if (activeCharacter !== character) return false;

    const shoulder = bodyParts[`${side}-shoulder`];
    const elbow = bodyParts[`${side}-elbow`];
    if (!shoulder || !elbow) return false;

    character.updateMatrixWorld(true);

    const elbowTargetWorld = character.localToWorld(elbowTarget.clone());
    const elbowTargetLocal = shoulder.parent.worldToLocal(elbowTargetWorld.clone());
    const upperDirection = elbowTargetLocal.sub(shoulder.position).normalize();
    const shoulderTarget = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, -1, 0),
      upperDirection
    );
    shoulder.quaternion.slerp(shoulderTarget, amount);
    shoulder.updateMatrixWorld(true);

    const handTargetWorld = character.localToWorld(handTarget.clone());
    const handTargetLocal = elbow.parent.worldToLocal(handTargetWorld.clone());
    const lowerDirection = handTargetLocal.sub(elbow.position).normalize();
    const elbowTargetRotation = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, -1, 0),
      lowerDirection
    );
    elbow.quaternion.slerp(elbowTargetRotation, amount);
    return true;
  }

  function rotateBoneToward(bone, endBone, targetWorld, amount) {
    if (!bone || !endBone || !bone.parent) return false;

    bone.updateWorldMatrix(true, true);
    endBone.updateWorldMatrix(true, true);

    const origin = new THREE.Vector3();
    const end = new THREE.Vector3();
    bone.getWorldPosition(origin);
    endBone.getWorldPosition(end);

    const currentDirection = end.sub(origin).normalize();
    const targetDirection = targetWorld.clone().sub(origin).normalize();
    if (currentDirection.lengthSq() < 0.001 || targetDirection.lengthSq() < 0.001) return false;

    const delta = new THREE.Quaternion().setFromUnitVectors(currentDirection, targetDirection);
    const worldRotation = new THREE.Quaternion();
    bone.getWorldQuaternion(worldRotation);
    delta.multiply(worldRotation);

    const parentRotation = new THREE.Quaternion();
    bone.parent.getWorldQuaternion(parentRotation);
    const localTarget = parentRotation.invert().multiply(delta);
    bone.quaternion.slerp(localTarget, amount);
    bone.updateWorldMatrix(true, true);
    return true;
  }

  function aimRigArm(side, elbowTarget, handTarget, amount) {
    if (activeCharacter === character) return false;

    const upperArm = activeBodyParts[`${side}-shoulder`];
    const forearm = activeBodyParts[`${side}-elbow`];
    const hand = activeBodyParts[`${side}-hand`];
    if (!upperArm || !forearm || !hand) return false;

    activeCharacter.updateMatrixWorld(true);
    const elbowTargetWorld = activeCharacter.localToWorld(elbowTarget.clone());
    const handTargetWorld = activeCharacter.localToWorld(handTarget.clone());
    rotateBoneToward(upperArm, forearm, elbowTargetWorld, amount);
    rotateBoneToward(forearm, hand, handTargetWorld, amount);
    return true;
  }

  function triggerReaction(partName) {
    if (stopActiveReaction) stopActiveReaction();

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
    var part = partMap[partName];
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
    mouse.lerp(mouseTarget, 0.08);

    if (animationMixer) animationMixer.update(clock.getDelta());

    // 身体仅轻微微转（不要整体跟着鼠标跑）
    const targetRotY = mouseOnCharacter ? mouse.x * 0.12 : 0;
    const targetRotX = mouseOnCharacter ? -mouse.y * 0.05 : 0;

    if (!stopActiveReaction) {
      activeCharacter.rotation.y += (targetRotY - activeCharacter.rotation.y) * 0.06;
      activeCharacter.rotation.x += (targetRotX - activeCharacter.rotation.x) * 0.06;
    }

    // 头部跟随（比身体稍灵敏）
    const activeHead = activeBodyParts.head;
    if (activeHead && !stopActiveReaction) {
      const baseRotation = activeHead.userData.followBaseRotation || new THREE.Euler();
      const headTargetY = baseRotation.y + (mouseOnCharacter ? mouse.x * 0.2 : 0);
      const headTargetX = baseRotation.x + (mouseOnCharacter ? -mouse.y * 0.12 : 0);
      activeHead.rotation.y += (headTargetY - activeHead.rotation.y) * 0.1;
      activeHead.rotation.x += (headTargetX - activeHead.rotation.x) * 0.1;
    }

    // 瞳孔跟踪（范围加大，更灵敏）
    const lookX = mouseOnCharacter ? mouse.x * 0.08 : 0;
    const lookY = mouseOnCharacter ? mouse.y * 0.06 : 0;
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
  };
})();


// ============================================================
//  背景飘浮彩带
// ============================================================

(function initRibbons() {
  const container = document.getElementById('ribbonsContainer');
  if (!container) return;

  const colors = [
    '#d2b5f2', '#c9a8f0', '#b890e8',  // 浅紫系
    '#eca1ca', '#f0b8d4', '#e890b0',  // 柔粉系
    '#a78bfa', '#b99af5',              // 中紫系
    '#e1c3e8', '#d4a8dd',              // 淡紫粉
  ];

  const ribbonCount = 25;

  for (let i = 0; i < ribbonCount; i++) {
    const ribbon = document.createElement('div');
    ribbon.className = 'ribbon';

    // 随机尺寸
    const width = 2 + Math.random() * 5;       // 2-7px 宽
    const height = 10 + Math.random() * 30;     // 10-40px 长

    // 随机位置
    const leftPos = Math.random() * 100;        // 0-100%

    // 随机动画参数
    const duration = 12 + Math.random() * 20;   // 12-32s
    const delay = Math.random() * duration;      // 错开启动
    const drift = (Math.random() - 0.5) * 120;  // 水平飘移距离（px）
    const spin = (Math.random() - 0.5) * 360;   // 旋转角度

    ribbon.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      left: ${leftPos}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
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

    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
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
      }
      if (ribbons) ribbons.style.display = 'none';

      // 眼睑重新拉开（移除 class，CSS transition 自动恢复）
      lidTop.classList.remove('closing');
      lidBottom.classList.remove('closing');
    }, 380);
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
      }
      if (ribbons) ribbons.style.removeProperty('display');
      document.removeEventListener('mousemove', updateSpotlight);

      // 眼睑重新拉开
      lidTop.classList.remove('closing');
      lidBottom.classList.remove('closing');
    }, 400);
  }
}
