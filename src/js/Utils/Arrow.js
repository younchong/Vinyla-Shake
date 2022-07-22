import { random, map, clamp } from "./util";
import { Vector } from "./Vector";

export class Arrow {
  constructor(x, y, target, position) {
    this.position = new Vector(x, y);
    this.velocity = new Vector().fromAngle(random(0, Math.PI * 2));
    this.acceleration = new Vector(0, 0);
    this.target = target;
    this.travelled_distance = 0;
    this.min_size = 1;
    this.max_size = 2;
    this.size = random(this.min_size, this.max_size);
    this.zone = this.size * 2;
    this.topSpeed = map(this.size, this.min_size, this.max_size, 40, 10);

    const tailLength = Math.floor(
      map(this.size, this.min_size, this.max_size, 4, 16)
    );
    this.tail = [];

    for (let i = 0; i < tailLength; i++) {
      this.tail.push({
        x: this.position.x,
        y: this.position.y,
      });
    }

    this.wiggle_speed = map(this.size, this.min_size, this.max_size, 2, 1.2);
    this.blink_offset = random(0, 100);
    this.alpha = random(0.1, 1);
    this.ctx = position.querySelector(".deck-effect-canvas").getContext("2d");
  }
  render(frame) {
    this.update(frame);
    this.draw(frame);
  }
  update(frame) {
    const old_position = this.position.copy();
    const t = new Vector(this.target.x, this.target.y);
    const angle = this.position.angle(t);
    const d_f_target = t.dist(this.position);
    const f = new Vector().fromAngle(angle);

    f.setMag(map(clamp(d_f_target, 0, 400), 0, 400, 0, this.topSpeed * 0.1));
    this.addForce(f);

    this.velocity.add(this.acceleration);
    if (d_f_target < 800) {
      this.velocity.limit(
        map(
          clamp(d_f_target, 0, 800),
          0,
          800,
          this.topSpeed * 0.4,
          this.topSpeed
        )
      );
    } else {
      this.velocity.limit(this.topSpeed);
    }
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.travelled_distance += old_position.dist(this.position);

    const wiggle =
      Math.sin(frame * this.wiggle_speed) *
      map(this.velocity.mag(), 0, this.topSpeed, 0, this.size);
    const w_a = this.velocity.heading() + Math.PI / 2;

    const w_x = this.position.x + Math.cos(w_a) * wiggle;
    const w_y = this.position.y + Math.sin(w_a) * wiggle;

    this.travelled_distance = 0;
    const from = this.tail.length - 1,
      to = 0;
    const n = new Vector().fromAngle(random(0, Math.PI * 2));
    n.setMag(Math.random() * this.size);

    const tail = { x: w_x + n.x, y: w_y + n.y };

    this.tail.splice(from, 1);
    this.tail.splice(to, 0, tail);
  }

  draw(frame) {
    const energy = map(this.velocity.mag(), 0, this.topSpeed, 0.1, 1);
    const color =
      "hsl(" +
      Math.sin((frame + this.blink_offset) * 0.1) * 360 +
      ",50%," +
      map(this.velocity.mag(), 0, this.topSpeed, 40, 100) * this.alpha +
      "%)";
    this.ctx.globalAlpha = this.alpha;

    this.ctx.strokeStyle = color;
    for (let i = 0; i < this.tail.length - 1; i++) {
      const t = this.tail[i];
      const next_t = this.tail[i + 1];

      this.ctx.lineWidth = map(i, 0, this.tail.length - 1, this.size, 1);
      this.ctx.beginPath();
      this.ctx.moveTo(t.x, t.y);
      this.ctx.lineTo(next_t.x, next_t.y);
      this.ctx.closePath();
      this.ctx.stroke();
    }

    const gradient_size = 10 * energy;
    const grd = this.ctx.createRadialGradient(
      this.position.x,
      this.position.y,
      5,
      this.position.x,
      this.position.y,
      gradient_size
    );
    grd.addColorStop(0, "rgba(255,255,255,0.01)");
    grd.addColorStop(0.1, "rgba(255,120,200,0.02)");
    grd.addColorStop(0.9, "rgba(255,255,120,0)");
    grd.addColorStop(1, "rgba(0,0,0,0)");

    this.ctx.fillStyle = grd;
    this.ctx.fillRect(
      this.position.x - gradient_size / 2,
      this.position.y - gradient_size / 2,
      gradient_size,
      gradient_size
    );

    this.ctx.globalAlpha = energy + 0.2;
    this.ctx.fillStyle = "white";

    for (let i = 0; i < 4; i++) {
      const n = new Vector().fromAngle(random(0, Math.PI * 2));
      n.setMag(Math.random() * energy * 10);
      n.add(this.position);
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, Math.random(), 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  addForce(vector) {
    this.acceleration.add(vector);
  }
  avoid(others) {
    others.forEach((other) => {
      if (other !== this) {
        const dist = this.position.dist(other.position),
          max_dist = this.zone + other.size;
        if (max_dist - dist >= 0) {
          const angle = other.position.angle(this.position);
          const force = new Vector().fromAngle(angle);

          force.setMag(map(dist, 0, max_dist, 2, 0));
          this.addForce(force);
        }
      }
    });
  }
}
