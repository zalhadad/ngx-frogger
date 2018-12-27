import {Rectangle} from './rectangle';
import {Arrivee} from './arrivee';

export class Frog {
  rect;
  sittingOn;
  angle;
  arrived: boolean;
  left;
  right;
  up;
  down;
  private img: any;
  private imgFixed: any;
  private p5: any;
  private canvas: any;
  private removed: boolean;

  constructor(p5, x, y, taille, canvas) {
    this.p5 = p5;
    this.sittingOn = null;
    this.rect = new Rectangle(x, y, taille, taille);
    this.imgFixed = this.p5.loadImage('assets/sprites/frog.gif');
    this.img = this.p5.createImg('assets/sprites/frog.gif');
    this.img.size(taille, taille);
    this.img.style('transition: transform 0.1s ease-in-out');
    this.img.style('z-index: 1000');
    this.angle = 0;
    this.arrived = false;
    this.canvas = canvas;
    this.removed = false;
  }

  update() {
    this.rect.y = Math.round(this.rect.y);
    if (this.sittingOn !== null) {
      this.rect.x += this.sittingOn.speed / this.rect.w;
    }

    this.rect.x = this.p5.constrain(this.rect.x, 0, (this.p5.width - this.rect.w) / this.rect.w);
    this.rect.y = this.p5.constrain(this.rect.y, 1, (this.p5.height - this.rect.h) / this.rect.h);
    this.sittingOn = null;

    this.img.position(this.rect.x * this.rect.w + this.canvas.position().x, this.rect.y * this.rect.h + this.canvas.position().y);
  }

  move(x, y, arrivee: Arrivee) {
    if (y) {
      this.rect.x = Math.round(this.rect.x);
      this.rect.y = Math.round(this.rect.y);
    }

    if (this.rect.y === 2 && y === -1) {
      if (arrivee.canEnter(this.rect.x)) {
        arrivee.enterArrivee(this.rect.x);
        this.rect.move(x, y);
        this.arrived = true;
      }
    } else {
      this.rect.move(x, y);
    }

    if (x === -1) {
      this.angle = 270;
    }
    if (x === 1) {
      this.angle = 90;
    }
    if (y === -1) {
      this.angle = 0;
    }
    if (y === 1) {
      this.angle = 180;
    }

    this.img.style('rotate', this.angle);

  }

  show() {
    if (this.p5.keyIsPressed && !this.arrived && !this.removed) {
      this.img.show();
    } else {
      this.img.hide();
      this.p5.push();
      this.p5.translate(this.rect.x * this.rect.w + this.rect.w / 2, this.rect.y * this.rect.h + this.rect.h / 2);
      this.p5.angleMode(this.p5.DEGREES);
      this.p5.rotate(this.angle);
      this.p5.imageMode(this.p5.CENTER);
      this.p5.image(this.imgFixed, 0, 0, this.rect.w, this.rect.h);
      this.p5.imageMode(this.p5.CORNER);
      this.p5.pop();
    }
  }

  intersects(obstacle) {
    return this.rect.intersects(obstacle.rect);
  }

  remove() {
    this.img.remove();
    this.removed = true;
    this.show();
  }
}
