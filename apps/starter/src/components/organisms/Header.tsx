import Button from "../atoms/Button";
import Logo from "../atoms/Logo";
import Container from "../ui/Container";

const navItems = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Über uns", href: "#ueber-uns" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-neutral-300 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="#kontakt" size="sm">
            Anfrage starten
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
          aria-label="Menü öffnen"
        >
          ☰
        </button>
      </Container>
    </header>
  );
}