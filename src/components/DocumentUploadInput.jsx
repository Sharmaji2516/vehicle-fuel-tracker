import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, Eye, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { uploadFile } from '../utils/storageService';
import DocumentViewerModal from './DocumentViewerModal';

const DocumentUploadInput = ({
    label = 'Upload Document',
    description = 'JPG, PNG or PDF • Auto-compressed',
    value = '',
    onChange,
    vehicleId = 'general',
    category = 'documents',
    entryId = null,
    documentTitle = 'Document Preview'
}) => {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setErrorMessage('');
        setIsUploading(true);
        setUploadProgress(15);

        try {
            const result = await uploadFile({
                file,
                vehicleId,
                category,
                entryId,
                onProgress: (pct) => setUploadProgress(pct)
            });

            onChange(result.url);
        } catch (error) {
            console.error('File upload failed:', error);
            setErrorMessage('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = (e) => {
        if (e) e.stopPropagation();
        onChange('');
        setErrorMessage('');
        setShowDeleteConfirm(false);
        setViewerOpen(false);
    };

    const isPdf = typeof value === 'string' && (value.toLowerCase().includes('.pdf') || value.startsWith('data:application/pdf'));

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                    {label}
                </label>
                {description && !value && !isUploading && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {description}
                    </span>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Uploading State */}
            {isUploading && (
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-500 dark:text-indigo-400">
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Compressing & Attaching...
                        </span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-200"
                            style={{ width: `${Math.max(uploadProgress, 10)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Existing / Uploaded Document State */}
            {!isUploading && value && (
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-3.5 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                        {/* Thumbnail preview */}
                        <div
                            onClick={() => setViewerOpen(true)}
                            className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center border border-slate-300 dark:border-slate-700 cursor-pointer hover:opacity-90 transition-opacity"
                        >
                            {isPdf ? (
                                <FileText className="w-6 h-6 text-rose-500" />
                            ) : (
                                <img
                                    src={value}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="truncate">Photo Attached</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                                {isPdf ? 'PDF Document' : 'Compressed Photo • Ready to Save'}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons: View, Change, Delete */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-white/5">
                        <button
                            type="button"
                            onClick={() => setViewerOpen(true)}
                            className="flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 text-xs font-bold transition-all active:scale-95 border border-indigo-500/20"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 border border-slate-300/50 dark:border-slate-700"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Change</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 text-xs font-bold transition-all active:scale-95 border border-rose-500/20"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </button>
                    </div>

                    {/* Inline Delete Confirmation Banner */}
                    {showDeleteConfirm && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 space-y-2 animate-fade-in">
                            <p className="font-bold flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                Remove this photo?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-[11px] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty Upload Trigger */}
            {!isUploading && !value && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all bg-slate-50/50 hover:bg-indigo-50/30 dark:bg-slate-900/30 dark:hover:bg-indigo-500/5 group"
                >
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all shadow-sm">
                        <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-left min-w-0">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                            Click to upload photo or document
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                            Camera capture, Gallery or PDF (Auto-compressed)
                        </p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <p className="text-[11px] text-rose-500 font-medium ml-1">
                    {errorMessage}
                </p>
            )}

            {/* Fullscreen Document Viewer */}
            <DocumentViewerModal
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                documentUrl={value}
                title={documentTitle}
                onDelete={handleRemove}
            />
        </div>
    );
};

export default DocumentUploadInput;
