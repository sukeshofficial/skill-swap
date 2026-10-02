import { ArrowRight, Code2, Camera, Palette, Terminal, Sparkles, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const profileCards = [
  {
    name: "Alex Morgan",
    role: "Senior Frontend Engineer",
    location: "Remote / San Francisco",
    avatar: "AM",
    avatarBg: "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
    teaches: {
      skill: "React Architecture",
      icon: Code2,
      category: "Engineering",
    },
    wants: {
      skill: "Portrait Photography",
      icon: Camera,
      category: "Creative",
    },
    compatibility: "High Match (98%)",
  },
  {
    name: "Maya Chen",
    role: "Commercial Photographer",
    location: "Remote / New York",
    avatar: "MC",
    avatarBg: "bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
    teaches: {
      skill: "Portrait Photography",
      icon: Camera,
      category: "Creative",
    },
    wants: {
      skill: "UI & Design Systems",
      icon: Palette,
      category: "Design",
    },
    compatibility: "High Match (96%)",
  },
  {
    name: "David Kim",
    role: "Staff Backend Engineer",
    location: "Remote / Seattle",
    avatar: "DK",
    avatarBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
    teaches: {
      skill: "Distributed Systems & Go",
      icon: Terminal,
      category: "Engineering",
    },
    wants: {
      skill: "React Architecture",
      icon: Code2,
      category: "Engineering",
    },
    compatibility: "Perfect Match (100%)",
  },
]

export function SkillDiscovery() {
  return (
    <section id="discover" className="py-20 bg-[#FAFAF9] dark:bg-[#0F1012] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A4A]/10 text-[#FF5A4A] text-xs font-bold uppercase tracking-wider">
              Network Marketplace
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111318] dark:text-[#F5F5F5]">
              Find someone who knows what you want to learn.
            </h2>
          </div>
          <a
            href="#browse"
            className="inline-flex items-center text-xs font-semibold text-[#FF5A4A] hover:underline gap-1.5"
          >
            Browse all 1,200+ skill offers
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Profile Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profileCards.map((card, index) => {
            const TeachIcon = card.teaches.icon
            const WantIcon = card.wants.icon

            return (
              <div
                key={index}
                className="group p-5 rounded-xl bg-white dark:bg-[#151619] border border-[#E7E7E4] dark:border-white/10 hover:border-[#FF5A4A]/40 shadow-sm transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Profile Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#E7E7E4] dark:border-white/8">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${card.avatarBg}`}>
                        {card.avatar}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111318] dark:text-[#F5F5F5]">
                          {card.name}
                        </h3>
                        <p className="text-xs text-[#62666F] dark:text-[#A1A4AC]">
                          {card.role}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Sparkles className="w-3 h-3" />
                      {card.compatibility}
                    </span>
                  </div>

                  {/* Skills Exchange Block */}
                  <div className="py-4 space-y-3">
                    {/* TEACHES */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B8F97] dark:text-[#70737B]">
                        TEACHES
                      </span>
                      <div className="p-2.5 rounded-lg bg-[#F6F6F4] dark:bg-[#1A1B1F] border border-[#E7E7E4] dark:border-white/5 flex items-center gap-2 text-xs font-semibold text-[#111318] dark:text-[#F5F5F5]">
                        <TeachIcon className="w-4 h-4 text-[#FF5A4A]" />
                        <span>{card.teaches.skill}</span>
                      </div>
                    </div>

                    {/* WANTS */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B8F97] dark:text-[#70737B]">
                        WANTS
                      </span>
                      <div className="p-2.5 rounded-lg bg-[#F6F6F4] dark:bg-[#1A1B1F] border border-[#E7E7E4] dark:border-white/5 flex items-center gap-2 text-xs font-semibold text-[#111318] dark:text-[#F5F5F5]">
                        <WantIcon className="w-4 h-4 text-blue-500" />
                        <span>{card.wants.skill}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Meta & Action */}
                <div className="pt-3 border-t border-[#E7E7E4] dark:border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-[#8B8F97] dark:text-[#70737B]">
                    <MapPin className="w-3 h-3" />
                    <span>{card.location}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2.5 text-xs font-semibold text-[#FF5A4A] hover:bg-[#FF5A4A]/10 hover:text-[#FF5A4A]"
                  >
                    View Profile →
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
