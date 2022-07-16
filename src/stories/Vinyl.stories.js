import { createVinyl } from "./Vinyl";

export default {
  title: "Vinyl",
  argTypes: {
    onMouseDown: {action: "onMouseDown"},
    onMouseUp: {action: "onMouseUp"},
    onMouseMove: {action: "onMouseMove"},
  },
};

const Template = ({onMouseDown, onMouseUp, onMouseMove}) => {
  return createVinyl({onMouseDown, onMouseUp, onMouseMove});
};

export const Primary = Template.bind({});

let scratching = false;
let angle = 0;
let lastX = 0;
let lastY = 0;
let size = 512;

Primary.args = {
  onMouseDown: (e) => {
    scratching = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
  },
  onMouseUp: () => {
    scratching = false;
  },
  onMouseMove: (e) => {
    if (scratching) {
      const recordGroup = document.querySelector("#record_group");
      const surfaceGroup = document.querySelector("#surface_group");
      const deltaX = e.offsetX - lastX;
      const deltaY = e.offsetY - lastY;
      let rotation = 0;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const direction = e.offsetY > size / 2.0 ? -1.0 : 1.0;

        rotation = (deltaX / size) * 180.0 * direction;
      } else {
        const direction = e.offsetX > size / 2.0 ? 1.0 : -0.5;

        rotation = (deltaY / size) * 180.0 * direction;
      }

      angle += rotation;
      recordGroup.setAttribute("transform", "rotate(" + angle + ", 256, 256)");
      surfaceGroup.setAttribute("transform", "rotate(" + angle + ", 256, 256)");

      lastX = e.offsetX;
      lastY = e.offsetY;
    }
  },
};
