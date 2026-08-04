/* ==========================================================================
   COLLABORATION FOR GOOD — about.js
   Behavior unique to about.html.

   WHY THIS FILE IS ALMOST EMPTY — AND WHY IT EXISTS ANYWAY:

   The About page is a reading page. Its job is to move a visitor's confidence
   in Tyler from "unknown consultant" to "this person has done this before."
   Everything that serves that job is markup, typography, and the sticky
   portrait — all handled in HTML and CSS. The scroll reveals come from
   main.js, which runs on every page.

   Adding JavaScript here because the file exists would be adding weight for
   no benefit. Restraint is the correct engineering answer, and this comment
   is the record of that being a decision rather than an oversight — so a
   future maintainer doesn't assume the file was left unfinished.

   The file is loaded anyway for two practical reasons:
     1. Consistency. Every page loads main.js + its own page script, so the
        pattern is predictable and a new page is a copy-paste away.
     2. It gives page-specific behavior an obvious home when it is needed.
        The alternative — bolting About-only code into main.js — is how shared
        files rot into 2,000-line grab bags over the life of a project.

   FIRST LIKELY ADDITION: a "copy email address" button on the credential
   block, using the Clipboard API with a visible confirmation state.
   ========================================================================== */

'use strict';

/* ==========================================================================
   PLACEHOLDER — no page-specific behavior required at this stage.

   The console message is intentionally omitted in production. Uncomment the
   line below only while debugging to confirm the file is loading and the
   defer order is correct.
   ========================================================================== */

// console.log('[CFG] about.js loaded');
