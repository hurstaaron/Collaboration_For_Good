/* ==========================================================================
   COLLABORATION FOR GOOD — contact.js
   Behavior unique to contact.html.

   ONE FEATURE: accessible client-side validation for the contact form.
   ========================================================================== */

'use strict';


/* ==========================================================================
   CONTACT FORM VALIDATION

   PURPOSE: Catch missing or malformed input before submission, explain each
   problem in plain language, and move the user to the first field that needs
   fixing.

   WHY VALIDATE HERE WHEN THE BROWSER ALREADY CAN:
   The inputs carry `required` and `type="email"`, so the browser will block a
   bad submission on its own. That is the fallback if this script fails, which
   is exactly why those attributes stay on the markup and `novalidate` is set
   on the form rather than removing them. What we gain by handling it here:
   messages that match the brand's voice and styling, consistent screen-reader
   announcement across browsers (native bubbles are inconsistently announced),
   and control over focus — the browser will not reliably move focus to the
   first invalid field, and hunting for it on a six-field form is real friction.

   THE VALIDATION-RULE ARRAY PATTERN:
   Each field's rules live in one data structure instead of being spread across
   a chain of if-statements. Adding a field means adding one object to the
   array — no new branching logic, no chance of forgetting to wire up the
   error element or the focus handling. This is the difference between a form
   that stays maintainable at twelve fields and one that becomes unreadable at
   six.

   SECURITY: none of this is a security control. It runs in an environment the
   visitor fully controls and can be bypassed by anyone who opens devtools.
   The form endpoint must validate and sanitize server-side regardless. This
   exists to save honest users a wasted round trip.
   ========================================================================== */
