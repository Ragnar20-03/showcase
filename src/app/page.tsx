import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getProjectOrder } from "@/lib/project-order-store";
import { getSyncedProjects } from "@/lib/synced-projects-store";
import { getOverrides } from "@/lib/project-overrides-store";
import { getHeroStats } from "@/lib/hero-stats-store";
import { applyProjectOrder } from "@/lib/project-order";
import { applyOverrides } from "@/lib/project-overrides";
import { defaultProjects } from "@/lib/projects-data";
import { defaultHeroStats } from "@/lib/hero-stats-data";

export default async function Home() {
  const [order, synced, overrides, heroStats] = await Promise.all([
    getProjectOrder(),
    getSyncedProjects(),
    getOverrides(),
    getHeroStats(),
  ]);
  const visibleProjects = applyOverrides([...defaultProjects, ...synced], overrides);
  const orderedProjects = applyProjectOrder(visibleProjects, order);

  return (
    <main>
      <Navbar />
      <Hero stats={heroStats.length > 0 ? heroStats : defaultHeroStats} />
      <About />
      <Skills />
      <Projects projects={orderedProjects} />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
