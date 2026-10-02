import { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TrustPositioning } from '@/components/TrustPositioning';
import { WhatIsSkillSwap } from '@/components/WhatIsSkillSwap';
import { SkillDiscovery } from '@/components/SkillDiscovery';
import { HowItWorks } from '@/components/HowItWorks';
import { CommunityFeed } from '@/components/CommunityFeed';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { SignupPage } from '@/pages/SignupPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';

type View = 'home' | 'login' | 'signup' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>(() => {
    const path = window.location.pathname;
    if (path === '/signup') return 'signup';
    if (path === '/login') return 'login';
    if (path === '/dashboard') return 'dashboard';
    return 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/signup') setCurrentView('signup');
      else if (path === '/login') setCurrentView('login');
      else if (path === '/dashboard') setCurrentView('dashboard');
      else setCurrentView('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: View, path: string) => {
    window.history.pushState({}, '', path);
    setCurrentView(view);
  };

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0F1012] text-[#111318] dark:text-[#F5F5F5] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF5A4A]/20 selection:text-[#FF5A4A] transition-colors duration-200">
          {currentView === 'signup' ? (
            <SignupPage
              onNavigateToHome={() => navigateTo('home', '/')}
              onNavigateToLogin={() => navigateTo('login', '/login')}
            />
          ) : currentView === 'login' ? (
            <LoginPage
              onNavigateToHome={() => navigateTo('home', '/')}
              onNavigateToSignup={() => navigateTo('signup', '/signup')}
            />
          ) : currentView === 'dashboard' ? (
            <DashboardPage
              onNavigateToHome={() => navigateTo('home', '/')}
              onNavigateToLogin={() => navigateTo('login', '/login')}
            />
          ) : (
            <>
              {/* Navigation Shell */}
              <Navbar onNavigateToSignup={() => navigateTo('login', '/login')} />
              {/* Product Visualization Hero */}
              <Hero />
              {/* Trust & Positioning Section */}
              <TrustPositioning />
              {/* What is Skill Swap Explanatory Section */}
              <WhatIsSkillSwap />
              {/* Skill Discovery Network Marketplace */}
              <SkillDiscovery />
              {/* How It Works 3-Step Editorial */}
              <HowItWorks />
              {/* Live Community Stream */}
              <CommunityFeed />
              {/* Call to Action */}
              <CTA />
              {/* Footer */}
              <Footer />
            </>
          )}
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
