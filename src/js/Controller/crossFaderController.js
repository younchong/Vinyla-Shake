import { Controller } from "./controller";

export class CrossFaderController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);
  }

  addEvents() {
    document
      .querySelector(".cross-fader-controller")
      .addEventListener("input", this.controllSound.bind(this));
  }

  controllSound(e) {
    if (
      !this.getState() ||
      Object.keys(this.getState()).length !== 4
    )
      return;

    const leftVolume = Math.sin(-e.currentTarget.value * 0.5 * Math.PI) + 1;
    const rightVolume = Math.sin(e.currentTarget.value * 0.5 * Math.PI) + 1;
    const { leftContext, leftGain, rightContext, rightGain } =
      this.getState();

    leftGain.gain.setValueAtTime(leftVolume, leftContext.currentTime);
    rightGain.gain.setValueAtTime(rightVolume, rightContext.currentTime);
  }

  update(information) {
    const { context, gainNode, position } = information;

    if (position === "left") {
      this.setState({
        ...this.getState(),
        leftContext: context,
        leftGain: gainNode,
      });
    } else {
      this.setState({
        ...this.getState(),
        rightContext: context,
        rightGain: gainNode,
      });
    }
  }
}
