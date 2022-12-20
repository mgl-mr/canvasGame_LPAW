import Circle from "./geometries/Circle";
import Score from "./Score"
import Enemy from "./Enemy";
import Hero from "./Hero";
import Coin from "./Coin";
import { loadImage, loadAudio } from "./loaderAssets";
import { keyPress, key } from "./keyboard";

let CTX;
let CANVAS;
const FRAMES = 60;
const qtdEnemies =15;
let points = 0;

let enemies;
let hero;
let orange;
let score;

let heroSprite ;
let enemySprite;
let coinImage;
let background;

let gameOverSound;
let scoreSound;
let theme;

let gameover = true;
let anime;

let boundaries;
let loaded = true;

const init = async () => {
  if(loaded) {
    gameOverSound = await loadAudio('sounds/gameOver.mp3');
    scoreSound = await loadAudio('sounds/score.mp3');
    theme = await loadAudio('sounds/theme.mp3');

    background = await loadImage('img/background.jpg');
    heroSprite = await loadImage('img/goblin.png');
    enemySprite = await loadImage('img/enemy.png');
    coinImage = await loadImage('img/coin.png');
  }
  
  loaded = false;

  enemies = Array.from({length:qtdEnemies});
  hero = new Hero(300, 100, 20, 4, 41, 44.5, 'img/goblin.png', FRAMES);
  orange = new Coin((Math.random()*550) + 15,( Math.random()*350) + 15, 15, 0, coinImage);
  score = new Score(`Score: ${points}`, 600);

  points = 0;

	CANVAS = document.querySelector('canvas');
	CTX = CANVAS.getContext('2d');
	
	boundaries = {
		width: CANVAS.width,
		height: CANVAS.height
	}

	enemies = enemies.map(i=>new Enemy(
		Math.random()*CANVAS.width,
		Math.random()*CANVAS.height,
		10, 
    3, 
    enemySprite,
    FRAMES
	));

  gameOverSound.volume = .5;
  scoreSound.volume = .5;
  theme.volume = .2;
  theme.loop = true;

  gameover = false;

  CTX.font = 'normal 24px arial';
  CTX.textBaseline = 'top';
  CTX.fillStyle = 'yellow';

  CTX.fillText('WASD to move', 230 , 100);
  CTX.fillText('(no capsLock)', 238 , 130);
  CTX.fillText('Press ENTER key to start', 200 , 300);
		
	keyPress(window);

	start();
}

const start = () => {
  setTimeout(() => {
    let startAnime;

    if (key != "Enter") {
      startAnime = requestAnimationFrame(start);
    } else {
      theme.play();
      cancelAnimationFrame(startAnime);
      loop();
    }
  
  }, 1000 / FRAMES);
}

const loop = () => {
	setTimeout(() => {
		CTX.drawImage(background, 0, 0, CANVAS.width, CANVAS.height);
  
    score.draw(CTX);

		hero.move(boundaries, key);
		hero.draw(CTX);

		enemies.forEach(e =>{
			e.move(boundaries, 0) 
			e.draw(CTX)
			gameover = !gameover ? e.colide(hero) : true;
		}); 

    if(orange.colide(hero)) {
      scoreSound.load();
      scoreSound.play();

      orange.x = (Math.random()*(CANVAS.width - orange.size));
      orange.y = (Math.random()*(CANVAS.height - orange.size));
      
      points ++;
      score.text = `Score: ${points}`;
    }

    orange.draw(CTX);

		if (gameover) {
			console.error('DEAD!!!');
      theme.pause();
      gameOverSound.play(); 
      
      CTX.clearRect(0, 0, CANVAS.width, 30);
      
      score.text += ' GAME OVER !!';
      score.color = 'red';
      
      score.draw(CTX);

			cancelAnimationFrame(anime);
      init();
		} else	anime = requestAnimationFrame(loop);

    
	}, 1000 / FRAMES);
}

export { init }