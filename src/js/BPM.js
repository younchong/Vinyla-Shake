export default async function bpmChecker(url, originSrc, originCtx) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const offlineContext = new (window.OfflineAudioContext ||
    window.webkitOfflineAudioContext)(2, 44100 * 40, 44100);
  const source = offlineContext.createBufferSource();
  const audioBuffer = await offlineContext.decodeAudioData(arrayBuffer);
  let originBPM = null;

  source.buffer = audioBuffer;

  const lowpass = offlineContext.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 150;
  lowpass.Q.value = 1;

  source.connect(lowpass);

  const highpass = offlineContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 100;
  highpass.Q.value = 1;

  lowpass.connect(highpass);
  highpass.connect(offlineContext.destination);
  source.start(0);
  offlineContext.startRendering();

  offlineContext.oncomplete = (e) => {
    const buffer = e.renderedBuffer;
    const peaks = getPeaks([
      buffer.getChannelData(0),
      buffer.getChannelData(1),
    ]);
    const groups = getIntervals(peaks);
    const top = groups.sort((a, b) => b.count - a.count).splice(0, 5);

    originBPM = Math.round(top[0].tempo);
    document.querySelector(".bpm span").innerHTML = Math.round(top[0].tempo);

    bpmController(originSrc, originCtx, originBPM);
  };
}

function bpmController(source, context, bpm) {
  const controller = document.querySelector(".bpm-controller");

  controller.addEventListener("input", (e) => {
    const value = e.currentTarget.value;
    const bpmSpan = document.querySelector(".bpm span");

    source.playbackRate.setValueAtTime(value, context.currentTime + 0.5);
    bpmSpan.innerText = parseInt(bpm * value);
  });
}

function getPeaks(data) {
  const partSize = 22050;
  const parts = data[0].length / partSize;
  let peaks = [];

  for (let i = 0; i < parts; i++) {
    let max = 0;

    for (let j = i * partSize; j < (i + 1) * partSize; j++) {
      let volume = Math.max(Math.abs(data[0][j]), Math.abs(data[1][j]));

      if (!max || volume > max.volume) {
        max = {
          position: j,
          volume: volume,
        };
      }
    }
    peaks.push(max);
  }

  peaks.sort(function (a, b) {
    return b.volume - a.volume;
  });

  peaks = peaks.splice(0, peaks.length * 0.5);

  peaks.sort(function (a, b) {
    return a.position - b.position;
  });

  return peaks;
}

function getIntervals(peaks) {
  const groups = [];

  peaks.forEach(function (peak, index) {
    for (let i = 1; index + i < peaks.length && i < 10; i++) {
      const group = {
        tempo: (60 * 44100) / (peaks[index + i].position - peak.position),
        count: 1,
      };

      while (group.tempo < 90) {
        group.tempo *= 2;
      }

      while (group.tempo > 180) {
        group.tempo /= 2;
      }

      group.tempo = Math.round(group.tempo);

      if (
        !groups.some(function (interval) {
          return interval.tempo === group.tempo ? interval.count++ : 0;
        })
      ) {
        groups.push(group);
      }
    }
  });
  return groups;
}
