import type { Character, ListField } from '@/hooks/use-character';

export type SectionProps = {
  character: Character;
  set: <K extends keyof Character>(field: K, value: Character[K]) => void;
  toggle: (field: ListField, value: string) => void;
};
