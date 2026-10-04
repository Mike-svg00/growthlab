import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HeroSection } from "./sections/HeroSection";
import { PortfolioSection } from "./sections/PortfolioSection";
import { ServicesSection } from "./sections/ServicesSection";
import { ResumeSection } from "./sections/ResumeSection";
import { CollaborationSection } from "./sections/CollaborationSection";
import { PaymentSection } from "./sections/PaymentSection";
import { ContactSection } from "./sections/ContactSection";

export default function App() {
  return (
    <>
      <div className="border-b border-accent/20 bg-accent-light/50 px-4 py-2 text-center font-sans text-xs text-ink-muted sm:text-sm">
        Режим макета: пунктирные блоки показывают, <strong className="font-medium text-ink">что куда вставить</strong>.
        Заполняем разделы по одному.
      </div>
      <Header />
      <main>
        <HeroSection />
        <PortfolioSection />
        <ServicesSection />
        <ResumeSection />
        <CollaborationSection />
        <PaymentSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
