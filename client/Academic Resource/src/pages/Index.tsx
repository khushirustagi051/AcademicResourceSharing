import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import SiteFooter from "@/components/SiteFooter";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <Features />
    <HowItWorks />
    <TrustSection />
    <SiteFooter />
  </div>
);

export default Index