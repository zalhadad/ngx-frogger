export class Rectangle {
  private x: any;
  private y: any;
  private w: any;
  private h: any;
  private delta;

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.delta = 0.5;
  }

  intersects(other) {
    return !(
      this.x + this.w / this.h - this.delta <= other.x ||
      this.x + this.delta >= other.x + other.w / other.h ||
      this.y + 0.9 < other.y ||
      this.y > other.y + 0.9
    );
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }
}
