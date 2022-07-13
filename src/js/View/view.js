export class View {
  constructor(target) {
    this.target = target;
  }

  template() {}

  render() {
    this.target.append(this.template());
  }
}
