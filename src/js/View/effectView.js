export class EffectView {
  constructor(target) {
    this.target = target;
  }

  template() {
    const container = document.createElement("div");
    container.className = "deck-effect";

    const header = document.createElement("div");
    header.className = "deck-effect-header";

    const title = document.createElement("h1");
    title.className = "deck-effect-title";
    title.textContent = "ECHO";

    const button = document.createElement("input");
    button.value = "►";
    button.type = "button";
    button.className = "deck-effect-button";

    const canvas = document.createElement("canvas");
    canvas.className = "deck-effect-canvas";

    container.append(header);
    container.append(canvas);
    header.append(title);
    header.append(button);

    return container;
  }

  render() {
    this.target.append(this.template());
  }

  changeMode(mode) {
    this.target.querySelector(".deck-effect-title").innerText = mode;
  }
}
