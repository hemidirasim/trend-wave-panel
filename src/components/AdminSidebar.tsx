import { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText, 
  HelpCircle, 
  Menu,
  X,
  LogOut,
  Package,
  ShoppingCart
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const AdminSidebar = ({ collapsed, setCollapsed }: AdminSidebarProps) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Sifariş Et',
      href: '/order',
      icon: ShoppingCart,
      exact: false
    },
    {
      name: 'Xidmətlər',
      href: '/admin/services',
      icon: Package,
      exact: false
    },
    {
      name: 'Bloq',
      href: '/admin/blog',
      icon: FileText,
      exact: false
    },
    {
      name: 'FAQ',
      href: '/admin/faq',
      icon: HelpCircle,
      exact: false
    },
    {
      name: 'İstifadəçilər',
      href: '/admin/users',
      icon: Users,
      exact: false
    },
    {
      name: 'Parametrlər',
      href: '/admin/settings',
      icon: Settings,
      exact: false
    }
  ];

  function isActive(href: string, exact: boolean) {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 z-50 h-full bg-background border-r transition-all duration-300
        ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'w-64'}
        lg:static lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">Admin Panel</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${active 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={`w-full justify-start ${collapsed ? 'px-3' : ''}`}
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-3">Çıxış</span>}
          </Button>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setCollapsed(false)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
};
