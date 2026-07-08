import Header from "../components/organisms/Header";

import HeroSection from "../sections/HeroSection";
import ServicesSection from "../sections/ServicesSection";
import AboutSection from "../sections/AboutSection";
import ContactSection from "../sections/ContactSection";

export default function Home() {
  return (
    <main>
      <Header />

      <HeroSection />

      <ServicesSection />

      <AboutSection />

      <ContactSection />
    </main>
  );
}