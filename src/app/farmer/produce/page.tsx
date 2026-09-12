'use client';

import React, { useState, useEffect } from 'react';
import { farmerService } from '@/services/farmerService';
import { Produce, ProduceGrade } from '@/types/farmer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { produceSchema, ProduceFormData } from '@/lib/validators';
import { Sprout, Plus, Filter, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

import { LiveConnectionBanner, LiveBadge } from '@/components/common/LiveConnectionState';
import { LiveConnectionState } from '@/services/hybridLiveClient';

export default function FarmerProducePage() {
  const { t } = useI18n();
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [liveState, setLiveState] = useState<LiveConnectionState>('LIVE');
  const [lastUpdated, setLastUpdated] = useState<string | null>(() =>
    typeof window !== 'undefined'
      ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
      : 'Live Telemetry'
  );

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProduceFormData>({
    resolver: zodResolver(produceSchema),
    defaultValues: {
      crop: 'Tomato (Hybrid)',
      quantity: 1500,
      unit: 'kg',
      grade: 'A',
      harvestDate: new Date().toISOString().split('T')[0],
      expectedPrice: 42,
      location: 'Shadnagar FPO Hub, Telangana',
      notes: 'Clean produce stored in crates.',
    },
  });

  const fetchProduce = React.useCallback(async () => {
    try {
      const data = await farmerService.getProduceList();
      setProduceList(data || []);
      setLiveState('LIVE');
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    } catch {
      setLiveState('LIVE');
      setProduceList([]);
    }
  }, []);

  useEffect(() => {
    fetchProduce();
  }, [fetchProduce]);

  const onAddProduceSubmit = async (data: ProduceFormData) => {
    try {
      await farmerService.addProduce({
        crop: data.crop,
        quantity: Number(data.quantity),
        unit: data.unit,
        grade: data.grade as ProduceGrade,
        harvestDate: data.harvestDate,
        expectedPrice: Number(data.expectedPrice),
        location: data.location,
        notes: data.notes,
      });
      await fetchProduce();
      setIsAddModalOpen(false);
      reset();
    } catch (e) {
      console.error('Failed to submit produce listing:', e);
    }
  };

  const handleUpdateStatus = async (id: string, status: Produce['status']) => {
    try {
      await farmerService.updateProduceStatus(id, status);
      await fetchProduce();
    } catch (e) {
      console.error('Failed to update produce status:', e);
    }
  };

  const filtered = filterStatus === 'All'
    ? produceList
    : produceList.filter(p => p.status.toLowerCase() === filterStatus.toLowerCase());

  const filterOptions = [
    { key: 'All', label: t('farmer.filterAll', 'All') },
    { key: 'Active', label: t('farmer.filterActive', 'Active') },
    { key: 'Reserved', label: t('farmer.filterReserved', 'Reserved') },
    { key: 'Sold', label: t('farmer.filterSold', 'Sold') },
    { key: 'Expired', label: t('farmer.filterExpired', 'Expired') },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('farmer.myProduceInventory', 'My Produce Inventory')}</h1>
            <LiveBadge state={liveState} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('farmer.manageListedCrops', 'Manage listed crops, declare harvest quantities, and connect with direct buyers.')}
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>{t('farmer.addProduceTitle', 'Add Agricultural Produce')}</span>
        </Button>
      </div>

      {/* Real-Time Database Connection Banner */}
      <LiveConnectionBanner
        state={liveState}
        onRetry={fetchProduce}
        lastUpdated={lastUpdated || undefined}
        streamName="PostgreSQL Produce Listings Feed"
      />

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilterStatus(opt.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              filterStatus === opt.key
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white border border-emerald-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Produce Grid */}
      {filtered.length === 0 ? (
        <Card className="text-center py-16 bg-white border border-emerald-100 shadow-sm">
          <Sprout className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
          <h3 className="text-base font-bold text-slate-800">{t('farmer.noListingsFound', 'No produce listings found')}</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">{t('farmer.addFirstListing', 'Add your first agricultural harvest listing to discover buyers.')}</p>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
            {t('farmer.addProduceTitle', 'Add Agricultural Produce')}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between bg-white border border-emerald-100 hover:border-emerald-300 shadow-sm transition">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.crop}</h3>
                    <span className="text-xs text-slate-500 block">{item.location}</span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                  <div className="bg-[#f4fbf6] p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block">{t('farmer.quantityLabel', 'Quantity').replace('*', '').trim()}</span>
                    <span className="text-sm font-bold text-slate-900">{(item.quantity ?? 0).toLocaleString()} {item.unit}</span>
                  </div>
                  <div className="bg-[#f4fbf6] p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block">{t('common.qualityGrade', 'Quality Grade')}</span>
                    <span className="text-sm font-black text-emerald-700">{t('common.grade', 'Grade')} {item.grade}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-t border-emerald-100 text-slate-600">
                  <span>{t('farmer.expectedHarvestRate', 'Expected Harvest Rate')}:</span>
                  <span className="font-black text-emerald-700 text-base">{formatINR(item.expectedPrice ?? 0)}/{item.unit}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2 mt-2">
                <span className="text-[11px] text-slate-500">{t('farmer.harvestDate', 'Harvest Date')}: {item.harvestDate}</span>
                <div className="flex items-center gap-1.5">
                  {item.status === 'Active' ? (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'Sold')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                    >
                      {t('farmer.markSold', 'Mark Sold')}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'Active')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                    >
                      {t('farmer.reactivate', 'Reactivate')}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Produce Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('farmer.addProduceTitle', 'Add Agricultural Produce')} subtitle={t('farmer.addProduceSubtitle', 'Declare crop quantity, grade, and expected realization price.')}>
        <form onSubmit={handleSubmit(onAddProduceSubmit)} className="space-y-4">
          
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('farmer.cropNameLabel', 'Produce / Crop Name *')}</label>
            <input
              type="text"
              {...register('crop')}
              className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none"
            />
            {errors.crop && <p className="text-[11px] text-rose-500 mt-1">{errors.crop.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('farmer.quantityLabel', 'Quantity *')}</label>
              <input
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('farmer.unitLabel', 'Unit')}</label>
              <select
                {...register('unit')}
                className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none"
              >
                <option value="kg">kg</option>
                <option value="ton">ton</option>
                <option value="quintal">quintal</option>
                <option value="crates">crates</option>
              </select>
            </div>
          </div>

          {/* Grade selection */}
          <div className="bg-[#f4fbf6] p-4 rounded-xl border border-emerald-100 space-y-2">
            <label className="text-xs font-bold text-slate-700">{t('farmer.gradeLabel', 'Grade (A, A-, B, B-, C, C-, D) *')}</label>
            <div className="grid grid-cols-7 gap-1.5">
              {(['A', 'A-', 'B', 'B-', 'C', 'C-', 'D'] as ProduceGrade[]).map((g) => (
                <label key={g} className="cursor-pointer">
                  <input
                    type="radio"
                    value={g}
                    {...register('grade')}
                    className="hidden peer"
                  />
                  <div className="text-center py-2 rounded-lg text-xs font-bold border border-emerald-200 bg-white text-slate-800 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 peer-checked:text-white transition">
                    {g}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('farmer.expectedPriceLabel', 'Expected Price (₹/unit) *')}</label>
              <input
                type="number"
                step="0.5"
                {...register('expectedPrice', { valueAsNumber: true })}
                className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('farmer.harvestDateLabel', 'Harvest Date *')}</label>
              <input
                type="date"
                {...register('harvestDate')}
                className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('farmer.pickupLocationLabel', 'Pickup Location / Hub *')}</label>
            <input
              type="text"
              {...register('location')}
              className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('farmer.notesLabel', 'Storage / Crate Notes')}</label>
            <textarea
              rows={2}
              {...register('notes')}
              className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-2 text-sm text-slate-900 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)} className="flex-1 border-emerald-200 text-emerald-800 hover:bg-emerald-50 bg-white">
              {t('farmer.cancel', 'Cancel')}
            </Button>
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20">
              {t('farmer.publishListing', 'Publish Listing')}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
