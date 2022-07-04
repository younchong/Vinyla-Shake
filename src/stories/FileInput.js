import "./fileInput.css";

export const createFileInput = ({onClick}) => {
  const div = document.createElement("div");
  const input = document.createElement("input");
  const label = document.createElement("label");

  input.type = "file";
  input.addEventListener("onChange", onClick);
  input.id = "stroybook-file-input";

  label.for = "storybook-file-input";
  label.innerText = "▲";

  div.append(input);
  div.append(label);

  return div;
};
