import {Component, OnInit} from '@angular/core';
import 'p5';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import {Arrivee} from '../classes/arrivee';
import {SafeZone} from '../classes/safeZone';
import {Frog} from '../classes/frog';
import {Row} from '../classes/row';

@Component({
  selector: 'ngx-frogger',
  template: ``,
  styles: []
})
export class NgxFroggerComponent implements OnInit {

  p5;
  canvas;
  level;
  roadImg;
  waterImg;
  private depart: SafeZone;
  private checkpoint: SafeZone;
  private arrivee: Arrivee;
  private frogs: Frog[];
  private currentFrog: Frog;
  private res: number;
  private cols: number;
  private rows: Row[];

  constructor() {
  }

  ngOnInit() {
    const sketch = (s) => {

      s.preload = () => {
        this.roadImg = s.loadImage('assets/sprites/road.png');
        this.waterImg = s.loadImage('assets/sprites/water.jpg');
      };

      s.setup = () => {
        s.frameRate(60);

        this.canvas = s.createCanvas(800, 800);
        this.cols = 15;

        this.level = 1;

        this.res = this.canvas.width / this.cols;
        this.depart = new SafeZone(s, this.res, this.cols - 1);
        this.checkpoint = new SafeZone(s, this.res, Math.floor(this.cols / 2));
        this.arrivee = new Arrivee(s, this.res);

        this.init(s);
      };

      s.draw = () => {
        s.clear();
        for (let i = 0; i < this.cols; i += 1) {
          for (let j = 2; j < this.cols - 1; j += 1) {
            s.image(j > Math.floor(this.cols / 2) ? this.roadImg : this.waterImg, i * this.res, j * this.res, this.res, this.res);
          }
        }
        this.depart.show();
        this.checkpoint.show();
        this.arrivee.show();

        this.rows.forEach(r => r.update());

        if (this.currentFrog.arrived) {
          this.currentFrog = new Frog(s, Math.floor(this.cols / 2), this.cols - 1, this.res);
          this.frogs.push(this.currentFrog);

        }
        this.currentFrog.update();
        this.frogs.forEach(f => f.show());

        this.rows.forEach(r => {
          const obstacle = r.hits(this.currentFrog);
          if (obstacle) {
            if (obstacle.type === 'car') {
              /*s.createDiv('perdu');
              s.noLoop();*/
            } else {
              this.currentFrog.sittingOn = obstacle;
            }
          }
        });

        if (this.currentFrog.rect.y < Math.floor(this.cols / 2) && !this.currentFrog.sittingOn) {
          /*s.createDiv('perdu');
          s.noLoop();*/
        }

        if (this.arrivee.goToNextLevel()) {
          s.createDiv('victoire');
          this.init(s);
        }
      };
      s.keyPressed = () => {
        switch (s.keyCode) {
          case s.LEFT_ARROW:
            this.currentFrog.move(-1, 0, this.arrivee);
            break;
          case s.RIGHT_ARROW:
            this.currentFrog.move(1, 0, this.arrivee);
            break;
          case s.UP_ARROW:
            this.currentFrog.move(0, -1, this.arrivee);
            break;
          case s.DOWN_ARROW:
            this.currentFrog.move(0, 1, this.arrivee);
            break;
        }
        return true;
      };

    };

    const resultat = new p5(sketch);
  }

  private init(s) {

    this.rows = [];
    this.frogs = [];

    this.level += 1;
    this.arrivee.reset();

    for (let i = 2; i < this.cols - 1; i += 1) {
      if (i !== Math.floor(this.cols / 2)) {
        this.rows.push(new Row(s, i, this.res, s.random(this.level - 1 , this.level + 2), this.cols));
      }
    }
    this.currentFrog = new Frog(s, Math.floor(this.cols / 2), this.cols - 1, this.res);
    this.frogs.push(this.currentFrog);
  }
}
