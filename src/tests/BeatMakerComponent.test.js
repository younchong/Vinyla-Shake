import { BeatMakerController } from "../js/Controller/beatMakerController";
import { BeatMakerModel } from "../js/Model/beatMakerModel";
import { BeatMakerView } from "../js/View/beatMakerView";

describe("BeatMakerComponent", () => {
  const BeatMakerComponent = new BeatMakerController(
    document.querySelector("body"),
    new BeatMakerModel({
      context: null,
      isRecording: false,
    }),
    new BeatMakerView(document.querySelector("body")),
  );

  it("총 6개의 버튼이 1개의 div에 2쌍으로 존재한다.", () => {
    const main = document.querySelector(".beat-maker");

    expect(main.querySelectorAll("div").length).toBe(9);
  });

  it ("beat-maker-kick을 클릭하면 makeSound 함수가 실행된다.", () => {
    const kick = document.querySelector(".beat-maker-kick");
    const makeSound = jest.spyOn(BeatMakerComponent, "makeSound");

    kick.addEventListener("click", makeSound);
    kick.click();
    expect(makeSound).toBeCalled();
  });

  it ("beat-maker-hat을 클릭하면 makeSound 함수가 실행된다.", () => {
    const hat = document.querySelector(".beat-maker-hat");
    const makeSound = jest.spyOn(BeatMakerComponent, "makeSound");

    hat.addEventListener("click", makeSound);
    hat.click();
    expect(makeSound).toBeCalled();
  });

  it ("beat-maker-snare을 클릭하면 makeSound 함수가 실행된다.", () => {
    const snare = document.querySelector(".beat-maker-snare");
    const makeSound = jest.spyOn(BeatMakerComponent, "makeSound");

    snare.addEventListener("click", makeSound);
    snare.click();
    expect(makeSound).toBeCalled();
  });
});
