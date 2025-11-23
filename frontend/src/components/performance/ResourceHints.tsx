import { useEffect } from 'react';

/**
 * Component to add dynamic resource hints based on API URL
 * This runs client-side to use environment variables
 */
const ResourceHints = () => {
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337';
    try {
      const url = new URL(apiUrl);
      const origin = url.origin;

      // Check if resource hints already exist
      const existingPrefetch = document.querySelector(`link[rel="dns-prefetch"][href="${origin}"]`);
      const existingPreconnect = document.querySelector(`link[rel="preconnect"][href="${origin}"]`);

      // Add dns-prefetch if not exists
      if (!existingPrefetch) {
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = origin;
        document.head.appendChild(dnsPrefetch);
      }

      // Add preconnect if not exists
      if (!existingPreconnect) {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = origin;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);
      }
    } catch (error) {
      // Invalid URL, skip
      console.warn('Could not add resource hints:', error);
    }
  }, []);

  return null;
};

export default ResourceHints;

