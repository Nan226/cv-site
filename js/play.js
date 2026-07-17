(function () {
  'use strict';

  var PAIR_COLORS = ['#d889ad', '#7ca8df', '#7fb99a', '#d4a94f', '#9a7fd4', '#db8f82'];
  var MEMORY_CARDS = [
    { pair: '01', image: 'images/Play/图1.jpg', alt: 'Portrait against a blue background' },
    { pair: '01', image: 'images/Play/微信图片_20260716090703_468_85.jpg', alt: 'Portrait with cat ear accessories' },
    { pair: '02', image: 'images/Play/微信图片_20260716090746_469_85.jpg', alt: 'Portrait making a hand pose' },
    { pair: '02', image: 'images/Play/微信图片_20260716091459_479_85.jpg', alt: 'Portrait holding a flower fan' },
    { pair: '03', image: 'images/Play/微信图片_20260716090847_471_85.jpg', alt: 'Two friends with cat paw poses' },
    { pair: '03', image: 'images/Play/微信图片_20260716090901_472_85.jpg', alt: 'Close selfie with a friend' },
    { pair: '04', image: 'images/Play/微信图片_20260716090959_475_85.jpg', alt: 'Indoor portrait with a friend' },
    { pair: '04', image: 'images/Play/微信图片_20260716091044_478_85.jpg', alt: 'Travel portrait with a friend' },
    { pair: '05', image: 'images/Play/微信图片_20260716090917_473_85.jpg', alt: 'Traditional dress portrait with a friend' },
    { pair: '05', image: 'images/Play/微信图片_20260716090943_474_85.jpg', alt: 'Winter portrait with a friend' },
    { pair: '06', image: 'images/Play/微信图片_20260716091023_476_85.jpg', alt: 'Outdoor portrait with a friend' },
    { pair: '06', image: 'images/Play/微信图片_20260716091037_477_85.jpg', alt: 'Cafe portrait with a friend' }
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
    completeSummary.textContent = 'Completed in ' + formatNumber(moves) + ' moves.';
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
      statusOutput.textContent = 'PAIR ' + firstCard.dataset.pair + ' FOUND';
      updateStats();
      clearTurn();
      if (matches === 6) window.setTimeout(showComplete, 520);
      return;
    }

    locked = true;
    statusOutput.textContent = 'TRY ANOTHER PAIR';
    mismatchTimer = window.setTimeout(function () {
      firstCard.classList.remove('is-flipped');
      secondCard.classList.remove('is-flipped');
      firstCard.setAttribute('aria-pressed', 'false');
      secondCard.setAttribute('aria-pressed', 'false');
      statusOutput.textContent = 'FIND THE PAIRS';
      clearTurn();
    }, 820);
  }

  function handleCardClick(card) {
    if (locked || card === firstCard || card.classList.contains('is-matched') || card.classList.contains('is-flipped')) return;
    card.classList.add('is-flipped');
    card.setAttribute('aria-pressed', 'true');
    if (!firstCard) {
      firstCard = card;
      statusOutput.textContent = 'ONE MEMORY OPEN';
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
    card.setAttribute('aria-label', 'Hidden memory card ' + (index + 1));
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
    var stamp = document.createElement('span');
    stamp.className = 'memory-pair-stamp';
    stamp.textContent = 'PAIR ' + item.pair;
    photo.append(image, stamp);
    inner.append(cover, photo);
    card.appendChild(inner);
    card.addEventListener('click', function () { handleCardClick(card); });
    return card;
  }

  function resetGame() {
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
    statusOutput.textContent = 'FIND THE PAIRS';
    updateStats();
    shuffle(MEMORY_CARDS).forEach(function (item, index) {
      board.appendChild(createCard(item, index));
    });
  }

  resetButton.addEventListener('click', resetGame);
  playAgainButton.addEventListener('click', resetGame);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && completeOverlay.classList.contains('is-open')) resetGame();
  });

  window.travelMemoryGame = { reset: resetGame };
  resetGame();
})();
