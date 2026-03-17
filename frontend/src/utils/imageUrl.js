// Utility function to get the full image URL
// Handles both external URLs (http/https) and local uploads (/api/uploads/...)

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL (external), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's already using /api/uploads path, prepend base URL
  if (imageUrl.startsWith('/api/uploads/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  
  // If it's using old /uploads/ path (without /api), convert to new path
  if (imageUrl.startsWith('/uploads/')) {
    return `${API_BASE_URL}/api${imageUrl}`;
  }
  
  // For any other relative path, prepend API base URL
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  
  // Return as is if none of the above
  return imageUrl;
};

export default getImageUrl;
