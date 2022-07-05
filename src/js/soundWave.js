import playVinyl from "./vinyl";

export default async function onChange(side) {
  const files = document.querySelector(`#${side}-music-input`).files;
  const audio = document.querySelector(`#${side}-audio`);

  audio.src = URL.createObjectURL(files[0]);

  const context = new AudioContext();
  const source = context.createBufferSource();

  const drawAudio = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);

    source.buffer = audioBuffer;
    source.connect(context.destination);

    draw(normalizeData(filterData(audioBuffer)));

    playVinyl(source, context);
  };

  const filterData = (audioBuffer) => {
    const samplePerSec = 100;
    const { duration, sampleRate } = audioBuffer;
    const rawData = audioBuffer.getChannelData(0);
    const totalSamples = duration * samplePerSec;
    const blockSize = Math.floor(sampleRate / samplePerSec);
    const filteredData = [];

    for (let i = 0; i < totalSamples; i++) {
      const blockStart = blockSize * i;
      let sum = 0;

      for (let j = 0; j < blockSize; j++) {
        if (rawData[blockStart + j]) {
          sum += Math.abs(rawData[blockStart + j]);
        }
      }

      filteredData.push(sum / blockSize);
    }

    return filteredData;
  };

  const normalizeData = (filteredData) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);

    return filteredData.map((data) => data * multiplier);
  };

  const draw = (normalizeData) => {
    const canvas = document.querySelector(`#${side}-canvas`);
    const dpr = window.devicePixelRatio || 1;
    const padding = 20;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = (canvas.offsetHeight + padding * 2) * dpr;

    const ctx = canvas.getContext("2d");

    ctx.scale(dpr, dpr);
    ctx.translate(0, canvas.offsetHeight / 2 + padding);

    const width = canvas.offsetWidth / normalizeData.length;

    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.offsetHeight);
    ctx.stroke();

    for (let i = 0; i < normalizeData.length; i++) {
      const x = width * i;
      let height = normalizeData[i] * canvas.offsetHeight - padding;

      if (height < 0) {
        height = 0;
      } else if (height > canvas.offsetHeight / 2) {
        height = height > canvas.offsetHeight / 2;
      }

      drawLineSegment(ctx, x, height, width, (i + 1) % 2);
    }
  };

  const drawLineSegment = (ctx, x, height, width, isEven) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#C64945";
    ctx.beginPath();
    height = isEven ? height : -height;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
    ctx.lineTo(x + width, 0);
    ctx.stroke();
  };

  drawAudio(audio.src);
}
