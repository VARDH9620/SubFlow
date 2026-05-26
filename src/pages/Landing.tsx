import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, BarChart3, Users, ArrowRight, CheckCircle, Cloud, GitBranch, Mail } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export default function Landing() {
  const features = [
    { icon: <Shield className="w-6 h-6" />, title: 'Secure Management', desc: 'Enterprise-grade security with role-based access control and audit logging.' },
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
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 15 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.08] dark:opacity-[0.04] pointer-events-none z-0" />

      {/* Glowing background animated blur orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-gradient-to-br from-primary/20 to-indigo-500/25 rounded-full blur-3xl opacity-40 dark:opacity-20 animate-pulse pointer-events-none z-0" />
      <div className="absolute top-[15%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-purple-500/15 to-pink-500/15 rounded-full blur-3xl opacity-40 dark:opacity-20 animate-pulse pointer-events-none z-0" style={{ animationDelay: '3.5s' }} />

      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-border/50 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SubFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link to="/register" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
          <ThemeToggle compact />
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          {/* AI Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-6 border border-primary/20 shadow-sm animate-bounce" style={{ animationDuration: '3s' }}>
            <Zap className="w-3.5 h-3.5" /> Now with AI-powered insights
          </motion.div>

          {/* Hero Headings */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
            Manage all your<br />
            <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">subscriptions</span> in one place
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SubFlow is the all-in-one subscription management platform that helps businesses
            track, manage, and optimize their service subscriptions with powerful analytics
            and automated billing.
          </motion.p>

          {/* Hero Actions */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-6 py-3 bg-card hover:bg-muted text-foreground font-semibold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all border border-border shadow-sm flex items-center justify-center">
              Sign In
            </Link>
          </motion.div>
          
          <motion.p variants={itemVariants} className="mt-4 text-xs text-muted-foreground/80">
            No credit card required · 14-day free trial · Cancel anytime
          </motion.p>

          {/* About Company Showcase Card */}
          <motion.div variants={itemVariants} className="mt-14 max-w-2xl mx-auto relative group">
            {/* Background Gradient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-indigo-500/30 rounded-2xl blur opacity-20 group-hover:opacity-35 transition duration-1000 group-hover:duration-200" />
            
            {/* Card Content */}
            <div className="relative bg-card/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-border/80 shadow-lg flex flex-col md:flex-row gap-6 md:gap-8 items-stretch text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
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
      <section id="features" className="py-24 px-6 bg-card/50 backdrop-blur-sm border-t border-border/40 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Everything you need</h2>
            <p className="mt-3 text-muted-foreground">Powerful features to manage your subscriptions effortlessly</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 -translate-y-0.5 hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 relative z-10 bg-background/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Simple, transparent pricing</h2>
            <p className="mt-3 text-muted-foreground">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border-2 transition-all bg-card ${plan.popular ? 'border-primary shadow-xl shadow-primary-500/10 scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/20 z-10' : 'border-border hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-lg'} duration-300 flex flex-col justify-between`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-[10px] font-semibold tracking-wide uppercase rounded-full">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/register" className={`mt-8 block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${plan.popular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-muted dark:bg-slate-700 text-muted-foreground dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 dark:bg-slate-950 text-muted-foreground/80 border-t border-gray-800 dark:border-slate-800 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">SubFlow</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} SubFlow. Built for DBMS Project.</p>
        </div>
      </footer>
    </div>
  );
}
