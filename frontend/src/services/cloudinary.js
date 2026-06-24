/**
 * Cloudinary unsigned upload service.
 * Free tier: 25GB storage + 25GB monthly bandwidth — no credit card needed.
 *
 * Setup (one-time, in Cloudinary dashboard):
 * 1. Sign up at https://cloudinary.com (free)
 * 2. Dashboard → copy your "Cloud name"
 * 3. Settings → Upload → Add upload preset
 *    - Signing Mode: Unsigned
 *    - Folder: campusshare
 *    - Allowed formats: pdf,jpg,jpeg,png,webp
 *    - Max file size: 10000000 (10MB)
 * 4. Copy the preset name
 * 5. Put both values in frontend/.env as VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const isConfigured = () => Boolean(CLOUD_NAME && UPLOAD_PRESET);

/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * Returns { url, publicId, bytes, format } on success.
 * Reports progress via onProgress(percent) using XHR for real progress events.
 */
export const uploadToCloudinary = (file, onProgress) => {
  if (!isConfigured()) {
    return Promise.reject(
      new Error('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to frontend/.env')
    );
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'campusshare');

    // Use 'raw' resource type for PDFs so Cloudinary serves them correctly,
    // 'image' for images. Cloudinary's /auto/upload endpoint detects this automatically.
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            bytes: data.bytes,
            format: data.format,
            resourceType: data.resource_type,
          });
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response.'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData?.error?.message || 'Cloudinary upload failed.'));
        } catch {
          reject(new Error('Cloudinary upload failed.'));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.send(formData);
  });
};

export const isCloudinaryConfigured = isConfigured;
