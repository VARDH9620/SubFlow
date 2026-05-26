import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, resolved, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = [
    { value: 'light' as const, label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark' as const, label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system' as const, label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  if (compact) {
    return (
      <button
        onClick={() => {
          if (resolved === 'dark') setTheme('light');
          else setTheme('dark');
        }}
        className="p-2 rounded-lg hover:bg-muted dark:hover:bg-gray-800 transition-colors"
        title={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolved === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-muted dark:hover:bg-gray-800 transition-colors"
        title="Toggle theme"
      >
        {resolved === 'dark' ? (
          <Moon className="w-5 h-5 text-blue-300" />
        ) : (
          <Sun className="w-5 h-5 text-amber-500" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-card rounded-xl shadow-xl border border-border py-1 z-50 animate-scaleIn">
            <p className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/80 dark:text-slate-400 uppercase tracking-wider">Theme</p>
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setTheme(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  theme === opt.value
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary/90 dark:text-primary-400'
                    : 'text-foreground/90 hover:bg-muted/50 dark:hover:bg-slate-700'
                }`}
              >
                {opt.icon}
                <span className="flex-1 text-left">{opt.label}</span>
                {theme === opt.value && (
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
