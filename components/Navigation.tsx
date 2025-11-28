import React from 'react';
import { Home, Download, Globe, User, Compass } from 'lucide-react';
import { Tab } from '../types';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  downloadCount: number;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, downloadCount }) => {
  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => onTabChange(tab)} 
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative group`}
      >
        <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'text-primary transform -translate-y-1' : 'text-gray-400 group-hover:text-gray-600'}`}>
          <Icon size={26} strokeWidth={isActive ? 2.5 : 2} fill={isActive && tab === Tab.HOME ? "currentColor" : "none"} />
        </div>
        <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            {label}
        </span>
        {isActive && (
            <span className="absolute -bottom-0.5 w-8 h-0.5 bg-primary rounded-full"></span>
        )}
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50 flex items-center justify-around pb-safe px-2">
      <NavItem tab={Tab.HOME} icon={Home} label="Home" />
      <NavItem tab={Tab.BROWSER} icon={Compass} label="Browser" />
      
      <button 
        onClick={() => onTabChange(Tab.DOWNLOADS)} 
        className="flex flex-col items-center justify-center w-full h-full relative"
      >
         <div className={`relative p-3 rounded-full transition-all duration-300 ${activeTab === Tab.DOWNLOADS ? 'bg-primary text-white shadow-lg shadow-red-200 -translate-y-4' : 'text-gray-400'}`}>
          <Download size={26} strokeWidth={2.5} />
          {downloadCount > 0 && (
            <span className="absolute top-0 right-0 bg-yellow-400 text-red-700 border-2 border-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {downloadCount}
            </span>
          )}
        </div>
        <span className={`text-[10px] font-semibold mt-1 transition-colors ${activeTab === Tab.DOWNLOADS ? 'text-primary translate-y-[-10px]' : 'text-gray-400'}`}>
            My Files
        </span>
      </button>

      <NavItem tab={Tab.MENU} icon={User} label="Me" />
    </nav>
  );
};

export default Navigation;