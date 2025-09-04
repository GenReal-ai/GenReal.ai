import React, { useState } from 'react';
import UploadModal from '../components/Upload';
import Processing from '../components/processing';
import VideoResult from '../components/VideoResult';

const DeepfakeUploadHandler = () => {
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'processing', 'result'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const API_BASE_URL = 'http://localhost:3002';

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
          setUploadError('Failed to download file from the provided link');
          setIsUploading(false);
          return;
        }
      }

      // Validate file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
      if (!allowedTypes.includes(fileToUpload.type)) {
        setUploadError('Unsupported file type. Please upload a video file (MP4, AVI, MOV, MKV, WEBM)');
        setIsUploading(false);
        return;
      }

      // Check file size (500MB limit as per backend)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (fileToUpload.size > maxSize) {
        setUploadError('File size too large. Maximum allowed size is 500MB');
        setIsUploading(false);
        return;
      }

      setUploadedFile(fileToUpload);
      setCurrentStep('processing');

      // Create form data
      const formData = new FormData();
      formData.append('file', fileToUpload);

      // Make API call
      const response = await fetch(`${API_BASE_URL}/api/analyze/video`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      // Set the result data
      setAnalysisResult(result);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'An error occurred during upload');
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
            expectedDuration={180} // 3 minutes in seconds
          />
        );
      case 'result':
        return (
          <VideoResult 
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