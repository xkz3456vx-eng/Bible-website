// src/types/aelf.ts
export interface AelfLecture {
  type: string;
  refrain_psalmique: string | null;
  ref_refrain: string | null;
  titre: string;
  contenu: string;
  ref: string;
  intro_lue: string;
  verset_evangile: string | null;
  ref_verset: string | null;
}

export interface AelfMesse {
  nom: string;
  lectures: AelfLecture[];
}

export interface AelfInformations {
  date: string;
  zone: string;
  couleur: string;
  annee: string;
  temps_liturgique: string;
  semaine: string;
  jour: string;
  jour_liturgique_nom: string;
  fete: string;
  degre: string;
  ligne1: string;
  ligne2: string;
  ligne3: string;
  couleur2: string | null;
  couleur3: string | null;
}

export interface AelfResponse {
  informations: AelfInformations;
  messes: AelfMesse[];
}
