import React from 'react';
import { 
  Volume2, 
  AudioWaveform, 
  Sparkles, 
  Compass, 
  Fingerprint, 
  Bot, 
  Globe, 
  Layers, 
  Code2, 
  CreditCard,
  ChevronRight,
  Zap,
  Video,
  Film,
  Clapperboard,
  Image as ImageIcon
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  title: string;
  items: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'CREATIVE AUDIO',
    items: [
      { id: 'speech-synthesis', label: 'Text to Speech', icon: Volume2, badge: 'Popular' },
      { id: 'voice-changer', label: 'Voice Changer', icon: AudioWaveform },
      { id: 'sound-effects', label: 'Sound Effects', icon: Sparkles, badge: 'AI' },
    ]
  },
  {
    title: 'AI VIDEO GENERATION',
    items: [
      { id: 'text-to-video', label: 'Text to Video', icon: Video, badge: 'New' },
      { id: 'image-to-video', label: 'Image to Video', icon: ImageIcon, badge: 'New' },
    ]
  },
  {
    title: 'VOICE EXPLORER',
    items: [
      { id: 'voice-library', label: 'Voice Library', icon: Compass },
      { id: 'voice-lab', label: 'Voice Lab & Cloning', icon: Fingerprint, badge: 'Custom' },
    ]
  },
  {
    title: 'PRODUCTION & AI',
    items: [
      { id: 'conversational-ai', label: 'Conversational Agents', icon: Bot, badge: 'Live' },
      { id: 'dubbing', label: 'Dubbing & Translate', icon: Globe },
      { id: 'projects-studio', label: 'Projects / Studio', icon: Layers },
    ]
  },
  {
    title: 'DEVELOPERS',
    items: [
      { id: 'api-playground', label: 'API Playground', icon: Code2 },
      { id: 'pricing-plans', label: 'Pricing & Plans', icon: CreditCard },
    ]
  }
];

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0B0F17] border-r border-gray-200 dark:border-gray-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Nav Items Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                {group.title}
              </h4>
              <div className="mt-1 space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-tab-${item.id}`}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#151C28] hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon 
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-white' : 'text-gray-400 dark:text-gray-400 group-hover:text-indigo-500'
                          }`} 
                        />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Promo Box */}
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/10 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-500/20 dark:border-indigo-500/30">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <h5 className="font-bold text-xs text-gray-900 dark:text-white">Eleven Multilingual v2</h5>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Now supporting 29+ languages with human-like breathing.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
