/* ========================================
   CV-Site — 交互脚本
   导航撕碎效果 + Three.js 3D人物
   ======================================== */
/* global THREE */

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

  // 透视相机：与人眼接近
  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 50);
  camera.position.set(0, 0.3, 6);
  camera.lookAt(0, 0.1, 0);

  // ---- 光照 ----
  // 环境光
  const ambient = new THREE.AmbientLight('#f8f4fc', 2.5);
  scene.add(ambient);

  // 主方向光（模拟柔光）
  const keyLight = new THREE.DirectionalLight('#ffffff', 4);
  keyLight.position.set(3, 2, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(512, 512);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 20;
  scene.add(keyLight);

  // 补光
  const fillLight = new THREE.DirectionalLight('#e8ddf5', 2);
  fillLight.position.set(-2, 1, 1);
  scene.add(fillLight);

  // 底部柔光
  const rimLight = new THREE.DirectionalLight('#f0d8e0', 1.8);
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
    color: '#b8a0e8',
    roughness: 0.4,
    metalness: 0.08,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: '#d4b8f0',
    roughness: 0.35,
    metalness: 0.05,
  });

  // ---- 构建人物 ----
  const character = new THREE.Group();
  const bodyParts = {};   // 记录各部位，用于点击检测

  // 颈部
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.2, 0.25, 24),
    skinDarkMat
  );
  neck.position.y = -0.05;
  neck.castShadow = true;
  character.add(neck);

  // 躯干（上半身）
  const torsoGeo = new THREE.SphereGeometry(0.65, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const torso = new THREE.Mesh(torsoGeo, clothesMat);
  torso.position.y = -0.68;
  torso.scale.set(0.85, 0.7, 0.55);
  torso.castShadow = true;
  torso.name = 'body';
  bodyParts.body = torso;
  character.add(torso);

  // 肩膀
  const shoulderGeo = new THREE.SphereGeometry(0.28, 20, 16);
  const leftShoulder = new THREE.Mesh(shoulderGeo, clothesMat);
  leftShoulder.position.set(-0.52, -0.2, 0);
  leftShoulder.scale.set(0.8, 0.7, 0.6);
  leftShoulder.name = 'left-shoulder';
  bodyParts['left-shoulder'] = leftShoulder;
  character.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(shoulderGeo, clothesMat);
  rightShoulder.position.set(0.52, -0.2, 0);
  rightShoulder.scale.set(0.8, 0.7, 0.6);
  rightShoulder.name = 'right-shoulder';
  bodyParts['right-shoulder'] = rightShoulder;
  character.add(rightShoulder);

  // 衣领装饰
  const collarGeo = new THREE.TorusGeometry(0.22, 0.04, 8, 24);
  const collar = new THREE.Mesh(collarGeo, accentMat);
  collar.position.y = 0.0;
  collar.rotation.x = Math.PI * 0.5;
  character.add(collar);

  // 头部
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.28;
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
  hairMain.position.y = 0.06;
  hairMain.position.z = -0.06;
  hairMain.scale.set(1.05, 1.1, 1.0);
  headGroup.add(hairMain);

  // 刘海
  const bangsGeo = new THREE.SphereGeometry(0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const bangs = new THREE.Mesh(bangsGeo, hairMat);
  bangs.position.y = 0.22;
  bangs.position.z = 0.12;
  bangs.rotation.x = 0.35;
  bangs.scale.set(1.05, 0.85, 0.3);
  headGroup.add(bangs);

  // 侧发
  for (const side of [-1, 1]) {
    const sideHair = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 12),
      hairMat
    );
    sideHair.position.set(side * 0.33, 0.0, 0.05);
    sideHair.scale.set(0.5, 1.3, 0.35);
    headGroup.add(sideHair);
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
  });

  container.addEventListener('mouseleave', () => {
    mouseTarget.set(0, 0);
    mouseOnCharacter = false;
  });

  // 点击检测
  container.addEventListener('click', (e) => {
    const rect = container.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);

    // 检测身体部位
    const parts = Object.values(bodyParts);
    const intersects = raycaster.intersectObjects(parts, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      // 向上查找命名的 body part
      while (obj && !obj.name) {
        obj = obj.parent;
      }
      const partName = obj ? obj.name : null;
      if (partName) {
        triggerReaction(partName);
      }
    }
  });

  // 反应动画
  function triggerReaction(partName) {
    const head = bodyParts.head;
    const body = bodyParts.body;

    // 清除之前的动画
    if (head._animTimer) clearTimeout(head._animTimer);

    const startTime = performance.now();
    const duration = 600;
    const origRotX = head.rotation.x;
    const origRotY = head.rotation.y;
    const origRotZ = head.rotation.z;

    function animateReaction(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // easeOutElastic-ish
      const p = 1 - Math.pow(1 - t, 3);
      const bounce = Math.sin(t * Math.PI * 3) * (1 - t) * 0.3;

      head.rotation.x = origRotX;
      head.rotation.y = origRotY;
      head.rotation.z = origRotZ;

      switch (partName) {
        case 'head':
          head.rotation.x = origRotX + bounce * 0.5;
          break;
        case 'left-shoulder':
          head.rotation.z = origRotZ + Math.sin(t * Math.PI * 2) * (1 - t) * 0.25;
          break;
        case 'right-shoulder':
          head.rotation.z = origRotZ - Math.sin(t * Math.PI * 2) * (1 - t) * 0.25;
          break;
        case 'body':
          body.position.y = -0.68 + bounce * 0.12;
          break;
      }

      if (t < 1) {
        head._animTimer = requestAnimationFrame(animateReaction);
      } else {
        head.rotation.set(origRotX, origRotY, origRotZ);
        body.position.y = -0.68;
      }
    }

    head._animTimer = requestAnimationFrame(animateReaction);
  }

  // ---- 渲染循环 ----
  function animate() {
    requestAnimationFrame(animate);

    // 平滑鼠标
    mouse.lerp(mouseTarget, 0.08);

    // 角色旋转跟随鼠标
    const targetRotY = mouseOnCharacter ? mouse.x * 0.5 : 0;
    const targetRotX = mouseOnCharacter ? -mouse.y * 0.25 : 0;

    character.rotation.y += (targetRotY - character.rotation.y) * 0.06;
    character.rotation.x += (targetRotX - character.rotation.x) * 0.06;

    // 眼睛瞳孔跟随鼠标
    const lookX = mouseOnCharacter ? mouse.x * 0.04 : 0;
    const lookY = mouseOnCharacter ? mouse.y * 0.03 : 0;
    eyePairs.forEach(({ group }) => {
      // 瞳孔偏移（限制范围）
      group.children.forEach(child => {
        if (child.name && child.name.startsWith('pupil')) {
          child.position.x = (child.name === 'pupil-left' ? -1 : 1) * 0.0 + lookX;
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
  window.__threeCharacter = { character, bodyParts, scene, camera };
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

  if (!overlay || overlay.classList.contains('active')) return;
  overlay.classList.add('active');

  // ---- 5秒倒计时 ----
  var count = 5;
  countdownDisplay.textContent = count;
  countdownDisplay.classList.add('show');

  var countdownInterval = setInterval(function () {
    count--;
    if (count <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.textContent = '';
      countdownDisplay.classList.remove('show');
      startBlinkAndDarkMode();
    } else {
      countdownDisplay.textContent = count;
    }
  }, 1000);

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
