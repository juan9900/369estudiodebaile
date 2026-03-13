import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { AboutSection } from "@/components/about-section";
import { ClassesSection } from "@/components/classes-section";
import { ContactSection } from "@/components/contact-section";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <AboutSection />
      <ClassesSection />
      <div className="bg-primary">
        <ContactSection />
      </div>
    </>
  );
}
