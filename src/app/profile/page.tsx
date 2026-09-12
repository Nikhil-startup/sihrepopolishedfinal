'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useI18n, SupportedLanguage, SUPPORTED_LANGUAGES } from '@/context/I18nContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { authService, BackendUser } from '@/services/authService';
import { INDIAN_STATES, INDIAN_STATES_AND_DISTRICTS } from '@/lib/locationData';
import {
  User,
  Phone,
  MapPin,
  Home,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowLeft,
  Edit3,
  Save,
  Shield,
  Sprout,
  ShoppingBag,
  Truck,
  Mail,
} from 'lucide-react';

export default function ProfileViewPage() {
  const { user, consumerUser, logisticsUser, refreshUserProfile } = useAuth();
  const { t, language, setLanguage } = useI18n();

  const currentUser = user || consumerUser || logisticsUser;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<BackendUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [area, setArea] = useState('');
  const [villageOrLocality, setVillageOrLocality] = useState('');
  const [pincode, setPincode] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [prefLang, setPrefLang] = useState<SupportedLanguage>(language);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  useEffect(() => {
    async function loadProfile() {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }
      try {
        const resp = await authService.getProfile(currentUser.id, (currentUser as any).email);
        if (resp.user) {
          setProfile(resp.user);
          setFullName(resp.user.full_name || resp.user.name || '');
          setMobileNumber(resp.user.mobile_number || resp.user.phone || '');
          setSelectedState(resp.user.state || 'Telangana');
          setSelectedDistrict(resp.user.district || '');
          setArea(resp.user.area || '');
          setVillageOrLocality(resp.user.village_or_locality || '');
          setPincode(resp.user.pincode || '');
          setFullAddress(resp.user.full_address || '');
          if (resp.user.preferred_language) {
            setPrefLang(resp.user.preferred_language as SupportedLanguage);
          }
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [currentUser]);

  useEffect(() => {
    if (selectedState && INDIAN_STATES_AND_DISTRICTS[selectedState]) {
      const dists = INDIAN_STATES_AND_DISTRICTS[selectedState];
      setAvailableDistricts(dists);
      if (!dists.includes(selectedDistrict)) {
        setSelectedDistrict(dists[0] || '');
      }
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedState]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = fullName.trim();
    if (cleanName.length < 2) {
      setErrorMsg(t('profile.errName', 'Full Name must be at least 2 characters'));
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg(t('profile.errMobile', 'Please enter a valid 10-digit Indian mobile number'));
      return;
    }

    if (!/^[1-9]\d{5}$/.test(pincode.replace(/\D/g, ''))) {
      setErrorMsg(t('profile.errPincode', 'Please enter a valid 6-digit Indian pincode'));
      return;
    }

    setSaving(true);
    try {
      const resp = await authService.updateProfile(
        {
          full_name: cleanName,
          mobile_number: cleanPhone,
          state: selectedState,
          district: selectedDistrict,
          area: area.trim(),
          village_or_locality: villageOrLocality.trim(),
          pincode: pincode.replace(/\D/g, ''),
          full_address: fullAddress.trim(),
          preferred_language: prefLang,
        },
        profile.id
      );

      if (resp.user) {
        setProfile(resp.user);
        setIsEditing(false);
        setSuccessMsg(t('profile.updatedSuccess', 'Profile updated successfully in Neon PostgreSQL!'));
        await refreshUserProfile();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getDashboardLink = () => {
    if (currentUser?.role === 'consumer') return '/consumer/dashboard';
    if (currentUser?.role === 'logistics') return '/logistics/dashboard';
    return '/farmer/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-2xl w-full mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={getDashboardLink()}
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Database className="w-3.5 h-3.5" />
            <span>Neon PostgreSQL Authoritative</span>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="bg-slate-900 border-slate-800 p-6 sm:p-8 shadow-2xl rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-2xl">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {profile?.full_name || profile?.name || 'AgriFlow User'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 capitalize">
                    {profile?.role === 'farmer' && <Sprout className="w-3 h-3" />}
                    {profile?.role === 'consumer' && <ShoppingBag className="w-3 h-3" />}
                    {profile?.role === 'logistics' && <Truck className="w-3 h-3" />}
                    <span>{profile?.role || 'User'}</span>
                  </span>
                  {profile?.profile_completed && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Verified Profile
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t('profile.editProfile', 'Edit Profile')}</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2.5 rounded-xl"
                >
                  <span>Cancel</span>
                </Button>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="mt-6 bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs sm:text-sm p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mt-6 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm p-4 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          {!isEditing ? (
            /* VIEW MODE */
            <div className="mt-6 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">Email / Google Identity</span>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>{profile?.email || 'Not connected'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">Mobile Number</span>
                  <div className="flex items-center gap-2 text-white font-mono font-medium">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>+91 {profile?.mobile_number || profile?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">State & District</span>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>
                      {profile?.district ? `${profile.district}, ` : ''}
                      {profile?.state || 'Not set'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">Area & Pincode</span>
                  <div className="text-white font-medium">
                    {profile?.area || profile?.village_or_locality || 'N/A'}
                    {profile?.pincode ? ` - ${profile.pincode}` : ''}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-xs text-slate-400 block mb-1">Full Registered Address</span>
                <div className="text-white">{profile?.full_address || profile?.location || 'N/A'}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Preferred Interface Language</span>
                  <span className="text-white font-bold capitalize">{profile?.preferred_language || 'en'}</span>
                </div>
                <span className="text-xs text-slate-500">7-Language SIH Native Localization</span>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-950 border border-slate-700 text-slate-300 px-3.5 py-3 rounded-xl text-sm font-bold">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white"
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Area / Village
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <Button
                  type="submit"
                  isLoading={saving}
                  className="flex-1 py-3 text-white font-bold bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes to Neon PostgreSQL'}</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
