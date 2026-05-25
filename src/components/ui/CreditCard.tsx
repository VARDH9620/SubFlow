// Visual credit card component for payment forms

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isFlipped: boolean;
  brand: string;
}

export function CreditCardVisual({ cardNumber, cardHolder, expiryMonth, expiryYear, cvv, isFlipped, brand }: CreditCardProps) {
  const formatNumber = (num: string) => {
    const groups = [];
    for (let i = 0; i < 16; i += 4) {
      groups.push(num.slice(i, i + 4) || '••••');
    }
    return groups.join('  ');
  };

  const getBrandIcon = (): string => {
    switch (brand) {
      case 'visa': return 'VISA';
      case 'mastercard': return 'MC';
      case 'amex': return 'AMEX';
      case 'discover': return 'DISC';
      default: return 'CARD';
    }
  };

  const getBrandColor = (): string => {
    switch (brand) {
      case 'visa': return 'from-blue-600 to-blue-800';
      case 'mastercard': return 'from-red-600 to-orange-600';
      case 'amex': return 'from-blue-800 to-blue-950';
      case 'discover': return 'from-orange-500 to-orange-700';
      default: return 'from-gray-700 to-gray-900';
    }
  };

  return (
    <div className="perspective-1000 w-full max-w-sm mx-auto" style={{ perspective: '1000px' }}>
      <div
        className="relative w-full aspect-[1.586/1] transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getBrandColor()} p-6 text-white shadow-2xl`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Decorative circles */}
          <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full" />
          <div className="absolute top-8 right-8 w-20 h-20 border border-white/10 rounded-full" />

          {/* Chip */}
          <div className="w-12 h-9 bg-gradient-to-br from-amber-200 to-amber-400 rounded-md mt-2 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-[1px] bg-amber-600/40" />
              <div className="absolute w-[1px] h-6 bg-amber-600/40" />
            </div>
          </div>

          {/* Contactless */}
          <div className="absolute top-8 right-8">
            <svg className="w-6 h-6 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 16.5a5 5 0 0 1 0-9" />
              <path d="M12 18a8 8 0 0 1 0-12" />
              <path d="M15.5 19.5a11 11 0 0 1 0-15" />
            </svg>
          </div>

          {/* Number */}
          <div className="mt-6 font-mono text-lg tracking-widest">
            {formatNumber(cardNumber.replace(/\s/g, ''))}
          </div>

          {/* Bottom row */}
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Card Holder</p>
              <p className="text-sm font-medium tracking-wider uppercase mt-0.5">
                {cardHolder || 'YOUR NAME'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Expires</p>
              <p className="text-sm font-medium mt-0.5">
                {expiryMonth || 'MM'}/{expiryYear || 'YY'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold tracking-wider">{getBrandIcon()}</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getBrandColor()} text-white shadow-2xl`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Magnetic stripe */}
          <div className="mt-6 h-10 bg-black/60" />

          {/* CVV strip */}
          <div className="mx-6 mt-4">
            <div className="bg-white/90 rounded px-4 py-2 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-[10px] text-gray-500 uppercase">CVV</span>
                <span className="font-mono text-lg text-gray-900 tracking-[0.3em]">
                  {cvv || '•••'}
                </span>
              </div>
            </div>
          </div>

          {/* Brand */}
          <div className="absolute bottom-6 right-6">
            <span className="text-lg font-bold tracking-wider">{getBrandIcon()}</span>
          </div>

          {/* Fine print */}
          <div className="absolute bottom-6 left-6 right-20">
            <p className="text-[8px] text-white/40 leading-tight">
              This card is property of the issuing bank. Unauthorized use is prohibited.
              For customer service call 1-800-555-0199.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
