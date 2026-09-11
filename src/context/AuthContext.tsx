'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User as FarmerUser } from '@/types/farmer';
import { ConsumerUser } from '@/types/consumer';
import { LogisticsOperator } from '@/types/logistics';
import { demoFarmerUser, demoConsumerUser, demoLogisticsUser } from '@/data/demoData';

export interface DemoConfirmationResult {
  verificationId: string;
  confirm: (verificationCode: string) => Promise<{ user: { uid: string; phoneNumber: string } }>;
}

interface AuthContextType {
  user: FarmerUser | null;
  consumerUser: ConsumerUser | null;
  logisticsUser: LogisticsOperator | null;
  isAuthenticated: boolean;
  isConsumerAuthenticated: boolean;
  isLogisticsAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<boolean>;
  register: (data: Partial<FarmerUser>) => Promise<boolean>;
  logout: () => void;
  loginConsumer: (identifier: string, pass: string) => Promise<boolean>;
  registerConsumer: (data: Partial<ConsumerUser>) => Promise<boolean>;
  logoutConsumer: () => void;
  updateFarmerLanguage: (lang: string) => Promise<boolean>;
  updateConsumerLanguage: (lang: string) => Promise<boolean>;
  updateLogisticsLanguage: (lang: string) => Promise<boolean>;
  updateFarmerProfile: (data: Partial<FarmerUser>) => Promise<boolean>;
  updateConsumerProfile: (data: Partial<ConsumerUser>) => Promise<boolean>;
  updateLogisticsProfile: (data: Partial<LogisticsOperator>) => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
  loginLogistics: (identifier: string, pass: string) => Promise<boolean>;
  registerLogistics: (data: Partial<LogisticsOperator>) => Promise<boolean>;
  logoutLogistics: () => void;
  sendPhoneOtp: (phoneNumber: string, appVerifier?: any) => Promise<DemoConfirmationResult>;
  verifyPhoneOtp: (
    confirmationResult: DemoConfirmationResult,
    otpCode: string,
    role: 'farmer' | 'consumer' | 'logistics' | 'fpo',
    extraData?: { name?: string; phone?: string; state?: string; district?: string; place?: string; preferredLanguage?: any }
  ) => Promise<void>;
  loginWithGoogle: (role: 'farmer' | 'consumer' | 'logistics' | 'fpo') => Promise<{ profileCompleted: boolean }>;
  loginWithDemo: (role: string, name?: string, phone?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarmerUser | null>(null);
  const [consumerUser, setConsumerUser] = useState<ConsumerUser | null>(null);
  const [logisticsUser, setLogisticsUser] = useState<LogisticsOperator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore sessions on mount from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedFarmer = sessionStorage.getItem('agriflow_farmer_auth');
        if (storedFarmer) setUser(JSON.parse(storedFarmer));

        const storedConsumer = sessionStorage.getItem('agriflow_consumer_auth');
        if (storedConsumer) setConsumerUser(JSON.parse(storedConsumer));

        const storedLogistics = sessionStorage.getItem('agriflow_logistics_auth');
        if (storedLogistics) setLogisticsUser(JSON.parse(storedLogistics));
      } catch (e) {
        console.warn('Failed to parse saved sessions:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const refreshUserProfile = async () => {
    if (typeof window === 'undefined') return;
    try {
      const storedFarmer = sessionStorage.getItem('agriflow_farmer_auth');
      if (storedFarmer) setUser(JSON.parse(storedFarmer));

      const storedConsumer = sessionStorage.getItem('agriflow_consumer_auth');
      if (storedConsumer) setConsumerUser(JSON.parse(storedConsumer));

      const storedLogistics = sessionStorage.getItem('agriflow_logistics_auth');
      if (storedLogistics) setLogisticsUser(JSON.parse(storedLogistics));
    } catch {
      // Ignored
    }
  };

  // Farmer Auth
  const login = async (identifier: string, _pass: string): Promise<boolean> => {
    setIsLoading(true);
    const demoUser: FarmerUser = {
      ...demoFarmerUser,
      phone: identifier.includes('@') ? demoFarmerUser.phone : identifier,
      email: identifier.includes('@') ? identifier : demoFarmerUser.email,
    };
    setUser(demoUser);
    sessionStorage.setItem('agriflow_farmer_auth', JSON.stringify(demoUser));
    if (typeof window !== 'undefined' && !localStorage.getItem('agriflow_cached_lang')) {
      localStorage.setItem('agriflow_cached_lang', demoUser.preferredLanguage || 'en');
    }
    setIsLoading(false);
    return true;
  };

  const register = async (data: Partial<FarmerUser>): Promise<boolean> => {
    setIsLoading(true);
    const newUser: FarmerUser = {
      role: 'farmer',
      id: 'farmer-' + Math.random().toString(36).substring(2, 7),
      name: data.name || 'New Farmer',
      phone: data.phone || '',
      email: data.email || '',
      state: data.state || 'Telangana',
      district: data.district || 'Rangareddy',
      place: data.place || 'Chevella',
      preferredLanguage: data.preferredLanguage || 'en',
      farmName: data.farmName || '',
      location: data.location || `${data.place || 'Chevella'}, ${data.district || 'Rangareddy'}, ${data.state || 'Telangana'}`,
      farmerType: data.farmerType || 'Individual Farmer',
      farmSize: data.farmSize || '5 Acres',
      primaryCrops: data.primaryCrops || ['Tomato'],
      profileCompleted: true,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setUser(newUser);
    sessionStorage.setItem('agriflow_farmer_auth', JSON.stringify(newUser));
    if (typeof window !== 'undefined' && data.preferredLanguage) {
      localStorage.setItem('agriflow_cached_lang', data.preferredLanguage);
    }
    setIsLoading(false);
    return true;
  };

  const updateFarmerProfile = async (data: Partial<FarmerUser>): Promise<boolean> => {
    const updated = { ...(user || demoFarmerUser), ...data };
    setUser(updated);
    sessionStorage.setItem('agriflow_farmer_auth', JSON.stringify(updated));
    if (typeof window !== 'undefined' && data.preferredLanguage) {
      localStorage.setItem('agriflow_cached_lang', data.preferredLanguage);
    }
    return true;
  };

  const updateFarmerLanguage = async (lang: string): Promise<boolean> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agriflow_cached_lang', lang);
    }
    return updateFarmerProfile({ preferredLanguage: lang as any });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('agriflow_farmer_auth');
    router.push('/farmer');
  };

