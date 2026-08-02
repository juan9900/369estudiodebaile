import { Hero } from "@/components/hero";
import { ClassesSection } from "@/components/classes-section";
import { StudioRentalSection } from "@/components/studio-rental-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ClassesSection />
        <StudioRentalSection />
      </main>
      <Footer />
    </div>
  );
}
