export class Arrivee {

  p5;
  img;
  holeImg;
  size;
  tableArrivee;

  cols;
  mark;
  hole;

  constructor(p5, size) {
    this.p5 = p5;
    this.size = size;
    this.img = this.p5.loadImage('assets/sprites/wall.jpg');
    this.holeImg = this.p5.loadImage('assets/sprites/lilypad.jpg');
    this.cols = Math.round(this.p5.width / this.size);
    this.mark = 0;
    this.hole = 0;

    if (this.cols % 2 === 0) {
      this.mark = this.p5.width / 5;
    } else {
      this.mark = this.p5.width / 4;
    }
    this.hole = this.mark;

    this.tableArrivee = new Array(this.cols);
    for (let i = 0; i < this.cols; i += 1) {

      const currentEnd = (i + 1) * this.size;
      if (i !== 0 && !((this.hole > this.p5.width / 2 && currentEnd <= this.hole)
        || currentEnd < this.hole
        || i === (this.cols - 1))) {
        this.tableArrivee[i] = false;
        this.hole += this.mark;
      }
    }
  }

  show() {

    this.hole = 0;
    for (let i = 0; i < this.cols; i += 1) {
      this.p5.image(this.img, i * this.size, 0, this.size, this.size);

      const currentEnd = (i + 1) * this.size;
      if ((this.hole > this.p5.width / 2 && currentEnd <= this.hole)
        || currentEnd < this.hole
        || i === (this.cols - 1)) {
        this.p5.image(this.img, i * this.size, this.size, this.size, this.size);
      } else {
        if (i === 0) {
          this.p5.image(this.img, i * this.size, this.size, this.size, this.size);
        } else {
          this.p5.image(this.holeImg, i * this.size, this.size, this.size, this.size);
        }
        this.hole += this.mark;
      }
    }
  }

  canEnter(i) {
    return this.tableArrivee[i] === false;
  }

  enterArrivee(i) {
    if (this.canEnter(i)) {
      this.tableArrivee[i] = true;
    }
  }

  goToNextLevel() {
    return this.tableArrivee.every((col) => col);
  }

  reset() {
    this.tableArrivee.forEach((e, i) => this.tableArrivee[i] = false);
  }
}
