"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#f97316] via-[#ec4899] to-[#8b5cf6] opacity-20 blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#f59e0b] via-[#f97316] to-[#ec4899] opacity-15 blur-[100px] animate-pulse [animation-delay:1.5s]" />
      <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#f97316] opacity-10 blur-[80px] animate-pulse [animation-delay:3s]" />
    </div>
  );
}

function Nav({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const links = ["About", "Projects", "Travel"];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      dark ? "bg-[#0d0a0e]/80 border-white/5" : "bg-white/80 border-black/5"
    }`}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold tracking-wide bg-gradient-to-r from-[#f97316] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent">
          obam.ai
        </span>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className={`relative text-sm font-[family-name:var(--font-dm-mono)] tracking-widest uppercase group transition-colors duration-200 ${
                dark ? "text-white/60 hover:text-white" : "text-black/50 hover:text-black"
              }`}
            >
              {l}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-[#f97316] to-[#ec4899] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <button
            onClick={() => setDark(!dark)}
            className={`relative w-12 h-6 rounded-full border transition-colors duration-300 ${
              dark ? "bg-[#f97316]/20 border-[#f97316]/30" : "bg-black/10 border-black/20"
            }`}
            aria-label="Toggle theme"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow ${
                dark ? "translate-x-6 bg-gradient-to-br from-[#f97316] to-[#ec4899]" : "translate-x-0 bg-white"
              }`}
            />
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`block h-px w-6 transition-all duration-300 ${dark ? "bg-white" : "bg-black"} ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-px w-6 transition-all duration-300 ${dark ? "bg-white" : "bg-black"} ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 transition-all duration-300 ${dark ? "bg-white" : "bg-black"} ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-64" : "max-h-0"}`}>
        <div className="px-6 py-4 flex flex-col gap-4 border-t border-white/5">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className={`text-sm font-[family-name:var(--font-dm-mono)] tracking-widest uppercase ${
                dark ? "text-white/70" : "text-black/60"
              }`}
            >
              {l}
            </a>
          ))}
          <button
            onClick={() => setDark(!dark)}
            className={`self-start text-xs font-[family-name:var(--font-dm-mono)] tracking-widest uppercase ${
              dark ? "text-[#f97316]" : "text-black/40"
            }`}
          >
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </nav>
  );
}

