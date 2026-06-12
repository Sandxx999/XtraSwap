import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import API from '@/lib/api';
// ... rest of imports
import { 
  Loader2, 
  Camera, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  ChevronRight, 
  ChevronLeft, 
  Upload,
  X,
  Info,
  CheckCircle2,
  Package,
  Truck,
  Navigation,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';

const CreateListing = () => {
  const { t } = useTranslation();
  const webcamRef = React.useRef<any>(null);
  const [showCamera, setShowCamera] = useState(false);
  // ... rest of state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Food & Groceries',
    price: '',
    mrp: '',
    condition: 'Unopened',
    address: '',
    location: 'Nearby',
    expiryDate: '',
    fulfillment: 'both'
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please sign in to list an item.",
      });
      navigate('/login?redirect=create-listing');
    }
  }, [navigate, toast]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ variant: 'destructive', title: 'Geolocation is not supported by your browser' });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, coordinates: [longitude, latitude] as any }));

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setFormData(prev => ({ 
              ...prev, 
              address: data.display_name,
              location: data.address?.city || data.address?.town || data.address?.suburb || 'Nearby'
            }));
          } else {
            setFormData(prev => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          }
          toast({ title: 'Location updated automatically' });
        } catch (error) {
          setFormData(prev => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          toast({ title: 'Location acquired (coordinates only)' });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast({ variant: 'destructive', title: 'Failed to get location', description: error.message });
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const analyzeWithAI = async (base64Image: string) => {
    setIsAnalyzing(true);
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) throw new Error('Not logged in');
      const userInfo = JSON.parse(userInfoStr);

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const { data } = await API.post('/ai/analyze', { image: base64Image }, config);
      
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        category: data.category || prev.category,
        condition: data.condition || prev.condition,
      }));

      toast({
        title: "✨ AI Magic Complete!",
        description: "We've auto-filled the details for you. Please review.",
      });
      setStep(2); // Auto-advance to details step
    } catch (error: any) {
      console.error('AI Analysis failed:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.message || "Could not auto-detect product details. Please fill them manually.";
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: errorMsg,
      });
      setStep(2); // Advance anyway
    } finally {
      setIsAnalyzing(false);
    }
  };

  const captureImage = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImages(prev => {
        const newImages = [...prev, imageSrc];
        // Trigger AI analysis even if not first image, if user explicitly captures
        analyzeWithAI(imageSrc);
        return newImages;
      });
      setShowCamera(false);
    }
  }, [webcamRef]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800; // Compress to max 800px to stay well under 4.5MB limit

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Export as compressed JPEG
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          
          setImages(prev => {
            const newImages = [...prev, compressedBase64];
            // Trigger AI analysis for uploaded image
            analyzeWithAI(compressedBase64);
            return newImages;
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) throw new Error('Not logged in');
      const userInfo = JSON.parse(userInfoStr);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const payload: any = { ...formData, images };
      if (!payload.mrp) delete payload.mrp;
      if (!payload.expiryDate) delete payload.expiryDate;

      await API.post('/listings', payload, config);
      
      toast({
        title: "Listing Published! 🚀",
        description: "Your item is now live in your neighborhood.",
      });
      navigate('/browse');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create listing",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: t('createListing.photos', 'Photos') },
    { id: 2, label: t('createListing.itemDetails', 'Details') },
    { id: 3, label: t('createListing.pricingLogistics', 'Pricing') },
    { id: 4, label: t('createListing.review', 'Review') }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
             {steps.map((s) => (
               <div key={s.id} className="flex flex-col items-center gap-2">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s.id ? 'bg-primary text-white' : 'bg-white text-muted-foreground border-2 border-border'}`}>
                    {step > s.id ? <CheckCircle2 size={20} /> : s.id}
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-primary' : 'text-muted-foreground'}`}>{s.label}</span>
               </div>
             ))}
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '25%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Photos */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black">{t('createListing.aiScanner')}</h1>
                <p className="text-secondary-foreground">{t('createListing.aiSubtitle')}</p>
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                    <div className="relative bg-primary text-white p-6 rounded-full shadow-2xl">
                      <Sparkles size={48} className="animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-center">{t('createListing.aiAnalyzing')}</h2>
                  <p className="text-muted-foreground text-center">{t('createListing.aiAnalyzingSubtitle')}</p>
                </div>
              ) : showCamera ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-full aspect-square md:aspect-video rounded-[32px] overflow-hidden bg-black shadow-lg">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "environment" }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none border-[6px] border-primary/20 rounded-[32px] m-4" />
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setShowCamera(false)} className="rounded-full h-14 px-8 font-bold">
                      {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button onClick={captureImage} className="rounded-full h-14 px-10 text-lg font-black shadow-xl shadow-primary/25 gap-2">
                      <Camera size={20} /> {t('createListing.instantScan')}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-[24px] overflow-hidden group shadow-sm border border-border">
                        <img src={img} className="w-full h-full object-cover" alt="Upload" />
                        <button 
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 5 && (
                      <>
                        <button 
                          onClick={() => setShowCamera(true)}
                          className="aspect-square rounded-[24px] border-2 border-primary border-solid bg-primary text-white flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/90 transition-all shadow-md"
                        >
                          <div className="p-4 bg-white/20 rounded-full text-white">
                            <Camera size={28} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-white">{t('createListing.liveCamera')}</p>
                            <p className="text-[10px] text-white/80 uppercase font-bold mt-1">{t('createListing.instantScan')}</p>
                          </div>
                        </button>

                        <label className="aspect-square rounded-[24px] border-2 border-dashed border-primary/50 bg-primary/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/10 transition-all group">
                          <div className="p-4 bg-white rounded-full text-primary group-hover:scale-110 transition-transform shadow-sm">
                            <Upload size={28} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-primary">{t('createListing.uploadPhoto')}</p>
                            <p className="text-[10px] text-primary/70 uppercase font-bold mt-1">{t('createListing.fromGallery')}</p>
                          </div>
                          <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                      </>
                    )}
                  </div>

                  <div className="p-4 bg-primary/5 rounded-2xl flex items-start gap-3 border border-primary/10">
                    <Sparkles className="text-primary mt-0.5" size={18} />
                    <p className="text-xs font-semibold text-primary/80 leading-relaxed">
                      {t('createListing.aiMandatory')}
                    </p>
                  </div>

                  <div className="flex justify-end pt-8">
                    <Button onClick={nextStep} disabled={images.length === 0} className="rounded-full h-14 px-10 text-lg font-bold shadow-xl shadow-primary/25 gap-2">
                      {t('common.next', 'Next')} <ChevronRight size={20} />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black">{t('createListing.itemDetails')}</h1>
                <p className="text-secondary-foreground">Provide basic info about your item.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('createListing.itemTitle')}</label>
                  <Input 
                    name="title" 
                    placeholder="e.g., Unopened Organic Almond Milk" 
                    className="h-14 rounded-2xl bg-white border-border text-lg font-semibold"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('navbar.categories')}</label>
                    <select 
                      name="category"
                      className="w-full h-14 rounded-2xl bg-white border border-border px-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="Food & Groceries">{t('categories.food')}</option>
                      <option value="Electronics">{t('categories.electronics')}</option>
                      <option value="Household">{t('categories.household')}</option>
                      <option value="Clothing">{t('categories.clothing')}</option>
                      <option value="Books">{t('categories.books')}</option>
                      <option value="Personal Care">{t('categories.personalCare')}</option>
                      <option value="Gaming">{t('categories.gaming')}</option>
                      <option value="Kids">{t('categories.kids')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('browse.condition')}</label>
                    <select 
                      name="condition"
                      className="w-full h-14 rounded-2xl bg-white border border-border px-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                      value={formData.condition}
                      onChange={handleChange}
                    >
                      <option value="Unopened">{t('condition.unopened', 'Unopened')}</option>
                      <option value="Like New">{t('condition.likeNew', 'Like New')}</option>
                      <option value="Good">{t('condition.good', 'Good')}</option>
                      <option value="Used">{t('condition.used', 'Used')}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('common.description', 'Description')}</label>
                  <textarea 
                    name="description"
                    rows={4}
                    placeholder="Describe the item, reason for selling, any defects etc."
                    className="w-full rounded-2xl bg-white border border-border p-4 text-base font-medium focus:ring-2 focus:ring-primary outline-none"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                {/* ... rest of step 2 ... */}

                {formData.category === 'Food & Groceries' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Expiry Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <Input 
                        name="expiryDate" 
                        type="date"
                        className="h-14 rounded-2xl bg-white border-border pl-12 font-bold"
                        value={formData.expiryDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-8">
                <Button variant="ghost" onClick={prevStep} className="rounded-full h-14 px-8 font-bold gap-2">
                  <ChevronLeft size={20} /> Back
                </Button>
                <Button onClick={nextStep} className="rounded-full h-14 px-10 text-lg font-bold shadow-xl shadow-primary/25 gap-2">
                  Next Step <ChevronRight size={20} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black">Pricing & Logistics</h1>
                <p className="text-secondary-foreground">Set your price and how you'll deliver it.</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Price</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={22} />
                      <Input 
                        name="price" 
                        type="number"
                        placeholder="0"
                        className="h-16 rounded-[24px] bg-white border-2 border-primary/20 pl-12 text-2xl font-black text-primary"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">MRP Reference</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input 
                        name="mrp" 
                        type="number"
                        placeholder="0"
                        className="h-16 rounded-[24px] bg-white border-border pl-12 text-xl font-bold text-muted-foreground"
                        value={formData.mrp}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fulfillment Options</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFormData({...formData, fulfillment: 'pickup'})}
                      className={`p-6 rounded-[32px] border-2 text-left transition-all flex items-center gap-4 ${formData.fulfillment === 'pickup' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border bg-white hover:border-slate-300'}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.fulfillment === 'pickup' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="font-bold">Self Pickup</p>
                        <p className="text-xs text-muted-foreground">Buyer comes to you</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, fulfillment: 'delivery'})}
                      className={`p-6 rounded-[32px] border-2 text-left transition-all flex items-center gap-4 ${formData.fulfillment === 'delivery' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border bg-white hover:border-slate-300'}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.fulfillment === 'delivery' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Truck size={24} />
                      </div>
                      <div>
                        <p className="font-bold">Home Delivery</p>
                        <p className="text-xs text-muted-foreground">You drop it off (+ ₹40)</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pickup Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-muted-foreground" size={20} />
                    <textarea 
                      name="address"
                      rows={3}
                      placeholder="Flat No, Wing, Apartment Name, Area..."
                      className="w-full rounded-[24px] bg-white border border-border pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <Button 
                      onClick={handleGetCurrentLocation}
                      disabled={isLocating}
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-4 right-4 rounded-full font-bold shadow-sm"
                    >
                      {isLocating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
                      Locate Me
                    </Button>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase text-center mt-2">Only shared with verified buyers after confirmation</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8">
                <Button variant="ghost" onClick={prevStep} className="rounded-full h-14 px-8 font-bold gap-2">
                  <ChevronLeft size={20} /> Back
                </Button>
                <Button onClick={nextStep} className="rounded-full h-14 px-10 text-lg font-bold shadow-xl shadow-primary/25 gap-2">
                  Next Step <ChevronRight size={20} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black">Final Review</h1>
                <p className="text-secondary-foreground">Does everything look right?</p>
              </div>

              <div className="bg-white rounded-[40px] border border-border shadow-sm overflow-hidden p-8 space-y-8">
                 <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 aspect-square bg-slate-100 rounded-[32px] overflow-hidden">
                       {images[0] ? <img src={images[0]} className="w-full h-full object-cover" alt="Preview" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Camera size={40} /></div>}
                    </div>
                    <div className="flex-1 space-y-4">
                       <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase">{formData.category}</Badge>
                       <h2 className="text-2xl font-black leading-tight">{formData.title || "Untiled Listing"}</h2>
                       <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-primary">₹{formData.price || "0"}</span>
                          <span className="text-sm text-muted-foreground line-through">₹{formData.mrp || "0"}</span>
                       </div>
                       <div className="flex flex-wrap gap-4 pt-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase">
                             <MapPin size={14} className="text-primary" /> {formData.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase">
                             <Package size={14} className="text-primary" /> {formData.condition}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-[32px] space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fulfillment Method</h3>
                    <p className="font-bold flex items-center gap-2">
                       {formData.fulfillment === 'pickup' ? <><Package size={18} className="text-primary" /> Self Pickup</> : <><Truck size={18} className="text-primary" /> Delivery (+ ₹40)</>}
                    </p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-8">
                <Button variant="ghost" onClick={prevStep} className="rounded-full h-14 px-8 font-bold gap-2">
                  <ChevronLeft size={20} /> Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="rounded-full h-14 px-12 text-lg font-black shadow-xl shadow-primary/25 gap-2">
                  {loading ? <Loader2 size={24} className="animate-spin" /> : <>Publish Listing <CheckCircle2 size={20} /></>}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateListing;