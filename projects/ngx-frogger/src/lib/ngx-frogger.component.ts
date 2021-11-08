import {Component, EventEmitter, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import 'p5';
import * as p5 from 'p5';
import {Arrivee} from '../classes/arrivee';
import {SafeZone} from '../classes/safeZone';
import {Frog} from '../classes/frog';
import {Row} from '../classes/row';
import * as moment_ from 'moment';
import 'moment-duration-format';
import {Life} from '../classes/life';
import {Obstacle} from '../classes/obstacle';
import {BonusFrog} from '../classes/bonusFrog';

const moment = moment_;

@Component({
  selector: 'ngx-frogger',
  template: `
    <div id='canvas-holder'></div>`,
  styles: []
})
export class NgxFroggerComponent implements OnInit, OnDestroy {

  @Output() gameOver: EventEmitter<{
    totalTime: number,
    score: number,
    levelsTimes: Array<{
      level: number,
      time: number
    }>
  }>;
  p5;
  canvas;
  level;
  roadImg;
  waterImg;

  start;
  gameStart;
  timer;
  gameTimer;
  times;
  score;
  yReached;

  private depart: SafeZone;
  private checkpoint: SafeZone;
  private arrivee: Arrivee;
  private lifes: Life;
  private frogs: Frog[];
  private currentFrog: Frog;
  private res: number;
  private cols: number;
  private rows: Row[];
  private gameStopped: boolean;
  private currentFrame: number;
  private textPosition;

  private bonusBoat: Obstacle;
  private bonusSpawnTime: number;
  private bonusFrog: BonusFrog;
  private SCORE_FROG = 50;
  private SCORE_LEVEL = 100;
  private SCORE_STEP = 10;
  private SCORE_BONUS = 3;

  constructor(private zone: NgZone) {
    this.gameOver = new EventEmitter<{
      totalTime: number,
      score: number,
      levelsTimes: Array<{
        level: number,
        time: number
      }>
    }>();
  }

  ngOnInit() {
    const sketch = (s) => {
      this.p5 = s;
      s.preload = () => {
        this.roadImg = s.loadImage('assets/sprites/road.png');
        this.waterImg = s.loadImage('assets/sprites/water.jpg');
      };

      s.setup = () => {
        s.frameRate(60);
        const size = s.windowHeight - 90;
        this.canvas = s.createCanvas(size, size);
        this.canvas.parent('canvas-holder');
        this.cols = 15;
        this.textPosition = this.canvas.width / 5;

        this.res = this.canvas.width / this.cols;
        this.depart = new SafeZone(s, this.res, this.cols - 1);
        this.checkpoint = new SafeZone(s, this.res, Math.floor(this.cols / 2));
        this.arrivee = new Arrivee(s, this.res);
        this.lifes = new Life(s, 0, this.res * 1.5, this.res);

        this.reset();

      };

      s.draw = () => {
        if (this.gameStopped) {
          return false;
        }

        s.clear();
        this.currentFrame = (this.currentFrame + 1) % 60;

        for (let i = 0; i < this.cols; i += 1) {
          for (let j = 2; j < this.cols - 1; j += 1) {
            s.image(j > Math.floor(this.cols / 2) ? this.roadImg : this.waterImg, i * this.res, j * this.res, this.res, this.res);
          }
        }
        this.depart.show();
        this.checkpoint.show();
        this.arrivee.show();
        this.lifes.show();

        this.rows.forEach(r => r.update());

        if (this.currentFrog.arrived) {
          this.score += this.currentFrog.bonus ? this.SCORE_FROG * this.level * this.SCORE_BONUS : this.SCORE_FROG * this.level;
          this.yReached = this.cols - 1;
          if (this.currentFrog.bonus) {
            this.bonusFrog = undefined;
          }
          this.currentFrog = new Frog(s, Math.floor(this.cols / 2), this.cols - 1, this.res, this.canvas);
          this.frogs.push(this.currentFrog);
        }

        if (this.currentFrame % 15 === 0) {

          if (this.currentFrog.left) {
            this.currentFrog.move(-1, 0, this.arrivee);
          }
          if (this.currentFrog.right) {
            this.currentFrog.move(1, 0, this.arrivee);
          }
          if (this.currentFrog.up) {
            this.currentFrog.move(0, -1, this.arrivee);
          }
          if (this.currentFrog.down) {
            this.currentFrog.move(0, 1, this.arrivee);
          }
        }
        this.currentFrog.update();
        this.frogs.forEach(f => f.show());

        this.makeBonus();

        if (this.bonusFrog && !this.bonusFrog.attachedToFrog && this.bonusFrog.intersects(this.currentFrog)) {
          this.bonusFrog.attachToFrog(this.currentFrog);
        }

        if (this.arrivee.goToNextLevel()) {
          this.times.push({level: this.level, time: this.timer});
          this.score += (this.SCORE_LEVEL * this.level);
          this.lifes.addLife();
          this.init();
        }

        this.timer = moment.duration(moment().diff(this.start));
        this.gameTimer = moment.duration(moment().diff(this.gameStart));

        if (Math.round(this.currentFrog.rect.y) < this.yReached) {
          this.yReached = this.currentFrog.rect.y;
          this.score += (this.SCORE_STEP * this.level);
        }

        const gameTimeDisplay = 'Total : ' + (this.gameTimer.format().includes('milliseconds') ? '0:00' : this.gameTimer.format()) + ' min';
        const timeDisplay = 'Niveau Actuel : ' + (this.timer.format().includes('milliseconds') ? '0:00' : this.timer.format()) + ' min';
        const scoreDisplay = 'Score : ' + this.score;
        const levelDisplay = 'Level ' + this.level;

        s.fill(255);
        s.text(gameTimeDisplay, this.textPosition, 20);
        s.text(timeDisplay, this.textPosition * 2, 20);
        s.text(scoreDisplay, this.textPosition * 3, 20);
        s.text(levelDisplay, this.textPosition * 4, 20);


        this.rows.forEach(r => {
          const obstacle = r.hits(this.currentFrog);
          if (obstacle) {
            if (obstacle.type === 'car') {
              this.nextLife();
            } else {
              this.currentFrog.sittingOn = obstacle;
            }
          }
        });

        if (this.currentFrog.rect.y < Math.floor(this.cols / 2) && !this.currentFrog.sittingOn) {
          this.nextLife();
        }
        if (this.bonusFrog && this.bonusFrog.removed) {
          this.bonusFrog = undefined;
        }
      };
      s.keyPressed = () => {
        switch (s.keyCode) {
          case s.LEFT_ARROW:
            this.currentFrog.move(-1, 0, this.arrivee);
            this.currentFrog.left = true;
            break;
          case s.RIGHT_ARROW:
            this.currentFrog.move(1, 0, this.arrivee);
            this.currentFrog.right = true;
            break;
          case s.UP_ARROW:
            this.currentFrog.move(0, -1, this.arrivee);
            this.currentFrog.up = true;
            break;
          case s.DOWN_ARROW:
            this.currentFrog.move(0, 1, this.arrivee);
            this.currentFrog.down = true;
            break;
        }
        this.currentFrame = 1;
        return true;
      };

      s.keyReleased = () => {
        switch (s.keyCode) {
          case s.LEFT_ARROW:
            this.currentFrog.left = false;
            return false;
          case s.RIGHT_ARROW:
            this.currentFrog.right = false;
            return false;
          case s.UP_ARROW:
            this.currentFrog.up = false;
            return false;
          case s.DOWN_ARROW:
            this.currentFrog.down = false;
            return false;
        }
        return true;
      };

    };
    this.zone.runOutsideAngular(() => {
      const resultat = new p5(sketch);
    });
  }

  ngOnDestroy() {
    this.p5.remove();
  }

  reset() {
    this.gameStart = moment();
    this.level = 0;
    this.times = [];
    this.score = 0;
    this.lifes.reset();
    this.init();
    this.p5.loop();
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(15);
    this.gameStopped = false;
  }

  private nextLife() {
    this.lifes.removeLife();

    if (this.lifes.getLifes() < 0) {
      this.gameEnd();
    } else {
      const y = this.yReached < Math.floor(this.cols / 2) ? Math.floor(this.cols / 2) : Math.round(this.cols - 1);
      this.currentFrog = new Frog(this.p5, Math.floor(this.cols / 2), y, this.res, this.canvas);
      this.currentFrame = 1;
      const old = this.frogs.pop();
      old.remove();
      this.frogs.push(this.currentFrog);
      if (this.bonusFrog) {
        this.bonusFrog.remove();
      }
      this.bonusFrog = undefined;
      this.bonusSpawnTime = undefined;
    }
  }

  private gameEnd() {
    this.p5.background(100, 0, 0, 100);
    this.p5.textSize(100);
    this.p5.text('GAME OVER', this.p5.width / 2, this.p5.height / 2);
    this.p5.noLoop();

    if (this.frogs && this.frogs.length) {
      this.frogs.forEach(f => f.remove());
    }

    this.gameStopped = true;

    this.gameOver.emit({
      totalTime: this.gameTimer,
      score: this.score,
      levelsTimes: this.times
    });
  }

  private init() {

    this.start = moment();
    this.yReached = this.cols - 1;

    this.rows = [];
    if (this.frogs && this.frogs.length) {
      this.frogs.forEach(f => f.remove());
    }
    this.frogs = [];

    this.level += 1;
    this.arrivee.reset();

    for (let i = 2; i < this.cols - 1; i += 1) {
      if (i !== Math.floor(this.cols / 2)) {
        this.rows.push(new Row(this.p5, i, this.res, this.p5.random(this.level, this.level + 2), this.cols));
      }
    }

    this.currentFrog = new Frog(this.p5, Math.floor(this.cols / 2), Math.round(this.cols - 1), this.res, this.canvas);
    this.currentFrame = 1;
    this.frogs.push(this.currentFrog);

    if (this.bonusFrog) {
      this.bonusFrog.remove();
    }
    this.bonusFrog = undefined;
    this.bonusSpawnTime = undefined;
  }

  private makeBonus() {
    if (!this.bonusSpawnTime && !this.bonusFrog) {
      this.bonusSpawnTime = this.p5.int(this.p5.random(5, 16)) * 1000 + this.timer;
    }
    if (this.bonusSpawnTime && this.bonusSpawnTime - this.timer < 0) {
      this.bonusBoat = this.getRandomBoat();
      this.bonusFrog = new BonusFrog(this.p5, this.bonusBoat, this.res, this.canvas);
      this.bonusSpawnTime = undefined;
    }
  }

  private getRandomBoat() {
    const boatRows = this.rows.filter(r => r.type === 'boat');
    const rand = this.p5.int(this.p5.random(0, boatRows.length));
    const boats = this.rows[rand].obstacles;
    const randBoat = this.p5.int(this.p5.random(0, boats.length));
    return boats[randBoat];
  }
}
