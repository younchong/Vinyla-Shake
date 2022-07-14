import { createEffectComponent } from "./EffectComponent";

export default {
  title: "EffectComponent",
  argTypes: {
    onClick: {action: "onClick"},
  },
};

const Template = ({onClick}) => {
  return createEffectComponent({onClick});
};

export const Primary = Template.bind({});

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
};
