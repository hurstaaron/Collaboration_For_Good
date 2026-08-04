/* ==========================================================================
   COLLABORATION FOR GOOD — video.js
   Shared video behavior. Loaded on any page containing a hero background
   video or an explainer video.

   ---------------------------------------------------------------------------
   THE GOVERNING RULE: VIDEO MUST NEVER BE THE LCP ELEMENT
   ---------------------------------------------------------------------------

   Largest Contentful Paint measures when the biggest visible element finishes
   rendering. Google's "good" threshold is 2.5 seconds. A full-bleed hero video
   IS the largest element on the page — so if the browser waits for video to
   paint, LCP is bounded by how fast a multi-megabyte file downloads. On a
   mid-tier Android over 4G that is routinely 6-10 seconds. That single
   decision is the difference between passing and failing Core Web Vitals.

   The fix is to make a POSTER IMAGE the LCP element and treat the video as an
   enhancement layered on afterward:

     1. Poster image is in the markup as a real <img> with fetchpriority="high".
        It paints fast, it is the LCP element, LCP is decided and done.
     2. The <video> element ships with NO src and NO <source> children. This
        matters more than it looks — a browser will begin fetching a source in
        the markup regardless of `preload="none"`, because preload governs how
        MUCH it buffers, not WHETHER it starts. Injecting sources from JS is
        the only reliable way to guarantee zero video bytes are requested.
     3. Sources are injected only after `window.load` fires, meaning every
        render-critical asset is already done. Video competes with nothing.
     4. On mobile, on a saved-data setting, on a slow connection, or under
        reduced-motion, the video is never loaded at all. The poster is the
        final state and the page is complete.

   NET EFFECT: LCP is identical to a static-image hero. The video costs
   nothing that the browser measures.

   ---------------------------------------------------------------------------
   WHY MOBILE GETS NO VIDEO AT ALL
   ---------------------------------------------------------------------------

   This is a deliberate product decision, not a technical limitation:

   - A phone displays the hero at roughly 390x500 CSS pixels. Almost all of the
     footage's detail is cropped away by object-fit, so the visual payoff is
     small.
   - Cellular data is metered. Pushing 1MB+ of decorative video onto someone
     else's data plan to show them a background is a real cost imposed without
     consent.
   - Video decode is sustained CPU and GPU work. On mid-tier Android that means
     measurable battery drain and thermal throttling, which degrades scroll
     performance across the whole page.
   - Mobile is the majority of traffic and it is where the current CFG site
     scores 31/100. It is the exact place not to spend budget on decoration.

   ---------------------------------------------------------------------------
   ACCESSIBILITY: WCAG 2.2.2 (PAUSE, STOP, HIDE) — LEVEL A
   ---------------------------------------------------------------------------

   Any content that moves automatically, runs longer than five seconds, and is
   presented alongside other content MUST offer a mechanism to pause it. A
   four-second clip on infinite loop moves forever, so it qualifies. This is
   Level A — the minimum conformance tier, not an enhancement.

   Most sites with video heroes fail this. We ship a real pause control.

   `prefers-reduced-motion` is handled separately and more strictly: for those
   users the video never loads in the first place. Looping motion behind text
   is a common trigger for vestibular disorders and migraine.
   ========================================================================== */

'use strict';


/* ==========================================================================
   SHARED HELPER — SHOULD THIS DEVICE PLAY BACKGROUND VIDEO?

   PURPOSE: One place that answers the question, so the hero video and any
   future ambient video can never disagree about the rules.

   WHY EACH CHECK EXISTS — in order of how strongly it applies:

   1. prefers-reduced-motion — an explicit accessibility request from the user
      at the OS level. Non-negotiable, checked first.
   2. Save-Data — an explicit request to conserve bandwidth, sent by the user's
      own browser setting. Honoring it is the entire point of the header.
   3. effectiveType — the browser's own estimate of connection quality. On 2G
      or slow connections a background video will never finish buffering
      before the visitor has already scrolled past it.
   4. Viewport width — the mobile decision described above.

   Checks 2 and 3 use the Network Information API, which Chrome and Android
   browsers support and Safari and Firefox do not. Optional chaining (`?.`)
   makes a missing API simply evaluate to undefined rather than throwing, so
   unsupported browsers fall through to the viewport check. That is the correct
   failure direction: we lose an optimization, never functionality.
   ========================================================================== */
function shouldPlayBackgroundVideo() {

  // 1. Explicit accessibility preference. Highest authority.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }

  // The Network Information API object, where it exists.
  const connection = navigator.connection
    || navigator.mozConnection
    || navigator.webkitConnection;

  // 2. User has asked the browser to conserve data.
  if (connection?.saveData === true) {
    return false;
  }

  // 3. Connection is too slow for this to arrive usefully.
  const slowTypes = ['slow-2g', '2g', '3g'];
  if (connection?.effectiveType && slowTypes.includes(connection.effectiveType)) {
    return false;
  }

  // 4. Mobile and small-tablet viewports get the poster only.
  //    768px matches the tablet breakpoint used throughout base.css.
  if (window.innerWidth < 768) {
    return false;
  }

  return true;
}


