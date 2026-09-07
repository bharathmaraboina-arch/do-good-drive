'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from './supabase/client';
import { UserProfile, UserRole } from './types';

interface AuthContextType {
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isSupabaseActive: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  setDemoRole: (role: UserRole) => void;
  saveProfile: (data: Partial<UserProfile>) => void;
}

const DEFAULT_DEMO_PROFILES: Record<UserRole, UserProfile> = {
  volunteer: {
    id: 'vol-demo-1',
    email: 'sarah.volunteer@example.org',
    fullName: 'Sarah Jenkins',
    role: 'volunteer',
    bio: 'Environmental educator & volunteer event coordinator passionate about urban sustainability and youth mentorship.',
    location: 'Seattle, WA',
    causes: ['Environment', 'Education', 'Youth Empowerment'],
    verified: true,
    createdAt: '2024-03-01',
  },
  ngo: {
    id: 'ngo-demo-1',
    email: 'director@greencanopy.org',
    fullName: 'Marcus Vance',
    organizationName: 'GreenCanopy Initiative',
    role: 'ngo',
    bio: 'Regional non-profit organization dedicated to native urban forestry, climate mitigation, and community park revitalizations.',
    location: 'Portland, OR',
    website: 'https://greencanopy.example.org',
    causes: ['Environment', 'Conservation', 'Climate Action'],
    verified: true,
    createdAt: '2023-01-15',
  },
  corporate: {
    id: 'corp-demo-1',
    email: 'elena.rostova@apexcapital.example.com',
    fullName: 'Elena Rostova',
    organizationName: 'Apex Capital Advisors',
    role: 'corporate',
    bio: 'Head of Corporate Social Responsibility & Community Engagement, directing pro-bono financial mentoring and community grants.',
    location: 'New York, NY',
    website: 'https://apexcapital.example.com/csr',
    causes: ['Governance & Capacity', 'Education', 'Community Reinvestment'],
    verified: true,
    createdAt: '2022-09-10',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseActive = isSupabaseConfigured();

  useEffect(() => {
    async function loadAuth() {
      if (isSupabaseActive) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email });
            const savedProfile = localStorage.getItem('dgd_profile');
            if (savedProfile) {
              setProfile(JSON.parse(savedProfile));
            }
          }
        } catch (e) {
          console.error('Supabase session load error:', e);
        }
      } else {
        // Dev / Demo mode fallback
        const savedRole = (localStorage.getItem('dgd_demo_role') as UserRole) || 'volunteer';
        const savedProfile = localStorage.getItem('dgd_profile');
        if (savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile);
            setProfile(parsed);
            setUser({ id: parsed.id, email: parsed.email });
          } catch {
            setProfile(DEFAULT_DEMO_PROFILES[savedRole]);
            setUser({ id: DEFAULT_DEMO_PROFILES[savedRole].id, email: DEFAULT_DEMO_PROFILES[savedRole].email });
          }
        } else {
          setProfile(DEFAULT_DEMO_PROFILES[savedRole]);
          setUser({ id: DEFAULT_DEMO_PROFILES[savedRole].id, email: DEFAULT_DEMO_PROFILES[savedRole].email });
        }
      }
      setIsLoading(false);
    }

    loadAuth();
  }, [isSupabaseActive, supabase]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    if (isSupabaseActive) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }
      setUser({ id: data.user.id, email: data.user.email });
      setIsLoading(false);
      return {};
    } else {
      // Demo simulated login
      const dummyProfile: UserProfile = {
        id: 'user-' + Date.now(),
        email,
        fullName: email.split('@')[0] || 'Community Member',
        role: 'volunteer',
        causes: ['Community Impact'],
        createdAt: new Date().toISOString(),
      };
      setUser({ id: dummyProfile.id, email });
      setProfile(dummyProfile);
      localStorage.setItem('dgd_profile', JSON.stringify(dummyProfile));
      localStorage.setItem('dgd_demo_role', 'volunteer');
      setIsLoading(false);
      return {};
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    if (isSupabaseActive) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
      }
      setIsLoading(false);
      return {};
    } else {
      // Demo simulated signup
      const newProfile: UserProfile = {
        id: 'user-' + Date.now(),
        email,
        fullName,
        role: 'volunteer',
        causes: [],
        createdAt: new Date().toISOString(),
      };
      setUser({ id: newProfile.id, email });
      setProfile(newProfile);
      localStorage.setItem('dgd_profile', JSON.stringify(newProfile));
      setIsLoading(false);
      return {};
    }
  };

  const signOut = async () => {
    if (isSupabaseActive) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('dgd_profile');
    router.push('/');
  };

  const setDemoRole = (newRole: UserRole) => {
    const demoProfile = DEFAULT_DEMO_PROFILES[newRole];
    setProfile(demoProfile);
    setUser({ id: demoProfile.id, email: demoProfile.email });
    localStorage.setItem('dgd_demo_role', newRole);
    localStorage.setItem('dgd_profile', JSON.stringify(demoProfile));
    router.push(`/${newRole}`);
  };

  const saveProfile = (updatedData: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...(prev || DEFAULT_DEMO_PROFILES.volunteer), ...updatedData };
      localStorage.setItem('dgd_profile', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role ?? null,
        isLoading,
        isSupabaseActive,
        signIn,
        signUp,
        signOut,
        setDemoRole,
        saveProfile,
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
