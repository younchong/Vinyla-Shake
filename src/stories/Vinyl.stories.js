import { createVinyl } from "./Vinyl";

export default {
  title: "Vinyl",
  argTypes: {
    onMouseDown: {action: "onMouseDown"},
    onMouseUp: {action: "onMouseUp"},
  },
};

const Template = ({onMouseDown, onMouseUp}) => {
  return createVinyl({onMouseDown, onMouseUp});
};

export const Primary = Template.bind({});
