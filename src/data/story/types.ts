export type FactionId = 'bones' | 'silence' | 'traders' | 'exiles';

export type GodId = 'hekate' | 'vesper' | 'morrana' | 'obol' | 'mater' | 'lzhebog';

export type EvidenceId =
  | 'ledger'
  | 'seal'
  | 'canon'
  | 'ascended'
  | 'statue'
  | 'testimony'
  | 'voice';

export type StoryRequire = {
  gift?: GodId;
  noGift?: GodId;
  evidence?: EvidenceId;
  evidenceCount?: number;
  rep?: { faction: FactionId; min: number };
  flag?: string;
  noFlag?: string;
  healthMin?: number;
  healthMax?: number;
  sanityMin?: number;
  sanityMax?: number;
};

export type StoryEffects = {
  evidence?: EvidenceId;
  gift?: GodId;
  rep?: Partial<Record<FactionId, number>>;
  health?: number;
  sanity?: number;
  flags?: string[];
};

export type StoryChoice = {
  id: string;
  label: string;
  hint?: string;
  require?: StoryRequire;
  effects?: StoryEffects;
  next: string;
};

export type EndingTone = 'good' | 'dark' | 'bad' | 'neutral';

export type StoryEnding = {
  name: string;
  tone: EndingTone;
  icon: string;
  summary: string;
  teaser: string;
};

export type StoryScene = {
  id: string;
  title: string;
  place: string;
  icon: string;
  glow?: string;
  text: string[];
  choices: StoryChoice[];
  ending?: StoryEnding;
};