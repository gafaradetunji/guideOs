import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const SESSION_KEY = 'guideos-auth-session-v1';
const USERS_KEY = 'guideos-auth-users-v1';
const DEMO_EMAIL = 'demo@guideos.local';
const DEMO_PASSWORD = 'demo1234';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  demoEmail: string;
  demoPassword: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readLocalUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as AuthUser : null;
  } catch {
    return null;
  }
}

function writeLocalUser(user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(SESSION_KEY);
}

function readLocalUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) as StoredUser[] : [];
  } catch {
    return [];
  }
}

function writeLocalUsers(users: StoredUser[]) {
  if (typeof window !== 'undefined') window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readLocalUser());
  const loading = false;

  const signIn = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const localUsers = readLocalUsers();
    const demoMatches = normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD;
    const matchingUser = localUsers.find(candidate => candidate.email === normalizedEmail && candidate.password === password);
    if (!demoMatches && !matchingUser) throw new Error('Email or password is incorrect.');
    const nextUser = matchingUser ?? {
      id: 'demo-user',
      email: DEMO_EMAIL,
      fullName: 'Demo Administrator',
      password: DEMO_PASSWORD,
    };
    const sessionUser = { id: nextUser.id, email: nextUser.email, fullName: nextUser.fullName };
    writeLocalUser(sessionUser);
    setUser(sessionUser);
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const localUsers = readLocalUsers();
    if (localUsers.some(candidate => candidate.email === normalizedEmail) || normalizedEmail === DEMO_EMAIL) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: StoredUser = {
      id: `local-${Date.now()}`,
      email: normalizedEmail,
      fullName: fullName.trim(),
      password,
    };
    writeLocalUsers([...localUsers, newUser]);
    const sessionUser = { id: newUser.id, email: newUser.email, fullName: newUser.fullName };
    writeLocalUser(sessionUser);
    setUser(sessionUser);
    return { needsEmailConfirmation: false };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    // Local mode has no email service. Keep the action intentionally local and
    // let the recovery screen explain that no message is sent.
    void email.trim().toLowerCase();
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const currentUser = readLocalUser();
    if (!currentUser) throw new Error('Your recovery session has expired. Please sign in again.');
    const localUsers = readLocalUsers();
    writeLocalUsers(localUsers.map(candidate => candidate.id === currentUser.id ? { ...candidate, password } : candidate));
  }, []);

  const signOut = useCallback(async () => {
    writeLocalUser(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    demoEmail: DEMO_EMAIL,
    demoPassword: DEMO_PASSWORD,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    signOut,
  }), [loading, resetPassword, signIn, signOut, signUp, updatePassword, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The hook intentionally lives beside the provider so auth state has one private context.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
