import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getProjectOrder } from "@/sanity/lib/projectOrder";
import { applyProjectOrder } from "@/lib/project-order";
import { defaultProjects } from "@/lib/projects-data";

export default async function Home() {
  const order = await getProjectOrder();
  const orderedProjects = applyProjectOrder(defaultProjects, order);

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
