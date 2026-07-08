import Button from "../components/atoms/Button";
import Container from "../components/ui/Container";
import { theme } from "../styles/theme";

export default function HeroSection() {
  return (
    <section
      className={`
        min-h-screen
        flex items-center
        ${theme.colors.background}
        ${theme.colors.text}
      `}
    >
      <Container className="flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold mb-6">
          Internet Firma
        </h1>

        <p className="text-xl text-neutral-300 max-w-2xl">
          Das modulare Website-System für moderne Unternehmen.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Button href="/kontakt" size="lg">
            Projekt starten
          </Button>

          <Button variant="secondary" size="lg">
            Mehr erfahren
          </Button>
        </div>
      </Container>
    </section>
  );
}