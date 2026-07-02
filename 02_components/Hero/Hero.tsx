import type { HeroProps } from "./Hero.types";

export default function Hero({
  title,
  subtitle,
}: HeroProps) {
  return (
    <section>
      <h1>{title}</h1>

      {subtitle && <p>{subtitle}</p>}
    </section>
  );
}