export class VolumController {
  constructor(target, model, view) {
    this.target = target;
    this.model = model;
    this.view = view;

    this.context = null;
    this.source = null;
    this.gainNode = null;

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
