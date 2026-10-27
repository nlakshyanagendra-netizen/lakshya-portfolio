export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
