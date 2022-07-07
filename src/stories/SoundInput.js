import "./soundInput.css";

export const createSoundInput = ({
  onChange,
}) => {
  const div = document.createElement("div");
  const input = document.createElement("input");

  div.className = "soundDiv";
  input.className = "soundInput";

  input.type = "range";
  input.min = "0";
  input.max = "3.4";
  input.step = "0.1";

  div.append(input);

  input.addEventListener("input", onChange);

  return div;
};
