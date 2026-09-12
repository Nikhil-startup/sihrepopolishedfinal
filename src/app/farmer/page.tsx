'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/common/Button';
import {
  Tractor,
  TrendingUp,
  Sparkles,
  Users,
  Truck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sprout
} from 'lucide-react';

export default function FarmerPublicLandingPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f4fbf6] text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Back to Gateway */}
      <div className="bg-emerald-50 border-b border-emerald-100 text-xs py-2 px-4 flex items-center justify-between text-emerald-800">
        <Link href="/" className="hover:text-emerald-950 flex items-center gap-1 font-semibold transition">
          <ArrowLeft className="w-3.5 h-3.5" /> {t('farmer.landing.gatewayBack')}
        </Link>
        <span className="text-emerald-700 font-bold">{t('farmer.landing.dedicatedApp')}</span>
      </div>

      {/* Public Header */}
      <header className="border-b border-emerald-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm shadow-emerald-950/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-600/30">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">AgriFlow<span className="text-emerald-600"> Farmer</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{t('farmer.landing.directDemandAI')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/farmer/dashboard">
                <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20">
                  {t('farmer.landing.goToDashboard')} &rarr;
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/farmer/login">
                  <Button variant="ghost" size="sm" className="text-slate-700 hover:text-emerald-700 hover:bg-emerald-50">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/farmer/register">
                  <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20">
                    {t('farmer.landing.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> {t('farmer.landing.targetGroup')}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mb-6">
          {t('farmer.landing.heroTitle')}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {t('farmer.landing.heroSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/farmer/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full text-base px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-700/20">
              <span>{t('farmer.landing.register')}</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/farmer/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full text-base px-8 py-4 border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-800 bg-white">
              <span>{t('farmer.landing.login')}</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* 6 Key Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-emerald-100">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{t('farmer.landing.benefitsTitle')}</h2>
          <p className="text-xs sm:text-sm text-slate-600">{t('farmer.landing.benefitsSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white border border-emerald-100 hover:border-emerald-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('farmer.landing.benefit1Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('farmer.landing.benefit1Desc')}
            </p>
          </div>

          <div className="bg-white border border-emerald-100 hover:border-emerald-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('farmer.landing.benefit2Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('farmer.landing.benefit2Desc')}
            </p>
          </div>

          <div className="bg-white border border-emerald-100 hover:border-emerald-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('farmer.landing.benefit3Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('farmer.landing.benefit3Desc')}
            </p>
          </div>

          <div className="bg-white border border-emerald-100 hover:border-emerald-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('farmer.landing.benefit4Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('farmer.landing.benefit4Desc')}
            </p>
          </div>

          <div className="bg-white border border-emerald-100 hover:border-emerald-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('farmer.landing.benefit5Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('farmer.landing.benefit5Desc')}
            </p>
          </div>

          <div className="bg-white border border-emerald-100 hover:border-emerald-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('farmer.landing.benefit6Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('farmer.landing.benefit6Desc')}
            </p>
          </div>

        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border border-emerald-500 rounded-3xl p-8 sm:p-12 shadow-xl shadow-emerald-700/20">
          <h2 className="text-3xl font-black text-white mb-3">{t('farmer.landing.readyTitle')}</h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto mb-6">{t('farmer.landing.readySubtitle')}</p>
          <Link href="/farmer/register">
            <Button size="lg" className="px-8 py-3.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold shadow-lg">
              {t('farmer.landing.getStarted')} &rarr;
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
