import {Obstacle} from './obstacle';

export class Row {

  p5;
  res;
  speed;
  cols;
  inverted;

  type;
  obstacles: Obstacle[];

  constructor(p5, y, res, speed, cols) {
    this.p5 = p5;
    this.res = res;
    this.speed = speed;
    this.cols = cols;
    this.inverted = this.p5.int(this.p5.random(1, 3)) === 2 ? -1 : 1;
    this.obstacles = [];
    this.type = (y > this.cols / 2 ? 'car' : 'boat');
    const min = (this.type === 'boat' ? 3 : 2);

    let reste = this.cols;
    let size = 0;
    let offset = 0;
    let place = 0;

    while (reste > 0) {
      size = this.p5.int(this.p5.random(min, 5));
      offset = this.p5.int(this.p5.random(7, this.cols - 3));
      place += offset;

      this.obstacles.push(new Obstacle(this.p5, place, y, size, this.res, this.inverted * this.speed, this.type));

      place += size;
      reste -= (size + offset);
    }
  }

  update() {
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].update();
      this.obstacles[i].show();
    }
  }

  hits(collider) {
    let obstacle = null;
    for (let i = 0; i < this.obstacles.length; i++) {
      if (collider.intersects(this.obstacles[i])) {
        obstacle = this.obstacles[i];
      }
    }
    return obstacle;
  }
}
