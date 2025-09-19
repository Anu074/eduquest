import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ConnectivityStatus from '../../../components/ui/ConnectivityStatus';

const QuickActions = ({ currentLanguage = 'en' }) => {
  const [syncStatus, setSyncStatus] = useState('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [offlineContent, setOfflineContent] = useState({
    totalSize: '2.4 GB',
    availableSpace: '8.1 GB',
    downloadedSubjects: 4,
    totalSubjects: 6,
    lastSync: new Date(Date.now() - 3600000)
  });

  const translations = {
    en: {
      quickActions: "Quick Actions",
      downloadLessons: "Download Lessons",
      syncProgress: "Sync Progress",
      offlineMode: "Offline Mode",
      checkConnection: "Check Connection",
      downloadAll: "Download All",
      syncNow: "Sync Now",
      viewOffline: "View Offline Content",
      storage: "Storage",
      used: "used",
      available: "available",
      lastSync: "Last sync",
      downloading: "Downloading...",
      syncing: "Syncing...",
      upToDate: "Up to date"
    },
    hi: {
      quickActions: "त्वरित कार्य",
      downloadLessons: "पाठ डाउनलोड करें",
      syncProgress: "सिंक प्रगति",
      offlineMode: "ऑफलाइन मोड",
      checkConnection: "कनेक्शन जांचें",
      downloadAll: "सभी डाउनलोड करें",
      syncNow: "अभी सिंक करें",
      viewOffline: "ऑफलाइन सामग्री देखें",
      storage: "भंडारण",
      used: "उपयोग किया गया",
      available: "उपलब्ध",
      lastSync: "अंतिम सिंक",
      downloading: "डाउनलोड हो रहा है...",
      syncing: "सिंक हो रहा है...",
      upToDate: "अप टू डेट"
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  const handleDownloadAll = () => {
    setSyncStatus('downloading');
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncStatus('idle');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleSyncNow = () => {
    setSyncStatus('syncing');
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('idle');
      setOfflineContent(prev => ({
        ...prev,
        lastSync: new Date()
      }));
    }, 3000);
  };

  const formatLastSync = (date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date?.toLocaleDateString(currentLanguage === 'hi' ? 'hi-IN' : 'en-IN');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{t?.quickActions}</h3>
      {/* Connectivity Status */}
      <div className="bg-card border border-border rounded-lg p-4">
        <ConnectivityStatus 
          showLabel={true}
          position="inline"
          syncStatus={syncStatus}
          lastSyncTime={offlineContent?.lastSync}
          className="mb-3"
        />
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncNow}
            disabled={syncStatus === 'syncing'}
            loading={syncStatus === 'syncing'}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={14}
            className="flex-1 micro-scale"
          >
            {syncStatus === 'syncing' ? t?.syncing : t?.syncNow}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Wifi"
            iconPosition="left"
            iconSize={14}
            className="flex-1 micro-scale"
          >
            {t?.checkConnection}
          </Button>
        </div>
      </div>
      {/* Download Management */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground flex items-center space-x-2">
            <Icon name="Download" size={16} className="text-primary" />
            <span>{t?.downloadLessons}</span>
          </h4>
          <span className="text-sm text-muted-foreground">
            {offlineContent?.downloadedSubjects}/{offlineContent?.totalSubjects} subjects
          </span>
        </div>

        {/* Download Progress */}
        {syncStatus === 'downloading' && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">{t?.downloading}</span>
              <span className="text-sm font-mono text-muted-foreground">{downloadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Storage Info */}
        <div className="bg-muted rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{t?.storage}</span>
            <span className="text-sm text-muted-foreground">
              {offlineContent?.totalSize} {t?.used}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="HardDrive" size={12} />
            <span>{offlineContent?.availableSpace} {t?.available}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadAll}
            disabled={syncStatus === 'downloading'}
            loading={syncStatus === 'downloading'}
            iconName="Download"
            iconPosition="left"
            iconSize={14}
            className="flex-1 micro-scale"
          >
            {t?.downloadAll}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="FolderOpen"
            iconPosition="left"
            iconSize={14}
            className="flex-1 micro-scale"
          >
            {t?.viewOffline}
          </Button>
        </div>
      </div>
      {/* Offline Mode Status */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-success text-success-foreground rounded-full p-2">
            <Icon name="Wifi" size={16} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{t?.offlineMode}</h4>
            <p className="text-sm text-muted-foreground">
              {t?.lastSync} {formatLastSync(offlineContent?.lastSync)}
            </p>
          </div>
          <div className="text-success">
            <Icon name="CheckCircle" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;