import { Controller } from "./controller";

export class EffectController extends Controller {
  constructor(target, model, view) {
    super(target, model, view);
  }

  update(information) {
    const { context, source, gainNode } = information;

    const convolver = context.createConvolver();
    convolver.buffer = source.buffer;

    const compressor = context.createDynamicsCompressor();

    this.setState({
      ...this.getState(),
      context,
      source,
      gainNode,
      convolver,
      compressor,
    });
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
    const { context, mode } = this.getState();

    if (!context) return;

    if (mode === "ECHO") {
      const { context, gainNode } = this.getState();
      const output = context.createGain();
      const delay = context.createDelay();
      const wetLevel = context.createGain();

      gainNode.connect(delay);
      delay.connect(wetLevel);

      wetLevel.connect(output);
      output.connect(context.destination);

      this.setState({ ...this.getState(), delay, wetLevel });
    }

    if (mode === "REVERB") {
      const { context, gainNode, convolver } = this.getState();
      const convolverGain = context.createGain();

      gainNode.disconnect(context.destination);
      gainNode.connect(convolver);
      convolver.connect(convolverGain);
      convolverGain.connect(context.destination);

      this.setState({ ...this.getState(), convolverGain });
    }

    if (mode === "COMPRESSOR") {
      const { context, gainNode, compressor } = this.getState();

      compressor.threshold.setValueAtTime(-50, context.currentTime);
      gainNode.connect(compressor);
      compressor.connect(context.destination);
    }

    if (mode === "FLANGER") {
      const { context, gainNode } = this.getState();
      const oscillator = context.createOscillator();

      oscillator.connect(gainNode.gain);
      oscillator.start();

      this.setState({ ...this.getState(), oscillator });
    }

    this.setState({ ...this.getState(), effectOn: true });
  }

  mouseUp() {
    const { context, mode } = this.getState();

    if (!context) return;

    if (mode === "ECHO") {
      const { delay, wetLevel } = this.getState();
      delay.delayTime.value = 0;
      wetLevel.gain.value = 0;
    }

    if (mode === "REVERB") {
      const { gainNode, convolver, convolverGain } = this.getState();

      convolverGain.gain.value = 0;
      gainNode.disconnect(convolver);
      gainNode.connect(context.destination);
    }

    if (mode === "COMPRESSOR") {
      const { gainNode, compressor } = this.getState();
      gainNode.disconnect(compressor);
      compressor.disconnect(context.destination);
      gainNode.connect(context.destination);
    }

    if (mode === "FLANGER") {
      const { oscillator } = this.getState();
      oscillator.frequency.setValueAtTime(440, context.currentTime);
      oscillator.stop();
    }

    this.setState({ ...this.getState(), effectOn: false });
  }

  controllEchoEffect(e) {
    const { effectOn, mode } = this.getState();

    if (!effectOn) return;

    const canvas = this.target.querySelector(".deck-effect-canvas");

    if (mode === "ECHO") {
      const { delay, wetLevel } = this.getState();
      const x = (e.clientX - canvas.offsetLeft) / 600;
      const y = -(e.clientY - canvas.offsetTop - 80) / 25;

      delay.delayTime.value = x;
      wetLevel.gain.value = y;
    }

    if (this.mode === "REVERB") {
      const { convolverGain } = this.getState();
      const x = (e.clientX - canvas.offsetLeft) / 300;

      convolverGain.gain.value = x;
    }

    if (this.mode === "COMPRESSOR") {
      const { context, compressor } = this.getState();
      const x = (e.clientX - canvas.offsetLeft) / 600;
      const y = (e.clientY - canvas.offsetTop) / 3;

      compressor.knee.setValueAtTime(y, context.currentTime);
      compressor.ratio.setValueAtTime(y / 2, context.currentTime);
      compressor.attack.setValueAtTime(x, context.currentTime);
      compressor.release.setValueAtTime(x, context.currentTime);
    }

    if (mode === "FLANGER") {
      const { oscillator, context } = this.getState();

      oscillator.frequency.setValueAtTime(
        e.clientX - canvas.offsetLeft,
        context.currentTime
      );
    }
  }

  changeMode() {
    const { mode } = this.getState();
    const nextMode = {
      ECHO: "REVERB",
      REVERB: "COMPRESSOR",
      COMPRESSOR: "FLANGER",
      FLANGER: "ECHO",
    };

    const next = nextMode[mode];

    this.view.changeMode(next);
    this.setState({ ...this.getState(), mode: next });
  }
}
