import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Registers app-wide keyboard shortcuts:
 *  - "/"  → focus the search input (navigates to /browse first if needed)
 *  - "g h" → go home (g then h, gmail-style)
 *  - "g b" → go to browse
 *  - "Escape" → blur the currently focused input
 *
 * Shortcuts are ignored while the user is typing in an input/textarea/select,
 * except Escape, which always works.
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    let lastKey = '';
    let lastKeyTime = 0;

    const isTyping = (target) => {
      const tag = target.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
    };

    const handleKeyDown = (e) => {
      // Escape always works, even while typing — blurs the active input.
      if (e.key === 'Escape') {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        return;
      }

      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const now = Date.now();

      // "/" focuses search — navigate to Browse first if we're not already there.
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) {
          searchInput.focus();
        } else {
          navigate('/browse');
          // Wait a tick for the page to mount, then focus.
          setTimeout(() => {
            document.querySelector('input[placeholder*="Search"]')?.focus();
          }, 100);
        }
        return;
      }

      // Two-key "g then x" navigation shortcuts (Gmail-style).
      if (lastKey === 'g' && now - lastKeyTime < 600) {
        if (e.key === 'h') { navigate('/'); }
        else if (e.key === 'b') { navigate('/browse'); }
        else if (e.key === 'u') { navigate('/upload'); }
        else if (e.key === 'd') { navigate('/dashboard'); }
        lastKey = '';
        return;
      }

      lastKey = e.key;
      lastKeyTime = now;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
}
