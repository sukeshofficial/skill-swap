import { useState, useEffect } from "react"
import { Sun, Moon, Menu, X, LogOut, LayoutDashboard, Users, Repeat2, Bell } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/context/AuthContext"
import logoLight from "@/assets/skill-swap-full-logo.svg"
import logoDark from "@/assets/skill-swap-full-logo-white.svg"

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder dashboard nav items — swap hrefs for real routes later
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Overview", href: "#", icon: LayoutDashboard },
  { label: "My Swaps", href: "#swaps", icon: Repeat2 },
  { label: "Community", href: "#community", icon: Users },
  { label: "Notifications", href: "#notifs", icon: Bell },
]

interface DashboardNavbarProps {
  onNavigateToHome?: () => void
  onNavigateToLogin?: () => void
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
}

export function DashboardNavbar({ onNavigateToHome, onNavigateToLogin }: DashboardNavbarProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("Overview")

  /* ── scroll + keyboard shortcut ── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)

    const handleKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA" || t?.isContentEditable) return
      if (e.key === "d" || e.key === "D") setTheme(theme === "dark" ? "light" : "dark")
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [theme, setTheme])

  /* ── close avatar dropdown when clicking outside ── */
  useEffect(() => {
    if (!avatarMenuOpen) return
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-avatar-menu]")) setAvatarMenuOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [avatarMenuOpen])

  const handleLogout = async () => {
    await logout()
    onNavigateToLogin?.()
  }

  const isRealAvatar = user?.profilePicture && !user.profilePicture.includes("placehold")

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-200">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${scrolled
            ? "bg-white/80 dark:bg-[#151619]/85 backdrop-blur-md border border-[#E7E7E4] dark:border-white/10 shadow-sm py-2 px-4 sm:px-6"
            : "bg-white/40 dark:bg-[#151619]/40 backdrop-blur-sm border border-transparent py-3 px-4 sm:px-6"
          }`}
      >
        <div className="flex items-center justify-between h-11">

          {/* ── LEFT: Logo ──────────────────────────────────────────────── */}
          <button
            onClick={onNavigateToHome}
            className="flex items-center group focus:outline-none"
            aria-label="Go to homepage"
          >
            <img
              src={logoLight}
              alt="Skill Swap"
              className="h-12 w-auto block dark:hidden transition-transform duration-200 group-hover:scale-105"
            />
            <img
              src={logoDark}
              alt="Skill Swap"
              className="h-12 w-auto hidden dark:block transition-transform duration-200 group-hover:scale-105"
            />
          </button>

          {/* ── CENTER: Dashboard nav items (placeholder) ───────────────── */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[#62666F] dark:text-[#A1A4AC]">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive = activeItem === label
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => { e.preventDefault(); setActiveItem(label) }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${isActive
                      ? "text-[#FF5A4A] bg-[#FFF1EE] dark:bg-[#3A1F1B] dark:text-[#FF6B5C] font-semibold"
                      : "hover:text-[#111318] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </a>
              )
            })}
          </nav>

          {/* ── RIGHT: Theme toggle + User avatar dropdown ──────────────── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle dark/light mode"
              className="w-8 h-8 rounded-lg border border-[#E7E7E4] dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-[#111318] dark:text-[#F5F5F5] flex items-center justify-center transition-all"
            >
              {theme === "dark"
                ? <Sun className="w-3.5 h-3.5 text-amber-400" />
                : <Moon className="w-3.5 h-3.5 text-gray-700" />
              }
            </button>

            {/* Avatar + dropdown */}
            {user && (
              <div className="relative" data-avatar-menu>
                <button
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border border-[#E7E7E4] dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-all group"
                  aria-label="Open user menu"
                  aria-expanded={avatarMenuOpen}
                >
                  {/* mini avatar */}
                  <div className="w-6.5 h-6.5 rounded-full overflow-hidden border border-[#FFF1EE] flex-shrink-0" style={{ width: 26, height: 26 }}>
                    {isRealAvatar ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FF5A4A,#F59E0B)" }}>
                        <span className="text-white text-[9px] font-bold">{getInitials(user.name)}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#111318] dark:text-[#F5F5F5] hidden sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                  {/* chevron */}
                  <svg
                    className={`w-3 h-3 text-[#9CA3AF] transition-transform duration-200 ${avatarMenuOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {avatarMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-[#1A1B1F] border border-[#E5E7EB] dark:border-white/10 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-[#F3F4F6] dark:border-white/10">
                      <p className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Nav items (mobile-redundant, but useful on desktop too) */}
                    <div className="py-1">
                      {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                        <a
                          key={label}
                          href={href}
                          onClick={(e) => { e.preventDefault(); setActiveItem(label); setAvatarMenuOpen(false) }}
                          className={`flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors ${activeItem === label
                              ? "text-[#FF5A4A] bg-[#FFF1EE] dark:bg-[#3A1F1B]"
                              : "text-[#374151] dark:text-[#D1D5DB] hover:bg-[#F9FAFB] dark:hover:bg-white/5"
                            }`}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          {label}
                        </a>
                      ))}
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-[#F3F4F6] dark:border-white/10 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#3B0B0B] transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ─────────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-[#E7E7E4] dark:border-white/10 mt-2 space-y-1">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => { e.preventDefault(); setActiveItem(label); setMobileMenuOpen(false) }}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeItem === label
                    ? "text-[#FF5A4A] bg-[#FFF1EE] dark:bg-[#3A1F1B]"
                    : "text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}

            {/* Mobile theme toggle */}
            <div className="pt-2 border-t border-[#E7E7E4] dark:border-white/10 mt-2 px-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-black/5 dark:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {theme === "dark"
                    ? <Sun className="w-4 h-4 text-amber-400" />
                    : <Moon className="w-4 h-4 text-gray-700" />
                  }
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </span>
                <span className="text-xs font-mono text-[#8B8F97] dark:text-[#70737B] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                  Press 'D'
                </span>
              </button>
            </div>

            {/* Mobile sign out */}
            {user && (
              <div className="px-3 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#3B0B0B] rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
