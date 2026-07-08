import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import Heading from "../components/ui/Heading";
import Section from "../components/ui/Section";
import Text from "../components/ui/Text";
import { theme } from "../styles/theme";

const services = [
  {
    title: "Webseiten",
    description:
      "Moderne, schnelle und responsive Webseiten für Unternehmen.",
  },
  {
    title: "SEO",
    description:
      "Optimierung für Google, lokale Sichtbarkeit und bessere Auffindbarkeit.",
  },
  {
    title: "Wartung",
    description:
      "Technische Betreuung, Updates, Sicherheit und laufende Pflege.",
  },
];

export default function ServicesSection() {
  return (
    <Section
      id="leistungen"
      className={`${theme.colors.background} ${theme.colors.text}`}
    >
      <Container>
        <div className="mb-12 max-w-2xl">
          <Heading level="h2" className="mb-4">
            Leistungen
          </Heading>

          <Text variant="large">
            Digitale Lösungen, die Unternehmen professioneller sichtbar machen.
          </Text>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title}>
              <Heading level="h3" className="mb-3">
                {service.title}
              </Heading>

              <Text variant="muted">
                {service.description}
              </Text>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}