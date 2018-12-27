import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import 'p5';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import {Arrivee} from '../classes/arrivee';
import {SafeZone} from '../classes/safeZone';
import {Frog} from '../classes/frog';
import {Row} from '../classes/row';
import * as moment_ from 'moment';
import 'moment-duration-format';

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
  private frogs: Frog[];
  private currentFrog: Frog;
  private res: number;
  private cols: number;
  private rows: Row[];
  private gameStopped: boolean;
  private currentFrame: number;

  constructor() {
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

        this.canvas = s.createCanvas(800, 800);
        this.canvas.parent('canvas-holder');
        this.cols = 15;

        this.res = this.canvas.width / this.cols;
        this.depart = new SafeZone(s, this.res, this.cols - 1);
        this.checkpoint = new SafeZone(s, this.res, Math.floor(this.cols / 2));
        this.arrivee = new Arrivee(s, this.res);

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

        this.rows.forEach(r => r.update());

        this.timer = moment.duration(moment().diff(this.start));
        this.gameTimer = moment.duration(moment().diff(this.gameStart));
        s.textAlign(s.LEFT, s.CENTER);
        s.textSize(15);
        s.fill(255);
        const gameTimeDisplay = 'Total : ' + (this.gameTimer.format().includes('milliseconds') ? '0:00' : this.gameTimer.format()) + ' min';
        s.text(gameTimeDisplay, 20, 20);
        const timeDisplay = 'Niveau Actuel : ' + (this.timer.format().includes('milliseconds') ? '0:00' : this.timer.format()) + ' min';
        s.text(timeDisplay, 20, 40);
        if (Math.round(this.currentFrog.rect.y) < this.yReached) {
          this.yReached = this.currentFrog.rect.y;
          this.score += 10;
        }

        if (this.currentFrog.arrived) {
          this.score += 50;
          this.yReached = this.cols - 1;
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

        if (this.arrivee.goToNextLevel()) {
          this.times.push({level: this.level, time: this.timer});
          this.score += 100;
          this.init(s);
        }

        const scoreDisplay = 'Score : ' + this.score;
        s.textAlign(s.LEFT, s.CENTER);
        s.text(scoreDisplay, s.width - 150, 20);
        const levelDisplay = 'Level ' + this.level;
        s.text(levelDisplay, s.width - 150, 40);


        this.rows.forEach(r => {
          const obstacle = r.hits(this.currentFrog);
          if (obstacle) {
            if (obstacle.type === 'car') {
              this.gameEnd(s);
            } else {
              this.currentFrog.sittingOn = obstacle;
            }
          }
        });

        if (this.currentFrog.rect.y < Math.floor(this.cols / 2) && !this.currentFrog.sittingOn) {
          this.gameEnd(s);
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

    const resultat = new p5(sketch);
  }

  ngOnDestroy() {
    this.p5.remove();
  }

  reset() {
    this.gameStart = moment();
    this.level = 0;
    this.times = [];
    this.score = 0;
    this.init(this.p5);
    this.p5.loop();
    this.gameStopped = false;
  }

  private gameEnd(s) {
    s.background(100, 0, 0, 100);
    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(100);
    s.text('GAME OVER', s.width / 2, s.height / 2);
    s.noLoop();

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

  private init(s) {

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
        this.rows.push(new Row(s, i, this.res, s.random(this.level, this.level + 2), this.cols));
      }
    }
    this.currentFrog = new Frog(s, Math.floor(this.cols / 2), Math.round(this.cols - 1), this.res, this.canvas);
    this.currentFrame = 1;
    this.frogs.push(this.currentFrog);
  }
}
