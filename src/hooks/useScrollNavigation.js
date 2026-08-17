import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, PAGE_TRANSITION_MS, routeIndex } from '../utils/pageTransition';

/** How close to a panel's own scroll edge counts as "at the edge". */
const EDGE_TOLERANCE = 4;
/** Accumulated wheel distance (px) needed before a page change fires. */
const WHEEL_THRESHOLD = 40;
/** Quiet period after the last wheel event before unlocking (eats trackpad inertia). */
const SETTLE_MS = 240;
/** Minimum touch travel (px) that counts as a swipe. */
const SWIPE_MIN = 60;

const normalizeWheel = (event) => {
  if (event.deltaMode === 1) return event.deltaY * 16; // lines
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight; // pages
  return event.deltaY;
};

/**
 * Drives page navigation from vertical intent — wheel, touch swipe and
 * arrow/page keys — instead of clicking nav links. A page whose own content
 * overflows scrolls normally first; only once it is parked at its top or bottom
 * edge does further movement change pages.
 */
export default function useScrollNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const indexRef = useRef(routeIndex(location.pathname));
  const lockedRef = useRef(false);
  const unlockAtRef = useRef(0);
  const unlockTimerRef = useRef(null);
  const wheelAccRef = useRef(0);

  useEffect(() => {
    indexRef.current = routeIndex(location.pathname);
  }, [location.pathname]);

  const scheduleUnlock = useCallback(() => {
    clearTimeout(unlockTimerRef.current);
    const wait = Math.max(0, unlockAtRef.current - performance.now());
    unlockTimerRef.current = setTimeout(() => {
      lockedRef.current = false;
      wheelAccRef.current = 0;
    }, wait);
  }, []);

  const goToIndex = useCallback(
    (next) => {
      if (lockedRef.current) return false;
      if (next < 0 || next >= ROUTES.length || next === indexRef.current) return false;

      indexRef.current = next;
      lockedRef.current = true;
      wheelAccRef.current = 0;
      unlockAtRef.current = performance.now() + PAGE_TRANSITION_MS + 80;
      navigate(ROUTES[next]);
      scheduleUnlock();
      return true;
    },
    [navigate, scheduleUnlock],
  );

  useEffect(() => {
    const activePanel = () => document.querySelector('.page-container[data-active="true"]');

    const panelFrom = (target) =>
      (target instanceof Element ? target.closest('.page-container') : null) || activePanel();

    const canScrollInside = (el, dir) => {
      if (!el) return false;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= EDGE_TOLERANCE) return false;
      return dir > 0 ? el.scrollTop < max - EDGE_TOLERANCE : el.scrollTop > EDGE_TOLERANCE;
    };

    const step = (dir) => goToIndex(indexRef.current + dir);

    const handleWheel = (event) => {
      if (event.ctrlKey) return; // pinch-zoom
      const delta = normalizeWheel(event);
      if (delta === 0) return;
      const dir = delta > 0 ? 1 : -1;

      if (lockedRef.current) {
        event.preventDefault();
        unlockAtRef.current = Math.max(unlockAtRef.current, performance.now() + SETTLE_MS);
        scheduleUnlock();
        return;
      }

      // The panel still has room to scroll: let the browser do its normal thing.
      if (canScrollInside(panelFrom(event.target), dir)) {
        wheelAccRef.current = 0;
        return;
      }

      event.preventDefault();

      if (wheelAccRef.current !== 0 && Math.sign(wheelAccRef.current) !== dir) {
        wheelAccRef.current = 0;
      }
      wheelAccRef.current += delta;
      if (Math.abs(wheelAccRef.current) < WHEEL_THRESHOLD) return;

      wheelAccRef.current = 0;
      step(dir);
    };

    const handleKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
          return;
        }
      }

      let dir = 0;
      if (event.key === 'ArrowDown' || event.key === 'PageDown') dir = 1;
      else if (event.key === 'ArrowUp' || event.key === 'PageUp') dir = -1;
      else return;

      if (canScrollInside(activePanel(), dir)) return;

      event.preventDefault();
      if (!lockedRef.current) step(dir);
    };

    let touchStartY = 0;
    let touchPanel = null;
    let tracking = false;

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) {
        tracking = false;
        return;
      }
      touchStartY = event.touches[0].clientY;
      touchPanel = panelFrom(event.target);
      tracking = true;
    };

    const handleTouchEnd = (event) => {
      if (!tracking) return;
      tracking = false;
      if (lockedRef.current) return;

      const endY = event.changedTouches?.[0]?.clientY ?? touchStartY;
      const travel = touchStartY - endY; // positive = swiped up = go deeper
      if (Math.abs(travel) < SWIPE_MIN) return;

      const dir = travel > 0 ? 1 : -1;
      if (canScrollInside(touchPanel, dir)) return;
      step(dir);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      clearTimeout(unlockTimerRef.current);
    };
  }, [goToIndex, scheduleUnlock]);

  return { goToIndex, activeIndex: routeIndex(location.pathname) };
}
