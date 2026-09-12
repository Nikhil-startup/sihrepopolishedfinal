'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useI18n, SUPPORTED_LANGUAGES, SupportedLanguage } from '@/context/I18nContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { INDIAN_STATES, INDIAN_STATES_AND_DISTRICTS } from '@/lib/locationData';
import {
  UserCheck,
  Shield,
  MapPin,
  Phone,
  User,
  Home,
  Navigation,
  Globe,
  Truck,
  Sprout,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
} from 'lucide-react';

export default function ProfileCreatePage() {
  const router = useRouter();
  const { pendingGoogleUser, saveProfile, isLoading } = useAuth();
  const { t, language, setLanguage } = useI18n();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedState, setSelectedState] = useState('Telangana');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [area, setArea] = useState('');
  const [villageOrLocality, setVillageOrLocality] = useState('');
  const [pincode, setPincode] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [role, setRole] = useState<'farmer' | 'consumer' | 'logistics'>('farmer');
  const [prefLang, setPrefLang] = useState<SupportedLanguage>(language);

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initialize from pendingGoogleUser or sessionStorage
  useEffect(() => {
    let pending = pendingGoogleUser;
    if (!pending && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('agriflow_pending_profile');
      if (stored) {
        try {
          pending = JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }

    if (pending) {
      if (pending.full_name || pending.name) {
        setFullName(pending.full_name || pending.name);
      }
      if (pending.role && ['farmer', 'consumer', 'logistics'].includes(pending.role)) {
        setRole(pending.role as any);
      }
      if (pending.mobile_number || pending.phone) {
        setMobileNumber(pending.mobile_number || pending.phone || '');
      }
      if (pending.state && INDIAN_STATES_AND_DISTRICTS[pending.state]) {
        setSelectedState(pending.state);
      }
      if (pending.district) {
        setSelectedDistrict(pending.district);
      }
    }
  }, [pendingGoogleUser]);

  // Update dependent districts when state changes
  useEffect(() => {
    if (selectedState && INDIAN_STATES_AND_DISTRICTS[selectedState]) {
      const districts = INDIAN_STATES_AND_DISTRICTS[selectedState];
      setAvailableDistricts(districts);
      if (!districts.includes(selectedDistrict)) {
        setSelectedDistrict(districts[0] || '');
      }
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedState]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const districts = INDIAN_STATES_AND_DISTRICTS[newState] || [];
    setAvailableDistricts(districts);
    setSelectedDistrict(districts[0] || '');
  };

  const handleLanguageSelect = (newLang: SupportedLanguage) => {
    setPrefLang(newLang);
    setLanguage(newLang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    const cleanName = fullName.trim();
    if (cleanName.length < 2) {
      setErrorMsg(t('profile.errName', 'Full Name must be at least 2 characters'));
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg(t('profile.errMobile', 'Please enter a valid 10-digit Indian mobile number starting with 6-9'));
      return;
    }

    if (!selectedState) {
      setErrorMsg(t('profile.errState', 'Please select a state'));
      return;
    }

    if (!selectedDistrict) {
      setErrorMsg(t('profile.errDistrict', 'Please select a district'));
      return;
    }

    const cleanArea = area.trim();
    if (!cleanArea) {
      setErrorMsg(t('profile.errArea', 'Please enter your village / area'));
      return;
    }

    const cleanPincode = pincode.replace(/\D/g, '');
    if (!/^[1-9]\d{5}$/.test(cleanPincode)) {
      setErrorMsg(t('profile.errPincode', 'Please enter a valid 6-digit Indian pincode'));
      return;
    }

    const cleanAddress = fullAddress.trim();
    if (cleanAddress.length < 5) {
      setErrorMsg(t('profile.errAddress', 'Please enter your full address'));
      return;
    }

    setSubmitting(true);

    try {
      let pending = pendingGoogleUser;
      if (!pending && typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('agriflow_pending_profile');
        if (stored) pending = JSON.parse(stored);
      }

      await saveProfile({
        user_id: pending?.id,
        email: pending?.email,
        full_name: cleanName,
        mobile_number: cleanPhone,
        state: selectedState,
        district: selectedDistrict,
        area: cleanArea,
        village_or_locality: villageOrLocality.trim() || cleanArea,
        pincode: cleanPincode,
        full_address: cleanAddress,
        role: role,
        preferred_language: prefLang,
      });

      setSuccessMsg(t('profile.savedSuccess', 'Profile saved successfully in Neon PostgreSQL!'));
      // saveProfile handles redirect to role dashboard automatically!
    } catch (err: any) {
      console.error('Profile submission failed:', err);
      setErrorMsg(err?.message || 'Failed to save profile. Please check database connection and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
            <Database className="w-3.5 h-3.5" />
            <span>Neon PostgreSQL &bull; Authoritative Identity Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('profile.createTitle', 'Complete Your AgriFlow Profile')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            {t(
              'profile.createSubtitle',
              'Mandatory one-time profile setup. Your details are saved securely in Neon PostgreSQL.'
            )}
          </p>
        </div>

        {/* Card Form */}
        <Card className="bg-slate-900 border-slate-800 p-6 sm:p-8 shadow-2xl rounded-2xl">
          {errorMsg && (
            <div className="mb-6 bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs sm:text-sm p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ROLE SELECTION */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t('profile.role', 'Your Role in AgriFlow')} <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Farmer */}
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    role === 'farmer'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Sprout className={`w-5 h-5 ${role === 'farmer' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    {role === 'farmer' && <UserCheck className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="font-bold text-sm text-white">{t('profile.roleFarmer', 'Farmer / Producer')}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {t('profile.roleFarmerDesc', 'Direct farmgate selling, MSP forecasting & buyers')}
                  </div>
                </button>

                {/* Consumer */}
                <button
                  type="button"
                  onClick={() => setRole('consumer')}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    role === 'consumer'
                      ? 'bg-blue-950/40 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingBag className={`w-5 h-5 ${role === 'consumer' ? 'text-blue-400' : 'text-slate-500'}`} />
                    {role === 'consumer' && <UserCheck className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="font-bold text-sm text-white">{t('profile.roleConsumer', 'Buyer / Consumer')}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {t('profile.roleConsumerDesc', 'Procure farm-fresh crops directly with traceability')}
                  </div>
                </button>

                {/* Logistics */}
                <button
                  type="button"
                  onClick={() => setRole('logistics')}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    role === 'logistics'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Truck className={`w-5 h-5 ${role === 'logistics' ? 'text-amber-400' : 'text-slate-500'}`} />
                    {role === 'logistics' && <UserCheck className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="font-bold text-sm text-white">{t('profile.roleLogistics', 'Logistics / Carrier')}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {t('profile.roleLogisticsDesc', 'Cold-chain reefer transit & dispatch opportunities')}
                  </div>
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {t('profile.fullName', 'Full Name')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('profile.fullNamePlaceholder', 'Enter your full name')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* MOBILE NUMBER (10-digit Indian) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {t('profile.mobileNumber', 'Mobile Number')} <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="bg-slate-950 border border-slate-700 text-slate-300 px-3.5 py-3 rounded-xl text-sm font-bold select-none">
                  🇮🇳 +91
                </span>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('profile.mobileNumberPlaceholder', '10-digit Indian mobile number')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* STATE & DISTRICT (DEPENDENT DROPDOWNS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('profile.state', 'State')} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={selectedState}
                    onChange={handleStateChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition appearance-none cursor-pointer"
                  >
                    <option value="">{t('profile.selectState', 'Select State')}</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('profile.district', 'District')} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Navigation className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={availableDistricts.length === 0}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">{t('profile.selectDistrict', 'Select District')}</option>
                    {availableDistricts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* AREA & PINCODE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('profile.area', 'Area / Village')} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder={t('profile.areaPlaceholder', 'Enter village, taluk, or area')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('profile.pincode', 'Pincode')} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('profile.pincodePlaceholder', '6-digit postal code')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* LOCALITY / LANDMARK (OPTIONAL) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {t('profile.locality', 'Locality / Landmark (Optional)')}
              </label>
              <input
                type="text"
                value={villageOrLocality}
                onChange={(e) => setVillageOrLocality(e.target.value)}
                placeholder={t('profile.localityPlaceholder', 'Near Panchayat Office / Farm gate')}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>

            {/* FULL ADDRESS */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {t('profile.fullAddress', 'Full Address')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Home className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <textarea
                  required
                  rows={3}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder={t('profile.fullAddressPlaceholder', 'Door number, street, landmark, village/town')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                />
              </div>
            </div>

            {/* PREFERRED LANGUAGE (7 LANGUAGES) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {t('profile.preferredLanguage', 'Preferred Language')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleLanguageSelect(l.code)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium text-center border transition ${
                      prefLang === l.code
                        ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{l.nativeLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-slate-800">
              <Button
                type="submit"
                isLoading={submitting || isLoading}
                className="w-full py-4 text-base font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>
                  {submitting
                    ? t('profile.saving', 'Saving to Neon PostgreSQL...')
                    : t('profile.saveAndContinue', 'Save Profile & Continue to Dashboard')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>

        {/* Security / Verification Footer */}
        <div className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>AgriFlow AI &bull; Smart India Hackathon Verified Direct Trade System</span>
        </div>
      </div>
    </div>
  );
}
