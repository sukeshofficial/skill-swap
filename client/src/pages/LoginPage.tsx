import React, { useState, useRef, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, RefreshCw, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import logoLight from "@/assets/skill-swap-full-logo.svg"
import logoDark from "@/assets/skill-swap-full-logo-white.svg"
import loginImg from "@/assets/login.png"
import { useAuth } from "@/context/AuthContext"

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/auth` : '/api/v1/auth';

interface LoginPageProps {
  onNavigateToSignup?: () => void
  onNavigateToHome?: () => void
  onNavigateToDashboard?: () => void
}

export function LoginPage({ onNavigateToSignup, onNavigateToHome, onNavigateToDashboard }: LoginPageProps) {
  const { refresh } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  /* ─── OTP Modal Gating state if user failed OTP on signup ─── */
  const [requiresVerification, setRequiresVerification] = useState(false)
  const [unverifiedUserId, setUnverifiedUserId] = useState("")
  const [unverifiedEmail, setUnverifiedEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [otpError, setOtpError] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendMsg, setResendMsg] = useState("")
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  /* ─── Forgot Password State ─── */
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)
  const [forgotStep, setForgotStep] = useState<"request" | "verify">("request")
  const [forgotEmail, setForgotEmail] = useState("")
  const [resetUserId, setResetUserId] = useState("")
  const [resetOtp, setResetOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState("")
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState("")
  const resetOtpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [resendCooldown])

  /* ─── Login Form Submit ───────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (res.status === 403 && data.requiresVerification) {
        setRequiresVerification(true)
        setUnverifiedUserId(data.userId)
        setUnverifiedEmail(data.email)
        setResendCooldown(30)
        return
      }

      if (!res.ok) {
        setErrorMsg(data.message || "Invalid credentials. Please try again.")
        return
      }

      // Refresh AuthContext session state
      try {
        await refresh()
      } catch { }

      if (onNavigateToDashboard) {
        onNavigateToDashboard()
      } else {
        window.location.href = '/dashboard'
      }
    } catch {
      setErrorMsg("Network error. Please check your backend connection.")
    } finally {
      setIsLoading(false)
    }
  }

  /* ─── OTP Handling for Unverified Gate ───────────────────────── */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
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
        body: JSON.stringify({ userId: unverifiedUserId, otp: code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setOtpError(data.message || "Verification failed.")
        return
      }

      if (onNavigateToDashboard) {
        onNavigateToDashboard()
      } else {
        window.location.href = '/dashboard'
      }
    } catch {
      setOtpError("Network error. Please try again.")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setResendMsg("")
    setOtpError("")

    try {
      const res = await fetch(`${API_BASE}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: unverifiedUserId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setOtpError(data.message || "Failed to resend OTP.")
        return
      }
      setResendMsg("New code sent to your inbox!")
      setResendCooldown(30)
      setOtp(["", "", "", "", "", ""])
      otpRefs.current[0]?.focus()
    } catch {
      setOtpError("Network error during resend.")
    }
  }

  /* ─── Forgot Password Handling ────────────────────────────── */
  const handleRequestForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError("")
    setForgotSuccessMsg("")
    if (!forgotEmail) {
      setForgotError("Please enter your email address.")
      return
    }

    setForgotLoading(true)
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setForgotError(data.message || "Failed to send reset code.")
        return
      }
      setResetUserId(data.userId || "")
      setForgotStep("verify")
      setForgotSuccessMsg("OTP code sent to your email address!")
    } catch {
      setForgotError("Network error. Please try again.")
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError("")
    const code = resetOtp.join('')
    if (code.length < 6) {
      setForgotError("Please enter the complete 6-digit OTP code.")
      return
    }
    if (newPassword.length < 8) {
      setForgotError("New password must be at least 8 characters long.")
      return
    }

    setForgotLoading(true)
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: resetUserId, otp: code, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setForgotError(data.message || "Password reset failed.")
        return
      }

      if (data.user && onNavigateToDashboard) {
        onNavigateToDashboard()
      } else {
        setIsForgotModalOpen(false)
        setErrorMsg("Password reset successfully! Please sign in with your new password.")
      }
    } catch {
      setForgotError("Network error resetting password.")
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...resetOtp]
    newOtp[index] = value.slice(-1)
    setResetOtp(newOtp)
    setForgotError("")
    if (value && index < 5) {
      resetOtpRefs.current[index + 1]?.focus()
    }
  }

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/api/v1/auth/google`
  }

  return (
    <div className="min-h-screen w-screen bg-[#FAF9F8] dark:bg-[#0F1012] text-[#111827] dark:text-[#F5F5F5] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF5A4A]/20 selection:text-[#FF5A4A] flex flex-col transition-colors duration-200 lg:h-screen lg:overflow-hidden">

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-2 flex-1 flex flex-col justify-center lg:h-full lg:max-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 items-center lg:h-full lg:max-h-full">

          {/* LEFT SIDE: Brand & Hero Image */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-3 sm:space-y-4 pr-0 lg:pr-4 h-full py-2">
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

            <div className="relative w-full max-w-xl mx-auto lg:mx-0 flex-1 flex items-center justify-center min-h-0">
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

          {/* RIGHT SIDE: Form Card OR Verification Gate */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-start lg:items-center h-full py-2">
            <div className="w-full max-w-[500px] bg-white dark:bg-[#151619] border border-[#E5E7EB] dark:border-white/10 rounded-[20px] p-5 sm:p-7 shadow-sm transition-all flex flex-col justify-center">

              {requiresVerification ? (
                /* ── UNVERIFIED OTP GATE SCREEN ── */
                <div>
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF1EE] dark:bg-[#3A1F1B] flex items-center justify-center mb-4 shadow-sm shadow-[#FF5A4A]/10">
                      <ShieldCheck className="w-7 h-7 text-[#FF5A4A]" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF5A4A]">
                      Verification Required
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] dark:text-[#F5F5F5] leading-tight mt-1">
                      OTP Verification Pending
                    </h2>
                    <p className="text-xs text-[#6B7280] dark:text-[#A1A4AC] mt-1.5 max-w-[320px]">
                      You registered with <strong className="text-[#111827] dark:text-[#F5F5F5]">{unverifiedEmail}</strong> but haven't verified your email yet. Please enter your 6-digit OTP code to access your dashboard.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp}>
                    <div className="flex gap-2 sm:gap-3 justify-center mb-4" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
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

                    {otpError && (
                      <div className="mb-3 px-3 py-2 rounded-lg bg-[#FEF2F2] border border-[#EF4444]/30 text-[#EF4444] text-xs font-medium text-center">
                        {otpError}
                      </div>
                    )}

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
                          <span>Verify & Continue to Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-[#6B7280] dark:text-[#A1A4AC]">
                      Didn't get the code?{" "}
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
                        className="inline-flex items-center gap-1 text-[#FF5A4A] font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
                      >
                        <RefreshCw className="w-3 h-3" />
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                      </button>
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E5E7EB] dark:border-white/10 text-center text-xs text-[#6B7280] dark:text-[#A1A4AC]">
                    Want to try standard login?{" "}
                    <button
                      type="button"
                      onClick={() => setRequiresVerification(false)}
                      className="text-[#FF5A4A] font-semibold hover:underline"
                    >
                      Back to login
                    </button>
                  </div>
                </div>
              ) : isForgotModalOpen ? (
                /* ── FORGOT PASSWORD MODAL ── */
                <div>
                  <div className="flex flex-col items-center text-center mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF1EE] dark:bg-[#3A1F1B] flex items-center justify-center mb-3 shadow-sm shadow-[#FF5A4A]/10">
                      <KeyRound className="w-6 h-6 text-[#FF5A4A]" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF5A4A]">
                      Account Recovery
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] dark:text-[#F5F5F5] leading-tight mt-0.5">
                      {forgotStep === "request" ? "Reset your password" : "Enter Verification OTP"}
                    </h2>
                    <p className="text-xs text-[#6B7280] dark:text-[#A1A4AC] mt-1 max-w-[320px]">
                      {forgotStep === "request"
                        ? "Enter your email address and we'll send a 6-digit OTP code to reset your password."
                        : `We sent a 6-digit OTP code to ${forgotEmail}. Enter it below with your new password.`}
                    </p>
                  </div>

                  {forgotError && (
                    <div className="mb-3 px-3 py-2 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/30 text-[#EF4444] text-xs font-medium text-center">
                      {forgotError}
                    </div>
                  )}

                  {forgotSuccessMsg && (
                    <div className="mb-3 px-3 py-2 rounded-xl bg-[#ECFDF5] border border-[#10B981]/30 text-[#10B981] text-xs font-medium text-center">
                      {forgotSuccessMsg}
                    </div>
                  )}

                  {forgotStep === "request" ? (
                    <form onSubmit={handleRequestForgot} className="space-y-3">
                      <div className="space-y-1">
                        <label htmlFor="forgot-email" className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5]">
                          Email address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] dark:text-[#A1A4AC]">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="forgot-email"
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full h-[44px] pl-9 pr-4 bg-white dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10 rounded-xl text-xs sm:text-sm text-[#111827] dark:text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF5A4A] focus:ring-2 focus:ring-[#FF5A4A]/20 transition-all"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full h-[46px] bg-[#FF5A4A] hover:bg-[#E94A3B] active:bg-[#D93F31] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-[#FF5A4A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {forgotLoading ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : (
                          <>
                            <span>Send OTP Reset Code</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5] text-center">
                          6-Digit Verification Code
                        </label>
                        <div className="flex gap-2 justify-center my-2">
                          {resetOtp.map((digit, i) => (
                            <input
                              key={i}
                              ref={(el) => { resetOtpRefs.current[i] = el }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleResetOtpChange(i, e.target.value)}
                              className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#1C1E22] text-[#111827] dark:text-[#F5F5F5] focus:outline-none focus:border-[#FF5A4A]"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="reset-new-password" className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5]">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] dark:text-[#A1A4AC]">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            id="reset-new-password"
                            type={showNewPassword ? "text" : "password"}
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="w-full h-[44px] pl-9 pr-10 bg-white dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10 rounded-xl text-xs sm:text-sm text-[#111827] dark:text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF5A4A] focus:ring-2 focus:ring-[#FF5A4A]/20 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B7280] dark:text-[#A1A4AC] hover:text-[#111827] dark:hover:text-white transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={forgotLoading || resetOtp.join('').length < 6 || newPassword.length < 8}
                        className="w-full h-[46px] bg-[#FF5A4A] hover:bg-[#E94A3B] active:bg-[#D93F31] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-[#FF5A4A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {forgotLoading ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : (
                          <>
                            <span>Reset Password & Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  <div className="pt-3.5 mt-3.5 border-t border-[#E5E7EB] dark:border-white/10 text-center text-xs text-[#6B7280] dark:text-[#A1A4AC]">
                    Remembered your password?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotModalOpen(false)
                        setForgotStep("request")
                        setForgotError("")
                      }}
                      className="text-[#FF5A4A] font-semibold hover:underline"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              ) : (
                /* ── STANDARD LOGIN FORM ── */
                <div>
                  <div className="flex lg:hidden items-center justify-between mb-5">
                    <button onClick={onNavigateToHome} className="focus:outline-none">
                      <img src={logoLight} alt="Skill Swap" className="h-7 w-auto block dark:hidden" style={{ maxWidth: '160px' }} />
                      <img src={logoDark} alt="Skill Swap" className="h-7 w-auto hidden dark:block" style={{ maxWidth: '160px' }} />
                    </button>
                    <span className="text-[10px] font-bold tracking-widest text-[#FF5A4A] uppercase">SIGN IN</span>
                  </div>

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

                  {/* Google Login Button */}
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

                  <div className="relative my-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E5E7EB] dark:border-white/10" />
                    </div>
                    <span className="relative z-10 px-3 bg-white dark:bg-[#151619] text-[11px] font-medium text-[#6B7280] dark:text-[#A1A4AC]">
                      or
                    </span>
                  </div>

                  {errorMsg && (
                    <div className="mb-3 px-3 py-2.5 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/30 text-[#EF4444] text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label htmlFor="login-email" className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5]">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] dark:text-[#A1A4AC]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="login-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full h-[44px] pl-9 pr-4 bg-white dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10 rounded-xl text-xs sm:text-sm text-[#111827] dark:text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF5A4A] focus:ring-2 focus:ring-[#FF5A4A]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor="login-password" className="block text-[11px] font-semibold text-[#111827] dark:text-[#F5F5F5]">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(email)
                            setIsForgotModalOpen(true)
                          }}
                          className="text-[11px] font-medium text-[#FF5A4A] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] dark:text-[#A1A4AC]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="login-password"
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

                    <div className="pt-1.5">
                      <Button
                        id="login-submit-btn"
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
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

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
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
