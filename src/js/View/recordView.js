export class RecordView {
  constructor(target) {
    this.target = target;
  }

  template() {
    const div = document.createElement("div");
    div.className = "record";

    const input = document.createElement("input");

    input.type = "button";
    input.className = "record-button off";

    const timeDiv = document.createElement("div");
    const span = document.createElement("span");

    timeDiv.className = "record-time";
    span.innerText = "REC";

    const modalBack = document.createElement("div");
    modalBack.className = "record-modal-back";

    const modal = document.createElement("div");
    modal.className = "record-modal";

    const modalTitle = document.createElement("h1");
    modalTitle.className = "record-modal-title";
    modalTitle.innerText = "List";

    modalBack.append(modal);
    modal.append(modalTitle);
    timeDiv.append(span);
    div.append(input);
    div.append(timeDiv);
    div.append(modalBack);

    return div;
  }

  render() {
    this.target.append(this.template());
  }

  toggleModal() {
    const state = document.querySelector(".record-modal-back").style.display;

    if (state === "none") {
      document.querySelector(".record-modal-back").style.display = "flex";
    } else {
      document.querySelector(".record-modal-back").style.display = "none";
    }
  }

  toggleRecordButton() {
    const state = document
      .querySelector(".record-button")
      .classList.contains("off");

    if (state) {
      document.querySelector(".record-button").classList.remove("off");
      document.querySelector(".record-button").classList.add("on");
    } else {
      document.querySelector(".record-button").classList.remove("on");
      document.querySelector(".record-button").classList.add("off");
    }
  }

  toggleRecordTime(time) {
    if (time) {
      const now = Date.now() - time;

      document.querySelector(".record-time").querySelector("span").innerText =
        parseFloat(now / 1000).toFixed(2);
    } else {
      document.querySelector(".record-time").querySelector("span").innerText =
        "REC";
    }
  }

  makeAudio(src) {
    const modal = document.querySelector(".record-modal");

    const audio = document.createElement("audio");
    audio.setAttribute("controls", "");
    audio.src = src;

    const audioDiv = document.createElement("div");
    audioDiv.className = "record-modal-audio";

    const audioLink = document.createElement("a");
    audioLink.innerText = "link";
    audioLink.href = src;

    const deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.className = "record-modal-audio-delete";
    deleteButton.value = "X";
    deleteButton.addEventListener("click", () => {
      modal.removeChild(audioDiv);
    });

    audioDiv.append(audio);
    audioDiv.append(audioLink);
    audioDiv.append(deleteButton);
    modal.append(audioDiv);
  }
}
