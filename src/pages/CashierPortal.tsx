import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { QrCode, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function CashierPortal() {
  const [token, setToken] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [collecting, setCollecting] = useState(false);

  const handleLookup = async () => {
    if (!token.trim()) { setError('Enter a QR token'); return; }
    setLoading(true);
    setError('');
    setOrder(null);

    const { data: orderData } = await supabase
      .from('orders')
      .select('*, time_slots:slot_id(start_time, end_time), profiles:student_id(name)')
      .eq('qr_token', token.trim())
      .maybeSingle();

    if (!orderData) {
      setError('Invalid token — no order found');
      setLoading(false);
      return;
    }

    if (orderData.status === 'Collected') {
      setError('This token has already been used');
      setLoading(false);
      return;
    }

    if (orderData.status === 'Cancelled') {
      setError('This order was cancelled');
      setLoading(false);
      return;
    }

    if (orderData.status !== 'Ready') {
      setError(`Order is not ready yet (Status: ${orderData.status})`);
      setLoading(false);
      return;
    }

    const { data: itemsData } = await supabase
      .from('order_items')
      .select('*, menu_items:menu_item_id(name)')
      .eq('order_id', orderData.id);

    setOrder(orderData);
    setItems(itemsData ?? []);
    setLoading(false);
  };

  const handleCollect = async () => {
    if (!order) return;
    setCollecting(true);
    await supabase.from('orders').update({ status: 'Collected' }).eq('id', order.id);

    // If cash payment, mark payment completed
    if (order.payment_mode === 'cash') {
      await supabase.from('payments').update({ status: 'completed' }).eq('order_id', order.id);
    }

    // Notify student
    await supabase.from('notifications').insert({
      student_id: order.student_id,
      order_id: order.id,
      message: 'Your order has been collected! Enjoy your meal! 🍽️',
      type: 'success',
    });

    toast.success('Order marked as Collected!');
    setOrder(null);
    setItems([]);
    setToken('');
    setCollecting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-lg py-6">
        <h1 className="font-heading text-2xl font-bold mb-6 text-center">Cashier Portal</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <QrCode className="h-5 w-5 text-primary" /> Validate QR Token
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={token}
                onChange={e => setToken(e.target.value.toUpperCase())}
                placeholder="Enter QR token (e.g. CG-ABC12345)"
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
              />
              <Button onClick={handleLookup} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {order && (
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-lg">#{order.id.slice(0,8).toUpperCase()}</CardTitle>
                <Badge className="bg-success text-success-foreground">Ready</Badge>
              </div>
              <p className="text-muted-foreground">{order.profiles?.name}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between border-b py-2 last:border-0">
                    <span>{item.menu_items?.name} × {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{order.total_amount}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Pickup: {order.time_slots?.start_time?.slice(0,5)} – {order.time_slots?.end_time?.slice(0,5)}
              </p>
              <p className="text-sm text-muted-foreground">
                Payment: {order.payment_mode === 'wallet' ? '✅ Paid via Wallet' : '💵 Cash on Pickup'}
              </p>
              <Button className="w-full" size="lg" onClick={handleCollect} disabled={collecting}>
                {collecting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <><CheckCircle className="mr-2 h-5 w-5" /> Mark as Collected</>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
