import React, { useState, useRef, useEffect } from "react"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import logoLight from "@/assets/skill-swap-full-logo.svg"
import logoDark from "@/assets/skill-swap-full-logo-white.svg"
import signupImg from "@/assets/signup.png"

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/auth` : '/api/v1/auth';

interface SignupPageProps {
  onNavigateToLogin?: () => void
  onNavigateToHome?: () => void
  onNavigateToDashboard?: () => void
}

type Step = 'form' | 'otp' | 'success'

export function SignupPage({ onNavigateToLogin, onNavigateToHome, onNavigateToDashboard }: SignupPageProps) {
  /* ─── Form Step ─────────────────────────────────────────── */
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  /* ─── OTP Step ──────────────────────────────────────────── */
  const [step, setStep] = useState<Step>('form')
  const [userId, setUserId] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [otpError, setOtpError] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendMsg, setResendMsg] = useState("")
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  /* ─── Cooldown Timer ─────────────────────────────────────── */
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [resendCooldown])

  /* ─── Signup Submit ──────────────────────────────────────── */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: fullName, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setFormError(data.message || "Signup failed, please try again.")
        return
      }

      setUserId(data.userId)
      setStep('otp')
      setResendCooldown(30)
    } catch {
      setFormError("Network error. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  /* ─── OTP Input Handling ─────────────────────────────────── */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only last digit
    setOtp(newOtp)
    setOtpError("")
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  /* ─── Verify OTP ─────────────────────────────────────────── */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError("")
    const code = otp.join('')
    if (code.length < 6) {
      setOtpError("Please enter the complete 6-digit code.")
      return
    }

    setOtpLoading(true)
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, otp: code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setOtpError(data.message || "Verification failed.")
        return
      }

      setStep('success')
      // Auto-navigate to dashboard after 1.5s if session was created
      setTimeout(() => {
        if (onNavigateToDashboard) onNavigateToDashboard()
      }, 1800)
    } catch {
      setOtpError("Network error. Please check your connection.")
    } finally {
      setOtpLoading(false)
    }
  }

  /* ─── Resend OTP ─────────────────────────────────────────── */
  const handleResend = async () => {
    if (resendCooldown > 0) return
    setResendMsg("")
    setOtpError("")

    try {
      const res = await fetch(`${API_BASE}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setOtpError(data.message || "Failed to resend OTP.")
        return
      }
      setResendMsg("New code sent! Check your inbox.")
      setResendCooldown(30)
      setOtp(["", "", "", "", "", ""])
      otpRefs.current[0]?.focus()
    } catch {
      setOtpError("Network error during resend.")
    }
  }

  /* ─── Google Login ───────────────────────────────────────── */
  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/api/v1/auth/google`
  }

  /* ─── Left panel (shared) ────────────────────────────────── */
  const LeftPanel = () => (
    <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-3 sm:space-y-4 pr-0 lg:pr-4 h-full py-2">
      <div>
        <button
          onClick={onNavigateToHome}
          className="inline-block transition-transform duration-200 hover:scale-[1.02] focus:outline-none"
        >
          <img src={logoLight} alt="Skill Swap" className="h-8 sm:h-9 w-auto block dark:hidden" style={{ maxWidth: "190px" }} />
          <img src={logoDark} alt="Skill Swap" className="h-8 sm:h-9 w-auto hidden dark:block" style={{ maxWidth: "190px" }} />
        </button>
      </div>
      <div className="space-y-2 max-w-xl text-left">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FF5A4A]/10 text-[#FF5A4A] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
          LEARN • SHARE • SWAP
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#111827] dark:text-[#F5F5F5] leading-[1.08]">
          A more human <br />
          <span className="text-[#FF5A4A]">way to learn.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#A1A4AC] leading-relaxed font-normal">
          Join a community where knowledge goes both ways. Share what you know and learn what you don't.
        </p>
      </div>
      <div className="relative w-full max-w-xl mx-auto lg:mx-0 flex-1 flex items-center justify-center min-h-0">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 480" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M80,60 C130,10 230,0 310,30 C390,60 450,130 460,220 C470,310 430,400 360,440 C290,480 180,480 110,440 C40,400 10,320 20,230 C30,140 30,110 80,60 Z" fill="#FF5A4A" fillOpacity="0.10" />
        </svg>
        <img src={signupImg} alt="People sharing and learning skills together" className="relative z-10 w-full h-full max-h-[280px] sm:max-h-[340px] lg:max-h-[460px] object-contain select-none" />
      </div>
    </div>
  )

  /* ═════════════════════════════════════════════════════════════
     RENDER – STEP: OTP VERIFICATION
     ═════════════════════════════════════════════════════════════ */
  if (step === 'otp') {
    return (
      <div className="min-h-screen w-screen bg-[#FAF9F8] dark:bg-[#0F1012] text-[#111827] dark:text-[#F5F5F5] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col transition-colors duration-200 lg:h-screen lg:overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-2 flex-1 flex flex-col justify-center lg:h-full lg:max-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 items-center lg:h-full lg:max-h-full">
            <LeftPanel />
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-start lg:items-center h-full py-2">
              <div className="w-full max-w-[500px] bg-white dark:bg-[#151619] border border-[#E5E7EB] dark:border-white/10 rounded-[20px] p-5 sm:p-7 shadow-sm transition-all flex flex-col justify-center">

                {/* Mobile logo */}
                <div className="flex lg:hidden items-center justify-between mb-5">
                  <button onClick={onNavigateToHome} className="focus:outline-none">
                    <img src={logoLight} alt="Skill Swap" className="h-7 w-auto block dark:hidden" style={{ maxWidth: '160px' }} />
                    <img src={logoDark} alt="Skill Swap" className="h-7 w-auto hidden dark:block" style={{ maxWidth: '160px' }} />
                  </button>
                  <span className="text-[10px] font-bold tracking-widest text-[#FF5A4A] uppercase">VERIFY</span>
                </div>

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF1EE] dark:bg-[#3A1F1B] flex items-center justify-center mb-4 shadow-sm shadow-[#FF5A4A]/10">
                    <ShieldCheck className="w-7 h-7 text-[#FF5A4A]" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#A1A4AC]">
                    Email verification
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] dark:text-[#F5F5F5] leading-tight mt-1">
                    Check your inbox
                  </h2>
                  <p className="text-xs text-[#6B7280] dark:text-[#A1A4AC] mt-1.5 max-w-[320px]">
                    We sent a 6-digit verification code to{" "}
                    <strong className="text-[#111827] dark:text-[#F5F5F5]">{email}</strong>.
                    Enter it below to activate your account.
                  </p>
                </div>

                {/* OTP Inputs */}
                <form onSubmit={handleVerifyOtp}>
                  <div className="flex gap-2 sm:gap-3 justify-center mb-4" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-input-${i}`}
                        ref={(el) => { otpRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        autoFocus={i === 0}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-11 h-14 sm:w-12 sm:h-[58px] text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none
                          ${digit ? 'border-[#FF5A4A] bg-[#FFF1EE] dark:bg-[#3A1F1B] text-[#FF5A4A]' : 'border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#1C1E22] text-[#111827] dark:text-[#F5F5F5]'}
                          focus:border-[#FF5A4A] focus:ring-2 focus:ring-[#FF5A4A]/20
                          ${otpError ? 'border-[#EF4444] bg-[#FEF2F2] dark:bg-[#2D1B1B]' : ''}`}
                      />
                    ))}
                  </div>

                  {/* Error */}
                  {otpError && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-[#FEF2F2] border border-[#EF4444]/30 text-[#EF4444] text-xs font-medium text-center">
                      {otpError}
                    </div>
                  )}

                  {/* Success resend msg */}
                  {resendMsg && !otpError && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-[#ECFDF5] border border-[#10B981]/30 text-[#10B981] text-xs font-medium text-center">
                      {resendMsg}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={otpLoading || otp.join('').length < 6}
                    className="w-full h-[46px] bg-[#FF5A4A] hover:bg-[#E94A3B] active:bg-[#D93F31] text-white font-semibold text-sm rounded-xl shadow-sm shadow-[#FF5A4A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {otpLoading ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <>
                        <span>Verify Email</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Resend */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-[#6B7280] dark:text-[#A1A4AC]">
                    Didn't receive a code?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCooldown > 0}
                      className="inline-flex items-center gap-1 text-[#FF5A4A] font-semibold hover:underline disabled:opacity-50 disabled:no-underline transition-opacity"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </p>
                </div>

                {/* Warning gate */}
                <div className="mt-5 p-3.5 rounded-xl bg-[#FFFBEB] dark:bg-[#2A2000] border border-[#F59E0B]/30">
                  <p className="text-[11px] text-[#92400E] dark:text-[#FCD34D] leading-relaxed text-center">
                    ⚠️ <strong>OTP verification is required.</strong> You won't be able to access the dashboard until your email is verified.
                  </p>
                </div>

                {/* Back link */}
                <div className="pt-4 mt-4 border-t border-[#E5E7EB] dark:border-white/10 text-center text-xs text-[#6B7280] dark:text-[#A1A4AC]">
                  Wrong email?{" "}
                  <button
                    type="button"
                    onClick={() => { setStep('form'); setOtp(["", "", "", "", "", ""]); setOtpError("") }}
                    className="text-[#FF5A4A] font-semibold hover:underline"
                  >
                    Go back
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ═════════════════════════════════════════════════════════════
     RENDER – STEP: SUCCESS
     ═════════════════════════════════════════════════════════════ */
  if (step === 'success') {
    return (
      <div className="min-h-screen w-screen bg-[#FAF9F8] dark:bg-[#0F1012] flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-[420px] bg-white dark:bg-[#151619] border border-[#E5E7EB] dark:border-white/10 rounded-[20px] p-8 shadow-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] dark:bg-[#052E16]/60 flex items-center justify-center mx-auto mb-5 animate-bounce-once">
            <CheckCircle2 className="w-8 h-8 text-[#10B981]" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F5F5F5] mb-2">You're verified! 🎉</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#A1A4AC]">
            Welcome to Skill Swap, <strong>{fullName}</strong>. Your account is ready. Taking you to your dashboard…
          </p>
          <div className="mt-6 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#FF5A4A] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ═════════════════════════════════════════════════════════════
     RENDER – STEP: SIGNUP FORM (default)
     ═════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen w-screen bg-[#FAF9F8] dark:bg-[#0F1012] text-[#111827] dark:text-[#F5F5F5] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF5A4A]/20 selection:text-[#FF5A4A] flex flex-col transition-colors duration-200 lg:h-screen lg:overflow-hidden">

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-2 flex-1 flex flex-col justify-center lg:h-full lg:max-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 items-center lg:h-full lg:max-h-full">
          <LeftPanel />

          <div className="lg:col-span-5 flex justify-center lg:justify-end items-start lg:items-center h-full py-2">
            <div className="w-full max-w-[500px] bg-white dark:bg-[#151619] border border-[#E5E7EB] dark:border-white/10 rounded-[20px] p-5 sm:p-7 shadow-sm transition-all flex flex-col justify-center">

              {/* Mobile-only: compact logo + tagline header */}
              <div className="flex lg:hidden items-center justify-between mb-5">
                <button onClick={onNavigateToHome} className="focus:outline-none">
                  <img src={logoLight} alt="Skill Swap" className="h-7 w-auto block dark:hidden" style={{ maxWidth: '160px' }} />
                  <img src={logoDark} alt="Skill Swap" className="h-7 w-auto hidden dark:block" style={{ maxWidth: '160px' }} />
                </button>
                <span className="text-[10px] font-bold tracking-widest text-[#FF5A4A] uppercase">SIGN UP</span>
              </div>

              {/* Form Header */}
              <div className="space-y-0.5 mb-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#A1A4AC]">
                  Create your account
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-[#111827] dark:text-[#F5F5F5] leading-tight">
                  Start your skill swap journey
                </h2>
                <p className="text-xs text-[#6B7280] dark:text-[#A1A4AC]">
                  Join a community of learners, teachers and creators.
                </p>
              </div>

              {/* Social Auth */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-[44px] bg-white dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10 rounded-xl px-4 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-[#111827] dark:text-[#F5F5F5] hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Or Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E7EB] dark:border-white/10" />
                </div>
                <span className="relative z-10 px-3 bg-white dark:bg-[#151619] text-[11px] font-medium text-[#6B7280] dark:text-[#A1A4AC]">
                  or sign up with email
                </span>
              </div>

              {/* Global Error */}
              {formError && (
                <div className="mb-3 px-3 py-2.5 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/30 text-[#EF4444] text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-3">

                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="signup-name" className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5]">
                    Full name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] dark:text-[#A1A4AC]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full h-[44px] pl-9 pr-4 bg-white dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10 rounded-xl text-xs sm:text-sm text-[#111827] dark:text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF5A4A] focus:ring-2 focus:ring-[#FF5A4A]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="signup-email" className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5]">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] dark:text-[#A1A4AC]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-email"
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
                  <label htmlFor="signup-password" className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5]">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] dark:text-[#A1A4AC]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
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
                  {/* Password strength hint */}
                  {password.length > 0 && (
                    <p className={`text-[10px] font-medium mt-1 ${password.length >= 8 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                      {password.length >= 12 ? '✓ Strong password' : password.length >= 8 ? '✓ Good password' : `${8 - password.length} more characters needed`}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="pt-1.5">
                  <Button
                    id="signup-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[46px] bg-[#FF5A4A] hover:bg-[#E94A3B] active:bg-[#D93F31] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-[#FF5A4A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

              </form>

              {/* Legal */}
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] dark:text-[#A1A4AC] text-center mt-3.5 leading-normal">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-[#FF5A4A] hover:underline font-medium">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-[#FF5A4A] hover:underline font-medium">Privacy Policy</a>.
              </p>

              {/* Sign In Prompt */}
              <div className="pt-3.5 mt-3.5 border-t border-[#E5E7EB] dark:border-white/10 text-center text-xs text-[#6B7280] dark:text-[#A1A4AC]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-[#FF5A4A] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
