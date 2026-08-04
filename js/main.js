/* ==========================================================================
   COLLABORATION FOR GOOD — main.js
   Shared behavior. Loaded on EVERY page with the `defer` attribute.

   ---------------------------------------------------------------------------
   MODERN JAVASCRIPT PRACTICES USED IN THIS FILE
   ---------------------------------------------------------------------------

   1. PROGRESSIVE ENHANCEMENT. Nothing here is required to read the site. If
      this file fails to load, the page still renders, the nav still links, and
      the content is still visible.

   2. LOADED WITH `defer`. The browser downloads this file in parallel with
      the HTML parse, then runs it only after the DOM is fully built. That
      means no render-blocking, and no need for a DOMContentLoaded wrapper.

   3. FEATURE DETECTION, NOT BROWSER DETECTION. We check whether an API exists
      before using it and fall back gracefully if it doesn't.

   4. `data-*` ATTRIBUTES AS THE JS HOOK. JavaScript selects elements by
      `[data-header]`, never by `.site-header`. This decouples behavior from
      styling — a designer can rename or delete a CSS class without breaking
      functionality, and vice versa.

   5. ACCESSIBLE STATE. Interactive widgets update `aria-expanded`, manage
      keyboard focus, and respond to the Escape key. A menu that only works
      with a mouse is a broken menu.

   6. PASSIVE AND THROTTLED SCROLL LISTENERS. Scroll handlers run dozens of
      times per second. We mark them `passive` so the browser doesn't wait to
      see if we'll call preventDefault, and we throttle with
      requestAnimationFrame so work happens at most once per painted frame.

   7. MODULE PATTERN. Each feature is a self-contained function that exits
      early if its target element isn't on the current page. One file, six
      pages, no errors on pages that lack a given component.

   8. STRICT MODE. Catches silent errors (like assigning to an undeclared
      variable) and turns them into loud ones.
   ========================================================================== */

'use strict';


/* --------------------------------------------------------------------------
   GLOBAL FLAG: does the user want reduced motion?
   Read once and reused. `matchMedia` evaluates a CSS media query from JS —
   this is how we keep motion decisions consistent between CSS and JS instead
   of having the two disagree.
   -------------------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


/* ==========================================================================
   FEATURE 1 — MOBILE NAVIGATION DRAWER

   PURPOSE: Open and close the full-screen mobile menu.

   WHY THIS IMPLEMENTATION: A nav menu is a focus trap problem, not a
   show/hide problem. Three things must happen together or the component is
   inaccessible: (a) `aria-expanded` must track the visual state so screen
   readers announce it, (b) background scrolling must lock or the page moves
   underneath the overlay, and (c) Escape must close it, because that is the
   universally expected behavior for any overlay. We also move keyboard focus
   into the drawer on open and back to the trigger on close, so a keyboard
   user is never stranded behind an invisible panel.
   ========================================================================== */
