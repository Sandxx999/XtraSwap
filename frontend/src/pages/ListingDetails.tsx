import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Clock, 
  Tag, 
  User as UserIcon, 
  ChevronLeft, 
  Share2, 
  AlertTriangle,
  Loader2,
  MessageSquare,
  PackageCheck,
  Star,
  ShieldCheck,
  Calendar,
  Truck,
  ArrowRight,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import ListingCard from '@/components/ListingCard';

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/listings/${id}`);
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not find this listing.",
        });
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-semibold animate-pulse">Loading amazing deals...</p>
      </div>
    );
  }

  if (!listing) return null;

  const discount = listing.mrp ? Math.round(((listing.mrp - listing.price) / listing.mrp) * 100) : 0;
  const seller = listing.seller || { name: 'Neighbor', rating: 5, memberSince: '2024' };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/browse" className="inline-flex items-center text-sm font-bold text-secondary-foreground hover:text-primary group transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Browse
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full font-bold gap-2">
              <Share2 size={16} /> Share
            </Button>
            <Button variant="outline" size="sm" className="rounded-full font-bold text-danger hover:text-danger border-danger/20 hover:bg-danger/5">
              <AlertTriangle size={16} /> Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-square bg-white rounded-[32px] overflow-hidden border border-border shadow-sm relative group"
            >
              <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1584990344321-2766250d1174?auto=format&fit=crop&q=80&w=800'} alt={listing.title} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <Badge className="bg-accent text-white border-none font-bold px-3 py-1 shadow-md uppercase tracking-wider text-[10px]">
                  {listing.condition}
                </Badge>
                <Badge className="bg-primary/90 backdrop-blur-md text-white border-none font-bold px-3 py-1 shadow-md uppercase tracking-wider text-[10px]">
                  {listing.category}
                </Badge>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {listing.images?.map((img: string, i: number) => (
                <div key={i} className="aspect-square bg-white border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary transition-colors p-1">
                  <img src={img} className="w-full h-full object-cover rounded-xl" />
                </div>
              ))}
            </div>

            {/* Item Details (Desktop Only Section) */}
            <div className="hidden lg:block space-y-8 pt-8 border-t">
              <h2 className="text-2xl font-bold">Item Description</h2>
              <p className="text-secondary-foreground text-lg leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-dashed">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-bold">{listing.condition}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dashed">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-bold">{listing.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dashed">
                      <span className="text-muted-foreground">Posted Date</span>
                      <span className="font-bold">{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Safety Info</h3>
                  <div className="p-4 bg-primary/5 rounded-2xl space-y-3">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="text-primary mt-1" size={18} />
                      <p className="text-xs font-semibold leading-relaxed">This listing is protected by XtraSwap Escrow. Funds are only released after you confirm the item.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="space-y-4 pt-8">
                <h2 className="text-2xl font-bold">Location Preview</h2>
                <div className="h-64 bg-slate-200 rounded-[32px] overflow-hidden relative border border-border">
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/78.38,17.44,14/800x400?access_token=pk.xxx')] bg-cover opacity-60 grayscale" />
                  <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping absolute -inset-0" />
                      <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center relative border-4 border-white shadow-xl">
                        <MapPin className="text-primary" size={24} fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
                    <p className="text-sm font-bold flex items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      {listing.location?.name || listing.address || 'Kondapur'} • {listing.distance || '0.5 km'} away
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Exact address shared after purchase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[40px] border border-border shadow-sm space-y-8 sticky top-28"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold leading-tight">{listing.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock size={14} /> 
                  <span>Posted {new Date(listing.createdAt).toLocaleDateString()} • {listing.views || 0} views</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-primary">₹{listing.price}</span>
                {listing.mrp && (
                  <>
                    <span className="text-xl text-muted-foreground line-through font-medium">₹{listing.mrp}</span>
                    <Badge className="bg-accent text-white border-none font-black px-2 py-0.5 rounded-lg text-sm">
                      {discount}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Fulfillment Toggle */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Fulfillment</p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setFulfillment('pickup')}
                    className={`p-4 rounded-[24px] border-2 text-left transition-all ${fulfillment === 'pickup' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border hover:border-slate-300'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${fulfillment === 'pickup' ? 'bg-primary text-white' : 'bg-slate-100 text-muted-foreground'}`}>
                      <MapPin size={16} />
                    </div>
                    <p className="font-bold text-sm">Self Pickup</p>
                    <p className="text-xs text-muted-foreground mt-1">Free • Immediate</p>
                  </button>
                  <button 
                    onClick={() => setFulfillment('delivery')}
                    className={`p-4 rounded-[24px] border-2 text-left transition-all ${fulfillment === 'delivery' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border hover:border-slate-300'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${fulfillment === 'delivery' ? 'bg-primary text-white' : 'bg-slate-100 text-muted-foreground'}`}>
                      <Truck size={16} />
                    </div>
                    <p className="font-bold text-sm">Delivery</p>
                    <p className="text-xs text-muted-foreground mt-1">₹40 • Within 2 hrs</p>
                  </button>
                </div>
              </div>

              {/* Expiry Alert (If Food) */}
              {listing.expiryDate && (
                <div className="p-4 bg-warning/10 rounded-2xl flex items-center gap-3 border border-warning/20">
                  <div className="p-2 bg-warning/20 rounded-xl text-warning">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-warning uppercase tracking-widest">Expires Soon</p>
                    <p className="text-sm font-bold">Rescuable until {new Date(listing.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
              )}

              {/* Primary Actions */}
              <div className="space-y-3 pt-2">
                <Button size="lg" className="w-full h-16 text-xl font-black rounded-2xl gap-3 shadow-xl shadow-primary/25 group">
                  <PackageCheck size={24} /> 
                  Buy Now 
                  <ArrowRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="w-full h-16 text-lg font-bold rounded-2xl border-2 hover:bg-slate-50 gap-2">
                  <MessageSquare size={20} className="text-primary" /> Chat with Seller
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
                <ShieldCheck size={14} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Money-back guarantee</span>
              </div>

              {/* Seller Card */}
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-primary/10 p-0.5">
                      <AvatarImage src={seller.avatar} />
                      <AvatarFallback className="bg-primary/5 text-primary font-black text-lg">
                        {seller.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg leading-none mb-1">{seller.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center text-warning font-black">
                          <Star size={12} fill="currentColor" className="mr-0.5" />
                          {seller.rating || 5}
                        </div>
                        <span>• Member since {seller.memberSince || '2024'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Response Time</p>
                    <p className="text-xs font-bold">{seller.responseTime || '< 15 mins'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Verification</p>
                    <p className="text-xs font-bold text-accent">ID Verified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Similar Items Carousel */}
        <section className="mt-24 pt-16 border-t">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black">Similar Items Near You</h2>
            <Link to="/browse" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Using ListingCard component here would be perfect */}
            <div className="flex items-center justify-center p-12 bg-white rounded-[40px] border border-dashed border-slate-300 col-span-full">
               <div className="text-center">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Info size={24} />
                 </div>
                 <p className="text-secondary-foreground font-bold">More amazing deals loading...</p>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ListingDetails;