import { Users, ArrowLeftRight, Sparkles, ShieldCheck, HeartHandshake } from "lucide-react"

const foundations = [
  {
    icon: Users,
    title: "Human Connection",
    description: "Meet real people, not static profiles.",
  },
  {
    icon: ArrowLeftRight,
    title: "Mutual Exchange",
    description: "Give a skill. Get a skill.",
  },
  {
    icon: Sparkles,
    title: "Learning",
    description: "Learn through direct 1:1 practice.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    description: "Build reputation through real swaps.",
  },
  {
    icon: HeartHandshake,
    title: "Community",
    description: "Learning works better together.",
  },
]

export function TrustPositioning() {
  return (
    <section className="relative py-16 bg-[#FAFAF9] dark:bg-[#0F1012] border-y border-[#E7E7E4] dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] dark:text-[#F5F5F5]">
            Learning works better both ways.
          </h2>
          <p className="text-sm sm:text-base text-[#62666F] dark:text-[#A1A4AC]">
            Skill Swap connects people through what they know and what they want to learn.
          </p>
        </div>

        {/* Structured Grid Layout with 1px Thin Dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-[#E7E7E4] dark:border-white/10 rounded-xl bg-white dark:bg-[#151619] divide-y sm:divide-y-0 sm:divide-x divide-[#E7E7E4] dark:divide-white/10 overflow-hidden shadow-sm">
          {foundations.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="p-5 flex flex-col items-start hover:bg-[#F6F6F4] dark:hover:bg-[#1A1B1F] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF5A4A]/10 text-[#FF5A4A] flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4" strokeWidth={1.85} />
                </div>

                <h3 className="text-sm font-bold text-[#111318] dark:text-[#F5F5F5] mb-1">
                  {item.title}
                </h3>

                <p className="text-xs text-[#62666F] dark:text-[#A1A4AC] leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
