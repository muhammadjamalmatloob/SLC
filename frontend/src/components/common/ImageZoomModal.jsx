import React from 'react';
import { X, ZoomIn, Shield } from 'lucide-react';

export default function ImageZoomModal({ isOpen, onClose, imageSrc, title, subtitle, sizeKb }) {
  if (!isOpen || !imageSrc) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-sm sm:max-w-md w-full bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 text-navy-800 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cross Button at Top Right */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 sm:top-3 sm:right-3 p-2 bg-navy-900 text-white sm:text-gray-400 sm:hover:text-navy-900 sm:bg-gray-100 sm:hover:bg-gray-200 rounded-full shadow-lg transition-colors z-20"
          aria-label="Close zoomed view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Zoomed Image Container */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-canvas border border-gray-200 shadow-inner flex items-center justify-center mb-4">
          <img
            src={imageSrc}
            alt={title || "Profile Photo"}
            className="w-full h-full object-cover"
          />
          {sizeKb && (
            <div className="absolute bottom-2 right-2 bg-navy-900/80 text-white font-mono text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
              {sizeKb} KB (Verified &lt;100KB)
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="font-extrabold text-base text-navy-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
