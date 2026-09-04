export type Option = {
  id: string;
  label: string;
  desc?: string;
  color?: string;
  meta?: string;
  locked?: boolean;
};

export const GENDERS: Option[] = [
  { id: 'male', label: 'Мужской' },
  { id: 'female', label: 'Женский' },
  { id: 'nonbinary', label: 'Небинарный' },
];

export const BUILDS: Option[] = [
  { id: 'slim', label: 'Худое' },
  { id: 'medium', label: 'Среднее' },
  { id: 'athletic', label: 'Атлетичное' },
  { id: 'massive', label: 'Массивное' },
];

export const AGES: Option[] = [
  { id: 'young', label: 'Юный', desc: '16–20' },
  { id: 'adult', label: 'Молодой', desc: '20–30' },
  { id: 'mature', label: 'Зрелый', desc: '30–45' },
  { id: 'old', label: 'Старческий', desc: '45+' },
];

export const FACE_SHAPES: Option[] = [
  { id: 'oval', label: 'Овальная' },
  { id: 'square', label: 'Квадратная' },
  { id: 'triangle', label: 'Треугольная' },
  { id: 'round', label: 'Круглая' },
  { id: 'angular', label: 'Угловатая' },
];

export const SKIN_COLORS: Option[] = [
  { id: 'alabaster', label: 'Бледный (алебастр)', color: '#e6e2da' },
  { id: 'ivory', label: 'Светлый (слоновая кость)', color: '#e3cdb0' },
  { id: 'olive', label: 'Оливковый', color: '#b79b6c' },
  { id: 'tan', label: 'Смуглый', color: '#96693f' },
  { id: 'dark', label: 'Тёмный', color: '#5d3c28' },
  { id: 'ashen', label: 'Пепельно-серый', desc: 'для нежити', color: '#9aa09a' },
  { id: 'livid', label: 'Синюшный', desc: 'для Живых Реликтов', color: '#8ba0ad' },
  { id: 'marble', label: 'Мраморный', desc: 'с прожилками', color: '#d7dde0' },
];

export const HAIRSTYLES: Option[] = [
  { id: 'buzz', label: 'Ежик', desc: 'Короткие', meta: 'short' },
  { id: 'pixie', label: 'Пикси', desc: 'Короткие', meta: 'short' },
  { id: 'bowl', label: 'Под горшок', desc: 'Короткие', meta: 'short' },
  { id: 'bob', label: 'Каре', desc: 'Средние', meta: 'mid' },
  { id: 'ragged', label: 'Рваные пряди', desc: 'Средние', meta: 'mid' },
  { id: 'straight', label: 'Гладкие', desc: 'Длинные', meta: 'long' },
  { id: 'wavy', label: 'Волнистые', desc: 'Длинные', meta: 'long' },
  { id: 'curly', label: 'Кудрявые', desc: 'Длинные', meta: 'long' },
  { id: 'braids', label: 'Косы', desc: 'Длинные', meta: 'long' },
  { id: 'locks', label: 'Локоны', desc: 'Сложные', meta: 'complex' },
  { id: 'mohawk', label: 'Ирокез', desc: 'Сложные', meta: 'complex' },
  { id: 'asymmetric', label: 'Асимметричные', desc: 'Сложные', meta: 'complex' },
];

export const HAIR_COLORS: Option[] = [
  { id: 'blond', label: 'Блондин', color: '#d8c089' },
  { id: 'brown', label: 'Шатен', color: '#7b5334' },
  { id: 'black', label: 'Брюнет', color: '#2e2723' },
  { id: 'ginger', label: 'Рыжий', color: '#a8481f' },
  { id: 'ash', label: 'Пепельный', color: '#8e8e88' },
  { id: 'silver', label: 'Серебряный', color: '#cfd6d8' },
  { id: 'white', label: 'Белый', color: '#f2f4f2' },
  { id: 'raven', label: 'Вороново-чёрный', color: '#14161a' },
  { id: 'violet', label: 'Фиолетовый', color: '#7b4ea8' },
  { id: 'blue', label: 'Синий', color: '#34599e' },
  { id: 'grey-streaks', label: 'Седой с прядями', color: '#a9b0ad' },
];

export const EYE_COLORS: Option[] = [
  { id: 'hazel', label: 'Карий', color: '#6b4226' },
  { id: 'blue', label: 'Голубой', color: '#6fa8dc' },
  { id: 'green', label: 'Зелёный', color: '#4f9e6a' },
  { id: 'grey', label: 'Серый', color: '#9aa5a3' },
  { id: 'amber', label: 'Янтарный', color: '#d79a2b' },
  { id: 'gold', label: 'Золотой', color: '#f2c14e' },
  { id: 'silver', label: 'Серебряный', color: '#d7e0e2' },
  { id: 'red', label: 'Красный', color: '#c23b34' },
  { id: 'purple', label: 'Фиолетовый', color: '#9b59d0' },
  { id: 'void', label: 'Чёрный', desc: 'без белка', color: '#0b0d10' },
  { id: 'blind', label: 'Белый', desc: 'слепые', color: '#eef4f0' },
];

