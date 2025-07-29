export function getAuraIntensity(level: number) {
  const linearPart = level * 0.025;
  const exponentialPart =
    level > 30 ? Math.pow((level - 30) / 40, 2.0) * 0.5 : 0;
  const baseIntensity = Math.min(linearPart + exponentialPart, 1.0);
  const minIntensity = 0.008;
  return Math.max(minIntensity, baseIntensity);
}

export function getHexAlpha(opacity: number) {
  return Math.floor(Math.max(0, Math.min(255, opacity)))
    .toString(16)
    .padStart(2, "0");
}
