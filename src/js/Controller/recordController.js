export class RecordController {
  constructor(target, model, view) {
    this.target = target;
    this.model = model;
    this.view = view;

    this.timer;

    this.mediaStream = null;
    this.mediaRecorder = null;
    this.isRecording = false;
    this.recordArray = [];

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
    document
      .querySelector(".record-button")
      .addEventListener("mousedown", this.onMouseDown.bind(this));
    document
      .querySelector(".record-button")
      .addEventListener("mouseup", this.onMouseUp.bind(this));
    this.mediaRecorder &&
      this.mediaRecorder.addEventListener(
        "dataavailable",
        this.updateRecord.bind(this)
      );
    this.mediaRecorder &&
      this.mediaRecorder.addEventListener("stop", this.stopRecord.bind(this));
  }

  onMouseDown() {
    this.timer = Date.now();
  }

  onMouseUp() {
    const result = Date.now() - this.timer >= 1500;

    if (result) {
      // show modal list
    } else {
      this.toggleRecord();
    }
  }

  async toggleRecord() {
    if (!this.isRecording) {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.mediaRecorder.start();
      this.mediaRecorder.ondataavailable = this.updateRecord.bind(this);
      this.mediaRecorder.onstop = this.stopRecord.bind(this);

      document.querySelector(".record-button").style.background = "blue";
      this.isRecording = true;
    } else {
      this.mediaRecorder.stop();
      document.querySelector(".record-button").style.background = "red";
      this.isRecording = false;
    }
  }

  updateRecord(e) {
    this.recordArray.push(e.data);
  }

  async stopRecord() {
    const blob = new Blob(this.recordArray, {
      type: "audio/ogg codecs=opus",
    });
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");

    audio.setAttribute("controls", "");
    audio.src = url;

    document.querySelector(".beat-maker").append(audio);
  }
}
