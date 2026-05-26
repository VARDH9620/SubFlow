import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, Shield, BarChart3, Users, ArrowRight, CheckCircle, 
  Cloud, GitBranch, Mail, Globe, Cpu, Layers, Send 
} from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';

function DashboardMockup() {
  const mockSpendData = [
    { month: 'Jan', spend: 400 },
    { month: 'Feb', spend: 850 },
    { month: 'Mar', spend: 720 },
    { month: 'Apr', spend: 1100 },
    { month: 'May', spend: 950 },
    { month: 'Jun', spend: 1420 },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-2xl overflow-hidden p-4 md:p-6 z-10 group">
      {/* Glossy sheen border */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/10 pointer-events-none" />
      
      {/* Top navbar of mockup */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/85" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/85" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/85" />
          <span className="ml-2 font-mono text-[10px] bg-muted px-2.5 py-0.5 rounded border border-border/50 select-none">app.subflow.io/dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-foreground">Live Simulation Mode</span>
        </div>
      </div>

      <div className="flex gap-4 pt-4 h-[320px] overflow-hidden">
        {/* Mockup Sidebar */}
        <div className="hidden sm:flex flex-col gap-2 w-40 shrink-0 border-r border-border/50 pr-4 text-left">
          <div className="h-7 bg-primary/10 rounded-lg flex items-center gap-2 px-2 text-primary font-semibold text-xs select-none">
            <BarChart3 className="w-3.5 h-3.5" /> Dashboard
          </div>
          <div className="h-7 hover:bg-muted rounded-lg flex items-center gap-2 px-2 text-muted-foreground text-xs transition-colors cursor-pointer select-none">
            <Users className="w-3.5 h-3.5" /> Team members
          </div>
          <div className="h-7 hover:bg-muted rounded-lg flex items-center gap-2 px-2 text-muted-foreground text-xs transition-colors cursor-pointer select-none">
            <Shield className="w-3.5 h-3.5" /> Permissions
          </div>
          <div className="h-7 hover:bg-muted rounded-lg flex items-center gap-2 px-2 text-muted-foreground text-xs transition-colors cursor-pointer select-none">
            <Zap className="w-3.5 h-3.5" /> Integrations
          </div>
        </div>

        {/* Mockup Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 text-left">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/30 border border-border/50 p-3 rounded-xl">
              <p className="text-[10px] text-muted-foreground">Monthly Spend</p>
              <h4 className="text-base font-bold text-foreground mt-0.5">$1,420.00</h4>
              <span className="text-[9px] text-emerald-500 font-semibold mt-0.5 inline-block">↓ 12% vs last month</span>
            </div>
            <div className="bg-muted/30 border border-border/50 p-3 rounded-xl">
              <p className="text-[10px] text-muted-foreground">Active Plans</p>
              <h4 className="text-base font-bold text-foreground mt-0.5">14 Plans</h4>
              <span className="text-[9px] text-muted-foreground mt-0.5 inline-block">Across 5 departments</span>
            </div>
            <div className="bg-muted/30 border border-border/50 p-3 rounded-xl">
              <p className="text-[10px] text-muted-foreground">Cost Avoided</p>
              <h4 className="text-base font-bold text-emerald-500 mt-0.5">$340.00</h4>
              <span className="text-[9px] text-emerald-500 font-semibold mt-0.5 inline-block">↑ AI Optimizer</span>
            </div>
          </div>

          {/* Simple Area Chart representation */}
          <div className="flex-1 bg-muted/20 border border-border/40 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">SaaS Cost Growth</span>
              <span className="text-[10px] text-muted-foreground bg-card px-2 py-0.5 rounded border border-border/50 font-mono">H1 2026</span>
            </div>
            <div className="h-32 flex items-end gap-2.5 pt-4 px-2">
              {mockSpendData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  {/* Glowing Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.spend / 1500) * 100}%` }}
                    transition={{ delay: i * 0.15 + 0.6, duration: 1.2, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-primary to-indigo-400 rounded-t-md relative group/bar cursor-pointer"
                  >
                    {/* Tooltip on hover bar */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                      ${d.spend}
                    </div>
                  </motion.div>
                  <span className="text-[9px] text-muted-foreground font-mono">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Metric Card 1 */}
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 2, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 -left-12 hidden lg:flex items-center gap-3 bg-card/95 backdrop-blur border border-border/80 p-3 rounded-xl shadow-xl z-20 max-w-[190px] text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
          <Zap className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold">Cost Saving Active</p>
          <p className="text-xs font-bold text-foreground">Avoided $1,240/yr</p>
        </div>
      </motion.div>

      {/* Floating Metric Card 2 */}
      <motion.div
        animate={{ y: [0, 10, 0], x: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-24 -right-12 hidden lg:flex items-center gap-3 bg-card/95 backdrop-blur border border-border/80 p-3 rounded-xl shadow-xl z-20 max-w-[190px] text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold">Alert Triggered</p>
          <p className="text-xs font-bold text-foreground">Plan renewal in 3 days</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <Shield className="w-6 h-6 animate-pulse" />, title: 'Secure Management', desc: 'Enterprise-grade security with role-based access control and audit logging.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Real-time Analytics', desc: 'Comprehensive dashboards with revenue tracking and user insights.' },
    { icon: <Users className="w-6 h-6" />, title: 'Multi-tenant', desc: 'Support for unlimited users with isolated data and custom permissions.' },
    { icon: <Cloud className="w-6 h-6" />, title: 'Cloud Native', desc: 'Built for the cloud with automatic scaling and high availability.' },
    { icon: <GitBranch className="w-6 h-6" />, title: 'API First', desc: 'RESTful APIs for seamless integration with your existing tools.' },
    { icon: <Mail className="w-6 h-6" />, title: 'Smart Notifications', desc: 'Automated alerts for billing, renewals, and account activity.' },
  ];

  const plans = [
    { name: 'Starter', price: '9.99', features: ['1 Service', 'Basic Analytics', 'Email Support', '5GB Storage'], popular: false },
    { name: 'Professional', price: '29.99', features: ['5 Services', 'Advanced Analytics', 'Priority Support', '50GB Storage', 'API Access'], popular: true },
    { name: 'Enterprise', price: '99.99', features: ['Unlimited Services', 'Custom Analytics', '24/7 Support', 'Unlimited Storage', 'API Access', 'SSO', 'Custom Domain'], popular: false },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 85, 
        damping: 16 
      } 
    }
  };

  const clients = [
    { name: 'Vercel', icon: <Send className="w-3.5 h-3.5" /> },
    { name: 'Stripe', icon: <Layers className="w-3.5 h-3.5" /> },
    { name: 'Hooli', icon: <Globe className="w-3.5 h-3.5" /> },
    { name: 'Initech', icon: <Cpu className="w-3.5 h-3.5" /> },
    { name: 'Acme Corp', icon: <Cloud className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Structural Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] opacity-[0.09] dark:opacity-[0.05] pointer-events-none z-0" />

      {/* GPU Accelerated Moving Gradient Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-gradient-to-br from-primary/25 to-indigo-500/25 rounded-full blur-3xl opacity-40 dark:opacity-20 animate-pulse pointer-events-none z-0" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[25%] right-[-15%] w-[50%] h-[50%] bg-gradient-to-bl from-purple-500/15 to-pink-500/15 rounded-full blur-3xl opacity-35 dark:opacity-15 animate-pulse pointer-events-none z-0" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-gradient-to-tr from-blue-500/15 to-indigo-500/15 rounded-full blur-3xl opacity-30 dark:opacity-10 animate-pulse pointer-events-none z-0" style={{ animationDuration: '9s', animationDelay: '1s' }} />

      {/* Orbiting Ring Decoration */}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 border border-border/20 rounded-full pointer-events-none z-0 hidden lg:block animate-[spin_60s_linear_infinite] opacity-50">
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full -translate-x-1/2" />
      </div>

      {/* Floating Sparkle Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-primary/15 dark:bg-primary/5 rounded-full pointer-events-none z-0"
          style={{
            width: Math.random() * 16 + 6,
            height: Math.random() * 16 + 6,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -120 - 40, 0],
            x: [0, Math.random() * 60 - 30, 0],
            scale: [1, 1.25, 0.8, 1],
            opacity: [0.15, 0.5, 0.15]
          }}
          transition={{
            duration: Math.random() * 12 + 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Nav */}
      <nav className={`fixed top-0 w-full transition-all duration-300 z-50 ${scrolled ? 'bg-card/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-border shadow-md shadow-foreground/[0.01]' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow shadow-primary/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">SubFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</a>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Sign in</Link>
            <Link to="/register" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-primary/20">
              Get Started
            </Link>
          </div>
          <ThemeToggle compact />
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Glowing Pill Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-6 border border-primary/20 shadow-sm animate-bounce cursor-pointer hover:bg-primary/15 transition-colors" style={{ animationDuration: '3s' }}>
            <Zap className="w-3.5 h-3.5 text-primary" /> Now with AI-powered insights
          </motion.div>

          {/* Immersive Hero Text */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
            Manage all your<br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">subscriptions</span> in one place
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SubFlow is the all-in-one subscription intelligence platform that helps businesses
            track, audit, and optimize software spend with real-time analytics
            and automated renewal management.
          </motion.p>

          {/* Hero Action Buttons with lift effects */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-7 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/95 hover:scale-[1.03] active:scale-[0.97] hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-7 py-3.5 bg-card hover:bg-muted text-foreground font-semibold rounded-xl hover:scale-[1.03] active:scale-[0.97] hover:-translate-y-0.5 transition-all border border-border shadow-md shadow-foreground/[0.01] flex items-center justify-center">
              Sign In
            </Link>
          </motion.div>
          
          <motion.p variants={itemVariants} className="mt-4 text-xs text-muted-foreground/70">
            No credit card required · 14-day free trial · Cancel anytime
          </motion.p>

          {/* Interactive Live Mockup Dashboard */}
          <motion.div variants={itemVariants}>
            <DashboardMockup />
          </motion.div>

          {/* Trust / Social Proof Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 pt-10 border-t border-border/40 text-center"
          >
            <p className="text-[10px] font-bold text-muted-foreground/80 tracking-widest uppercase mb-6">Trusted by fast-scaling teams worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 dark:opacity-40">
              {clients.map(c => (
                <div key={c.name} className="flex items-center gap-1.5 hover:opacity-100 hover:scale-105 transition-all duration-300 text-sm font-semibold text-foreground cursor-pointer select-none">
                  {c.icon}
                  {c.name}
                </div>
              ))}
            </div>

            {/* Key Live Usage Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12 px-4">
              <div className="bg-card/45 backdrop-blur-sm border border-border/40 p-5 rounded-2xl shadow-sm text-center">
                <p className="text-2xl font-extrabold text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">12,000+</p>
                <p className="text-xs text-muted-foreground mt-1">Subscriptions Monitored</p>
              </div>
              <div className="bg-card/45 backdrop-blur-sm border border-border/40 p-5 rounded-2xl shadow-sm text-center">
                <p className="text-2xl font-extrabold text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">99.99%</p>
                <p className="text-xs text-muted-foreground mt-1">Service Uptime Guaranteed</p>
              </div>
              <div className="bg-card/45 backdrop-blur-sm border border-border/40 p-5 rounded-2xl shadow-sm text-center">
                <p className="text-2xl font-extrabold text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">$2.4M+</p>
                <p className="text-xs text-muted-foreground mt-1">SaaS Savings Tracked</p>
              </div>
            </div>
          </motion.div>

          {/* About Company Showcase Card */}
          <motion.div variants={itemVariants} className="mt-20 max-w-2xl mx-auto relative group">
            {/* Background Gradient Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-indigo-500/30 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            
            {/* Card Content */}
            <div className="relative bg-card/85 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-border/80 shadow-lg flex flex-col md:flex-row gap-6 md:gap-8 items-stretch text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-primary/10 text-primary mb-3.5 border border-primary/20">
                    Platform Overview
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 leading-tight">
                    Powering Subscription Intelligence
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    SubFlow is designed to give modern organizations full visibility and control over their software investments. We consolidate multi-tenant operations, granular billing analytics, and tenant management into a single, high-performance portal.
                  </p>
                </div>
                <div className="mt-4 text-[11px] font-semibold text-primary flex items-center gap-1 cursor-pointer hover:underline">
                  Learn more about our technology <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Vertical divider on desktop */}
              <div className="hidden md:block w-px bg-border/50 self-stretch" />

              {/* Key Highlights */}
              <div className="flex flex-col justify-center gap-4 min-w-[200px]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-foreground">SaaS Cost Control</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Save up to 30% on unused licenses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/20">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-foreground">Bank-Grade Security</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Isolated databases and RBAC security.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-foreground">Instant Integration</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">API-first architecture built to scale.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-card/65 backdrop-blur-md border-t border-border/40 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Everything you need</h2>
            <p className="mt-3 text-muted-foreground text-sm max-w-lg mx-auto">Fully features engineered to make subscription overhead entirely transparent and optimized.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border/40 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/[0.03] -translate-y-0.5 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                <div className="absolute -inset-2 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors border border-primary/10 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 relative z-10 bg-background/70 backdrop-blur-sm border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Simple, transparent pricing</h2>
            <p className="mt-3 text-muted-foreground text-sm">Choose the plan that matches your business velocity</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative rounded-2xl p-8 border-2 transition-all bg-card/90 backdrop-blur-sm ${
                  plan.popular 
                    ? 'border-primary shadow-xl shadow-primary-500/10 scale-105 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary-500/20 z-10' 
                    : 'border-border hover:border-primary/45 hover:-translate-y-1 hover:shadow-xl'
                } duration-300 flex flex-col justify-between group/price`}
              >
                {/* Outer Glow Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-indigo-500/10 rounded-2xl opacity-0 group-hover/price:opacity-100 transition duration-500 blur-sm pointer-events-none -z-10" />

                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-[9px] font-bold tracking-widest uppercase rounded-full shadow shadow-primary/25 animate-pulse">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">${plan.price}</span>
                    <span className="text-xs text-muted-foreground">/month</span>
                  </div>
                  <ul className="mt-6 space-y-3.5">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/register" className={`mt-8 block text-center py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${plan.popular ? 'bg-primary text-white hover:bg-primary/95 shadow shadow-primary/20' : 'bg-muted dark:bg-slate-700 text-muted-foreground dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600 border border-border/50'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-slate-950 text-slate-400 border-t border-border/30 relative z-10 overflow-hidden">
        {/* Glow Line Separator */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-[1px]" />
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow shadow-primary/10">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold tracking-tight">SubFlow</span>
          </div>
          <div className="flex items-center gap-8 text-xs text-slate-500 font-medium">
            <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a>
            <span className="text-slate-700">|</span>
            <p>© {new Date().getFullYear()} SubFlow. Built for DBMS Project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
