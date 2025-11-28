import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Home from './views/Home';
import Browser from './views/Browser';
import Downloads from './views/Downloads';
import Menu from './views/Menu';
import { Tab, DownloadTask, DownloadStatus, ScrapedVideoData, VideoFormat } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [browserUrl, setBrowserUrl] = useState<string | undefined>(undefined);
  const [downloads, setDownloads] = useState<DownloadTask[]>([]);
  
  // Refs for simulation intervals
  const downloadIntervals = useRef<{[key: string]: ReturnType<typeof setInterval>}>({});

  const handleNavigateToBrowser = (url: string) => {
    setBrowserUrl(url);
    setActiveTab(Tab.BROWSER);
  };

  const handleStartDownload = (data: ScrapedVideoData, format: VideoFormat) => {
    const newTask: DownloadTask = {
        id: Math.random().toString(36).substring(7),
        title: data.title,
        thumbnail: data.thumbnail,
        format: format.label,
        progress: 0,
        speed: '0 KB/s',
        status: DownloadStatus.PENDING,
        date: new Date().toLocaleDateString(),
        totalSize: format.size
    };

    setDownloads(prev => [newTask, ...prev]);
    
    // Simulate connection delay
    setTimeout(() => {
        startSimulation(newTask.id);
    }, 1000);
  };

  const startSimulation = (taskId: string) => {
    // Determine a random speed between 1MB/s and 5MB/s
    const speedVal = (Math.random() * 4 + 1).toFixed(1);
    
    // Update status to downloading
    setDownloads(prev => prev.map(t => t.id === taskId ? { ...t, status: DownloadStatus.DOWNLOADING, speed: `${speedVal} MB/s` } : t));

    const interval = setInterval(() => {
        setDownloads(prev => {
            return prev.map(task => {
                if (task.id !== taskId) return task;
                
                // Increment progress
                const newProgress = task.progress + (Math.random() * 5);
                
                if (newProgress >= 100) {
                    clearInterval(downloadIntervals.current[taskId]);
                    delete downloadIntervals.current[taskId];
                    return { ...task, progress: 100, status: DownloadStatus.COMPLETED, speed: '' };
                }
                
                return { ...task, progress: newProgress };
            });
        });
    }, 500);

    downloadIntervals.current[taskId] = interval;
  };

  const handleDeleteTask = (id: string) => {
    if (downloadIntervals.current[id]) {
        clearInterval(downloadIntervals.current[id]);
        delete downloadIntervals.current[id];
    }
    setDownloads(prev => prev.filter(t => t.id !== id));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        Object.values(downloadIntervals.current).forEach(clearInterval);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <Home onSearch={() => {}} onNavigateToBrowser={handleNavigateToBrowser} />;
      case Tab.BROWSER:
        return <Browser initialUrl={browserUrl} onDownload={handleStartDownload} />;
      case Tab.DOWNLOADS:
        return <Downloads tasks={downloads} onDelete={handleDeleteTask} />;
      case Tab.MENU:
        return <Menu />;
      default:
        return <Home onSearch={() => {}} onNavigateToBrowser={handleNavigateToBrowser} />;
    }
  };

  const activeDownloadsCount = downloads.filter(t => t.status === DownloadStatus.DOWNLOADING || t.status === DownloadStatus.PENDING).length;

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
      </main>
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        downloadCount={activeDownloadsCount}
      />
    </div>
  );
}

export default App;