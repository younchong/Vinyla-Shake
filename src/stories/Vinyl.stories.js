import { createVinyl } from "./Vinyl";

export default {
  title: "Vinyl",
  component: createVinyl,
}

const Template = () => {
  return createVinyl();
}

export const Primary = Template.bind({});
