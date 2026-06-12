import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import CategoryChip from '@/components/CategoryChip';
import ListingCard from '@/components/ListingCard';

const sampleListings = [
  {
    id: '1',
    title: 'Fresh Organic Avocados - Pack of 3',
    price: 150,
    mrp: 299,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400',
    condition: 'Unopened' as const,
    category: 'Food & Groceries',
    seller: { name: 'Priya K.', rating: 4.8 },
    location: 'Kondapur',
    distance: '0.8 km',
    createdAt: '2 hrs ago',
    isFood: true,
    expiryDate: '3 days'
  },
  {
    id: '2',
    title: 'Sony WH-1000XM4 Wireless Headphones',
    price: 12500,
    mrp: 24990,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    condition: 'Like New' as const,
    category: 'Electronics',
    seller: { name: 'Rahul S.', rating: 4.9 },
    location: 'Gachibowli',
    distance: '1.5 km',
    createdAt: '5 hrs ago'
  },
  {
    id: '3',
    title: 'Minimalist Ceramic Vase - White',
    price: 450,
    mrp: 899,
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400',
    condition: 'Good' as const,
    category: 'Household',
    seller: { name: 'Anita M.', rating: 4.5 },
    location: 'Madhapur',
    distance: '2.1 km',
    createdAt: '1 day ago'
  },
  {
    id: '4',
    title: 'Vintage Leather Jacket - Size M',
    price: 2200,
    mrp: 5500,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    condition: 'Used' as const,
    category: 'Clothing',
    seller: { name: 'Vikram R.', rating: 4.7 },
    location: 'Hitech City',
    distance: '3.0 km',
    createdAt: '3 hrs ago'
  }
];

const Home = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const categories = [
    { label: t('categories.all', 'All'), icon: '✨' },
    { label: t('categories.food', 'Food & Groceries'), icon: '🥗' },
    { label: t('categories.electronics', 'Electronics'), icon: '💻' },
    { label: t('categories.household', 'Household'), icon: '🏠' },
    { label: t('categories.clothing', 'Clothing'), icon: '👗' },
    { label: t('categories.books', 'Books'), icon: '📚' },
    { label: t('categories.personalCare', 'Personal Care'), icon: '🧴' },
    { label: t('categories.gaming', 'Gaming'), icon: '🎮' },
    { label: t('categories.kids', 'Kids'), icon: '🧸' },
  ];

  const getNearMeListings = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        navigate(`/browse?sort=nearest&lat=${latitude}&lng=${longitude}`);
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient pt-12 pb-20 md:py-24 overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          {/* Left Side Content */}
          <div className="flex-1 space-y-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold uppercase tracking-wider mb-6">
                <Sparkles size={14} />
                {t('home.heroBadge')}
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-foreground">
                {t('home.heroTitleMain')} <span className="text-[#0F172A]">{t('home.heroTitleExtras')}</span> {t('home.heroTitleInto')}<br />
                <span className="text-primary">{t('home.heroTitleEssentials')}</span>
              </h1>
              <p className="text-lg text-secondary-foreground mt-6 max-w-xl leading-relaxed">
                {t('home.heroSubtitle')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/browse">
                <Button className="rounded-full bg-primary hover:bg-primary-dark h-14 px-8 text-lg font-bold shadow-lg shadow-primary/25 gap-2">
                  {t('home.startSwapping')} <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/create-listing">
                <Button variant="outline" className="rounded-full border-border bg-white h-14 px-8 text-lg font-bold shadow-sm hover:bg-slate-50">
                  {t('home.listItem')}
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-slate-200"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
                <CheckCircle2 size={18} className="text-accent" />
                <span>{t('home.itemsListed')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
                <CheckCircle2 size={18} className="text-accent" />
                <span>{t('home.verifiedSellers')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
                <CheckCircle2 size={18} className="text-accent" />
                <span>{t('home.safePayments')}</span>
              </div>
            </motion.div>
          </div>
          {/* ... rest of the file ... */}

          {/* Right Side Collage */}
          <div className="flex-1 relative hidden lg:block h-[500px]">
            <motion.div 
              animate={{ 
                rotate: [-2, 2, -2],
                y: [0, -10, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-10 z-20"
            >
              <div className="scale-90 rotate-[-4deg]">
                <ListingCard {...sampleListings[0]} />
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ 
                rotate: [2, -2, 2],
                y: [0, 10, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-20 right-0 z-10"
            >
              <div className="scale-95 rotate-[6deg]">
                <ListingCard {...sampleListings[1]} />
              </div>
            </motion.div>

            <motion.div 
              animate={{ 
                rotate: [-3, 3, -3],
                x: [0, 5, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-0 left-1/4 z-30"
            >
              <div className="scale-100 rotate-[-2deg]">
                <ListingCard {...sampleListings[2]} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Bar */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-border py-4 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <CategoryChip 
                key={cat.label} 
                label={cat.label} 
                icon={cat.icon} 
                isActive={activeCategory === cat.label}
                onClick={() => setActiveCategory(cat.label)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <section className="py-16 container mx-auto px-4 space-y-20">
        {/* Near You */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">{t('home.nearYou')}</h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{t('home.nearYouSubtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={getNearMeListings}
                variant="outline" 
                size="sm" 
                className="rounded-full font-bold border-primary text-primary hover:bg-primary/5 gap-2"
              >
                <MapPin size={14} /> {t('home.nearMe')}
              </Button>
              <Link to="/browse" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                {t('home.viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {sampleListings.map(item => <ListingCard key={item.id} {...item} />)}
          </div>
        </div>

        {/* Ending Soon */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-xl text-warning">
                <Clock size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">{t('home.endingSoon')} <span className="animate-pulse">🔥</span></h2>
            </div>
            <Link to="/browse?sort=expiring" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              {t('home.viewAll')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {sampleListings.slice().reverse().map(item => <ListingCard key={`end-${item.id}`} {...item} />)}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto sm:mx-0">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold">Safe Payments</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Escrow-protected transactions ensure your money is safe until delivery.</p>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mx-auto sm:mx-0">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold">Verified Sellers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Every member is phone & ID verified for a secure community experience.</p>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-warning/20 flex items-center justify-center text-warning mx-auto sm:mx-0">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold">Fast Pickup</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Coordinate pickup in minutes via our lightning-fast in-app chat.</p>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto sm:mx-0">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold">Reduce Waste</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Join 12,000+ eco-conscious swappers saving items from landfills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Just Listed */}
      <section className="py-20 container mx-auto px-4">
        <div className="bg-primary/5 rounded-[40px] p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold">{t('home.readyToDeclutter')}</h2>
          <p className="text-lg text-secondary-foreground max-w-2xl mx-auto">
            {t('home.declutterSubtitle')}
          </p>
          <Link to="/create-listing" className="inline-block">
            <Button size="lg" className="rounded-full bg-primary h-14 px-12 text-lg font-bold shadow-xl shadow-primary/25">
              {t('home.listNow')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;