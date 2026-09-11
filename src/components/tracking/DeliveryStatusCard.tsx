'use client';

import React from 'react';
import { DeliveryStatus } from '@/types/delivery';
import { Truck, CheckCircle2, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { translateStatus } from '@/lib/i18nHelpers';

interface DeliveryStatusCardProps {
  status: DeliveryStatus;
  orderId: string;
  tripId: string;
  isFarmerView?: boolean;
}

export default function DeliveryStatusCard({
  status,
  orderId,
  tripId,
  isFarmerView = false,
}: DeliveryStatusCardProps) {
  const { t } = useI18n();

  const getHeadline = () => {
    switch (status) {
      case 'ORDER CONFIRMED':
        return t('tracking.orderConfirmed');
      case 'PICKUP SCHEDULED':
        return t('tracking.pickupScheduled');
      case 'DRIVER ASSIGNED':
        return t('tracking.driverAssigned');
      case 'PICKUP STARTED':
        return t('tracking.pickupStarted');
      case 'PRODUCE PICKED UP':
        return t('tracking.producePickedUp');
      case 'IN TRANSIT':
        return t('tracking.inTransit');
      case 'APPROACHING DESTINATION':
        return t('tracking.approachingDestination');
      case 'ARRIVED':
        return t('tracking.arrived');
      case 'DELIVERED':
        return t('tracking.delivered');
      default:
        return t('tracking.title');
    }
  };

  const getBadgeColor = () => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'IN TRANSIT':
      case 'APPROACHING DESTINATION':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'ORDER CONFIRMED':
      case 'PICKUP SCHEDULED':
      case 'DRIVER ASSIGNED':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getBadgeColor()}`}>
            ● {translateStatus(status, t)}
          </span>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            {t('tracking.trip')} {tripId}
          </span>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            {t('tracking.order')} {orderId}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{t('tracking.simulatedLive')}</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {getHeadline()}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          {isFarmerView
            ? t('tracking.farmerViewDesc')
            : t('tracking.consumerViewDesc')}
        </p>
      </div>
    </div>
  );
}
