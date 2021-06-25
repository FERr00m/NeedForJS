'use strict';

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.game-area'),
  car = document.createElement('div'),
  music = document.querySelector('.music'),
  record = document.querySelector('.record');


car.classList.add('car');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
};

if (!localStorage.getItem('bestscore')) {
  localStorage.setItem('bestscore', setting.score);
}


start.addEventListener('click', e => {
  if (e.target.matches('.easy')) {
    setting.speed = 3;
    setting.traffic = 3;
    startGame();
  } else if (e.target.matches('.medium')) {
    setting.speed = 6;
    setting.traffic = 2.5;
    startGame();
  } else if (e.target.matches('.hard')) {
    setting.speed = 9;
    setting.traffic = 2;
    startGame();
  }
});
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);





function getQtyElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
  music.currentTime = 0;
  music.play();
  start.classList.add('hide');
  gameArea.innerHTML = '';
  setting.score = 0;
  record.classList.add('hide');


  for (let i = 0; i < getQtyElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQtyElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url('./image/enemy${Math.round(Math.random() * 2)}.png') center / cover no-repeat`;
    gameArea.appendChild(enemy);
  }

  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px';
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}


function playGame() {

  if (setting.start) {

    setting.score += setting.speed;
    score.innerHTML = 'SCORE:<br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
      setting.x += setting.speed;
    }
    if (keys.ArrowDown && setting.y < gameArea.offsetHeight - car.offsetHeight) {
      setting.y += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
  }

  const reqId = requestAnimationFrame(playGame);

  if (!setting.start) {
    cancelAnimationFrame(reqId);
    music.pause();
  }
}

function startRun(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function stopRun(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function moveRoad() {
  const lines = document.querySelectorAll('.line');
  lines.forEach(line => {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  const enemyes = document.querySelectorAll('.enemy');

  enemyes.forEach(enemy => {

    const carRect = car.getBoundingClientRect(),
      enemyRect = enemy.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom &&
        carRect.right >= enemyRect.left &&
        carRect.left <= enemyRect.right &&
        carRect.bottom >= enemyRect.top) {
      setting.start = false;
      start.classList.remove('hide');
      start.style.top = score.offsetHeight + 'px';
      if (+localStorage.getItem('bestscore') < setting.score) {
        localStorage.setItem('bestscore', setting.score);
        record.classList.remove('hide');
      }
    }

    enemy.y += setting.speed / 2;
    enemy.style.top = enemy.y + 'px';

    if (enemy.y >= document.documentElement.clientHeight) {
      enemy.y = -100 * setting.traffic;
      enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }

  });
}


