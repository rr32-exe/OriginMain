# 🆘 Troubleshooting Guide

Common issues and solutions for the SwankyBoys Affiliate System.

---

## 🗄️ Database Issues

### Error: "Database not found"

**Problem:** Worker can't connect to D1 database.

**Solutions:**

1. Verify database was created:
```bash
wrangler d1 list
```

2. Check database ID in `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_id = "YOUR_ACTUAL_DATABASE_ID"  # Must match output from d1 create
```

3. Redeploy worker after updating config:
```bash
wrangler deploy workers/link-redirect.js
```

### Error: "Table doesn't exist"

**Problem:** Migrations weren't run.

**Solution:**
```bash
# Run migrations for each database
wrangler d1 execute swankyboyz-db --file=./database/schema.sql
wrangler d1 execute tours-db --file=./database/schema.sql
wrangler d1 execute personal-db --file=./database/schema.sql

# Verify tables exist
wrangler d1 execute swankyboyz-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### Error: "D1_ERROR: UNIQUE constraint failed"

**Problem:** Trying to insert duplicate data (usually during seeding).

**Solution:**
```bash
# Clear database and re-seed
wrangler d1 execute swankyboyz-db --command="DELETE FROM products"
wrangler d1 execute swankyboyz-db --file=./database/seed-swankyboyz.sql
```

---

## ⚙️ Worker Issues

### Error: "Worker not found" or 404

**Problem:** Worker isn't deployed or route is incorrect.

**Solutions:**

1. List deployed workers:
```bash
wrangler deployments list
```

2. Deploy the worker:
```bash
wrangler deploy workers/link-redirect.js --name link-redirect
```

3. Test the worker:
```bash
curl https://link-redirect.YOUR-SUBDOMAIN.workers.dev/go/1
```

### Error: "ReferenceError: env is not defined"

**Problem:** Environment bindings not configured.

**Solution:**

Add bindings to `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "swankyboyz-db"
database_id = "your-database-id"
```

### Error: "Failed to fetch: TypeError"

**Problem:** Worker can't call external API (OpenAI, Resend).

**Solutions:**

1. Check secrets are set:
```bash
wrangler secret list --name content-generator
```

2. Add missing secrets:
```bash
wrangler secret put OPENAI_API_KEY --name content-generator
wrangler secret put RESEND_API_KEY --name contact-form
```

3. Test API key:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## 🌐 Deployment Issues

### Error: "Build failed" or "npm ERR!"

**Problem:** Missing dependencies or Node version mismatch.

**Solutions:**

1. Clean install:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Check Node version (need v18+):
```bash
node --version  # Should be 18.0.0 or higher
```

3. Install globally if needed:
```bash
npm install -g npm@latest
npm install -g wrangler@latest
```

### Error: "Pages deployment failed"

**Problem:** Build output directory not found.

**Solution:**

Verify build output in `astro.config.mjs`:
```javascript
export default defineConfig({
  output: 'static',
  outDir: './dist'  // Cloudflare Pages expects 'dist'
});
```

### Error: "Custom domain not working"

**Problem:** DNS not configured or propagating.

**Solutions:**

1. Check DNS settings in Cloudflare:
   - Should have CNAME pointing to `*.pages.dev`
   - Proxy status should be ON (orange cloud)

2. Wait for DNS propagation (can take 24 hours):
```bash
# Check DNS
dig swankyboyz.com
nslookup swankyboyz.com
```

3. Force HTTPS in Pages settings:
   - Go to Pages project → Settings → Custom domains
   - Enable "Always Use HTTPS"

---

## 📝 Content Generation Issues

### Error: "OpenAI API error: 401"

**Problem:** Invalid or missing API key.

**Solutions:**

1. Verify key is in `.env`:
```bash
cat .env | grep OPENAI_API_KEY
```

2. Test key directly:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY"
```

3. Get new key at: https://platform.openai.com/api-keys

### Error: "OpenAI API error: 429"

**Problem:** Rate limit exceeded.

**Solutions:**

