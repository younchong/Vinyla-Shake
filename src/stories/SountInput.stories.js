import { createSoundInput } from "./SoundInput";

export default {
  title: "SoundInput",
  argTypes: {
    onChange: {action: "onChange"},
  },
};

const Template = ({onChange}) => {
  return createSoundInput({onChange});
};

export const Primary = Template.bind({});
