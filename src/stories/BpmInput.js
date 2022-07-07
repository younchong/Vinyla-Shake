import "./bpmInput.css";

export const createBpmInput = ({
  bpm,
  onChange,
}) => {
  const div = document.createElement("div");
  const span = document.createElement("span");
  const input = document.createElement("input");

  div.className = "bpm";
  span.className = "bpmSpan";
  input.className = "bpmInput";

  span.innerText = bpm || "BPM";

  input.type = "range";
  input.min = "0.8";
  input.max = "1.2";
  input.step = "0.01";

  div.append(span);
  div.append(input);

  input.addEventListener("input", onChange);

  return div;
};
