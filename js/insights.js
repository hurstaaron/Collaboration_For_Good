/* ==========================================================================
   COLLABORATION FOR GOOD — insights.js
   Behavior unique to insights.html.

   Two features:
     1. Article filter by outlet
     2. Newsletter signup validation
   ========================================================================== */

'use strict';


/* ==========================================================================
   FEATURE 1 — ARTICLE FILTER

   Same mechanism as the case study filter on impact.js. See that file for the
   full reasoning behind client-side filtering, class toggling instead of DOM
   removal, and the aria-live results count.

   The two are kept as separate implementations rather than a shared module
   because this project ships without a build step — there is no bundler to
   import a shared file, and loading a third script on both pages to save
   forty lines is a worse trade than the duplication. If the site later moves
   to a build pipeline, this is the first thing to extract.
   ========================================================================== */
function initArticleFilter() {

  const buttons = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('[data-filter-item]');
  const countEl = document.querySelector('[data-filter-count]');
  const emptyEl = document.querySelector('[data-filter-empty]');
  const resetBtn = document.querySelector('[data-filter-reset]');

  if (!buttons.length || !items.length) return;

  /* Applies an outlet filter to the archive grid.
     @param {string} category - 'all', or an outlet slug like 'forbes' */
  function applyFilter(category) {

    let visibleCount = 0;

    items.forEach(function (item) {

      // Split on spaces so a multi-category item can be matched exactly,
      // rather than by substring — which would produce false positives.
      const categories = (item.dataset.category || '').split(' ');
      const matches = category === 'all' || categories.indexOf(category) !== -1;

      item.classList.toggle('is-hidden', !matches);

      if (matches) visibleCount++;
    });

    // Sync button pressed states. aria-pressed is both the accessible state
    // and the CSS hook, so they cannot disagree.
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    });

    // Announce the result through the aria-live region.
    if (countEl) {
      if (visibleCount === 0) {
        countEl.textContent = 'No articles match that filter';
      } else {
        const noun = visibleCount === 1 ? 'article' : 'articles';
        const scope = category === 'all' ? 'all ' : '';
        countEl.textContent = 'Showing ' + scope + visibleCount + ' ' + noun;
      }
    }

    if (emptyEl) {
      emptyEl.hidden = visibleCount !== 0;
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyFilter(button.dataset.filter);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      applyFilter('all');
    });
  }

  applyFilter('all');
}


/* ==========================================================================
   FEATURE 2 — NEWSLETTER SIGNUP VALIDATION

   PURPOSE: Catch an invalid or empty email before submission and explain the
   problem clearly.

   WHY WE VALIDATE IN JS WHEN THE BROWSER ALREADY DOES IT:
   The form carries `type="email"` and `required`, so the browser will block a
   bad submission on its own — that is the fallback if this script fails, and
   it is why `novalidate` is on the form rather than the validation attributes
   being omitted. But native error bubbles cannot be styled, disappear on their
   own timing, are inconsistently announced across screen readers, and look
   nothing like the rest of the site. Handling it here gives us messages that
   match the brand and are reliably announced.

   WHY THE ERROR MESSAGES ARE WORDED THE WAY THEY ARE:
   An error message has one job: say what went wrong and what to do about it.
   "Invalid input" fails on both counts. "Enter an email address" is an
   instruction the reader can act on immediately.

   WHAT THIS DOES NOT DO:
   Client-side validation is a usability feature, never a security measure. It
   runs in an environment the visitor fully controls and can be bypassed in
   seconds. The email service provider still validates server-side. This exists
   to save honest users a wasted round trip, nothing more.
   ========================================================================== */
function initNewsletterForm() {

  const form = document.querySelector('[data-newsletter-form]');
  if (!form) return;

  // The pieces the validator touches.
  const emailInput = form.querySelector('#newsletter-email');
  const errorEl = form.querySelector('#newsletter-email-error');
  const statusEl = form.querySelector('[data-form-status]');
  const honeypot = form.querySelector('[name="website"]');

  if (!emailInput) return;

  /* Email pattern check.

     Deliberately permissive: something before an @, something after it, a dot,
     and at least two more characters. Attempting to fully validate an email
     address with a regular expression is a well-known dead end — the RFC 5322
     grammar permits quoted strings, comments, and IP literals, and the
     "complete" pattern is over 6,000 characters and still rejects valid
     addresses. The only real proof an address works is sending mail to it.
     This catches typos; the ESP confirms deliverability. */
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* Displays a field-level error.
     @param {string} message - what went wrong, in plain language */
  function showError(message) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;           // role="alert" announces it now
    }

    // Marks the field invalid for assistive tech AND triggers the red
    // underline in CSS. One attribute, both jobs.
    emailInput.setAttribute('aria-invalid', 'true');

    // Move focus to the broken field so the user can fix it immediately
    // without hunting for it — mandatory on long forms, good practice here.
    emailInput.focus();
  }

  /* Clears any existing error state. Called before every fresh validation so
     a stale message from the previous attempt is never left on screen. */
  function clearError() {
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
    emailInput.removeAttribute('aria-invalid');
  }

  /* Shows a form-level outcome message.
     @param {string} message - what happened
     @param {boolean} isSuccess - controls the green vs red treatment */
  function showStatus(message, isSuccess) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.classList.toggle('form-status--success', isSuccess);
  }

  form.addEventListener('submit', function (event) {

    // Stop the browser's default submit so we can validate first. If everything
    // passes we either submit programmatically or hand off to the ESP.
    event.preventDefault();

    clearError();

    // HONEYPOT CHECK.
    // The field is invisible to humans, so any value in it means a bot filled
    // the form. We return silently rather than showing an error — telling a
    // bot why it was rejected just helps whoever wrote it adapt.
    if (honeypot && honeypot.value !== '') return;

    // `trim()` strips leading and trailing whitespace, which is the single
    // most common cause of a "valid" address failing validation — usually
    // from a paste or a mobile keyboard's auto-inserted trailing space.
    const value = emailInput.value.trim();

    if (value === '') {
      showError('Enter an email address to subscribe.');
      return;
    }

    if (!EMAIL_PATTERN.test(value)) {
      showError('That address doesn\'t look right. Check for a typo.');
      return;
    }

    /* PLACEHOLDER — SUBMISSION.

       When the Mailchimp or ConvertKit endpoint is wired up (Phase 8), replace
       this block with either:
         (a) form.submit() to post natively to the ESP's action URL, or
         (b) a fetch() POST to the ESP API, keeping the visitor on the page.

       Option (b) is the better experience and is what the success message
       below assumes. Until the endpoint exists, we confirm optimistically so
       the interaction can be reviewed and demoed. */
    showStatus('Thanks — you\'re on the list. Watch for a confirmation email.', true);
    form.reset();
  });

  /* Clear the error as soon as the user starts correcting it. Leaving a red
     message on screen while someone is actively fixing the problem is
     needlessly punitive — the message has already done its job. */
  emailInput.addEventListener('input', clearError);
}


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
try {
  initArticleFilter();
  initNewsletterForm();
} catch (error) {
  console.error('[CFG] insights.js initialization error:', error);
}
