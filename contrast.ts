interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB|null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function lum({r, g, b}: RGB) {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
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
      raw,
    }
  }
  return {
    legible: 'N/A',
    raw: -1,
  };
}

interface Bucket {
  min: number;
  max: number;
}

const buckets = new Map<number, Bucket>([
  [0,   {min: 1,      max: 1}],
  [5,   {min: 0.85,   max: 0.93}],
  [10,  {min: 0.75,   max: 0.82}],
  [20,  {min: 0.5,    max: 0.65}],
  [30,  {min: 0.35,   max: 0.45}],
  [40,  {min: 0.25,   max: 0.3}],
  [50,  {min: 0.175,  max: 0.183}],
  [60,  {min: 0.1,    max: 0.125}],
  [70,  {min: 0.05,   max: 0.07}],
  [80,  {min: 0.02,   max: 0.04}],
  [90,  {min: 0.005,  max: 0.015}],
  [100, {min: 0,      max: 0}],
]);

interface ValidityResult {
  passes: boolean;
  message: string;
}

export function isColorValid(color: string, grade: number): ValidityResult {
  const bucket = buckets.get(grade);
  if (bucket) {
    const {raw} = luminance(color);
    const ok = raw >= bucket.min && raw <= bucket.max;
    if (ok) {
      return {
        passes: true,
        message: `Luminance between [${bucket.min}, ${bucket.max}] (actual: ${raw})`,
      };
    }

    if (raw > bucket.max) {
      return {
        passes: false,
        message: `Luminance above [${bucket.max}] (actual: ${raw})`,
      };
    }

    if (raw < bucket.max) {
      return {
        passes: false,
        message: `Luminance below [${bucket.min}] (actual: ${raw})`,
      };
    }
  }

  return {
    passes: false,
    message: `No bucket for grade ${grade}`,
  };
}