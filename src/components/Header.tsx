import React, { useState } from 'react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Zap, 
  ChevronDown, 
  User, 
  Key, 
  BookOpen, 
  LogOut, 
  CreditCard,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { UserQuota } from '../types';

interface HeaderProps {
  quota: UserQuota;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenPricing: () => void;
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  quota,
  isDarkMode,
  onToggleDarkMode,
  onOpenPricing,
  onOpenMobileMenu,
  isMobileMenuOpen,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);

  const percentageUsed = Math.min(Math.round((quota.creditsUsed / quota.maxCredits) * 100), 100);
  const creditsRemaining = (quota.maxCredits - quota.creditsUsed).toLocaleString();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md transition-colors">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Left: Hamburger (mobile) + ElevenLabs Logo & Workspace */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              id="header-mobile-menu-toggle"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="flex gap-1 items-center">
                  <span className="w-1 h-4 bg-white rounded-full animate-pulse"></span>
                  <span className="w-1 h-3 bg-cyan-200 rounded-full"></span>
                  <span className="w-1 h-5 bg-white rounded-full"></span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-gray-900 dark:text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-800 dark:from-white dark:via-indigo-100 dark:to-gray-200">
                    AppNyormal
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    v3.0 AI
                  </span>
                </div>
              </div>
            </div>

            {/* Workspace Selector (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-800">
              <button 
                id="header-workspace-dropdown"
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span>Personal Studio</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Right: Credits Meter, Theme Toggle, Upgrade CTA, User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quota Credit Counter Badge */}
            <button
              id="header-credit-quota-badge"
              onClick={() => setShowCreditModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#151C28] border border-gray-200 dark:border-gray-700/60 hover:border-indigo-500/50 transition-all text-xs font-medium text-gray-700 dark:text-gray-200 group"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform fill-amber-500/20" />
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline font-semibold">{creditsRemaining}</span>
                <span className="text-gray-400 text-[11px]">/ {quota.maxCredits.toLocaleString()} credits</span>
              </div>
              <div className="hidden md:block w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${100 - percentageUsed}%` }}
                ></div>
              </div>
              <Plus className="w-3 h-3 text-indigo-500 ml-0.5" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              id="header-theme-toggle"
              onClick={onToggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Upgrade CTA */}
            <button
              id="header-upgrade-btn"
              onClick={onOpenPricing}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 rounded-lg shadow-sm hover:shadow-indigo-500/25 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade</span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                id="header-user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors"
                aria-label="User Account Menu"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="User Avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              </button>

              {showUserMenu && (
                <div 
                  id="header-user-menu-dropdown"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111622] shadow-xl p-1.5 text-xs text-gray-700 dark:text-gray-200 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-semibold text-gray-900 dark:text-white">Alex Johnson</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">alex.johnson@appnyormal.ai</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Zap className="w-3 h-3" /> {quota.planName} Plan
                    </div>
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={() => { setShowUserMenu(false); onOpenPricing(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 text-left"
                    >
                      <CreditCard className="w-4 h-4 text-indigo-500" />
                      <span>Subscription & Quotas</span>
                    </button>
                    <button 
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 text-left"
                    >
                      <Key className="w-4 h-4 text-amber-500" />
                      <span>API Keys & Secrets</span>
                    </button>
                    <button 
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 text-left"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span>Documentation</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                    <button 
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Credit Top-up Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111622] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Zap className="w-5 h-5 fill-indigo-500/20" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">Quota Credits</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage your monthly speech synthesis usage</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreditModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-gray-50 dark:bg-[#0B0F17] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600 dark:text-gray-400">Current Plan</span>
                <span className="text-indigo-600 dark:text-indigo-400">{quota.planName} Plan</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600 dark:text-gray-400">Credits Remaining</span>
                <span className="text-gray-900 dark:text-white">{creditsRemaining} / {quota.maxCredits.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${100 - percentageUsed}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center">
                Credits reset on the 1st of every month. Unused credits rollover on Pro plans.
              </p>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => { setShowCreditModal(false); onOpenPricing(); }}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all text-center"
              >
                Upgrade Plan for More Credits
              </button>
              <button 
                onClick={() => setShowCreditModal(false)}
                className="w-full py-2 px-4 rounded-xl font-medium text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
