// Converts HSB (hue, saturation, brightness) to RGB
function hsbToRgb(h: number, s: number, b: number) {
  s = s / 100;
  b = b / 100;

  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) =>
    b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));

  return {
    r: Math.round(255 * f(5)),
    g: Math.round(255 * f(3)),
    b: Math.round(255 * f(1)),
  };
}

// Converts RGB to hex
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

// Converts HSB to RGBA with alpha
function hsbToRgba(h: number, s: number, b: number, a: number) {
  const { r, g, b: blue } = hsbToRgb(h, s, b);
  return `rgba(${r}, ${g}, ${blue}, ${a})`;
}

export { hsbToRgb, rgbToHex, hsbToRgba };
