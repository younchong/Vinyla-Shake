export default function volumController(input, gainNode) {
  input.addEventListener("input", (e) => {
    const value = e.currentTarget.value;

    gainNode.gain.setValueAtTime(value, gainNode.context.currentTime);
  });
}
