import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

const MobileBottomNav = () => {
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
          <span className="text-[10px] font-semibold">Home</span>
        </NavLink>
        
        <NavLink 
          to="/browse" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Search size={22} />
          <span className="text-[10px] font-semibold">Browse</span>
        </NavLink>
        
        <NavLink 
          to="/create-listing" 
          className="flex flex-col items-center -mt-8"
        >
          <div className="bg-primary text-white p-3 rounded-full shadow-lg shadow-primary/30 border-4 border-white">
            <PlusCircle size={24} />
          </div>
          <span className="text-[10px] font-semibold mt-1 text-primary">Sell</span>
        </NavLink>
        
        <NavLink 
          to="/chats" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <MessageSquare size={22} />
          <span className="text-[10px] font-semibold">Chats</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <User size={22} />
          <span className="text-[10px] font-semibold">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileBottomNav;