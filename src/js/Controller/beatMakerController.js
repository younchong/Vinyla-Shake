import { Controller } from "./controller";
import hat from "../../../public/sounds/drum-hh-01.mp3";
import kick from "../../../public/sounds/drum-kd-01.mp3";
import snare from "../../../public/sounds/drum-sd-01.mp3";
import what from "../../../public/sounds/what.mp3";
import ma from "../../../public/sounds/ma.mp3";

export class BeatMakerController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);

    this.observers = [];
  }

  init() {
    const { context } = this.getState();
    const gainNode = context.createGain();

    this.setState({ ...this.getState(), gainNode });
  }

  addEvents() {
    document
      .querySelector(".beat-maker-mic")
      .addEventListener("click", this.startRecord.bind(this));
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
      .addEventListener("click", this.playRecord.bind(this));
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
      const { context, gainNode } = this.getState();
      const audioBuffer = await context.decodeAudioData(rawFile.response);
      const source = context.createBufferSource();

      source.connect(gainNode);
      gainNode.connect(context.destination);
      source.buffer = audioBuffer;
      source.start();
    };
    rawFile.send();
  }

  playRecord() {
    const { context, recorded, gainNode } = this.getState();
    const source = context.createBufferSource();

    source.connect(gainNode);
    gainNode.connect(context.destination);
    source.buffer = recorded;
    source.start();
  }

  async startRecord() {
    const { isRecording } = this.getState();
    if (!isRecording) {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.start();

      this.view.toggleButton(isRecording);

      setTimeout(() => {
        const isRecording = mediaRecorder.state === "recording";

        isRecording && mediaRecorder.stop();
        this.setState({ ...this.model.getState(), isRecording: false });
      }, 1500);

      mediaRecorder.ondataavailable = this.updateRecord.bind(this);
      mediaRecorder.onstop = this.storeRecord.bind(this);
      this.setState({ ...this.getState(), isRecording: true, mediaRecorder });
    } else {
      const { mediaRecorder, isRecording } = this.getState();

      mediaRecorder.stop();
      this.view.toggleButton(isRecording);
      this.setState({ ...this.getState(), isRecording: false });
    }
  }

  updateRecord(e) {
    const recordArray = [];

    recordArray.push(e.data);
    this.setState({ ...this.getState(), recordArray });
  }

  async storeRecord() {
    const { context, recordArray } = this.getState();

    const blob = new Blob(recordArray, {
      type: "audio/ogg codecs=opus",
    });
    const url = URL.createObjectURL(blob);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);

    this.view.toggleButton(true);
    this.setState({
      ...this.getState(),
      recordArray: [],
      recorded: audioBuffer,
    });
  }

  register(observer) {
    this.observers.push(observer);

    this.notify(this.getState());
  }

  notify(information) {
    this.observers.forEach((observer) => observer.update(information));
  }
}
