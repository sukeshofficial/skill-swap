import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-20 bg-[#FAFAF9] dark:bg-[#0F1012] border-t border-[#E7E7E4] dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white dark:bg-[#151619] border border-[#E7E7E4] dark:border-white/10 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-sm space-y-6">

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111318] dark:text-[#F5F5F5] leading-tight">
            Your next skill is one conversation away.
          </h2>

          <p className="text-base sm:text-lg text-[#62666F] dark:text-[#A1A4AC] max-w-xl mx-auto font-normal">
            Share what you know. Find what you want to learn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              size="lg"
              className="h-11 px-7 text-sm font-semibold bg-[#FF5A4A] hover:bg-[#E0493A] text-white rounded-lg shadow-sm shadow-[#FF5A4A]/20 transition-all hover:-translate-y-0.5"
            >
              Start Swapping
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-11 px-7 text-sm font-semibold border border-[#E7E7E4] dark:border-white/14 bg-white dark:bg-[#151619] text-[#111318] dark:text-[#F5F5F5] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all"
            >
              Browse Skills
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
