import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const PricingPlans: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  const PLANS = [
    {
      name: 'Free',
      priceMonthly: 0,
      priceAnnual: 0,
      credits: '10,000',
      customVoices: 3,
      badge: null,
      features: [
        '10,000 credits per month (~10 mins speech)',
        'Create up to 3 custom instant voices',
        'Access to 29+ languages (Multilingual v2)',
        'Speech Synthesis & Sound Effects',
        'Non-commercial personal license'
      ]
    },
    {
      name: 'Starter',
      priceMonthly: 5,
      priceAnnual: 4,
      credits: '30,000',
      customVoices: 10,
      badge: 'Popular',
      features: [
        '30,000 credits per month (~30 mins speech)',
        'Create up to 10 custom instant voices',
        'Commercial usage rights included',
        'Instant Voice Cloning & Dubbing',
        'API Key access & Developer SDKs'
      ]
    },
    {
      name: 'Creator',
      priceMonthly: 22,
      priceAnnual: 18,
      credits: '100,000',
      customVoices: 30,
      badge: 'Best Value',
      features: [
        '100,000 credits per month (~100 mins speech)',
        'Create up to 30 custom instant voices',
        'Professional Voice Cloning (PVC) access',
        'High-fidelity 192kbps audio export',
        'Projects & Audiobook Studio Editor'
      ]
    },
    {
      name: 'Pro',
      priceMonthly: 99,
      priceAnnual: 79,
      credits: '500,000',
      customVoices: 160,
      badge: 'Enterprise',
      features: [
        '500,000 credits per month (~500 mins speech)',
        'Create up to 160 custom instant voices',
        'Priority rendering queue & lowest latency',
        'Conversational AI Voice Agents builder',
        'Dedicated account management'
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Flexible Pricing for Creators & Developers
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Scale your voice generation seamlessly from personal experiments to high-throughput enterprise applications.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-semibold ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-indigo-600 p-1 flex items-center transition-all cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
              Annual Billing
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => {
          const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
          const isPopular = plan.badge === 'Popular' || plan.badge === 'Best Value';

          return (
            <div
              key={plan.name}
              className={`p-6 rounded-2xl bg-white dark:bg-[#0B0F17] border flex flex-col justify-between space-y-6 transition-all ${
                isPopular
                  ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">{plan.name}</h3>
                  {plan.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">${price}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">/month</span>
                  </div>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                    {plan.credits} credits / mo
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
                  isPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {price === 0 ? 'Current Plan' : `Subscribe to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
