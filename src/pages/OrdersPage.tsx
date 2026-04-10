import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, time_slots:slot_id(start_time, end_time)')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const statusColor: Record<string, string> = {
    Placed: 'bg-warning text-warning-foreground',
    Preparing: 'bg-primary text-primary-foreground',
    Ready: 'bg-success text-success-foreground',
    Collected: 'bg-muted text-muted-foreground',
    Cancelled: 'bg-destructive text-destructive-foreground',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-6">
        <h1 className="font-heading text-2xl font-bold mb-4">Order History</h1>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mb-3 opacity-30" />
            <p>No orders yet</p>
            <Button className="mt-3" onClick={() => navigate('/student')}>Browse Menu</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <Card key={order.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => navigate(`/order/${order.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.time_slots?.start_time?.slice(0,5)} – {order.time_slots?.end_time?.slice(0,5)}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-heading font-bold text-primary">₹{order.total_amount}</p>
                    <Badge className={statusColor[order.status] ?? ''}>{order.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
