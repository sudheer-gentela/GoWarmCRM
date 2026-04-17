(function() {
  var html = `
<footer class="site-footer">
  <style>
    .footer-col-resources ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 24px;
    }
  </style>
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-logo" style="display:flex;align-items:center;">
          <svg width="22" height="22" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;margin-right:7px;flex-shrink:0">
            <rect width="72" height="72" rx="16" fill="#E8630A"/>
            <path d="M36 10 C26 18 14 27 16 44 C18 57 27 66 36 70 C45 66 54 57 56 44 C58 27 46 18 36 10Z" fill="#F5A623"/>
            <path d="M36 26 C32 32 27 39 29 47 C31 53 34 58 36 61 C38 58 41 53 43 47 C45 39 40 32 36 26Z" fill="#FDE68A"/>
            <path d="M23 47 L27 59 L32 50 L36 57 L40 50 L45 59 L49 47" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95"/>
          </svg>GoWarm<span>CRM</span>
        </div>
        <p class="footer-tagline">The sales execution platform your CRM is missing. Built for VP Sales, RevOps, and Sales Directors.</p>
      </div>
      <div class="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/how-it-works">How It Works</a></li>
          <li><a href="/problems">Problems We Solve</a></li>
          <li><a href="/pricing">Pricing</a></li>
        </ul>
      </div>
      <div class="footer-col footer-col-resources">
        <h4>Resources</h4>
        <ul>
          <li><a href="/crm-integration">CRM Integration</a></li>
          <li><a href="/salesforce-integration">Salesforce Integration</a></li>
          <li><a href="/execution-gap">The Execution Gap</a></li>
          <li><a href="/what-board-sees-pipeline">What Your Board Sees</a></li>
          <li><a href="/sales-execution-platform">What is a Sales Execution Platform?</a></li>
          <li><a href="/sales-execution-platform-vs-crm">SEP vs CRM</a></li>
          <li><a href="/why-deals-go-dark">Why Deals Go Dark</a></li>
          <li><a href="/pipeline-execution">Pipeline Execution</a></li>
          <li><a href="/pipeline-leakage">Pipeline Leakage</a></li>
          <li><a href="/pipeline-data-accuracy">Pipeline Data Accuracy</a></li>
          <li><a href="/sales-forecast-accuracy">Forecast Accuracy</a></li>
          <li><a href="/crm-execution-gap">The CRM Execution Gap</a></li>
          <li><a href="/sales-rep-action-queue">Sales Rep Action Queue</a></li>
          <li><a href="/sales-execution-platform-for-saas">For SaaS Teams</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/blog">GoWarm Insights</a></li>
          <li><a href="/diagnostic">Pipeline Diagnostic</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 GoWarmCRM. All rights reserved.</span>
      <span>gowarmcrm.com</span>
    </div>
  </div>
</footer>`;

  var el = document.getElementById('site-footer');
  if (el) el.outerHTML = html;
})();
