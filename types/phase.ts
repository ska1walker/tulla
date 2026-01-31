export interface Phase {
  name: string;
  start: string;
  end: string;
  color: string;
}

export interface Phases {
  phase1: Phase;
  phase2: Phase;
  phase3: Phase;
}

export type PhaseKey = 'phase1' | 'phase2' | 'phase3';
