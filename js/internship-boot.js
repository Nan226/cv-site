/* Internship standalone boot: keeps this section interactive even if the main module is delayed. */
(function () {
  var cardsData = [
    {
      id: 'keendata',
      company: 'Keendata',
      role: 'Project Management Intern',
      period: 'APR 2025 - AUG 2025',
      location: 'Hangzhou, Zhejiang',
      image: 'images/Internship/卡片1.jpg',
      summary: 'Coordinated requirements, issues, and custom delivery workflows for data platform projects.',
      tags: ['Requirements', 'Issue Tracking', 'Data Platform', 'Delivery'],
      responsibilities: [
        'Gathered and analyzed client requirements for data platform customization projects, producing structured PRDs',
        'Managed issue tracking workflows in Jira, triaging and prioritizing 50+ tickets across 3 concurrent client projects',
        'Coordinated custom delivery timelines between engineering, QA, and client success teams',
        'Facilitated weekly stakeholder sync meetings, capturing action items and following through on deliverables',
        'Maintained project documentation in Confluence to ensure knowledge transfer and onboarding efficiency'
      ],
      methods: [
        'Requirement elicitation via stakeholder interviews and user story mapping',
        'Jira-based issue tracking with custom workflows and Kanban boards',
        'PRD documentation with traceability matrices',
        'Agile ceremonies — daily stand-ups, sprint planning, retrospectives',
        'Delivery workflow optimization through process mapping and bottleneck analysis'
      ],
      highlights: [
        'Streamlined the requirement-to-delivery pipeline by introducing standardized PRD templates, reducing requirement clarification time by ~20%',
        'Successfully coordinated delivery for 3 concurrent data platform projects without milestone slippage',
        'Designed a Jira dashboard that gave leadership real-time visibility into issue resolution metrics',
        'Received positive feedback from client stakeholders for clear and proactive communication'
      ]
    },
    {
      id: 'xgrids',
      company: 'XGRIDS',
      role: 'Project Management Intern',
      period: 'JAN 2026 - MAY 2026',
      location: 'Shenzhen, Guangdong',
      image: 'images/Internship/卡片2.jpg',
      summary: 'Supported agile delivery, SOP refinement, and software iteration for spatial computing products.',
      tags: ['Agile', 'SOP', '3D Reconstruction', 'Spatial Computing'],
      responsibilities: [
        'Supported agile sprint execution for a 3D reconstruction software product, tracking user stories and development progress',
        'Authored and refined 15+ Standard Operating Procedure documents for software iteration and QA workflows',
        'Coordinated cross-team communication between R&D, product, and testing teams for spatial computing features',
        'Conducted bug triage sessions, categorizing and prioritizing issues discovered during 3D scanning field tests',
        'Assisted in organizing bi-weekly iteration retrospectives, documenting lessons learned and action items'
      ],
      methods: [
        'Scrum framework with 2-week sprint cycles and Jira backlog management',
        'SOP documentation using standardized templates with version control',
        'User story mapping and acceptance criteria definition',
        'Bug triage and severity classification (P0–P4) with SLAs',
        'Iteration retrospectives with structured feedback collection'
      ],
      highlights: [
        'Built a comprehensive SOP library that reduced new team member onboarding time from 2 weeks to 4 days',
        'Coordinated 8 successful sprint deliveries for the spatial computing product line',
        'Introduced a bug triage classification system that improved critical bug resolution time by ~30%',
        'Recognized by team lead for exceptional cross-team coordination during a critical product milestone'
      ]
    },
    {
      id: 'chery',
      company: 'CHERY',
      role: 'Project Management Intern',
      period: 'JUN 2026 - PRESENT',
      location: 'Wuhu, Anhui',
      image: 'images/Internship/卡片3.jpg',
      summary: 'Worked on intelligent driving delivery governance, quality tracking, and cross-functional coordination.',
      tags: ['Jira', 'Quality', 'Intelligent Driving', 'Robotaxi'],
      responsibilities: [
        'Govern delivery timelines and quality metrics for intelligent driving software features across multiple vehicle platforms',
        'Track and report on quality KPIs — defect density, resolution rate, regression count — using Jira dashboards',
        'Coordinate cross-functional efforts between perception, planning, and testing teams for Robotaxi feature delivery',
        'Manage Jira project workflows, custom fields, and automation rules to streamline the issue lifecycle',
        'Facilitate weekly delivery sync meetings with engineering managers and product owners to align priorities and risks'
      ],
      methods: [
        'Jira advanced dashboards with custom filters and gadget configurations for real-time quality visibility',
        'Quality KPI tracking framework with weekly trend analysis and threshold alerts',
        'Cross-functional sync meetings with structured agendas and decision logs',
        'Risk escalation matrix with defined SLAs for different severity levels',
        'Delivery milestone tracking with burn-down and burn-up charts'
      ],
      highlights: [
        'Established a real-time quality tracking dashboard that became the single source of truth for intelligent driving release readiness',
        'Streamlined cross-team Jira workflows, reducing issue handoff time between teams by ~25%',
        'Successfully coordinated delivery governance for Robotaxi perception module across 2 vehicle platforms',
        'Designed an automated weekly quality report that reduced manual reporting effort by 60%'
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
        + '<span class="card-back-company">' + card.company + '</span>'
        + '<span class="card-back-role">' + card.role + '</span>'
        + '<span class="card-back-period">' + card.period + '</span>'
        + '<p class="card-back-summary">' + card.summary + '</p>'
        + '<div class="card-back-tags">' + card.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join('') + '</div>'
        + '<span class="card-back-action">View Details <i data-lucide="arrow-right" style="width:.65rem;height:.65rem"></i></span>'
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

  function openDetail(cardId) {
    var stage = byId('internshipStage');
    var detail = byId('internshipDetail');
    var card = cardsData.find(function (item) { return item.id === cardId; });
    if (!stage || !detail || !card) return;

    state = 'detail';
    stage.classList.remove('is-cards');
    stage.classList.add('is-opening-detail', 'is-detail');
    detail.innerHTML = '<div class="internship-detail-card">'
      + '<img src="' + card.image + '" alt="' + card.company + ' internship card">'
      + '</div>'
      + '<div class="internship-detail-panel">'
      + '<span class="detail-company">' + card.company + '</span>'
      + '<div class="detail-role-period"><span class="detail-role">' + card.role + '</span><span class="detail-period">' + card.period + '</span></div>'
      + '<span class="detail-location">' + card.location + '</span>'
      + '<p class="detail-summary">' + card.summary + '</p>'
      + '<div class="detail-tags">' + card.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join('') + '</div>'
      + '<div class="detail-section"><h4>Responsibilities</h4><ul>' + card.responsibilities.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div>'
      + '<div class="detail-section"><h4>Methods</h4><ul>' + card.methods.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div>'
      + '<div class="detail-section"><h4>Highlights</h4><ul>' + card.highlights.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div>'
      + '<button class="detail-back-btn" id="internshipBackBtn"><i data-lucide="arrow-left" style="width:.65rem;height:.65rem"></i> Back to Journey</button>'
      + '</div>';
    createIcons();

    var back = byId('internshipBackBtn');
    if (back) {
      back.addEventListener('click', function () {
        closeDetail();
      });
    }
  }

  function closeDetail() {
    var stage = byId('internshipStage');
    var detail = byId('internshipDetail');
    if (!stage || !detail) return;
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
      if (card && state === 'cards') openDetail(card.getAttribute('data-card-id'));
    });
    cardsContainer.addEventListener('keydown', function (event) {
      var card = event.target.closest('.internship-card');
      if (card && state === 'cards' && event.key === 'Enter') openDetail(card.getAttribute('data-card-id'));
    });
  }

  window.revealInternshipCards = revealInternshipCards;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInternshipBoot);
  } else {
    initInternshipBoot();
  }
})();
