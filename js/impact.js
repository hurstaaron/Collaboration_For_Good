/* ==========================================================================
   COLLABORATION FOR GOOD — impact.js
   Behavior unique to impact.html.

   ONE FEATURE: filter case studies by capability category.
   ========================================================================== */

'use strict';


/* ==========================================================================
   CASE STUDY FILTER

   PURPOSE: Let a visitor narrow the case studies to the type of work they
   came here for.

   WHY CLIENT-SIDE FILTERING RATHER THAN SEPARATE PAGES:
   With three case studies, separate filtered URLs would mean four near-empty
   pages competing with each other in search results for the same terms —
   keyword cannibalization, for no user benefit. Every case study stays on one
   indexable page, and filtering is a convenience layer on top. If the roster
   grows past roughly fifteen, revisit this: at that point real per-category
   landing pages start to earn their own search traffic.

   WHY WE TOGGLE A CLASS RATHER THAN REMOVING ELEMENTS:
   Detaching and re-attaching DOM nodes is expensive and it destroys any state
   attached to them. Toggling one class lets CSS handle the work on the
   compositor, and the elements stay in the document where search engines and
   the browser's find-in-page can still reach them.

   ACCESSIBILITY — THE PART THAT IS USUALLY MISSED:
   When cards disappear, a sighted user sees it happen. A screen reader user
   gets nothing at all unless we tell them. The results count in the HTML has
   `aria-live="polite"`, so updating its text causes the change to be announced
   automatically. Updating that count is not a nice-to-have — without it this
   component is silently broken for anyone not looking at the screen.
   ========================================================================== */
function initCaseFilter() {

  // Every piece this feature touches.
  const buttons = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('[data-filter-item]');
  const countEl = document.querySelector('[data-filter-count]');
  const emptyEl = document.querySelector('[data-filter-empty]');
  const resetBtn = document.querySelector('[data-filter-reset]');

  // Guard clause: if the filter markup is not on this page, do nothing.
  if (!buttons.length || !items.length) return;

  /* Applies a filter category to the grid.
     @param {string} category - 'all', or a capability slug like 'report' */
  function applyFilter(category) {

    // Running tally of how many cards survive the filter.
    let visibleCount = 0;

    items.forEach(function (item) {

      // Read the card's categories. `|| ''` guards against a card that is
      // missing the attribute entirely, which would otherwise throw on split.
      const categories = (item.dataset.category || '').split(' ');

      // A card shows if we're on 'All work', or if its list contains this
      // category. Using indexOf on the SPLIT ARRAY rather than a substring
      // search on the raw string is deliberate: a substring check for 'report'
      // would also match a hypothetical 'reporting', producing false hits.
      const matches = category === 'all' || categories.indexOf(category) !== -1;

      // Second argument of toggle: true adds the class, false removes it.
      // We add `is-hidden` when the card does NOT match, hence the negation.
      item.classList.toggle('is-hidden', !matches);

      if (matches) visibleCount++;
    });

    // Sync the buttons' pressed state. This is both the visual highlight and
    // the screen reader announcement — one attribute doing both jobs.
    buttons.forEach(function (button) {
      const isActive = button.dataset.filter === category;
      button.setAttribute('aria-pressed', String(isActive));
    });

    // Announce the result. The aria-live region does this automatically the
    // moment the text content changes.
    if (countEl) {
      if (visibleCount === 0) {
        countEl.textContent = 'No case studies match that filter';
      } else {
        // Ternary handles singular vs plural. "1 case studies" is the kind of
        // small error that makes a site feel unfinished.
        const noun = visibleCount === 1 ? 'case study' : 'case studies';
        const scope = category === 'all' ? 'all ' : '';
        countEl.textContent = 'Showing ' + scope + visibleCount + ' ' + noun;
      }
    }

    // Show or hide the empty state. `hidden` is a native HTML attribute —
    // more semantically correct than a CSS class, because it removes the
    // element from the accessibility tree as well as from the layout.
    if (emptyEl) {
      emptyEl.hidden = visibleCount !== 0;
    }
  }

  // Wire each filter button to its category.
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyFilter(button.dataset.filter);
    });
  });

  // The reset link inside the empty state returns to the full list.
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      applyFilter('all');
    });
  }

  // Set the correct initial state on load rather than relying on the hardcoded
  // HTML defaults staying in sync. If someone adds a fourth case study and
  // forgets to update the count text, this corrects it automatically.
  applyFilter('all');
}


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
try {
  initCaseFilter();
} catch (error) {
  console.error('[CFG] impact.js initialization error:', error);
}
