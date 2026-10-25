import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Command, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/auth/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgot';

export function LoginPage() {
  const { signIn, demoEmail, demoPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';
  const notice = (location.state as { notice?: string } | null)?.notice;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage
      mode="login"
      eyebrow="GuideAI product demo"
      title="Explore GuideOS with a demo account"
      description="This is a fully local demo environment built to show you GuideAI capabilities. No real user account is required."
    >
      <div className="mb-6 rounded-2xl border-2 border-brand-300 bg-gradient-to-br from-brand-50 via-white to-blue-50 p-4 shadow-sm shadow-brand-900/5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
              <KeyRound className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-ink-900">Demo access</p>
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-800">Recommended</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-ink-600">Use the sample account below to see the product in action. These are demo credentials, not a personal user account.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Credential label="Email" value={demoEmail} />
            <Credential label="Password" value={demoPassword} />
          </div>
          <button type="button" onClick={() => { setEmail(demoEmail); setPassword(demoPassword); }} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 text-xs font-semibold text-white shadow-sm shadow-brand-600/25 transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2">
            Use demo credentials <ArrowRight className="h-3.5 w-3.5" />
          </button>
      </div>
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">
        <p className="font-semibold">Test environment only</p>
        <p className="mt-0.5 text-amber-800">All dashboard records are fictional test data. This is not a production dashboard and no real business data is connected.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-800">{notice}</p>}
        <Field label="Work email" icon={<Mail className="h-4 w-4" />}>
          <input value={email} onChange={event => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@company.com" required className="auth-input" />
        </Field>
        <Field label="Password" icon={<LockKeyhole className="h-4 w-4" />}>
          <div className="relative">
            <input value={password} onChange={event => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required className="auth-input pr-11" />
            <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-ink-400 hover:text-ink-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" size="lg" className="w-full" loading={loading} rightIcon={<ArrowRight className="h-4 w-4" />}>Sign in</Button>
      </form>
    </AuthPage>
  );
}

function Credential({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-brand-200/80 bg-white/80 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">{label}</p>
      <p className="mt-1 truncate font-mono text-xs font-medium text-ink-900">{value}</p>
    </div>
  );
}

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signUp(fullName, email, password);
      if (result.needsEmailConfirmation) {
        navigate('/login', { replace: true, state: { notice: 'Check your email to confirm your account before signing in.' } });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage mode="signup" eyebrow="Start operating clearly" title="Create your GuideOS workspace" description="Bring your teams, systems, and daily decisions into one operating layer.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" icon={<UserRound className="h-4 w-4" />}>
          <input value={fullName} onChange={event => setFullName(event.target.value)} type="text" autoComplete="name" placeholder="Ada Okafor" required minLength={2} className="auth-input" />
        </Field>
        <Field label="Work email" icon={<Mail className="h-4 w-4" />}>
          <input value={email} onChange={event => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@company.com" required className="auth-input" />
        </Field>
        <Field label="Password" icon={<LockKeyhole className="h-4 w-4" />}>
          <div className="relative">
            <input value={password} onChange={event => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters" required minLength={8} className="auth-input pr-11" />
            <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-ink-400 hover:text-ink-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <p className="text-[11px] leading-5 text-ink-500">By creating an account, you agree to keep workspace data private and use GuideOS responsibly.</p>
        <Button type="submit" size="lg" className="w-full" loading={loading} rightIcon={<ArrowRight className="h-4 w-4" />}>Create workspace</Button>
      </form>
      <AuthSwitch prompt="Already have an account?" action="Sign in" to="/login" />
    </AuthPage>
  );
}

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send the reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage mode="forgot" eyebrow="Account recovery" title="Reset your password" description="We’ll help you get back into your workspace securely.">
      {sent ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-semibold">Check your inbox</p>
          <p className="mt-1 text-xs leading-5">This local demo does not send email. Return to sign in and use your local account or the demo credentials.</p>
          <Link to="/login" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950">Back to sign in <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Work email" icon={<Mail className="h-4 w-4" />}>
            <input value={email} onChange={event => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@company.com" required className="auth-input" />
          </Field>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" size="lg" className="w-full" loading={loading} rightIcon={<ArrowRight className="h-4 w-4" />}>Send reset link</Button>
        </form>
      )}
      {!sent && <Link to="/login" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-ink-600 hover:text-ink-900"><ChevronLeft className="h-3.5 w-3.5" /> Back to sign in</Link>}
    </AuthPage>
  );
}

export function UpdatePasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      setUpdated(true);
      window.setTimeout(() => navigate('/', { replace: true }), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update your password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage mode="forgot" eyebrow="Account recovery" title="Choose a new password" description="Use a strong password you do not reuse elsewhere.">
      {updated ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><p className="font-semibold">Password updated</p><p className="mt-1 text-xs">Taking you back to your workspace…</p></div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="New password" icon={<LockKeyhole className="h-4 w-4" />}>
            <input value={password} onChange={event => setPassword(event.target.value)} type="password" autoComplete="new-password" placeholder="At least 8 characters" required minLength={8} className="auth-input" />
          </Field>
          <Field label="Confirm new password" icon={<LockKeyhole className="h-4 w-4" />}>
            <input value={confirmation} onChange={event => setConfirmation(event.target.value)} type="password" autoComplete="new-password" placeholder="Repeat your new password" required minLength={8} className="auth-input" />
          </Field>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" size="lg" className="w-full" loading={loading}>Update password</Button>
        </form>
      )}
    </AuthPage>
  );
}

