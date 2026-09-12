'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { PhoneAuthForm } from '@/components/auth/PhoneAuthForm';
import { ArrowLeft, Sprout } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export default function FarmerLoginPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f4faf5] text-slate-800 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white">
      
      {/* Back link */}
      <div className="max-w-md w-full mx-auto">
        <Link href="/farmer" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 transition font-medium">
          <ArrowLeft className="w-4 h-4" /> {t('farmer.backToPortal', 'Back to Farmer Portal')}
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-8">
        <Card className="bg-white border border-emerald-100 p-8 shadow-xl shadow-emerald-950/5 rounded-2xl">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
              <Sprout className="w-7 h-7 text-emerald-600" />
            </div>
          </div>

          <PhoneAuthForm
            role="farmer"
            redirectUrl="/farmer/dashboard"
            roleTitle={t('farmer.loginTitle', 'Farmer / FPO Login')}
            roleSubtitle={t('farmer.loginSubtitle', 'Manage your harvest, discover live wholesale demand, and eliminate middlemen.')}
            themeColor="emerald"
          />

        </Card>
      </div>

      <div className="text-center text-xs text-slate-500">
        AgriFlow AI &bull; {t('common.sihVerified', 'Smart India Hackathon Verified Direct Trade System')}
      </div>

    </div>
  );
}
