export class Rectangle {
  private x: any;
  private y: any;
  private w: any;
  private h: any;

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  intersects(other) {
    return !(
      this.x + this.w / this.h <= other.x ||
      this.x >= other.x + other.w / other.h ||
      this.y + 0.9 < other.y ||
      this.y > other.y + 0.9
    );
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }
}
