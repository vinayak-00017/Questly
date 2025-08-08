"use client";

import DailyShowcase from "./components/daily-showcase";

import { Footer } from "./components/Footer";
import Hero from "./components/hero";
import { HeroSection } from "./components/HeroSection";
import MainShowcase from "./components/main-showcase";
import RealHero from "./components/real-hero";

import TrackingSection from "./components/tracking-section";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* <HeroSection /> */}
      {/* <RealHero /> */}
      <Hero />
      <DailyShowcase />
      <MainShowcase />
      <TrackingSection />
      {/* <FeaturesSection /> */}
      {/* <AppShowcase /> */}
      {/* <TestimonialsSection /> */}
      <Footer />
    </div>
  );
};

export default Index;
