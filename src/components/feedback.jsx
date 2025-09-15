import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const FeedbackForm = ({ isOpen, onClose, modelName = 'Code Plagiarism' }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const API_BASE_URL =  import.meta.env.VITE_SUGGESTION_SERVICE_API;

    const resetFormState = () => {
        setRating(0);
        setHoverRating(0);
        setFeedbackText('');
        setSubmitError(null);
        setIsSubmitted(false);
    };

    const handleSubmit = async () => {
        setSubmitError(null);

        // Validation
        if (rating === 0) {
            setSubmitError('Please provide a star rating.');
            return;
        }
        if (!feedbackText.trim()) {
            setSubmitError('Please provide your feedback.');
            return;
        }

        setIsSubmitting(true);

        try {
            const feedbackData = {
                model: modelName,
                feedback: feedbackText.trim(),
                rating: rating,
            };

            const response = await fetch(`${API_BASE_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); // Handle cases where error response is not valid JSON
                throw new Error(errorData.message || `An error occurred: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Feedback submitted successfully:', result);

            setIsSubmitted(true);

            // Close the modal after showing the success message
            setTimeout(() => {
                onClose();
                // Reset the form state after the modal is closed
                setTimeout(resetFormState, 300);
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
            setTimeout(resetFormState, 300);
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
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="bg-slate-800/95 backdrop-blur-sm border border-cyan-400/20 rounded-2xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
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
                            <p className="text-slate-400 mt-2">Your feedback helps us improve.</p>
                        </div>
                    ) : (
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                                Share Your Feedback
                            </h2>
                            <p className="text-slate-400 mb-6 text-sm">How was your experience with {modelName}?</p>

                            {/* Rating */}
                            <div className="mb-5">
                                <label className="block text-slate-300 mb-2 text-sm font-medium">
                                    How would you rate it? *
                                </label>
                                <div className="flex items-center gap-1 text-3xl text-slate-500">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.span
                                            key={star}
                                            whileHover={{ scale: 1.2, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`cursor-pointer transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : ''}`}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                        >
                                            ★
                                        </motion.span>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback Text */}
                            <div className="mb-6">
                                <label className="block text-slate-300 mb-2 text-sm font-medium">
                                    Your Suggestion *
                                </label>
                                <textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    placeholder="Tell us what you liked or what could be better..."
                                    className="w-full h-28 bg-slate-700/50 border border-cyan-400/20 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors text-sm resize-none"
                                    required
                                />
                            </div>

                            {/* Error Display */}
                            <AnimatePresence>
                                {submitError && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center"
                                    >
                                        {submitError}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                                disabled={isSubmitting}
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
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FeedbackForm;