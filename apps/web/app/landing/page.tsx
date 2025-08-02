"use client";

import { AppShowcase } from "./components/AppShowcase";
import { FeaturesSection } from "./components/FeaturesSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { TestimonialsSection } from "./components/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      {/* <AppShowcase /> */}
      {/* <TestimonialsSection /> */}
      <Footer />
    </div>
  );
};

export default Index;
