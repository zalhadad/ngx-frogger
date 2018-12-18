export class Arrivee {

  p5;
  img;
  size;

  constructor(p5, size) {
    this.p5 = p5;
    this.size = size;
    this.img = this.p5.loadImage('assets/sprites/grass.png');
  }

  show() {
    const cols = Math.round(this.p5.width / this.size);
    let mark = 0;
    let hole = 0;
    if (cols > 6) {
      if (cols % 2 === 0) {
        mark = this.p5.width / 5;
      } else {
        mark = this.p5.width / 4;
      }
      hole = mark;
    } else {
      mark = this.p5.width / 2;
      hole = 1;
    }
    for (let i = 0; i < cols; i += 1) {
      this.p5.image(this.img, i * this.size, 0, this.size, this.size);

      const currentEnd = (i + 1) * this.size;
      if ((hole > this.p5.width / 2 && currentEnd <= hole)
        || currentEnd < hole
        || i === (cols - 1)) {
        this.p5.image(this.img, i * this.size, this.size, this.size, this.size);
      } else {
        if (i === 0) {
          this.p5.image(this.img, i * this.size, this.size, this.size, this.size);
        }
        this.p5.image(this.img, hole, this.size * 2, 1, this.size);
        hole += mark;
      }
    }
  }

}
