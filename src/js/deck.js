import { AudioView } from "./View/audioView";
import { AudioModel } from "./Model/audioModel";
import { AudioController } from "./Controller/audioController";
import { VinylController } from "./Controller/vinylController";
import { VinylView } from "./View/vinylView";
import { VinylModel } from "./Model/vinylModel";
import { VolumController } from "./Controller/volumeController";
import { VolumeModel } from "./Model/volumeModel";
import { VolumeView } from "./View/volumeView";
import { BpmController } from "./Controller/bpmController";
import { BpmModel } from "./Model/bpmModel";
import { BpmView } from "./View/bpmView";
import { EffectController } from "./Controller/effectController";
import { EffectModel } from "./Model/effectModel";
import { EffectView } from "./View/effectView";

export class Deck {
  constructor(target) {
    this.main = document.querySelector(`.${target}`);
    this.sound = this.main.querySelector(".deck-sound");
    this.middle = this.main.querySelector(".deck-middle");
    this.middle.classList.add(`${target}`);

    this.AudioComponent = new AudioController(
      this.sound,
      new AudioModel({
        context: new (window.AudioContext || window.webkitAudioContext)(),
        file: null,
      }),
      new AudioView(this.sound, target),
      target
    );

    const BpmComponent = new BpmController(
      this.middle,
      new BpmModel(null),
      new BpmView(this.middle)
    );

    const VinylComponent = new VinylController(
      this.middle,
      new VinylModel({
        scratching: false,
        angle: 0,
        rotationStart: 0,
        rotationOffset: 0,
        lastX: 0,
        lastY: 0,
        size: 512,
        lastTime: 0,
        lastAngle: 0,
      }),
      new VinylView(this.middle)
    );

    const VolumeComponent = new VolumController(
      this.middle,
      new VolumeModel(null),
      new VolumeView(this.middle)
    );

    const EffectComponent = new EffectController(
      this.main,
      new EffectModel({ mode: "ECHO" }),
      new EffectView(this.main)
    );

    this.AudioComponent.register(VinylComponent);
    this.AudioComponent.register(VolumeComponent);
    this.AudioComponent.register(BpmComponent);
    this.AudioComponent.register(EffectComponent);
  }

  register(observer) {
    this.AudioComponent.register(observer);
  }
}
