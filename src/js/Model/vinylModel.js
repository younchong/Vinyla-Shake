export class VinylModel {
  constructor(context, source) {
    this.state = {
      context,
      source,
    };
    this.observers = [];
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify(this.state);
  }

  getState() {
    return this.state;
  }

  register(observer) {
    this.observers.push(observer);
  }

  notify(information) {
    this.observers.forEach((observer) => {
      observer.render(information);
    });
  }
}
