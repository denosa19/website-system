import { HeroProps } from "./Hero.types";

export default function Hero(props: HeroProps) {
  return (
    <section>
      <h1>{props.title}</h1>

      {props.subtitle && <p>{props.subtitle}</p>}
    </section>
  );
}