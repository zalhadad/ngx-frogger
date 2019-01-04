import {Frog} from './frog';

export class BonusFrog extends Frog {

  lifeDuration;
  attachedToFrog;
  private offset: number;
  private dir: number;
  private frameRate: number;

  constructor(p5, boat, taille, canvas) {
    super(p5, boat.rect.x, boat.rect.y, taille, canvas, 'bonusFrog.gif');
    this.offset = this.p5.int(this.p5.random(0, boat.taille));
    this.rect.x += this.offset;
    this.lifeDuration = 3 || this.p5.int(this.p5.random(5, 16));
    this.attachedToFrog = false;
    this.sittingOn = boat;
    this.dir = 1;
    this.angle = 90;
    this.img.hide();
    this.img.style('rotate', this.angle);
    boat.bonus = this;
    this.frameRate = 60 || this.p5.int(this.p5.frameRate())
  }

  update() {
    if (this.lifeDuration < 0 && !this.attachedToFrog) {
      this.remove();
    }

    this.rect.y = Math.round(this.rect.y);
    if (this.sittingOn !== null) {
      this.rect.x = this.offset + this.sittingOn.rect.x;
    }
    if (this.p5.frameCount % this.frameRate === 0) {
      this.move(this.dir, 0, null);
      this.offset += this.dir;
      this.lifeDuration -= 1;
    }

    if (this.rect.x >= this.sittingOn.rect.x + this.sittingOn.taille - 1 && this.angle === 90) {
      this.dir = -1;
    } else if (this.rect.x <= this.sittingOn.rect.x && this.angle === 270) {
      this.dir = 1;
    }
    this.img.position(this.rect.x * this.rect.w + this.canvas.position().x, this.rect.y * this.rect.h + this.canvas.position().y);
  }

  show() {
    if (!this.arrived
      && !this.removed
      && !this.attachedToFrog
      && this.rect.x < this.p5.width / this.rect.w - 1
      && this.rect.x > 0) {
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

  remove(){
    this.sittingOn.bonus = undefined;
    super.remove();
  }
}
