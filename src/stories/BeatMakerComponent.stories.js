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
