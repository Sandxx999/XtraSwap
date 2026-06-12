import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  PlusCircle, 
  User as UserIcon, 
  LogOut,
  LayoutDashboard,
  Menu,
  MessageSquare,
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
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useTranslation();
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
          <Link to="/browse" className="hover:text-primary transition-colors">{t('navbar.browse')}</Link>
          <Link to="#" className="hover:text-primary transition-colors">{t('navbar.howItWorks')}</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-primary transition-colors outline-none">
              {t('navbar.categories')}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/browse?category=food')}>🥗 {t('categories.food')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/browse?category=electronics')}>💻 {t('categories.electronics')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/browse?category=household')}>🏠 {t('categories.household')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/browse?category=clothing')}>👗 {t('categories.clothing')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </div>
          <Input 
            placeholder={t('navbar.searchPlaceholder')} 
            className="pl-10 pr-10 rounded-full bg-[#F1F5F9] border-transparent focus-visible:ring-primary h-10 w-full"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-primary">
            <MapPin size={18} />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSelector />
            
            <Link to="/inbox">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full relative">
                <MessageSquare size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
              </Button>
            </Link>
            
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
                    <span>{t('navbar.dashboard')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('navbar.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="font-semibold text-sm hover:text-primary"
                onClick={() => navigate('/login')}
              >
                {t('navbar.signIn')}
              </Button>
            )}
          </div>

          <Button 
            className="hidden sm:flex rounded-full bg-primary hover:bg-primary-dark px-6 font-semibold gap-2 shadow-sm shadow-primary/20"
            onClick={() => navigate('/create-listing')}
          >
            <PlusCircle size={18} />
            {t('navbar.sellItem')}
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
            <Link to="/browse" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.browse')}</Link>
            <Link to="#" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.howItWorks')}</Link>
            {!userInfo && <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.signIn')}</Link>}
            {userInfo && (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.dashboard')}</Link>
                <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="text-left text-destructive">{t('navbar.logout')}</button>
              </>
            )}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Language:</span>
              <LanguageSelector />
            </div>
          </div>
          <Button 
            className="w-full rounded-xl bg-primary hover:bg-primary-dark h-12 text-lg font-bold mb-4"
            onClick={() => {
              navigate('/create-listing');
              setIsMobileMenuOpen(false);
            }}
          >
            {t('navbar.sellItem')}
          </Button>
          <div className="relative mt-auto pb-8">
            <Input 
              placeholder={t('navbar.searchPlaceholder')} 
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