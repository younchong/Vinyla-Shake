import { createBpmInput } from "./BpmInput";

export default {
  title: "BPMInput",
  argTypes: {
    bpm: { control: "text" },
    onChange: {action: "onChange"},
  },
};

const Template = ({bpm, onChange}) => {
  return createBpmInput({bpm, onChange});
};

export const Primary = Template.bind({});
