/**
 * Contact Form Handler Worker
 * Uses Resend API to send email notifications
 * 
 * POST /api/contact
 * Body: { name, email, service, message, budget, timeline }
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
      const { name, email, service, message, budget, timeline, site } = body;
      
      // Validate required fields
      if (!name || !email || !message) {
        return new Response('Missing required fields', { status: 400 });
      }
      
      // Validate email format
      if (!isValidEmail(email)) {
        return new Response('Invalid email address', { status: 400 });
      }
      
      // Save to database
      await env.DB.prepare(`
        INSERT INTO service_inquiries (name, email, service, message, budget, timeline)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(name, email, service, message, budget, timeline).run();
      
      // Send email notification using Resend
      await sendEmailNotification(body, env);
      
      // Subscribe to newsletter if from tours site
      if (site === 'tours' || site === 'swankyboyz') {
        await subscribeToNewsletter(email, site, env);
      }
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      return new Response(JSON.stringify({ error: 'Failed to process request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

async function sendEmailNotification(data, env) {
  const { name, email, service, message, budget, timeline } = data;
  
  const emailBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${name} (${email})</p>
    ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
    ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
    ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Contact Form <noreply@vaughnsterling.com>',
      to: env.CONTACT_EMAIL || 'vaughn@vaughnsterling.com',
      subject: `New Inquiry: ${service || 'General Contact'}`,
      html: emailBody
    })
  });
  
  if (!response.ok) {
    console.error('Email send failed:', await response.text());
    // Don't throw - we still saved to database
  }
}

async function subscribeToNewsletter(email, site, env) {
  try {
    await env.DB.prepare(`
      INSERT OR IGNORE INTO subscribers (email, site, status)
      VALUES (?, ?, 'active')
    `).bind(email, site).run();
  } catch (error) {
    console.error('Newsletter subscription error:', error);
  }
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

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
