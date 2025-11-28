import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, X, Download, ShieldCheck, Lock, MoreHorizontal, Copy } from 'lucide-react';
import { analyzeUrl } from '../services/geminiService';
import { ScrapedVideoData, VideoFormat } from '../types';

interface BrowserProps {
  initialUrl?: string;
  onDownload: (data: ScrapedVideoData, format: VideoFormat) => void;
}

const Browser: React.FC<BrowserProps> = ({ initialUrl, onDownload }) => {
  const [url, setUrl] = useState(initialUrl || 'https://www.google.com');
  const [inputValue, setInputValue] = useState(initialUrl || 'https://www.google.com');
  const [loading, setLoading] = useState(false);
  const [detectedData, setDetectedData] = useState<ScrapedVideoData | null>(null);
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);

  useEffect(() => {
    if (initialUrl) {
        setUrl(initialUrl);
        setInputValue(initialUrl);
        handleAnalyze(initialUrl);
    }
  }, [initialUrl]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputValue;
    if (!target.startsWith('http')) {
        target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
    }
    setUrl(target);
    setDetectedData(null);
    setShowDownloadSheet(false);
    handleAnalyze(target);
  };

  const handleAnalyze = async (targetUrl: string) => {
    setLoading(true);
    // Simulate page load time
    setTimeout(async () => {
        setLoading(false);
        // Smart Detection Logic (simulated)
        if (targetUrl.includes('youtube') || targetUrl.includes('tiktok') || targetUrl.includes('vimeo') || targetUrl.includes('watch') || targetUrl.includes('video')) {
             const data = await analyzeUrl(targetUrl);
             setDetectedData(data);
             // Auto show button animation
        }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Browser Top Bar */}
      <div className="flex items-center gap-3 p-3 pt-4 border-b bg-white shadow-sm z-10">
        <form onSubmit={handleNavigate} className="flex-1 relative shadow-sm rounded-full bg-gray-100 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={14} className="group-focus-within:text-primary transition-colors" />
            </div>
            <input 
                className="w-full bg-transparent rounded-full py-2.5 pl-9 pr-8 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={(e) => e.target.select()}
            />
            {loading ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <RotateCw size={14} className="animate-spin text-primary" />
                </div>
            ) : (
                <button type="button" onClick={() => setInputValue('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                     <X size={14} />
                </button>
            )}
        </form>
        <button className="text-gray-600 p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal size={22} />
        </button>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="h-1 bg-gray-100 w-full overflow-hidden">
            <div className="h-full bg-primary animate-[shimmer_1s_infinite] w-2/3"></div>
        </div>
      )}

      {/* Browser Content */}
      <div className="flex-1 bg-gray-50 relative overflow-y-auto no-scrollbar">
        <div className="w-full min-h-full flex flex-col items-center p-8 text-center pt-20">
            <GlobeDisplay url={url} loading={loading} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-white border-t px-6 py-3 flex items-center justify-between pb-safe">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-30" disabled>
            <ArrowLeft size={24} />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-30" disabled>
            <ArrowRight size={24} />
        </button>
        <button onClick={() => setUrl('https://www.google.com')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <div className="w-6 h-6 border-2 border-gray-500 rounded flex items-center justify-center text-[10px] font-bold">1</div>
        </button>
        <button onClick={() => handleNavigate({ preventDefault: () => {} } as any)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <RotateCw size={24} />
        </button>
      </div>

      {/* Floating Download Button */}
      {detectedData && !showDownloadSheet && (
        <button 
            onClick={() => setShowDownloadSheet(true)}
            className="absolute bottom-24 right-5 w-16 h-16 bg-primary text-white rounded-full shadow-lg shadow-red-500/40 flex items-center justify-center animate-bounce-slow z-30 hover:scale-110 transition-transform active:scale-95"
        >
            <Download size={32} className="animate-pulse" strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">1</span>
            </span>
        </button>
      )}

      {/* Download Sheet */}
      {showDownloadSheet && detectedData && (
        <div className="absolute inset-0 bg-black/60 z-40 flex items-end animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white w-full rounded-t-3xl p-5 max-h-[80%] overflow-y-auto animate-slide-up shadow-2xl">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
                
                <div className="flex gap-4 mb-6">
                    <img src={detectedData.thumbnail} className="w-28 h-20 object-cover rounded-lg bg-gray-200 shadow-sm" alt="thumb" />
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{detectedData.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                             <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{detectedData.source}</span>
                             <span>•</span>
                             <span>4 formats</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Video</p>
                        <div className="space-y-2">
                            {detectedData.formats.filter(f => f.ext === 'mp4').map(f => (
                                <DownloadOption key={f.id} format={f} onClick={() => { onDownload(detectedData, f); setShowDownloadSheet(false); }} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Audio</p>
                        <div className="space-y-2">
                            {detectedData.formats.filter(f => f.ext === 'mp3').map(f => (
                                <DownloadOption key={f.id} format={f} onClick={() => { onDownload(detectedData, f); setShowDownloadSheet(false); }} />
                            ))}
                        </div>
                    </div>
                </div>
                
                <button onClick={() => setShowDownloadSheet(false)} className="w-full mt-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl">
                    Cancel
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

interface DownloadOptionProps {
  format: VideoFormat;
  onClick: () => void;
}

const DownloadOption: React.FC<DownloadOptionProps> = ({ format, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-3 border border-gray-100 bg-gray-50 rounded-xl hover:bg-red-50 hover:border-red-200 group transition-all active:scale-[0.99]"
    >
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${format.ext === 'mp3' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {format.ext.toUpperCase()}
            </div>
            <span className="font-bold text-gray-800">{format.label}</span>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500">{format.size}</span>
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                <Download size={16} strokeWidth={2.5} />
            </div>
        </div>
    </button>
);

const GlobeDisplay = ({ url, loading }: { url: string, loading: boolean }) => {
    const domain = new URL(url).hostname;
    return (
        <div className={`max-w-md w-full transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            <div className="w-24 h-24 bg-white shadow-lg rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-primary">
                <span className="text-4xl font-bold">{domain.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{domain}</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
                Browsing is simulated. Gemini AI will detect videos when you visit supported sites.
            </p>
            
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 text-left">
                     <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                        <Download size={20} />
                     </div>
                     <div>
                         <h4 className="font-bold text-sm text-gray-800">Video Detection</h4>
                         <p className="text-xs text-gray-500">Automatically finds downloadable media</p>
                     </div>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 text-left">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                        <ShieldCheck size={20} />
                     </div>
                     <div>
                         <h4 className="font-bold text-sm text-gray-800">Safe Browsing</h4>
                         <p className="text-xs text-gray-500">Protected against malicious sites</p>
                     </div>
                </div>
            </div>
        </div>
    )
}

export default Browser;