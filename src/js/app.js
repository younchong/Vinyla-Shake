import { Deck } from "./deck";
import { MixingFaderController } from "./Controller/mixingFaderController";
import { MixingFaderModel } from "./Model/mixingFaderModel";
import { MixingFaderView } from "./View/mixingFaderView";

export class App {
  constructor() {
    this.left = new Deck("left");
    this.right = new Deck("right");
    this.mixingFader = new MixingFaderController(
      document.querySelector("body"),
      new MixingFaderModel(null),
      new MixingFaderView(document.querySelector("body"))
    );

    this.left.register(this.mixingFader);
    this.right.register(this.mixingFader);
  }
}
