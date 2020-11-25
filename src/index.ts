import { buildIxf } from './ixf';

// Static headers for all responses.
const RES_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type, User-Agent',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Primary entry for request & response handling.
 */
async function handleEvent(event: FetchEvent) {
  const headers = new Headers({
    'cache-control': `max-age=${CACHE_AGE}`,
    ...RES_HEADERS,
  });
  // Default response is a generic error.
  let response = new Response(
    JSON.stringify({ Error: 'Something went wrong. Please contact noc@48ix.net' }),
    { headers, status: 500 },
  );
  try {
    // Create a cache key & initialize the cache API.
    const cacheUrl = new URL(event.request.url);
    cacheUrl.hostname = 'ixf.48ix.net';
    const cacheKey = new Request(cacheUrl.toString(), event.request);
    const cache = caches.default;

    // Try to get a cached value.
    response = await cache.match(cacheKey);

    // If there is no cached value, run the query again & cache its response.
    if (!response) {
      const data = await buildIxf();
      response = new Response(JSON.stringify(data), { headers, status: 200 });
      event.waitUntil(cache.put(cacheKey, response.clone()));
    }
  } catch (err) {
    // If errors are thrown & caught, set the response message to a useful error message.
    response = new Response(JSON.stringify({ Error: err.message }), { headers, status: 500 });
    console.error(err.message || err);
  }
  return response;
}

/**
 * Handle CORS preflight.
 */
async function handleCors(request: Request) {
  if (
    request.headers.get('Origin') &&
    request.headers.get('Access-Control-Request-Method') &&
    request.headers.get('Access-Control-Request-Headers')
  ) {
    return new Response(null, { headers: RES_HEADERS });
  } else {
    return new Response(null, { headers: { Allow: 'GET, OPTIONS' } });
  }
}

/**
 * Worker event listener.
 */
addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method === 'OPTIONS') {
    event.respondWith(handleCors(event.request));
  } else {
    event.respondWith(handleEvent(event));
  }
});
