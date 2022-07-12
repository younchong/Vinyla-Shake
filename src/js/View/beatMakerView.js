export class BeatMakerView {
  constructor(target) {
    this.target = target;
  }

  template() {
    const container = document.createElement("div");
    container.className = "beat-maker";

    const micBtn = document.createElement("input");
    micBtn.value = "+";
    micBtn.className = "beat-maker-mic";
    micBtn.type = "button";

    const high = document.createElement("div");
    high.className = "high";

    const kick = document.createElement("div");
    kick.className = "beat-maker-kick";

    const hat = document.createElement("div");
    hat.className = "beat-maker-hat";

    const middle = document.createElement("div");
    middle.className = "middle";

    const snare = document.createElement("div");
    snare.className = "beat-maker-snare";

    const what = document.createElement("div");
    what.className = "beat-maker-what";

    const low = document.createElement("div");
    low.className = "low";

    const ma = document.createElement("div");
    ma.className = "beat-maker-ma";

    const user = document.createElement("div");
    user.className = "beat-maker-user";

    high.append(kick);
    high.append(hat);
    middle.append(snare);
    middle.append(what);
    low.append(ma);
    low.append(user);

    container.append(micBtn);
    container.append(high);
    container.append(middle);
    container.append(low);

    return container;
  }

  render() {
    this.target.insertBefore(this.template(), this.target.children[1]);
  }
}
