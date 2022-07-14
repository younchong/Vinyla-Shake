import { Controller } from "./controller";

export class VolumController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);
  }

  addEvents() {
    this.target
      .querySelector(".volume-controller")
      .addEventListener("input", (e) => {
        const { context, gainNode } = this.model.getState();
        const value = e.currentTarget.value;

        gainNode.gain.setValueAtTime(value, context.currentTime);
      });
  }

  update(information) {
    this.setState(information);
  }
}
