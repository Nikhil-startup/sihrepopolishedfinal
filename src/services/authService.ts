import { getStoredData, setStoredData } from "@/data/demoData";

export interface BackendUser {
  id: string;
  auth_provider: string;
  provider_user_id?: string;
  email?: string;
  name: string;
  full_name?: string;
  mobile_number?: string;
  phone?: string;
  role: 'farmer' | 'consumer' | 'logistics';
  state?: string;
  district?: string;
  area?: string;
  village_or_locality?: string;
  pincode?: string;
  full_address?: string;
  location?: string;
  profile_completed: boolean;
  profile_photo_url?: string;
  preferred_language?: string;
  profile_created_at?: string;
  created_at?: string;
  data_source: string;
}

export interface GoogleAuthResponse {
  authenticated: boolean;
  profileCompleted: boolean;
  profile_completed: boolean;
  isNewUser: boolean;
  user: BackendUser;
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  profileCompleted: boolean;
  profile_completed?: boolean;
  user: BackendUser;
  message?: string;
}

export interface GoogleAuthPayload {
  email: string;
  name?: string;
  sub?: string;
  picture?: string;
  credential?: string;
  requested_role?: string;
}

export interface UserProfileCreatePayload {
  user_id?: string;
  email?: string;
  full_name: string;
  mobile_number: string;
  state: string;
  district: string;
  area: string;
  village_or_locality?: string;
  pincode: string;
  full_address: string;
  role: string;
  preferred_language?: string;
}

export interface UserProfileUpdatePayload {
  full_name?: string;
  mobile_number?: string;
  state?: string;
  district?: string;
  area?: string;
  village_or_locality?: string;
  pincode?: string;
  full_address?: string;
  role?: string;
  preferred_language?: string;
  profile_photo_url?: string;
}

const PROFILES_STORAGE_KEY = 'agriflow_user_profiles_store';
const ACTIVE_PROFILE_KEY = 'agriflow_active_user_profile';

