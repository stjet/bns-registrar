export const ALLOWED = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "_", "backspace", "arrowleft", "arrowtop", "arrowbottom", "arrowright"];

export function get_price(dl: number): number {
  if (dl === 4) {
    return 4200;
  } else if (dl === 5) {
    return 1900;
  } else if (dl === 6) {
    return 1200;
  } else if (dl === 7) {
    return 900;
  } else if (dl === 8) {
    return 690;
  } else if (dl === 9) {
    return 420;
  } else if (dl > 9) {
    return 1;//190;
  } else {
    return 99999; //currently <4 length domains not buyable, but just in case...
  }
}

export function is_domain_name_allowed(domain: string): boolean {
  return domain.split("").every((c) => ALLOWED.includes(c));
}

const HEX_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

export function is_valid_public_key(public_key: string): boolean {
  return public_key.length === 64 && public_key.split("").every((c) => HEX_CHARS.includes(c));
}

export function seconds_to_time(seconds: number): string {
  if (seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

