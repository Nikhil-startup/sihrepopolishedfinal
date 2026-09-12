'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';
import { LowBandwidthToggle } from '@/components/common/LowBandwidthToggle';
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  MapPin,
  Sparkles,
  Truck,
  Store,
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  Languages,
  ChevronDown,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Authenticated navigation items
  const navItems = [
    { label: t('nav.dashboard'), href: '/farmer/dashboard', icon: LayoutDashboard },
    { label: t('nav.intelligence'), href: '/farmer/intelligence', icon: Sparkles },
    { label: t('nav.produce'), href: '/farmer/produce', icon: Sprout },
    { label: t('nav.marketPrices'), href: '/farmer/market-prices', icon: TrendingUp },
    { label: t('nav.demandMap'), href: '/farmer/demand-map', icon: MapPin },
    { label: t('nav.recommendations'), href: '/farmer/recommendations', icon: Sparkles },
    { label: t('nav.orders'), href: '/farmer/orders', icon: Truck },
  ];

  // Route protection
  const publicFarmerRoutes = ['/farmer', '/farmer/login', '/farmer/register', '/farmer/complete-profile'];
  const isPublicRoute = publicFarmerRoutes.includes(pathname);

  // If user visits public farmer routes, do NOT render the authenticated navbar/layout wrapper
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Redirect to login if unauthenticated on protected routes
  if (!isLoading && !isAuthenticated) {
    router.push('/farmer/login');
    return null;
  }

  // If authenticated but profile incomplete, redirect to complete-profile
  if (!isLoading && isAuthenticated && user && user.profileCompleted === false && pathname !== '/farmer/complete-profile') {
    router.push('/farmer/complete-profile');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4faf5] text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Demo Bar */}
      <div className="bg-emerald-700 text-white text-[11px] font-semibold py-1.5 px-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800 shadow-sm">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse shrink-0" />
          <span className="truncate font-bold">AgriFlow {t('nav.farmerPortal')}</span>
          <span className="hidden sm:inline-block text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-100 font-medium">
            Sunlight-Optimized Farm UI
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          <LowBandwidthToggle />
          <LanguageSelector variant="compact" />
        </div>
      </div>

      {/* Main Authenticated Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm shadow-emerald-950/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Logo */}
          <Link href="/farmer/dashboard" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-600/30">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-sm sm:text-base md:text-lg text-slate-900 tracking-tight truncate block">
                AgriFlow <span className="text-emerald-600 font-black">{t('role.farmer')}</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium text-emerald-700/80 truncate hidden sm:block">
                {t('nav.directDemand')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2',
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Utilities & Profile Menu */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-emerald-50 transition border border-transparent hover:border-emerald-200"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0] : 'F'}
                </div>
                <div className="text-left hidden md:block">
                  <span className="text-xs font-bold block text-slate-800 truncate max-w-[110px]">{user?.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate max-w-[110px]">{user?.farmName || user?.location}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-emerald-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-emerald-50 text-xs">
                    <span className="font-bold text-slate-900 block truncate">{user?.name}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{user?.phone}</span>
                  </div>
                  <Link
                    href="/farmer/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition"
                  >
                    <User className="w-4 h-4" />
                    <span>{t('nav.profile')}</span>
                  </Link>
                  <Link
                    href="/farmer/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{t('nav.settings')}</span>
                  </Link>
                  <div className="border-t border-emerald-50 my-1" />
                  <button
                    onClick={() => { setProfileDropdownOpen(false); logout(); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-emerald-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-emerald-100 bg-white px-4 py-4 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition',
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-emerald-600')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-emerald-100 pt-3 mt-3 space-y-1">
              <Link
                href="/farmer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <User className="w-4 h-4" />
                <span>{t('nav.profile')}</span>
              </Link>
              <Link
                href="/farmer/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <Settings className="w-4 h-4" />
                <span>{t('nav.settings')}</span>
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 text-center text-xs text-slate-500">
        <p>&copy; 2026 AgriFlow AI &bull; {t('nav.farmerPortal')} &bull; Clean Sunlight Farm Portal</p>
      </footer>
    </div>
  );
}
