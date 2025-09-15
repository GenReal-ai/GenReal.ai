import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const FeedbackForm = ({ isOpen, onClose, modelName = 'Code Plagiarism' }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
  
    const categories = [
      { value: '', label: 'Select Category (Optional)' },
      { value: 'bug', label: 'Bug Report' },
      { value: 'feature_request', label: 'Feature Request' },
      { value: 'improvement', label: 'Improvement Suggestion' },
      { value: 'compliment', label: 'Positive Feedback' },
      { value: 'complaint', label: 'Complaint' },
      { value: 'other', label: 'Other' }
    ];

    const handleSubmit = async () => {
      if (!email.trim() || !feedbackText.trim()) {
        setSubmitError('Email and feedback are required');
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const feedbackData = {
          email: email.trim(),
          model: modelName,
          feedback: feedbackText.trim(),
          rating: rating > 0 ? rating : undefined,
          category: category || 'other'
        };

        console.log('Submitting feedback:', feedbackData);

        const response = await fetch('http://localhost:3003/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit feedback');
        }

        const result = await response.json();
        console.log('Feedback submitted successfully:', result);

        setIsSubmitted(true);
        
        setTimeout(() => {
          onClose();
          setTimeout(() => {
            // Reset form state
            setIsSubmitted(false);
            setRating(0);
            setHoverRating(0);
            setFeedbackText('');
            setEmail('');
            setCategory('');
            setSubmitError(null);
          }, 500);
        }, 2000);

      } catch (error) {
        console.error('Error submitting feedback:', error);
        setSubmitError(error.message || 'Failed to submit feedback. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      if (!isSubmitting) {
        onClose();
        // Reset form after close animation
        setTimeout(() => {
          setRating(0);
          setHoverRating(0);
          setFeedbackText('');
          setEmail('');
          setCategory('');
          setSubmitError(null);
          setIsSubmitted(false);
        }, 300);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-slate-800/95 backdrop-blur-sm border border-cyan-400/20 rounded-2xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!isSubmitting && (
              <button 
                onClick={handleClose} 
                className="absolute top-4 right-4 text-slate-400 hover:text-cyan-300 transition-colors text-2xl z-10"
              >
                ×
              </button>
            )}
            
            {isSubmitted ? (
              <div className="p-8 text-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-green-400 text-4xl mx-auto mb-3 w-12 h-12 flex items-center justify-center bg-green-400/10 rounded-full"
                >
                  ✓
                </motion.div>
                <h2 className="text-xl font-bold text-white">Thank You!</h2>
                <p className="text-slate-400 mt-2">Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  Share Your Feedback
                </h2>
                <p className="text-slate-400 mb-6">How was your experience with {modelName}?</p>
                
                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-slate-300 mb-2 text-sm font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-slate-700/50 border border-cyan-400/20 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors text-sm"
                    required
                  />
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-slate-300 mb-2 text-sm font-medium">
                    Rating (Optional)
                  </label>
                  <div className="flex items-center gap-1 text-2xl text-slate-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`cursor-pointer transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : ''}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(rating === star ? 0 : star)}
                      >
                        ★
                      </span>
                    ))}
                    {rating > 0 && (
                      <span className="text-slate-400 text-sm ml-2">
                        ({rating}/5)
                      </span>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-slate-300 mb-2 text-sm font-medium">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-700/50 border border-cyan-400/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-slate-800">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Feedback Text */}
                <div className="mb-6">
                  <label className="block text-slate-300 mb-2 text-sm font-medium">
                    Your Feedback *
                  </label>
                  <textarea
                    value={feedbackText} 
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                    className="w-full h-24 bg-slate-700/50 border border-cyan-400/20 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors text-sm resize-vertical"
                    required
                  />
                </div>

                {/* Error Display */}
                {submitError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {submitError}
                  </div>
                )}
                
                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                  disabled={!email.trim() || !feedbackText.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>

                <p className="text-slate-500 text-xs mt-3 text-center">
                  * Required fields
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
};

export default FeedbackForm;