/**
 * Utility for lazy loading images with Intersection Observer
 */

export const createImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);
};

/**
 * Lazy load an image element
 */
export const lazyLoadImage = (
  imgElement: HTMLImageElement,
  src: string,
  observer?: IntersectionObserver
): void => {
  const imageObserver =
    observer ||
    createImageObserver((entry) => {
      if (entry.target instanceof HTMLImageElement) {
        entry.target.src = src;
        entry.target.classList.remove('lazy');
        imageObserver.unobserve(entry.target);
      }
    });

  imageObserver.observe(imgElement);
};

