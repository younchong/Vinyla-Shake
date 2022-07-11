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

export class Deck {
  constructor(target) {
    this.main = document.querySelector(`.${target}`);
    this.sound = this.main.querySelector(".deck-sound");
    this.middle = this.main.querySelector(".deck-middle");

    const AudioComponent = new AudioController(
      this.sound,
      new AudioModel({
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
      new VinylModel(null),
      new VinylView(this.middle)
    );

    const VolumeComponent = new VolumController(
      this.middle,
      new VolumeModel(null),
      new VolumeView(this.middle)
    );

    AudioComponent.register(VinylComponent);
    AudioComponent.register(VolumeComponent);
    AudioComponent.register(BpmComponent);
  }

  register(observer) {
    this.observers.push(observer);
  }

  notify(something) {
    this.observers.forEach((observer) => {
      observer.update(something);
    });
  }
}
