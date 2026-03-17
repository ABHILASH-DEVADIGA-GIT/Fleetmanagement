import React, { useState, useRef } from 'react';
import { Upload, X, Image, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export const ImageUpload = ({ 
  value, 
  onChange, 
  category = 'general',
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 10, // MB
  className = '',
  showPreview = true,
  previewSize = 'md' // sm, md, lg
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const previewSizes = {
    sm: 'h-24 w-24',
    md: 'h-32 w-32',
    lg: 'h-48 w-48'
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onChange(response.data.url);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = async () => {
    if (value && value.startsWith('/uploads/')) {
      try {
        await api.delete('/upload', { params: { file_url: value } });
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
    onChange('');
  };

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // For local uploads, prepend the API base URL
    const baseUrl = process.env.REACT_APP_BACKEND_URL || '';
    return `${baseUrl}${path}`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all ${
          dragOver 
            ? 'border-primary bg-primary/5' 
            : value 
              ? 'border-green-500 bg-green-50' 
              : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </motion.div>
          ) : value && showPreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative p-4"
            >
              <div className={`relative ${previewSizes[previewSize]} mx-auto rounded-lg overflow-hidden bg-muted`}>
                <img
                  src={getFullUrl(value)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f1f5f9" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="12">No Image</text></svg>';
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={handleRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Image uploaded</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace Image
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-6 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-3 rounded-full bg-muted mb-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">
                {dragOver ? 'Drop image here' : 'Click to upload or drag & drop'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF, WebP up to {maxSize}MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Show URL if exists but not a local upload */}
      {value && !value.startsWith('/uploads/') && (
        <p className="text-xs text-muted-foreground truncate">
          External URL: {value}
        </p>
      )}
    </div>
  );
};

// Multiple image upload component
export const MultiImageUpload = ({
  values = [],
  onChange,
  category = 'general',
  label = 'Upload Images',
  maxFiles = 10,
  maxSize = 10,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFilesSelect = async (files) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - values.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const formData = new FormData();
      filesToUpload.forEach(file => {
        formData.append('files', file);
      });
      formData.append('category', category);

      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.uploaded && response.data.uploaded.length > 0) {
        const newUrls = response.data.uploaded.map(f => f.url);
        onChange([...values, ...newUrls]);
        toast.success(`${response.data.uploaded.length} image(s) uploaded`);
      }

      if (response.data.errors && response.data.errors.length > 0) {
        response.data.errors.forEach(err => {
          toast.error(`${err.file}: ${err.error}`);
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index) => {
    const urlToRemove = values[index];
    if (urlToRemove && urlToRemove.startsWith('/uploads/')) {
      try {
        await api.delete('/upload', { params: { file_url: urlToRemove } });
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.REACT_APP_BACKEND_URL || '';
    return `${baseUrl}${path}`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{label}</label>
          <span className="text-xs text-muted-foreground">
            {values.length}/{maxFiles}
          </span>
        </div>
      )}

      {/* Preview Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {values.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
              <img
                src={getFullUrl(url)}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f1f5f9" width="100" height="100"/></svg>';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {values.length < maxFiles && (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all hover:border-primary/50 ${
            uploading ? 'opacity-50 pointer-events-none' : ''
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFilesSelect(e.target.files)}
            className="hidden"
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Add Images</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
