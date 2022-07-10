export class AudioModel {
  constructor(initialState) {
    this.state = initialState;
  }

  async setState(newState) {
    this.state = { ...newState };
  }

  getState() {
    return this.state;
  }
}
