"use client";

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
import { AwardsSection } from "@/components/sections/awards-section";
import { FooterSection } from "@/components/sections/footer-section";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function Home() {
  const { getSectionVisibility, loading } = useSiteSettings();

  // Don't render sections until settings are loaded (to avoid flash)
  if (loading) {
    return (
      <ErrorBoundary>
        <LenisProvider>
          <SkipToContent />
          <StickyHeader />
          <ScrollProgress />
          <main id="main-content" className="bg-background min-h-screen" />
          <BackToTop />
        </LenisProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LenisProvider>
        <SkipToContent />
        <StickyHeader />
        <ScrollProgress />
        <main id="main-content" className="bg-background">
          {/* Mobile-only toggle buttons (Desktop'ta header içinde) */}
          <div className="md:hidden">
            <ThemeToggle />
            <LanguageToggle />
          </div>
          {getSectionVisibility("hero") && <HeroSection />}
          {getSectionVisibility("about") && <ManifestoSection />}
          {getSectionVisibility("skills") && <FeaturesSection />}
          {getSectionVisibility("portfolio") && <ShowcaseSection />}
          {getSectionVisibility("carousel") && <CarouselSection />}
          {getSectionVisibility("research") && <InsightsSection />}
          {getSectionVisibility("awards") && <AwardsSection />}
          {getSectionVisibility("contact") && <FooterSection />}
        </main>
        <BackToTop />
      </LenisProvider>
    </ErrorBoundary>
  );
}
