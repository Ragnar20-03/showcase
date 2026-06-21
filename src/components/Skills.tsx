"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, staggerFast, viewportConfig } from "@/lib/animations";

const skillGroups = [
  {
    category: "Languages",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
    dot: "bg-violet-400",
    skills: ["TypeScript", "JavaScript", "Python", "C++", "C", "Java", "Apex"],
  },
  {
    category: "Frontend",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
    skills: ["React", "Next.js", "Angular", "Tailwind CSS", "React Native", "LWC"],
  },
  {
    category: "Backend & DB",
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/20",
    dot: "bg-cyan-400",
    skills: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "REST APIs"],
  },
  {
    category: "Web3 / Blockchain",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/20",
    dot: "bg-orange-400",
    skills: ["Solana", "Web3.js", "Anchor Framework", "Smart Contracts", "DeFi"],
  },
  {
    category: "AI / ML",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    skills: ["LLM APIs", "RAG Pipelines", "AI Agents", "n8n Automation", "Prompt Engineering"],
    badge: "Learning",
  },
  {
    category: "DevOps & Cloud",
    color: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/20",
    dot: "bg-pink-400",
    skills: ["Docker", "Linux", "Git", "AWS", "GitHub Actions", "Vercel"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-4 relative">
      {/* Background accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-4">Skills</p>
            <h2 className="section-heading text-white">
              My <span className="gradient-text">Tech Arsenal</span>
            </h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm">
              From low-level C++ to Solana smart contracts to AI agents — I cover a lot of ground.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {skillGroups.map((group) => (
              <motion.div
                key={group.category}
                variants={fadeUp}
                className={`relative glass rounded-2xl p-6 border card-hover bg-gradient-to-br ${group.color} ${group.border}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${group.dot}`} />
                    <span className="text-sm font-semibold text-white">{group.category}</span>
                  </div>
                  {group.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                      {group.badge}
                    </span>
                  )}
                </div>
                <motion.div
                  variants={staggerFast}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  className="flex flex-wrap gap-2"
                >
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={fadeUp}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