function AuthPage({ mode, eyebrow, title, description, children }: { mode: AuthMode; eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50 grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
      <div className="hidden lg:flex relative overflow-hidden bg-[linear-gradient(145deg,#09111f_0%,#12254a_55%,#1d4ed8_145%)] p-12 xl:p-16 text-white">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full border border-white/10" />
        <div className="relative z-10 flex max-w-xl flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 shadow-lg shadow-black/20"><Command className="h-5 w-5" /></div>
              <div><p className="text-sm font-semibold tracking-wide">GuideOS</p><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-blue-200">Business operating system</p></div>
            </div>
            <div className="mt-24 xl:mt-32">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-blue-200">GuideAI / Product demo</p>
              <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.03em] xl:text-5xl">The operating layer for teams that keep moving.</h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-blue-100/75">GuideOS connects the work behind the work — people, money, customers, and decisions — so your business has a reliable source of truth.</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs text-blue-100/70"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Secure workspace access</span><span className="h-1 w-1 rounded-full bg-blue-200/50" /><span>Built for modern operations</span></div>
        </div>
      </div>
      <main className="flex min-h-screen items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-[390px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white"><Command className="h-4 w-4" /></div><div><p className="text-sm font-semibold text-ink-900">GuideOS</p><p className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">Control plane</p></div></div>
          <div className="mb-7"><p className="tech-label text-brand-700">{eyebrow}</p><h1 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-ink-900">{title}</h1><p className="mt-2 text-sm leading-6 text-ink-500">{description}</p></div>
          {children}
          {mode === 'login' && <p className="mt-8 text-center text-[11px] leading-5 text-ink-400">Demo environment only · fictional test data · not a production dashboard</p>}
        </div>
      </main>
    </div>
  );
}

function Field({ label, icon, action, children }: { label: string; icon: ReactNode; action?: ReactNode; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-700"><span className="inline-flex items-center gap-1.5"><span className="text-ink-400">{icon}</span>{label}</span>{action}</span>{children}</label>;
}

function ErrorMessage({ children }: { children: ReactNode }) {
  return <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700">{children}</p>;
}

function AuthSwitch({ prompt, action, to }: { prompt: string; action: string; to: string }) {
  return <p className="mt-7 text-center text-xs text-ink-500">{prompt}{' '}<Link to={to} className="font-semibold text-brand-700 hover:text-brand-900">{action}</Link></p>;
}
