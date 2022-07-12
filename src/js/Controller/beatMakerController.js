import hat from "../../../public/sounds/drum-hh-01.mp3";
import kick from "../../../public/sounds/drum-kd-01.mp3";
import snare from "../../../public/sounds/drum-sd-01.mp3";
import what from "../../../public/sounds/what.mp3";
import ma from "../../../public/sounds/ma.mp3";

export class BeatMakerController {
  constructor(target, model, view) {
    this.target = target;
    this.model = model;
    this.view = view;

    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.context.createBufferSource();
    this.gainNode = this.context.createGain();
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.recordArray = [];
    this.isRecording = false;
    this.recorded = null;

    this.source.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);

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
    document.querySelector(".beat-maker-mic").addEventListener("click", this.startRec.bind(this));
    document
      .querySelector(".beat-maker-kick")
      .addEventListener("click", this.makeSound.bind(this, "kick"));
    document
      .querySelector(".beat-maker-hat")
      .addEventListener("click", this.makeSound.bind(this, "hat"));
    document
      .querySelector(".beat-maker-snare")
      .addEventListener("click", this.makeSound.bind(this, "snare"));
    document
      .querySelector(".beat-maker-what")
      .addEventListener("click", this.makeSound.bind(this, "what"));
    document
      .querySelector(".beat-maker-ma")
      .addEventListener("click", this.makeSound.bind(this, "ma"));
    document
      .querySelector(".beat-maker-user")
      .addEventListener("click", this.playRec.bind(this));
  }

  makeSound(sound) {
    const files = {
      kick,
      hat,
      snare,
      what,
      ma,
    };
    const rawFile = new XMLHttpRequest();

    rawFile.open("GET", files[sound], true);
    rawFile.responseType = "arraybuffer";
    rawFile.onload = async () => {
      const audioBuffer = await this.context.decodeAudioData(rawFile.response);

      if (this.source) {
        this.source = this.context.createBufferSource();
        this.gainNode = this.context.createGain();

        this.source.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
      }
      this.source.buffer = audioBuffer;
      this.source.start();
    };
    rawFile.send();
  }

  playRec() {
    if (this.source) {
      this.source = this.context.createBufferSource();
      this.gainNode = this.context.createGain();

      this.source.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
    }
    this.source.buffer = this.recorded;
    this.source.start();
  }

  async startRec() {
    if (!this.isRecording) {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({audio: true});
      this.mediaRecorder= new MediaRecorder(this.mediaStream);
      this.mediaRecorder.start();

      document.querySelector(".beat-maker-mic").style.color = "red";

      setTimeout(() => {
        this.mediaRecorder.stop();
        this.isRecording = false;
      }, 1500);
      this.mediaRecorder.ondataavailable = (e) => {
        this.recordArray.push(e.data);
      };

      this.mediaRecorder.onstop = async () => {
        const blob = new Blob(this.recordArray, {"type": "audio/ogg codecs=opus"});
        const url = URL.createObjectURL(blob);
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        document.querySelector(".beat-maker-mic").style.color = "white";
        this.recordArray = [];
        this.recorded = audioBuffer;
      };
      this.isRecording = true;
    } else {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
}