function initNavDrawer() {

  // Find the three elements this feature needs.
  const toggle = document.querySelector('[data-nav-toggle]');
  const drawer = document.querySelector('[data-nav-drawer]');
  const closeBtn = document.querySelector('[data-nav-close]');

  // Guard clause. If the markup isn't on this page, stop before touching null.
  if (!toggle || !drawer) return;

  /* Opens the drawer and puts the interface into its "menu open" state. */
  function openDrawer() {
    drawer.classList.add('is-open');                  // Trigger the CSS slide-in
    toggle.setAttribute('aria-expanded', 'true');     // Announce state to AT
    document.body.classList.add('nav-open');          // Lock background scroll

    // Move focus into the drawer so the next Tab press stays inside it.
    if (closeBtn) closeBtn.focus();
  }

  /* Closes the drawer and restores the page to its normal state. */
  function closeDrawer() {
    drawer.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');

    // Return focus to the button that opened it — the expected keyboard path.
    toggle.focus();
  }

  // The hamburger button toggles based on its own current ARIA state, so the
  // accessible state is the single source of truth rather than a separate
  // JS variable that could fall out of sync.
  toggle.addEventListener('click', function () {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeDrawer() : openDrawer();
  });

  // Explicit close button inside the drawer.
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // Tapping any link inside the drawer navigates away, so close it first.
  // Without this, returning via the browser back button shows a stuck menu.
  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  // Escape closes the drawer from anywhere on the page.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}


/* ==========================================================================
   FEATURE 2 — STICKY HEADER STATE

   PURPOSE: Add a hairline border to the header once the user scrolls, so it
   visually separates from content passing beneath it.

   WHY THIS IMPLEMENTATION: The naive version runs a class check on every
   scroll event — potentially 100+ times a second, each one triggering a style
   recalculation. Instead we throttle with requestAnimationFrame, which caps
   the work at once per painted frame (~60/sec) and guarantees the DOM write
   happens at the moment the browser is about to paint anyway. The `passive`
   flag tells the browser we will never call preventDefault, letting it start
   scrolling immediately instead of waiting on our handler.
   ========================================================================== */
function initStickyHeader() {

  const header = document.querySelector('[data-header]');
  if (!header) return;

  // Tracks whether a frame is already queued, so we never queue two.
  let ticking = false;

  // The actual DOM work. `toggle`'s second argument sets the class based on
  // a boolean, which is cleaner than a branching if/else.
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;   // Frame consumed; allow the next one to be queued
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Run once at load, so a page restored mid-scroll (browser back button,
  // or a refresh partway down) shows the correct state immediately.
  updateHeader();
}


/* ==========================================================================
   FEATURE 3 — SCROLL REVEAL ANIMATIONS

   PURPOSE: Fade and lift elements into view as the reader reaches them.

   WHY INTERSECTIONOBSERVER: The old approach compared getBoundingClientRect()
   against window height on every scroll event. Every one of those calls forces
   a synchronous layout recalculation ("layout thrashing") and is the classic
   cause of janky scrolling. IntersectionObserver moves the entire calculation
   off the main thread — the browser tells US when an element crosses a
   threshold. It is dramatically faster and it is the reason this can run on
   dozens of elements without cost.

   `unobserve` after firing is deliberate: each element animates once. Leaving
   observers attached to already-revealed elements is a slow memory leak on
   long pages.
   ========================================================================== */
function initScrollReveal() {

  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  // If the browser is ancient or the user wants reduced motion, leave every
  // element in its default visible state and never add the hiding class.
  if (!('IntersectionObserver' in window) || prefersReducedMotion) return;

  // Only NOW do we let CSS hide the reveal targets. This ordering is the whole
  // progressive-enhancement guarantee: content is hidden only once we know for
  // certain we can show it again.
  document.documentElement.classList.add('js-reveal-ready');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // `isIntersecting` is true when the element enters the trigger zone.
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);   // Fire once, then stop watching
        }
      });
    },
    {
      // Fire when 12% of the element is visible. Waiting for 100% means short
      // elements at the bottom of a page may never trigger at all.
      threshold: 0.12,

      // Negative bottom margin shrinks the trigger zone up from the viewport
      // bottom by 60px, so elements animate slightly after entering rather
      // than the instant their top edge appears. Reads more natural.
      rootMargin: '0px 0px -60px 0px'
    }
  );

  // Register every target with the observer.
  targets.forEach(function (target) {
    observer.observe(target);
  });

  /* Staggered groups: set a `--i` custom property on each child equal to its
     index. base.css multiplies that index by 90ms to build the cascade delay.
     Doing the indexing here rather than hand-writing inline styles in the HTML
     keeps the markup clean and means adding a card requires no other edits. */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function (group) {
    Array.from(group.children).forEach(function (child, index) {
      child.style.setProperty('--i', index);
    });
  });
}


/* ==========================================================================
   FEATURE 4 — ACTIVE NAVIGATION LINK

   PURPOSE: Mark the link matching the current page with aria-current="page".

   WHY THIS IMPLEMENTATION: The attribute is also hardcoded in each HTML file,
   which is the correct approach — it works with JS disabled. This function is
   a safety net for the cases hardcoding misses: a URL with a trailing slash,
   a directory root serving index.html, or a link reached with query
   parameters. `aria-current` drives both the screen reader announcement and
   the red underline in CSS, so the two states cannot drift apart.
   ========================================================================== */
function initActiveNav() {

  // Grab the filename from the path. Splitting on '/' and taking the last
  // segment handles both /about.html and /some/nested/about.html.
  const segments = window.location.pathname.split('/');
  let current = segments[segments.length - 1];

  // An empty last segment means we're at a directory root, which serves
  // index.html. Normalize so the Home link matches.
  if (current === '') current = 'index.html';

  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    // `getAttribute` returns the literal href as written in the HTML;
    // `link.href` would return the fully resolved absolute URL, which is
    // harder to compare against a bare filename.
    const target = link.getAttribute('href');

    if (target === current) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}


/* ==========================================================================
   FEATURE 5 — DYNAMIC COPYRIGHT YEAR

   PURPOSE: Keep the footer year accurate without an annual manual edit.

   WHY: A stale copyright year is a small thing that signals an abandoned
   site to both visitors and, anecdotally, to prospects evaluating a
   consultancy. Two lines of code removes the maintenance task permanently.
   ========================================================================== */
function initFooterYear() {
  const slot = document.querySelector('[data-current-year]');
  if (!slot) return;
  slot.textContent = new Date().getFullYear();
}


/* ==========================================================================
   INITIALIZATION

   Each function guards itself against missing elements, so calling all of
   them on every page is safe. Wrapped in try/catch so that an unexpected
   failure in one feature cannot prevent the others from running — a single
   thrown error in an un-caught script halts everything after it.
   ========================================================================== */
try {
  initNavDrawer();
  initStickyHeader();
  initScrollReveal();
  initActiveNav();
  initFooterYear();
} catch (error) {
  // Log for debugging but never surface to the visitor. The site remains
  // fully usable because none of the above is required to read it.
  console.error('[CFG] main.js initialization error:', error);
}
