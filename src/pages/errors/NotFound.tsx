import { useLocation, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6">
      <p className="text-5xl sm:text-6xl font-bold text-ink-200">404</p>
      <p className="text-sm font-medium text-ink-900 mt-2">Page not found</p>
      <p className="text-xs text-ink-500 mt-1">
        The route <code className="font-mono break-all">{pathname}</code> doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
