import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ChefHat, Clock, Package, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, time_slots:slot_id(start_time, end_time), profiles:student_id(name)')
      .in('status', ['Placed', 'Preparing', 'Ready'])
      .order('created_at', { ascending: true });

    // Fetch order items for each order
    if (data) {
      const ordersWithItems = await Promise.all(data.map(async (order) => {
        const { data: items } = await supabase
          .from('order_items')
          .select('*, menu_items:menu_item_id(name)')
          .eq('order_id', order.id);
        return { ...order, items: items ?? [] };
      }));
      setOrders(ordersWithItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('staff-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (orderId: string, newStatus: 'Preparing' | 'Ready', studentId: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

    // Create notification
    const message = newStatus === 'Preparing' 
      ? 'Your order is being prepared! 🍳' 
      : 'Your order is ready for pickup! 🎉';
    await supabase.from('notifications').insert({
      student_id: studentId,
      order_id: orderId,
      message,
      type: newStatus === 'Ready' ? 'success' : 'info',
    });

    toast.success(`Order marked as ${newStatus}`);
    fetchOrders();
  };

  const statusIcon: Record<string, React.ReactNode> = {
    Placed: <Clock className="h-4 w-4" />,
    Preparing: <ChefHat className="h-4 w-4" />,
    Ready: <Package className="h-4 w-4" />,
  };

  const statusColor: Record<string, string> = {
    Placed: 'bg-warning text-warning-foreground',
    Preparing: 'bg-primary text-primary-foreground',
    Ready: 'bg-success text-success-foreground',
  };

  // Group by slot
  const grouped = orders.reduce((acc: Record<string, any[]>, order) => {
    const slotKey = `${order.time_slots?.start_time?.slice(0,5)} – ${order.time_slots?.end_time?.slice(0,5)}`;
    if (!acc[slotKey]) acc[slotKey] = [];
    acc[slotKey].push(order);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl font-bold">Kitchen Orders</h1>
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <ChefHat className="h-12 w-12 mb-3 opacity-30" />
            <p>No active orders</p>
          </div>
        ) : (
          Object.entries(grouped).map(([slot, slotOrders]) => (
            <div key={slot} className="mb-8">
              <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> {slot}
                <Badge variant="secondary">{(slotOrders as any[]).length} orders</Badge>
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(slotOrders as any[]).map((order: any) => (
                  <Card key={order.id} className="animate-fade-in">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-mono">#{order.id.slice(0,8).toUpperCase()}</CardTitle>
                        <Badge className={statusColor[order.status] ?? ''}>
                          {statusIcon[order.status]} <span className="ml-1">{order.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.profiles?.name}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        {order.items?.map((item: any) => (
                          <p key={item.id} className="text-sm">
                            {item.menu_items?.name} × {item.quantity}
                          </p>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Payment: {order.payment_mode}</p>
                      <div className="flex gap-2">
                        {order.status === 'Placed' && (
                          <Button size="sm" className="flex-1" onClick={() => updateStatus(order.id, 'Preparing', order.student_id)}>
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'Preparing' && (
                          <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground" onClick={() => updateStatus(order.id, 'Ready', order.student_id)}>
                            Mark Ready
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
