import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Download, ExternalLink, FileText, Image as ImageIcon, Trash2, AlertTriangle } from 'lucide-react';

const DocumentViewerModal = ({ isOpen, onClose, documentUrl, title = 'Document Viewer', subtitle = '', onDelete = null }) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Keyboard shortcut: Press Escape to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                if (showDeleteConfirm) {
                    setShowDeleteConfirm(false);
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, showDeleteConfirm]);

    // Reset states on open/close
    useEffect(() => {
        if (!isOpen) {
            setScale(1);
            setRotation(0);
            setShowDeleteConfirm(false);
            setIsDeleting(false);
        }
    }, [isOpen]);

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

    const confirmDelete = async () => {
        if (!onDelete) return;
        setIsDeleting(true);
        try {
            await onDelete();
            setShowDeleteConfirm(false);
            onClose();
        } catch (err) {
            console.error('Delete failed:', err);
        } finally {
            setIsDeleting(false);
        }
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
                    <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-slate-900/90 backdrop-blur-md shrink-0 pr-16 sm:pr-6">
                        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 mr-2">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                                {isPdf ? <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> : <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs sm:text-base font-bold tracking-tight text-white truncate max-w-[160px] sm:max-w-xs md:max-w-md">
                                    {title}
                                </h3>
                                {subtitle && (
                                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[160px] sm:max-w-xs md:max-w-md">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Controls & Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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

                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    title="Delete this photo/document"
                                    className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-600 border border-rose-500/30 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                                >
                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                                    <span>Delete</span>
                                </button>
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

                        {/* Confirmation Overlay for Delete */}
                        <AnimatePresence>
                            {showDeleteConfirm && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 z-50 text-center"
                                >
                                    <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-4">
                                        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                                            <Trash2 className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white">Delete this Photo / Document?</h4>
                                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                                This will remove the attached document. You will be able to attach a fresh photo or bill anytime.
                                            </p>
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={confirmDelete}
                                                disabled={isDeleting}
                                                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 active:scale-95 disabled:opacity-50"
                                            >
                                                {isDeleting ? 'Deleting...' : 'Yes, Delete Photo'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowDeleteConfirm(false)}
                                                disabled={isDeleting}
                                                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all border border-white/10 active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Quick Controls Footer */}
                    <div className="sm:hidden flex items-center justify-between py-2.5 px-3 bg-slate-900/95 border-t border-white/10">
                        {!isPdf ? (
                            <>
                                <button
                                    onClick={handleZoomOut}
                                    className="p-2 text-slate-300 bg-white/5 rounded-xl border border-white/5 active:scale-95"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-2.5 py-1.5 text-xs font-mono text-slate-300 bg-white/5 rounded-xl border border-white/5"
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
                            </>
                        ) : <div />}

                        <div className="flex items-center gap-1.5">
                            {onDelete && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-500/20 hover:bg-rose-600 hover:text-white rounded-xl border border-rose-500/30 active:scale-95"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-white/10 rounded-xl border border-white/10 active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DocumentViewerModal;
