import React, { useEffect, useState } from 'react';
import { Search, Youtube, Facebook, Instagram, Music, Play, TrendingUp, Twitter, Download, Globe } from 'lucide-react';
import { getTrendingVideos } from '../services/geminiService';
import { TrendingVideo } from '../types';

interface HomeProps {
  onSearch: (query: string) => void;
  onNavigateToBrowser: (url: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSearch, onNavigateToBrowser }) => {
  const [trending, setTrending] = useState<TrendingVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const videos = await getTrendingVideos();
      setTrending(videos);
      setLoading(false);
    };
    fetchTrending();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (query.startsWith('http')) {
        onNavigateToBrowser(query);
      } else {
        onSearch(query);
        onNavigateToBrowser(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const QuickLink = ({ icon: Icon, color, bg, label, url }: any) => (
    <button 
      onClick={() => onNavigateToBrowser(url)}
      className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
    >
      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center shadow-sm text-white`}>
        <Icon size={28} fill="currentColor" className={color === 'text-black' ? 'text-black fill-black' : 'text-white'} />
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 overflow-y-auto no-scrollbar">
      {/* Hero / Search Section */}
      <div className="bg-gradient-to-b from-primary to-red-600 pt-6 pb-12 px-5 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
               <Download className="text-white" size={20} />
            </div>
            <h1 className="text-white text-xl font-bold tracking-wide">VidMate</h1>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
             <span className="text-white text-xs font-medium">V 5.0</span>
          </div>
        </div>
        
        <form onSubmit={handleSearchSubmit} className="relative group">
          <input
            type="text"
            placeholder="Search or enter URL..."
            className="w-full h-14 pl-12 pr-4 rounded-full bg-white text-gray-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all placeholder-gray-400 text-sm font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={22} />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary text-white px-4 rounded-full text-xs font-bold shadow-md hover:bg-primary-dark transition-colors">
            GO
          </button>
        </form>
      </div>

      {/* Quick Access Links */}
      <div className="px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-6 shadow-md grid grid-cols-4 gap-y-6">
            <QuickLink icon={Youtube} bg="bg-red-600" label="YouTube" url="https://m.youtube.com" />
            <QuickLink icon={Facebook} bg="bg-blue-600" label="Facebook" url="https://m.facebook.com" />
            <QuickLink icon={Instagram} bg="bg-pink-600" label="Instagram" url="https://instagram.com" />
            <QuickLink icon={Music} bg="bg-black" label="TikTok" url="https://tiktok.com" />
            
            <QuickLink icon={Twitter} bg="bg-blue-400" label="Twitter" url="https://twitter.com" />
            <QuickLink icon={Play} bg="bg-orange-500" label="Vimeo" url="https://vimeo.com" />
            <QuickLink icon={Download} bg="bg-green-500" label="SaveFrom" url="https://en.savefrom.net" />
            <QuickLink icon={Globe} bg="bg-purple-600" label="More" url="https://www.google.com" />
        </div>
      </div>

      {/* Trending Section */}
      <div className="p-5 mt-2">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
            <div className="bg-red-100 p-1 rounded">
               <TrendingUp size={18} className="text-primary" />
            </div>
            Trending Now
          </h2>
          <button className="text-xs text-primary font-bold uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full">See All</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-xl mb-3"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {trending.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-sm overflow-hidden group cursor-pointer active:scale-[0.98] transition-all" onClick={() => onNavigateToBrowser(`https://${video.platform.toLowerCase()}.com/watch?v=${video.id}`)}>
                <div className="relative aspect-video bg-gray-100">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                      <Play size={24} className="text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${
                          video.platform === 'YouTube' ? 'bg-red-600' :
                          video.platform === 'Facebook' ? 'bg-blue-600' :
                          video.platform === 'TikTok' ? 'bg-black' : 'bg-pink-600'
                      }`}>
                          {video.platform}
                      </span>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                    12:04
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>{video.views} views</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;