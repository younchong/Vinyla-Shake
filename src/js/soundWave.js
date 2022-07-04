export default async function onChange(side) {
  const files = document.querySelector(`#${side}-music-input`).files;
  const audio = document.querySelector(`#${side}-audio`);

  audio.src = URL.createObjectURL(files[0]);
  audio.load();
  audio.play();

  const context = new AudioContext();
  const src = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();

  const canvas = document.querySelector(`#${side}-canvas`);
  const ctx = canvas.getContext("2d");

  src.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 2048;

  const frequencyArray = new Uint8Array(analyser.frequencyBinCount);
  const lineWidth = 2.5;

  const drawLine = (opts, canvas, ctx) => {
    const { i, height } = opts;

    ctx.strokeStyle = "#C64945";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(i, canvas.height / 2);
    ctx.lineTo(i, canvas.height / 2 + height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, canvas.height / 2);
    ctx.lineTo(i, canvas.height / 2 - height);
    ctx.stroke();
  };

  const renderFrame = () => {
    requestAnimationFrame(renderFrame);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    analyser.getByteTimeDomainData(frequencyArray);

    for (let i = 0; i < Math.round(canvas.width); i += 3) {
      let height = frequencyArray[i];

      if (height < 100) {
        height *= 0.05;
      } else {
        if (height < 200 && height > 100) {
          height = height - 100 + 100 * 0.05;
        } else {
          height = (height - 200) * 0.2 + 100 * 1.05;
        }
      }

      drawLine({ i, height }, canvas, ctx);
    }
  };

  audio.play();
  renderFrame();
}
