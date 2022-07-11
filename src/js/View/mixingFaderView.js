export class MixingFaderView {
  constructor(target) {
    this.target = target;
  }

  template() {
    const div = document.createElement("div");

    div.className = "mixing-fader";

    const input = document.createElement("input");

    input.className = "mixing-fader-controller";
    input.type = "range";
    input.min = -1;
    input.max = 1;
    input.step = 0.1;
    input.value = 0;

    div.append(input);

    return div;
  }

  render() {
    this.target.append(this.template());
  }
}
