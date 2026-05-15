import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, ShoppingCart, Bell, UtensilsCrossed, Moon, Sun } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { profile, role, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const roleColors: Record<string, string> = {
    student: 'bg-secondary text-secondary-foreground',
    staff: 'bg-success text-success-foreground',
    cashier: 'bg-primary text-primary-foreground',
    admin: 'bg-destructive text-destructive-foreground',
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg font-bold">CanteenGo</span>
        </Link>

        <div className="flex items-center gap-2">
          {role === 'student' && (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                ₹{profile?.wallet_balance?.toFixed(2)}
              </span>
              <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate('/notifications')}>
                <Bell className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <span className="hidden text-sm sm:inline">{profile?.name}</span>
          {role && <Badge className={roleColors[role]} variant="secondary">{role}</Badge>}
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
