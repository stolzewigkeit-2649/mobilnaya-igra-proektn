import type { Archetype } from '@/data/archetype-types';

export const PSYCHOPOMP: Archetype = {
  id: 'psychopomp',
  name: 'Психопомп',
  subtitle: 'Проводник душ',
  tagline: 'Жрец, провожающий души в загробный мир. Не убивает сам, но спасает и ведёт.',
  concept:
    'Стоит на границе живых и мёртвых с посохом-фонарём. Светлые духи-проводники идут за ним и закрывают союзников собой.',
  role: ['Поддержка', 'Исцеление', 'Баффы'],
  attributes: ['Тьма', 'Дух', 'Порядок'],
  height: 188,
  age: '28–32',
  accent: '#a78bfa',
  stats: [
    { label: 'Сила', value: 38 },
    { label: 'Порча', value: 34 },
    { label: 'Воля', value: 92 },
    { label: 'Защита', value: 80 },
  ],
  skills: [
    {
      id: 'guide',
      name: 'Проводник душ',
      desc: 'Духи-проводники парят рядом и защищают союзников.',
      icon: 'Ghost',
    },
    {
      id: 'veil',
      name: 'Покров забвения',
      desc: 'Снижает урон и очищает негативные эффекты.',
      icon: 'Shield',
    },
    {
      id: 'solace',
      name: 'Утешение душ',
      desc: 'Исцеляет союзника, снимает контроль.',
      icon: 'HeartPulse',
    },
    {
      id: 'afterlife',
      name: 'Путь в загробный мир',
      desc: 'Врата, возвращающие павшего союзника — воскрешение.',
      icon: 'DoorOpen',
    },
    {
      id: 'choir',
      name: 'Погребальный хор',
      desc: 'Хор духов даёт силу и ускоряет перезарядку.',
      icon: 'Music',
    },
    {
      id: 'passage',
      name: 'Ритуал перехода',
      desc: 'Переносит союзника в безопасное место ценой части своей жизненной энергии.',
      icon: 'Footprints',
    },
  ],
  looks: [
    { id: 'lantern', label: 'Посох-фонарь', full: '/necro/psy1-full.webp', face: '/necro/psy1-face.webp' },
    { id: 'velvet', label: 'Лампа душ', full: '/necro/psy2-full.webp', face: '/necro/psy2-face.webp' },
  ],
  variants: [
    { id: 'classic', label: 'Классический', filter: 'none', tint: '#a78bfa' },
    {
      id: 'moon',
      label: 'Лунный страж',
      filter: 'sepia(1) hue-rotate(175deg) saturate(2.2) brightness(.95)',
      tint: '#4a86e8',
    },
    {
      id: 'white',
      label: 'Погребальный белый',
      filter: 'grayscale(.9) brightness(1.2) contrast(1.05)',
      tint: '#d6d3e0',
    },
    {
      id: 'wanderer',
      label: 'Сумрачный скиталец',
      filter: 'sepia(1) hue-rotate(65deg) saturate(1.8) brightness(.9)',
      tint: '#5ec27e',
    },
    {
      id: 'border',
      label: 'Хранитель границы',
      filter: 'sepia(.85) saturate(2.6) hue-rotate(-8deg) contrast(1.05)',
      tint: '#d08a3c',
    },
    {
      id: 'light',
      label: 'Погребальный свет',
      filter: 'grayscale(.4) sepia(.3) brightness(1.2)',
      tint: '#e8dcc0',
    },
    {
      id: 'dusk',
      label: 'Сумеречный путь',
      filter: 'sepia(.6) hue-rotate(220deg) saturate(1.6) brightness(.9)',
      tint: '#6f7fd8',
    },
    {
      id: 'oblivion',
      label: 'Забвение',
      filter: 'grayscale(1) contrast(1.15) brightness(.95)',
      tint: '#8a8a94',
    },
  ],
  accessories: ['Посох-психопомп', 'Лампа душ', 'Книга ритуалов', 'Цепь проводника', 'Символ Проводника'],
  materials: ['бархат', 'шёлк', 'кожа', 'потёртый металл', 'полированный металл', 'кость'],
  linkedGod: 'hekate',
  linkedKind: 'lachrimos',
};
