export class MixingFaderController {
  constructor(target, model, view) {
    this.target = target;
    this.model = model;
    this.view = view;

    this.leftContext = null;
    this.rightContext = null;
    this.leftGain = null;
    this.rightGain = null;

    this.init();
    this.render();
    this.addEvents();
  }

  setState(newState) {
    this.model.setState(newState);
  }

  getState() {
    return this.model.getState();
  }

  render(state) {
    this.view.render(state);
  }

  init() {}

  addEvents() {
    document
      .querySelector(".mixing-fader-controller")
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
