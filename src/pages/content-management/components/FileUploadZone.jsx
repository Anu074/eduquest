import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFilesUploaded, acceptedTypes = [], maxSize = 50 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    processFiles(files);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validFiles = files?.filter(file => {
      const isValidType = acceptedTypes?.length === 0 || acceptedTypes?.some(type => 
        file?.type?.includes(type) || file?.name?.toLowerCase()?.endsWith(type)
      );
      const isValidSize = file?.size <= maxSize * 1024 * 1024;
      return isValidType && isValidSize;
    });

    validFiles?.forEach(file => {
      const fileId = Date.now() + Math.random();
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev?.[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            setUploadedFiles(prevFiles => [...prevFiles, {
              id: fileId,
              name: file?.name,
              size: file?.size,
              type: file?.type,
              uploadedAt: new Date()
            }]);
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 200);
    });

    onFilesUploaded(validFiles);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev?.filter(file => file?.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress?.[fileId];
      return newProgress;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver 
            ? 'border-primary bg-primary/5 scale-105' :'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={acceptedTypes?.join(',')}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`p-4 rounded-full transition-colors ${
              isDragOver ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name="Upload" size={32} />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isDragOver ? 'Drop files here' : 'Upload Content Files'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            
            <Button variant="outline" size="sm">
              <Icon name="FolderOpen" size={16} className="mr-2" />
              Browse Files
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Supported formats: PDF, DOC, PPT, MP4, MP3, JPG, PNG</p>
            <p>Maximum file size: {maxSize}MB per file</p>
          </div>
        </div>
      </div>
      {/* Upload Progress */}
      {Object.keys(uploadProgress)?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Uploading Files</h4>
          {Object.entries(uploadProgress)?.map(([fileId, progress]) => (
            <div key={fileId} className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Uploading...</span>
                <span className="text-sm font-mono text-muted-foreground">{progress}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Uploaded Files */}
      {uploadedFiles?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Uploaded Files</h4>
          {uploadedFiles?.map((file) => (
            <div key={file?.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded">
                  <Icon name="FileCheck" size={16} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file?.size)} • Uploaded just now
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file?.id)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;