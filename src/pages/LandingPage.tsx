import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Clock, QrCode, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  if (user && role) {
    navigate(`/${role}`, { replace: true });
  }

  const benefits = [
    { icon: Clock, title: 'Skip the Queue', desc: 'Pre-order and pick up at your chosen time.' },
    { icon: QrCode, title: 'Quick Pickup', desc: 'Flash your QR code. Grab your food. Go.' },
    { icon: Star, title: 'Rate & Review', desc: 'Help shape a better menu with feedback.' },
  ];

  const demoAccounts = [
    { role: 'Student', email: 'student@college.edu', password: 'student123' },
    { role: 'Staff', email: 'staff@college.edu', password: 'staff123' },
    { role: 'Cashier', email: 'cashier@college.edu', password: 'cashier123' },
    { role: 'Admin', email: 'admin@college.edu', password: 'admin123' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="container flex flex-col items-center py-28 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Canteen<span className="text-primary">Go</span>
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Order ahead. Skip the queue.
          </p>
          <div className="mt-8 flex gap-3">
            <Button size="lg" onClick={() => navigate('/login')} className="gap-2 rounded-full px-6">
              Login <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/register')} className="rounded-full px-6">
              Register
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <b.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-heading text-base font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="container pb-24">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">
            Demo Credentials
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {demoAccounts.map((acc) => (
              <div key={acc.role} className="rounded-lg border border-border p-3">
                <p className="text-sm font-semibold text-primary">{acc.role}</p>
                <p className="text-xs text-muted-foreground">{acc.email}</p>
                <p className="text-xs text-muted-foreground">Pass: {acc.password}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
