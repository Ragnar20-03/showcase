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
import { applyProjectOrder } from "@/lib/project-order";
import { defaultProjects } from "@/lib/projects-data";

export default async function Home() {
  const [order, synced] = await Promise.all([getProjectOrder(), getSyncedProjects()]);
  const orderedProjects = applyProjectOrder([...defaultProjects, ...synced], order);

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects projects={orderedProjects} />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
