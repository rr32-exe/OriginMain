---
// API Route: Track Newsletter Signup
// POST /api/newsletter

export const prerender = false;

export async function POST({ request, locals }) {
  try {
    const { email, source } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get D1 database from locals (Cloudflare binding)
    const db = locals.runtime.env.DB;

    // Check if already subscribed
    const existing = await db.prepare(
      'SELECT id FROM subscribers WHERE email = ?'
    ).bind(email).first();

    if (existing) {
      return new Response(JSON.stringify({ 
        message: 'Already subscribed' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert new subscriber
    await db.prepare(
      `INSERT INTO subscribers (email, site, status, subscribed_at) 
       VALUES (?, ?, ?, datetime('now'))`
    ).bind(email, 'swankyboyz', 'active').run();

    return new Response(JSON.stringify({ 
      message: 'Subscribed successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
---
