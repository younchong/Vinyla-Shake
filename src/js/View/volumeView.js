export class VolumeView {
  constructor(target) {
    this.target = target;
  }

  template() {
    const div = document.createElement("div");

    div.className = "deck-middle-volume";

    const input = document.createElement("input");

    input.type = "range";
    input.className = "volume-controller";
    input.min = 0;
    input.max = 3.4;
    input.step = 0.1;

    div.append(input);

    return div;
  }

  render() {
    this.target.append(this.template());
  }
}
