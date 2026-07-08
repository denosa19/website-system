import Button from "../components/atoms/Button";
import Container from "../components/ui/Container";
import Heading from "../components/ui/Heading";
import Section from "../components/ui/Section";
import Text from "../components/ui/Text";
import { theme } from "../styles/theme";

export default function HeroSection() {
  return (
    <Section
      spacing="lg"
      className={`
        min-h-screen
        flex items-center
        ${theme.colors.background}
        ${theme.colors.text}
      `}
    >
      <Container className="flex flex-col items-center justify-center text-center">
        <Heading level="h1" className="mb-6">
          Internet Firma
        </Heading>

        <Text variant="large" className="max-w-2xl">
          Das modulare Website-System für moderne Unternehmen.
        </Text>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Button href="/kontakt" size="lg">
            Projekt starten
          </Button>

          <Button variant="secondary" size="lg">
            Mehr erfahren
          </Button>
        </div>
      </Container>
    </Section>
  );
}