export class Controller {
  constructor(target, model, view) {
    this.target = target;
    this.model = model;
    this.view = view;

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

  addEvents() {}
}
