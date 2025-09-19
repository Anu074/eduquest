import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ConnectivityStatus = ({ 
  showLabel = true, 
  position = 'inline',
  syncStatus = 'idle',
  lastSyncTime = null,
  className = ''
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [syncProgress, setSyncProgress] = useState(0);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      if (window.serviceWorker && window.serviceWorker?.controller) {
        window.serviceWorker?.controller?.postMessage({ type: 'SYNC_REQUEST' });
      }
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor connection type if available
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      setConnectionType(connection?.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection?.effectiveType || 'unknown');
      };
      
      connection?.addEventListener('change', handleConnectionChange);
      return () => connection?.removeEventListener('change', handleConnectionChange);
    }
  }, []);

  // Handle sync progress updates
  useEffect(() => {
    const handleSyncProgress = (event) => {
      setSyncProgress(event?.detail?.progress || 0);
    };

    window.addEventListener('syncProgress', handleSyncProgress);
    return () => window.removeEventListener('syncProgress', handleSyncProgress);
  }, []);

  const getStatusIcon = () => {
    if (syncStatus === 'syncing') return 'RefreshCw';
    if (!isOnline) return 'WifiOff';
    if (connectionType === 'slow-2g' || connectionType === '2g') return 'Wifi';
    return 'Wifi';
  };

  const getStatusColor = () => {
    if (syncStatus === 'syncing') return 'text-accent';
    if (!isOnline) return 'text-warning';
    if (connectionType === 'slow-2g' || connectionType === '2g') return 'text-warning';
    return 'text-success';
  };

  const getStatusText = () => {
    if (syncStatus === 'syncing') return 'Syncing...';
    if (!isOnline) return 'Offline';
    if (connectionType === 'slow-2g' || connectionType === '2g') return 'Slow Connection';
    return 'Online';
  };

  const getDetailedStatus = () => {
    if (syncStatus === 'syncing') {
      return `Syncing ${syncProgress}%`;
    }
    if (!isOnline) {
      return lastSyncTime ? `Last sync: ${formatLastSync(lastSyncTime)}` : 'Working offline';
    }
    if (connectionType !== 'unknown') {
      return `Connected (${connectionType?.toUpperCase()})`;
    }
    return 'Connected';
  };

  const formatLastSync = (timestamp) => {
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - syncTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return syncTime?.toLocaleDateString();
  };

  const positionClasses = {
    inline: '',
    fixed: 'fixed top-4 right-4 z-40',
    floating: 'fixed bottom-4 right-4 z-40 bg-card border border-border rounded-lg px-3 py-2 shadow-lg'
  };

  return (
    <div className={`flex items-center space-x-2 ${positionClasses?.[position]} ${className}`}>
      {/* Status Icon */}
      <div className="relative">
        <Icon 
          name={getStatusIcon()} 
          size={16} 
          className={`${getStatusColor()} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
        />
        
        {/* Connection strength indicator */}
        {isOnline && connectionType !== 'unknown' && (
          <div className="absolute -bottom-1 -right-1">
            <div className={`w-2 h-2 rounded-full ${
              connectionType === '4g' ? 'bg-success' :
              connectionType === '3g'? 'bg-accent' : 'bg-warning'
            }`} />
          </div>
        )}
      </div>
      {/* Status Text */}
      {showLabel && (
        <div className="flex flex-col">
          <span className={`text-sm font-caption ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          
          {/* Detailed status for floating position */}
          {position === 'floating' && (
            <span className="text-xs text-muted-foreground">
              {getDetailedStatus()}
            </span>
          )}
        </div>
      )}
      {/* Sync Progress Bar */}
      {syncStatus === 'syncing' && syncProgress > 0 && (
        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${syncProgress}%` }}
          />
        </div>
      )}
      {/* Tooltip for inline position */}
      {position === 'inline' && (
        <div className="group relative">
          <Icon name="Info" size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity delay-200 z-50">
            {getDetailedStatus()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectivityStatus;