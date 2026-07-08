import Button from "../atoms/Button";
import Logo from "../atoms/logo";
import Container from "../ui/Container";
import { siteConfig } from "../../config/site";

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden gap-10 md:flex">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition hover:text-neutral-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button href="#kontakt">
          Anfrage starten
        </Button>
      </Container>
    </header>
  );
}