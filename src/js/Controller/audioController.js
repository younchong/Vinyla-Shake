export class AudioController {
  constructor(target, model, view, position) {
    this.target = target;
    this.model = model;
    this.view = view;
    this.position = position;

    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.context.createBufferSource();
    this.gainNode = this.context.createGain();

    this.source.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);

    this.observers = [];

    this.init();
    this.render();
    this.addEvents();
  }

  async setState(newState) {
    const { file } = newState;

    this.model.setState(newState);

    const audioBuffer = await this.makeBuffer(file);
    const filteredData = this.filterData(audioBuffer);
    const normalizedData = this.normalizeData(filteredData);

    if (this.source.buffer) {
      this.source.stop();
      this.source = null;
      this.source = this.context.createBufferSource();

      this.gainNode = this.context.createGain();

      this.source.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
    }

    this.source.buffer = audioBuffer;
    this.source.start();
    this.render(normalizedData);

    this.notify({
      context: this.context,
      source: this.source,
      gainNode: this.gainNode,
      position: this.position,
    });
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
      .querySelector(`#deck-sound-input-${this.position}`)
      .addEventListener("change", this.updateFile.bind(this));
  }

  updateFile() {
    const file = this.target.querySelector(`#deck-sound-input-${this.position}`)
      .files[0];
    const url = URL.createObjectURL(file);

    this.setState({ file: url });
  }

  appendChildren() {}

  register(observer) {
    this.observers.push(observer);
  }

  notify(information) {
    this.observers.forEach((observer) => observer.update(information));
  }

  async makeBuffer(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

    return audioBuffer;
  }

  filterData(buffer) {
    const samplePerSec = 100;
    const { duration, sampleRate } = buffer;
    const rawData = buffer.getChannelData(0);
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
  }

  normalizeData(filteredData) {
    const multiplier = Math.pow(Math.max(...filteredData), -1);

    return filteredData.map((data) => data * multiplier);
  }
}
