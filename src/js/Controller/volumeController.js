import { Controller } from "./controller";

export class VolumController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);

    this.context = null;
    this.source = null;
    this.gainNode = null;
  }

  addEvents() {
    this.target
      .querySelector(".volume-controller")
      .addEventListener("input", (e) => {
        const value = e.currentTarget.value;

        this.gainNode &&
          this.gainNode.gain.setValueAtTime(value, this.context.currentTime);
      });
  }

  update(information) {
    const { context, source, gainNode } = information;

    this.context = context;
    this.source = source;
    this.gainNode = gainNode;
  }
}
