import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Star, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function RatePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [ratings, setRatings] = useState<Record<string, { rating: number; review: string }>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('order_items')
        .select('*, menu_items:menu_item_id(id, name, image_url)')
        .eq('order_id', orderId);
      setOrderItems(data ?? []);
    };
    fetch();
  }, [orderId]);

  const setItemRating = (menuItemId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [menuItemId]: { ...prev[menuItemId], rating, review: prev[menuItemId]?.review || '' },
    }));
  };

  const setItemReview = (menuItemId: string, review: string) => {
    setRatings(prev => ({
      ...prev,
      [menuItemId]: { ...prev[menuItemId], review, rating: prev[menuItemId]?.rating || 0 },
    }));
  };

  const handleSubmit = async () => {
    if (!user || !orderId) return;
    const entries = Object.entries(ratings).filter(([, v]) => v.rating > 0);
    if (entries.length === 0) { toast.error('Please rate at least one item'); return; }

    setLoading(true);
    for (const [menuItemId, { rating, review }] of entries) {
      await supabase.from('ratings').insert({
        student_id: user.id,
        menu_item_id: menuItemId,
        order_id: orderId,
        rating,
        review: review || null,
      });
    }
    toast.success('Thank you for your feedback!');
    navigate('/orders');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-lg py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="font-heading text-2xl font-bold mb-4">Rate Your Food</h1>
        <div className="space-y-4">
          {orderItems.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-4 space-y-3">
                <p className="font-medium">{item.menu_items?.name}</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setItemRating(item.menu_items?.id, star)}>
                      <Star className={`h-6 w-6 ${(ratings[item.menu_items?.id]?.rating ?? 0) >= star ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Write a review (optional)"
                  value={ratings[item.menu_items?.id]?.review ?? ''}
                  onChange={e => setItemReview(item.menu_items?.id, e.target.value)}
                  className="h-20"
                />
              </CardContent>
            </Card>
          ))}
        </div>
        <Button className="mt-6 w-full" onClick={handleSubmit} disabled={loading}>
          Submit Ratings
        </Button>
      </div>
    </div>
  );
}
