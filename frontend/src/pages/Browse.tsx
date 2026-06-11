import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import CategoryChip from '@/components/CategoryChip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  SlidersHorizontal, 
  Loader2, 
  MapPin, 
  ChevronDown, 
  LayoutGrid, 
  List,
  X,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  { label: 'All', icon: '✨' },
  { label: 'Food & Groceries', icon: '🥗' },
  { label: 'Electronics', icon: '💻' },
  { label: 'Household', icon: '🏠' },
  { label: 'Clothing', icon: '👗' },
  { label: 'Books', icon: '📚' },
  { label: 'Personal Care', icon: '🧴' },
];

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
  },
  {
    id: '5',
    title: 'Instant Pot Duo 7-in-1 Smart Cooker',
    price: 4500,
    mrp: 9999,
    image: 'https://images.unsplash.com/photo-1584990344321-2766250d1174?auto=format&fit=crop&q=80&w=400',
    condition: 'Like New' as const,
    category: 'Electronics',
    seller: { name: 'Sameer L.', rating: 4.6 },
    location: 'Financial District',
    distance: '4.2 km',
    createdAt: '6 hrs ago'
  },
  {
    id: '6',
    title: 'Pack of 5 Cotton T-shirts (Unopened)',
    price: 800,
    mrp: 1999,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400',
    condition: 'Unopened' as const,
    category: 'Clothing',
    seller: { name: 'Meera V.', rating: 4.8 },
    location: 'Kondapur',
    distance: '1.1 km',
    createdAt: '10 hrs ago'
  }
];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const categoryParam = searchParams.get('category') || 'All';
  const sortParam = searchParams.get('sort') || 'latest';
  const searchParam = searchParams.get('search') || '';

  const filteredListings = listings;

  useEffect(() => {
    // Get user location for "near me" functionality
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let url = `/listings?category=${categoryParam}&search=${searchParam}`;
        
        if (sortParam === 'nearest' && userLocation) {
          url += `&lat=${userLocation.lat}&lng=${userLocation.lng}&radius=10`;
        }

        const { data } = await API.get(url);
        
        // Manual sort if not handled by $near (or for other sorts)
        let processedData = [...data];
        if (sortParam === 'price-low') {
          processedData.sort((a, b) => a.price - b.price);
        } else if (sortParam === 'price-high') {
          processedData.sort((a, b) => b.price - a.price);
        }

        setListings(processedData);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [categoryParam, sortParam, searchParam, userLocation]);

  const handleCategoryChange = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', cat);
    setSearchParams(newParams);
  };

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sort);
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', e.target.value);
    setSearchParams(newParams);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 sm:pb-12">
      {/* Top Search Bar & Filters */}
      <div className="bg-white border-b border-border sticky top-16 z-30 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              placeholder="Search items near you..." 
              className="h-12 pl-12 pr-12 rounded-2xl bg-[#F1F5F9] border-transparent focus-visible:ring-primary w-full font-medium"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <MapPin size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`rounded-2xl h-12 px-6 font-bold gap-2 border-2 ${isFilterOpen ? 'border-primary text-primary bg-primary/5' : 'border-border'}`}
            >
              <Filter size={18} /> Filters
            </Button>
            
            <div className="relative flex-1 md:flex-initial">
              <select 
                value={sortParam}
                onChange={(e) => setSearchParams({ category: categoryParam, sort: e.target.value })}
                className="h-12 w-full md:w-48 rounded-2xl bg-white border-2 border-border px-4 pr-10 appearance-none font-bold text-sm outline-none focus:border-primary transition-colors"
              >
                <option value="latest">Latest First</option>
                <option value="nearest">Nearest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="expiring">Expiring Soon</option>
              </select>
              <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-40 h-fit">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Categories</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => handleCategoryChange(cat.label)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${categoryParam === cat.label ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-secondary-foreground hover:bg-slate-50 border border-border'}`}
                  >
                    <span>{cat.icon} {cat.label}</span>
                    {categoryParam === cat.label && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Distance Radius</h3>
              <div className="px-2">
                 <input type="range" min="1" max="50" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                 <div className="flex justify-between mt-2 text-[10px] font-black uppercase text-muted-foreground">
                    <span>1 km</span>
                    <span className="text-primary">Near You</span>
                    <span>50 km</span>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Condition</h3>
              <div className="space-y-3">
                {['Unopened', 'Like New', 'Good', 'Used'].map((cond) => (
                  <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded-md border-2 border-border flex items-center justify-center transition-all group-hover:border-primary">
                       <input type="checkbox" className="hidden" />
                       <div className="w-2.5 h-2.5 bg-primary rounded-[2px] opacity-0" />
                    </div>
                    <span className="text-sm font-bold text-secondary-foreground group-hover:text-primary transition-colors">{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
               <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Eco Tip</p>
               <p className="text-xs font-semibold text-primary/80 leading-relaxed">Buying locally reduces carbon footprint by eliminating long-distance shipping!</p>
            </div>
          </aside>

          {/* Main Content: Listing Grid */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">
                {categoryParam === 'All' ? 'Discover Essentials' : categoryParam}
                <span className="ml-2 text-sm font-bold text-muted-foreground font-sans">({filteredListings.length} items found)</span>
              </h2>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white shadow-sm text-primary">
                    <LayoutGrid size={16} />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary">
                    <List size={16} />
                 </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Finding matches...</p>
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
                <AnimatePresence mode="popLayout">
                  {filteredListings.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      key={item._id}
                    >
                      <ListingCard 
                        id={item._id}
                        title={item.title}
                        price={item.price}
                        mrp={item.mrp}
                        image={item.images?.[0] || 'https://images.unsplash.com/photo-1584990344321-2766250d1174?auto=format&fit=crop&q=80&w=400'}
                        condition={item.condition}
                        category={item.category}
                        seller={item.seller || { name: 'Neighbor', rating: 5 }}
                        location={item.location?.name || item.address || 'Nearby'}
                        distance={item.distance || '0.5 km'}
                        createdAt={new Date(item.createdAt).toLocaleDateString()}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-300"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-8">Try adjusting your filters or search term.</p>
                <Button 
                  onClick={() => setSearchParams({ category: 'All' })}
                  variant="outline" 
                  className="rounded-full h-12 px-8 font-bold"
                >
                  Reset all filters
                </Button>
              </motion.div>
            )}

            {/* Load More */}
            {filteredListings.length > 0 && (
              <div className="flex justify-center pt-12">
                 <Button variant="ghost" className="rounded-full h-14 px-12 font-black text-primary hover:bg-primary/5 uppercase tracking-widest text-xs border-2 border-primary/20">
                    Load More Items
                 </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] max-h-[90vh] overflow-y-auto p-8 space-y-8"
          >
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-slate-100 rounded-full">
                   <X size={20} />
                </button>
             </div>

             <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <CategoryChip 
                        key={cat.label} 
                        label={cat.label} 
                        icon={cat.icon} 
                        isActive={categoryParam === cat.label}
                        onClick={() => handleCategoryChange(cat.label)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Price Range</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Min ₹" type="number" className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                      <Input placeholder="Max ₹" type="number" className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                   </div>
                </div>

                <div className="space-y-4 pb-12">
                   <Button 
                    className="w-full h-14 rounded-2xl bg-primary font-black text-lg shadow-xl shadow-primary/25"
                    onClick={() => setIsFilterOpen(false)}
                   >
                     Apply Filters
                   </Button>
                   <Button 
                    variant="ghost"
                    className="w-full h-12 font-bold text-muted-foreground"
                    onClick={() => {
                      setSearchParams({ category: 'All' });
                      setIsFilterOpen(false);
                    }}
                   >
                     Reset All
                   </Button>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Browse;