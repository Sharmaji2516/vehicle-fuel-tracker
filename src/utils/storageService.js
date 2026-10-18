import { storage, auth, isConfigured } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { compressImage, fileToDataUrl } from './imageCompressor';

// Flag to track whether the Firebase Cloud Storage bucket is activated on Google Cloud (Blaze plan)
// Defaults to false because the project is currently on the Spark plan without an active Cloud Storage bucket.
// This prevents CORS errors, network timeouts, and stuck uploads!
let isCloudStorageBucketActive = false;

/**
 * Uploads a document (image or PDF).
 * Compresses images to ~80-140KB.
 * Provides instant Base64 data storage that works 100% on Spark (free) plan without CORS errors.
 * 
 * @param {Object} params
 * @param {File} params.file - The file to upload
 * @param {string} params.vehicleId - ID of the vehicle
 * @param {string} [params.category='documents'] - 'puc' | 'insurance' | 'fuel_bills' | 'service_bills'
 * @param {string} [params.entryId] - Optional entry/service ID for bills
 * @param {function} [params.onProgress] - Callback for progress (0-100)
 * @returns {Promise<{ url: string, isCloud: boolean, fileName: string }>}
 */
export const uploadFile = async ({
    file,
    vehicleId = 'general',
    category = 'documents',
    entryId = null,
    onProgress = null
}) => {
    if (!file) {
        throw new Error('No file provided for upload');
    }

    if (onProgress) onProgress(15);

    // 1. Compress image client-side to ensure lightweight storage (~80-140 KB)
    let processableFile = file;
    if (file.type.startsWith('image/')) {
        try {
            processableFile = await compressImage(file, { maxWidth: 1280, maxHeight: 1280, quality: 0.72 });
        } catch (compressionErr) {
            console.warn('Image compression skipped due to error, using original:', compressionErr);
        }
    }

    if (onProgress) onProgress(45);

    const currentUserId = auth?.currentUser?.uid;
    const canUseCloudStorage = isConfigured && storage && currentUserId && isCloudStorageBucketActive;

    // 2. If Cloud Storage bucket is active on Google Cloud, upload to Firebase Storage
    if (canUseCloudStorage) {
        try {
            const timestamp = Date.now();
            const cleanFileName = (processableFile.name || 'document.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
            
            const pathParts = ['users', currentUserId, 'vehicles', vehicleId, category];
            if (entryId) {
                pathParts.push(`${entryId}_${timestamp}_${cleanFileName}`);
            } else {
                pathParts.push(`${timestamp}_${cleanFileName}`);
            }
            const fullPath = pathParts.join('/');

            const storageReference = ref(storage, fullPath);
            const uploadTask = uploadBytesResumable(storageReference, processableFile, {
                contentType: processableFile.type
            });

            // Fast timeout in case bucket is unprovisioned or blocked by CORS
            const downloadUrl = await Promise.race([
                new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            if (onProgress && snapshot.totalBytes > 0) {
                                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                onProgress(progress);
                            }
                        },
                        (error) => reject(error),
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(url);
                        }
                    );
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Storage timeout / unprovisioned')), 2000))
            ]);

            if (onProgress) onProgress(100);
            return {
                url: downloadUrl,
                isCloud: true,
                fileName: file.name
            };
        } catch (storageError) {
            console.warn('Cloud Storage bucket not active or blocked by CORS, using direct compressed storage:', storageError);
            isCloudStorageBucketActive = false;
        }
    }

    // 3. Fast, reliable, 100% free storage (Saves directly to database, zero credit card, zero CORS issues!)
    if (onProgress) onProgress(80);
    const dataUrl = await fileToDataUrl(processableFile);
    if (onProgress) onProgress(100);

    return {
        url: dataUrl,
        isCloud: false,
        fileName: file.name
    };
};

/**
 * Safely deletes a file from Firebase Storage if it is a cloud URL.
 */
export const deleteFile = async (fileUrl) => {
    if (!fileUrl || typeof fileUrl !== 'string') return;
    if (!fileUrl.includes('firebasestorage.googleapis.com')) return;

    try {
        const storageReference = ref(storage, fileUrl);
        await deleteObject(storageReference);
    } catch (err) {
        console.warn('Could not delete old storage file:', err.message);
    }
};
