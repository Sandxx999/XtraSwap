import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  User as UserIcon, 
  LogOut,
  LayoutDashboard,
  Menu,
  Bell,
  MapPin,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (info) {
      setUserInfo(JSON.parse(info));
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <span className="text-xl font-extrabold text-[#0F172A]">XTRA</span>
          <span className="text-xl font-extrabold text-[#2563EB]">SWAP</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-secondary-foreground">
          <Link to="/browse" className="hover:text-primary transition-colors">Browse</Link>
          <Link to="#" className="hover:text-primary transition-colors">How It Works</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-primary transition-colors outline-none">
              Categories
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/browse?category=food')}>🥗 Food & Groceries</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/browse?category=electronics')}>💻 Electronics</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/browse?category=household')}>🏠 Household</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/browse?category=clothing')}>👗 Clothing</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </div>
          <Input 
            placeholder="Search items near you..." 
            className="pl-10 pr-10 rounded-full bg-[#F1F5F9] border-transparent focus-visible:ring-primary h-10 w-full"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-primary">
            <MapPin size={18} />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full">
              <Bell size={20} />
            </Button>
            
            {userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="bg-primary text-white font-bold text-xs">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-bold">{userInfo.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">{userInfo.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="font-semibold text-sm hover:text-primary"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            )}
          </div>

          <Button 
            className="hidden sm:flex rounded-full bg-primary hover:bg-primary-dark px-6 font-semibold gap-2 shadow-sm shadow-primary/20"
            onClick={() => navigate('/create-listing')}
          >
            <PlusCircle size={18} />
            Sell Item
          </Button>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col p-4 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col gap-4 text-lg font-semibold mb-8">
            <Link to="/browse" onClick={() => setIsMobileMenuOpen(false)}>Browse</Link>
            <Link to="#" onClick={() => setIsMobileMenuOpen(false)}>How It Works</Link>
            {!userInfo && <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>}
            {userInfo && (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="text-left text-destructive">Logout</button>
              </>
            )}
          </div>
          <Button 
            className="w-full rounded-xl bg-primary hover:bg-primary-dark h-12 text-lg font-bold mb-4"
            onClick={() => {
              navigate('/create-listing');
              setIsMobileMenuOpen(false);
            }}
          >
            Sell an Item
          </Button>
          <div className="relative mt-auto pb-8">
            <Input 
              placeholder="Search items near you..." 
              className="pl-10 rounded-xl bg-[#F1F5F9] border-transparent h-12"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;