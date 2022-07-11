import { Deck } from "./deck";

export class App {
  constructor() {
    this.left = new Deck("left");
    this.right = new Deck("right");
  }
}
