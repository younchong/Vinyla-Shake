export class BpmView {
  constructor(target) {
    this.target = target;
  }

  template() {
    const div = document.createElement("div");

    div.className = "deck-middle-bpm";

    const input = document.createElement("input");

    input.type = "range";
    input.className = "bpm-controller";
    input.min = 0.8;
    input.max = 1.2;
    input.step = 0.01;

    const signDiv = document.createElement("div");

    signDiv.className = "bpm-sign";
    signDiv.innerText = "BPM";

    div.append(signDiv);
    div.append(input);

    return div;
  }

  render() {
    this.target.append(this.template());
  }

  changeBpm(bpm) {
    this.target.querySelector(".bpm-sign").innerText = bpm;
  }
}
