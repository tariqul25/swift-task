/**
 * Compresses an image File using client-side Canvas and returns a compact Base64 Data URL.
 * Produces lightweight JPEG (~15-40KB) that can be safely stored in MongoDB / Firebase.
 *
 * @param {File} file - The uploaded image file
 * @param {number} maxWidth - Maximum width or height in px (default 400)
 * @param {number} quality - JPEG compression quality 0.1 - 1.0 (default 0.82)
 * @returns {Promise<string>} Base64 Data URL
 */
export const compressImageToBase64 = (file, maxWidth = 400, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
