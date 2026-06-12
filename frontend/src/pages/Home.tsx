import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
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

const Home = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const categories = [
    { label: t('categories.all'), key: 'All', icon: '✨' },
    { label: t('categories.food'), key: 'Food & Groceries', icon: '🥗' },
    { label: t('categories.electronics'), key: 'Electronics', icon: '💻' },
    { label: t('categories.household'), key: 'Household', icon: '🏠' },
    { label: t('categories.clothing'), key: 'Clothing', icon: '👗' },
    { label: t('categories.books'), key: 'Books', icon: '📚' },
    { label: t('categories.personalCare'), key: 'Personal Care', icon: '🧴' },
    { label: t('categories.gaming'), key: 'Gaming', icon: '🎮' },
    { label: t('categories.kids'), key: 'Kids', icon: '🧸' },
  ];

  const sampleListings = [
    {
      id: '1',
      title: 'Fresh Organic Avocados - Pack of 3',
      price: 150,
      mrp: 299,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400',
      condition: 'Unopened' as const,
      category: t('categories.food'),
      seller: { name: 'Priya K.', rating: 4.8 },
      location: 'Kondapur',
      distance: '0.8 km',
      createdAt: '2 hrs ago',
      isFood: true,
      expiryDate: '3 days'
    },
    // ... rest of sampleListings remain the same but use translated categories if needed
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
                {t('home.hero.sustainable')}
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-foreground">
                <Trans i18nKey="home.hero.title">
                  Turn Your <span className="text-[#0F172A]">Extras</span> Into<br />
                  <span className="text-primary">Someone's Essentials</span>
                </Trans>
              </h1>
              <p className="text-lg text-secondary-foreground mt-6 max-w-xl leading-relaxed">
                {t('home.hero.subtitle')}
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
                  {t('home.hero.startSwapping')} <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/create-listing">
                <Button variant="outline" className="rounded-full border-border bg-white h-14 px-8 text-lg font-bold shadow-sm hover:bg-slate-50">
                  {t('home.hero.listItem')}
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
                <span>{t('home.stats.itemsListed')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
                <CheckCircle2 size={18} className="text-accent" />
                <span>{t('home.stats.verifiedSellers')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
                <CheckCircle2 size={18} className="text-accent" />
                <span>{t('home.stats.safePayments')}</span>
              </div>
            </motion.div>
          </div>
          {/* ... Right side collage code remains same ... */}
        </div>
      </section>

      {/* Category Bar */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-border py-4 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <CategoryChip 
                key={cat.key} 
                label={cat.label} 
                icon={cat.icon} 
                isActive={activeCategory === cat.key}
                onClick={() => setActiveCategory(cat.key)}
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
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{t('home.hyperLocal')}</p>
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
          {/* ... Listings grid ... */}
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
          {/* ... Listings grid ... */}
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