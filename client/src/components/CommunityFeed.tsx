import { Activity, ArrowRightLeft, Clock } from "lucide-react"

const activities = [
  {
    user1: "Priya Sharma",
    user2: "Arjun Mehta",
    action: "started learning Figma Design System from",
    skill: "Figma Systems",
    time: "4 mins ago",
    avatar1: "PS",
    avatar2: "AM",
  },
  {
    user1: "Daniel Santos",
    user2: "Elena Rostova",
    action: "exchanged Python Backend for",
    skill: "Commercial Photography",
    time: "18 mins ago",
    avatar1: "DS",
    avatar2: "ER",
  },
  {
    user1: "Maria Garcia",
    user2: "Kenji Sato",
    action: "completed her 3rd 1:1 Skill Swap session on",
    skill: "React Architecture",
    time: "42 mins ago",
    avatar1: "MG",
    avatar2: "KS",
  },
]

export function CommunityFeed() {
  return (
    <section id="community" className="py-20 bg-[#FAFAF9] dark:bg-[#0F1012] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A4A]/10 text-[#FF5A4A] text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            Live Network Stream
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] dark:text-[#F5F5F5]">
            Real-time skill exchanges happening now.
          </h2>
        </div>

        {/* Compact Activity Stream Box */}
        <div className="rounded-xl border border-[#E7E7E4] dark:border-white/10 bg-white dark:bg-[#151619] divide-y divide-[#E7E7E4] dark:divide-white/8 shadow-sm overflow-hidden">
          {activities.map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#F6F6F4] dark:hover:bg-[#1A1B1F] transition-colors">

              <div className="flex items-center gap-3 sm:gap-4">
                {/* Avatars Pair */}
                <div className="flex items-center -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF5A4A]/10 text-[#FF5A4A] font-bold text-[11px] flex items-center justify-center border-2 border-white dark:border-[#151619]">
                    {item.avatar1}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] flex items-center justify-center border-2 border-white dark:border-[#151619]">
                    {item.avatar2}
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-[#111318] dark:text-[#F5F5F5] font-normal leading-normal">
                  <span className="font-bold">{item.user1}</span> {item.action}{" "}
                  <span className="font-bold">{item.user2}</span>
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FF5A4A]/10 text-[#FF5A4A]">
                    <ArrowRightLeft className="w-3 h-3" />
                    {item.skill}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-xs text-[#8B8F97] dark:text-[#70737B] font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.time}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
