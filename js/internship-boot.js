/* Internship standalone boot: keeps this section interactive even if the main module is delayed. */
(function () {
  var cardsData = [
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

  var state = 'cards';

  function byId(id) {
    return document.getElementById(id);
  }

  function createIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function buildCards(container) {
    if (!container || container.children.length) return;
    container.innerHTML = cardsData.map(function (card, index) {
      return '<div class="internship-card" data-card-id="' + card.id + '" tabindex="0" role="button" aria-label="' + card.company + ' internship card">'
        + '<div class="internship-card-inner">'
        + '<div class="internship-card-front">'
        + '<img src="' + card.image + '" alt="' + card.company + ' internship card" loading="lazy">'
        + '<span class="card-front-number">' + String(index + 1).padStart(2, '0') + '</span>'
        + '</div>'
        + '<div class="internship-card-back">'
        + '<span class="card-back-kicker">Internship ' + String(index + 1).padStart(2, '0') + '</span>'
        + '<span class="card-back-company"><i data-lucide="building-2" class="card-back-company-icon" aria-hidden="true"></i>' + card.company + '</span>'
        + '<span class="card-back-role">' + card.role + '</span>'
        + '<span class="card-back-period">' + card.period + '</span>'
        + '<p class="card-back-summary">' + card.summary + '</p>'
        + '<div class="card-back-tags">' + card.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join('') + '</div>'
        + '<span class="card-back-action">View Details <i data-lucide="arrow-right" class="card-back-action-icon" aria-hidden="true"></i></span>'
        + '</div>'
        + '</div>'
        + '</div>';
    }).join('');
    createIcons();
  }

  function revealInternshipCards(event) {
    if (event && event.stopPropagation) event.stopPropagation();
  }

  function showCardsImmediately() {
    var stage = byId('internshipStage');
    var cardsContainer = byId('internshipCards');
    if (!stage || !cardsContainer) return;

    buildCards(cardsContainer);
    stage.classList.remove('is-intro', 'is-tearing', 'is-detail', 'is-opening-detail');
    stage.classList.add('is-cards');
    state = 'cards';
    Array.prototype.forEach.call(cardsContainer.querySelectorAll('.internship-card'), function (card) {
      card.classList.add('is-flipped');
    });
  }

  function openDetail(cardId, cardEl) {
    var stage = byId('internshipStage');
    var detail = byId('internshipDetail');
    var card = cardsData.find(function (item) { return item.id === cardId; });
    if (!stage || !detail || !card) return;

    state = 'detail';
    stage.classList.remove('is-cards');
    stage.classList.add('is-detail');

    var cardIndex = cardsData.findIndex(function (item) { return item.id === cardId; });
    // 卡片翻转动画播放 200ms 后渲染 detail 内容
    setTimeout(function () {
      var aboutImg = card.aboutImage || card.image;
      var logoHTML = card.logo
        ? '<span class="card-logo-wrap"><img src="' + card.logo + '" alt="" class="card-logo"></span>'
        : '<span class="card-icon-wrap"><i data-lucide="building-2" class="card-head-icon"></i></span>';
      var tagsHTML = card.tags.map(function (t) { return '<span class="card-tag">' + t + '</span>'; }).join('');

      detail.innerHTML = '<div class="internship-detail-card">'
        + '<div class="card-image-wrap">'
        + '<img src="' + aboutImg + '" alt="' + card.company + '">'
        + '<span class="card-number">' + String(cardIndex + 1).padStart(2, '0') + '</span>'
        + '</div>'
        + '<div class="card-body">'
        + '<div class="card-head">' + logoHTML
        + '<div><h3 class="card-title">' + card.company + '</h3>'
        + '<p class="card-subtitle">' + card.role + '</p></div>'
        + '</div>'
        + '<div class="card-items">' + tagsHTML + '</div>'
        + '</div>'
        + '<button class="internship-card-back-btn" id="internshipBackBtn"><i data-lucide="arrow-left" class="detail-back-icon" aria-hidden="true"></i> Back to Journey</button>'
        + '</div>'
        + '<div class="internship-detail-panel">'
        + '<span class="detail-company"><i data-lucide="building-2" class="detail-company-icon" aria-hidden="true"></i>' + card.company + '</span>'
        + '<div class="detail-role-period"><span class="detail-role">' + card.role + '</span><span class="detail-period">' + card.period + '</span></div>'
        + '<span class="detail-location"><i data-lucide="map-pin" style="width:.6rem;height:.6rem"></i> ' + card.location + '</span>'
        + '<p class="detail-summary">' + card.summary + '</p>'
        + '<div class="detail-tags">' + card.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join('') + '</div>'
        + '<div class="detail-section"><h4><i data-lucide="clipboard-list" class="detail-section-icon" aria-hidden="true"></i>Responsibilities</h4><ul>' + card.responsibilities.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div>'
        + '<div class="detail-section"><h4><i data-lucide="wrench" class="detail-section-icon" aria-hidden="true"></i>Tools & Methods</h4><ul>' + card.methods.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div>'
        + '<div class="detail-section"><h4><i data-lucide="sparkles" class="detail-section-icon" aria-hidden="true"></i>Highlights</h4><ul>' + card.highlights.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div>'
        + '</div>';
      // 渲染完 HTML 后触发翻转进场动画
      stage.classList.add('is-opening-detail');
      createIcons();

      var back = byId('internshipBackBtn');
      if (back) {
        back.addEventListener('click', function () {
          closeDetail();
        });
      }
    }, 200);

    // 翻转动画收尾
    setTimeout(function () {
      stage.classList.remove('is-opening-detail');
      if (cardEl) cardEl.classList.remove('is-flipping');
    }, 820);
  }

  function closeDetail() {
    var stage = byId('internshipStage');
    var detail = byId('internshipDetail');
    if (!stage || !detail) return;
    // 清除所有卡片的 is-flipping 状态
    var cards = document.querySelectorAll('.internship-card.is-flipping');
    for (var i = 0; i < cards.length; i++) { cards[i].classList.remove('is-flipping'); }
    detail.innerHTML = '';
    stage.classList.remove('is-detail', 'is-opening-detail');
    stage.classList.add('is-cards');
    state = 'cards';
  }

  function initInternshipBoot() {
    var stage = byId('internshipStage');
    var cardsContainer = byId('internshipCards');
    if (!stage || !cardsContainer) return;

    stage.dataset.internshipReady = 'true';
    showCardsImmediately();
    window.revealInternshipCards = revealInternshipCards;

    cardsContainer.addEventListener('click', function (event) {
      var card = event.target.closest('.internship-card');
      if (card && state === 'cards') {
        card.classList.add('is-flipping');
        openDetail(card.getAttribute('data-card-id'), card);
      }
    });
    cardsContainer.addEventListener('keydown', function (event) {
      var card = event.target.closest('.internship-card');
      if (card && state === 'cards' && event.key === 'Enter') {
        card.classList.add('is-flipping');
        openDetail(card.getAttribute('data-card-id'), card);
      }
    });
  }

  window.revealInternshipCards = revealInternshipCards;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInternshipBoot);
  } else {
    initInternshipBoot();
  }
})();
