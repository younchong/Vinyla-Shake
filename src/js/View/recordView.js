export class RecordView {
  constructor(target) {
    this.target = target;
  }

  template() {
    const div = document.createElement("div");
    div.className = "record";

    const input = document.createElement("input");

    input.type = "button";
    input.className = "record-button";

    const timeDiv = document.createElement("div");
    const span = document.createElement("span");

    timeDiv.className = "record-time";
    span.innerText = "REC";

    timeDiv.append(span);

    div.append(input);
    div.append(timeDiv);

    return div;
  }

  render() {
    this.target.append(this.template());
  }
}