/* ==========================================================================
   FEATURE 1 — HERO BACKGROUND VIDEO

   PURPOSE: Layer a silent looping clip behind the hero, without letting it
   affect any measured performance metric.

   WHY WE WAIT FOR `window.load` RATHER THAN DOMContentLoaded:
   DOMContentLoaded fires once the HTML is parsed — while stylesheets, fonts,
   and the poster image may still be downloading. Starting a video fetch there
   puts it in direct contention with the assets LCP depends on. `load` fires
   after everything has finished, which guarantees the video is spending only
   leftover bandwidth.

   WHY THE POSTER STAYS IN THE DOM UNDER THE VIDEO:
   It is the LCP element and it is the permanent fallback. If the video 404s,
   is blocked by a corporate proxy, or fails to decode, the hero still looks
   finished. The video fades in on top; the poster is never removed.
   ========================================================================== */
function initHeroVideo() {

  const video = document.querySelector('[data-hero-video]');
  if (!video) return;

  const toggle = document.querySelector('[data-hero-motion]');

  /* Injects the encoded sources and begins playback.

     SOURCE ORDER IS SIGNIFICANT. The browser walks <source> children top to
     bottom and uses the FIRST type it can decode. WebM/VP9 is listed first
     because it is meaningfully smaller than H.264 at equivalent quality;
     browsers that cannot decode it (older Safari) skip to the MP4. Reversing
     this order would silently serve the larger file to everyone. */
  function loadVideo() {

    const webmSrc = video.dataset.srcWebm;
    const mp4Src = video.dataset.srcMp4;

    // Nothing configured yet — leave the poster as the final state. During
    // development this is the normal condition, so it is a warning, not an
    // error, and it must not throw.
    if (!webmSrc && !mp4Src) {
      console.warn('[CFG] Hero video element present but no sources configured.');
      return;
    }

    if (webmSrc) {
      const webm = document.createElement('source');
      webm.src = webmSrc;
      webm.type = 'video/webm';
      video.appendChild(webm);
    }

    if (mp4Src) {
      const mp4 = document.createElement('source');
      mp4.src = mp4Src;
      mp4.type = 'video/mp4';
      video.appendChild(mp4);
    }

    // Explicitly tell the element to re-evaluate its sources. Appending
    // <source> children to a video that has already initialized does nothing
    // on its own — load() is what triggers the fetch.
    video.load();

    /* Fade in only once there is enough buffered to play through without
       stalling. `canplay` would fire earlier, but starting then produces a
       visible stutter a second or two in, which reads as broken rather than
       as loading. Waiting costs nothing because the poster is already there. */
    video.addEventListener('canplaythrough', function () {
      video.classList.add('is-ready');
    }, { once: true });   // once:true auto-removes the listener after firing,
                          // preventing a duplicate on re-buffer

    /* play() returns a Promise that REJECTS if autoplay is blocked. Browsers
       block autoplay with sound, and some block it under strict power-saving
       modes even when muted. An unhandled rejection here would surface as a
       console error on a page that is actually working fine, so we catch it
       and fall back to the poster. */
    const attempt = video.play();
    if (attempt !== undefined) {
      attempt.catch(function () {
        video.classList.remove('is-ready');
        if (toggle) toggle.hidden = true;   // No playback, so no pause control
      });
    }
  }

  /* WCAG 2.2.2 pause/play control.

     The button's own aria-pressed state is the single source of truth, so the
     visual state and the announced state cannot drift apart. The label text is
     rewritten too, because a screen reader user navigating by button list
     hears the label, not the visual icon. */
  function initToggle() {
    if (!toggle) return;

    // Only reveal the control once there is something to pause.
    toggle.hidden = false;

    toggle.addEventListener('click', function () {
      const isPaused = video.paused;

      if (isPaused) {
        video.play();
        toggle.setAttribute('aria-pressed', 'false');
        toggle.setAttribute('aria-label', 'Pause background video');
      } else {
        video.pause();
        toggle.setAttribute('aria-pressed', 'true');
        toggle.setAttribute('aria-label', 'Play background video');
      }
    });
  }

  // THE GATE. Everything above only runs if this device should play video.
  if (!shouldPlayBackgroundVideo()) {
    // Poster is the final state. Hide the pause control — offering to pause
    // something that is not moving is confusing.
    if (toggle) toggle.hidden = true;
    return;
  }

  /* Defer until every render-critical asset is finished.

     document.readyState === 'complete' means load already fired — which
     happens when this script is evaluated late, e.g. on a bfcache restore
     from the browser back button. Without this branch the listener would be
     registered for an event that has already passed and the video would never
     start. */
  if (document.readyState === 'complete') {
    loadVideo();
    initToggle();
  } else {
    window.addEventListener('load', function () {
      loadVideo();
      initToggle();
    }, { once: true });
  }
}


