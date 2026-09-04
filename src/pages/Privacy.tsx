import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const NOT_COLLECTED = [
  { icon: 'KeyRound', text: 'Пароли. Ты вводишь их только на сайте Google, Apple или Steam — игра эту страницу даже не видит.' },
  { icon: 'Mail', text: 'Электронную почту. Мы не запрашиваем её у сервиса входа и не храним.' },
  { icon: 'User', text: 'Имя и фамилию. В игре у тебя только выданный обителью псевдоним.' },
  { icon: 'Phone', text: 'Телефон. Он нигде не запрашивается.' },
  { icon: 'MapPin', text: 'Точное местоположение и адрес.' },
  { icon: 'CreditCard', text: 'Платёжные данные и номера карт.' },
  { icon: 'BookUser', text: 'Контакты, фотографии и файлы с твоего устройства.' },
  { icon: 'Eye', text: 'Рекламные трекеры и профили для показа рекламы — их в игре нет.' },
];

const STORED = [
  {
    title: 'Безликий номер героя',
    text: 'Когда ты входишь через внешний сервис, тот сообщает нам свой технический идентификатор. Мы сразу превращаем его в необратимый код и храним только код. Восстановить из него твой аккаунт в Google, Apple или Steam невозможно — даже нам.',
  },
  {
    title: 'Игровой псевдоним',
    text: 'Придуман игрой автоматически из набора слов вроде «Пепельный Дознаватель». К твоему настоящему имени отношения не имеет.',
  },
  {
    title: 'Игровой прогресс',
    text: 'Вид некроманта, пройденные области, дары богов, достижения и место в таблице рекордов.',
  },
  {
    title: 'Ключ сессии',
    text: 'Случайная строка в памяти твоего браузера, чтобы не входить заново при каждом запуске. Пропадает при выходе.',
  },
];

const RIGHTS = [
  'Выйти из аккаунта в любой момент — ключ сессии сразу перестаёт действовать.',
  'Попросить удалить героя вместе с прогрессом: напиши нам, и запись исчезнет.',
  'Играть, не сообщая ни одного личного сведения — этого достаточно для всей игры.',
];

const Privacy = () => (
  <main className="relative min-h-full w-full overflow-x-hidden bg-background px-4 py-10 text-foreground sm:px-6 sm:py-14">
    <div className="pointer-events-none absolute inset-0 scene-glow" />
    <div className="pointer-events-none absolute inset-0 scene-grid" />

    <article className="relative z-10 mx-auto w-full max-w-3xl animate-fade space-y-8">
      <header className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))] transition-colors hover:text-foreground"
        >
          <Icon name="ArrowLeft" size={13} className="text-ink" />
          На главный экран
        </Link>
        <h1 className="font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.015em] sm:text-[2.7rem]">
          Политика
          <span className="block italic text-ink">конфиденциальности</span>
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Requiem pro Veritate устроена так, чтобы знать о тебе как можно меньше. Ниже — понятным
          языком, что игра не собирает, что всё-таки хранит и зачем.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-secondary/40 p-5 sm:p-7">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-extrabold sm:text-xl">
          <Icon name="ShieldOff" size={20} className="text-ink" />
          Что игра НЕ собирает
        </h2>
        <ul className="mt-4 space-y-3">
          {NOT_COLLECTED.map((item) => (
            <li key={item.text} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <Icon name={item.icon} size={16} className="mt-0.5 shrink-0 text-ink" />
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-secondary/40 p-5 sm:p-7">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-extrabold sm:text-xl">
          <Icon name="Database" size={20} className="text-ink" />
          Что хранится на самом деле
        </h2>
        <div className="mt-4 space-y-4">
          {STORED.map((item) => (
            <div key={item.title}>
              <p className="text-sm font-bold text-foreground">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-secondary/40 p-5 sm:p-7">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-extrabold sm:text-xl">
          <Icon name="LogIn" size={20} className="text-ink" />
          Как работает вход
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Мы не делаем собственных логинов и паролей. Ты нажимаешь «Войти через Google», «Apple» или
          «Steam», попадаешь на страницу самого сервиса и подтверждаешь вход там. Сервис возвращает
          игре только подтверждение «это тот же человек, что и в прошлый раз» — без почты, имени и
          прочих сведений. Проверка личности целиком остаётся на стороне сервиса и подчиняется его
          собственной политике конфиденциальности.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-secondary/40 p-5 sm:p-7">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-extrabold sm:text-xl">
          <Icon name="Scale" size={20} className="text-ink" />
          Твои права
        </h2>
        <ul className="mt-4 space-y-3">
          {RIGHTS.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-ink" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-secondary/40 p-5 sm:p-7">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-extrabold sm:text-xl">
          <Icon name="Baby" size={20} className="text-ink" />
          Возраст и содержание
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Игра рассчитана на аудиторию от 16 лет из-за мрачных тем и сцен. Мы не проверяем возраст и
          не собираем такие сведения — за соблюдение ограничения отвечает сам игрок.
        </p>
      </section>

      <footer className="space-y-3 pb-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Вопросы по этой политике и просьбы об удалении героя — через раздел «Правила» в игре.
          Если правила изменятся, мы обновим эту страницу и укажем новую дату.
        </p>
        <p className="text-xs text-muted-foreground">Последнее обновление: 4 сентября 2026 года.</p>
        <Link
          to="/"
          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg px-7 font-display text-sm font-extrabold uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-200 btn-play-surface hover:scale-[1.02]"
        >
          <Icon name="Play" size={16} className="fill-current" />
          Вернуться в игру
        </Link>
      </footer>
    </article>
  </main>
);

export default Privacy;
