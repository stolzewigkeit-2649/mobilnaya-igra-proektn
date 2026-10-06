import type { Archetype } from '@/data/archetype-types';

export const ABYSS_CALLER: Archetype = {
  id: 'abyss',
  name: 'Призыватель Бездны',
  subtitle: 'Тот, кто открывает врата',
  tagline:
    'Повелитель древних чудовищ и забытых богов. Его ритуалы открывают врата в Бездну, чтобы призвать то, чего смертные не должны видеть.',
  concept:
    'Вместо слабых мертвецов призывает древних чудовищ и боссов. Каждый призыв — риск: ритуал требует крови и жертв.',
  role: ['Маг', 'Призыватель'],
  attributes: ['Тьма', 'Бездна'],
  height: 192,
  age: '??',
  accent: '#7c3aed',
  stats: [
    { label: 'Сила', value: 95 },
    { label: 'Порча', value: 86 },
    { label: 'Воля', value: 64 },
    { label: 'Защита', value: 24 },
  ],
  skills: [
    {
      id: 'prepare',
      name: 'Подготовка ритуала',
      desc: 'Чертит круг печатей кровью: следующий призыв сильнее и дешевле.',
      icon: 'BookOpen',
    },
    {
      id: 'gates',
      name: 'Открытие врат Бездны',
      desc: 'Разрывает пространство и держит врата открытыми, пока хватает воли.',
      icon: 'Orbit',
    },
    {
      id: 'summon',
      name: 'Призыв существа',
      desc: 'Выводит из врат древнее чудовище — чем страшнее, тем выше цена.',
      icon: 'Eye',
    },
    {
      id: 'empower',
      name: 'Усиление призванного',
      desc: 'Кормит призванного своей тьмой: больше урона, крепче шкура.',
      icon: 'TrendingUp',
    },
    {
      id: 'command',
      name: 'Приказ / Контроль',
      desc: 'Удерживает чудовище на цепи воли и направляет его удар.',
      icon: 'Crown',
    },
    {
      id: 'offering',
      name: 'Жертва ради силы',
      desc: 'Отдаёт здоровье или союзника Бездне в обмен на мгновенный прилив мощи.',
      icon: 'Flame',
    },
  ],
  looks: [{ id: 'classic', label: 'Рваный плащ', full: '/necro/abyss-full.webp', face: '/necro/abyss-face.webp' }],
  variants: [
    { id: 'classic', label: 'Классический (Бездна)', filter: 'none', tint: '#7c3aed' },
    {
      id: 'blood',
      label: 'Кровавый ритуал',
      filter: 'sepia(1) hue-rotate(-45deg) saturate(3.4) brightness(.85)',
      tint: '#d0453a',
    },
    {
      id: 'bone',
      label: 'Костяной культ',
      filter: 'sepia(.55) saturate(.7) brightness(1.08)',
      tint: '#d8cbb0',
    },
    {
      id: 'void',
      label: 'Пустотный инквизитор',
      filter: 'sepia(.8) hue-rotate(200deg) saturate(1.7) brightness(1.15) contrast(1.05)',
      tint: '#5b6bd8',
    },
    {
      id: 'gold',
      label: 'Золотой запрет',
      filter: 'sepia(1) saturate(2.6) brightness(1.2)',
      tint: '#e0b84a',
    },
  ],
  accessories: ['Книга ритуалов', 'Черепа-печати', 'Сигил на спине', 'Браслеты и цепи'],
  summons: [
    { name: 'Древний Ужас', desc: 'Многоглазая тень, от взгляда которой гаснет рассудок.' },
    { name: 'Костяной Колосс', desc: 'Гора сросшихся костей, ломающая стены.' },
    { name: 'Бездонный Змей', desc: 'Кольца без конца, утаскивающие врагов во тьму.' },
    { name: 'Разрушитель Миров', desc: 'Почти бог: держится секунды, но рушит всё.' },
    { name: 'Владыка Падших', desc: 'Коронованный мертвец, ведущий за собой своё войско.' },
  ],
  linkedGod: 'vesper',
  linkedKind: 'tenebrant',
};
