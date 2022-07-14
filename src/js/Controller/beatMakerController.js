import { Controller } from "./controller";
import hat from "../../../public/sounds/drum-hh-01.mp3";
import kick from "../../../public/sounds/drum-kd-01.mp3";
import snare from "../../../public/sounds/drum-sd-01.mp3";
import what from "../../../public/sounds/what.mp3";
import ma from "../../../public/sounds/ma.mp3";

export class BeatMakerController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);

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

  playRecord() {
    if (this.source) {
      this.source = this.context.createBufferSource();
      this.gainNode = this.context.createGain();

      this.source.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
    }
    this.source.buffer = this.recorded;
    this.source.start();
  }

  async startRecord() {
    if (!this.isRecording) {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.mediaRecorder.start();

      this.view.toggleButton(this.isRecording);
      setTimeout(() => {
        const isRecording = this.mediaRecorder.state === "recording";
        isRecording && this.mediaRecorder.stop();
        this.isRecording = false;
      }, 1500);

      this.mediaRecorder.ondataavailable = this.updateRecord.bind(this);
      this.isRecording = true;
      this.mediaRecorder.onstop = this.storeRecord.bind(this);
    } else {
      this.mediaRecorder.stop();
      this.view.toggleButton(this.isRecording);
      this.isRecording = false;
    }
  }

  updateRecord(e) {
    this.recordArray.push(e.data);
  }

  async storeRecord() {
    const blob = new Blob(this.recordArray, {
      type: "audio/ogg codecs=opus",
    });
    const url = URL.createObjectURL(blob);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

    this.view.toggleButton(true);
    this.recordArray = [];
    this.recorded = audioBuffer;
  }
}
