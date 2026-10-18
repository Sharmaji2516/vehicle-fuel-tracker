import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Download, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';

const DocumentViewerModal = ({ isOpen, onClose, documentUrl, title = 'Document Viewer', subtitle = '' }) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    // Keyboard shortcut: Press Escape to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !documentUrl) return null;

    const isPdf = typeof documentUrl === 'string' && (documentUrl.toLowerCase().includes('.pdf') || documentUrl.startsWith('data:application/pdf'));

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const handleReset = () => {
        setScale(1);
        setRotation(0);
    };
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = documentUrl;
        link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_document`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
                {/* Backdrop - Click anywhere outside to close */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl cursor-pointer"
                />

                {/* Always-visible Floating Close Button (top-right) */}
                <button
                    onClick={onClose}
                    title="Close (or press ESC)"
                    className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[300] flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/10 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-2xl transition-all active:scale-95 group"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                    <span className="hidden sm:inline">Close (Esc)</span>
                </button>

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative z-[260] bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-white"
                >
                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-slate-900/90 backdrop-blur-md shrink-0 pr-16 sm:pr-6">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                                {isPdf ? <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> : <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
                                    {title}
                                </h3>
                                {subtitle && (
                                    <p className="text-[11px] text-slate-400 font-medium truncate">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Controls & Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            {!isPdf && (
                                <div className="hidden sm:flex items-center bg-slate-800/80 rounded-xl p-1 border border-white/5 mr-1">
                                    <button
                                        onClick={handleZoomOut}
                                        title="Zoom Out"
                                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        title="Reset"
                                        className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        {Math.round(scale * 100)}%
                                    </button>
                                    <button
                                        onClick={handleZoomIn}
                                        title="Zoom In"
                                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </button>
                                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                                    <button
                                        onClick={handleRotate}
                                        title="Rotate 90°"
                                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleDownload}
                                title="Download Document"
                                className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                            >
                                <Download className="w-4 h-4" />
                            </button>

                            <a
                                href={documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open in New Tab"
                                className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>

                            <button
                                onClick={onClose}
                                className="hidden sm:flex p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 rounded-xl transition-all ml-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content Viewer Body */}
                    <div className="relative flex-1 overflow-auto flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 max-h-[75vh]">
                        {isPdf ? (
                            <iframe
                                src={documentUrl}
                                title={title}
                                className="w-full h-[65vh] rounded-xl border border-white/10 bg-white"
                            />
                        ) : (
                            <div className="relative flex items-center justify-center transition-transform duration-200 max-h-full">
                                <motion.img
                                    src={documentUrl}
                                    alt={title}
                                    style={{
                                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                                        transformOrigin: 'center center'
                                    }}
                                    className="max-w-full max-h-[68vh] object-contain rounded-2xl shadow-2xl transition-transform duration-150"
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile Quick Controls Footer */}
                    {!isPdf && (
                        <div className="sm:hidden flex items-center justify-around py-2 px-3 bg-slate-900/95 border-t border-white/10">
                            <button
                                onClick={handleZoomOut}
                                className="p-2 text-slate-300 bg-white/5 rounded-xl border border-white/5 active:scale-95"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-3 py-1.5 text-xs font-mono text-slate-300 bg-white/5 rounded-xl border border-white/5"
                            >
                                {Math.round(scale * 100)}%
                            </button>
                            <button
                                onClick={handleZoomIn}
                                className="p-2 text-slate-300 bg-white/5 rounded-xl border border-white/5 active:scale-95"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleRotate}
                                className="p-2 text-slate-300 bg-white/5 rounded-xl border border-white/5 active:scale-95"
                            >
                                <RotateCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="px-3 py-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DocumentViewerModal;
