export class AudioView {
  constructor(target, position) {
    this.target = target;
    this.position = position;
  }

  template() {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".mp3";
    input.id = `deck-sound-input-${this.position}`;

    const label = document.createElement("label");

    label.htmlFor = `deck-sound-input-${this.position}`;
    label.innerText = "▲";

    const canvas = document.createElement("canvas");

    canvas.className = "deck-sound-canvas";

    this.target.append(input);
    this.target.append(label);
    this.target.append(canvas);

    return this.target;
  }

  async render(state) {
    if (!this.target.childElementCount) {
      this.template();
    }
    this.drawWave(state);
  }

  drawWave(data) {
    if (!data) return;
    const canvas = this.target.querySelector(".deck-sound-canvas");
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
