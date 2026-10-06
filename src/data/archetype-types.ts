export type ArchetypeStat = { label: 'Сила' | 'Порча' | 'Воля' | 'Защита'; value: number };

export type ArchetypeSkill = { id: string; name: string; desc: string; icon: string };

export type ArchetypeLook = { id: string; label: string; full: string; face: string };

export type ArchetypeVariant = { id: string; label: string; filter: string; tint: string };

export type ArchetypeSummon = { name: string; desc: string };

export type Archetype = {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  concept: string;
  role: string[];
  attributes: string[];
  height: number;
  age: string;
  accent: string;
  stats: ArchetypeStat[];
  skills: ArchetypeSkill[];
  looks: ArchetypeLook[];
  variants: ArchetypeVariant[];
  accessories: string[];
  materials?: string[];
  summons?: ArchetypeSummon[];
  linkedGod: string;
  linkedKind?: string;
};

export type ArchetypeChoice = {
  id: string;
  lookId: string;
  variantId: string;
  magicColor: string;
  name: string;
  skills: string[];
  relic: string;
};
