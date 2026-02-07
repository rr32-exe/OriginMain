// Cloudflare Worker for Affiliate Link Redirects
// Handles /go/* routes with click tracking

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Only handle /go/ routes
    if (!url.pathname.startsWith('/go/')) {
      return new Response('Not Found', { status: 404 });
    }

    // Extract product slug
    const productSlug = url.pathname.replace('/go/', '');
    
    if (!productSlug) {
      return new Response('Product not found', { status: 404 });
    }

    try {
      // Get product from database
      const product = await env.DB.prepare(
        'SELECT id, affiliate_url, title FROM products WHERE id = ? AND is_active = 1'
      ).bind(parseInt(productSlug) || 0).first();

      if (!product) {
        return new Response('Product not found', { status: 404 });
      }

      // Track the click (async, don't wait)
      await trackClick(request, env, product.id, url.searchParams.get('article'));

      // Redirect to affiliate URL
      return Response.redirect(product.affiliate_url, 301);
    } catch (error) {
      console.error('Error processing redirect:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

async function trackClick(request, env, productId, articleId) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    const ip = request.headers.get('cf-connecting-ip') || '';
    const country = request.headers.get('cf-ipcountry') || '';
    
    // Hash IP for privacy (GDPR compliant)
    const ipHash = await hashString(ip);
    
    // Detect device type
    const device = detectDevice(userAgent);

    // Insert click record
    await env.DB.prepare(
      `INSERT INTO clicks 
       (product_id, article_id, ip_hash, user_agent, referrer, country, device, clicked_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      productId,
      articleId ? parseInt(articleId) : null,
      ipHash,
      userAgent.substring(0, 255), // Limit length
      referrer.substring(0, 255),
      country,
      device
    ).run();
  } catch (error) {
    console.error('Error tracking click:', error);
    // Don't fail the redirect if tracking fails
  }
}

async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function detectDevice(userAgent) {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}
