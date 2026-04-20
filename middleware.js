import { next, rewrite } from '@vercel/edge';

export const config = {
  matcher: [
    '/',
    '/how-it-works',
    '/pricing',
    '/problems',
    '/execution-gap',
    '/platform-overview',
    '/crm-integration',
    '/salesforce-integration',
    '/about',
    '/contact',
  ],
};

// Clean route → markdown source path
const MD_MAP = {
  '/': '/markdown/index.md',
  '/how-it-works': '/markdown/how-it-works.md',
  '/pricing': '/markdown/pricing.md',
  '/problems': '/markdown/problems.md',
  '/execution-gap': '/markdown/execution-gap.md',
  '/platform-overview': '/markdown/platform-overview.md',
  '/crm-integration': '/markdown/crm-integration.md',
  '/salesforce-integration': '/markdown/salesforce-integration.md',
  '/about': '/markdown/about.md',
  '/contact': '/markdown/contact.md',
};

export default function middleware(request) {
  const accept = request.headers.get('accept') || '';
  const url = new URL(request.url);

  // Serve markdown only when the client explicitly asks for it.
  // Agents send Accept: text/markdown; browsers send Accept: text/html,...
  const wantsMarkdown =
    accept.includes('text/markdown') &&
    !accept.startsWith('text/html');

  if (!wantsMarkdown) {
    return next();
  }

  const mdPath = MD_MAP[url.pathname];
  if (!mdPath) {
    return next();
  }

  // Rewrite to the markdown file. The Content-Type header for /(.*)\.md
  // configured in vercel.json will set text/markdown on the response.
  const rewriteUrl = new URL(mdPath, request.url);
  return rewrite(rewriteUrl);
}
