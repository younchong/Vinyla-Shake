import { Deck } from "./deck";
import { MixingFaderController } from "./Controller/mixingFaderController";
import { MixingFaderModel } from "./Model/mixingFaderModel";
import { MixingFaderView } from "./View/mixingFaderView";
import { BeatMakerController } from "./Controller/beatMakerController";
import { BeatMakerModel } from "./Model/beatMakerModel";
import { BeatMakerView } from "./View/beatMakerView";
import { RecordController } from "./Controller/recordController";
import { RecordModel } from "./Model/recordModel";
import { RecordView } from "./View/recordView";

export class App {
  constructor() {
    this.left = new Deck("left");
    this.right = new Deck("right");
    this.mixingFader = new MixingFaderController(
      document.querySelector("body"),
      new MixingFaderModel(null),
      new MixingFaderView(document.querySelector("body"))
    );
    this.beatMaker = new BeatMakerController(
      document.querySelector("body"),
      new BeatMakerModel(null),
      new BeatMakerView(document.querySelector("body"))
    );
    this.recordComponent = new RecordController(
      document.querySelector(".beat-maker"),
      new RecordModel(null),
      new RecordView(document.querySelector(".beat-maker"))
    );

    this.left.register(this.mixingFader);
    this.right.register(this.mixingFader);
  }
}
