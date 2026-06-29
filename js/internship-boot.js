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
      responsibilities: ['To be completed.'],
      methods: ['To be completed.'],
      highlights: ['To be completed.']
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
      responsibilities: ['To be completed.'],
      methods: ['To be completed.'],
      highlights: ['To be completed.']
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
      responsibilities: ['To be completed.'],
      methods: ['To be completed.'],
      highlights: ['To be completed.']
    }
  ];

  var state = 'intro';
  var transitioned = false;
  var flipTimers = [];

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
    var stage = byId('internshipStage');
    var cardsContainer = byId('internshipCards');
    var scrollHint = byId('internshipScrollHint');
    if (!stage || !cardsContainer || transitioned || state !== 'intro') return;
    if (event && event.target && event.target.closest && event.target.closest('.internship-card, .internship-detail')) return;
    if (event && event.stopPropagation) event.stopPropagation();

    buildCards(cardsContainer);
    transitioned = true;
    state = 'tearing';
    stage.classList.remove('is-intro', 'is-detail', 'is-opening-detail', 'is-cards');
    stage.classList.add('is-tearing');
    if (scrollHint) scrollHint.setAttribute('disabled', 'disabled');

    setTimeout(function () {
      stage.classList.remove('is-tearing');
      stage.classList.add('is-cards');
      state = 'cards';
      if (scrollHint) scrollHint.removeAttribute('disabled');

      flipTimers.forEach(function (timer) { clearTimeout(timer); });
      flipTimers = [];
      Array.prototype.forEach.call(cardsContainer.querySelectorAll('.internship-card'), function (card, index) {
        flipTimers.push(setTimeout(function () {
          card.classList.add('is-flipped');
        }, 1450 + index * 260));
      });
    }, 760);
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
    var introImage = byId('internshipIntroImage');
    var scrollHint = byId('internshipScrollHint');
    if (!stage || !cardsContainer) return;

    stage.dataset.internshipReady = 'true';
    buildCards(cardsContainer);
    window.revealInternshipCards = revealInternshipCards;

    if (scrollHint) {
      scrollHint.addEventListener('click', revealInternshipCards);
    }
    if (introImage) {
      introImage.addEventListener('click', revealInternshipCards);
      introImage.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          revealInternshipCards(event);
        }
      });
      // 也给内部 img 绑定，确保点击图片也能触发
      var introImg = introImage.querySelector('img');
      if (introImg) {
        introImg.addEventListener('click', function (e) {
          e.stopPropagation();
          revealInternshipCards(e);
        });
      }
    }
    stage.addEventListener('click', revealInternshipCards);
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