  // Consumer Auth
  const loginConsumer = async (identifier: string, _pass: string): Promise<boolean> => {
    setIsLoading(true);
    const demoUser: ConsumerUser = {
      ...demoConsumerUser,
      phone: identifier.includes('@') ? demoConsumerUser.phone : identifier,
      email: identifier.includes('@') ? identifier : demoConsumerUser.email,
    };
    setConsumerUser(demoUser);
    sessionStorage.setItem('agriflow_consumer_auth', JSON.stringify(demoUser));
    sessionStorage.setItem('agriflow_cached_lang', demoUser.preferredLanguage || 'ta');
    setIsLoading(false);
    return true;
  };

  const registerConsumer = async (data: Partial<ConsumerUser>): Promise<boolean> => {
    setIsLoading(true);
    const newUser: ConsumerUser = {
      role: 'consumer',
      id: 'consumer-' + Math.random().toString(36).substring(2, 7),
      name: data.name || 'New Buyer',
      phone: data.phone || '',
      email: data.email || '',
      location: data.location || 'Bowenpally Wholesale Corridor, Hyderabad',
      buyerType: data.buyerType || 'bulk-buyer',
      state: data.state || 'Telangana',
      district: data.district || 'Hyderabad',
      place: data.place || 'Bowenpally',
      preferredLanguage: data.preferredLanguage || 'en',
      profileCompleted: true,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setConsumerUser(newUser);
    sessionStorage.setItem('agriflow_consumer_auth', JSON.stringify(newUser));
    if (typeof window !== 'undefined' && data.preferredLanguage) {
      localStorage.setItem('agriflow_cached_lang', data.preferredLanguage);
    }
    setIsLoading(false);
    return true;
  };

  const updateConsumerProfile = async (data: Partial<ConsumerUser>): Promise<boolean> => {
    const updated = { ...(consumerUser || demoConsumerUser), ...data };
    setConsumerUser(updated);
    sessionStorage.setItem('agriflow_consumer_auth', JSON.stringify(updated));
    if (typeof window !== 'undefined' && data.preferredLanguage) {
      localStorage.setItem('agriflow_cached_lang', data.preferredLanguage);
    }
    return true;
  };

  const updateConsumerLanguage = async (lang: string): Promise<boolean> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agriflow_cached_lang', lang);
    }
    return updateConsumerProfile({ preferredLanguage: lang as any });
  };

  const logoutConsumer = () => {
    setConsumerUser(null);
    sessionStorage.removeItem('agriflow_consumer_auth');
    router.push('/consumer');
  };

  // Logistics Auth
  const loginLogistics = async (identifier: string, _pass: string): Promise<boolean> => {
    setIsLoading(true);
    const demoUser: LogisticsOperator = {
      ...demoLogisticsUser,
      phone: identifier.includes('@') ? demoLogisticsUser.phone : identifier,
      email: identifier.includes('@') ? identifier : demoLogisticsUser.email,
    };
    setLogisticsUser(demoUser);
    sessionStorage.setItem('agriflow_logistics_auth', JSON.stringify(demoUser));
    if (typeof window !== 'undefined' && !localStorage.getItem('agriflow_cached_lang')) {
      localStorage.setItem('agriflow_cached_lang', demoUser.preferredLanguage || 'en');
    }
    setIsLoading(false);
    return true;
  };

  const registerLogistics = async (data: Partial<LogisticsOperator>): Promise<boolean> => {
    setIsLoading(true);
    const newUser: LogisticsOperator = {
      role: 'logistics',
      id: 'logistics-' + Math.random().toString(36).substring(2, 7),
      name: data.name || 'New Logistics Operator',
      phone: data.phone || '',
      email: data.email || '',
      vehicleType: data.vehicleType || 'Tata 407 Reefer',
      vehicleNumber: data.vehicleNumber || 'TS 08 UB 4192',
      vehicleCapacityKg: data.vehicleCapacityKg || 3500,
      reeferEnabled: true,
      operatingRegion: data.operatingRegion || 'Telangana Corridor',
      preferredRoutes: data.preferredRoutes || ['Shadnagar -> Hyderabad'],
      state: data.state || 'Telangana',
      district: data.district || 'Rangareddy',
      place: data.place || 'Shamshabad Fleet Hub',
      preferredLanguage: data.preferredLanguage || 'en',
      profileCompleted: true,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setLogisticsUser(newUser);
    sessionStorage.setItem('agriflow_logistics_auth', JSON.stringify(newUser));
    if (typeof window !== 'undefined' && data.preferredLanguage) {
      localStorage.setItem('agriflow_cached_lang', data.preferredLanguage);
    }
    setIsLoading(false);
    return true;
  };

  const updateLogisticsProfile = async (data: Partial<LogisticsOperator>): Promise<boolean> => {
    const updated = { ...(logisticsUser || demoLogisticsUser), ...data };
    setLogisticsUser(updated);
    sessionStorage.setItem('agriflow_logistics_auth', JSON.stringify(updated));
    if (typeof window !== 'undefined' && data.preferredLanguage) {
      localStorage.setItem('agriflow_cached_lang', data.preferredLanguage);
    }
    return true;
  };

  const updateLogisticsLanguage = async (lang: string): Promise<boolean> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agriflow_cached_lang', lang);
    }
    return updateLogisticsProfile({ preferredLanguage: lang as any });
  };

  const logoutLogistics = () => {
    setLogisticsUser(null);
    sessionStorage.removeItem('agriflow_logistics_auth');
    router.push('/logistics');
  };

  // Demo Phone OTP Flow (100% Client-Side Demo)
  const sendPhoneOtp = async (phoneNumber: string, _appVerifier?: any): Promise<DemoConfirmationResult> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    setIsLoading(false);

    return {
      verificationId: 'demo-ver-' + Date.now(),
      confirm: async (verificationCode: string) => {
        if (verificationCode && verificationCode.length === 6) {
          return {
            user: {
              uid: 'demo-usr-' + Date.now(),
              phoneNumber,
            },
          };
        }
        throw new Error('Invalid OTP code. Please enter any 6-digit code (e.g. 123456).');
      },
    };
  };

  const verifyPhoneOtp = async (
    confirmationResult: DemoConfirmationResult,
    otpCode: string,
    role: 'farmer' | 'consumer' | 'logistics' | 'fpo',
    extraData?: { name?: string; phone?: string; state?: string; district?: string; place?: string; preferredLanguage?: any }
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await confirmationResult.confirm(otpCode);
      await loginWithDemo(role, extraData?.name, extraData?.phone);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated Google Sign-In
  const loginWithGoogle = async (role: 'farmer' | 'consumer' | 'logistics' | 'fpo'): Promise<{ profileCompleted: boolean }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    await loginWithDemo(role, 'Google User', '+91 98480 12345');
    setIsLoading(false);
    return { profileCompleted: true };
  };

  // 1-Click Instant Demo Login
  const loginWithDemo = async (role: string, name?: string, phone?: string): Promise<void> => {
    setIsLoading(true);
    if (role === 'farmer' || role === 'fpo') {
      const demoFarmer: FarmerUser = {
        ...demoFarmerUser,
        name: name || demoFarmerUser.name,
        phone: phone || demoFarmerUser.phone,
        farmerType: role === 'fpo' ? 'FPO' : 'Individual Farmer',
      };
      setUser(demoFarmer);
      sessionStorage.setItem('agriflow_farmer_auth', JSON.stringify(demoFarmer));
      if (typeof window !== 'undefined' && !localStorage.getItem('agriflow_cached_lang')) {
        localStorage.setItem('agriflow_cached_lang', 'en');
      }
    } else if (role === 'consumer') {
      const demoConsumer: ConsumerUser = {
        ...demoConsumerUser,
        name: name || demoConsumerUser.name,
        phone: phone || demoConsumerUser.phone,
      };
      setConsumerUser(demoConsumer);
      sessionStorage.setItem('agriflow_consumer_auth', JSON.stringify(demoConsumer));
      if (typeof window !== 'undefined' && !localStorage.getItem('agriflow_cached_lang')) {
        localStorage.setItem('agriflow_cached_lang', 'en');
      }
    } else if (role === 'logistics') {
      const demoLogistics: LogisticsOperator = {
        ...demoLogisticsUser,
        name: name || demoLogisticsUser.name,
        phone: phone || demoLogisticsUser.phone,
      };
      setLogisticsUser(demoLogistics);
      sessionStorage.setItem('agriflow_logistics_auth', JSON.stringify(demoLogistics));
      if (typeof window !== 'undefined' && !localStorage.getItem('agriflow_cached_lang')) {
        localStorage.setItem('agriflow_cached_lang', 'en');
      }
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        consumerUser,
        logisticsUser,
        isAuthenticated: !!user,
        isConsumerAuthenticated: !!consumerUser,
        isLogisticsAuthenticated: !!logisticsUser,
        isLoading,
        login,
        register,
        logout,
        updateFarmerLanguage,
        updateConsumerLanguage,
        updateLogisticsLanguage,
        updateFarmerProfile,
        updateConsumerProfile,
        updateLogisticsProfile,
        refreshUserProfile,
        loginConsumer,
        registerConsumer,
        logoutConsumer,
        loginLogistics,
        registerLogistics,
        logoutLogistics,
        sendPhoneOtp,
        verifyPhoneOtp,
        loginWithGoogle,
        loginWithDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
