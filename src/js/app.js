import { Deck } from "./deck";
import { CrossFaderController } from "./Controller/crossFaderController";
import { CrossFaderModel } from "./Model/crossFaderModel";
import { CrossFaderView } from "./View/crossFaderView";
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
    this.crossFader = new CrossFaderController(
      document.querySelector(".beat-maker"),
      new CrossFaderModel(null),
      new CrossFaderView(document.querySelector(".beat-maker"))
    );

    this.left.register(this.crossFader);
    this.right.register(this.crossFader);
  }
}
