/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Headphones, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  MessageCircle, 
  Mail,
  Search,
  AlertCircle,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

// --- Types ---
interface Package {
  id: string;
  name: string;
  diamonds: number;
  bonus?: number;
  price: string;
  isPopular?: boolean;
}

interface UserInfo {
  userId: string;
  serverId: string;
  ign: string;
  contact: string;
}

// --- Constants ---
const PACKAGES: Package[] = [
  { id: 'p1', name: '86 Diamonds', diamonds: 86, price: '₹85' },
  { id: 'p2', name: '172 Diamonds', diamonds: 172, price: '₹165' },
  { id: 'p3', name: '257 Diamonds', diamonds: 257, price: '₹245', isPopular: true },
  { id: 'p4', name: '344 Diamonds', diamonds: 344, price: '₹325' },
  { id: 'p5', name: '429 Diamonds', diamonds: 429, price: '₹405' },
  { id: 'p6', name: '514 Diamonds', diamonds: 514, price: '₹485' },
  { id: 'p7', name: 'Weekly Diamond Pass', diamonds: 210, price: '₹160', bonus: 70 },
];

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI (GPay/PhonePe)', icon: <Zap className="w-5 h-5" /> },
  { id: 'card', name: 'Debit/Credit Card', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'wallet', name: 'Wallets (Paytm)', icon: <Smartphone className="w-5 h-5" /> },
];

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({ userId: '', serverId: '', ign: '', contact: '' });
  const [step, setStep] = useState<'home' | 'recharge' | 'checkout' | 'success' | 'auth' | 'admin'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });

  // --- Handlers ---
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock authentication
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Fake Admin Credentials
      if (authForm.email === 'admin@mlbb.com' && authForm.password === 'adminpassword') {
        setIsLoggedIn(true);
        setIsAdmin(true);
        setStep('admin');
      } else {
        setIsLoggedIn(true);
        setIsAdmin(false);
        setStep('home');
      }
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setStep('home');
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setStep('recharge');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.userId && userInfo.serverId) {
      setStep('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 2000);
  };

  const checkStatus = () => {
    if (orderId) {
      setOrderStatus('Processing');
      setTimeout(() => setOrderStatus('Completed'), 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setStep('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <Zap className="text-gaming-dark fill-current" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">MLBB<span className="text-neon-blue">RECHARGE</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium">
            <button onClick={() => setStep('home')} className="hover:text-neon-blue transition-colors">Home</button>
            <a href="#packages" className="hover:text-neon-blue transition-colors">Packages</a>
            <a href="#status" className="hover:text-neon-blue transition-colors">Order Status</a>
            <a href="#support" className="hover:text-neon-blue transition-colors">Support</a>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <button 
                    onClick={() => setStep('admin')}
                    className="text-sm font-bold text-neon-blue hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                  </button>
                )}
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-neon-purple">{isAdmin ? 'AD' : 'JD'}</span>
                  </div>
                  <span className="text-sm">{isAdmin ? 'Admin User' : 'John Doe'}</span>
                </div>
                <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition-colors">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setStep('auth'); setAuthMode('login'); }}
                  className="text-sm font-medium hover:text-neon-blue transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => { setStep('auth'); setAuthMode('signup'); }}
                  className="bg-white/5 border border-white/10 px-5 py-2 rounded-lg hover:bg-white/10 transition-all text-sm font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-gaming-dark border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
            >
              <button onClick={() => { setStep('home'); setIsMenuOpen(false); }} className="text-left py-2">Home</button>
              <a href="#packages" onClick={() => setIsMenuOpen(false)} className="py-2">Packages</a>
              <a href="#status" onClick={() => setIsMenuOpen(false)} className="py-2">Order Status</a>
              <a href="#support" onClick={() => setIsMenuOpen(false)} className="py-2">Support</a>
              
              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <button 
                        onClick={() => { setStep('admin'); setIsMenuOpen(false); }}
                        className="text-neon-blue font-bold flex items-center gap-2 py-2"
                      >
                        <ShieldCheck className="w-5 h-5" /> Admin Panel
                      </button>
                    )}
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-neon-purple">{isAdmin ? 'AD' : 'JD'}</span>
                      </div>
                      <span>{isAdmin ? 'Admin User' : 'John Doe'}</span>
                    </div>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left text-gray-400 py-2">Logout</button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { setStep('auth'); setAuthMode('login'); setIsMenuOpen(false); }}
                      className="text-left py-2"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => { setStep('auth'); setAuthMode('signup'); setIsMenuOpen(false); }}
                      className="btn-primary w-full text-center"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        {step === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://picsum.photos/seed/mlbb-hero/1920/1080?blur=2" 
                  alt="Hero Background" 
                  className="w-full h-full object-cover opacity-30"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark via-gaming-dark/50 to-transparent" />
              </div>

              <div className="max-w-7xl mx-auto px-4 relative z-10 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block px-4 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-sm font-bold mb-6 tracking-wider uppercase">
                    Official & Secure Recharge
                  </span>
                  <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    Instant <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">MLBB Diamonds</span> <br />Recharge
                  </h1>
                  <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl">
                    Level up your gaming experience with instant diamond delivery. Fast, secure, and trusted by thousands of players.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button 
                      onClick={() => setStep('recharge')}
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      Buy Diamonds Now <ArrowRight className="w-5 h-5" />
                    </button>
                    <a 
                      href="#status"
                      className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center"
                    >
                      Check Order Status
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-20 bg-gaming-card/30">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center p-8 gaming-card">
                    <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 flex items-center justify-center mb-6">
                      <Zap className="text-neon-blue w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
                    <p className="text-gray-400">Diamonds are credited to your account within minutes of payment.</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-8 gaming-card">
                    <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 flex items-center justify-center mb-6">
                      <ShieldCheck className="text-neon-purple w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                    <p className="text-gray-400">All transactions are encrypted and processed through secure gateways.</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-8 gaming-card">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                      <Headphones className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                    <p className="text-gray-400">Our dedicated team is always ready to help you with any issues.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Packages Preview */}
            <section id="packages" className="py-20">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Select Your Package</h2>
                  <p className="text-gray-400">Choose from our most popular diamond bundles</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {PACKAGES.map((pkg) => (
                    <motion.div 
                      key={pkg.id}
                      whileHover={{ y: -5 }}
                      className={`gaming-card p-6 flex flex-col items-center text-center relative overflow-hidden ${pkg.isPopular ? 'border-neon-purple/50' : ''}`}
                    >
                      {pkg.isPopular && (
                        <div className="absolute top-0 right-0 bg-neon-purple text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                          Popular
                        </div>
                      )}
                      <div className="w-12 h-12 mb-4">
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" 
                          alt="Diamond" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h4 className="font-bold text-lg mb-1">{pkg.name}</h4>
                      {pkg.bonus && <p className="text-neon-blue text-xs font-bold mb-4">+{pkg.bonus} Bonus</p>}
                      <div className="mt-auto w-full">
                        <p className="text-2xl font-display font-bold mb-4">{pkg.price}</p>
                        <button 
                          onClick={() => handlePackageSelect(pkg)}
                          className={`w-full py-2 rounded-lg font-bold transition-all ${pkg.isPopular ? 'bg-neon-purple hover:bg-neon-purple/80' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                          Buy Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {step === 'recharge' && (
          <section className="py-20 max-w-4xl mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gaming-card p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-10">
                <button onClick={() => setStep('home')} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl md:text-3xl font-display font-bold">Player Information</h2>
              </div>

              <div className="bg-neon-blue/5 border border-neon-blue/20 rounded-xl p-4 mb-8 flex gap-3">
                <AlertCircle className="text-neon-blue shrink-0" />
                <p className="text-sm text-neon-blue/80">
                  Please ensure your User ID and Server ID are correct. Diamonds cannot be refunded if sent to the wrong ID.
                </p>
              </div>

              <form onSubmit={handleUserInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">User ID</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 123456789" 
                      className="input-field"
                      value={userInfo.userId}
                      onChange={(e) => setUserInfo({...userInfo, userId: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Server ID</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 1234" 
                      className="input-field"
                      value={userInfo.serverId}
                      onChange={(e) => setUserInfo({...userInfo, serverId: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">In-Game Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. LegendPlayer" 
                    className="input-field"
                    value={userInfo.ign}
                    onChange={(e) => setUserInfo({...userInfo, ign: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Contact Email/Phone</label>
                  <input 
                    required
                    type="text" 
                    placeholder="For order updates" 
                    className="input-field"
                    value={userInfo.contact}
                    onChange={(e) => setUserInfo({...userInfo, contact: e.target.value})}
                  />
                </div>

                <div className="pt-6 border-t border-white/5 mt-10">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-gray-400 text-sm">Selected Package</p>
                      <p className="font-bold text-lg">{selectedPackage?.name}</p>
                    </div>
                    <p className="text-2xl font-display font-bold text-neon-blue">{selectedPackage?.price}</p>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Proceed to Checkout
                  </button>
                </div>
              </form>
            </motion.div>
          </section>
        )}

        {step === 'checkout' && (
          <section className="py-20 max-w-4xl mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gaming-card p-8 md:p-12"
            >
              <h2 className="text-3xl font-display font-bold mb-10 text-center">Order Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider text-sm">Player Details</h3>
                  <div className="bg-white/5 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between"><span className="text-gray-400">User ID</span><span>{userInfo.userId}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Server ID</span><span>{userInfo.serverId}</span></div>
                    {userInfo.ign && <div className="flex justify-between"><span className="text-gray-400">IGN</span><span>{userInfo.ign}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-400">Contact</span><span>{userInfo.contact}</span></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider text-sm">Package Details</h3>
                  <div className="bg-white/5 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between"><span className="text-gray-400">Item</span><span>{selectedPackage?.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Price</span><span>{selectedPackage?.price}</span></div>
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2 font-bold">
                      <span>Total</span>
                      <span className="text-neon-blue">{selectedPackage?.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider text-sm">Select Payment Method</h3>
                <div className="grid grid-cols-1 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-neon-blue/50 transition-all group">
                      <input type="radio" name="payment" className="w-5 h-5 accent-neon-blue" defaultChecked={method.id === 'upi'} />
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-neon-blue/10 transition-all">
                        {method.icon}
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-4">
                <button 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-4"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-gaming-dark border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Pay & Recharge Now <ShieldCheck className="w-5 h-5" /></>
                  )}
                </button>
                <button onClick={() => setStep('recharge')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Go Back & Edit Details
                </button>
              </div>
            </motion.div>
          </section>
        )}
        {step === 'success' && (
          <section className="py-20 max-w-2xl mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gaming-card p-12"
            >
              <div className="w-24 h-24 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-8 neon-glow-blue">
                <CheckCircle2 className="text-neon-blue w-12 h-12" />
              </div>
              <h2 className="text-4xl font-display font-bold mb-4">Payment Successful!</h2>
              <p className="text-gray-400 mb-8">
                Your order is being processed. Diamonds will be credited to your account (ID: {userInfo.userId}) within 5-10 minutes.
              </p>
              <div className="bg-white/5 p-6 rounded-xl mb-10 inline-block">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
                <p className="font-mono text-xl font-bold text-neon-purple">MLBB-{(Math.random() * 1000000).toFixed(0)}</p>
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={() => setStep('home')} className="btn-primary">
                  Back to Home
                </button>
                <button className="flex items-center justify-center gap-2 text-neon-blue hover:underline">
                  <MessageCircle className="w-5 h-5" /> Contact WhatsApp Support
                </button>
              </div>
            </motion.div>
          </section>
        )}

        {step === 'auth' && (
          <section className="py-20 max-w-md mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gaming-card p-8 md:p-10"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-display font-bold mb-2">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {authMode === 'login' ? 'Login to manage your recharges' : 'Join thousands of MLBB players'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-5">
                {authMode === 'signup' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe" 
                      className="input-field"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="name@example.com" 
                    className="input-field"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Password</label>
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••" 
                    className="input-field"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  />
                </div>

                {authMode === 'login' && (
                  <div className="text-right">
                    <button type="button" className="text-xs text-neon-blue hover:underline">Forgot password?</button>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-gaming-dark border-t-transparent rounded-full animate-spin" />
                  ) : (
                    authMode === 'login' ? 'Login' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-sm text-gray-400">
                  {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="ml-2 text-neon-purple font-bold hover:underline"
                  >
                    {authMode === 'login' ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>
            </motion.div>
            <button 
              onClick={() => setStep('home')}
              className="mt-6 w-full text-center text-sm text-gray-500 hover:text-white transition-colors"
            >
              Back to Home
            </button>
          </section>
        )}

        {step === 'admin' && (
          <section className="py-12 max-w-7xl mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-display font-bold">Admin Dashboard</h2>
                  <p className="text-gray-400">Overview of MLBB Recharge performance and orders.</p>
                </div>
                <button 
                  onClick={() => setStep('home')}
                  className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> Back to Site
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: '₹1,24,500', icon: <CreditCard className="text-neon-blue" />, trend: '+12.5%' },
                  { label: 'Total Orders', value: '1,452', icon: <Zap className="text-neon-purple" />, trend: '+8.2%' },
                  { label: 'Active Users', value: '892', icon: <Smartphone className="text-green-400" />, trend: '+5.1%' },
                  { label: 'Pending Delivery', value: '14', icon: <AlertCircle className="text-yellow-400" />, trend: '-2.4%' },
                ].map((stat, i) => (
                  <div key={i} className="gaming-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders Table */}
              <div className="gaming-card overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-xl font-bold">Recent Orders</h3>
                  <button className="text-neon-blue text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.02] text-xs uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-6 py-4 font-medium">Order ID</th>
                        <th className="px-6 py-4 font-medium">User ID</th>
                        <th className="px-6 py-4 font-medium">Package</th>
                        <th className="px-6 py-4 font-medium">Amount</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { id: 'MLBB-892341', user: '123456789', pkg: '514 Diamonds', amount: '₹485', status: 'Completed', date: '2026-03-01 10:24' },
                        { id: 'MLBB-892342', user: '987654321', pkg: 'Weekly Pass', amount: '₹160', status: 'Processing', date: '2026-03-01 10:28' },
                        { id: 'MLBB-892343', user: '456123789', pkg: '172 Diamonds', amount: '₹165', status: 'Completed', date: '2026-03-01 10:35' },
                        { id: 'MLBB-892344', user: '789456123', pkg: '429 Diamonds', amount: '₹405', status: 'Pending', date: '2026-03-01 10:42' },
                        { id: 'MLBB-892345', user: '321654987', pkg: '86 Diamonds', amount: '₹85', status: 'Completed', date: '2026-03-01 10:50' },
                      ].map((order, i) => (
                        <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4 font-mono text-sm text-neon-purple">{order.id}</td>
                          <td className="px-6 py-4 text-sm">{order.user}</td>
                          <td className="px-6 py-4 text-sm">{order.pkg}</td>
                          <td className="px-6 py-4 text-sm font-bold">{order.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                              order.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 
                              order.status === 'Processing' ? 'bg-neon-blue/10 text-neon-blue' : 
                              'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="gaming-card p-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                    <Search className="text-neon-blue" />
                  </div>
                  <div>
                    <p className="font-bold">Search Orders</p>
                    <p className="text-xs text-gray-500">Find any transaction instantly</p>
                  </div>
                </div>
                <div className="gaming-card p-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                    <MessageCircle className="text-neon-purple" />
                  </div>
                  <div>
                    <p className="font-bold">Support Tickets</p>
                    <p className="text-xs text-gray-500">3 new tickets pending</p>
                  </div>
                </div>
                <div className="gaming-card p-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <ShieldCheck className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold">System Health</p>
                    <p className="text-xs text-gray-500">All systems operational</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}
        {step === 'home' && (
          <section id="status" className="py-20 bg-gaming-card/30">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-display font-bold mb-4">Check Order Status</h2>
              <p className="text-gray-400 mb-10">Enter your Order ID to track your diamond delivery</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Enter Order ID (e.g. MLBB-123456)" 
                  className="input-field flex-grow"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
                <button 
                  onClick={checkStatus}
                  className="bg-white text-gaming-dark font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" /> Check Status
                </button>
              </div>
              
              <AnimatePresence>
                {orderStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 gaming-card border-neon-blue/30 flex items-center justify-between"
                  >
                    <div className="text-left">
                      <p className="text-xs text-gray-500 uppercase">Status for {orderId}</p>
                      <p className={`text-xl font-bold ${orderStatus === 'Completed' ? 'text-green-400' : 'text-neon-blue'}`}>
                        {orderStatus}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      {orderStatus === 'Completed' ? <CheckCircle2 className="text-green-400" /> : <div className="w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Support Section */}
        {step === 'home' && (
          <section id="support" className="py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Need Help?</h2>
                  <p className="text-gray-400 mb-10 text-lg">
                    Our support team is available 24/7 to assist you with your recharge or any other queries.
                  </p>
                  <div className="space-y-4">
                    <button className="w-full flex items-center gap-4 p-6 gaming-card hover:border-green-500/50 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <MessageCircle className="text-green-500 w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold">WhatsApp Support</p>
                        <p className="text-sm text-gray-500">Instant response (9 AM - 11 PM)</p>
                      </div>
                      <ChevronRight className="ml-auto text-gray-600" />
                    </button>
                    <button className="w-full flex items-center gap-4 p-6 gaming-card hover:border-neon-blue/50 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                        <Mail className="text-neon-blue w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold">Email Support</p>
                        <p className="text-sm text-gray-500">support@mlbbrecharge.com</p>
                      </div>
                      <ChevronRight className="ml-auto text-gray-600" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {[
                      { q: "How long does delivery take?", a: "Most orders are delivered instantly. However, during peak times or server maintenance, it might take up to 15 minutes." },
                      { q: "What if I enter the wrong ID?", a: "Unfortunately, we cannot refund or redirect diamonds once the order is processed. Please double-check your ID before payment." },
                      { q: "Are payments secure?", a: "Yes, we use industry-standard encryption and trusted payment gateways to ensure your data and money are safe." },
                    ].map((faq, i) => (
                      <div key={i} className="gaming-card p-6">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-neon-blue" /> {faq.q}
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gaming-card py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                  <Zap className="text-gaming-dark w-4 h-4 fill-current" />
                </div>
                <span className="font-display font-bold text-lg">MLBB<span className="text-neon-blue">RECHARGE</span></span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm mb-6">
                The most trusted platform for instant Mobile Legends: Bang Bang diamond recharges. Fast, secure, and reliable.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><button onClick={() => setStep('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><a href="#packages" className="hover:text-white transition-colors">Diamond Packages</a></li>
                <li><a href="#status" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#support" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-600">
              &copy; 2026 MLBB Recharge. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
              <span>Not affiliated with Moonton</span>
              <span className="hidden md:inline">•</span>
              <span>Secure & Encrypted Payments</span>
              <span className="hidden md:inline">•</span>
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
