import {Rectangle} from './rectangle';

export class Obstacle {

  p5;
  rect;
  speed;
  taille;
  type;
  img;
  res;
  bonus;
  private dir: number;

  constructor(p5, x, y, taille, res, speed, type) {
    this.p5 = p5;
    this.rect = new Rectangle(x, y, taille * res, res);
    this.res = res;
    this.speed = speed;
    this.taille = taille;
    this.type = type;
    this.dir = this.speed > 0 ? 0 : 180;
    this.img = this.p5.loadImage(this.getFilename(taille, type));
  }

  update() {
    if (this.rect.x * this.res + this.rect.w < 0 && this.speed < 0) {
      this.rect.x = this.p5.width / this.res + 4 - this.taille;
    }
    if (this.rect.x * this.res > this.p5.width && this.speed > 0) {
      this.rect.x = -4;
    }

    this.rect.move(this.speed / this.res, 0);

    if (this.bonus) {
      this.bonus.update();
    }

  }

  show() {
    this.p5.push();
    this.p5.translate(this.rect.x * this.res + this.rect.w / 2, this.rect.y * this.res + this.rect.h / 2);
    this.p5.angleMode(this.p5.DEGREES);
    this.p5.rotate(this.dir);
    this.p5.imageMode(this.p5.CENTER);
    this.p5.image(this.img, 0, 0, this.rect.w, this.rect.h);
    this.p5.imageMode(this.p5.CORNER);
    this.p5.pop();

    if (this.bonus) {
      this.bonus.show();
    }
  }

  private getFilename(taille, type) {
    const tailles = {
      boat: {
        '3': 5,
        '4': 11,
      },
      car: {
        '2': 8,
        '3': 2,
        '4': 2,
      }
    };

    const random = this.p5.int(this.p5.random(1, tailles[type][taille] + 1));

    return `assets/sprites/${type}s/${taille}-${random}.png`;
  }
}
