"use client";

import { motion } from "framer-motion";
import { slideLeft, slideRight, stagger, viewportConfig } from "@/lib/animations";

const journey = [
  { icon: "🎓", label: "CS Foundation", desc: "C, C++, Java, Data Structures, OS, DBMS" },
  { icon: "⚡", label: "Full Stack", desc: "MERN, MEAN, Next.js, TypeScript, WebRTC" },
  { icon: "🔗", label: "Web3", desc: "Solana, Anchor, DEX, On-chain apps" },
  { icon: "☁️", label: "Salesforce", desc: "Apex, LWC, 6 months professional exp" },
  { icon: "🤖", label: "AI Engineering", desc: "LLMs, RAG, Agents — in progress" },
];

export default function About() {
  return (
    <section id="about" className="py-28 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Left — Text */}
          <motion.div variants={slideLeft}>
            <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-4">About Me</p>
            <h2 className="section-heading text-white mb-6">
              Building the future,{" "}
              <span className="gradient-text">one stack at a time</span>
            </h2>
            <div className="space-y-4 text-white/50 text-base leading-relaxed">
              <p>
                I&apos;m Roshan Patil — a developer from India with a deep CS foundation and a hunger
                for high-impact engineering. I started with C/C++, moved through full-stack web and Web3,
                and now I&apos;m a professional Salesforce Developer with 6 months of real-world Apex &amp; LWC experience.
              </p>
              <p>
                My goal is clear: reach the highest-paying engineering roles by combining{" "}
                <span className="text-violet-300">Salesforce expertise</span> with{" "}
                <span className="text-blue-300">AI Engineering skills</span>. I&apos;m actively
                building toward FDE, AI Solutions Engineer, and AI Integration Engineer roles.
              </p>
              <p>
                I learn fast, build fast, and ship fast. 63+ GitHub repos since Jan 2023 is proof.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href="https://github.com/Ragnar20-03"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-sm font-medium glass border border-white/10 hover:border-violet-500/40 text-white/70 hover:text-white transition-all duration-200"
              >
                GitHub
              </a>
              <a
                href="mailto:roshanpp20@gmail.com"
                className="px-5 py-2.5 rounded-xl text-sm font-medium glass border border-white/10 hover:border-violet-500/40 text-white/70 hover:text-white transition-all duration-200"
              >
                Email Me
              </a>
            </div>
          </motion.div>

          {/* Right — Journey timeline */}
          <motion.div variants={slideRight} className="space-y-3">
            {journey.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportConfig}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-2xl p-4 border border-white/5 card-hover flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                  <div className="text-xs text-white/40">{item.desc}</div>
                </div>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500/60 flex-shrink-0" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
