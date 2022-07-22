import { Arrow } from "../Utils/Arrow";

export class EffectView {
  constructor(target) {
    this.target = target;

    this.arrows = [];
    this.animation = null;
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

  makeArrow(x, y) {
    const canvas = this.target.querySelector(".deck-effect-canvas");

    for (let i = 0; i < 15; i++) {
      this.arrows.push(
        new Arrow(canvas.width / 2, canvas.height / 2, { x, y }, this.target)
      );
    }

    this.playAnimation(0);
  }

  playAnimation(frame) {
    const canvas = this.target.querySelector(".deck-effect-canvas");
    const context = canvas.getContext("2d");

    context.fillStyle = "rgba(0, 0, 0, 0.2)";
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 0.2;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    context.globalCompositeOperation = "lighter";
    context.lineCap = "round";
    context.lineJoin = "round";

    this.arrows.forEach((a) => {
      a.avoid(this.arrows);
    });
    this.arrows.forEach((a) => {
      a.render(frame);
    });

    frame += 1;
    this.animation = requestAnimationFrame(
      this.playAnimation.bind(this, frame)
    );
  }

  moveArrow(x, y) {
    this.arrows.forEach((a) => {
      a.target = { x, y };
    });
  }

  removeArrow() {
    const canvas = this.target.querySelector(".deck-effect-canvas");
    const context = canvas.getContext("2d");

    this.arrows = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
    window.cancelAnimationFrame(this.animation);
  }
}
