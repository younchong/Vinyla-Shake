import "./mixingFaderComponent.css";

export const createMixingFaderComponent = ({
  onChange,
}) => {
  const div = document.createElement("div");
  const input = document.createElement("input");

  div.className = "mixing-fader";
  input.className = "mixing-fader-controller";

  input.type = "range";

  div.append(input);

  input.addEventListener("input", onChange);

  return div;
};
