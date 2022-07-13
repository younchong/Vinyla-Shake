import { Controller } from "./controller";

export class EffectController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);

    this.context = null;
    this.source = null;
    this.gainNode = null;

    this.mode = "ECHO";

    this.delay = null;
    this.wetLevel = null;

    this.convolver = null;
    this.convolverGain = null;
    this.masterGain = null;

    this.effectOn = false;

    this.output = null;
  }

  update(information) {
    const { context, source, gainNode } = information;

    this.context = context;
    this.source = source;
    this.gainNode = gainNode;

    this.output = this.context.createGain();
    this.delay = this.context.createDelay();
    this.wetLevel = this.context.createGain();

    this.gainNode.connect(this.delay);
    this.gainNode.connect(this.output);
    this.delay.connect(this.wetLevel);

    this.output.connect(this.context.destination);

    this.convolver = this.context.createConvolver();
    this.convolver.buffer = this.source.buffer;
  }

  addEvents() {
    const canvas = this.target.querySelector(".deck-effect-canvas");

    if (window.PointerEvent) {
      canvas.addEventListener("pointerdown", this.mouseDown.bind(this));
      canvas.addEventListener(
        "pointermove",
        this.controllEchoEffect.bind(this)
      );
      canvas.addEventListener("pointerup", this.mouseUp.bind(this));
    } else {
      canvas.addEventListener("mousedown", this.mouseDown.bind(this));
      canvas.addEventListener("mousemove", this.controllEchoEffect.bind(this));
      canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    }

    this.target
      .querySelector(".deck-effect-button")
      .addEventListener("click", this.changeMode.bind(this));
  }

  mouseDown() {
    if (!this.context) return;

    if (this.mode === "REVERB") {
      this.masterGain = this.context.createGain();
      this.convolverGain = this.context.createGain();
      this.source.connect(this.convolverGain);
      this.source.connect(this.masterGain);
      this.convolverGain.connect(this.convolver);
      this.convolver.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);
      this.convolverGain.gain.value = 0;
    }

    this.effectOn = true;
  }

  mouseUp() {
    if (!this.context) return;

    if (this.mode === "ECHO") {
      this.delay.delayTime.value = 0;
      this.wetLevel.gain.value = 0;
    }

    if (this.mode === "REVERB") {
      this.masterGain.gain.value = 0;
    }

    this.effectOn = false;
  }

  controllEchoEffect(e) {
    if (!this.effectOn) return;
    const canvas = this.target.querySelector(".deck-effect-canvas");

    if (this.mode === "ECHO") {
      const x = (e.clientX - canvas.offsetLeft) / 600;
      const y = -(e.clientY - canvas.offsetTop - 80) / 25;

      this.delay.delayTime.value = x;
      this.wetLevel.gain.value = y;

      this.wetLevel.connect(this.output);
    }

    if (this.mode === "REVERB") {
      const x = (e.clientX - canvas.offsetLeft) / 300;

      this.convolverGain.gain.value = x;
    }
  }

  changeMode() {
    const nextMode = {
      ECHO: "REVERB",
      REVERB: "ECHO",
    };

    this.mode = nextMode[this.mode];
    this.target.querySelector(".deck-effect-title").innerText = this.mode;
  }
}
