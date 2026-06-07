import { useEffect } from 'react';

/**
 * Sets `document.title` while the page is mounted.
 * Restores the previous title on unmount.
 */
export function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · Skin Treatment` : 'Skin Treatment';
    return () => {
      document.title = prev;
    };
  }, [title]);
}
