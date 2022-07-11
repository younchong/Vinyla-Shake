export class BpmController {
  constructor(target, model, view) {
    this.target = target;
    this.model = model;
    this.view = view;

    this.context = null;
    this.source = null;
    this.gainNode = null;
    this.originSrc = null;
    this.bpm = null;

    this.init();
    this.render();
    this.addEvents();
  }

  setState(newState) {
    this.model.setState(newState);
  }

  getState() {
    return this.model.getState();
  }

  render(state) {
    this.view.render(state);
  }

  init() {}

  addEvents() {
    this.target
      .querySelector(".bpm-controller")
      .addEventListener("input", this.controlBpm.bind(this));
  }

  update(information) {
    const { source } = information;

    this.context = new (window.OfflineAudioContext ||
      window.webkitOfflineAudioContext)(
      source.channelCount,
      source.buffer.sampleRate * source.buffer.duration,
      source.buffer.sampleRate
    );
    this.source = this.context.createBufferSource();
    this.source.buffer = source.buffer;

    this.originSrc = source;
    this.checkBpm();
  }

  checkBpm() {
    const lowpass = this.context.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 150;
    lowpass.Q.value = 1;

    this.source.connect(lowpass);

    const highpass = this.context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 100;
    highpass.Q.value = 1;

    lowpass.connect(highpass);
    highpass.connect(this.context.destination);

    this.source.start(0);
    this.context.startRendering();

    this.context.oncomplete = (e) => {
      const buffer = e.renderedBuffer;
      const peaks = this.getPeaks([
        buffer.getChannelData(0),
        buffer.getChannelData(1),
      ]);
      const groups = this.getIntervals(peaks);
      const top = groups.sort((a, b) => b.count - a.count).splice(0, 5);

      this.bpm = Math.round(top[0].tempo);

      this.target.querySelector(".bpm-sign").innerText = this.bpm;
    };
  }

  controlBpm(e) {
    const value = e.currentTarget.value;
    const signDiv = this.target.querySelector(".bpm-sign");

    this.originSrc &&
      this.originSrc.playbackRate.setValueAtTime(
        value,
        this.originSrc.context.currentTime + 0.5
      );
    signDiv.innerText = parseInt(this.bpm * value);
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
