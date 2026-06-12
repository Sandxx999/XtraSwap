import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

const MobileBottomNav = () => {
  const { t } = useTranslation();
  
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border px-6 py-2">
      <div className="flex items-center justify-between">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Home size={22} />
          <span className="text-[10px] font-semibold">{t('mobileNav.home')}</span>
        </NavLink>
        
        <NavLink 
          to="/browse" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Search size={22} />
          <span className="text-[10px] font-semibold">{t('mobileNav.browse')}</span>
        </NavLink>
        
        <NavLink 
          to="/create-listing" 
          className="flex flex-col items-center -mt-8"
        >
          <div className="bg-primary text-white p-3 rounded-full shadow-lg shadow-primary/30 border-4 border-white">
            <PlusCircle size={24} />
          </div>
          <span className="text-[10px] font-semibold mt-1 text-primary">{t('mobileNav.sell')}</span>
        </NavLink>
        
        <NavLink 
          to="/inbox" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 relative ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <MessageSquare size={22} />
          <span className="absolute top-0 right-1 w-2 h-2 bg-danger rounded-full" />
          <span className="text-[10px] font-semibold">{t('mobileNav.chats')}</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <User size={22} />
          <span className="text-[10px] font-semibold">{t('mobileNav.profile')}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileBottomNav;