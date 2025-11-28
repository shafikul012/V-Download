import React from 'react';
import { DownloadTask, DownloadStatus } from '../types';
import { FileVideo, FileAudio, MoreVertical, PlayCircle, CheckCircle, Download, Trash2, Share2, FolderOpen } from 'lucide-react';

interface DownloadsProps {
  tasks: DownloadTask[];
  onDelete: (id: string) => void;
}

const Downloads: React.FC<DownloadsProps> = ({ tasks, onDelete }) => {
  const activeTasks = tasks.filter(t => t.status === DownloadStatus.DOWNLOADING || t.status === DownloadStatus.PENDING || t.status === DownloadStatus.PAUSED);
  const completedTasks = tasks.filter(t => t.status === DownloadStatus.COMPLETED);

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 overflow-y-auto no-scrollbar">
      <div className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">My Files</h1>
        <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <FolderOpen size={20} />
            </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-8 space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Download size={40} />
            </div>
            <div className="text-center">
                <p className="text-lg font-medium text-gray-500">No downloads yet</p>
                <p className="text-sm text-gray-400">Videos you download will appear here</p>
            </div>
        </div>
      ) : (
        <div className="p-4 space-y-8">
            
            {/* Active Downloads */}
            {activeTasks.length > 0 && (
                <div className="animate-slide-up">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Downloading ({activeTasks.length})</h2>
                    <div className="space-y-3">
                        {activeTasks.map(task => (
                            <div key={task.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex gap-3 mb-3">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                        <img src={task.thumbnail} className="w-full h-full object-cover opacity-80" alt="thumb" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {task.format.includes('mp3') ? <FileAudio className="text-gray-800 drop-shadow-md" size={24} /> : <FileVideo className="text-gray-800 drop-shadow-md" size={24} />}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">{task.title}</h3>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex gap-2">
                                                <span className="font-medium text-primary">{task.speed}</span>
                                                <span className="text-gray-300">|</span>
                                                <span>{task.totalSize}</span>
                                            </div>
                                            <span className="text-primary font-bold">{Math.floor(task.progress)}%</span>
                                        </div>
                                    </div>
                                    <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-500 self-start">
                                        <XCircleIcon />
                                    </button>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="bg-primary h-full rounded-full transition-all duration-300 ease-out relative" 
                                        style={{ width: `${task.progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Downloads */}
            {completedTasks.length > 0 && (
                <div className="animate-slide-up">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Completed ({completedTasks.length})</h2>
                    <div className="space-y-3">
                         {completedTasks.map(task => (
                            <div key={task.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 group active:scale-[0.99] transition-transform">
                                 <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                    <img src={task.thumbnail} className="w-full h-full object-cover" alt="thumb" />
                                    <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                                        {task.format}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">{task.title}</h3>
                                    <div className="flex items-center text-xs text-gray-400 gap-2">
                                        <span>{task.totalSize}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span>{task.date}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button className="p-2 text-gray-300 hover:text-primary transition-colors">
                                        <PlayCircle size={24} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
)

export default Downloads;