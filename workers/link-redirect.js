/**
 * Link Redirect Worker
 * Handles /go/ affiliate link redirects with click tracking
 * 
 * Routes:
 * /go/product-slug -> Redirects to affiliate URL
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle /go/ redirects
    if (url.pathname.startsWith('/go/')) {
      return handleAffiliateRedirect(request, env, url);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function handleAffiliateRedirect(request, env, url) {
  const slug = url.pathname.replace('/go/', '');
  
  if (!slug) {
    return new Response('Invalid link', { status: 400 });
  }
  
  try {
    // Get product from database
    const product = await env.DB.prepare(
      'SELECT id, affiliate_url, title FROM products WHERE id = ? AND is_active = 1'
    ).bind(slug).first();
    
    if (!product) {
      return new Response('Product not found', { status: 404 });
    }
    
    // Track the click asynchronously
    const trackingPromise = trackClick(request, env, product.id, url);
    
    // Don't wait for tracking to complete - redirect immediately
    ctx.waitUntil && ctx.waitUntil(trackingPromise);
    
    // Redirect to affiliate URL with proper headers
    return Response.redirect(product.affiliate_url, 301);
    
  } catch (error) {
    console.error('Redirect error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function trackClick(request, env, productId, url) {
  try {
    // Get user information
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    const ip = request.headers.get('cf-connecting-ip') || '';
    const country = request.cf?.country || 'XX';
    
    // Hash IP for privacy (GDPR compliance)
    const ipHash = await hashIP(ip);
    
    // Determine device type
    const device = getDeviceType(userAgent);
    
    // Extract article ID from referrer if present
    const articleId = extractArticleId(referrer);
    
    // Insert click record
    await env.DB.prepare(`
      INSERT INTO clicks (product_id, article_id, ip_hash, user_agent, referrer, country, device)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(productId, articleId, ipHash, userAgent, referrer, country, device).run();
    
  } catch (error) {
    console.error('Click tracking error:', error);
    // Don't throw - tracking failure shouldn't break redirect
  }
}

async function hashIP(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getDeviceType(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  return 'desktop';
}

function extractArticleId(referrer) {
  // Try to extract article ID from referrer URL
  // This is a simple implementation - enhance based on your URL structure
  if (!referrer) return null;
  
  const match = referrer.match(/\/article\/(\d+)/);
  return match ? parseInt(match[1]) : null;
}
