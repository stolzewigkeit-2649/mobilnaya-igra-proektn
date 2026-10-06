import type { Archetype } from '@/data/archetype-types';

export const ROT_PRIEST: Archetype = {
  id: 'rot',
  name: 'Жрец Порчи',
  subtitle: 'Носитель фиолетового пламени',
  tagline: 'Гниль — тоже молитва. Он читает её вслух.',
  concept:
    'Чёрно-фиолетовые доспехи с черепами и рогатый посох-череп. Поднимает мёртвых, разъедает врагов порчей и платит за силу собственной кровью.',
  role: ['Маг', 'Призыватель', 'Дебаффер'],
  attributes: ['Тьма', 'Порча', 'Смерть'],
  height: 190,
  age: '30–35',
  accent: '#9b4dff',
  stats: [
    { label: 'Сила', value: 72 },
    { label: 'Порча', value: 94 },
    { label: 'Воля', value: 52 },
    { label: 'Защита', value: 46 },
  ],
  skills: [
    {
      id: 'skeletons',
      name: 'Призыв скелетов',
      desc: 'Поднимает из праха отряд скелетов, который отвлекает и рвёт врагов.',
      icon: 'Skull',
    },
    {
      id: 'blight',
      name: 'Порча',
      desc: 'Проклятие ослабляет цель и медленно разъедает её защиту.',
      icon: 'Biohazard',
    },
    {
      id: 'burst',
      name: 'Тёмный взрыв',
      desc: 'Сгусток фиолетового пламени взрывается и бьёт всех вокруг цели.',
      icon: 'Bomb',
    },
    {
      id: 'sacrifice',
      name: 'Жертвоприношение',
      desc: 'Разрушает своего призванного и превращает его в мощный удар или исцеление.',
      icon: 'Droplets',
    },
    {
      id: 'decay',
      name: 'Аура разложения',
      desc: 'Враги рядом гниют заживо: теряют здоровье и скорость, пока стоят близко.',
      icon: 'Wind',
    },
  ],
  looks: [{ id: 'classic', label: 'Доспех черепов', full: '/necro/rot-full.webp', face: '/necro/rot-face.webp' }],
  variants: [
    { id: 'classic', label: 'Фиолетовое пламя', filter: 'none', tint: '#9b4dff' },
    {
      id: 'plague',
      label: 'Чумной сад',
      filter: 'sepia(1) hue-rotate(65deg) saturate(1.8) brightness(.9)',
      tint: '#5ec27e',
    },
    {
      id: 'bronze',
      label: 'Бронзовый культ',
      filter: 'sepia(1) saturate(2.2) brightness(.95)',
      tint: '#c9963e',
    },
    {
      id: 'blood',
      label: 'Кровавая гниль',
      filter: 'sepia(1) hue-rotate(-45deg) saturate(3.4) brightness(.85)',
      tint: '#d0453a',
    },
    {
      id: 'bone',
      label: 'Костяной пепел',
      filter: 'sepia(.55) saturate(.7) brightness(1.08)',
      tint: '#d8cbb0',
    },
  ],
  accessories: ['Рогатый посох-череп', 'Пояс черепов', 'Кадило порчи', 'Бронзовые наплечники'],
  materials: ['почти чёрный', 'глубокий фиолетовый', 'бронза', 'кость'],
  linkedGod: 'mater',
  linkedKind: 'kadaver',
};
