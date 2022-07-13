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

    this.compressor = null;

    this.oscillator = null;

    this.effectOn = false;

    this.output = null;
  }

  update(information) {
    const { context, source, gainNode } = information;

    this.context = context;
    this.source = source;
    this.gainNode = gainNode;

    this.convolver = this.context.createConvolver();
    this.convolver.buffer = this.source.buffer;

    this.compressor = this.context.createDynamicsCompressor();
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

    if (this.mode === "ECHO") {
      this.output = this.context.createGain();
      this.delay = this.context.createDelay();
      this.wetLevel = this.context.createGain();

      this.gainNode.connect(this.delay);
      this.delay.connect(this.wetLevel);

      this.wetLevel.connect(this.output);
      this.output.connect(this.context.destination);
    }

    if (this.mode === "REVERB") {
      this.convolverGain = this.context.createGain();

      this.gainNode.disconnect(this.context.destination);
      this.gainNode.connect(this.convolver);
      this.convolver.connect(this.convolverGain);
      this.convolverGain.connect(this.context.destination);
    }

    if (this.mode === "COMPRESSOR") {
      this.compressor.threshold.setValueAtTime(-50, this.context.currentTime);

      this.gainNode.connect(this.compressor);
      this.compressor.connect(this.context.destination);
    }

    if (this.mode === "FLANGER") {
      this.oscillator = this.context.createOscillator();
      this.output = this.context.createGain();
      this.oscillator.connect(this.gainNode.gain);
      this.oscillator.start();
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
      this.convolverGain.gain.value = 0;
      this.gainNode.disconnect(this.convolver);
      this.gainNode.connect(this.context.destination);
    }

    if (this.mode === "COMPRESSOR") {
      this.gainNode.disconnect(this.compressor);
      this.compressor.disconnect(this.context.destination);
      this.gainNode.connect(this.context.destination);
    }

    if (this.mode === "FLANGER") {
      this.oscillator.frequency.setValueAtTime(440, this.context.currentTime);
      this.oscillator.stop();
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
    }

    if (this.mode === "REVERB") {
      const x = (e.clientX - canvas.offsetLeft) / 300;

      this.convolverGain.gain.value = x;
    }

    if (this.mode === "COMPRESSOR") {
      const x = (e.clientX - canvas.offsetLeft) / 600;
      const y = (e.clientY - canvas.offsetTop) / 3;

      this.compressor.knee.setValueAtTime(y, this.context.currentTime);
      this.compressor.ratio.setValueAtTime(y / 2, this.context.currentTime);
      this.compressor.attack.setValueAtTime(x, this.context.currentTime);
      this.compressor.release.setValueAtTime(x, this.context.currentTime);
    }

    if (this.mode === "FLANGER") {
      this.oscillator.frequency.setValueAtTime(
        e.clientX - canvas.offsetLeft,
        this.context.currentTime
      );
    }
  }

  changeMode() {
    const nextMode = {
      ECHO: "REVERB",
      REVERB: "COMPRESSOR",
      COMPRESSOR: "FLANGER",
      FLANGER: "ECHO",
    };

    this.mode = nextMode[this.mode];
    this.target.querySelector(".deck-effect-title").innerText = this.mode;
  }
}
