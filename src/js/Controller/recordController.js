import { Controller } from "./controller";

export class RecordController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);

    this.timer;
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.isRecording = false;
    this.recordArray = [];

    this.intervalId = null;
    this.recordStartTime = null;
  }

  addEvents() {
    const recordButton = document.querySelector(".record-button");
    const recordModal = document.querySelector(".record-modal");
    const recordModalBack = document.querySelector(".record-modal-back");

    recordButton.addEventListener("mousedown", this.onMouseDown.bind(this));
    recordButton.addEventListener("mouseup", this.onMouseUp.bind(this));
    recordModal.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    recordModalBack.addEventListener("click", this.view.toggleModal.bind(this));
  }

  onMouseDown() {
    this.timer = Date.now();
  }

  onMouseUp() {
    const isOverTime = Date.now() - this.timer >= 1500;

    if (isOverTime) {
      this.view.toggleModal();
    } else {
      this.toggleRecord();
    }
  }

  async toggleRecord() {
    if (!this.isRecording) {
      this.isRecording = true;

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.mediaRecorder.start();
      this.mediaRecorder.ondataavailable = this.updateRecord.bind(this);
      this.mediaRecorder.onstop = this.makeAudio.bind(this);

      this.view.toggleRecordButton();
      this.recordStartTime = Date.now();
      this.intervalId = setInterval(
        this.view.toggleRecordTime.bind(this, this.recordStartTime),
        10
      );
    } else {
      this.isRecording = false;
      this.mediaRecorder.stop();

      this.view.toggleRecordButton();
      this.view.toggleRecordTime();

      this.recordStartTime = null;
      clearTimeout(this.intervalId);
    }
  }

  updateRecord(e) {
    this.recordArray.push(e.data);
  }

  async makeAudio() {
    const blob = new Blob(this.recordArray, {
      type: "audio/ogg codecs=opus",
    });
    const url = URL.createObjectURL(blob);

    this.view.makeAudio(url);
  }
}
