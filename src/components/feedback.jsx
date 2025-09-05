import React from "react";

export default function FeedbackForm({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">
          Feedback Form
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Tell us about the results you received so we can improve!
        </p>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-slate-300 mb-1">Your Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-slate-300 mb-1">Model Used</label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-cyan-400"
              required
            >
              <option value="">Select a model</option>
              <option value="GPT-3.5">GPT-3.5</option>
              <option value="GPT-4">GPT-4</option>
              <option value="Claude">Claude</option>
              <option value="Custom AI">Custom AI</option>
            </select>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-slate-300 mb-1">Feedback</label>
            <textarea
              placeholder="Write your feedback here..."
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-cyan-400 resize-none h-28"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
