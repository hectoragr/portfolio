import { RefObject, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * Moves keyboard focus to the given element whenever the route changes, so a
 * keyboard user's next Tab starts inside the new page instead of resuming from
 * wherever the previous page's link happened to be.
 *
 * The target needs `tabIndex={-1}` to be programmatically focusable.
 * The initial render is skipped so first load does not steal focus from the
 * skip link.
 */
const useFocusOnRouteChange = (ref: RefObject<HTMLElement | null>): void => {
  const { pathname } = useLocation();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    ref.current?.focus();
  }, [pathname, ref]);
};

export default useFocusOnRouteChange;
