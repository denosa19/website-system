import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Textarea from "../components/atoms/Textarea";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import Heading from "../components/ui/Heading";
import Section from "../components/ui/Section";
import Text from "../components/ui/Text";
import { theme } from "../styles/theme";

export default function ContactSection() {
  return (
    <Section
      id="kontakt"
      className={`${theme.colors.background} ${theme.colors.text}`}
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <Heading level="h2" className="mb-4">
              Kontakt aufnehmen
            </Heading>

            <Text variant="large" className="mb-8">
              Erzählen Sie uns kurz von Ihrem Projekt. Wir melden uns zeitnah
              mit einer ersten Einschätzung.
            </Text>

            <div className="space-y-3 text-neutral-300">
              <p>E-Mail: info@internet-firma.de</p>
              <p>Region: Mannheim, Ludwigshafen & Rhein-Neckar</p>
            </div>
          </div>

          <Card>
            <form className="space-y-5">
              <Input
                label="Name"
                name="name"
                placeholder="Ihr Name"
              />

              <Input
                label="E-Mail"
                name="email"
                type="email"
                placeholder="ihre@email.de"
              />

              <Input
                label="Firma"
                name="company"
                placeholder="Ihre Firma"
              />

              <Textarea
                label="Nachricht"
                name="message"
                placeholder="Worum geht es?"
              />

              <Button size="lg">
                Anfrage senden
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  );
}