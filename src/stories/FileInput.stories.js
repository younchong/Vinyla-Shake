import { createFileInput } from './FileInput';

export default {
  title: "FileInput",
  component: createFileInput,
  argTypes: {onchange: {action: "clicked"}}
}

const Template = ({onClick}) => {
  return createFileInput({onClick});
}

export const Primary = Template.bind({});
