export const randomColor = () => {
  return '#' + parseInt(Math.random() * 0xffffff).toString(16);
};

export const hexToRgb = hex => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const hexToRgba = (hex, alpha = 100) => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha/100.0})`;
}

const compToHex = component => {
  return component.toString(16).padStart(2, 0);
}

export const rgbaToHex = rgba => {
  const segments = rgba.replace(/rgba\(/i, '').replace(')', '').split(',').map(s => s.trim());
  const r = parseInt(segments[0]);
  const g = parseInt(segments[1]);
  const b = parseInt(segments[2]);
  let alpha = 100; 
  if (segments.length > 3) {
    alpha *= parseFloat(segments[3]);
  }

  const hex = `#${compToHex(r)}${compToHex(g)}${compToHex(b)}`;
  return { hex, alpha };
}