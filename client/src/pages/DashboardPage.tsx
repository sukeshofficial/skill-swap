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
  size = 84,
}: {
  name: string;
  url?: string;
  size?: number;
}) {
  const isRealAvatar = url && !url.includes('placehold');

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '10px',
        overflow: 'hidden',
        flexShrink: 0,
        background: isRealAvatar
          ? undefined
          : 'linear-gradient(135deg, #FF5A4A 0%, #F59E0B 100%)',
        border: '3px solid #FFF1EE',
        boxShadow: '0 8px 24px rgba(255, 90, 74, 0.20)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isRealAvatar ? (
        <img
          src={url}
          alt={name}
          referrerPolicy="no-referrer"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: size * 0.35,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

function Badge({
  label,
  color = '#FF5A4A',
  bg = '#FFF1EE',
}: {
  label: string;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 9999,
        background: bg,
        color,
        fontSize: '0.72rem',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: '#FFF1EE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#FF5A4A',
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.7rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            color: '#9CA3AF',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </p>
        <div
          style={{
            marginTop: 2,
            fontSize: '0.875rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            color: '#111827',
            wordBreak: 'break-all',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SVG Icons (inline, zero deps)
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
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

// ──────────────────────────────────────────────────────────────────────────────
// Loading Skeleton
// ──────────────────────────────────────────────────────────────────────────────

function Skeleton({ width = '100%', height = 16, radius = 8 }: { width?: string | number; height?: number; radius?: number }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, #F5F4F2 25%, #E7E5E4 50%, #F5F4F2 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
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

  // Redirect unauthenticated users to login (handles direct URL access)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      onNavigateToLogin?.();
    }
  }, [isLoading, isAuthenticated, onNavigateToLogin]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FAF9F8',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <style>{`@keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }`}</style>
        {/* Header skeleton */}
        <div style={{ height: 64, background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', padding: '0 32px', gap: 12 }}>
          <Skeleton width={120} height={28} radius={6} />
          <div style={{ flex: 1 }} />
          <Skeleton width={80} height={20} radius={6} />
        </div>
        <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 32px', width: '100%' }}>
          <Skeleton width={200} height={32} radius={8} />
          <div style={{ marginTop: 8 }}><Skeleton width={300} height={16} radius={6} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 32 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 12px rgba(17,24,39,0.08)', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <Skeleton width={80} height={80} radius={40} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Skeleton width="60%" height={24} radius={6} />
                    <Skeleton width="80%" height={16} radius={6} />
                    <Skeleton width={80} height={22} radius={9999} />
                  </div>
                </div>
                {i === 0 && <div style={{ marginTop: 20 }}><Skeleton width="100%" height={60} radius={10} /></div>}
                {i === 1 && [0, 1, 2, 3].map((j) => (
                  <div key={j} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                    <Skeleton width={36} height={36} radius={10} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <Skeleton width="40%" height={10} radius={4} />
                      <Skeleton width="70%" height={16} radius={4} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Guard: if not authenticated and effect hasn't redirected yet
  if (!isAuthenticated || !user) return null;

  // ── Authenticated view ─────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF9F8',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#111827',
      }}
    >
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Dashboard Navbar ──────────────────────────────────────────────── */}
      <DashboardNavbar
        onNavigateToHome={onNavigateToHome}
        onNavigateToLogin={onNavigateToLogin}
      />

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 32px' }}>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#111827', lineHeight: 1.2 }}>
            My Dashboard
          </h1>
          <p style={{ margin: '6px 0 0', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.5 }}>
            Welcome back, {user.name.split(' ')[0]}! Here's an overview of your account.
          </p>
        </div>

        {/* ── Card Grid ───────────────────────────────────────────────────── */}
        <div
          className="dash-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          {/* ─ Profile Card ─────────────────────────────────────────────── */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 4px 12px rgba(17,24,39,0.08)',
              border: '1px solid #E5E7EB',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <Avatar name={user.name} url={user.profilePicture} size={80} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#111827' }}>
                    {user.name}
                  </h2>
                  <Badge label="Google" color="#4285F4" bg="#EFF6FF" />
                </div>
                <p style={{ margin: '4px 0 10px', fontFamily: "'Inter', sans-serif", fontSize: '0.83rem', color: '#6B7280', wordBreak: 'break-all' }}>
                  {user.email}
                </p>
                <Badge label="Member" color="#FF5A4A" bg="#FFF1EE" />
              </div>
            </div>

            {/* Provider info pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                borderRadius: 12,
                background: '#F8FAFF',
                border: '1px solid #DBEAFE',
              }}
            >
              {Icons.google}
              <div>
                <p style={{ margin: 0, fontSize: '0.78rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, color: '#6B7280' }}>
                  Connected via
                </p>
                <p style={{ margin: '1px 0 0', fontSize: '0.875rem', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: '#1E40AF' }}>
                  Google OAuth
                </p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Badge label="Active" color="#10B981" bg="#ECFDF5" />
              </div>
            </div>
          </div>

          {/* ─ Metadata Card ────────────────────────────────────────────── */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 4px 12px rgba(17,24,39,0.08)',
              border: '1px solid #E5E7EB',
            }}
          >
            <h3 style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
              Account Details
            </h3>
            <p style={{ margin: '0 0 16px', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#9CA3AF' }}>
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
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#9CA3AF', fontFamily: "'Inter', sans-serif" }}>
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
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#9CA3AF', fontFamily: "'Inter', sans-serif" }}>
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
                  ? <Badge label="Google OAuth 2.0" color="#4285F4" bg="#EFF6FF" />
                  : <Badge label="Email / Password" color="#6B7280" bg="#F3F4F6" />
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}
