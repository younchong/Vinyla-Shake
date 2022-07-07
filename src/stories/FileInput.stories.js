import { createFileInput } from './FileInput';

export default {
  title: "FileInput",
  argTypes: {
    onClick: {action: "onClick"},
  },
};

const Template = ({onClick}) => {
  return createFileInput({onClick});
};

export const Primary = Template.bind({});
