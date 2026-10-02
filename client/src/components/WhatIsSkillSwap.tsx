import { BookOpen, Compass, RefreshCw } from "lucide-react"

const stages = [
  {
    number: "01",
    icon: BookOpen,
    title: "Teach what you know",
    description: "Share practical skills you’ve built.",
    tag: "Give",
  },
  {
    number: "02",
    icon: Compass,
    title: "Find what you want",
    description: "Discover people who know what you want to learn.",
    tag: "Discover",
  },
  {
    number: "03",
    icon: RefreshCw,
    title: "Exchange knowledge",
    description: "Connect, swap skills, and grow together.",
    tag: "Swap",
  },
]

export function WhatIsSkillSwap() {
  return (
    <section id="what-is-skill-swap" className="relative py-24 sm:py-32 bg-[#FAF9F8] dark:bg-[#0C0A09] text-[#111827] dark:text-[#FAFAF9] overflow-hidden">

      {/* Soft background ambient gradient curve */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF5A4A]/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-20 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A4A]/10 text-[#FF5A4A] text-xs font-bold uppercase tracking-wider">
            Reciprocal Learning
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12]">
            Learning shouldn’t always be one-way.
          </h2>

          <p className="text-lg sm:text-xl text-[#374151] dark:text-[#D1D5DB] leading-relaxed font-normal">
            You already know something someone else wants to learn. And there’s probably something you want to learn from someone else.
          </p>

          <p className="text-base sm:text-lg font-semibold text-[#FF5A4A]">
            Skill Swap turns that idea into a simple exchange.
          </p>
        </div>

        {/* Editorial Layout: Abstract Meeting Paths & 3 Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT: Abstract Visual Path Echoing Brand Geometry (Meeting in Middle) */}
          <div className="lg:col-span-6 relative">
            <div className="relative p-8 rounded-xl bg-white/70 dark:bg-[#1C1917]/70 backdrop-blur-md border border-[#111827]/5 dark:border-white/10 shadow-lg">

              {/* Header inside visual card */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-neutral-800">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  The Reciprocal Path
                </span>
                <span className="text-xs font-semibold text-[#FF5A4A] bg-[#FF5A4A]/10 px-2.5 py-1 rounded-full">
                  Two-Way Flow
                </span>
              </div>

              {/* Graphic Representation of Two Human Paths Meeting */}
              <div className="relative my-8 h-64 sm:h-72 flex items-center justify-center">

                {/* SVG Curves illustrating Path A & Path B converging */}
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 400 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Path A (Person 1 - Orange/Coral flowing top-left to center) */}
                  <path
                    d="M 30 40 C 130 40, 150 120, 200 120"
                    stroke="url(#gradient-path-a)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  {/* Path B (Person 2 - Dark/Gray flowing bottom-right to center) */}
                  <path
                    d="M 370 200 C 270 200, 250 120, 200 120"
                    stroke="url(#gradient-path-b)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />

                  {/* Secondary dashed connection lines showing circular reciprocity */}
                  <path
                    d="M 200 120 C 250 120, 270 40, 370 40"
                    stroke="#FF5A4A"
                    strokeWidth="1.75"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />
                  <path
                    d="M 200 120 C 150 120, 130 200, 30 200"
                    stroke="#FF5A4A"
                    strokeWidth="1.75"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="gradient-path-a" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF5A4A" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FF5A4A" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="gradient-path-b" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#111827" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#FF5A4A" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Left Node: Person 1 (Teach) */}
                <div className="absolute top-4 left-2 sm:left-4 p-3 rounded-xl bg-white dark:bg-[#262220] shadow-md border border-gray-100 dark:border-neutral-700 flex items-center gap-2.5 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#FF5A4A]/10 text-[#FF5A4A] flex items-center justify-center font-bold text-xs">
                    <span className="text-[10px]">You</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-900 dark:text-white">Has Skill</div>
                    <div className="text-[10px] text-gray-500">e.g. Design Systems</div>
                  </div>
                </div>

                {/* Right Node: Person 2 (Learn) */}
                <div className="absolute bottom-4 right-2 sm:right-4 p-3 rounded-xl bg-white dark:bg-[#262220] shadow-md border border-gray-100 dark:border-neutral-700 flex items-center gap-2.5 z-10">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    <span className="text-[10px]">Peer</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-900 dark:text-white">Has Skill</div>
                    <div className="text-[10px] text-gray-500">e.g. Piano / Music</div>
                  </div>
                </div>

                {/* CENTRAL MEETING POINT NODE (The Heart/Hand Exchange) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-2 rounded-full bg-[#FF5A4A]/30 blur-md animate-pulse" />
                    <div className="relative w-14 h-14 rounded-full bg-[#FF5A4A] text-white flex items-center justify-center shadow-xl border-4 border-white dark:border-[#1C1917]">
                      <RefreshCw className="w-6 h-6 animate-spin" style={{ animationDuration: '12s' }} />
                    </div>
                  </div>
                  <span className="mt-2.5 text-[11px] font-extrabold text-[#FF5A4A] uppercase tracking-wider bg-[#FF5A4A]/10 px-2.5 py-0.5 rounded-full">
                    Skill Swap
                  </span>
                </div>

              </div>

              <div className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                Mutual benefit with zero financial transaction
              </div>
            </div>
          </div>

          {/* RIGHT: Three Visual Stages */}
          <div className="lg:col-span-6 space-y-5">
            {stages.map((stage) => {
              const Icon = stage.icon
              return (
                <div
                  key={stage.number}
                  className="group relative p-6 sm:p-7 rounded-xl bg-white/60 dark:bg-[#1C1917]/60 backdrop-blur-sm border border-[#111827]/5 dark:border-white/5 hover:border-[#FF5A4A]/30 transition-all duration-300 hover:shadow-md flex items-start gap-5"
                >
                  {/* Stage Number & Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FF5A4A]/10 text-[#FF5A4A] flex items-center justify-center group-hover:bg-[#FF5A4A] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" strokeWidth={1.85} />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-[#FAFAF9]">
                        {stage.title}
                      </h3>
                      <span className="text-xs font-mono font-semibold text-gray-400 dark:text-gray-500">
                        {stage.number}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#374151] dark:text-[#D1D5DB] font-normal leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
