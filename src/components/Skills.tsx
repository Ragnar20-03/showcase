"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, staggerFast, viewportConfig } from "@/lib/animations";

const skillGroups = [
  {
    category: "AI / Agents",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/25",
    dot: "bg-violet-400",
    priority: true,
    skills: ["LLM APIs", "RAG Pipelines", "AI Agents", "n8n Automation", "Prompt Engineering", "LangChain", "OpenAI API", "Anthropic API", "Vector DBs", "Embeddings"],
  },
  {
    category: "Salesforce",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/25",
    dot: "bg-blue-400",
    priority: true,
    skills: ["Apex", "LWC", "Salesforce Platform", "Agentforce", "Einstein AI", "SOQL", "SOSL", "Flows", "Process Builder", "REST Integration"],
  },
  {
    category: "Languages",
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/20",
    dot: "bg-cyan-400",
    skills: ["TypeScript", "JavaScript", "Python", "Java", "C", "C++", "Apex", "Shell / Bash"],
  },
  {
    category: "Frontend",
    color: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/20",
    dot: "bg-pink-400",
    skills: ["React", "Next.js", "Angular", "React Native", "Tailwind CSS", "Framer Motion", "HTML5", "CSS3", "SCSS"],
  },
  {
    category: "Backend & Databases",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    skills: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "REST APIs", "WebSockets", "WebRTC", "MERN Stack", "MEAN Stack"],
  },
  {
    category: "Web3 / Blockchain",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/20",
    dot: "bg-orange-400",
    skills: ["Solana", "Anchor Framework", "Web3.js", "Smart Contracts", "DeFi", "SPL Tokens", "On-chain Programs"],
  },
  {
    category: "DevOps & Cloud",
    color: "from-yellow-500/20 to-yellow-500/5",
    border: "border-yellow-500/20",
    dot: "bg-yellow-400",
    skills: ["Docker", "Kubernetes", "AWS", "GitHub Actions", "CI/CD", "Vercel", "Nginx", "Linux", "Kernel Modules", "Device Drivers", "System Programming", "Linux System Calls"],
  },
  {
    category: "Tools & Systems",
    color: "from-slate-500/20 to-slate-500/5",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
    skills: ["Git", "GitHub", "Linux / Unix", "System Calls", "OS Internals", "DBMS", "Data Structures", "Algorithms", "TCP/IP", "Postman"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-4 relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportConfig}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-4">Skills</p>
            <h2 className="section-heading text-white">
              My <span className="gradient-text">Tech Arsenal</span>
            </h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm">
              From Linux kernel modules to AI agents — built from the ground up.
            </p>
          </motion.div>

          <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skillGroups.map((group) => (
              <motion.div
                key={group.category}
                variants={fadeUp}
                className={`relative glass rounded-2xl p-5 border card-hover bg-linear-to-br ${group.color} ${group.border} ${group.priority ? "ring-1 ring-violet-500/20" : ""}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${group.dot}`} />
                    <span className="text-sm font-semibold text-white">{group.category}</span>
                  </div>
                  {group.priority && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 font-medium">
                      Primary
                    </span>
                  )}
                </div>
                <motion.div
                  variants={staggerFast}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  className="flex flex-wrap gap-1.5"
                >
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={fadeUp}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-white/55 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200 cursor-default"
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
