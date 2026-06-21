import React from 'react';
import { Menu, Activity, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleActivity: () => void;
}

export const Header = ({ toggleSidebar, toggleActivity }: HeaderProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu size={20} />
        </Button>
        <div className="hidden lg:block font-medium text-muted-foreground">
          Welcome back, <span className="text-foreground">{user?.name || 'User'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={toggleActivity} className="hidden lg:flex gap-2">
          <Activity size={16} />
          <span>Activity</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleActivity} className="lg:hidden">
          <Activity size={20} />
        </Button>
        
        <div className="flex items-center gap-3 border-l pl-4 ml-2">
          <Avatar src={user?.avatar} fallback={user?.name?.[0]} />
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="text-muted-foreground hover:text-destructive">
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};