function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-[#f97316] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

function ProjectCard({ href, title, desc, dark }: { href: string; title: string; desc: string; dark: boolean }) {
  return (
    <a
      href={href}
      className={`group block p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "border-white/10 bg-white/5 hover:border-[#f97316]/40"
          : "border-black/10 bg-black/3 hover:border-[#f97316]/40"
      }`}
    >
      <h3 className={`font-[family-name:var(--font-cormorant)] text-xl font-semibold mb-2 ${dark ? "text-white" : "text-black"}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${dark ? "text-white/50" : "text-black/50"}`}>{desc}</p>
      <span className="mt-4 inline-block text-xs font-[family-name:var(--font-dm-mono)] tracking-widest uppercase text-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        View →
      </span>
    </a>
  );
}

function TravelCard({ href, flag, label, date, desc, dark }: {
  href: string; flag: string; label: string; date: string; desc: string; dark: boolean;
}) {
  return (
    <a
      href={href}
      className={`group block p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "border-white/10 bg-white/5 hover:border-[#ec4899]/40"
          : "border-black/10 bg-black/3 hover:border-[#ec4899]/40"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{flag}</span>
        <span className="text-xs font-[family-name:var(--font-dm-mono)] tracking-widest uppercase text-[#f59e0b] bg-[#f59e0b]/10 px-3 py-1 rounded-full">
          {date}
        </span>
      </div>
      <h3 className={`font-[family-name:var(--font-cormorant)] text-xl font-semibold mb-1 ${dark ? "text-white" : "text-black"}`}>
        {label}
      </h3>
      <p className={`text-sm leading-relaxed ${dark ? "text-white/50" : "text-black/50"}`}>{desc}</p>
    </a>
  );
}

export default function Home() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = ""; };
  }, []);

  const bg = dark ? "bg-[#0d0a0e] text-white" : "bg-[#faf9f7] text-black";

  return (
    <div className={`min-h-screen transition-colors duration-500 font-[family-name:var(--font-cormorant)] ${bg}`}>
      <Orbs />
      <Nav dark={dark} setDark={setDark} />

      {/* Hero */}
      <section className="min-h-screen flex items-center max-w-5xl mx-auto px-6 pt-16">
        <div className="grid md:grid-cols-2 gap-16 w-full items-center">
          {/* Left — text */}
          <div className="flex flex-col">
            <p className={`font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.3em] uppercase mb-6 ${dark ? "text-white/40" : "text-black/40"}`}>
              Hello, world —
            </p>
            <h1 className="text-6xl md:text-7xl font-light leading-[1.05] tracking-tight">
              Hi, I'm <GradientText>Olu</GradientText>
              <br />
              <span className={dark ? "text-white/90" : "text-black/90"}>Mabogunje.</span>
            </h1>
            <p className={`mt-8 text-lg md:text-xl font-light leading-relaxed ${dark ? "text-white/60" : "text-black/55"}`}>
              A full-bodied hobbyist — engineer, data scientist, builder, traveller.
              I make things that spark curiosity and share them here.
            </p>
            <div className="mt-10 flex gap-4 flex-wrap">
              <a
                href="#projects"
                className="px-6 py-3 rounded-full text-sm font-[family-name:var(--font-dm-mono)] tracking-widest uppercase bg-gradient-to-r from-[#f97316] via-[#ec4899] to-[#8b5cf6] text-white hover:opacity-90 transition-opacity"
              >
                My work
              </a>
              <a
                href="#about"
                className={`px-6 py-3 rounded-full text-sm font-[family-name:var(--font-dm-mono)] tracking-widest uppercase border transition-colors ${
                  dark ? "border-white/20 text-white/70 hover:border-white/50" : "border-black/20 text-black/60 hover:border-black/50"
                }`}
              >
                About me
              </a>
            </div>
            <div className="mt-16 flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-[#f97316] to-[#ec4899]" />
              <span className={`font-[family-name:var(--font-dm-mono)] text-xs tracking-widest uppercase ${dark ? "text-white/30" : "text-black/30"}`}>
                Scroll
              </span>
            </div>
          </div>

          {/* Right — photo */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-80 h-96">
              {/* glow behind the photo */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f97316] via-[#ec4899] to-[#8b5cf6] opacity-20 blur-2xl scale-110" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/profile.png"
                  alt="Olu Mabogunje"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-5xl mx-auto px-6 py-32">
        <p className={`font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.3em] uppercase mb-4 ${dark ? "text-white/40" : "text-black/40"}`}>
          01 / About
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-10">
          <GradientText>Who</GradientText> I am
        </h2>
        <div className={`grid md:grid-cols-2 gap-10 text-lg font-light leading-relaxed ${dark ? "text-white/65" : "text-black/60"}`}>
          <p>
            Global citizen. Electrical Engineer. Data Scientist. I carry a
            deep love for learning across disciplines — from circuit boards to
            machine learning pipelines to family genealogies rendered in D3.
          </p>
          <p>
            I believe in the power of community and curiosity. I'm happiest when
            building things that spark wonder, connecting with people who care
            about ideas, and planning the next adventure.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-5xl mx-auto px-6 py-32">
        <p className={`font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.3em] uppercase mb-4 ${dark ? "text-white/40" : "text-black/40"}`}>
          02 / Projects
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-10">
          Things I've <GradientText>built</GradientText>
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <ProjectCard
            href="/family-tree"
            title="Family Tree"
            desc="An interactive D3 visualization of the Mabogunje family history — with highlight, re-root, and full spouse views."
            dark={dark}
          />
          <ProjectCard
            href="/community-chair-tracker"
            title="Community Chair Tracker"
            desc="Haughville Hotties — a shared inventory tracker for community tables and chairs. Borrow, transfer, return."
            dark={dark}
          />
          <ProjectCard
            href="/voxdrop"
            title="VoxDrop"
            desc="An AI video transcription tool — paste a link or upload a file, get timestamped segments, plain text, or SRT subtitles."
            dark={dark}
          />
        </div>
      </section>

      {/* Travel */}
      <section id="travel" className="max-w-5xl mx-auto px-6 py-32">
        <p className={`font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.3em] uppercase mb-4 ${dark ? "text-white/40" : "text-black/40"}`}>
          03 / Travel
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-2">
          Places I've <GradientText>been</GradientText>
        </h2>
        <p className={`mb-10 font-[family-name:var(--font-dm-mono)] text-xs tracking-widest uppercase ${dark ? "text-white/30" : "text-black/30"}`}>
          And places I'm going.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <TravelCard
            href="/travel/belgrade"
            flag="🇷🇸"
            label="Belgrade, Serbia"
            date="Aug 2025"
            desc="Green card celebration — 7 days of kafanas, kayaks, and underground clubs."
            dark={dark}
          />
          <div className={`p-6 rounded-2xl border border-dashed flex items-center justify-center ${dark ? "border-white/10" : "border-black/10"}`}>
            <span className={`font-[family-name:var(--font-cormorant)] text-2xl ${dark ? "text-white/20" : "text-black/20"}`}>
              Next adventure…
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`max-w-5xl mx-auto px-6 py-12 border-t ${dark ? "border-white/5" : "border-black/5"}`}>
        <div className="flex items-center justify-between">
          <span className={`font-[family-name:var(--font-dm-mono)] text-xs tracking-widest uppercase ${dark ? "text-white/20" : "text-black/20"}`}>
            © 2026 Oluwagbemiga Mabogunje
          </span>
          <div className="h-px w-16 bg-gradient-to-r from-[#f97316] to-[#8b5cf6] opacity-40" />
        </div>
      </footer>
    </div>
  );
}
