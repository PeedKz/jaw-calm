import { Home, TrendingUp, Award, Settings } from 'lucide-react';
import { NavLink } from './NavLink';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';

export const BottomNav = () => {
  const { language } = useApp();

  const navItems = [
    { to: '/', icon: Home, label: t('dashboard', language) },
    { to: '/progress', icon: TrendingUp, label: t('progress', language) },
    { to: '/rewards', icon: Award, label: t('rewards', language) },
    { to: '/settings', icon: Settings, label: t('settings', language) },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-3 safe-area-inset-bottom">
      <div className="max-w-md mx-auto flex items-center justify-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-smooth text-muted-foreground flex-1 min-w-0"
            activeClassName="text-primary bg-primary/10"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-[10px] font-medium truncate max-w-full text-center">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
