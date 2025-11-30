// src/types/bible.ts
export interface BibleBook {
  abbrev: string;
  name: string;
  chapters: string[][];
}

export type BibleData = BibleBook[];
