export class AudioView {
  constructor(target) {
    this.target = target;
    this.container = document.querySelector(".deck-sound");
  }

  template() {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".mp3";
    input.id = "deck-sound-input";

    const label = document.createElement("label");

    label.htmlFor = "deck-sound-input";
    label.innerText = "▲";

    const canvas = document.createElement("canvas");

    canvas.id = "deck-sound-canvas";

    this.container.append(input);
    this.container.append(label);
    this.container.append(canvas);

    return this.container;
  }

  async render(state) {
    if (!this.container.childElementCount) {
      this.template();
    }
    this.drawWave(state);
  }

  drawWave(data) {
    if (!data) return;

    const canvas = document.querySelector("#deck-sound-canvas");
    const dpr = window.devicePixelRatio || 1;
    const padding = 20;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = (canvas.offsetHeight + padding * 2) * dpr;

    const ctx = canvas.getContext("2d");

    ctx.scale(dpr, dpr);
    ctx.translate(0, canvas.offsetHeight / 2 + padding);

    const width = canvas.offsetWidth / data.length;

    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.offsetHeight);
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      const x = width * i;
      let height = data[i] * canvas.offsetHeight - padding;

      if (height < 0) {
        height = 0;
      } else if (height > canvas.offsetHeight / 2) {
        height = height > canvas.offsetHeight / 2;
      }
      this.drawLineSegment(ctx, x, height, width, (i + 1) % 2);
    }
  }

  drawLineSegment(ctx, x, height, width, isEven) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#C64945";
    ctx.beginPath();
    height = isEven ? height : -height;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
    ctx.lineTo(x + width, 0);
    ctx.stroke();
  }
}