export const EYE_EFFECTS: Option[] = [
  { id: 'glow', label: 'Лёгкое свечение' },
  { id: 'slit', label: 'Вертикальные зрачки' },
  { id: 'double', label: 'Двойные зрачки' },
  { id: 'no-iris', label: 'Отсутствие радужки' },
];

export const BROW_SHAPES: Option[] = [
  { id: 'straight', label: 'Прямые' },
  { id: 'arch', label: 'Дуги' },
  { id: 'break', label: 'Излом' },
];

export const BROW_DENSITY: Option[] = [
  { id: 'sparse', label: 'Редкие' },
  { id: 'medium', label: 'Средние' },
  { id: 'thick', label: 'Густые' },
];

export const BROW_COLORS: Option[] = [
  { id: 'hair', label: 'В тон волосам' },
  { id: 'contrast', label: 'Контрастный' },
];

export const NOSES: Option[] = [
  { id: 'straight', label: 'Прямой' },
  { id: 'hooked', label: 'С горбинкой' },
  { id: 'snub', label: 'Курносый' },
  { id: 'long', label: 'Длинный' },
  { id: 'wide', label: 'Широкий' },
];

export const LIPS: Option[] = [
  { id: 'thin', label: 'Тонкие' },
  { id: 'medium', label: 'Средние' },
  { id: 'full', label: 'Полные' },
  { id: 'asymmetric', label: 'Асимметричные' },
  { id: 'cracked', label: 'С трещинами' },
];

export const FACE_SCARS: Option[] = [
  { id: 'forehead', label: 'На лбу' },
  { id: 'cheek', label: 'На щеке' },
  { id: 'eye', label: 'Через глаз' },
  { id: 'chin', label: 'На подбородке' },
];

export const SCAR_NATURE: Option[] = [
  { id: 'ragged', label: 'Рваные' },
  { id: 'ritual', label: 'Аккуратные', desc: 'от ритуалов' },
  { id: 'burn', label: 'Ожоговые' },
  { id: 'claws', label: 'Следы когтей' },
];

export const FACE_TATTOOS: Option[] = [
  { id: 'runes', label: 'Руны вокруг глаза' },
  { id: 'cheeklines', label: 'Линии вдоль скул' },
  { id: 'hekate', label: 'Символы Гекаты', desc: 'факел, ключ' },
  { id: 'shards', label: 'Осколки на висках' },
  { id: 'serpent', label: 'Змеиные узоры' },
  { id: 'tears', label: 'Слёзные дорожки' },
];

export const BODY_SCARS: Option[] = [
  { id: 'chest', label: 'Грудь' },
  { id: 'arms', label: 'Руки' },
  { id: 'back', label: 'Спина' },
];

export const BODY_TATTOOS: Option[] = [
  { id: 'fullrunes', label: 'Полнотелые руны' },
  { id: 'bones', label: 'Символика Коалиции Костей', desc: 'черепа, кости' },
  { id: 'silence', label: 'Ордена Тишины', desc: 'колокола, саваны' },
  { id: 'traders', label: 'Торговцев', desc: 'монеты, весы' },
  { id: 'exiles', label: 'Изгнанных', desc: 'разорванные цепи' },
];

export const SKIN_ANOMALIES: Option[] = [
  { id: 'decay', label: 'Частичное разложение', desc: 'руки-скелеты, открытая кость' },
  { id: 'veins', label: 'Мраморные вены', desc: 'энергия смерти' },
  { id: 'goldveins', label: 'Золотые прожилки', desc: 'от осколков' },
];

export const HANDS: Option[] = [
  { id: 'fingers', label: 'Длинные пальцы' },
  { id: 'claws', label: 'Когти натуральные' },
  { id: 'claws-deco', label: 'Когти украшенные' },
  { id: 'wraps', label: 'Повязки' },
  { id: 'bandages', label: 'Бинты' },
  { id: 'gloves', label: 'Перчатки без пальцев' },
];

export const GAITS: Option[] = [
  { id: 'straight', label: 'Прямая' },
  { id: 'limp', label: 'Лёгкая хромота' },
  { id: 'heavy', label: 'Тяжёлый шаг' },
  { id: 'silent', label: 'Бесшумная' },
];
