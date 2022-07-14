import { Controller } from "./controller";

export class VinylController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);
  }

  init() {
    this.rotateRecord();
  }

  update(information) {
    const { context, source, gainNode } = information;

    this.setState({ ...this.getState(), context, source, gainNode });
    this.init();
  }

  addEvents() {
    const record = this.target.querySelector("#record_svg");

    if (window.PointerEvent) {
      record.addEventListener("pointerdown", this.onMouseDown.bind(this));
      record.addEventListener("pointerup", this.onMouseUp.bind(this));
      record.addEventListener("pointermove", this.onMouseMove.bind(this));
    } else {
      record.addEventListener("mousedown", this.onMouseDown.bind(this));
      record.addEventListener("mouseup", this.onMouseUp.bind(this));
      record.addEventListener("mousemove", this.onMouseMove.bind(this));
    }
  }

  onMouseDown(e) {
    const { context, source } = this.getState();
    const scratching = true;
    const lastX = e.offsetX;
    const lastY = e.offsetY;
    const lastTime = context && context.currentTime;

    source && source.playbackRate.setValueAtTime(0, lastTime);
    this.setState({
      ...this.getState(),
      scratching,
      lastX,
      lastY,
      lastTime,
    });
  }

  onMouseUp() {
    const { context, source, angle } = this.getState();
    const scratching = false;
    const rotationOffset = angle;
    const rotationStart = -1;

    source && source.playbackRate.setValueAtTime(1, context.currentTime);
    const lastPlaybackRate = 1;

    this.setState({
      ...this.getState(),
      scratching,
      rotationOffset,
      rotationStart,
      lastPlaybackRate,
    });
    this.rotateRecord();
  }

  rotateRecord(timestamp) {
    const { scratching, source, rotationOffset } = this.getState();
    let { angle, rotationStart } = this.getState();

    if (!scratching && source) {
      if (timestamp >= 0) {
        if (rotationStart < 0) {
          rotationStart = timestamp;
        }
        angle = (((timestamp - rotationStart) / 5.0) % 360.0) + rotationOffset;
        this.view.updateRecord(angle);
      }

      this.setState({ ...this.getState(), rotationStart, angle });
      window.requestAnimationFrame(this.rotateRecord.bind(this));
    }
  }

  onMouseMove(e) {
    const { scratching, size, source, lastTime } = this.getState();
    let { lastX, lastY, angle, lastAngle } = this.getState();

    if (scratching) {
      const deltaX = e.offsetX - lastX;
      const deltaY = e.offsetY - lastY;
      let rotation = 0;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const direction = e.offsetY > size / 2.0 ? -1.0 : 1.0;

        rotation = (deltaX / size) * 180.0 * direction;
      } else {
        const direction = e.offsetX > size / 2.0 ? 1.0 : -0.5;

        rotation = (deltaY / size) * 180.0 * direction;
      }

      angle += rotation;
      lastX = e.offsetX;
      lastY = e.offsetY;
      this.view.updateRecord(angle);

      const diff = parseFloat((angle - lastAngle) / 3).toFixed(2);
      const lastPlaybackRate = diff;

      lastAngle = angle;
      source && source.playbackRate.setValueAtTime(diff, lastTime);

      this.setState({
        ...this.getState(),
        lastX,
        lastY,
        angle,
        lastAngle,
        lastPlaybackRate,
      });
    }
  }
}
