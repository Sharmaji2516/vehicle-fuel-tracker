import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, Eye, Loader2, Image as ImageIcon } from 'lucide-react';
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

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setErrorMessage('');
        setIsUploading(true);
        setUploadProgress(10);

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
        e.stopPropagation();
        onChange('');
        setErrorMessage('');
    };

    const isPdf = typeof value === 'string' && (value.toLowerCase().includes('.pdf') || value.startsWith('data:application/pdf'));

    return (
        <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">
                    {label}
                </label>
                {description && !value && !isUploading && (
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
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
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Compressing & Uploading...
                        </span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-indigo-200/50 dark:bg-indigo-950 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-200"
                            style={{ width: `${Math.max(uploadProgress, 5)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Existing / Uploaded Document State */}
            {!isUploading && value && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-sm group">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Thumbnail or Icon */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 flex items-center justify-center border border-slate-300 dark:border-slate-600 relative">
                            {isPdf ? (
                                <FileText className="w-5 h-5 text-rose-500" />
                            ) : (
                                <img
                                    src={value}
                                    alt="Thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">Document Attached</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">
                                {isPdf ? 'PDF Document' : 'Compressed Image'}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setViewerOpen(true)}
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 transition-colors"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-700 dark:bg-slate-700/60 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                        >
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            title="Remove Document"
                            className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Empty Upload Trigger */}
            {!isUploading && !value && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all bg-slate-50/50 hover:bg-indigo-50/30 dark:bg-slate-900/30 dark:hover:bg-indigo-500/5 group"
                >
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all shadow-sm">
                        <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                            Click to upload photo or document
                        </p>
                        <p className="text-[10px] text-slate-400">
                            Camera capture, Gallery or PDF (Auto-compressed)
                        </p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <p className="text-[10px] text-rose-500 font-medium ml-1">
                    {errorMessage}
                </p>
            )}

            {/* Fullscreen Document Viewer */}
            <DocumentViewerModal
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                documentUrl={value}
                title={documentTitle}
            />
        </div>
    );
};

export default DocumentUploadInput;
