export type Fingering = Array<number>; // length 6, E A D G B E, -1 mute, 0 open, >0 fret

export const CHORDS: Record<string, Fingering> = {
  A: [0, 0, 2, 2, 2, 0],
  Am: [0, 0, 2, 2, 1, 0],
  Bm: [-1, 2, 4, 4, 3, 2],
  C: [-1, 3, 2, 0, 1, 0],
  D: [-1, -1, 0, 2, 3, 2],
  Dm: [-1, -1, 0, 2, 3, 1],
  E: [0, 2, 2, 1, 0, 0],
  Em: [0, 2, 2, 0, 0, 0],
  F: [1, 3, 3, 2, 1, 1],
  Fm: [1, 3, 3, 1, 1, 1],
  G: [3, 2, 0, 0, 0, 3],
  Gm: [3, 5, 5, 3, 3, 3],
};

export function detectChords(text: string): string[] {
  const set = new Set<string>();
  const re = /\b([A-G](?:m)?)\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const c = m[1];
    if (CHORDS[c]) set.add(c);
  }
  return Array.from(set);
}

