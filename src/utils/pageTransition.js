import { gsap, customEases } from '../lib/gsap';

/** Vertical order of the pages. Index = position in the top-to-bottom stack. */
export const ROUTES = ['/', '/about', '/projects', '/certifications', '/contact'];

export const ROUTE_LABELS = ['Home', 'About', 'Projects', 'Certificates', 'Contact'];

/** Tween length. Longer than the reference demo's 0.7 so the recede has time to
    read as depth instead of as a quick cut. */
const DURATION = 0.85;

/** Must exceed DURATION, or TransitionGroup unmounts the leaving panel mid-flight. */
export const PAGE_TRANSITION_MS = 900;

export const routeIndex = (pathname) => {
  const i = ROUTES.indexOf(pathname);
  return i === -1 ? 0 : i;
};

/**
 * Direction of the current navigation: 1 = moving down the stack, -1 = up.
 *
 * Read at animation time rather than passed as a prop: TransitionGroup keeps the
 * *previous* element for the exiting page, so its props still hold the old
 * direction. onEnter and onExit both fire in the same commit, so reading from
 * here keeps the two halves of the transition in sync.
 */
export const navDirection = { current: 1 };

export const setNavDirection = (delta) => {
  if (delta === 0) return;
  navDirection.current = delta > 0 ? 1 : -1;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/**
 * The reference demo's transition, made direction-aware.
 *
 * The outgoing page recedes — it shrinks, tilts, blurs, darkens and picks up a
 * card edge, so it reads as a physical page falling away into the background —
 * while the incoming page rises up over it behind a clip-path reveal. Scrolling
 * down reveals from the bottom edge upward (as in the demo); scrolling back up
 * mirrors it. Flip WIPE_FROM_BOTTOM_ON_FORWARD to swap those two.
 */
const WIPE_FROM_BOTTOM_ON_FORWARD = true;

/**
 * Travel of the receding page. Kept small on purpose: the stage clips to the
 * viewport, so a large offset would slide the page out of frame (reading as a
 * plain scroll) instead of letting you watch it shrink into the background.
 */
const RECEDE_SHIFT_VH = 10;
const RECEDE_SCALE = 0.84;

/** How far the arriving page travels on its way in, so it reads as rising. */
const ENTER_RISE_VH = 13;

export const slidePage = (node, isEntering) => {
  if (!node) return;

  const dir = navDirection.current;
  const forward = dir > 0;
  const reduced = prefersReducedMotion();
  const duration = reduced ? 0.001 : DURATION;
  const ease = customEases.pageTransition;

  gsap.killTweensOf(node);

  if (isEntering) {
    node.scrollTop = 0;

    // inset(top right bottom left): a 100% top inset opens upward from the
    // bottom edge, a 100% bottom inset opens downward from the top edge.
    const openUpward = forward === WIPE_FROM_BOTTOM_ON_FORWARD;
    const from = openUpward ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)';

    gsap.set(node, {
      clipPath: from,
      opacity: 1,
      zIndex: 20,
      // The clip is measured in the element's own box, so translating the element
      // at the same time carries the revealed band with it: the content slides up
      // into place as more of it appears, instead of being uncovered in place.
      y: openUpward ? `${ENTER_RISE_VH}vh` : `-${ENTER_RISE_VH}vh`,
      transformOrigin: '50% 50%',
      transformPerspective: 1600,
    });

    gsap.to(node, {
      clipPath: 'inset(0% 0% 0% 0%)',
      y: 0,
      duration,
      force3D: true,
      ease,
      onComplete: () => {
        // Hand the panel back to CSS. A leftover transform would make the panel a
        // containing block and break anything position:fixed inside the page.
        gsap.set(node, { clearProps: 'clipPath,zIndex,opacity,transform' });
      },
    });
  } else {
    // Explicit start values: GSAP cannot interpolate box-shadow or filter out of
    // their `none` default, so give it something to tween from.
    gsap.set(node, {
      zIndex: 10,
      pointerEvents: 'none',
      transformOrigin: '50% 50%',
      transformPerspective: 1600,
      filter: 'blur(0px) brightness(1)',
      boxShadow: '0 0px 0px rgba(0, 0, 0, 0)',
    });

    gsap
      .timeline()
      .to(
        node,
        {
          y: forward ? `-${RECEDE_SHIFT_VH}vh` : `${RECEDE_SHIFT_VH}vh`,
          scale: RECEDE_SCALE,
          rotationX: forward ? 5 : -5,
          borderRadius: 34,
          // Darkening is what sells the depth: the page looks like it fell away
          // from the light rather than merely getting smaller.
          filter: reduced ? 'blur(0px) brightness(1)' : 'blur(6px) brightness(0.42)',
          boxShadow: '0 60px 160px rgba(0, 0, 0, 0.85)',
          duration,
          force3D: true,
          ease,
        },
        0,
      )
      // Fade only at the tail. Fading from the start would hide the shrink, which
      // is the part that actually communicates "this page went backwards".
      .to(
        node,
        { opacity: 0.12, duration: duration * 0.42, ease: 'power2.in' },
        duration * 0.58,
      );
  }
};
