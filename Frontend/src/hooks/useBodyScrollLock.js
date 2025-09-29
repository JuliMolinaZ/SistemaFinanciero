import { useEffect } from 'react';

export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      
      // Simply hide body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore original overflow
        document.body.style.overflow = originalOverflow;
      };
    } else {
      // If not locked, ensure body is scrollable
      document.body.style.overflow = '';
    }
  }, [isLocked]);
}