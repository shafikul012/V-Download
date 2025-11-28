export enum Tab {
  HOME = 'HOME',
  BROWSER = 'BROWSER',
  DOWNLOADS = 'DOWNLOADS',
  MENU = 'MENU'
}

export enum DownloadStatus {
  PENDING = 'PENDING',
  DOWNLOADING = 'DOWNLOADING',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  FAILED = 'FAILED'
}

export interface VideoFormat {
  id: string;
  label: string; // e.g., "1080p", "720p", "MP3"
  size: string;  // e.g., "45.2MB"
  ext: string;   // e.g., "mp4", "mp3"
}

export interface ScrapedVideoData {
  title: string;
  thumbnail: string;
  source: string;
  formats: VideoFormat[];
}

export interface DownloadTask {
  id: string;
  title: string;
  thumbnail: string;
  format: string; // "720p"
  progress: number; // 0-100
  speed: string; // "2.5 MB/s"
  status: DownloadStatus;
  date: string;
  totalSize: string;
}

export interface TrendingVideo {
  id: string;
  title: string;
  views: string;
  thumbnail: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Vimeo';
}