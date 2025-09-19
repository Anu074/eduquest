import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OfflineIndicator = ({ 
  isOffline, 
  downloadProgress = 0, 
  onDownload, 
  onSync,
  lastSyncTime 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');

  useEffect(() => {
    // Listen for sync events
    const handleSyncStart = () => setSyncStatus('syncing');
    const handleSyncComplete = () => setSyncStatus('complete');
    const handleSyncError = () => setSyncStatus('error');

    window.addEventListener('syncStart', handleSyncStart);
    window.addEventListener('syncComplete', handleSyncComplete);
    window.addEventListener('syncError', handleSyncError);

    return () => {
      window.removeEventListener('syncStart', handleSyncStart);
      window.removeEventListener('syncComplete', handleSyncComplete);
      window.removeEventListener('syncError', handleSyncError);
    };
  }, []);

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - syncTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return syncTime?.toLocaleDateString();
  };

  const getStatusIcon = () => {
    if (syncStatus === 'syncing') return 'RefreshCw';
    if (isOffline) return 'WifiOff';
    return 'Wifi';
  };

  const getStatusColor = () => {
    if (syncStatus === 'syncing') return 'text-accent';
    if (syncStatus === 'error') return 'text-error';
    if (isOffline) return 'text-warning';
    return 'text-success';
  };

  const getStatusText = () => {
    if (syncStatus === 'syncing') return 'Syncing...';
    if (syncStatus === 'error') return 'Sync Failed';
    if (isOffline) return 'Offline Mode';
    return 'Online';
  };

  return (
    <div className="fixed top-20 right-4 z-40">
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 max-w-xs">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon()} 
              size={16} 
              className={`${getStatusColor()} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
            />
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            iconName={showDetails ? "ChevronUp" : "ChevronDown"}
            onClick={() => setShowDetails(!showDetails)}
            className="micro-scale"
          />
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-border space-y-3">
            {/* Connection Info */}
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Last sync:</span>
                <span>{formatLastSync(lastSyncTime)}</span>
              </div>
            </div>

            {/* Download Progress */}
            {downloadProgress > 0 && downloadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Downloading content</span>
                  <span className="text-primary font-mono">{downloadProgress}%</span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {isOffline && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  onClick={onDownload}
                  disabled={downloadProgress > 0 && downloadProgress < 100}
                  className="flex-1 micro-scale"
                >
                  Download
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={onSync}
                disabled={syncStatus === 'syncing'}
                loading={syncStatus === 'syncing'}
                className="flex-1 micro-scale"
              >
                Sync
              </Button>
            </div>

            {/* Offline Features */}
            {isOffline && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-2">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={14} className="text-warning mt-0.5" />
                  <div className="text-xs text-warning">
                    <p className="font-medium">Working Offline</p>
                    <p className="mt-1">Your progress is being saved locally and will sync when you're back online.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sync Error */}
            {syncStatus === 'error' && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-2">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertCircle" size={14} className="text-error mt-0.5" />
                  <div className="text-xs text-error">
                    <p className="font-medium">Sync Failed</p>
                    <p className="mt-1">Unable to sync your progress. Please check your connection and try again.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;