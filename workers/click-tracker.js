/**
 * Click Tracker API Worker
 * Handles manual click tracking via API endpoint
 * 
 * POST /api/track-click
 * Body: { productId, articleId, timestamp }
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }
    
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    try {
      const body = await request.json();
      const { productId, articleId } = body;
      
      if (!productId) {
        return new Response('Missing productId', { status: 400 });
      }
      
      // Get user information
      const userAgent = request.headers.get('user-agent') || '';
      const referrer = request.headers.get('referer') || '';
      const ip = request.headers.get('cf-connecting-ip') || '';
      const country = request.cf?.country || 'XX';
      
      // Hash IP for privacy
      const ipHash = await hashIP(ip);
      
      // Determine device type
      const device = getDeviceType(userAgent);
      
      // Insert click record
      await env.DB.prepare(`
        INSERT INTO clicks (product_id, article_id, ip_hash, user_agent, referrer, country, device)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(productId, articleId, ipHash, userAgent, referrer, country, device).run();
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
    } catch (error) {
      console.error('Tracking error:', error);
      return new Response(JSON.stringify({ error: 'Failed to track click' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
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
