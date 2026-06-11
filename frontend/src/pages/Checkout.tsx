import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft, CreditCard, Smartphone, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await API.get(`/listings/${id}`);
        if (data.isSold || data.status === 'Sold') {
          toast({ variant: 'destructive', title: 'Item already sold!' });
          navigate('/browse');
          return;
        }
        setListing(data);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error loading checkout' });
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate, toast]);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await API.post('/orders', {
        listingId: listing._id,
        paymentMethod
      });
      setSuccess(true);
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Payment Failed',
        description: error.response?.data?.message || 'Something went wrong.'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  if (success) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white p-12 rounded-[40px] shadow-xl text-center max-w-md w-full mx-4"
        >
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">You have successfully purchased <span className="font-bold text-foreground">{listing.title}</span>.</p>
          <Button onClick={() => navigate('/browse')} className="w-full h-14 rounded-2xl font-bold text-lg">
            Continue Browsing
          </Button>
        </motion.div>
      </div>
    );
  }

  const platformFee = Math.round(listing.price * 0.05); // 5% fee
  const total = listing.price + platformFee;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>

        <h1 className="text-3xl font-black mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Payment Options */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Select Payment Method</h2>
            
            <div className="space-y-4">
              <Card 
                onClick={() => setPaymentMethod('UPI')}
                className={`p-6 cursor-pointer border-2 transition-all rounded-[24px] flex items-center gap-4 ${paymentMethod === 'UPI' ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-slate-300'}`}
              >
                <div className={`p-3 rounded-xl ${paymentMethod === 'UPI' ? 'bg-primary text-white' : 'bg-slate-100 text-muted-foreground'}`}>
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="font-bold">UPI / QR</h3>
                  <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                </div>
              </Card>

              <Card 
                onClick={() => setPaymentMethod('Card')}
                className={`p-6 cursor-pointer border-2 transition-all rounded-[24px] flex items-center gap-4 ${paymentMethod === 'Card' ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-slate-300'}`}
              >
                <div className={`p-3 rounded-xl ${paymentMethod === 'Card' ? 'bg-primary text-white' : 'bg-slate-100 text-muted-foreground'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Credit / Debit Card</h3>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                </div>
              </Card>

              <Card 
                onClick={() => setPaymentMethod('COD')}
                className={`p-6 cursor-pointer border-2 transition-all rounded-[24px] flex items-center gap-4 ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-slate-300'}`}
              >
                <div className={`p-3 rounded-xl ${paymentMethod === 'COD' ? 'bg-primary text-white' : 'bg-slate-100 text-muted-foreground'}`}>
                  <Banknote size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Cash on Delivery</h3>
                  <p className="text-sm text-muted-foreground">Pay when you receive the item</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <Card className="p-8 rounded-[32px] border-border shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-dashed">
                <img src={listing.images[0]} alt={listing.title} className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-sm line-clamp-2 mb-1">{listing.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full font-semibold">{listing.condition}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Item Total</span>
                  <span className="font-bold">₹{listing.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Platform Protection Fee</span>
                  <span className="font-bold">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Delivery</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 pt-6 border-t">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Total to pay</span>
                <span className="text-4xl font-black text-primary">₹{total}</span>
              </div>

              <Button 
                onClick={handlePayment} 
                disabled={processing}
                className="w-full h-16 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 relative overflow-hidden"
              >
                {processing ? (
                  <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Processing Securely...</span>
                ) : (
                  `Pay ₹${total}`
                )}
              </Button>

              <div className="flex justify-center items-center gap-2 mt-6 text-muted-foreground">
                <ShieldCheck size={16} className="text-green-500" />
                <span className="text-xs font-bold uppercase tracking-widest">100% Secure Transaction</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;