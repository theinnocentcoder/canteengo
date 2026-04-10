import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, CheckCircle, Clock, ChefHat, Package, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const statusSteps = ['Placed', 'Preparing', 'Ready', 'Collected'] as const;
const statusIcons: Record<string, React.ReactNode> = {
  Placed: <Clock className="h-5 w-5" />,
  Preparing: <ChefHat className="h-5 w-5" />,
  Ready: <Package className="h-5 w-5" />,
  Collected: <CheckCircle className="h-5 w-5" />,
  Cancelled: <XCircle className="h-5 w-5" />,
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [slot, setSlot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!id) return;
    const { data: orderData } = await supabase.from('orders').select('*').eq('id', id).single();
    if (orderData) {
      setOrder(orderData);
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*, menu_items:menu_item_id(name)')
        .eq('order_id', id);
      setOrderItems(itemsData ?? []);
      const { data: slotData } = await supabase.from('time_slots').select('*').eq('id', orderData.slot_id).single();
      setSlot(slotData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`order-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` }, (payload) => {
        setOrder(payload.new);
        toast.info(`Order status: ${payload.new.status}`);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const canCancel = () => {
    if (!order || !slot || order.status !== 'Placed') return false;
    const now = new Date();
    const [h, m] = slot.start_time.split(':').map(Number);
    const slotStart = new Date();
    slotStart.setHours(h, m, 0, 0);
    return (slotStart.getTime() - now.getTime()) > 10 * 60 * 1000;
  };

  const handleCancel = async () => {
    if (!order || !user) return;
    await supabase.from('orders').update({ status: 'Cancelled' }).eq('id', order.id);
    if (order.payment_mode === 'wallet') {
      await supabase.rpc('refund_wallet', { user_uuid: user.id, amount: order.total_amount });
      await refreshProfile();
      toast.success('Refund processed to wallet');
    }
    await supabase.rpc('decrement_slot_count', { slot_uuid: order.slot_id });
    setOrder({ ...order, status: 'Cancelled' });
    toast.success('Order cancelled');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-2xl py-6">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center text-muted-foreground">Order not found.</div>
      </div>
    );
  }

  const currentIdx = statusSteps.indexOf(order.status as any);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-heading">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
            <Badge className={order.status === 'Cancelled' ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}>
              {order.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status tracker */}
            {order.status !== 'Cancelled' && (
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${i <= currentIdx ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {statusIcons[step]}
                    </div>
                    <span className="text-xs">{step}</span>
                  </div>
                ))}
              </div>
            )}

            {/* QR Code */}
            {order.status !== 'Cancelled' && order.status !== 'Collected' && (
              <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6">
                <QRCodeSVG value={order.qr_token} size={160} />
                <p className="font-mono text-lg font-bold">{order.qr_token}</p>
                <p className="text-xs text-muted-foreground">Show this at the counter</p>
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="mb-2 font-heading font-semibold">Items</h3>
              {orderItems.map((item: any) => (
                <div key={item.id} className="flex justify-between border-b py-2 last:border-0">
                  <span>{item.menu_items?.name} × {item.quantity}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">₹{order.total_amount}</span>
              </div>
            </div>

            {/* Slot info */}
            {slot && (
              <p className="text-sm text-muted-foreground">
                Pickup: {slot.start_time?.slice(0, 5)} – {slot.end_time?.slice(0, 5)}
              </p>
            )}

            <p className="text-sm text-muted-foreground">Payment: {order.payment_mode === 'wallet' ? 'Wallet' : 'Cash on Pickup'}</p>

            {canCancel() && (
              <Button variant="destructive" className="w-full" onClick={handleCancel}>
                Cancel Order
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
