import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, AlertTriangle, X } from 'lucide-react';
import { FaVideo, FaImage, FaVolumeUp } from 'react-icons/fa';

const UploadModal = ({ onFileUpload, uploadError, isUploading }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedType, setSelectedType] = useState('video');
  const [showMismatchDialog, setShowMismatchDialog] = useState(false);
  const [mismatchDetails, setMismatchDetails] = useState({ actualType: '', expectedType: '', fileName: '' });

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Animation for modal entrance (simulated since we don't have gsap)
    if (modalRef.current) {
      modalRef.current.style.transform = 'translateX(200px)';
      modalRef.current.style.opacity = '0';
      setTimeout(() => {
        modalRef.current.style.transform = 'translateX(0)';
        modalRef.current.style.opacity = '1';
        modalRef.current.style.transition = 'all 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }, 100);
    }
  }, []);

  // Show error toast when uploadError changes
  useEffect(() => {
    if (uploadError) {
      setToastMessage(`❌ ${uploadError}`);
      setTimeout(() => setToastMessage(null), 5000);
    }
  }, [uploadError]);

  // Generate file preview when file changes
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  }, [file]);

  // Paste file from clipboard
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
      for (let item of items) {
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          if (validateFileType(blob)) {
            setFile(blob);
            setToastMessage("📋 File pasted from clipboard!");
            setTimeout(() => setToastMessage(null), 3000);
          }
          break;
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [selectedType]);

  // File type validation function
  const validateFileType = (selectedFile) => {
    if (!selectedFile) return false;

    const fileType = selectedFile.type;
    const fileName = selectedFile.name;

    let isValid = false;
    let actualType = '';
    let expectedTypes = '';

    // Determine actual file type
    if (fileType.startsWith('video/')) {
      actualType = 'Video';
    } else if (fileType.startsWith('image/')) {
      actualType = 'Image';
    } else if (fileType.startsWith('audio/')) {
      actualType = 'Audio';
    } else {
      actualType = 'Unknown';
    }

    // Check if file type matches selected type
    switch (selectedType) {
      case 'video':
        isValid = fileType.startsWith('video/');
        expectedTypes = 'Video files (MP4,MOV)';
        break;
      case 'image':
        isValid = fileType.startsWith('image/');
        expectedTypes = 'Image files (JPG, PNG, JPEG)';
        break;
      case 'audio':
        isValid = fileType.startsWith('audio/');
        expectedTypes = 'Audio files (MP3, WAV)';
        break;
      default:
        isValid = false;
    }

    if (!isValid) {
      setMismatchDetails({
        actualType,
        expectedType: expectedTypes,
        fileName
      });
      setShowMismatchDialog(true);
    }

    return isValid;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFileType(droppedFile)) {
        setFile(droppedFile);
        setToastMessage("📁 File Dropped!");
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFileType(selectedFile)) {
        setFile(selectedFile);
        setToastMessage("📁 File Selected!");
        setTimeout(() => setToastMessage(null), 3000);
      }
      // Clear the input to allow selecting the same file again after fixing the type
      e.target.value = '';
    }
  };

  const handleConfirm = async () => {
    if (!file) {
      setToastMessage("❌ Please select a file");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    await onFileUpload(file, '');
  };

  const handleChangeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeMismatchDialog = () => {
    setShowMismatchDialog(false);
    setMismatchDetails({ actualType: '', expectedType: '', fileName: '' });
  };

  const getAcceptString = () => {
    switch (selectedType) {
      case 'video':
        return 'video/*';
      case 'image':
        return 'image/*';
      case 'audio':
        return 'audio/*';
      default:
        return 'video/*';
    }
  };

  const getFileTypeDescription = () => {
    switch (selectedType) {
      case 'video':
        return 'MP4';
      case 'image':
        return 'JPG, PNG, JPEG';
      case 'audio':
        return 'MP3, WAV';
      default:
        return 'MP4';
    }
  };

  const fileTypeOptions = [
    { id: 'video', label: 'Video', icon: FaVideo, color: 'blue' },
    { id: 'image', label: 'Image', icon: FaImage, color: 'green' },
    { id: 'audio', label: 'Audio', icon: FaVolumeUp, color: 'purple' },
  ];

  const colorClasses = {
    blue: "border-blue-400 bg-blue-400/10 text-blue-400",
    green: "border-green-400 bg-green-400/10 text-green-400",
    purple: "border-purple-400 bg-purple-400/10 text-purple-400",
  };

  const renderFilePreview = () => {
    if (!file || !filePreview) return null;

    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      return (
        <div className="text-center">
          <img 
            src={filePreview} 
            alt="Preview" 
            className="max-w-full max-h-48 mx-auto rounded-xl shadow-lg border border-cyan-400/30 mb-4"
          />
          <p className="font-semibold text-sm sm:text-base mb-2">{file.name}</p>
          <button
            onClick={handleChangeFile}
            className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
          >
            Change File
          </button>
        </div>
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <div className="text-center">
          <video 
            src={filePreview} 
            controls 
            className="max-w-full max-h-48 mx-auto rounded-xl shadow-lg border border-cyan-400/30 mb-4"
          />
          <p className="font-semibold text-sm sm:text-base mb-2">{file.name}</p>
          <button
            onClick={handleChangeFile}
            className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
          >
            Change File
          </button>
        </div>
      );
    } else if (fileType.startsWith('audio/')) {
      return (
        <div className="text-center">
          <div className="bg-slate-700/50 p-4 rounded-xl border border-cyan-400/30 mb-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaVolumeUp className="text-purple-400 text-xl" />
              <span className="text-white text-sm font-medium">{file.name}</span>
            </div>
            <audio 
              src={filePreview} 
              controls 
              className="w-full"
            />
          </div>
          <button
            onClick={handleChangeFile}
            className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
          >
            Change File
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative text-white overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-slate-800/90 backdrop-blur-sm border border-cyan-400/30 rounded-3xl px-4 sm:px-6 md:px-8 py-6 w-full max-w-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={() => window.location.replace('/')}
          className="absolute top-3 right-4 text-white text-xl font-bold hover:text-cyan-400 transition"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Upload your content
        </h2>

        {/* File Type Selector */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex gap-3 sm:gap-4">
            {fileTypeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedType === option.id;  
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedType(option.id);
                    // Clear file when switching types to avoid confusion
                    if (file) {
                      setFile(null);
                      setFilePreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }
                  }}
                  className={`min-w-[90px] px-4 py-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    isSelected 
                      ? colorClasses[option.color] 
                      : "border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <Icon className="text-sm sm:text-lg" />
                  <span className="text-sm sm:text-base md:text-lg font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropzone or File Preview */}
        <div
          className={`border-2 border-dashed rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center transition-all duration-300 flex flex-col items-center justify-center
            ${file ? 'border-cyan-400/50 bg-slate-700/20 max-h-[350px]' : dragging ? 'border-cyan-400 bg-cyan-400/10 scale-105' : 'border-cyan-400/50 bg-slate-700/30'}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
        >
          {file ? (
            renderFilePreview()
          ) : (
            <>
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="mb-3 sm:mb-4">
                  <UploadCloud className="text-cyan-400 text-3xl sm:text-4xl md:text-6xl mx-auto animate-pulse" />
                </div>
                <p className="font-semibold text-sm sm:text-base md:text-lg mb-2">
                  {`Drag and drop ${selectedType} files here`}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Supported formats: {getFileTypeDescription()} <br />
                  <span className="text-cyan-400">Max file size: 500MB</span>
                </p>
              </label>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={getAcceptString()}
                onChange={handleFileSelect}
              />
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 sm:gap-4">
          <button
            className="bg-slate-600 hover:bg-slate-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            onClick={() => window.location.replace('/')}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            className={`px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base ${
              isUploading 
                ? 'bg-slate-600 text-slate-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
            }`}
            onClick={handleConfirm}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </div>
            ) : (
              'Analyze Content'
            )}
          </button>
        </div>
      </div>

      {/* File Type Mismatch Dialog */}
      {showMismatchDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-red-400/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-500/20 p-3 rounded-full">
                <AlertTriangle className="text-red-400 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">
                  Incorrect File Type
                </h3>
                <div className="text-sm text-slate-300 space-y-2">
                  <p><span className="font-medium">File:</span> {mismatchDetails.fileName}</p>
                  <p><span className="font-medium">Detected Type:</span> <span className="text-red-400">{mismatchDetails.actualType}</span></p>
                  <p><span className="font-medium">Expected:</span> <span className="text-green-400">{mismatchDetails.expectedType}</span></p>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Please select the correct file type or change your selection above.
                </p>
              </div>
              <button
                onClick={closeMismatchDialog}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="text-lg" />
              </button>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeMismatchDialog}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-2xl z-50 backdrop-blur-sm border text-sm sm:text-base transition-all duration-300 ${
          toastMessage.includes('❌') 
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400/30' 
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/30'
        }`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default UploadModal;