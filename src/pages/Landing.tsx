import { Link } from 'react-router-dom';
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

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-slate-100">SubFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200">Pricing</a>
            <Link to="/login" className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200">Sign in</Link>
            <Link to="/register" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Get Started
            </Link>
          </div>
          <ThemeToggle compact />
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> Now with AI-powered insights
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight tracking-tight">
            Manage all your<br />
            <span className="text-primary-600 dark:text-primary-400">subscriptions</span> in one place
          </h1>
          <p className="mt-6 text-lg text-gray-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            SubFlow is the all-in-one subscription management platform that helps businesses
            track, manage, and optimize their service subscriptions with powerful analytics
            and automated billing.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/register" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25 flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all border border-gray-200 dark:border-slate-600">
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400 dark:text-slate-500">No credit card required · 14-day free trial · Cancel anytime</p>

          {/* Demo credentials */}
          <div className="mt-8 max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-slate-400">
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2.5 border border-gray-100 dark:border-slate-600">
                <p className="font-semibold text-gray-800 dark:text-slate-200">Admin</p>
                <p>admin@subflow.io</p>
                <p>admin123</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2.5 border border-gray-100 dark:border-slate-600">
                <p className="font-semibold text-gray-800 dark:text-slate-200">User</p>
                <p>john@example.com</p>
                <p>user123</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Everything you need</h2>
            <p className="mt-3 text-gray-500 dark:text-slate-400">Powerful features to manage your subscriptions effortlessly</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Simple, transparent pricing</h2>
            <p className="mt-3 text-gray-500 dark:text-slate-400">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border-2 transition-all bg-white dark:bg-slate-800 ${plan.popular ? 'border-primary-500 shadow-xl shadow-primary-500/10 scale-105' : 'border-gray-200 dark:border-slate-700'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-slate-100">${plan.price}</span>
                  <span className="text-sm text-gray-500 dark:text-slate-400">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`mt-8 block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 dark:bg-slate-950 text-gray-400 border-t border-gray-800 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
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
