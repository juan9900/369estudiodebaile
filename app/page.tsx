import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { AboutSection } from "@/components/about-section";
import { ClassesSection } from "@/components/classes-section";
import { ContactSection } from "@/components/contact-section";
import { StudioRentalSection } from "@/components/studio-rental-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <ClassesSection />

      <Footer />
    </>
  );
}
