import "./RecordComponent.css";

export const createRecordComponent = ({
  mousedown,
  mouseup,
  onClick,
}) => {
  const div = document.createElement("div");
  div.className = "record";

  const input = document.createElement("input");

  input.type = "button";
  input.className = "record-button";
  input.addEventListener("mousedown", mousedown);
  input.addEventListener("mouseup", mouseup);

  const timeDiv = document.createElement("div");
  const span = document.createElement("span");

  timeDiv.className = "record-time";
  span.innerText = "REC";

  const modalBack = document.createElement("div");
  modalBack.className = "record-modal-back";
  modalBack.addEventListener("click", onClick);

  const modal = document.createElement("div");
  modal.className = "record-modal";
  modal.addEventListener("click", onClick);

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
};
