import {Component, OnInit} from '@angular/core';
import 'p5';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import {Arrivee} from '../classes/arrivee';

@Component({
  selector: 'ngx-frogger',
  template: ``,
  styles: []
})
export class NgxFroggerComponent implements OnInit {

  p5;
  canvas;
  private arrivee: Arrivee;
  private res: number;

  constructor() {
  }

  ngOnInit() {
    const sketch = (s) => {

      s.preload = () => {
        // preload code
      };

      s.setup = () => {
        this.canvas = s.createCanvas(800, 800);
        this.res = this.canvas.width / 20;
        this.arrivee = new Arrivee(s, this.res);
      };

      s.draw = () => {
        s.background(50);
        s.fill(255, 0, 0);
        s.noStroke();
        s.rect(0, 750, this.canvas.width, 50);
        this.arrivee.show();
      };
    };

    const resultat = new p5(sketch);
  }
}
