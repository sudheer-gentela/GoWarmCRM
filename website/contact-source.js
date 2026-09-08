/**
 * contact-source.js
 *
 * Decides which pillar a contact enquiry came from and writes it into the
 * hidden #source input on /contact, so Work leads are distinguishable from
 * Sales leads in the sheet.
 *
 * Resolution order, first match wins:
 *
 *   1. ?src= on the URL          — explicit, e.g. /contact?src=work
 *   2. the referring page path   — arriving from /work or the Work essay
 *   3. 'sales'                   — the default, unchanged from before
 *
 * Wiring: api/submit.js already writes data.formType to column J of the
 * sheet, so the submit handler only needs one more property:
 *
 *     formType: document.getElementById('source').value
 *
 * Nothing here runs unless #source exists, so the file is inert on every
 * other page.
 */

(function () {
  'use strict';

  var ALLOWED = ['sales', 'work'];
  var WORK_PATHS = ['/work', '/why-you-stopped-knowing'];

  function fromQuery() {
    try {
      var v = new URLSearchParams(window.location.search).get('src');
      if (!v) return null;
      v = v.toLowerCase().trim();
      return ALLOWED.indexOf(v) !== -1 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function fromReferrer() {
    if (!document.referrer) return null;
    try {
      var url = new URL(document.referrer);
      if (url.hostname !== window.location.hostname) return null;
      var p = url.pathname.replace(/\/+$/, '');
      for (var i = 0; i < WORK_PATHS.length; i++) {
        if (p === WORK_PATHS[i]) return 'work';
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function apply() {
    var field = document.getElementById('source');
    if (!field) return;

    var src = fromQuery() || fromReferrer() || 'sales';
    field.value = src;

    // Reframe the page for Work enquiries. Every selector below is optional —
    // a missing element is skipped rather than throwing.
    if (src !== 'work') return;

    var heading = document.querySelector('.contact-form-card h2');
    if (heading) heading.textContent = 'Book Your Walkthrough';

    var button = document.querySelector('.contact-form-card #form-wrap .btn-primary');
    if (button) button.textContent = 'Request Your Walkthrough';

    var role = document.getElementById('role');
    if (role && !role.dataset.workOptions) {
      ['Founder / MD', 'Head of Operations', 'Head of Delivery', 'Project Manager'].forEach(function (label) {
        var opt = document.createElement('option');
        opt.textContent = label;
        role.insertBefore(opt, role.options[1] || null);
      });
      role.dataset.workOptions = '1';
    }

    var teamSize = document.getElementById('team-size');
    if (teamSize) {
      var label = document.querySelector('label[for="team-size"]');
      if (label) label.textContent = 'People in the company *';
    }

    var problem = document.getElementById('problem');
    if (problem) {
      problem.placeholder =
        'e.g. I cannot tell which projects have actually stopped, half the team\u2019s work is invisible, we run delivery out of a spreadsheet and a WhatsApp group...';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
