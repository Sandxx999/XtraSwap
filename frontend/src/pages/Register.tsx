import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import API from '@/lib/api';
import { Loader2, ArrowRight, User, Mail, Lock, Sparkles, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post('/users', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast({
        title: "Welcome to XtraSwap! 🎉",
        description: `Account created successfully for ${data.name}`,
      });
      
      navigate('/');
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] space-y-8"
      >
        <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary mb-4 group transition-colors">
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to home
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-[#0F172A]">Create Account</h1>
            <p className="text-secondary-foreground font-medium">Join 12,000+ neighbors swapping today</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <Input 
                            id="name" 
                            placeholder="John Doe" 
                            required 
                            className="h-14 pl-12 rounded-2xl bg-[#F1F5F9] border-transparent focus-visible:ring-primary font-bold"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="m@example.com" 
                            required 
                            className="h-14 pl-12 rounded-2xl bg-[#F1F5F9] border-transparent focus-visible:ring-primary font-bold"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="••••••••"
                                required 
                                className="h-14 pl-12 rounded-2xl bg-[#F1F5F9] border-transparent focus-visible:ring-primary font-bold"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm</label>
                        <Input 
                            id="confirmPassword" 
                            type="password" 
                            placeholder="••••••••"
                            required 
                            className="h-14 px-6 rounded-2xl bg-[#F1F5F9] border-transparent focus-visible:ring-primary font-bold"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-dark font-black text-lg shadow-xl shadow-primary/25 gap-2" disabled={loading}>
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Join XtraSwap <ArrowRight size={20} /></>}
                    </Button>
                </div>
            </form>

            <div className="p-4 bg-accent/5 rounded-2xl flex items-start gap-3 border border-accent/10">
                <Sparkles className="text-accent mt-0.5" size={16} />
                <p className="text-[10px] font-bold text-accent/80 leading-relaxed uppercase tracking-wider">
                    Join now to get a "Founding Member" badge on your profile!
                </p>
            </div>
        </div>

        <p className="text-center text-sm font-bold text-secondary-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign in instead</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;