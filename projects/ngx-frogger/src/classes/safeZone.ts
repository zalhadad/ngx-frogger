export class SafeZone {

  p5;
  img;
  size;

  cols;
  row;

  constructor(p5, size, row) {
    this.p5 = p5;
    this.size = size;
    this.img = this.p5.loadImage('assets/sprites/wall.jpg');
    this.cols = Math.round(this.p5.width / this.size);
    this.row = row;
  }

  show() {

    for (let i = 0; i < this.cols; i += 1) {
      this.p5.image(this.img, i * this.size, this.row * this.size, this.size, this.size);
    }
  }
}
