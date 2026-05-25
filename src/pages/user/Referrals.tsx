import { useState, useEffect } from 'react';
import { Copy, Gift, Users, DollarSign, Share2, Check, Star, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as db from '../../db/database';
import { Card, Button, PageHeader, Badge, EmptyState } from '../../components/ui';
import type { ReferralInfo } from '../../db/database';

export default function Referrals() {
  const { user, addToast } = useAuth();
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) setInfo(db.getReferralInfo(user.id));
  }, [user]);

  if (!info) return null;

  const referralLink = `https://subflow.io/ref/${info.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    addToast('Referral link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Join SubFlow!', text: `Get $10 off your first subscription with my referral code: ${info.code}`, url: referralLink });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="animate-fadeIn max-w-3xl">
      <PageHeader title="Referral Program" description="Invite friends and earn credits" />

      {/* Hero banner */}
      <Card className="bg-gradient-to-r from-primary-600 to-purple-600 border-0 text-white mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/20 rounded-xl"><Gift className="w-8 h-8" /></div>
          <div>
            <h2 className="text-xl font-bold">Give $10, Get $10</h2>
            <p className="text-white/80 text-sm">Share your referral link with friends. When they subscribe, you both earn $10 in credits.</p>
          </div>
        </div>

        {/* Referral code box */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <p className="text-xs text-white/60 uppercase tracking-wider font-medium mb-2">Your Referral Code</p>
          <div className="flex items-center gap-3">
            <code className="text-2xl font-bold tracking-wider flex-1">{info.code}</code>
            <button onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
              {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
            </button>
          </div>
          <p className="text-xs text-white/50 mt-2 break-all">{referralLink}</p>
        </div>

        <Button onClick={handleShare} className="gap-2 bg-white text-primary-700 hover:bg-white/90">
          <Share2 className="w-4 h-4" /> Share Invite Link
        </Button>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <Users className="w-6 h-6 text-primary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{info.referred_count}</p>
          <p className="text-xs text-gray-500 dark:text-slate-300">Friends Invited</p>
        </Card>
        <Card className="text-center">
          <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">${info.credits_earned}</p>
          <p className="text-xs text-gray-500 dark:text-slate-300">Credits Earned</p>
        </Card>
        <Card className="text-center">
          <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">${info.credits_balance}</p>
          <p className="text-xs text-gray-500 dark:text-slate-300">Available Credits</p>
        </Card>
      </div>

      {/* How it works */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">How it works</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '1', icon: <Share2 className="w-6 h-6" />, title: 'Share your link', desc: 'Send your unique referral link to friends via email, social media, or direct message.' },
            { step: '2', icon: <Users className="w-6 h-6" />, title: 'Friend signs up', desc: 'Your friend registers using your link and subscribes to any paid plan.' },
            { step: '3', icon: <Zap className="w-6 h-6" />, title: 'Both earn $10', desc: 'You get $10 credits and your friend gets $10 off their first invoice.' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mx-auto mb-3">{s.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{s.title}</h4>
              <p className="text-xs text-gray-500 dark:text-slate-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Referral history */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Referral History</h3>
        {info.referrals.length === 0 ? (
          <EmptyState icon={<Users className="w-10 h-10" />} title="No referrals yet" description="Share your link to start earning credits" />
        ) : (
          <div className="space-y-2">
            {info.referrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">
                    {r.email[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-200">{r.email}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-400">{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant={r.status === 'completed' ? 'success' : 'warning'}>{r.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
