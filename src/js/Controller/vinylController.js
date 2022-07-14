import { Controller } from "./controller";

export class VinylController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);

    this.context = null;
    this.source = null;
    this.gainNode = null;

    this.scratching = false;
    this.record;
    this.recordGroup;
    this.surfaceGroup;
    this.angle = 0;
    this.rotationStart = 0;
    this.rotationOffset = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.size = 512;

    this.lastTime = 0;
    this.lastAngle = 0;
    this.duration;

    this.audioTime;
    this.lastPlaybackRate;
    this.playingTime = 0;
    this.startTime = 0;
  }

  init() {
    this.rotateRecord();
  }

  update(information) {
    const { context, source, gainNode } = information;

    this.context = context;
    this.source = source;
    this.gainNode = gainNode;

    this.startTime = context.currentTime;
    this.audioTime = context.currentTime + source.buffer.duration;

    this.init();
  }

  addEvents() {
    this.record = this.target.querySelector("#record_svg");
    this.recordGroup = this.target.querySelector("#record_group");
    this.surfaceGroup = this.target.querySelector("#surface_group");

    if (window.PointerEvent) {
      this.record.addEventListener("pointerdown", this.onMouseDown.bind(this));
      this.record.addEventListener("pointerup", this.onMouseUp.bind(this));
      this.record.addEventListener("pointermove", this.onMouseMove.bind(this));
    } else {
      this.record.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.record.addEventListener("mouseup", this.onMouseUp.bind(this));
      this.record.addEventListener("mousemove", this.onMouseMove.bind(this));
    }
  }

  onMouseDown(e) {
    this.scratching = true;
    this.lastX = e.offsetX;
    this.lastY = e.offsetY;
    this.lastTime = this.context && this.context.currentTime;

    this.source && this.source.playbackRate.setValueAtTime(0, this.lastTime);
  }

  onMouseUp() {
    this.scratching = false;
    this.rotationOffset = this.angle;
    this.rotationStart = -1;

    this.source &&
      this.source.playbackRate.setValueAtTime(1, this.context.currentTime);
    this.lastPlaybackRate = 1;

    this.rotateRecord();
  }

  rotateRecord(timestamp) {
    if (!this.scratching && this.source) {
      if (timestamp >= 0) {
        if (this.rotationStart < 0) {
          this.rotationStart = timestamp;
        }
        this.angle =
          (((timestamp - this.rotationStart) / 5.0) % 360.0) +
          this.rotationOffset;
        this.recordGroup.setAttribute(
          "transform",
          "rotate(" + this.angle + ", 256, 256)"
        );
        this.surfaceGroup.setAttribute(
          "transform",
          "rotate(" + this.angle + ", 256, 256)"
        );
      }
      window.requestAnimationFrame(this.rotateRecord.bind(this));
    }
  }

  onMouseMove(e) {
    if (this.scratching) {
      const deltaX = e.offsetX - this.lastX;
      const deltaY = e.offsetY - this.lastY;
      let rotation = 0;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const direction = e.offsetY > this.size / 2.0 ? -1.0 : 1.0;

        rotation = (deltaX / this.size) * 180.0 * direction;
      } else {
        const direction = e.offsetX > this.size / 2.0 ? 1.0 : -0.5;

        rotation = (deltaY / this.size) * 180.0 * direction;
      }

      this.angle += rotation;
      this.recordGroup.setAttribute(
        "transform",
        "rotate(" + this.angle + ", 256, 256)"
      );
      this.surfaceGroup.setAttribute(
        "transform",
        "rotate(" + this.angle + ", 256, 256)"
      );

      this.lastX = e.offsetX;
      this.lastY = e.offsetY;

      const diff = parseFloat((this.angle - this.lastAngle) / 3).toFixed(2);

      this.lastPlaybackRate = diff;
      this.lastAngle = this.angle;
      this.source &&
        this.source.playbackRate.setValueAtTime(diff, this.lastTime);
    }
  }
}