/* ==========================================================================
   FEATURE 2 — EXPLAINER VIDEO FACADES (MULTI-INSTANCE)

   PURPOSE: Show a poster image and a play button; load the actual player only
   when the visitor demonstrates intent by clicking.

   WHY THIS IS THE HIGHEST-VALUE PERFORMANCE DECISION ON ANY PAGE WITH VIDEO:
   A standard YouTube iframe pulls roughly 1MB of JavaScript and opens several
   third-party connections the moment the page loads — whether or not anyone
   ever presses play. Typical play rates on an embedded marketing video run
   well under a third of visitors. So the default embed spends a megabyte on
   the large majority of people to serve the minority. The facade inverts that:
   the cost is paid only by people who asked for it.

   This function handles MULTIPLE facades on one page, which the earlier
   single-instance version in home.js could not. It supports both a
   self-hosted <video> and a third-party iframe, chosen per instance by data
   attribute, because the explainer library will likely mix the two.

   PRIVACY: iframe embeds use youtube-nocookie.com, which does not set tracking
   cookies until playback begins. For a firm that advises Fortune 100 clients
   on corporate ethics, quietly tracking visitors before consent is a
   self-inflicted credibility problem.
   ========================================================================== */
function initVideoFacades() {

  const facades = document.querySelectorAll('[data-video-facade]');
  if (!facades.length) return;

  /* Replaces one facade's poster and button with a real, playing player.
     @param {HTMLElement} facade - the container element */
  function activate(facade) {

    // Guard against double-activation from a rapid double-click, which would
    // otherwise stack two players and start audio twice.
    if (facade.dataset.activated === 'true') return;
    facade.dataset.activated = 'true';

    const embedUrl = facade.dataset.videoEmbed;   // Third-party iframe URL
    const mp4Src = facade.dataset.videoMp4;       // Self-hosted MP4
    const webmSrc = facade.dataset.videoWebm;     // Self-hosted WebM
    const title = facade.dataset.videoTitle || 'Explainer video';

    /* SELF-HOSTED BRANCH — preferred for short brand films.
       No third-party JavaScript, no cookies, no external domain, and full
       control over the player's appearance. For a 30-second clip the file is
       smaller than YouTube's player bundle alone. */
    if (mp4Src || webmSrc) {

      const video = document.createElement('video');
      video.controls = true;      // Native controls: keyboard accessible,
                                  // screen-reader labelled, free
      video.autoplay = true;      // The click WAS the intent to play
      video.playsInline = true;   // Required or iOS Safari hijacks it into
                                  // native fullscreen on play
      video.setAttribute('title', title);

      // WebM first for the size advantage; MP4 as the universal fallback.
      if (webmSrc) {
        const s = document.createElement('source');
        s.src = webmSrc;
        s.type = 'video/webm';
        video.appendChild(s);
      }
      if (mp4Src) {
        const s = document.createElement('source');
        s.src = mp4Src;
        s.type = 'video/mp4';
        video.appendChild(s);
      }

      /* PLACEHOLDER — CAPTIONS.
         A <track kind="captions"> pointing at a .vtt file belongs here.
         WCAG 1.2.2 requires captions for prerecorded audio content at Level A.
         For a firm whose subject matter is social responsibility, shipping
         uncaptioned video is a credibility problem as much as a compliance
         one. Add the .vtt files during Phase 5 production — writing them from
         the approved scripts costs almost nothing since the words already
         exist. */

      facade.innerHTML = '';
      facade.appendChild(video);
      return;
    }

    /* THIRD-PARTY IFRAME BRANCH. */
    if (embedUrl && embedUrl.indexOf('VIDEO_ID_HERE') === -1) {

      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = title;
      iframe.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;

      facade.innerHTML = '';
      facade.appendChild(iframe);
      return;
    }

    // Nothing configured. Roll back the activation flag so a later click can
    // retry once the URL is filled in, and leave the poster visible rather
    // than replacing working content with a broken embed on a client site.
    facade.dataset.activated = 'false';
    console.warn('[CFG] Video facade clicked but no source is configured yet.');
  }

  facades.forEach(function (facade) {
    /* Listening on the whole container rather than only the play button gives
       a much larger, more forgiving hit area — which matters most on touch.
       The <button> inside still fires a click on Enter and Space natively, and
       that event bubbles up to here, so keyboard users are covered without a
       separate keydown handler. */
    facade.addEventListener('click', function () {
      activate(facade);
    });
  });
}


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
try {
  initHeroVideo();
  initVideoFacades();
} catch (error) {
  // Logged for debugging, never surfaced. Neither feature is required to read
  // the page — the posters remain and the content is intact.
  console.error('[CFG] video.js initialization error:', error);
}
