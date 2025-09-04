import React, { useState } from 'react';
import UploadModal from '../components/Upload';
import Processing from '../components/processing';
import UnifiedResult from '../components/DeepfakeResult';

const DeepfakeUploadHandler = () => {
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'processing', 'result'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const API_BASE_URL = 'http://localhost:3002';

  const getFileType = (file) => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    
    // Fallback to extension-based detection
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
    const allowedTypes = [
      // Video types
      'video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/quicktime',
      'video/x-msvideo', 'video/x-ms-wmv',
      // Image types  
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff',
      // Audio types
      'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/ogg', 'audio/webm',
      'audio/flac', 'audio/opus'
    ];

    const fileType = getFileType(file);
    
    if (fileType === 'unknown') {
      return {
        valid: false,
        error: `Unsupported file type: ${file.type || 'unknown'}. Please upload a video (MP4, AVI, MOV, MKV, WEBM), image (JPG, PNG, WEBP, GIF), or audio file (MP3, WAV, M4A, AAC, OGG).`
      };
    }

    // Check file size (500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum allowed size is 500MB'
      };
    }

    return { valid: true };
  };

  const handleFileUpload = async (file, linkInput) => {
    if (!file && !linkInput) {
      setUploadError('Please select a file or provide a link');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      let fileToUpload = file;

      // If link is provided, try to fetch the file
      if (linkInput && !file) {
        try {
          const response = await fetch(linkInput);
          if (!response.ok) {
            throw new Error('Failed to fetch file from link');
          }
          
          const blob = await response.blob();
          const filename = linkInput.split('/').pop() || 'downloaded-file';
          fileToUpload = new File([blob], filename, { type: blob.type });
        } catch (linkError) {
          setUploadError('Failed to download file from the provided link. Please check the URL and try again.');
          setIsUploading(false);
          return;
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

      // Determine the file type for processing
      const fileType = getFileType(fileToUpload);
      console.log(`Processing ${fileType} file:`, fileToUpload.name);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', fileToUpload);
      
      // Add file type as metadata if needed
      formData.append('fileType', fileType);

      // Make API call
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      // Set the result data with enhanced metadata
      setAnalysisResult({
        ...result,
        detectedFileType: fileType, // Add our detected file type
        originalFileName: fileToUpload.name
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'An error occurred during upload. Please try again.');
      setCurrentStep('upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcessingComplete = () => {
    setCurrentStep('result');
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setAnalysisResult(null);
    setUploadError(null);
    setIsUploading(false);
  };

  const getExpectedDuration = () => {
    if (!uploadedFile) return 180; // Default 3 minutes

    const fileType = getFileType(uploadedFile);
    const fileSizeMB = uploadedFile.size / (1024 * 1024);

    // Estimate processing time based on file type and size
    switch (fileType) {
      case 'video':
        return Math.max(120, Math.min(300, fileSizeMB * 2)); // 2-5 minutes for video
      case 'audio':
        return Math.max(60, Math.min(180, fileSizeMB * 1.5)); // 1-3 minutes for audio  
      case 'image':
        return Math.max(30, Math.min(120, fileSizeMB * 1)); // 30 seconds - 2 minutes for image
      default:
        return 180;
    }
  };

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