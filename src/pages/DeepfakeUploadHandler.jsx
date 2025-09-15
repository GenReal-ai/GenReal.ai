import React, { useState } from 'react';
import UploadModal from '../components/Upload';
import Processing from '../components/processing';
import UnifiedResult from '../components/DeepfakeResult';
import api from '../components/utils/api'; 

const DeepfakeUploadHandler = () => {
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'processing', 'result'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- File Type Helpers ---
  const getFileType = (file) => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    const ext = file.name.toLowerCase().split('.').pop();
    const videoExt = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', 'm4v', 'quicktime'];
    const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'];
    const audioExt = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'opus'];
    if (videoExt.includes(ext)) return 'video';
    if (imageExt.includes(ext)) return 'image';
    if (audioExt.includes(ext)) return 'audio';
    return 'unknown';
  };

  const validateFile = (file) => {
    const fileType = getFileType(file);

    if (fileType === 'unknown') {
      return { 
        valid: false, 
        error: `Unsupported file type: ${file.type || 'unknown'}. Please upload video, image, or audio files only.` 
      };
    }
    if (file.size > 500 * 1024 * 1024) {
      return { valid: false, error: 'File size too large. Maximum 500MB allowed.' };
    }
    return { valid: true };
  };

  // --- Upload Handler ---
  const handleFileUpload = async (file, linkInput) => {
    if (!file && !linkInput) {
      setUploadError('Please select a file or provide a link');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      let fileToUpload = file;

      // If link provided → download file
      if (linkInput && !file) {
        try {
          const response = await fetch(linkInput);
          if (!response.ok) throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
          
          const blob = await response.blob();
          const filename = linkInput.split('/').pop() || 'downloaded-file';
          fileToUpload = new File([blob], filename, { type: blob.type });
        } catch (linkError) {
          throw new Error(`Invalid link or unable to download: ${linkError.message}`);
        }
      }

      // Validate file
      const validation = validateFile(fileToUpload);
      if (!validation.valid) {
        setUploadError(validation.error);
        setIsUploading(false);
        return;
      }

      setUploadedFile(fileToUpload);
      setCurrentStep('processing');

      const fileType = getFileType(fileToUpload);

      // Create form data
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('fileType', fileType);

      // Use the unified analyze endpoint
      const response = await api.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 360000, // 6 minutes timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
         
        }
      });



      // Set analysis result with additional metadata
      setAnalysisResult({
        ...response.data,
        detectedFileType: fileType,
        originalFileName: fileToUpload.name,
        fileSize: fileToUpload.size
      });

      // Auto transition to result after a short delay
      setTimeout(() => {
        setCurrentStep('result');
      }, 1500);

    } catch (error) {
      
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.response) {
        // Server responded with error
        const { status, data } = error.response;
        if (status === 413) {
          errorMessage = 'File too large. Maximum size is 500MB.';
        } else if (status === 415) {
          errorMessage = data.error || 'Unsupported file format.';
        } else if (status === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.error || data.details || `Error ${status}: ${error.message}`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        errorMessage = 'Request timeout. The file may be too large or the server is busy.';
      } else {
        // Other errors
        errorMessage = error.message || 'An unexpected error occurred.';
      }

      setUploadError(errorMessage);
      setCurrentStep('upload');
    } finally {
      setIsUploading(false);
    }
  };

  // --- Step Handlers ---
  const handleProcessingComplete = () => setCurrentStep('result');
  
  const handleReset = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setAnalysisResult(null);
    setUploadError(null);
    setIsUploading(false);
  };

  const getExpectedDuration = () => {
    if (!uploadedFile) return 180;
    const fileType = getFileType(uploadedFile);
    const fileSizeMB = uploadedFile.size / (1024 * 1024);
    switch (fileType) {
      case 'video': return Math.max(120, Math.min(360, fileSizeMB * 2.5));
      case 'audio': return Math.max(60, Math.min(240, fileSizeMB * 2));
      case 'image': return Math.max(30, Math.min(120, fileSizeMB * 1.5));
      default: return 180;
    }
  };

  // --- UI Renderer ---
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <UploadModal
            onFileUpload={handleFileUpload}
            uploadError={uploadError}
            isUploading={isUploading}
          />
        );
      case 'processing':
        return (
          <Processing
            uploadedFile={uploadedFile}
            analysisResult={analysisResult}
            onProcessingComplete={handleProcessingComplete}
            expectedDuration={getExpectedDuration()}
          />
        );
      case 'result':
        return (
          <UnifiedResult
            analysisResult={analysisResult}
            onReset={handleReset}
          />
        );
      default:
        return <UploadModal onFileUpload={handleFileUpload} />;
    }
  };

  return (
    <div className="w-full min-h-screen">
      {renderCurrentStep()}
    </div>
  );
};

export default DeepfakeUploadHandler;