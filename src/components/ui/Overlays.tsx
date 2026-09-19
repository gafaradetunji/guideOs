import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export function Drawer({ open, onClose, title, description, children, footer, width = 'max-w-xl' }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink-900/40 animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${width} h-full bg-white shadow-pop flex flex-col animate-slide-in-right`}>
        {(title || description) && (
          <div className="px-4 sm:px-6 py-4 border-b border-ink-200 flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              {title && <h2 className="text-base font-semibold text-ink-900">{title}</h2>}
              {description && <p className="text-xs text-ink-500 mt-0.5">{description}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close drawer">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>
        {footer && <div className="px-4 sm:px-6 py-4 border-t border-ink-200 bg-ink-50 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, description, children, footer, width = 'max-w-md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${width} max-h-[90dvh] overflow-y-auto scrollbar-thin bg-white rounded-2xl shadow-pop flex flex-col animate-slide-up`}>
        {(title || description) && (
          <div className="px-4 sm:px-6 py-4 border-b border-ink-200 flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              {title && <h2 className="text-base font-semibold text-ink-900">{title}</h2>}
              {description && <p className="text-xs text-ink-500 mt-0.5">{description}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="p-4 sm:p-6">{children}</div>
        {footer && <div className="px-4 sm:px-6 py-4 border-t border-ink-200 bg-ink-50 rounded-b-2xl flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
