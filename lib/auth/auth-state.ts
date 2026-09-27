'use client';

import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface SynroUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  shift: string;
  avatarColor: string;
  isDemo?: boolean;
}

export const DEMO_OPERATORS: Record<string, SynroUser> = {
  dispatcher: {
    id: 'OP-8492',
    name: 'Salung Prastyo',
    email: 'salung.prastyo@synro.ai',
    role: 'Senior Fleet Controller',
    initials: 'SP',
    shift: 'Shift 01 (Active)',
    avatarColor: 'from-blue-600 to-indigo-800',
    isDemo: true,
  },
  tech: {
    id: 'OP-3910',
    name: 'Elena Rostova',
    email: 'elena.rostova@synro.ai',
    role: 'Lead AMR Hardware Tech',
    initials: 'ER',
    shift: 'Shift 01 (Diagnostics)',
    avatarColor: 'from-amber-600 to-rose-700',
    isDemo: true,
  },
  admin: {
    id: 'OP-1001',
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@synro.ai',
    role: 'Autonomous Systems Director',
    initials: 'AT',
    shift: 'Mesh Oversight (Full Root)',
    avatarColor: 'from-emerald-600 to-teal-800',
    isDemo: true,
  },
};

const STORAGE_KEY = 'synro_active_operator_session';

export function getStoredUser(): SynroUser {
  if (typeof window === 'undefined') {
    return DEMO_OPERATORS.dispatcher;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse stored auth user', e);
  }

  return DEMO_OPERATORS.dispatcher;
}

export function setStoredUser(user: SynroUser | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  // Dispatch custom storage event for sync across components in the same window
  window.dispatchEvent(new CustomEvent('synro-auth-change', { detail: user }));
}

export async function authenticateOperator(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: SynroUser; error?: string }> {
  // 1. Try Supabase Auth if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (!error && data.user) {
        const synUser: SynroUser = {
          id: data.user.id.slice(0, 8).toUpperCase(),
          name: data.user.user_metadata?.full_name || email.split('@')[0] || 'Mesh Operator',
          email: data.user.email || email,
          role: data.user.user_metadata?.role || 'Fleet Operator',
          initials: (email[0] || 'O').toUpperCase(),
          shift: 'Shift 01 (Active)',
          avatarColor: 'from-blue-600 to-indigo-800',
          isDemo: false,
        };
        setStoredUser(synUser);
        return { success: true, user: synUser };
      }
      if (error && !email.includes('synro.ai')) {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      console.warn('Supabase auth attempt failed, falling back to local mesh authentication', err);
    }
  }

  // 2. Demo & local mesh simulation credentials matching
  const lower = email.toLowerCase().trim();
  let matched = Object.values(DEMO_OPERATORS).find(
    (o) => o.email.toLowerCase() === lower
  );

  if (!matched) {
    // Dynamic operator creation for custom email
    const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePart
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Authorized Operator';

    const initials = formattedName
      .split(' ')
      .slice(0, 2)
      .map((w) => w.charAt(0))
      .join('')
      .toUpperCase() || 'OP';

    matched = {
      id: `OP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formattedName,
      email: email,
      role: 'Fleet Controller',
      initials,
      shift: 'Shift 01 (Active)',
      avatarColor: 'from-indigo-600 to-purple-800',
      isDemo: true,
    };
  }

  setStoredUser(matched);
  return { success: true, user: matched };
}

export function logoutOperator() {
  if (isSupabaseConfigured && supabase) {
    try {
      supabase.auth.signOut();
    } catch (e) {
      console.warn(e);
    }
  }
  setStoredUser(null);
}
