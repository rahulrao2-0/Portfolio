import React, { useEffect, useRef } from 'react';
import './Cursor.css';

/**
 * Custom pointer: a dot that tracks exactly, plus a ring that trails behind and
 * swells over anything interactive.
 *
 * Only mounts on fine pointers — on a touch screen there is nothing to follow,
 * and hiding the native cursor there would strand a user on a hybrid device.
 */
const HOVER_SELECTOR = 'a, button, [data-cursor="hover"], input, textarea';

const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    // Park both off-screen until the pointer actually moves, so the cursor never
    // flashes in the top-left corner on load.
    let target = { x: -100, y: -100 };
    let ringPos = { x: -100, y: -100 };
    let visible = false;
    let raf = 0;

    const handleMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!visible) {
        visible = true;
        ringPos = { x: target.x, y: target.y };
        root.classList.add('cursor-visible');
      }

      const el = e.target instanceof Element ? e.target.closest(HOVER_SELECTOR) : null;
      root.classList.toggle('cursor-hover', Boolean(el));
    };

    const handleDown = () => root.classList.add('cursor-down');
    const handleUp = () => root.classList.remove('cursor-down');
    const handleLeave = () => root.classList.remove('cursor-visible');
    const handleEnter = () => {
      if (visible) root.classList.add('cursor-visible');
    };

    const render = () => {
      raf = requestAnimationFrame(render);
      // The dot is exact; the ring lerps toward it, which is what gives the
      // pointer its weight. Reduced motion gets a rigid ring instead.
      const k = reduced ? 1 : 0.18;
      ringPos.x += (target.x - ringPos.x) * k;
      ringPos.y += (target.y - ringPos.y) * k;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
    };

    raf = requestAnimationFrame(render);
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    // mouseleave does not bubble to window — document is what receives it.
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      root.classList.remove(
        'has-custom-cursor',
        'cursor-visible',
        'cursor-hover',
        'cursor-down',
      );
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
};

export default Cursor;
