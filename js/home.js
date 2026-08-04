/* ==========================================================================
   COLLABORATION FOR GOOD — home.js
   Behavior unique to index.html. Runs AFTER main.js (defer preserves order).

   Two features:
     1. Animated credential counters
     2. Click-to-load video facade
   ========================================================================== */

'use strict';


/* ==========================================================================
   FEATURE 1 — ANIMATED CREDENTIAL COUNTERS

   PURPOSE: Count the credential numbers up from zero when they scroll into
   view, drawing attention to Tyler's track record.

   WHY requestAnimationFrame INSTEAD OF setInterval:
   setInterval fires on a fixed timer that has no relationship to the browser's
   paint cycle. On a busy page its callbacks queue up, drift, and produce
   visibly uneven counting. requestAnimationFrame hands control to the browser,
   which calls us exactly once per painted frame and pauses entirely when the
   tab is backgrounded — smoother animation and less battery drain.

   WHY WE DRIVE OFF ELAPSED TIME, NOT A FIXED INCREMENT:
   Incrementing by a set amount each frame means the animation takes longer on
   a slow device than a fast one. Calculating progress from elapsed
   milliseconds means the animation always finishes in exactly 1600ms
   regardless of frame rate. This is the standard fix for frame-rate-dependent
   animation.

   ACCESSIBILITY NOTE: the final value is already hardcoded in the HTML. If
   JavaScript never runs, or the user prefers reduced motion, the correct
   number is on screen. This function only ever replaces a correct value with
   a correct value.
   ========================================================================== */
function initCounters() {

  const counters = document.querySelectorAll('[data-count-to]');

  // Nothing to animate on this page — exit before doing any work.
  if (!counters.length) return;

  // Respect the OS-level motion preference and bail out entirely. The static
  // numbers already in the HTML are the correct end state.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Without IntersectionObserver we simply leave the static numbers alone.
  if (!('IntersectionObserver' in window)) return;

  const DURATION = 1600;   // Total animation length in milliseconds

  /* Easing function: "ease-out cubic".
     Takes linear progress (0 → 1) and returns eased progress (0 → 1), fast at
     the start and slowing to a stop. Linear counting looks mechanical; easing
     out makes the number feel like it is settling into place.
     The math: invert progress, cube it, invert the result. */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /* Animates a single counter element from 0 to its target value.
     @param {HTMLElement} element - the span holding the number */
  function animateCounter(element) {

    // Read configuration from data attributes. Number() converts the string
    // the DOM always returns into an actual number.
    const target = Number(element.dataset.countTo);

    // Suffix like "+" or "%". `|| ''` supplies an empty string when the
    // attribute is absent, so we never print "undefined".
    const suffix = element.dataset.countSuffix || '';

    // Timestamp of the first frame. Set on the first call, then reused.
    let startTime = null;

    /* The per-frame step. requestAnimationFrame passes in a high-resolution
       timestamp automatically — that is what `now` receives. */
    function step(now) {

      // Capture the start time on the very first frame only.
      if (startTime === null) startTime = now;

      // Raw linear progress from 0 to 1. Math.min clamps it so a delayed
      // frame can never push us past 1 and overshoot the target.
      const progress = Math.min((now - startTime) / DURATION, 1);

      // Apply easing, scale to the target, and drop the decimal.
      const value = Math.floor(easeOutCubic(progress) * target);

      // Write to the DOM. Using textContent rather than innerHTML because we
      // are inserting plain text — textContent is faster and cannot execute
      // injected markup.
      element.textContent = value + suffix;

      // Queue the next frame while there is still progress left to make.
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Snap to the exact target. Floating-point easing can land a hair
        // short, and "9+" instead of "10+" would be a visible bug.
        element.textContent = target + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  /* Trigger each counter when it scrolls into view, then stop watching it so
     it never replays on scroll-up. */
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }   // Half visible — the number is clearly on screen
  );

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}


/* ==========================================================================
   FEATURE 2 — VIDEO FACADE

   PURPOSE: Replace the poster image with a real video iframe only when the
   visitor actually presses play.

   WHY THIS MATTERS: A YouTube iframe embedded directly in the HTML downloads
   roughly 1MB of JavaScript and opens several third-party connections on page
   load — whether or not anyone watches. On a page already targeting a jump
   from 31/100 to 80+ on mobile PageSpeed, that single embed can cost more
   than every other asset combined. Deferring it until intent is demonstrated
   is the highest-value performance decision on this page.

   SECURITY / PRIVACY: the embed URL uses youtube-nocookie.com, which does not
   set tracking cookies until playback begins. For a firm advising clients on
   corporate ethics, quietly tracking visitors before consent is a
   self-inflicted credibility problem.
   ========================================================================== */
function initVideoFacade() {

  const facade = document.querySelector('[data-video-facade]');
  if (!facade) return;

  // The real embed URL, parked in a data attribute so the browser never
  // requests it during initial page load.
  const videoSrc = facade.dataset.videoSrc;

  /* Swaps the poster and play button for a live iframe. */
  function loadVideo() {

    // Guard against a missing or unreplaced placeholder URL. Better to leave
    // the poster in place than to inject a broken embed on a client site.
    if (!videoSrc || videoSrc.indexOf('VIDEO_ID_HERE') !== -1) {
      console.warn('[CFG] Video facade clicked but no video URL is configured yet.');
      return;
    }

    // Build the iframe in JS rather than writing it into the HTML.
    const iframe = document.createElement('iframe');
    iframe.src = videoSrc;
    iframe.title = 'Collaboration for Good explainer video';

    // Permissions the YouTube player needs to function.
    iframe.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';

    // Lets the user expand to fullscreen from the player controls.
    iframe.allowFullscreen = true;

    // Replace the facade's entire contents with the iframe. Clearing first
    // removes the poster and the play button in one operation.
    facade.innerHTML = '';
    facade.appendChild(iframe);
  }

  // Listen on the facade container rather than the button specifically, so a
  // click anywhere on the poster starts playback — a larger, more forgiving
  // target than the button alone, which matters most on touch devices.
  facade.addEventListener('click', loadVideo);

  /* Keyboard support. The <button> inside fires a click event on both Enter
     and Space natively, and that click bubbles up to the listener above, so
     keyboard users are already covered without extra code. This comment
     exists so a future maintainer does not "fix" a problem that isn't there
     by adding a duplicate keydown handler. */
}


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
try {
  initCounters();
  initVideoFacade();
} catch (error) {
  console.error('[CFG] home.js initialization error:', error);
}
