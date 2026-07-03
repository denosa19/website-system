import Button from "../components/atoms/Button";
import { theme } from "../styles/theme";

export default function HeroSection() {
  return (
    <section
      className={`
        min-h-screen
        flex flex-col items-center justify-center
        px-6
        ${theme.colors.background}
        ${theme.colors.text}
      `}
    >
      <h1 className="text-6xl font-bold mb-6 text-center">
        Internet Firma
      </h1>

      <p className="text-xl text-neutral-300 text-center max-w-2xl">
        Das modulare Website-System für moderne Unternehmen.
      </p>

      <div className="mt-12 flex gap-4">
        <Button href="/kontakt" size="lg">
          Projekt starten
        </Button>

        <Button variant="secondary" size="lg">
          Mehr erfahren
        </Button>
      </div>
    </section>
  );
}