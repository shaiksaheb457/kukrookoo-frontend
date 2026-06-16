import Navbar           from "@/components/layout/Navbar";
import Footer           from "@/components/layout/Footer";
import HeroSection      from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import WhyUsSection     from "@/components/sections/WhyUsSection";
import AboutSection     from "@/components/sections/AboutSection";
import FreshnessTracker from "@/components/sections/FreshnessTracker";


export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <WhyUsSection />
	<FreshnessTracker />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}