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

    this.intervalId = null;
    this.recordStartTime = null;

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
    document
      .querySelector(".record-modal-back")
      .addEventListener("click", () => {
        document.querySelector(".record-modal-back").style.display = "none";
      });
    document.querySelector(".record-modal").addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  onMouseDown() {
    this.timer = Date.now();
  }

  onMouseUp() {
    const result = Date.now() - this.timer >= 1500;

    if (result) {
      document.querySelector(".record-modal-back").style.display = "flex";
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

      this.recordStartTime = Date.now();
      this.intervalId = setInterval(() => {
        const now = Date.now() - this.recordStartTime;

        document.querySelector(".record-time").querySelector("span").innerText =
          parseFloat(now / 1000).toFixed(2);
      }, 10);
    } else {
      this.mediaRecorder.stop();
      document.querySelector(".record-button").style.background = "red";

      this.isRecording = false;
      clearTimeout(this.intervalId);
      this.recordStartTime = null;
      document.querySelector(".record-time").querySelector("span").innerText =
        "REC";
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

    const audioDiv = document.createElement("div");
    audioDiv.className = "record-modal-audio";
    const audioLink = document.createElement("a");
    audioLink.innerText = "link";
    audioLink.href = url;

    audioDiv.append(audio);
    audioDiv.append(audioLink);
    document.querySelector(".record-modal").append(audioDiv);
  }
}
