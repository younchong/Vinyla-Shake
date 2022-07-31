import { createEffectComponent } from "./EffectComponent";
import { Arrow } from "../js/Utils/Arrow";

export default {
  title: "EffectComponent",
  argTypes: {
    onClick: {action: "onClick"},
  },
};

const Template = ({onClick, makeArrow, moveArrow, removeArrow}) => {
  return createEffectComponent({onClick, makeArrow, moveArrow, removeArrow});
};

export const Primary = Template.bind({});

let isClicked = false;
let arrows = [];
let animation = null;

Primary.args = {
  onClick: () => {
    const state = document.querySelector(".deck-effect-title").innerText;
    const nextMode = {
      ECHO: "REVERB",
      REVERB: "COMPRESSOR",
      COMPRESSOR: "FLANGER",
      FLANGER: "ECHO",
    };

    document.querySelector(".deck-effect-title").innerText = nextMode[state];
  },
  makeArrow: (e) => {
    isClicked = true;

    const canvas = document.querySelector(".deck-effect-canvas");
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    for (let i = 0; i < 15; i++) {
      arrows.push(
        new Arrow(canvas.width / 2, canvas.height / 2, { x, y }, document)
      );
    }

    playAnimation(0);
  },
  moveArrow: (e) => {
    if (!isClicked) return;

    const canvas = document.querySelector(".deck-effect-canvas");
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    arrows.forEach((a) => {
      a.target = { x, y };
    });
  },
  removeArrow: () => {
    isClicked = false;

    const canvas = document.querySelector(".deck-effect-canvas");
    const context = canvas.getContext("2d");

    arrows = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
    window.cancelAnimationFrame(animation);
  }
};

function playAnimation(frame) {
  const canvas = document.querySelector(".deck-effect-canvas");
  const context = canvas.getContext("2d");

  context.fillStyle = "rgba(0, 0, 0, 0.2)";
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 0.2;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = 1;
  context.globalCompositeOperation = "lighter";
  context.lineCap = "round";
  context.lineJoin = "round";

  arrows.forEach((a) => {
    a.avoid(arrows);
  });
  arrows.forEach((a) => {
    a.render(frame);
  });

  frame += 1;
  animation = requestAnimationFrame(
    playAnimation.bind(null, frame)
  );
}
