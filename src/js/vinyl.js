let scratching = false;
let recordGroup;
let surfaceGroup;
let angle = 0;
let rotationStart = 0;
let rotationOffset = 0;
let lastX = 0;
let lastY = 0;
let size = 512;

let source;
let context;
let lastTime;
let lastAngle = 0;
let duration;

function onMouseDown(ev) {
  scratching = true;
  lastX = ev.offsetX;
  lastY = ev.offsetY;

  lastTime = context.currentTime;
  source.playbackRate.setValueAtTime(0, lastTime);
}

function onMouseUp() {
  scratching = false;
  rotationOffset = angle;
  rotationStart = -1;

  source.playbackRate.setValueAtTime(1, lastTime + 0.1);
  rotateRecord();
}

function onMouseMove(ev) {
  if (scratching) {
    const deltaX = ev.offsetX - lastX;
    const deltaY = ev.offsetY - lastY;
    let rotation = 0;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const direction = ev.offsetY > size / 2.0 ? -1.0 : 1.0;

      rotation = (deltaX / size) * 180.0 * direction;
    } else {
      const direction = ev.offsetX > size / 2.0 ? 1.0 : -0.5;

      rotation = (deltaY / size) * 180.0 * direction;
    }

    angle += rotation;
    recordGroup.setAttribute("transform", "rotate(" + angle + ", 256, 256)");
    surfaceGroup.setAttribute("transform", "rotate(" + angle + ", 256, 256)");

    lastX = ev.offsetX;
    lastY = ev.offsetY;

    const diff = parseFloat((angle - lastAngle) / 3).toFixed(2);

    lastAngle = angle;
    source.playbackRate.setValueAtTime(diff, lastTime);
  }
}

function rotateRecord(timestamp) {
  if (!scratching && duration > context.currentTime) {
    if (timestamp >= 0) {
      if (rotationStart < 0) {
        rotationStart = timestamp;
      }
      angle = (((timestamp - rotationStart) / 5.0) % 360.0) + rotationOffset;
      recordGroup.setAttribute("transform", "rotate(" + angle + ", 256, 256)");
      surfaceGroup.setAttribute("transform", "rotate(" + angle + ", 256, 256)");
    }
    window.requestAnimationFrame(rotateRecord);
  }
}

export default function playVinyl(musicSource, musicContext) {
  source = musicSource;
  context = musicContext;
  duration = source.buffer.duration;
  source.start(0);

  const record = document.getElementById("record_svg");
  recordGroup = document.getElementById("record_group");
  surfaceGroup = document.getElementById("surface_group");
  rotateRecord();

  if (window.PointerEvent) {
    record.addEventListener("pointerdown", onMouseDown);
    document.addEventListener("pointerup", onMouseUp);
    document.addEventListener("pointermove", onMouseMove);
  } else {
    record.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  }
}
