import logoLight from "@/assets/skill-swap-full-logo.svg"
import logoDark from "@/assets/skill-swap-full-logo-white.svg"

export function Footer() {
  return (
    <footer className="py-14 bg-[#FAFAF9] dark:bg-[#0F1012] border-t border-[#E7E7E4] dark:border-white/10 text-[#62666F] dark:text-[#A1A4AC] text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12">

          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <a href="#" className="flex items-center group">
              <img
                src={logoLight}
                alt="Skill Swap Logo"
                className="h-10 w-auto block dark:hidden transition-transform duration-200 group-hover:scale-105"
              />
              <img
                src={logoDark}
                alt="Skill Swap Logo"
                className="h-10 w-auto hidden dark:block transition-transform duration-200 group-hover:scale-105"
              />
            </a>
            <p className="text-xs text-[#8B8F97] dark:text-[#70737B] max-w-xs font-normal">
              Peer-to-peer skill exchange platform. Learn what you don't. Share what you know.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <div className="font-bold uppercase tracking-wider text-[10px] text-[#111318] dark:text-[#F5F5F5]">
              Product
            </div>
            <ul className="space-y-2 font-medium">
              <li><a href="#discover" className="hover:text-[#111318] dark:hover:text-white transition-colors">Discover</a></li>
              <li><a href="#what-is-skill-swap" className="hover:text-[#111318] dark:hover:text-white transition-colors">What is Skill Swap</a></li>
              <li><a href="#how-it-works" className="hover:text-[#111318] dark:hover:text-white transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Community Links */}
          <div className="space-y-2.5">
            <div className="font-bold uppercase tracking-wider text-[10px] text-[#111318] dark:text-[#F5F5F5]">
              Community
            </div>
            <ul className="space-y-2 font-medium">
              <li><a href="#community" className="hover:text-[#111318] dark:hover:text-white transition-colors">Community Stream</a></li>
              <li><a href="#" className="hover:text-[#111318] dark:hover:text-white transition-colors">Skill Swaps</a></li>
              <li><a href="#" className="hover:text-[#111318] dark:hover:text-white transition-colors">Member Profiles</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-2.5">
            <div className="font-bold uppercase tracking-wider text-[10px] text-[#111318] dark:text-[#F5F5F5]">
              Company
            </div>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-[#111318] dark:hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#111318] dark:hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#111318] dark:hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E7E7E4] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div>© {new Date().getFullYear()} Skill Swap. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#111318] dark:hover:text-white">GitHub</a>
            <a href="#" className="hover:text-[#111318] dark:hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-[#111318] dark:hover:text-white">X / Twitter</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
