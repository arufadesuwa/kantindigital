import Hero from "@/components/landingPage/hero";
import { Feature } from "@/components/landingPage/feature";
import { Navbar } from "@/components/landingPage/navbar";
import { Footer } from "@/components/landingPage/footer";

export default async function Home() {

  return (
    <main className="bg-white min-h-screen selection:bg-accent/30">
      <Navbar />
      <Hero />
      <Feature />
      <Footer />
    </main>
  );
}
