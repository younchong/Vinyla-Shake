function timeStamp() {
  return window.performance.now();
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function map(a, b, c, d, e) {
  return ((a - b) / (c - b)) * (e - d) + d;
}

function lerp(value1, value2, amount) {
  return value1 + (value2 - value1) * amount;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export { timeStamp, random, map, lerp, clamp };
