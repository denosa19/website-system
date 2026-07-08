import Container from "../components/ui/Container";
import Heading from "../components/ui/Heading";
import Section from "../components/ui/Section";
import Text from "../components/ui/Text";
import Card from "../components/ui/Card";
import { theme } from "../styles/theme";

const features = [
  "Modernes Design",
  "SEO-optimiert",
  "Schnelle Ladezeiten",
  "Mobile Optimierung",
];

export default function AboutSection() {
  return (
    <Section
      id="ueber-uns"
      className={`${theme.colors.background} ${theme.colors.text}`}
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <Heading level="h2" className="mb-6">
              Warum Internet Firma?
            </Heading>

            <Text variant="large" className="mb-8">
              Wir entwickeln moderne Webseiten mit einem modularen Framework,
              das Geschwindigkeit, Design und langfristige Wartbarkeit
              miteinander verbindet.
            </Text>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature}>
                  <Text>{feature}</Text>
                </Card>
              ))}
            </div>
          </div>

          <Card className="flex min-h-[420px] items-center justify-center">
            <Text variant="muted">
              Hier kommt später ein Bild, Video oder eine Animation.
            </Text>
          </Card>
        </div>
      </Container>
    </Section>
  );
}