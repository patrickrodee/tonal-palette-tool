interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  (r /= 255), (g /= 255), (b /= 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
}

export function hexToHslString(hex: string): string {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  return `hsl(${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
}

function lum({ r, g, b }: RGB) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

interface LuminanceResult {
  raw: number;
  legible: string;
}

export function luminance(hex: string): LuminanceResult {
  const rgb = hexToRgb(hex);
  if (rgb) {
    const raw = lum(rgb);
    return {
      legible: raw.toFixed(3),
      raw
    };
  }
  return {
    legible: "N/A",
    raw: -1
  };
}

interface Bucket {
  min: number;
  max: number;
}

const buckets = new Map<number, Bucket>([
  [0, { min: 1, max: 1 }],
  [5, { min: 0.85, max: 0.93 }],
  [10, { min: 0.75, max: 0.82 }],
  [20, { min: 0.5, max: 0.65 }],
  [30, { min: 0.35, max: 0.45 }],
  [40, { min: 0.25, max: 0.3 }],
  [50, { min: 0.175, max: 0.183 }],
  [60, { min: 0.1, max: 0.125 }],
  [70, { min: 0.05, max: 0.07 }],
  [80, { min: 0.02, max: 0.04 }],
  [90, { min: 0.005, max: 0.015 }],
  [100, { min: 0, max: 0 }]
]);

interface ValidityResult {
  passes: boolean;
  message: string;
}

export function isColorValid(color: string, grade: number): ValidityResult {
  const bucket = buckets.get(grade);
  if (bucket) {
    const { raw } = luminance(color);
    const roundedRaw = Math.round(raw * 1000) / 1000;
    const ok = roundedRaw >= bucket.min && roundedRaw <= bucket.max;
    if (ok) {
      return {
        passes: true,
        message: `Luminance between [${bucket.min}, ${
          bucket.max
        }] (actual: ${roundedRaw})`
      };
    }

    if (roundedRaw > bucket.max) {
      return {
        passes: false,
        message: `Luminance above [${bucket.max}] (actual: ${roundedRaw})`
      };
    }

    if (roundedRaw < bucket.max) {
      return {
        passes: false,
        message: `Luminance below [${bucket.min}] (actual: ${roundedRaw})`
      };
    }
  }

  return {
    passes: false,
    message: `No bucket for grade ${grade}`
  };
}
