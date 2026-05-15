import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Enums } from '@/integrations/supabase/types';

type AppRole = Enums<'app_role'>;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profile: { name: string; email: string; wallet_balance: number; dept: string | null; phone: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<AuthContextType['profile']>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    return data?.role ?? null;
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('name, email, wallet_balance, dept, phone')
      .eq('user_id', userId)
      .maybeSingle();
    return data ?? null;
  }, []);

  const createDefaultProfileAndRole = useCallback(async (user: User) => {
    // Check if profile exists
    const existingProfile = await fetchProfile(user.id);
    if (!existingProfile) {
      // Create profile from user metadata (for OAuth users)
      const name = user.user_metadata?.full_name || user.user_metadata?.name || 'Unknown';
      const email = user.email || '';
      
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: user.id,
        name,
        email,
        wallet_balance: 500.00,
      });
      if (profileError) {
        console.error('Failed to create profile:', profileError);
      }
    }

    // Check if role exists
    const existingRole = await fetchRole(user.id);
    if (!existingRole) {
      // Default to student role
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: user.id,
        role: 'student',
      });
      if (roleError) {
        console.error('Failed to create role:', roleError);
      }
    }
  }, [fetchProfile, fetchRole]);

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Create default profile and role if they don't exist
        await createDefaultProfileAndRole(session.user);
        
        const [r, p] = await Promise.all([
          fetchRole(session.user.id),
          fetchProfile(session.user.id),
        ]);
        setRole(r);
        setProfile(p);
      } else {
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Create default profile and role if they don't exist
        await createDefaultProfileAndRole(session.user);
        
        const [r, p] = await Promise.all([
          fetchRole(session.user.id),
          fetchProfile(session.user.id),
        ]);
        setRole(r);
        setProfile(p);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [createDefaultProfileAndRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
