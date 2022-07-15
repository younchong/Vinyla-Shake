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

    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(context.destination);

    const audioBuffer = await this.makeBuffer(context, file);

    source.buffer = audioBuffer;
    source.loop = true;
    source.start();

    this.model.setState({ ...this.getState(), context, source, gainNode });
    this.render(analyser, dataArray, bufferLength);

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

  render(analyser, dataArray, bufferLength) {
    this.view.render(analyser, dataArray, bufferLength);
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

  register(observer) {
    this.observers.push(observer);
  }

  notify(information) {
    this.observers.forEach((observer) => observer.update(information));
  }
}
