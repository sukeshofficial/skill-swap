import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardNavbar } from '@/components/DashboardNavbar';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMo = Math.floor(diffDay / 30);
  return `${diffMo}mo ago`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────

function Avatar({
  name,
  url,
  size = 80,
}: {
  name: string;
  url?: string;
  size?: number;
}) {
  const isRealAvatar = url && !url.includes('placehold');

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-[12px] overflow-hidden shrink-0 border-2 border-[#FF5A4A]/20 shadow-md shadow-[#FF5A4A]/10 flex items-center justify-center bg-gradient-to-br from-[#FF5A4A] to-[#F59E0B]"
    >
      {isRealAvatar ? (
        <img
          src={url}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-2xl text-white tracking-tight">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

function Badge({
  label,
  variant = 'default',
}: {
  label: string;
  variant?: 'default' | 'success' | 'info' | 'muted';
}) {
  const styles = {
    default: 'bg-[#FFF1EE] dark:bg-[#3A1F1B] text-[#FF5A4A]',
    success: 'bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#10B981] dark:text-[#34D399]',
    info: 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#3B82F6] dark:text-[#60A5FA]',
    muted: 'bg-[#F3F4F6] dark:bg-white/10 text-[#6B7280] dark:text-[#A1A4AC]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#E5E7EB] dark:border-white/10 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-[#FFF1EE] dark:bg-[#3A1F1B] flex items-center justify-center shrink-0 text-[#FF5A4A]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#9CA3AF] tracking-wider uppercase">
          {label}
        </p>
        <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#111827] dark:text-[#F5F5F5] break-all">
          {value}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SVG Icons
// ──────────────────────────────────────────────────────────────────────────────

const Icons = {
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  ),
  google: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

// ──────────────────────────────────────────────────────────────────────────────
// Loading Skeleton
// ──────────────────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 dark:bg-white/10 animate-pulse rounded-lg ${className}`} />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main Dashboard Page
// ──────────────────────────────────────────────────────────────────────────────

interface DashboardPageProps {
  onNavigateToHome?: () => void
  onNavigateToLogin?: () => void
}

export function DashboardPage({ onNavigateToHome, onNavigateToLogin }: DashboardPageProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      onNavigateToLogin?.();
    }
  }, [isLoading, isAuthenticated, onNavigateToLogin]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] dark:bg-[#0F1012] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
        <div className="h-16 bg-white dark:bg-[#151619] border-b border-[#E5E7EB] dark:border-white/10 flex items-center px-8 gap-3">
          <Skeleton className="w-28 h-7" />
          <div className="flex-1" />
          <Skeleton className="w-20 h-5" />
        </div>
        <main className="max-w-4xl mx-auto px-6 py-10 w-full">
          <Skeleton className="w-48 h-8 mb-2" />
          <Skeleton className="w-72 h-4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[0, 1].map((i) => (
              <div key={i} className="bg-white dark:bg-[#151619] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-7 shadow-sm">
                <div className="flex gap-4 items-start">
                  <Skeleton className="w-20 h-20 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-44 h-4" />
                    <Skeleton className="w-20 h-5 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F8] dark:bg-[#0F1012] text-[#111827] dark:text-[#F5F5F5] font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">

      {/* Dashboard Navbar */}
      <DashboardNavbar
        onNavigateToHome={onNavigateToHome}
        onNavigateToLogin={onNavigateToLogin}
      />

      {/* Main Container */}
      <main className="max-w-[960px] mx-auto px-4 sm:px-8 py-8 sm:py-10">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-[#F5F5F5] leading-tight">
            My Dashboard
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#6B7280] dark:text-[#A1A4AC] leading-relaxed">
            Welcome back, {user.name.split(' ')[0]}! Here's an overview of your account.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

          {/* Profile Card */}
          <div className="bg-white dark:bg-[#151619] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <Avatar name={user.name} url={user.profilePicture} size={80} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold tracking-tight text-[#111827] dark:text-[#F5F5F5]">
                    {user.name}
                  </h2>
                  {user.googleId ? (
                    <Badge label="Google" variant="info" />
                  ) : (
                    <Badge label="Email Verified" variant="success" />
                  )}
                </div>
                <p className="mt-1 mb-2.5 text-xs text-[#6B7280] dark:text-[#A1A4AC] break-all">
                  {user.email}
                </p>
                <Badge label="Member" variant="default" />
              </div>
            </div>

            {/* Provider Info Pill */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF9F8] dark:bg-[#1C1E22] border border-[#E5E7EB] dark:border-white/10">
              {user.googleId ? Icons.google : Icons.shield}
              <div>
                <p className="text-[11px] font-medium text-[#6B7280] dark:text-[#A1A4AC]">
                  Connected via
                </p>
                <p className="text-xs font-semibold text-[#111827] dark:text-[#F5F5F5]">
                  {user.googleId ? 'Google OAuth' : 'Email & Password'}
                </p>
              </div>
              <div className="ml-auto">
                <Badge label="Active" variant="success" />
              </div>
            </div>
          </div>

          {/* Account Details Metadata Card */}
          <div className="bg-white dark:bg-[#151619] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-sm">
            <h3 className="text-base font-bold text-[#111827] dark:text-[#F5F5F5] tracking-tight">
              Account Details
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#A1A4AC] mb-4">
              Data pulled live from the database
            </p>

            <MetaRow
              icon={Icons.user}
              label="Full Name"
              value={user.name}
            />
            <MetaRow
              icon={Icons.email}
              label="Email Address"
              value={user.email}
            />
            <MetaRow
              icon={Icons.calendar}
              label="Member Since"
              value={
                <span>
                  {formatDate(user.createdAt)}{' '}
                  <span className="text-xs font-normal text-[#6B7280] dark:text-[#A1A4AC]">
                    ({formatRelative(user.createdAt)})
                  </span>
                </span>
              }
            />
            <MetaRow
              icon={Icons.clock}
              label="Last Updated"
              value={
                <span>
                  {formatDate(user.updatedAt)}{' '}
                  <span className="text-xs font-normal text-[#6B7280] dark:text-[#A1A4AC]">
                    ({formatRelative(user.updatedAt)})
                  </span>
                </span>
              }
            />
            <MetaRow
              icon={Icons.shield}
              label="Auth Provider"
              value={
                user.googleId
                  ? <Badge label="Google OAuth 2.0" variant="info" />
                  : <Badge label="Email / Password" variant="muted" />
              }
            />
          </div>

        </div>
      </main>
    </div>
  );
}
