import { Controller } from "./controller";

export class CrossFaderController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);

    this.leftContext = null;
    this.rightContext = null;
    this.leftGain = null;
    this.rightGain = null;
  }

  addEvents() {
    document
      .querySelector(".cross-fader-controller")
      .addEventListener("input", this.controllSound.bind(this));
  }

  controllSound(e) {
    const value = Math.sin(-e.currentTarget.value * 0.5 * Math.PI) + 1;
    const Rvalue = Math.sin(e.currentTarget.value * 0.5 * Math.PI) + 1;

    this.leftGain &&
      this.leftGain.gain.setValueAtTime(value, this.leftContext.currentTime);
    this.rightGain &&
      this.rightGain.gain.setValueAtTime(Rvalue, this.rightContext.currentTime);
  }

  update(information) {
    const { context, gainNode, position } = information;

    if (position === "left") {
      this.leftContext = context;
      this.leftGain = gainNode;
    } else {
      this.rightContext = context;
      this.rightGain = gainNode;
    }
  }
}
