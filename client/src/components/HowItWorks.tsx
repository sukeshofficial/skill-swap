const steps = [
  {
    number: "01",
    title: "Create your profile",
    description: "Tell the community what you know and what you want to learn.",
  },
  {
    number: "02",
    title: "Discover your match",
    description: "Find people whose skills complement yours with 1:1 compatibility.",
  },
  {
    number: "03",
    title: "Swap knowledge",
    description: "Connect and exchange skills directly with zero financial overhead.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#FAFAF9] dark:bg-[#0F1012] border-t border-[#E7E7E4] dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A4A]/10 text-[#FF5A4A] text-xs font-bold uppercase tracking-wider">
            Simple 3-Step Process
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111318] dark:text-[#F5F5F5]">
            How Skill Swap works.
          </h2>
        </div>

        {/* Editorial 3-Step Layout with Thin Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 border border-[#E7E7E4] dark:border-white/10 rounded-xl bg-white dark:bg-[#151619] md:divide-x divide-[#E7E7E4] dark:divide-white/10 overflow-hidden shadow-sm">
          {steps.map((step) => (
            <div key={step.number} className="p-8 space-y-4 hover:bg-[#F6F6F4] dark:hover:bg-[#1A1B1F] transition-colors">
              <span className="text-4xl font-extrabold font-mono text-[#FF5A4A] block">
                {step.number}
              </span>
              <h3 className="text-lg font-bold text-[#111318] dark:text-[#F5F5F5]">
                {step.title}
              </h3>
              <p className="text-sm text-[#62666F] dark:text-[#A1A4AC] leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
