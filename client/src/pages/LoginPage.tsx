import React, { useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import logoLight from "@/assets/skill-swap-full-logo.svg"
import logoDark from "@/assets/skill-swap-full-logo-white.svg"
import loginImg from "@/assets/login.png"

interface LoginPageProps {
  onNavigateToSignup?: () => void
  onNavigateToHome?: () => void
}

export function LoginPage({ onNavigateToSignup, onNavigateToHome }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Production form submit logic
  }

  const handleGoogleLogin = () => {
    // OAuth MUST go directly to the backend port — NOT through the Vite proxy.
    // The Passport session cookie (state param) is tied to whichever origin
    // the browser hits first. If Vite (:5173) proxies the initiation but
    // Google redirects back to :5000, the cookie is missing → "Bad Request".
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  }

  return (
    <div className="min-h-screen w-screen bg-[#FAF9F8] dark:bg-[#0F1012] text-[#111827] dark:text-[#F5F5F5] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF5A4A]/20 selection:text-[#FF5A4A] flex flex-col transition-colors duration-200 lg:h-screen lg:overflow-hidden">

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-2 flex-1 flex flex-col justify-center lg:h-full lg:max-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 items-center lg:h-full lg:max-h-full">

          {/* ==================================================
              LEFT SIDE (~55% width desktop): Brand & Visual Hero
              Hidden on mobile — shown only on lg+
             ================================================== */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-3 sm:space-y-4 pr-0 lg:pr-4 h-full py-2">

            {/* Brand Logo */}
            <div>
              <button
                onClick={onNavigateToHome}
                className="inline-block transition-transform duration-200 hover:scale-[1.02] focus:outline-none"
              >
                <img
                  src={logoLight}
                  alt="Skill Swap"
                  className="h-8 sm:h-9 w-auto block dark:hidden"
                  style={{ maxWidth: "190px" }}
                />
                <img
                  src={logoDark}
                  alt="Skill Swap"
                  className="h-8 sm:h-9 w-auto hidden dark:block"
                  style={{ maxWidth: "190px" }}
                />
              </button>
            </div>

            {/* Headline & Supporting Copy */}
            <div className="space-y-2 max-w-xl text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FF5A4A]/10 text-[#FF5A4A] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                LEARN • SHARE • SWAP
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#111827] dark:text-[#F5F5F5] leading-[1.08]">
                Welcome back to <br />
                <span className="text-[#FF5A4A]">your journey.</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#A1A4AC] leading-relaxed font-normal">
                Sign in to continue swapping skills and growing with your community.
              </p>
            </div>

            {/* Official Prominent Visual Asset: login.png */}
            <div className="relative w-full max-w-xl mx-auto lg:mx-0 flex-1 flex items-center justify-center min-h-0">
              {/* Decorative blob background */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 500 480"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M420,60 C370,10 270,0 190,30 C110,60 50,130 40,220 C30,310 70,400 140,440 C210,480 320,480 390,440 C460,400 490,320 480,230 C470,140 470,110 420,60 Z"
                  fill="#FF5A4A"
                  fillOpacity="0.10"
                />
              </svg>
              <img
                src={loginImg}
                alt="People sharing and learning skills together"
                className="relative z-10 w-full h-full max-h-[280px] sm:max-h-[340px] lg:max-h-[460px] object-contain select-none"
              />
            </div>

          </div>

          {/* ==================================================
              RIGHT SIDE (~45% width desktop): Login Form Card
              Full width on mobile — centered card on desktop
             ================================================== */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-start lg:items-center h-full py-2">
            <div className="w-full max-w-[500px] bg-white dark:bg-[#151619] border border-[#E5E7EB] dark:border-white/10 rounded-[20px] p-5 sm:p-7 shadow-sm transition-all flex flex-col justify-center">

              {/* Mobile-only: compact logo + tagline header */}
              <div className="flex lg:hidden items-center justify-between mb-5">
                <button onClick={onNavigateToHome} className="focus:outline-none">
                  <img src={logoLight} alt="Skill Swap" className="h-7 w-auto block dark:hidden" style={{ maxWidth: '160px' }} />
                  <img src={logoDark} alt="Skill Swap" className="h-7 w-auto hidden dark:block" style={{ maxWidth: '160px' }} />
                </button>
                <span className="text-[10px] font-bold tracking-widest text-[#FF5A4A] uppercase">SIGN IN</span>
              </div>

              {/* Form Header */}
              <div className="space-y-0.5 mb-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#A1A4AC]">
                  Sign in to your account
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-[#111827] dark:text-[#F5F5F5] leading-tight">
                  Good to see you again
                </h2>
                <p className="text-xs text-[#6B7280] dark:text-[#A1A4AC]">
                  Pick up right where you left off.
                </p>
              </div>

              {/* Social Authentication Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-[44px] bg-white dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10 rounded-xl px-4 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-[#111827] dark:text-[#F5F5F5] hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-2xs"
                >
                  {/* Google SVG Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => { window.location.href = "/api/auth/apple" }}
                  className="w-full h-[44px] bg-white dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10 rounded-xl px-4 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-[#111827] dark:text-[#F5F5F5] hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-2xs"
                >
                  {/* Apple SVG Icon */}
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.68-.82 1.13-1.96.99-3.11-.97.04-2.16.65-2.85 1.46-.62.72-1.16 1.88-.99 3.01 1.09.08 2.19-.54 2.85-1.36z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Or Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E7EB] dark:border-white/10" />
                </div>
                <span className="relative z-10 px-3 bg-white dark:bg-[#151619] text-[11px] font-medium text-[#6B7280] dark:text-[#A1A4AC]">
                  or
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5]">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] dark:text-[#A1A4AC]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-[44px] pl-9 pr-4 bg-white dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10 rounded-xl text-xs sm:text-sm text-[#111827] dark:text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF5A4A] focus:ring-2 focus:ring-[#FF5A4A]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5]">
                      Password
                    </label>
                    <a href="#" className="text-[10px] sm:text-[11px] text-[#FF5A4A] font-medium hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] dark:text-[#A1A4AC]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-[44px] pl-9 pr-10 bg-white dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10 rounded-xl text-xs sm:text-sm text-[#111827] dark:text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF5A4A] focus:ring-2 focus:ring-[#FF5A4A]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B7280] dark:text-[#A1A4AC] hover:text-[#111827] dark:hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-1.5">
                  <Button
                    type="submit"
                    className="w-full h-[46px] bg-[#FF5A4A] hover:bg-[#E94A3B] active:bg-[#D93F31] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-[#FF5A4A]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

              </form>

              {/* Sign Up Prompt */}
              <div className="pt-3.5 mt-3.5 border-t border-[#E5E7EB] dark:border-white/10 text-center text-xs text-[#6B7280] dark:text-[#A1A4AC]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToSignup}
                  className="text-[#FF5A4A] font-semibold hover:underline"
                >
                  Create one
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
