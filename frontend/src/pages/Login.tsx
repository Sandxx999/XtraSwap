import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import API from '@/lib/api';
import { Loader2, ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post('/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast({
        title: "Welcome back! 👋",
        description: `Successfully logged in as ${data.name}`,
      });
      
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      navigate(redirect ? `/${redirect}` : '/');
      window.location.reload(); 
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] space-y-8"
      >
        <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={12} /> Neighborhood Re-commerce
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#0F172A]">Welcome Back</h1>
            <p className="text-secondary-foreground font-medium">Continue your sustainable journey</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <Input 
                            type="email" 
                            placeholder="m@example.com" 
                            required 
                            className="h-14 pl-12 rounded-2xl bg-[#F1F5F9] border-transparent focus-visible:ring-primary font-bold"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                        <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <Input 
                            type="password" 
                            placeholder="••••••••"
                            required 
                            className="h-14 pl-12 rounded-2xl bg-[#F1F5F9] border-transparent focus-visible:ring-primary font-bold"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-dark font-black text-lg shadow-xl shadow-primary/25 gap-2" disabled={loading}>
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
                </Button>
            </form>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                    <span className="bg-white px-4">Or sign in with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-xl border-border font-bold text-xs gap-2 hover:bg-slate-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                </Button>
                <Button variant="outline" className="h-12 rounded-xl border-border font-bold text-xs gap-2 hover:bg-slate-50">
                    <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                </Button>
            </div>
        </div>

        <p className="text-center text-sm font-bold text-secondary-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;