(function () {
  'use strict';

  var PAIR_COLORS = ['#d889ad', '#7ca8df', '#7fb99a', '#d4a94f', '#9a7fd4', '#db8f82'];
  var I18N = {
    en: {
      findPairs: 'FIND THE PAIRS',
      oneOpen: 'ONE MEMORY OPEN',
      pairFound: 'PAIR {pair} FOUND',
      tryAnother: 'TRY ANOTHER PAIR',
      completed: 'Completed in {moves} moves.',
      hiddenCard: 'Hidden memory card {index}',
      pairStamp: 'PAIR {pair}'
    },
    zh: {
      findPairs: '寻找配对',
      oneOpen: '已翻开一张',
      pairFound: '第 {pair} 组已找到',
      tryAnother: '再试一组',
      completed: '用 {moves} 步完成。',
      hiddenCard: '隐藏的回忆卡片 {index}',
      pairStamp: '第 {pair} 组'
    }
  };
  var MEMORY_CARDS = [
    { pair: '01', image: 'assets/play/pair-01-a.webp', alt: 'Portrait against a blue background' },
    { pair: '01', image: 'assets/play/pair-01-b.webp', alt: 'Portrait with cat ear accessories' },
    { pair: '02', image: 'assets/play/pair-02-a.webp', alt: 'Portrait making a hand pose' },
    { pair: '02', image: 'assets/play/pair-02-b.webp', alt: 'Portrait holding a flower fan' },
    { pair: '03', image: 'assets/play/pair-03-a.webp', alt: 'Two friends with cat paw poses' },
    { pair: '03', image: 'assets/play/pair-03-b.webp', alt: 'Close selfie with a friend' },
    { pair: '04', image: 'assets/play/pair-04-a.webp', alt: 'Indoor portrait with a friend' },
    { pair: '04', image: 'assets/play/pair-04-b.webp', alt: 'Travel portrait with a friend' },
    { pair: '05', image: 'assets/play/pair-05-a.webp', alt: 'Traditional dress portrait with a friend' },
    { pair: '05', image: 'assets/play/pair-05-b.webp', alt: 'Winter portrait with a friend' },
    { pair: '06', image: 'assets/play/pair-06-a.webp', alt: 'Outdoor portrait with a friend' },
    { pair: '06', image: 'assets/play/pair-06-b.webp', alt: 'Cafe portrait with a friend' }
  ];

  var board = document.getElementById('memoryBoard');
  var matchesOutput = document.getElementById('memoryMatches');
  var movesOutput = document.getElementById('memoryMoves');
  var statusOutput = document.getElementById('memoryStatus');
  var resetButton = document.getElementById('memoryReset');
  var completeOverlay = document.getElementById('memoryComplete');
  var completeSummary = document.getElementById('memoryCompleteSummary');
  var playAgainButton = document.getElementById('memoryPlayAgain');
  if (!board || !matchesOutput || !movesOutput || !statusOutput || !resetButton || !completeOverlay || !completeSummary || !playAgainButton) return;

  var firstCard = null;
  var secondCard = null;
  var moves = 0;
  var matches = 0;
  var locked = false;
  var mismatchTimer = null;
  var initialized = false;

  function getLanguage() {
    return document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }

  function t(key, values) {
    var text = (I18N[getLanguage()] && I18N[getLanguage()][key]) || I18N.en[key] || key;
    Object.keys(values || {}).forEach(function (name) {
      text = text.replace('{' + name + '}', values[name]);
    });
    return text;
  }

  function shuffle(items) {
    var shuffled = items.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }

  function formatNumber(value) {
    return String(value).padStart(2, '0');
  }

  function updateStats() {
    matchesOutput.textContent = formatNumber(matches) + ' / 06';
    movesOutput.textContent = formatNumber(moves);
  }

  function clearTurn() {
    firstCard = null;
    secondCard = null;
    locked = false;
  }

  function showComplete() {
    completeSummary.textContent = t('completed', { moves: formatNumber(moves) });
    completeOverlay.classList.add('is-open');
    completeOverlay.setAttribute('aria-hidden', 'false');
    playAgainButton.focus();
  }

  function resolveTurn() {
    moves++;
    updateStats();
    if (firstCard.dataset.pair === secondCard.dataset.pair) {
      firstCard.classList.add('is-matched');
      secondCard.classList.add('is-matched');
      firstCard.disabled = true;
      secondCard.disabled = true;
      matches++;
      statusOutput.textContent = t('pairFound', { pair: firstCard.dataset.pair });
      updateStats();
      clearTurn();
      if (matches === 6) window.setTimeout(showComplete, 520);
      return;
    }

    locked = true;
    statusOutput.textContent = t('tryAnother');
    mismatchTimer = window.setTimeout(function () {
      firstCard.classList.remove('is-flipped');
      secondCard.classList.remove('is-flipped');
      firstCard.setAttribute('aria-pressed', 'false');
      secondCard.setAttribute('aria-pressed', 'false');
      statusOutput.textContent = t('findPairs');
      clearTurn();
    }, 820);
  }

  function handleCardClick(card) {
    if (locked || card === firstCard || card.classList.contains('is-matched') || card.classList.contains('is-flipped')) return;
    card.classList.add('is-flipped');
    card.setAttribute('aria-pressed', 'true');
    if (!firstCard) {
      firstCard = card;
      statusOutput.textContent = t('oneOpen');
      return;
    }
    secondCard = card;
    resolveTurn();
  }

  function createCard(item, index) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'memory-card';
    card.dataset.pair = item.pair;
    card.setAttribute('aria-label', t('hiddenCard', { index: index + 1 }));
    card.setAttribute('aria-pressed', 'false');
    card.style.setProperty('--pair-color', PAIR_COLORS[Number(item.pair) - 1]);

    var inner = document.createElement('span');
    inner.className = 'memory-card-inner';
    var cover = document.createElement('span');
    cover.className = 'memory-card-face memory-card-cover';
    var photo = document.createElement('span');
    photo.className = 'memory-card-face memory-card-photo';
    var image = document.createElement('img');
    image.src = item.image;
    image.alt = item.alt;
    image.loading = 'eager';
    image.decoding = 'async';
    image.fetchPriority = 'low';
    var stamp = document.createElement('span');
    stamp.className = 'memory-pair-stamp';
    stamp.textContent = t('pairStamp', { pair: item.pair });
    photo.append(image, stamp);
    inner.append(cover, photo);
    card.appendChild(inner);
    card.addEventListener('click', function () { handleCardClick(card); });
    return card;
  }

  function resetGame() {
    initialized = true;
    if (mismatchTimer) window.clearTimeout(mismatchTimer);
    firstCard = null;
    secondCard = null;
    moves = 0;
    matches = 0;
    locked = false;
    mismatchTimer = null;
    board.textContent = '';
    completeOverlay.classList.remove('is-open');
    completeOverlay.setAttribute('aria-hidden', 'true');
    statusOutput.textContent = t('findPairs');
    updateStats();
    shuffle(MEMORY_CARDS).forEach(function (item, index) {
      board.appendChild(createCard(item, index));
    });
  }

  resetButton.addEventListener('click', resetGame);
  playAgainButton.addEventListener('click', resetGame);
  window.addEventListener('cv-language-change', function () {
    statusOutput.textContent = matches === 6 ? statusOutput.textContent : t('findPairs');
    board.querySelectorAll('.memory-card').forEach(function (card, index) {
      card.setAttribute('aria-label', t('hiddenCard', { index: index + 1 }));
      var stamp = card.querySelector('.memory-pair-stamp');
      if (stamp) stamp.textContent = t('pairStamp', { pair: card.dataset.pair });
    });
    if (completeOverlay.classList.contains('is-open')) {
      completeSummary.textContent = t('completed', { moves: formatNumber(moves) });
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && completeOverlay.classList.contains('is-open')) resetGame();
  });

  window.travelMemoryGame = { reset: resetGame };

  var section = document.getElementById('travel-memory');
  if (section && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (initialized || !entries.some(function (entry) { return entry.isIntersecting; })) return;
      resetGame();
      observer.disconnect();
    }, {
      root: document.getElementById('scrollContainer'),
      rootMargin: '125% 0px',
      threshold: 0.01
    });
    observer.observe(section);
  } else {
    resetGame();
  }
})();
