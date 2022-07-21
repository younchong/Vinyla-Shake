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
    const {
      isRecording,
      leftContext,
      leftGainNode,
      rightContext,
      rightGainNode,
      beatContext,
      beatGainNode,
    } = this.getState();

    if (!isRecording) {
      const recordStartTime = Date.now();
      const busAudio = new (window.AudioContext || window.webkitAudioContext)();
      const busDestination = busAudio.createMediaStreamDestination();

      if (leftContext) {
        const leftStream = leftContext.createMediaStreamDestination();
        leftGainNode.connect(leftStream);

        const leftSource = busAudio.createMediaStreamSource(leftStream.stream);
        leftSource.connect(busDestination);
      }

      if (rightContext) {
        const rightStream = rightContext.createMediaStreamDestination();
        rightGainNode.connect(rightStream);

        const rightSource = busAudio.createMediaStreamSource(
          rightStream.stream
        );
        rightSource.connect(busDestination);
      }

      if (beatContext) {
        const beatStream = beatContext.createMediaStreamDestination();
        beatGainNode.connect(beatStream);

        const beatSource = busAudio.createMediaStreamSource(beatStream.stream);
        beatSource.connect(busDestination);
      }

      const mediaRecorder = new MediaRecorder(busDestination.stream);

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
      type: "audio/mpeg codecs=opus",
    });
    const url = URL.createObjectURL(blob);

    this.view.makeAudio(url);
  }

  update(information) {
    const { context, gainNode, position } = information;

    if (position === "left") {
      this.setState({
        ...this.getState(),
        leftContext: context,
        leftGainNode: gainNode,
      });
    } else if (position === "right") {
      this.setState({
        ...this.getState(),
        rightContext: context,
        rightGainNode: gainNode,
      });
    } else {
      this.setState({
        ...this.getState(),
        beatContext: context,
        beatGainNode: gainNode,
      });
    }
  }
}
