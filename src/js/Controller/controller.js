export class Controller {
  constructor(target, model, view) {
    this.target = target;
    this.model = model;
    this.view = view;

    this.render();
    this.init();
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

  addEvents() {}
}
