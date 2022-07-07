import "./fileInput.css";

export const createFileInput = ({onClick}) => {
  const div = document.createElement("div");
  const input = document.createElement("input");
  const label = document.createElement("label");

  div.className = "fileDiv";

  input.type = "file";
  input.id = "stroybook-file-input";

  label.for = "storybook-file-input";
  label.innerText = "▲";

  div.append(input);
  div.append(label);

  div.addEventListener("click", onClick);

  return div;
};
