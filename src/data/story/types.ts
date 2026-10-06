export type FactionId = 'bones' | 'silence' | 'traders' | 'exiles';

export type GiftId =
  | 'speak-dead'
  | 'shard'
  | 'immortal'
  | 'torch'
  | 'moon-blade'
  | 'hekate-key'
  | 'name-vessel'
  | 'truth-voice'
  | 'morrana-verdict'
  | 'shard-accepted';

export type EvidenceId =
  | 'white-cloth'
  | 'letter'
  | 'chapel-lists'
  | 'false-sigils'
  | 'war-plan'
  | 'duat-dam'
  | 'son-memory'
  | 'shard-pattern'
  | 'empty-altar';

export type ChapterId = 'prologue' | 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'finale';

export type StoryRequire = {
  gift?: GiftId;
  gifts?: GiftId[];
  evidence?: EvidenceId;
  evidenceCount?: number;
  rep?: { faction: FactionId; min: number };
  flag?: string;
  flags?: string[];
  noFlag?: string;
  healthMin?: number;
  sanityMin?: number;
};

export type StoryEffects = {
  evidence?: EvidenceId | EvidenceId[];
  gift?: GiftId | GiftId[];
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
  lockHint?: string;
  once?: boolean;
  note?: string;
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
  epigraph?: { title: string; line: string };
};

export type StoryBanner = {
  kicker: string;
  title: string;
  icon: string;
  color?: string;
  lines: string[];
};

export type StoryScene = {
  id: string;
  chapter: ChapterId;
  chapterStart?: boolean;
  title: string;
  place: string;
  icon: string;
  glow?: string;
  objective?: string;
  text: string[];
  onEnter?: StoryEffects;
  banner?: StoryBanner;
  choices: StoryChoice[];
  ending?: StoryEnding;
};