export const authService = {
  /**
   * Authenticate Google user using client-side local storage.
   * If an existing user with completed profile is found, restores session directly.
   * If new or incomplete, flags profileCompleted = false.
   */
  async authenticateGoogle(payload: GoogleAuthPayload): Promise<GoogleAuthResponse> {
    const profiles = getStoredData<Record<string, BackendUser>>(PROFILES_STORAGE_KEY, {});
    const emailKey = payload.email.toLowerCase().trim();
    const existing = profiles[emailKey];

    if (existing && existing.profile_completed) {
      setStoredData(ACTIVE_PROFILE_KEY, existing);
      return {
        authenticated: true,
        profileCompleted: true,
        profile_completed: true,
        isNewUser: false,
        user: existing,
        message: 'Welcome back!',
      };
    }

    const draftUser: BackendUser = {
      id: existing?.id || `usr_google_${Date.now().toString().slice(-6)}`,
      auth_provider: 'google',
      provider_user_id: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      full_name: payload.name || '',
      role: ((payload.requested_role as any) || 'farmer'),
      profile_completed: false,
      profile_photo_url: payload.picture,
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      data_source: 'CLIENT_STORAGE',
    };

    return {
      authenticated: true,
      profileCompleted: false,
      profile_completed: false,
      isNewUser: true,
      user: draftUser,
      message: 'Google authentication verified. Please complete your mandatory profile.',
    };
  },

  /**
   * Retrieve authoritative user profile from client storage.
   */
  async getProfile(userId?: string, email?: string): Promise<ProfileResponse> {
    const profiles = getStoredData<Record<string, BackendUser>>(PROFILES_STORAGE_KEY, {});
    let matched: BackendUser | undefined = undefined;

    if (email) {
      matched = profiles[email.toLowerCase().trim()];
    }
    if (!matched && userId) {
      matched = Object.values(profiles).find((u) => u.id === userId);
    }
    if (!matched) {
      const active = getStoredData<BackendUser | null>(ACTIVE_PROFILE_KEY, null);
      if (active && (!userId || active.id === userId)) {
        matched = active;
      }
    }

    if (matched) {
      return {
        success: true,
        profileCompleted: Boolean(matched.profile_completed),
        profile_completed: Boolean(matched.profile_completed),
        user: matched,
      };
    }

    // Default fallback
    const fallback: BackendUser = {
      id: userId || 'usr_demo_01',
      auth_provider: 'google',
      name: 'Ramesh Reddy',
      full_name: 'Ramesh Reddy',
      mobile_number: '9848012345',
      phone: '9848012345',
      role: 'farmer',
      state: 'Telangana',
      district: 'Rangareddy',
      area: 'Shadnagar',
      village_or_locality: 'Farooqnagar',
      pincode: '509216',
      full_address: 'Plot 14, Agri Cluster Zone, Shadnagar',
      location: 'Shadnagar, Rangareddy, Telangana',
      profile_completed: true,
      data_source: 'CLIENT_STORAGE',
    };

    return {
      success: true,
      profileCompleted: true,
      profile_completed: true,
      user: fallback,
    };
  },

  /**
   * Save mandatory profile creation to client storage.
   */
  async saveProfile(payload: UserProfileCreatePayload): Promise<ProfileResponse> {
    const profiles = getStoredData<Record<string, BackendUser>>(PROFILES_STORAGE_KEY, {});
    const emailKey = (payload.email || `user_${Date.now()}@agriflow.local`).toLowerCase().trim();

    const role = (payload.role || 'farmer') as 'farmer' | 'consumer' | 'logistics';
    const savedUser: BackendUser = {
      id: payload.user_id || `usr_${Date.now().toString().slice(-6)}`,
      auth_provider: 'google',
      email: payload.email,
      name: payload.full_name,
      full_name: payload.full_name,
      mobile_number: payload.mobile_number,
      phone: payload.mobile_number,
      role,
      state: payload.state,
      district: payload.district,
      area: payload.area,
      village_or_locality: payload.village_or_locality || payload.area,
      pincode: payload.pincode,
      full_address: payload.full_address,
      location: `${payload.area}, ${payload.district}, ${payload.state}`,
      profile_completed: true,
      preferred_language: payload.preferred_language || 'en',
      profile_created_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      data_source: 'CLIENT_STORAGE',
    };

    profiles[emailKey] = savedUser;
    setStoredData(PROFILES_STORAGE_KEY, profiles);
    setStoredData(ACTIVE_PROFILE_KEY, savedUser);

    return {
      success: true,
      profileCompleted: true,
      profile_completed: true,
      user: savedUser,
      message: 'Profile saved successfully.',
    };
  },

  /**
   * Update existing profile in client storage.
   */
  async updateProfile(payload: UserProfileUpdatePayload, userId?: string): Promise<ProfileResponse> {
    const profiles = getStoredData<Record<string, BackendUser>>(PROFILES_STORAGE_KEY, {});
    const active = getStoredData<BackendUser | null>(ACTIVE_PROFILE_KEY, null);

    let target: BackendUser | undefined = undefined;
    let targetKey: string | undefined = undefined;

    for (const [key, u] of Object.entries(profiles)) {
      if (u.id === userId || (active && u.id === active.id)) {
        target = u;
        targetKey = key;
        break;
      }
    }

    if (!target) {
      target = active || {
        id: userId || 'usr_demo_01',
        auth_provider: 'google',
        name: payload.full_name || 'AgriFlow User',
        role: (payload.role as any) || 'farmer',
        profile_completed: true,
        data_source: 'CLIENT_STORAGE',
      };
      targetKey = target.email ? target.email.toLowerCase().trim() : 'active_user';
    }

    const updatedUser: BackendUser = {
      ...target,
      ...payload,
      name: payload.full_name || target.name,
      full_name: payload.full_name || target.full_name,
      role: (payload.role as any) || target.role,
      mobile_number: payload.mobile_number || target.mobile_number,
      phone: payload.mobile_number || target.phone,
      location: payload.area || payload.district || payload.state 
        ? `${payload.area || target.area || ''}, ${payload.district || target.district || ''}, ${payload.state || target.state || ''}`
        : target.location,
    };

    profiles[targetKey!] = updatedUser;
    setStoredData(PROFILES_STORAGE_KEY, profiles);
    setStoredData(ACTIVE_PROFILE_KEY, updatedUser);

    return {
      success: true,
      profileCompleted: true,
      profile_completed: true,
      user: updatedUser,
      message: 'Profile updated successfully.',
    };
  },
};
