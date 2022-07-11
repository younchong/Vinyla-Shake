import { createMixingFaderComponent } from "./MixingFaderComponent";

export default {
  title: "MixingFaderComponent",
  argTypes: {
    onChange: {action: "onChnage"},
  },
};

const Template = ({onChange}) => {
  return createMixingFaderComponent({onChange});
};

export const Primary = Template.bind({});