function initContactForm() {

  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const statusEl = form.querySelector('[data-form-status]');
  const honeypot = form.querySelector('[name="website"]');

  /* Permissive email pattern. See the extended note in insights.js on why a
     strict RFC-compliant email regex is not worth attempting: the complete
     pattern runs past 6,000 characters and still rejects valid addresses. This
     catches typos. Deliverability is proven by sending mail, not by a regex. */
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* THE RULE SET.

     One object per validated field:
       id       — the input's element id
       errorId  — the id of its error <p>
       validate — returns an error string, or null when the value is fine

     Error messages are written as instructions rather than diagnoses.
     "Invalid input" tells the reader nothing they can act on; "Enter your
     name" tells them exactly what to do next. */
  const rules = [
    {
      id: 'contact-name',
      errorId: 'contact-name-error',
      validate: function (value) {
        if (value === '') return 'Enter your name.';
        return null;
      }
    },
    {
      id: 'contact-email',
      errorId: 'contact-email-error',
      validate: function (value) {
        if (value === '') return 'Enter your email address.';
        if (!EMAIL_PATTERN.test(value)) {
          return 'That address doesn\'t look right. Check for a typo.';
        }
        return null;
      }
    },
    {
      id: 'contact-message',
      errorId: 'contact-message-error',
      validate: function (value) {
        if (value === '') return 'Tell us briefly what you\'re working on.';

        // A 10-character floor catches "hi" and "test" without being
        // restrictive enough to reject a legitimately short inquiry.
        if (value.length < 10) {
          return 'A little more detail will help us respond usefully.';
        }
        return null;
      }
    }
  ];

  /* Displays an error on one field.
     @param {HTMLElement} input   - the field itself
     @param {HTMLElement} errorEl - its error paragraph
     @param {string} message      - what to do about it */
  function showFieldError(input, errorEl, message) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;         // role="alert" announces it immediately
    }
    // Marks the field invalid for assistive tech AND drives the red underline
    // in CSS. One attribute, both jobs, no chance of the two disagreeing.
    input.setAttribute('aria-invalid', 'true');
  }

  /* Clears the error state on one field. */
  function clearFieldError(input, errorEl) {
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
    input.removeAttribute('aria-invalid');
  }

  /* Shows a form-level outcome message.
     @param {string} message
     @param {boolean} isSuccess - controls green vs red treatment */
  function showStatus(message, isSuccess) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.classList.toggle('form-status--success', isSuccess);
  }

  /* Runs every rule.
     @returns {HTMLElement|null} the first invalid input, or null if all pass */
  function validateForm() {

    // Tracks the first failure so we know where to send focus. Later failures
    // are still displayed — showing one error at a time forces the user
    // through an unnecessary submit-fix-submit loop.
    let firstInvalid = null;

    rules.forEach(function (rule) {

      const input = document.getElementById(rule.id);
      const errorEl = document.getElementById(rule.errorId);

      // Skip a rule whose field is not on the page. Guards against a rule
      // being left behind after a field is removed from the markup.
      if (!input) return;

      // trim() strips surrounding whitespace, the most common reason a
      // legitimate value fails validation — usually from a paste or a mobile
      // keyboard's auto-inserted trailing space.
      const value = input.value.trim();
      const message = rule.validate(value);

      if (message) {
        showFieldError(input, errorEl, message);
        // `||` assigns only on the FIRST failure — subsequent ones leave the
        // already-assigned value alone, which is exactly what we want.
        firstInvalid = firstInvalid || input;
      } else {
        clearFieldError(input, errorEl);
      }
    });

    return firstInvalid;
  }

  /* SUBMIT HANDLER. */
  form.addEventListener('submit', function (event) {

    // Stop the default submission so validation runs first.
    event.preventDefault();

    // Clear any status message left over from a previous attempt.
    if (statusEl) statusEl.hidden = true;

    // HONEYPOT CHECK.
    // The field is invisible to humans, so a value in it means a bot filled
    // the form. Return silently — telling a bot why it was rejected only helps
    // whoever wrote it adapt.
    if (honeypot && honeypot.value !== '') return;

    const firstInvalid = validateForm();

    if (firstInvalid) {
      // Move focus to the first problem. On a form this length the invalid
      // field may be off-screen, and a keyboard or screen reader user has no
      // way to know where the error is without being taken there.
      firstInvalid.focus();

      showStatus('Please check the highlighted fields and try again.', false);
      return;
    }

    /* PLACEHOLDER — SUBMISSION.

       Everything validated. Wire up the real endpoint by replacing this block
       with ONE of:

       (a) NATIVE POST — simplest. Set the form's `action` to the Formspree,
           Basin, or Netlify Forms endpoint and call form.submit() here. The
           visitor is redirected to a thank-you page. Note that form.submit()
           does NOT re-fire this submit event, so there is no infinite loop.

       (b) FETCH POST — better experience, keeps the visitor on the page:

             fetch(form.action, {
               method: 'POST',
               body: new FormData(form),
               headers: { 'Accept': 'application/json' }
             })
               .then(function (response) {
                 if (!response.ok) throw new Error(response.statusText);
                 showStatus('Thanks — your message is on its way. We respond within two business days.', true);
                 form.reset();
               })
               .catch(function () {
                 showStatus('Something went wrong sending that. Email connect@collaborationforgood.com directly and we\'ll pick it up there.', false);
               });

       Note the failure message in (b): it does not apologize vaguely, it gives
       the reader a working alternative. An error state that leaves someone
       with no path forward has failed twice.

       Until an endpoint exists, we confirm optimistically so the interaction
       can be demonstrated and reviewed. */
    showStatus(
      'Thanks — your message is on its way. We respond within two business days.',
      true
    );
    form.reset();
  });

  /* LIVE ERROR CLEARING.
     Clear a field's error as soon as the user starts correcting it. Leaving a
     red message on screen while someone is actively fixing the problem is
     needlessly punitive — the message already did its job. Re-validation
     happens on the next submit, not on every keystroke, because validating as
     someone types flags an email as invalid before they have finished typing
     it. */
  rules.forEach(function (rule) {
    const input = document.getElementById(rule.id);
    const errorEl = document.getElementById(rule.errorId);
    if (!input) return;

    input.addEventListener('input', function () {
      clearFieldError(input, errorEl);
    });
  });
}


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
try {
  initContactForm();
} catch (error) {
  console.error('[CFG] contact.js initialization error:', error);
}