1. Add delays between requests in script (already implemented)

2. Check usage limits:
   - Go to https://platform.openai.com/usage
   - Verify you haven't exceeded free tier

3. Reduce concurrent requests:
```javascript
// In scripts/generate-content.js
await sleep(5000);  // Increase from 3000 to 5000ms
```

### Script generates empty content

**Problem:** OpenAI response parsing error.

**Solution:**

Check console output for errors:
```bash
node scripts/generate-content.js swankyboyz 2>&1 | tee generation.log
```

Verify JSON files have content:
```bash
cat content/swankyboyz/*.json | jq '.wordCount'
```

---

## 🔗 Affiliate Link Issues

### Links don't redirect

**Problem:** Worker route not configured or product doesn't exist.

**Solutions:**

1. Test worker directly:
```bash
curl -I https://link-redirect.YOUR-SUBDOMAIN.workers.dev/go/1
# Should return 301 or 302
```

2. Check product exists:
```bash
wrangler d1 execute swankyboyz-db --command="SELECT id, title, affiliate_url FROM products WHERE id=1"
```

3. Verify worker route in Cloudflare dashboard:
   - Workers → Your Worker → Triggers → Routes
   - Should have: `*swankyboyz.com/go/*`

### Clicks not being tracked

**Problem:** JavaScript not loaded or database not recording.

**Solutions:**

1. Check browser console for errors:
   - Open DevTools (F12)
   - Look for failed fetch requests

2. Test click tracking endpoint:
```bash
curl -X POST https://click-tracker.YOUR-SUBDOMAIN.workers.dev/api/track-click \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "articleId": 1}'
```

3. Verify clicks in database:
```bash
wrangler d1 execute swankyboyz-db --command="SELECT * FROM clicks ORDER BY clicked_at DESC LIMIT 5"
```

4. Check if `track-clicks.js` is loaded:
```html
<!-- Should be in your page -->
<script src="/js/track-clicks.js"></script>
```

---

## 📧 Email Issues

### Contact form not sending emails

**Problem:** Resend API key missing or incorrect.

**Solutions:**

1. Verify Resend secret:
```bash
wrangler secret list --name contact-form
```

2. Test Resend API:
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"noreply@example.com","to":"test@example.com","subject":"Test","html":"Test"}'
```

3. Check Resend dashboard for errors:
   - Go to https://resend.com/emails
   - Look for failed sends

4. Verify domain is verified in Resend:
   - Must verify domain before sending
   - Add DNS records provided by Resend

### Newsletter signups not saving

**Problem:** Database write error.

**Solution:**
```bash
# Test insert manually
wrangler d1 execute swankyboyz-db --command="INSERT INTO subscribers (email, site) VALUES ('test@example.com', 'swankyboyz')"

# Check if it saved
wrangler d1 execute swankyboyz-db --command="SELECT * FROM subscribers"
```

---

## 🚀 Performance Issues

### Slow page load times

**Problem:** Large images or unoptimized code.

**Solutions:**

1. Optimize images:
   - Use WebP format
   - Compress with tools like Squoosh
   - Add lazy loading: `<img loading="lazy">`

2. Check Lighthouse scores:
   - Chrome DevTools → Lighthouse
   - Target: 90+ for performance

3. Enable caching:
```javascript
// In worker
return new Response(html, {
  headers: {
    'Cache-Control': 'public, max-age=3600'
  }
});
```

### Worker timeout errors

**Problem:** Database query or API call taking too long.

**Solutions:**

1. Add indexes to frequently queried columns (already in schema)

2. Use connection pooling for D1

3. Implement timeouts:
```javascript
const timeout = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Timeout')), 5000)
);

