export class AudioController {
  constructor(target, model, view, position) {
    this.target = target;
    this.model = model;
    this.view = view;
    this.position = position;

    this.observers = [];

    this.init();
    this.render();
    this.addEvents();
  }

  async setState(newState) {
    const { context, file } = newState;
    let { source } = this.getState();

    if (source) {
      source.stop();
      source = null;
    }

    source = context.createBufferSource();
    const gainNode = context.createGain();

    source.connect(gainNode);
    gainNode.connect(context.destination);

    const audioBuffer = await this.makeBuffer(context, file);
    const filteredData = this.filterData(audioBuffer);
    const normalizedData = this.normalizeData(filteredData);

    source.buffer = audioBuffer;
    source.loop = true;
    source.start();

    this.model.setState({ ...this.getState(), context, source, gainNode });
    this.render(normalizedData);

    this.notify({
      context,
      source,
      gainNode,
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

    this.setState({ ...this.getState(), file: url });
  }

  async makeBuffer(context, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);

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

  register(observer) {
    this.observers.push(observer);
  }

  notify(information) {
    this.observers.forEach((observer) => observer.update(information));
  }
}
