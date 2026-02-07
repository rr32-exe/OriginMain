---
// API Route: Track Click
// POST /api/track-click

export const prerender = false;

export async function POST({ request, locals, clientAddress }) {
  try {
    const { productId, articleId, timestamp } = await request.json();

    if (!productId) {
      return new Response('Product ID required', { status: 400 });
    }

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    const country = request.headers.get('cf-ipcountry') || '';
    
    // Hash IP for privacy
    const ipHash = await hashIP(clientAddress);
    
    // Detect device
    const device = detectDevice(userAgent);

    // Get D1 database
    const db = locals.runtime.env.DB;

    // Insert click record
    await db.prepare(
      `INSERT INTO clicks 
       (product_id, article_id, ip_hash, user_agent, referrer, country, device, clicked_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      parseInt(productId),
      articleId ? parseInt(articleId) : null,
      ipHash,
      userAgent.substring(0, 255),
      referrer.substring(0, 255),
      country,
      device
    ).run();

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Click tracking error:', error);
    return new Response('Error', { status: 500 });
  }
}

async function hashIP(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function detectDevice(userAgent) {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}
---
