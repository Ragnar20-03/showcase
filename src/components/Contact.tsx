"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewportConfig } from "@/lib/animations";

const socials = [
  {
    label: "GitHub",
    handle: "@Ragnar20-03",
    href: "https://github.com/Ragnar20-03",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    color: "hover:border-white/30",
  },
  {
    label: "Email",
    handle: "roshanpp20@gmail.com",
    href: "mailto:roshanpp20@gmail.com",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "hover:border-violet-500/40",
  },
  {
    label: "LinkedIn",
    handle: "Roshan Patil",
    href: "https://www.linkedin.com/in/roshan-patil-0b46b7259/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "hover:border-blue-500/40",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.div variants={fadeUp}>
            <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-4">Contact</p>
            <h2 className="section-heading text-white mb-4">
              Let&apos;s <span className="gradient-text">Work Together</span>
            </h2>
            <p className="text-white/40 text-base max-w-lg mx-auto mb-12 leading-relaxed">
              Open to AI Engineer, FDE, and Salesforce AI roles. Building the bridge
              between enterprise software and AI — let&apos;s talk.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeUp} className="mb-12">
            <a
              href="mailto:roshanpp20@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-2xl shadow-violet-900/30 hover:shadow-violet-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get In Touch
            </a>
          </motion.div>

          {/* Social Cards */}
          <motion.div variants={stagger} className="grid sm:grid-cols-3 gap-4">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                variants={fadeUp}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`glass rounded-2xl p-5 border border-white/8 ${s.color} transition-all duration-300 hover:-translate-y-1 group flex flex-col items-center gap-3`}
              >
                <div className="text-white/40 group-hover:text-white transition-colors duration-200">
                  {s.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{s.label}</div>
                  <div className="text-xs text-white/30 mt-0.5">{s.handle}</div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