const result = await Promise.race([
  fetchData(),
  timeout
]);
```

---

## 🔐 Security Issues

### "Unsafe redirect" warning

**Problem:** Redirect to untrusted domain.

**Solution:**

Validate affiliate URLs before redirecting:
```javascript
function isSafeURL(url) {
  const allowed = [
    'shareasale.com',
    'amazon.com',
    'booking.com',
    'agoda.com'
  ];
  
  try {
    const hostname = new URL(url).hostname;
    return allowed.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
}
```

### Rate limit exceeded

**Problem:** Too many requests from single IP.

**Solution:**

Implement rate limiting in worker:
```javascript
const RATE_LIMIT = 100; // requests per hour
const ip = request.headers.get('cf-connecting-ip');

// Store in KV or check against recent requests
if (await isRateLimited(ip)) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

---

## 💰 Cost Issues

### Exceeded free tier limits

**Problem:** Too many requests/writes.

**Solutions:**

1. Check usage in Cloudflare dashboard:
   - Analytics → Workers
   - Look for spikes

2. Implement caching to reduce requests:
```javascript
// Cache frequently accessed data
const cached = await env.CACHE.get('products');
if (cached) return JSON.parse(cached);
```

3. Optimize database writes:
   - Batch inserts
   - Use triggers for daily rollups
   - Clean old data

### Unexpected OpenAI charges

**Problem:** Generated more content than expected.

**Solutions:**

1. Check usage at: https://platform.openai.com/usage

2. Set spending limits in OpenAI dashboard

3. Track costs in `content_log` table:
```bash
wrangler d1 execute swankyboyz-db --command="SELECT SUM(total_cost) as total FROM content_log"
```

---

## 🧪 Testing Checklist

Before going live, test:

- [ ] All pages load without errors
- [ ] Affiliate links redirect correctly
- [ ] Click tracking works
- [ ] Contact form sends emails
- [ ] Newsletter signup saves to database
- [ ] Mobile responsive (test on phone)
- [ ] Performance scores (Lighthouse)
- [ ] No console errors
- [ ] SSL certificate active
- [ ] Custom domains working

---

## 📞 Getting Help

If you're still stuck:

1. **Check Cloudflare Logs:**
   - Dashboard → Workers → Your Worker → Logs
   - Real-time error messages

2. **Search Cloudflare Docs:**
   - https://developers.cloudflare.com

3. **Community Forums:**
   - Cloudflare Community: https://community.cloudflare.com
   - Discord: https://discord.gg/cloudflaredev

4. **GitHub Issues:**
   - Open an issue with full error message
   - Include relevant code and config

---

## 🔧 Debug Mode

Enable verbose logging in workers:

```javascript
const DEBUG = true;

if (DEBUG) {
  console.log('Request:', request.url);
  console.log('Headers:', Object.fromEntries(request.headers));
  console.log('Body:', await request.text());
}
```

View logs:
```bash
wrangler tail link-redirect
```

---

## 🔒 Security Issues

### Dependency Vulnerabilities

**Problem:** npm audit shows vulnerabilities.

**Solution:**

1. Check for vulnerabilities:
```bash
npm audit
```

2. Automatic fix (safe):
```bash
npm audit fix
```

3. Force fix (may break):
```bash
npm audit fix --force
```

4. Update specific package:
```bash
npm update astro
# or
npm install astro@latest
```

### XSS/Injection Attempts

**Problem:** Suspicious requests in logs.

**Solution:**

1. Check Cloudflare firewall:
   - Dashboard → Security → WAF
   - Review blocked requests

2. Enable rate limiting:
   - Already implemented in workers
   - Adjust thresholds if needed

3. Review logs for patterns:
```bash
wrangler tail link-redirect | grep -i "error\|attack\|inject"
```

### SSL/HTTPS Issues

**Problem:** Mixed content warnings.

**Solution:**

1. Verify all URLs use HTTPS
2. Check Cloudflare SSL settings:
   - Should be "Full" or "Full (Strict)"
3. Force HTTPS redirect:
   - Enable in Cloudflare Pages settings

### Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Verify no vulnerabilities
npm audit
```

**See SECURITY.md for detailed security guidelines.**

---

**Remember:** Most issues are configuration-related. Double-check:
- Environment variables
- Database IDs
- API keys
- Route patterns
- Dependency versions

Good luck! 🚀
