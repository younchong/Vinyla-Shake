import { Controller } from "./controller";

export class RecordController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);
  }

  addEvents() {
    const recordButton = document.querySelector(".record-button");
    const recordModal = document.querySelector(".record-modal");
    const recordModalBack = document.querySelector(".record-modal-back");

    recordButton.addEventListener("touchstart", this.onMouseDown.bind(this));
    recordButton.addEventListener("touchend", this.onMouseUp.bind(this));
    recordModal.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    recordModalBack.addEventListener("click", this.view.toggleModal.bind(this));
  }

  onMouseDown() {
    const startTime = Date.now();
    this.setState({ ...this.getState(), startTime });
  }

  onMouseUp() {
    const { startTime } = this.getState();
    const isOverTime = Date.now() - startTime >= 1000;

    this.setState({ ...this.getState(), startTime: 0 });

    if (isOverTime) {
      this.view.toggleModal();
    } else {
      this.toggleRecord();
    }
  }

  async toggleRecord() {
    const { isRecording } = this.getState();

    if (!isRecording) {
      const recordStartTime = Date.now();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.start();
      mediaRecorder.ondataavailable = this.updateRecord.bind(this);
      mediaRecorder.onstop = this.makeAudio.bind(this);

      const intervalId = setInterval(
        this.view.toggleRecordTime.bind(this, recordStartTime),
        10
      );
      this.view.toggleRecordButton();

      this.setState({
        ...this.getState(),
        mediaRecorder,
        intervalId,
        isRecording: true,
      });
    } else {
      const { mediaRecorder, intervalId } = this.getState();
      mediaRecorder.stop();

      this.view.toggleRecordButton();
      this.view.toggleRecordTime();

      clearTimeout(intervalId);
      this.setState({ ...this.getState(), isRecording: false });
    }
  }

  updateRecord(e) {
    const recordArray = [];

    recordArray.push(e.data);
    this.setState({ ...this.getState(), recordArray });
  }

  async makeAudio() {
    const { recordArray } = this.getState();
    const blob = new Blob(recordArray, {
      type: "audio/ogg codecs=opus",
    });
    const url = URL.createObjectURL(blob);

    this.view.makeAudio(url);
  }
}
