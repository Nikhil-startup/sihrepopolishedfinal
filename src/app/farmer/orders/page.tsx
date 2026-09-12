'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackingService } from '@/services/trackingService';
import { Order } from '@/types/farmer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Truck, ArrowRight, CheckCircle2, Clock, Sparkles, Flag } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import RateAndReviewModal from '@/components/reviews/RateAndReviewModal';
import ReportModal from '@/components/reports/ReportModal';
import { UserRole, ReportType } from '@/types/review';
import { useI18n } from '@/context/I18nContext';
import { LiveBadge } from '@/components/common/LiveConnectionState';
import { LiveConnectionState } from '@/services/hybridLiveClient';

export default function FarmerOrdersPage() {
  const { t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);

  // Rating and Report State
  const [selectedRatingOrder, setSelectedRatingOrder] = useState<{
    transactionId: string;
    targetUserId: string;
    targetRole: UserRole;
    targetName: string;
    productName?: string;
  } | null>(null);

  const [selectedReportData, setSelectedReportData] = useState<{
    reportType: ReportType;
    reportedUserId?: string;
    reportedRole?: UserRole;
    reportedName: string;
    transactionId?: string;
  } | null>(null);

  const [liveState, setLiveState] = useState<LiveConnectionState>('LIVE');
  const [lastUpdated, setLastUpdated] = useState<string | null>(() =>
    typeof window !== 'undefined'
      ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
      : 'Live Telemetry'
  );

  useEffect(() => {
    const sub = trackingService.subscribeToOrders(
      (data) => {
        setOrders(data);
      },
      (state, _err, updated) => {
        setLiveState(state);
        if (updated) setLastUpdated(updated);
      }
    );

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('farmer.ordersDeliveryTitle', 'Orders & Delivery')}</h1>
            <LiveBadge state={liveState} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('farmer.ordersDeliverySubtitle', 'Monitor confirmed buyer purchase contracts, road freight dispatches, and delivery payment releases.')}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all rounded-2xl">
            
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-slate-500">{order.id}</span>
                <StatusBadge status={order.status} />
                <span className="text-xs text-slate-400">&bull; {t('common.ordered', 'Ordered')}: {order.orderDate}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{order.buyerName}</h3>
                <p className="text-xs text-slate-500">{order.buyerType} &bull; {t('common.destination', 'Destination')}: <strong className="text-slate-800">{order.destinationCity}</strong></p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs bg-[#f4fbf6] p-3 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('common.produce', 'Produce')}</span>
                  <span className="font-bold text-slate-900">{order.produceName || t('farmer.farmProduce', 'Farm Produce')} ({t('common.grade', 'Grade')} {order.grade || 'A'})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('common.quantity', 'Quantity')}</span>
                  <span className="font-bold text-slate-900">{(order.quantityKg ?? 0).toLocaleString()} kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('common.rate', 'Rate')}</span>
                  <span className="font-bold text-emerald-700">{formatINR(order.pricePerKg ?? 0)}/kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('farmer.totalLotValue', 'Total Realization Value')}</span>
                  <span className="font-black text-emerald-700 text-sm">{formatINR(order.totalOrderValue ?? 0)}</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col gap-2 shrink-0">
              <Link href={`/farmer/tracking/${order.logisticsId}`}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold" size="sm">
                  <Truck className="w-4 h-4" />
                  <span>{t('farmer.trackDelivery', 'Road Tracking')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              {/* Verified Reciprocal Rating - Only after Delivered/Completed */}
              {order.status === 'Delivered' && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRatingOrder({
                        transactionId: order.id,
                        targetUserId: order.buyerName || 'buyer_01',
                        targetRole: 'BUYER',
                        targetName: order.buyerName,
                        productName: order.produceName,
                      });
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {t('farmer.rateBuyer', 'Rate Buyer')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRatingOrder({
                        transactionId: order.id,
                        targetUserId: 'logistics_01',
                        targetRole: 'LOGISTICS',
                        targetName: 'Cold-Chain Reefer Express',
                      });
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    {t('farmer.rateCarrier', 'Rate Carrier')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReportData({
                        reportType: 'USER',
                        reportedUserId: 'buyer_01',
                        reportedRole: 'BUYER',
                        reportedName: order.buyerName,
                        transactionId: order.id,
                      });
                    }}
                    title={t('farmer.reportBuyer', 'Report Buyer')}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </Card>
        ))}
      </div>

      {/* Reciprocal Rate and Review Modal */}
      {selectedRatingOrder && (
        <RateAndReviewModal
          isOpen={true}
          onClose={() => setSelectedRatingOrder(null)}
          transactionId={selectedRatingOrder.transactionId}
          targetUserId={selectedRatingOrder.targetUserId}
          targetRole={selectedRatingOrder.targetRole}
          targetName={selectedRatingOrder.targetName}
          productName={selectedRatingOrder.productName}
          raterUserId="farmer_01"
          raterRole="FARMER"
          raterDisplayName="Ramesh Reddy (Shadnagar FPO)"
        />
      )}

      {/* User Report Modal */}
      {selectedReportData && (
        <ReportModal
          isOpen={true}
          onClose={() => setSelectedReportData(null)}
          reportType={selectedReportData.reportType}
          reportedUserId={selectedReportData.reportedUserId}
          reportedRole={selectedReportData.reportedRole}
          reportedName={selectedReportData.reportedName}
          transactionId={selectedReportData.transactionId}
          reporterUserId="farmer_01"
          reporterRole="FARMER"
          reporterDisplayName="Ramesh Reddy (Shadnagar FPO)"
        />
      )}

    </div>
  );
}
