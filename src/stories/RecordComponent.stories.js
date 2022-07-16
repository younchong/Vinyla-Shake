import { createRecordComponent } from "./RecordComponent";
import { within, userEvent } from "@storybook/testing-library";

export default {
  title: "RecordComponent",
  argTypes: {
    mousedown: {action: "mousedown"},
    mouseup: {action: "mouseup"},
    onClick: {action: "onClick"},
  },
};

const Template = ({mousedown, mouseup, onClick}) => {
  return createRecordComponent({mousedown, mouseup, onClick});
};

export const Primary = Template.bind({});

let timer;
let isRecording = false;
Primary.args = {
  mousedown: () => {
    timer = Date.now();
  },
  mouseup: () => {
    const result = Date.now() - timer >= 1500;

    if (result) {
      document.querySelector(".record-modal-back").style.display = "flex";
    } else {
      if (isRecording) {
        document.querySelector(".record-button").classList.remove("on");
        document.querySelector(".record-button").classList.add("off");
        isRecording = false;
      } else {
        document.querySelector(".record-button").classList.remove("off");
        document.querySelector(".record-button").classList.add("on");
        isRecording = true;
      }
    }
  },
  onClick: () => {
    document.querySelector(".record-modal-back").style.display = "none";
  }
};

Primary.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("input"));
};
