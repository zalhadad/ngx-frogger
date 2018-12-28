export class Life {
  private img: any;
  private p5: any;
  private x;
  private y;
  private w;
  private h;
  private count;
  private _count: number;

  constructor(p5, x, y, res, count = 3) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.w = res / 2;
    this.h = res / 2;
    this.count = count;
    this._count = count;
    this.img = this.p5.loadImage('assets/sprites/frog.gif');
  }

  show() {
    this.p5.push();
    this.p5.translate(this.x, this.y - this.w * 0.9);
    for (let i = 1; i <= this.count; i += 1) {
      if (i === 6) {
        this.p5.translate(-this.w * 1.2 * 5, this.w * 1);
      }
      this.p5.image(this.img, 0, 0, this.w, this.h);
      this.p5.translate(this.w * 1.2, 0);
    }
    this.p5.pop();
  }

  getLifes() {
    return this.count;
  }

  addLife() {
    this.count += 1;
  }

  removeLife() {
    this.count -= 1;
  }

  reset() {
    this.count = this._count;
  }
}
