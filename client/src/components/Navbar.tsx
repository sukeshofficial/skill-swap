import { useState, useEffect } from "react"
import { Sun, Moon, Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import logoLight from "@/assets/skill-swap-full-logo.svg"
import logoDark from "@/assets/skill-swap-full-logo-white.svg"

interface NavbarProps {
  onNavigateToSignup?: () => void
}

export function Navbar({ onNavigateToSignup }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle theme if 'd' or 'D' is pressed outside input elements
      const target = e.target as HTMLElement
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }

      if (e.key === "d" || e.key === "D") {
        setTheme(theme === "dark" ? "light" : "dark")
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [theme, setTheme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-200">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${scrolled
          ? "bg-white/80 dark:bg-[#151619]/85 backdrop-blur-md border border-[#E7E7E4] dark:border-white/10 shadow-sm py-2 px-4 sm:px-6"
          : "bg-white/40 dark:bg-[#151619]/40 backdrop-blur-sm border border-transparent py-3 px-4 sm:px-6"
          }`}
      >
        <div className="flex items-center justify-between h-11">

          {/* LEFT: Skill Swap Brand Logo */}
          <a href="#" className="flex items-center group">
            <img
              src={logoLight}
              alt="Skill Swap Logo"
              className="h-12 w-auto block dark:hidden transition-transform duration-200 group-hover:scale-105"
            />
            <img
              src={logoDark}
              alt="Skill Swap Logo"
              className="h-12 w-auto hidden dark:block transition-transform duration-200 group-hover:scale-105"
            />
          </a>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[#62666F] dark:text-[#A1A4AC]">
            <a
              href="#discover"
              className="px-3.5 py-1.5 rounded-lg hover:text-[#111318] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Discover
            </a>
            <a
              href="#what-is-skill-swap"
              className="px-3.5 py-1.5 rounded-lg hover:text-[#111318] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              What is Skill Swap
            </a>
            <a
              href="#how-it-works"
              className="px-3.5 py-1.5 rounded-lg hover:text-[#111318] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              How It Works
            </a>
            <a
              href="#community"
              className="px-3.5 py-1.5 rounded-lg hover:text-[#111318] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Community Stream
            </a>
          </nav>

          {/* RIGHT: Actions & Polished Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Theme Switcher ☼ / ☾ */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className="w-8 h-8 rounded-lg border border-[#E7E7E4] dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-[#111318] dark:text-[#F5F5F5] flex items-center justify-center transition-all"
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-gray-700" />
              )}
            </button>

            <a
              href="signup"
              className="hidden sm:inline-flex text-xs font-medium text-[#62666F] dark:text-[#A1A4AC] hover:text-[#111318] dark:hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign up
            </a>

            <Button
              size="sm"
              onClick={onNavigateToSignup}
              className="h-8 px-3.5 text-xs font-semibold bg-[#FF5A4A] hover:bg-[#E0493A] text-white rounded-lg shadow-sm shadow-[#FF5A4A]/20 transition-all hover:-translate-y-0.5"
            >
              Start Swapping
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-[#E7E7E4] dark:border-white/10 mt-2 space-y-1">
            <a
              href="#discover"
              className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
            >
              Discover
            </a>
            <a
              href="#what-is-skill-swap"
              className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
            >
              What is Skill Swap
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
            >
              How It Works
            </a>
            <a
              href="#community"
              className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
            >
              Community Stream
            </a>

            {/* Mobile Dark/Light Theme Toggle */}
            <div className="pt-2 border-t border-[#E7E7E4] dark:border-white/10 mt-2 px-3">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-black/5 dark:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-gray-700" />
                  )}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </span>
                <span className="text-xs font-mono text-[#8B8F97] dark:text-[#70737B] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                  Press 'D'
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
