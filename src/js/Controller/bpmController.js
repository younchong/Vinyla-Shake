import { Controller } from "./controller";

export class BpmController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);
    this.originSrc = null;
  }

  addEvents() {
    this.target
      .querySelector(".bpm-controller")
      .addEventListener("input", this.controlBpm.bind(this));
  }

  update(information) {
    const { source } = information;

    const context = new (window.OfflineAudioContext ||
      window.webkitOfflineAudioContext)(
      source.channelCount,
      source.buffer.sampleRate * source.buffer.duration,
      source.buffer.sampleRate
    );
    const newSource = context.createBufferSource();
    newSource.buffer = source.buffer;

    this.setState({ context, source: newSource });
    this.originSrc = source;
    this.checkBpm(context, newSource);
  }

  checkBpm(context, source) {
    const lowpass = context.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 150;
    lowpass.Q.value = 1;

    source.connect(lowpass);

    const highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 100;
    highpass.Q.value = 1;

    lowpass.connect(highpass);
    highpass.connect(context.destination);

    source.start(0);
    context.startRendering();

    context.oncomplete = (e) => {
      const buffer = e.renderedBuffer;
      const peaks = this.getPeaks([
        buffer.getChannelData(0),
        buffer.getChannelData(1),
      ]);
      const groups = this.getIntervals(peaks);
      const top = groups.sort((a, b) => b.count - a.count).splice(0, 5);

      const bpm = Math.round(top[0].tempo);
      this.view.changeBpm(bpm);
      this.setState({ ...this.getState(), bpm });
    };
  }

  controlBpm(e) {
    const { bpm } = this.getState();
    const value = e.currentTarget.value;

    this.originSrc &&
      this.originSrc.playbackRate.setValueAtTime(
        value,
        this.originSrc.context.currentTime + 0.5
      );

    this.view.changeBpm((bpm * value).toFixed(0));
  }

  getPeaks(data) {
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

  getIntervals(peaks) {
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
}
