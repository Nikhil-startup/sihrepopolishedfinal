'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { 
  LogIn, 
  Store, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Utensils, 
  ShoppingBag, 
  Home 
} from 'lucide-react';

export default function ConsumerLoginPage() {
  const router = useRouter();
  const { loginConsumer, loginWithGoogle } = useAuth();
  const { t } = useI18n();

  const [identifier, setIdentifier] = useState('rajesh.varma@southern-procure.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email or mobile number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginConsumer(identifier, password);
      router.push('/consumer/dashboard');
    } catch {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setQuickDemoRole = async (email: string) => {
    setIdentifier(email);
    setPassword('demoPass123');
    setLoading(true);
    try {
      await loginConsumer(email, 'demoPass123');
      router.push('/consumer/dashboard');
    } catch {
      setError('Failed to login demo role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-1">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
          {t('consumer.buyerLoginTitle', 'Buyer Portal Login')}
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {t('consumer.buyerLoginSubtitle', 'Direct farm-gate access with escrow safety & quality assurance')}
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              {t('consumer.emailOrMobile', 'Email or Mobile Number')}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. buyer@agriflow.in or 9848012345"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                {t('consumer.password', 'Password')}
              </label>
              <span className="text-[11px] text-zinc-400">Demo PIN: 1234</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> {t('consumer.signInBuyer', 'Sign In to Buyer Portal')}
              </>
            )}
          </button>
        </form>

        {/* Continue with Google */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400 font-semibold">{t('common.or', 'or')}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError('');
            try {
              const res = await loginWithGoogle('consumer');
              if (res.profileCompleted) {
                router.push('/consumer/dashboard');
              } else {
                router.push('/profile/create');
              }
            } catch (err: any) {
              console.error('Google login error:', err);
              if (err?.message !== 'Google sign-in cancelled by user') {
                setError(err?.message || 'Failed to sign in with Google');
              }
            } finally {
              setLoading(false);
            }
          }}
          className="w-full py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-sm flex items-center justify-center gap-3 transition shadow-sm"
        >
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
          <span>{t('auth.continueWithGoogle', 'Continue with Google')}</span>
        </button>

        {/* Quick Demo Logins for SIH Judges */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block text-center">
            {t('consumer.quickDemoPersonas', '⚡ Quick SIH Demo Personas')}
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setQuickDemoRole('rajesh.varma@southern-procure.in')}
              className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-colors"
            >
              <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-500" /> {t('consumer.bulkBuyer', 'Bulk Buyer')}
              </span>
              <span className="text-[10px] text-zinc-500 block">{t('consumer.bulkBuyerDesc', '5 Ton Hyderabad Tomato')}</span>
            </button>

            <button
              type="button"
              onClick={() => setQuickDemoRole('chef.ananya@royalbengal.com')}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-left transition-colors"
            >
              <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-500" /> {t('auth.restaurant', 'Restaurant')}
              </span>
              <span className="text-[10px] text-zinc-500 block">Chef Ananya (150 kg)</span>
            </button>

            <button
              type="button"
              onClick={() => setQuickDemoRole('suresh.retail@freshmart.in')}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-left transition-colors"
            >
              <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-500" /> {t('auth.retailer', 'Supermarket')}
              </span>
              <span className="text-[10px] text-zinc-500 block">FreshMart Superstore</span>
            </button>

            <button
              type="button"
              onClick={() => setQuickDemoRole('sunita.sharma@gmail.com')}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-left transition-colors"
            >
              <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-purple-500" /> {t('auth.household', 'Household')}
              </span>
              <span className="text-[10px] text-zinc-500 block">Family Kitchen (10 kg)</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {t('auth.notRegistered', "Don't have an account?")}{' '}
          <Link href="/consumer/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            {t('consumer.landing.createAccount', 'Create an Account')}
          </Link>
        </div>
      </div>
    </div>
  );
}
