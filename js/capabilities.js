/* ==========================================================================
   COLLABORATION FOR GOOD — capabilities.js
   Behavior unique to capabilities.html.

   ONE FEATURE: scrollspy sub-navigation — the sticky sub-nav highlights
   whichever capability section the reader is currently looking at.
   ========================================================================== */

'use strict';


/* ==========================================================================
   SCROLLSPY SUB-NAVIGATION

   PURPOSE: Keep the sub-nav in sync with the reader's scroll position so they
   always know where they are on a long page.

   WHY INTERSECTIONOBSERVER RATHER THAN A SCROLL HANDLER:
   The traditional implementation loops every section on every scroll event,
   calling getBoundingClientRect() on each one. Every one of those calls forces
   the browser to stop and recalculate layout ("layout thrashing"), and it
   happens dozens of times a second. IntersectionObserver hands the entire
   calculation to the browser's compositor, off the main thread. On this page
   the difference is invisible; the reason to build it correctly anyway is that
   the same pattern gets reused on longer pages where it is very visible.

   THE rootMargin TRICK — the important part of this implementation:
   `rootMargin: '-45% 0px -50% 0px'` shrinks the observer's detection zone from
   the full viewport down to a thin horizontal band across the middle of the
   screen. A section counts as "current" only while it crosses that band.

   Without this, several sections are technically in the viewport at once and
   the highlight flickers between them as the user scrolls — the single most
   common scrollspy bug. Narrowing the zone to a band guarantees exactly one
   section qualifies at a time.

   PROGRESSIVE ENHANCEMENT: the sub-nav is a list of ordinary anchor links. If
   this script never runs, clicking still jumps to the right section. All this
   adds is the highlight.
   ========================================================================== */
function initScrollspy() {

  // The sections being watched, and the links being highlighted.
  const sections = document.querySelectorAll('[data-scrollspy-section]');
  const links = document.querySelectorAll('[data-scrollspy-link]');

  // Guard: exit if either piece is missing from this page.
  if (!sections.length || !links.length) return;

  // Guard: no observer support means we leave the nav in its default state,
  // which is still fully functional as plain anchor links.
  if (!('IntersectionObserver' in window)) return;

  /* Marks one link as current and clears every other.
     @param {string} id - the id of the section now in view */
  function setActiveLink(id) {
    links.forEach(function (link) {

      // Compare the link's href (e.g. "#report") against the section id
      // (e.g. "report"). Slicing off the leading '#' normalizes them.
      const targetId = link.getAttribute('href').slice(1);

      if (targetId === id) {
        // `aria-current` does double duty: it is the CSS styling hook AND the
        // accessible announcement. One attribute, so the visual state and the
        // screen-reader state are structurally incapable of disagreeing.
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // Only act on a section ENTERING the band. Ignoring exits prevents
        // the highlight from clearing in the gap between two sections.
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      // The narrow detection band described in the header comment. Read as
      // top / right / bottom / left, matching CSS margin shorthand order.
      rootMargin: '-45% 0px -50% 0px',

      // Zero threshold: fire as soon as any part of the section touches the
      // band. A higher threshold would require a portion of the section to be
      // inside a band only a few percent tall — which short sections could
      // never satisfy, leaving them permanently unhighlighted.
      threshold: 0
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  /* INITIAL STATE.
     If the visitor arrives via a deep link (capabilities.html#report, which
     is exactly what the home page's "Learn more" buttons produce), highlight
     that section immediately rather than waiting for the first scroll event —
     which may never come if they landed exactly where they wanted to be.

     Falls back to the first section for a normal top-of-page arrival. */
  const initialHash = window.location.hash.slice(1);

  if (initialHash) {
    setActiveLink(initialHash);
  } else if (sections.length) {
    setActiveLink(sections[0].id);
  }
}


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
try {
  initScrollspy();
} catch (error) {
  console.error('[CFG] capabilities.js initialization error:', error);
}
