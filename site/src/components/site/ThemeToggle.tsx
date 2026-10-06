import { Button } from '@heroui/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

/** Light / dark switch. The choice is remembered; the default follows the system. */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onSystem = () => {
      let stored = 'system';
      try {
        stored = localStorage.getItem('tema') || 'system';
      } catch {}
      if (stored === 'system') apply(mq.matches);
    };
    mq.addEventListener('change', onSystem);
    return () => mq.removeEventListener('change', onSystem);
  }, []);

  const apply = (d: boolean) => {
    const r = document.documentElement;
    r.classList.remove('light', 'dark');
    r.classList.add(d ? 'dark' : 'light');
    r.dataset.theme = d ? 'dark' : 'light';
    setDark(d);
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      aria-label={dark ? 'Kalo në temën e çelët' : 'Kalo në temën e errët'}
      onPress={() => {
        const next = !dark;
        try {
          localStorage.setItem('tema', next ? 'dark' : 'light');
        } catch {}
        apply(next);
      }}
    >
      {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </Button>
  );
}
