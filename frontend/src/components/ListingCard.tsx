import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  mrp?: number;
  image: string;
  condition: 'Unopened' | 'Like New' | 'Good' | 'Used';
  category: string;
  seller: {
    name: string;
    avatar?: string;
    rating: number;
  };
  location: string;
  distance: string;
  createdAt: string;
  isFood?: boolean;
  expiryDate?: string;
  isSold?: boolean;
}

const ListingCard = ({
  id,
  title,
  price,
  mrp,
  image,
  condition,
  category,
  seller,
  location,
  distance,
  createdAt,
  isFood,
  expiryDate,
  isSold
}: ListingCardProps) => {
  const discount = mrp ? Math.round(((mrp - price) / mrp) * 100) : null;

  const conditionColors = {
    'Unopened': 'bg-[#10B981] text-white hover:bg-[#10B981]/90',
    'Like New': 'bg-[#2563EB] text-white hover:bg-[#2563EB]/90',
    'Good': 'bg-[#F59E0B] text-white hover:bg-[#F59E0B]/90',
    'Used': 'bg-[#64748B] text-white hover:bg-[#64748B]/90',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative flex flex-col w-full max-w-[280px] rounded-2xl bg-white border border-border shadow-sm transition-all duration-200 hover:shadow-lg overflow-hidden"
    >
      {/* Image Section */}
      <Link to={`/listing/${id}`} className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={`border-none font-semibold text-[10px] px-2 py-0.5 shadow-sm ${conditionColors[condition]}`}>
            {condition}
          </Badge>
          {isFood && expiryDate && (
            <Badge className="bg-warning text-white border-none font-semibold text-[10px] px-2 py-0.5 shadow-sm">
              Exp: {expiryDate}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-danger transition-colors shadow-sm">
          <Heart size={18} />
        </button>

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="border-4 border-white px-6 py-2 rotate-[-12deg]">
              <span className="text-white font-black text-3xl tracking-tighter">SOLD</span>
            </div>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="flex flex-col p-4 gap-3">
        <Link to={`/listing/${id}`}>
          <h3 className="text-[15px] font-semibold text-foreground line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">₹{price}</span>
          {mrp && (
            <>
              <span className="text-xs text-muted-foreground line-through">₹{mrp}</span>
              <span className="text-[11px] font-bold text-accent uppercase tracking-tight">{discount}% OFF</span>
            </>
          )}
        </div>

        <div className="h-px bg-border w-full" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage src={seller.avatar} />
              <AvatarFallback className="text-[10px] font-bold">{seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-foreground">{seller.name}</span>
              <div className="flex items-center text-[10px] text-warning font-bold">
                <Star size={10} fill="currentColor" className="mr-0.5" />
                {seller.rating}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end text-right">
            <div className="flex items-center text-[11px] text-muted-foreground font-medium">
              <MapPin size={10} className="mr-0.5 text-primary" />
              {location}
            </div>
            <span className="text-[10px] text-muted-foreground">{distance} away</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
          <Clock size={10} />
          <span>{createdAt}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;