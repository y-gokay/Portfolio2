import { LenisProvider } from "@/components/lenis-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { SkipToContent } from "@/components/skip-to-content";
import { StickyHeader } from "@/components/sticky-header";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { HeroSection } from "@/components/sections/hero-section";
import { ManifestoSection } from "@/components/sections/manifesto-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { ShowcaseSection } from "@/components/sections/showcase-section";
import { CarouselSection } from "@/components/sections/carousel-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { FooterSection } from "@/components/sections/footer-section";

export default function Home() {
  return (
    <ErrorBoundary>
      <LenisProvider>
        <SkipToContent />
        <StickyHeader />
        <ScrollProgress />
        <main id="main-content" className="bg-background">
          <ThemeToggle />
          <LanguageToggle />
          <HeroSection />
          <ManifestoSection />
          <FeaturesSection />
          <ShowcaseSection />
          <CarouselSection />
          <InsightsSection />
          <FooterSection />
        </main>
        <BackToTop />
      </LenisProvider>
    </ErrorBoundary>
  );
}
