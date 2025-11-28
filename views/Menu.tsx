import React from 'react';
import { User, Settings, Moon, Globe, Shield, HelpCircle, LogOut, ChevronRight, Bell, Zap, Heart, History } from 'lucide-react';

const Menu: React.FC = () => {
  const MenuItem = ({ icon: Icon, label, value, color = "text-gray-600", danger = false }: any) => (
    <button className="w-full bg-white p-4 flex items-center justify-between border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${danger ? 'bg-red-50' : 'bg-gray-50'}`}>
                <Icon size={18} className={danger ? 'text-red-500' : color} />
            </div>
            <span className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-xs text-gray-400 font-medium">{value}</span>}
            <ChevronRight size={16} className="text-gray-300" />
        </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-100 pb-20 overflow-y-auto no-scrollbar">
        {/* Profile Header */}
        <div className="bg-white p-6 pb-8 mb-2">
            <div className="flex items-center justify-between mb-6">
                 <h1 className="text-xl font-bold text-gray-900">Profile</h1>
                 <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                 </button>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 border-2 border-white shadow-md">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Guest User</h2>
                    <p className="text-gray-500 text-xs">ID: 8492301</p>
                </div>
                <button className="ml-auto bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm shadow-red-200">
                    Sign In
                </button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 rounded-2xl p-3 flex flex-col items-center gap-1 cursor-pointer hover:bg-red-50 transition-colors group">
                    <Heart size={20} className="text-gray-400 group-hover:text-primary mb-1" />
                    <span className="text-xs font-bold text-gray-700">Favorites</span>
                    <span className="text-[10px] text-gray-400">0 videos</span>
                </div>
                 <div className="flex-1 bg-gray-50 rounded-2xl p-3 flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-50 transition-colors group">
                    <History size={20} className="text-gray-400 group-hover:text-blue-500 mb-1" />
                    <span className="text-xs font-bold text-gray-700">History</span>
                    <span className="text-[10px] text-gray-400">View All</span>
                </div>
                 <div className="flex-1 bg-gray-50 rounded-2xl p-3 flex flex-col items-center gap-1 cursor-pointer hover:bg-yellow-50 transition-colors group">
                    <Zap size={20} className="text-gray-400 group-hover:text-yellow-500 mb-1" />
                    <span className="text-xs font-bold text-gray-700">Premium</span>
                    <span className="text-[10px] text-gray-400">Upgrade</span>
                </div>
            </div>
        </div>

        {/* Settings List */}
        <div className="px-4 space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-sm bg-white">
                <MenuItem icon={Settings} label="General Settings" />
                <MenuItem icon={Moon} label="Dark Mode" value="Off" />
                <MenuItem icon={Globe} label="Language" value="English" />
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm bg-white">
                <MenuItem icon={Shield} label="Restricted Mode" value="On" color="text-green-600" />
                <MenuItem icon={HelpCircle} label="Help & Feedback" />
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm bg-white">
                 <MenuItem icon={LogOut} label="Sign Out" danger />
            </div>
            
             <div className="text-center py-6">
                <p className="text-xs font-bold text-gray-400">VidMate Redux</p>
                <p className="text-[10px] text-gray-300">Version 2.4.0 (Build 2024)</p>
            </div>
        </div>
    </div>
  );
};

export default Menu;