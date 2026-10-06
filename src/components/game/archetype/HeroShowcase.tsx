type HeroShowcaseProps = {
  src: string;
  alt: string;
  glow: string;
  filter?: string;
  className?: string;
};

const MASK =
  'linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 8%, #000 88%, transparent 100%)';

const HeroShowcase = ({ src, alt, glow, filter = 'none', className = '' }: HeroShowcaseProps) => (
  <div className={`relative flex items-end justify-center overflow-hidden ${className}`}>
    <div
      className="pointer-events-none absolute inset-0 transition-[background] duration-700"
      style={{
        background: `radial-gradient(50% 45% at 50% 52%, ${glow}55 0%, ${glow}1a 45%, transparent 75%)`,
      }}
    />
    <div
      className="pointer-events-none absolute bottom-[6%] left-1/2 h-8 w-2/3 -translate-x-1/2 rounded-[50%] blur-xl"
      style={{ background: `${glow}66` }}
    />
    <img
      key={src + filter}
      src={src}
      alt={alt}
      draggable={false}
      className="relative h-full w-auto max-w-full animate-fade-in select-none object-contain"
      style={{
        filter: `${filter === 'none' ? '' : filter} drop-shadow(0 0 24px ${glow}55)`,
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
      }}
    />
  </div>
);

export default HeroShowcase;
