import { gendered } from '@/data/story/voice';

const SPEAKERS: Record<string, string> = {
  'ГЕКАТА': '#b98ae0',
  'САРИЭЛ': '#b9c8ff',
  'ТЫ': 'hsl(var(--ink))',
  'ДУША': '#8ab4ff',
  'ДУША АПОСТОЛА': '#8ab4ff',
  'МОРТЕКС': '#c9d2d4',
  'КАССИАН': '#dfe6e8',
  'МОРРАНА': '#e8ecee',
  'ЛЖЕБОГ': '#f2e6b8',
  'ГОЛОС': '#b98ae0',
};

const parse = (line: string) => {
  const m = line.match(/^([А-ЯЁ][А-ЯЁ ]{1,24}):\s+(.*)$/);
  if (!m) return null;
  return { who: m[1], text: m[2] };
};

type SceneTextProps = { line: string; gender: string; delay: number };

const SceneText = ({ line, gender, delay }: SceneTextProps) => {
  const said = parse(line);
  const style = { animationDelay: `${delay}s` };

  if (!said)
    return (
      <p className="animate-fade text-[0.94rem] leading-[1.75] text-foreground/88" style={style}>
        {gendered(line, gender)}
      </p>
    );

  const color = SPEAKERS[said.who] ?? 'hsl(var(--foreground))';
  const hero = said.who === 'ТЫ';

  return (
    <div
      className={`animate-fade border-l-2 py-0.5 pl-3.5 ${hero ? 'ml-4 sm:ml-8' : ''}`}
      style={{ ...style, borderColor: color }}
    >
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em]" style={{ color }}>
        {hero ? 'Ты' : said.who.charAt(0) + said.who.slice(1).toLowerCase()}
      </p>
      <p className="mt-0.5 font-display text-[0.98rem] italic leading-[1.6] text-foreground">
        — {gendered(said.text, gender)}
      </p>
    </div>
  );
};

export default SceneText;
