import { environment } from '../../../environments/environment';

/**
 * Utility function to get the full image URL from image paths stored in the database.
 * Handles various input formats including arrays, JSON strings, and single strings.
 *
 * @param imageUrls - The image path(s) from the database (can be array, JSON string, or single string)
 * @returns The full URL to the image, or null if no valid image exists
 */
export function getImageUrl(imageUrls: string | string[] | null | undefined): string | null {
  if (!imageUrls) {
    return null;
  }

  // Extract the base URL from the API URL (remove '/api' part)
  const baseUrl = environment.apiUrl.replace('/api', '');

  // If it's already an array (from API response), return the first image
  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    const imagePath = imageUrls[0];
    const fullPath = imagePath.startsWith('listings/') ? imagePath : `listings/${imagePath}`;
    return `${baseUrl}/storage/${fullPath}`;
  }

  // If it's a JSON string, parse it and return the first image
  if (typeof imageUrls === 'string') {
    try {
      const parsed = JSON.parse(imageUrls);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const imagePath = parsed[0];
        const fullPath = imagePath.startsWith('listings/') ? imagePath : `listings/${imagePath}`;
        return `${baseUrl}/storage/${fullPath}`;
      }
      // If parsed is a single string
      if (typeof parsed === 'string') {
        const fullPath = parsed.startsWith('listings/') ? parsed : `listings/${parsed}`;
        return `${baseUrl}/storage/${fullPath}`;
      }
    } catch (e) {
      // If it's not JSON, use the string directly with storage path
      const fullPath = imageUrls.startsWith('listings/') ? imageUrls : `listings/${imageUrls}`;
      return `${baseUrl}/storage/${fullPath}`;
    }
  }

  return null;
}

/**
 * Get all image URLs from a listing's image data.
 *
 * @param imageUrls - The image path(s) from the database
 * @returns Array of full image URLs
 */
export function getAllImageUrls(imageUrls: string | string[] | null | undefined): string[] {
  if (!imageUrls) {
    return [];
  }

  const baseUrl = environment.apiUrl.replace('/api', '');
  const urls: string[] = [];

  if (Array.isArray(imageUrls)) {
    imageUrls.forEach((path) => {
      const fullPath = path.startsWith('listings/') ? path : `listings/${path}`;
      urls.push(`${baseUrl}/storage/${fullPath}`);
    });
  } else if (typeof imageUrls === 'string') {
    try {
      const parsed = JSON.parse(imageUrls);
      if (Array.isArray(parsed)) {
        parsed.forEach((path: string) => {
          const fullPath = path.startsWith('listings/') ? path : `listings/${path}`;
          urls.push(`${baseUrl}/storage/${fullPath}`);
        });
      } else {
        const fullPath = parsed.startsWith('listings/') ? parsed : `listings/${parsed}`;
        urls.push(`${baseUrl}/storage/${fullPath}`);
      }
    } catch (e) {
      const fullPath = imageUrls.startsWith('listings/') ? imageUrls : `listings/${imageUrls}`;
      urls.push(`${baseUrl}/storage/${fullPath}`);
    }
  }

  return urls;
}
