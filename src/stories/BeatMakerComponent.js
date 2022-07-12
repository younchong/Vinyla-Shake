import "./BeatMakerComponent.css";

export const createBeatMakerComponent = ({
  onClick,
}) => {
  const container = document.createElement("div");
  container.className = "beat-maker";

  const micBtn = document.createElement("input");
  micBtn.value = "+";
  micBtn.className = "beat-maker-mic";
  micBtn.type = "button";
  micBtn.addEventListener("click", onClick);

  const high = document.createElement("div");
  high.className = "high";

  const kick = document.createElement("div");
  kick.className = "beat-maker-kick";
  kick.addEventListener("click", onClick);

  const hat = document.createElement("div");
  hat.className = "beat-maker-hat";
  hat.addEventListener("click", onClick);

  const middle = document.createElement("div");
  middle.className = "middle";

  const snare = document.createElement("div");
  snare.className = "beat-maker-snare";
  snare.addEventListener("click", onClick);

  const what = document.createElement("div");
  what.className = "beat-maker-what";
  what.addEventListener("click", onClick);

  const low = document.createElement("div");
  low.className = "low";

  const ma = document.createElement("div");
  ma.className = "beat-maker-ma";
  ma.addEventListener("click", onClick);

  const user = document.createElement("div");
  user.className = "beat-maker-user";
  user.addEventListener("click", onClick);

  high.append(kick);
  high.append(hat);
  middle.append(snare);
  middle.append(what);
  low.append(ma);
  low.append(user);

  container.append(micBtn);
  container.append(high);
  container.append(middle);
  container.append(low);

  return container;
};
