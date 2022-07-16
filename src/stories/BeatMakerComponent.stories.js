import { createBeatMakerComponent } from "./BeatMakerComponent";

export default {
  title: "BeatMakerComponent",
  argTypes: {
    onClick: {action: "onClick"},
  },
};

const Template = ({onClick}) => {
  return createBeatMakerComponent({onClick});
};

export const Primary = Template.bind({});

Primary.args = {
  onClick: (e) => {
    const target = e.currentTarget.className;

    if (!target.includes("mic"))return;

    const mic = document.querySelector(".beat-maker-mic");
    const state = mic.style.color;

    if (state === "" || state === "red") {
      mic.style.color = "white";
    } else {
      mic.style.color = "red";
      setTimeout(() => {
        mic.style.color = "white";
      }, 1000);
    }
  },
};
