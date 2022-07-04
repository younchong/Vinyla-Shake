import "../css/index.css";
import onChange from "./soundWave";

document.querySelector("#left-music-input").addEventListener("change", () => {
  onChange("left");
});
document.querySelector("#right-music-input").addEventListener("change", () => {
  onChange("right");
});
