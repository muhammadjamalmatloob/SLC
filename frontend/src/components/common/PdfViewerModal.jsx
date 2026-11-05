import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Loader2, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw 
} from 'lucide-react';
import { downloadElementAsPdf } from '../../utils/pdfGenerator';
import { useApp } from '../../context/AppContext';

export default function PdfViewerModal({
  isOpen,
  onClose,
  title = "Document Viewer",
  documentId,
  filename = "document.pdf",
  orientation = "portrait", // 'portrait' | 'landscape'
  children
}) {
  const { addToast } = useApp();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [scale, setScale] = useState(1);
  const [zoomMode, setZoomMode] = useState('fit'); // 'fit' | 'actual' | 'custom'
  const [docHeight, setDocHeight] = useState(1123);

  const containerRef = useRef(null);
  const docRef = useRef(null);

  const isLandscape = orientation === 'landscape';
  // Standard A4 dimensions in px at 96 DPI:
  // Portrait: 794 x 1123
  // Landscape: 1123 x 794
  const targetBaseWidth = isLandscape ? 1123 : 794;
  const defaultHeight = isLandscape ? 794 : 1123;

  // Auto-calculate fit-scale based on container width
  const updateFitScale = () => {
    if (!containerRef.current) return;
    const availableWidth = containerRef.current.clientWidth - 24; // padding allowance
    if (availableWidth <= 0) return;

    const fitScale = Math.min(1, Math.max(0.25, availableWidth / targetBaseWidth));
    if (zoomMode === 'fit') {
      setScale(fitScale);
    }
  };

  // Recompute scale on open or resize
  useEffect(() => {
    if (!isOpen) return;

    // Default to 'fit' on mobile / small screens, 'actual' or 'fit' on desktop
    const isMobile = window.innerWidth < 850;
    if (isMobile) {
      setZoomMode('fit');
    }

    const timer = setTimeout(() => {
      updateFitScale();
      if (docRef.current) {
        setDocHeight(docRef.current.scrollHeight || defaultHeight);
      }
    }, 50);

    const handleResize = () => {
      updateFitScale();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, orientation, zoomMode]);

  // Keep measuring document height for proper wrapper sizing
  useEffect(() => {
    if (isOpen && docRef.current) {
      const observer = new ResizeObserver(() => {
        if (docRef.current) {
          setDocHeight(docRef.current.scrollHeight || defaultHeight);
        }
      });
      observer.observe(docRef.current);
      return () => observer.disconnect();
    }
  }, [isOpen, children]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoomMode('custom');
    setScale(prev => Math.min(1.75, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomMode('custom');
    setScale(prev => Math.max(0.3, Number((prev - 0.1).toFixed(2))));
  };

  const handleSetActualSize = () => {
    setZoomMode('actual');
    setScale(1);
  };

  const handleSetFitScreen = () => {
    setZoomMode('fit');
    if (containerRef.current) {
      const availableWidth = containerRef.current.clientWidth - 24;
      const fitScale = Math.min(1, Math.max(0.25, availableWidth / targetBaseWidth));
      setScale(fitScale);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    addToast('Generating PDF', 'Capturing full high-resolution A4 document...', 'info');

    const success = await downloadElementAsPdf(documentId, filename, { orientation });
    setIsGeneratingPdf(false);

    if (success) {
      addToast('PDF Downloaded', `Saved as ${filename}`, 'success');
    } else {
      addToast('Download Failed', 'Could not generate PDF. Please try again.', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const zoomPercent = Math.round(scale * 100);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 md:p-5 bg-navy-900/85 backdrop-blur-md overflow-hidden animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full ${isLandscape ? 'max-w-6xl' : 'max-w-4xl'} bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 flex flex-col h-[96vh] sm:h-[92vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* PDF Top Action Bar */}
        <div className="bg-navy-900 px-3 sm:px-5 py-2.5 sm:py-3 border-b border-navy-700 shrink-0 text-white select-none">
          {/* Top Row: Title, Format & Close */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-navy-800/80">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl gradient-coral flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-glow shrink-0">
                PDF
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-white truncate leading-tight">
                  {title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
                  {isLandscape ? 'A4 Landscape (297 × 210 mm)' : 'A4 Portrait (210 × 297 mm)'} • Print-Ready High Res
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Download PDF Button */}
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="gradient-coral text-white font-bold text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-glow flex items-center gap-1.5 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
                title="Save high-resolution A4 PDF"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="hidden xs:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Save as PDF</span>
                  </>
                )}
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="hidden sm:flex bg-navy-800 text-gray-200 hover:text-white hover:bg-navy-700 text-xs font-semibold px-3 py-1.5 sm:py-2 rounded-full border border-navy-700 transition-colors items-center gap-1.5"
                title="Print document"
              >
                <Printer className="w-3.5 h-3.5 text-coral-400" />
                <span>Print</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1 sm:p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-navy-800 transition-colors ml-0.5"
                title="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Mobile-Friendly Zoom & View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium mr-1">View Mode:</span>
              
              {/* Fit to Screen Button */}
              <button
                onClick={handleSetFitScreen}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all flex items-center gap-1 ${
                  zoomMode === 'fit'
                    ? 'bg-coral-500 text-white shadow-glow'
                    : 'bg-navy-800 text-gray-300 hover:text-white hover:bg-navy-700 border border-navy-700'
                }`}
                title="Scale to fit your screen width completely"
              >
                <Minimize2 className="w-3 h-3" />
                <span>Fit Screen</span>
              </button>

              {/* 100% Actual Size Button */}
              <button
                onClick={handleSetActualSize}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all flex items-center gap-1 ${
                  zoomMode === 'actual' && scale === 1
                    ? 'bg-coral-500 text-white shadow-glow'
                    : 'bg-navy-800 text-gray-300 hover:text-white hover:bg-navy-700 border border-navy-700'
                }`}
                title="View at 100% full scale (touch/scroll to pan)"
              >
                <Maximize2 className="w-3 h-3" />
                <span>100%</span>
              </button>
            </div>

            {/* Zoom Adjusters */}
            <div className="flex items-center gap-1 bg-navy-950/70 p-0.5 rounded-lg border border-navy-700/60">
              <button
                onClick={handleZoomOut}
                className="p-1 text-gray-300 hover:text-white hover:bg-navy-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono font-bold text-[10px] sm:text-xs text-coral-400 px-1.5 min-w-[42px] text-center">
                {zoomPercent}%
              </span>

              <button
                onClick={handleZoomIn}
                className="p-1 text-gray-300 hover:text-white hover:bg-navy-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* PDF Document Canvas Viewport */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-5 md:p-8 bg-slate-950/70 flex justify-center items-start"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Scaled document bounding wrapper for accurate scroll extents */}
          <div 
            style={{
              width: `${Math.round(targetBaseWidth * scale)}px`,
              height: `${Math.round(docHeight * scale)}px`,
              transition: 'width 0.15s ease, height 0.15s ease'
            }}
            className="relative shrink-0 shadow-2xl rounded-sm my-auto sm:my-2"
          >
            {/* The actual A4 document sheet with fixed standard pixel width */}
            <div 
              ref={docRef}
              id={documentId} 
              className={`bg-white text-navy-950 rounded-sm font-sans select-text ${
                isLandscape ? 'p-6 sm:p-8' : 'p-6 sm:p-10'
              }`}
              style={{ 
                width: `${targetBaseWidth}px`,
                minHeight: `${defaultHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
                boxSizing: 'border-box'
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
