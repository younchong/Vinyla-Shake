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

  async render(analyser, dataArray, bufferLength) {
    if (!this.target.childElementCount) {
      this.template();
    }
    this.drawBars(analyser, dataArray, bufferLength);
  }

  drawBars(analyser, dataArray, bufferLength) {
    if (!analyser) return;

    const canvas = this.target.querySelector(".deck-sound-canvas");
    const ctx = canvas.getContext("2d");

    requestAnimationFrame(
      this.drawBars.bind(this, analyser, dataArray, bufferLength)
    );

    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);

    let barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
    }
  }
}
