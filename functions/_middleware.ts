const agentMarkdown = `# Restro360

Restro360 is an all-in-one restaurant management platform for India, combining POS billing, live inventory, staff operations, reporting, and contactless QR ordering.

## Product

- Smart POS and GST-ready billing for dine-in, takeaway, and delivery
- Live inventory and recipe costing
- Table and kitchen synchronization
- Staff operations and reporting
- Contactless QR ordering without an app download

## Contact

Book a free demo at https://www.restro360.com/#contact.
`;

const discoveryLinks = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</api/openapi.json>; rel="service-desc"',
  '</api-docs.md>; rel="service-doc"',
  '</index.md>; rel="describedby"',
];

type MiddlewareContext = {
  request: Request;
  next: () => Promise<Response>;
};

export const onRequest = async (context: MiddlewareContext): Promise<Response> => {
  const response = await context.next();
  const pathname = new URL(context.request.url).pathname;

  if (pathname !== '/') {
    return response;
  }

  const headers = new Headers(response.headers);
  discoveryLinks.forEach((link) => headers.append('Link', link));

  if (context.request.headers.get('Accept')?.toLowerCase().includes('text/markdown')) {
    headers.set('Content-Type', 'text/markdown; charset=utf-8');
    headers.set('Vary', 'Accept');
    return new Response(agentMarkdown, { status: 200, headers });
  }

  headers.append('Vary', 'Accept');
  return new Response(response.body, { status: response.status, headers });
};