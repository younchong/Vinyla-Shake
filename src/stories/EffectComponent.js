import "./effectComponent.css";

export const createEffectComponent = ({
  onClick,
  makeArrow,
  moveArrow,
  removeArrow,
}) => {
  const container = document.createElement("div");
  container.className = "deck-effect";

  const header = document.createElement("div");
  header.className = "deck-effect-header";

  const title = document.createElement("h1");
  title.className = "deck-effect-title";
  title.textContent = "ECHO";

  const button = document.createElement("input");
  button.type = "button";
  button.className = "deck-effect-button";
  button.value = "►";
  button.addEventListener("click", onClick);

  const canvas = document.createElement("canvas");
  canvas.className = "deck-effect-canvas";
  canvas.addEventListener("pointerdown", makeArrow);
  canvas.addEventListener(
    "pointermove",
    moveArrow
  );
  canvas.addEventListener("pointerup", removeArrow);

  container.append(header);
  container.append(canvas);
  header.append(title);
  header.append(button);

  return container;
};
