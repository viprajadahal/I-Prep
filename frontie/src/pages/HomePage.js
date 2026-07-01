import React from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import TestimonialSection from '../components/landing/TestimonialSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

const HomePage = () => {
  return (
    <LandingLayout>
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </LandingLayout>
  );
};

export default HomePage;