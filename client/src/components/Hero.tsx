import { ArrowRight, Check, Code2, Camera, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-[#FAFAF9] dark:bg-[#0F1012] transition-colors duration-200">

      {/* Product-Style Technical Background: Faint Grid & Connection Paths */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E7E7E4_1px,transparent_1px),linear-gradient(to_bottom,#E7E7E4_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF5A4A]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT: Editorial Copy & CTAs */}
          <div className="lg:col-span-6 space-y-7 text-left">

            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A4A]/10 border border-[#FF5A4A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A4A]" />
              <span className="text-[11px] font-bold tracking-widest text-[#FF5A4A] uppercase">
                LEARN • SHARE • SWAP
              </span>
            </div>

            {/* Large Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] dark:text-[#F5F5F5] leading-[1.06]">
              Trade what you know. <br />
              <span className="text-[#FF5A4A]">Learn what you don't.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#62666F] dark:text-[#A1A4AC] leading-relaxed max-w-xl font-normal">
              Find people who can teach you something useful while sharing the skills you already have.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Button
                size="lg"
                className="h-11 px-6 text-sm font-semibold bg-[#FF5A4A] hover:bg-[#E0493A] text-white rounded-lg shadow-sm shadow-[#FF5A4A]/20 transition-all hover:-translate-y-0.5"
              >
                Find a Skill
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-11 px-6 text-sm font-semibold border border-[#E7E7E4] dark:border-white/14 bg-white dark:bg-[#151619] text-[#111318] dark:text-[#F5F5F5] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all"
              >
                Offer a Skill
              </Button>
            </div>

            {/* Reciprocal Proof Badges */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#8B8F97] dark:text-[#70737B] font-medium border-t border-[#E7E7E4] dark:border-white/8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>100% Peer-to-Peer</span>
              </div>
              <div className="h-3 w-px bg-[#E7E7E4] dark:bg-white/10" />
              <div>Zero Subscription Fees</div>
            </div>

          </div>

          {/* RIGHT: Product Interface Skill Exchange Visualization */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Product Window Frame */}
              <div className="rounded-xl border border-[#E7E7E4] dark:border-white/10 bg-white dark:bg-[#151619] shadow-xl overflow-hidden transition-all duration-300">

                {/* Header Bar */}
                <div className="px-4 py-3 bg-[#F6F6F4] dark:bg-[#1A1B1F] border-b border-[#E7E7E4] dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 text-[11px] font-mono text-[#8B8F97] dark:text-[#70737B] tracking-wider uppercase">
                      Skill Exchange Interface
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FF5A4A]/10 text-[#FF5A4A]">
                    ● LIVE MATCH
                  </span>
                </div>

                {/* Inner Interactive Exchange Cards */}
                <div className="p-6 space-y-6">

                  {/* User 1 Card: Alex Morgan */}
                  <div className="p-4 rounded-lg bg-[#F6F6F4] dark:bg-[#1A1B1F] border border-[#E7E7E4] dark:border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-200 dark:border-blue-800/50">
                        AM
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111318] dark:text-[#F5F5F5]">
                          Alex Morgan
                        </div>
                        <div className="text-[11px] text-[#62666F] dark:text-[#A1A4AC]">
                          Senior Frontend Engineer
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B8F97] dark:text-[#70737B]">
                        Teaches
                      </span>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111318] dark:text-[#F5F5F5] bg-white dark:bg-[#25272C] px-2.5 py-1 rounded border border-[#E7E7E4] dark:border-white/10 mt-0.5">
                        <Code2 className="w-3.5 h-3.5 text-blue-500" />
                        React Architecture
                      </div>
                    </div>
                  </div>

                  {/* Reciprocal ↕ Connection Line */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-[#E7E7E4] dark:border-white/10" />
                    </div>
                    <div className="relative z-10 w-9 h-9 rounded-full bg-[#FF5A4A] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#151619]">
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* User 2 Card: Maya Chen */}
                  <div className="p-4 rounded-lg bg-[#F6F6F4] dark:bg-[#1A1B1F] border border-[#E7E7E4] dark:border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-200 dark:border-amber-800/50">
                        MC
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111318] dark:text-[#F5F5F5]">
                          Maya Chen
                        </div>
                        <div className="text-[11px] text-[#62666F] dark:text-[#A1A4AC]">
                          Visual Photographer
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B8F97] dark:text-[#70737B]">
                        Teaches
                      </span>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111318] dark:text-[#F5F5F5] bg-white dark:bg-[#25272C] px-2.5 py-1 rounded border border-[#E7E7E4] dark:border-white/10 mt-0.5">
                        <Camera className="w-3.5 h-3.5 text-amber-500" />
                        Portrait Photography
                      </div>
                    </div>
                  </div>

                  {/* Match Found Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#E7E7E4] dark:border-white/10 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span>MATCH FOUND</span>
                    </div>
                    <span className="text-[#62666F] dark:text-[#A1A4AC] font-mono text-[11px]">
                      100% Reciprocal Swap
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
