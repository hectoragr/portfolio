import { RefObject, useEffect } from 'react';

/**
 * Elements that can receive focus. `[tabindex="-1"]` is excluded on purpose:
 * those are programmatic focus targets, not Tab stops.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Confines Tab / Shift+Tab to the elements inside `containerRef` while
 * `isActive` is true, and calls `onEscape` when Escape is pressed.
 *
 * Used for the mobile navigation drawer, which behaves as a modal dialog: with
 * the rest of the page still in the DOM behind it, focus would otherwise walk
 * out of the drawer and land on content hidden under the overlay.
 */
const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onEscape?: () => void
): void => {
  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Re-queried on each keypress because the drawer's contents can change.
    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(element => element.getAttribute('aria-hidden') !== 'true');

    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      // Nothing to trap — let the browser do whatever it would normally do
      // rather than swallowing the keystroke.
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isOutside = !container.contains(active);

      if (event.shiftKey && (active === first || isOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || isOutside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, isActive, onEscape]);
};

export default useFocusTrap;
