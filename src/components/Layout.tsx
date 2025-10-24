import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Users, Clock, BarChart3, CheckSquare, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', icon: Shield, label: 'Dashboard' },
  { path: '/register', icon: UserPlus, label: 'Register' },
  { path: '/checkout', icon: Clock, label: 'Check Out' },
  { path: '/visitors', icon: Users, label: 'Visitor Log' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/pre-approval', icon: CheckSquare, label: 'Pre-Approval' },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-primary shadow-medium sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary-foreground" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary-foreground">
                  Smart VMS
                </h1>
                <p className="text-xs text-primary-foreground/90">
                  Visitor Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto space-x-1 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
