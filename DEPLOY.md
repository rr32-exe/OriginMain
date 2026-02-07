# 🚀 Deployment Guide: SwankyBoys Affiliate System

Complete step-by-step guide to deploy all three sites to Cloudflare in 4-6 hours.

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] Cloudflare account (free tier) - [Sign up](https://dash.cloudflare.com/sign-up)
- [ ] All three domains added to Cloudflare DNS
  - SwankyBoyz.com
  - VaughnSterlingTours.com
  - VaughnSterling.com
- [ ] GitHub account (optional, for version control)
- [ ] OpenAI API key (for content generation) - [Get key](https://platform.openai.com/api-keys)
- [ ] Node.js installed (v18 or higher) - [Download](https://nodejs.org)
- [ ] Text editor (VS Code recommended)

## ⏱️ Timeline Overview

| Phase | Duration | Tasks |
|-------|----------|-------|
| Setup | 30 min | Install dependencies, configure environment |
| Database | 20 min | Create D1 databases, run migrations |
| Workers | 30 min | Deploy Cloudflare Workers |
| Content | 1 hour | Generate initial articles (optional) |
| Sites | 2 hours | Build and deploy all 3 sites |
| Testing | 1 hour | Verify everything works |
| Configuration | 30 min | Custom domains, analytics |

**Total: ~5.5 hours**

---

## 📦 Phase 1: Setup (30 minutes)

### 1.1 Install Dependencies

```bash
# Navigate to project folder
cd /path/to/swankyboys-affiliate-system

# Install dependencies
npm install

# Install Cloudflare Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### 1.2 Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your values
nano .env  # or use your preferred editor
```

**Required values:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `CLOUDFLARE_ACCOUNT_ID` - Get from Cloudflare dashboard
- `CONTACT_EMAIL` - Your email for contact forms
- `RESEND_API_KEY` - Get from [Resend.com](https://resend.com) (free tier)
- Affiliate network IDs (add as you get approved)

---

## 🗄️ Phase 2: Database Setup (20 minutes)

### 2.1 Create D1 Databases

```bash
# Create databases for all three sites
wrangler d1 create swankyboyz-db
wrangler d1 create tours-db
wrangler d1 create personal-db
```

**Important:** Copy the database IDs from the output and add them to your `.env` file and `wrangler.toml`.

### 2.2 Run Migrations

```bash
# Create tables in each database
wrangler d1 execute swankyboyz-db --file=./database/schema.sql
wrangler d1 execute tours-db --file=./database/schema.sql
wrangler d1 execute personal-db --file=./database/schema.sql
```

### 2.3 Seed Sample Data

```bash
# Add sample products and articles
wrangler d1 execute swankyboyz-db --file=./database/seed-swankyboyz.sql
wrangler d1 execute tours-db --file=./database/seed-tours.sql
```

### 2.4 Verify Database

```bash
# Check tables were created
wrangler d1 execute swankyboyz-db --command="SELECT name FROM sqlite_master WHERE type='table'"

# You should see: products, articles, clicks, subscribers, etc.
```

---

## ⚙️ Phase 3: Deploy Workers (30 minutes)

### 3.1 Update wrangler.toml

Edit `wrangler.toml` and add your database IDs:

```toml
[[d1_databases]]
binding = "DB"
database_name = "swankyboyz-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
```

### 3.2 Deploy Workers

```bash
# Deploy all workers
wrangler deploy workers/link-redirect.js --name link-redirect
wrangler deploy workers/click-tracker.js --name click-tracker
wrangler deploy workers/content-generator.js --name content-generator
wrangler deploy workers/contact-form.js --name contact-form
```

### 3.3 Add Secrets to Workers

```bash
# Add OpenAI API key
wrangler secret put OPENAI_API_KEY --name content-generator

# Add Resend API key
wrangler secret put RESEND_API_KEY --name contact-form
wrangler secret put CONTACT_EMAIL --name contact-form
```

### 3.4 Test Workers

```bash
# Test link redirect (should return 404 for now, but confirms it's working)
curl https://link-redirect.YOUR-SUBDOMAIN.workers.dev/go/1

# Test click tracker
curl -X POST https://click-tracker.YOUR-SUBDOMAIN.workers.dev/api/track-click \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'
```

---

## 📝 Phase 4: Generate Content (1 hour - Optional)

### 4.1 Generate Articles for SwankyBoyz

```bash
# This will generate 10 articles using OpenAI
node scripts/generate-content.js swankyboyz
```

Articles will be created in draft status. You can:
- Review them in the database
- Edit them before publishing
- Generate more as needed

### 4.2 Generate Articles for Tours

```bash
node scripts/generate-content.js tours
```

### 4.3 Generate Service Pages

```bash
node scripts/generate-content.js personal
```

**Cost Estimate:**
- Each article: ~3,000 tokens
- 25 articles: ~75,000 tokens
- Cost: ~$0.01 (GPT-4o-mini is very cheap!)

---

## 🌐 Phase 5: Build & Deploy Sites (2 hours)

### 5.1 Set Up Site Structure

```bash
# Create site directories
mkdir -p sites/swankyboyz sites/tours sites/personal

# Each site will use Astro for speed
```

### 5.2 Build Sites

```bash
# Build all sites
npm run build

# Or build individually
npm run build:swankyboyz
npm run build:tours
npm run build:personal
```

### 5.3 Test Locally

```bash
# Run local dev server
npm run dev

# Open browser to http://localhost:3000
# Check:
# - Pages load correctly
# - Affiliate links work
# - Forms submit
# - Mobile responsive
```

### 5.4 Deploy to Cloudflare Pages

```bash
# Deploy each site
npm run deploy:swankyboyz
npm run deploy:tours
npm run deploy:personal
```

You'll get URLs like:
- `swankyboyz-xxxx.pages.dev`
- `tours-xxxx.pages.dev`
- `personal-xxxx.pages.dev`

---

## ✅ Phase 6: Testing (1 hour)

### 6.1 Functional Testing

Test each site:

**SwankyBoyz.com:**
- [ ] Homepage loads
- [ ] Article pages display correctly
- [ ] Product cards show proper data
- [ ] Affiliate links redirect correctly
- [ ] Newsletter signup works
- [ ] Contact form submits

**VaughnSterlingTours.com:**
- [ ] Homepage loads
- [ ] Budget breakdown pages work
- [ ] Hotel/booking links work
- [ ] Email signup works

**VaughnSterling.com:**
- [ ] Services page displays
- [ ] Contact form works
- [ ] Portfolio/case studies show

### 6.2 Mobile Testing

Open each site on your phone and check:
- [ ] Responsive layout
- [ ] Touch targets are adequate (44x44px minimum)
- [ ] No horizontal scrolling
- [ ] Images load properly
- [ ] Forms work on mobile

### 6.3 Performance Testing

Run Lighthouse tests (Chrome DevTools):

```bash
# Target scores:
Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 100
```

### 6.4 Link Testing

Test affiliate link tracking:

```bash
# Click an affiliate link
# Check database for click record
wrangler d1 execute swankyboyz-db --command="SELECT * FROM clicks ORDER BY clicked_at DESC LIMIT 5"
```

---

## 🔧 Phase 7: Final Configuration (30 minutes)

### 7.1 Add Custom Domains

In Cloudflare Pages dashboard:

1. Go to each Pages project
2. Click "Custom domains"
3. Add your domain:
   - SwankyBoyz.com → swankyboyz project
   - VaughnSterlingTours.com → tours project
   - VaughnSterling.com → personal project
4. DNS will auto-configure

### 7.2 Enable Analytics

```html
<!-- Add to all sites' <head> -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

Get token from: Cloudflare Dashboard → Analytics → Web Analytics

### 7.3 Set Up Cron Jobs

Configure price update cron (runs daily):

```bash
# In wrangler.toml, already configured:
[triggers]
crons = ["0 0 * * *"]  # Midnight UTC
```

### 7.4 Configure Email Forwarding

For contact forms to work:

1. Go to Cloudflare Email Routing
2. Add catch-all or specific addresses
3. Forward to your personal email

---

## 🎯 Post-Deployment Checklist

- [ ] All sites accessible via custom domains
- [ ] SSL certificates active (auto via Cloudflare)
- [ ] Analytics tracking
- [ ] Contact forms sending emails
- [ ] Affiliate links being tracked
- [ ] Newsletter signups working
- [ ] Mobile responsive confirmed
- [ ] Performance scores acceptable
- [ ] Database accessible
- [ ] Workers responding

---

## 📊 Monitoring & Maintenance

### Daily Tasks:
- Check analytics for traffic
- Monitor affiliate clicks
- Review contact form submissions

### Weekly Tasks:
- Review generated content
- Update product prices (manual or automated)
- Check for broken links

### Monthly Tasks:
- Review performance metrics
- Update affiliate disclosure
- Add new products
- Publish scheduled content

---

## 🆘 Troubleshooting

### Database Connection Errors

```bash
# Verify database ID is correct in wrangler.toml
wrangler d1 list

# Check binding name matches code
# Should be "DB" everywhere
```

### Worker Not Deploying

```bash
# Clear cache and redeploy
wrangler deploy workers/link-redirect.js --force
```

### Missing Environment Variables

```bash
# List all secrets
wrangler secret list --name content-generator

# Re-add if missing
wrangler secret put OPENAI_API_KEY --name content-generator
```

### Site Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Affiliate Links Not Tracking

1. Check browser console for errors
2. Verify worker is deployed: `curl https://click-tracker.*.workers.dev/api/track-click`
3. Check database: `SELECT * FROM clicks LIMIT 5`

---

## 💰 Cost Breakdown (Free Tier Limits)

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| Cloudflare Pages | Unlimited | 3 sites | $0 |
| D1 Database | 100k writes/day | ~1k/day | $0 |
| Workers | 100k req/day | ~10k/day | $0 |
| R2 Storage | 10GB | ~2GB | $0 |
| OpenAI API | $5 credit | ~10,000 articles | $0.10 |
| Resend Email | 100/day | ~5/day | $0 |
| **Total** | | | **~$0.10/month** |

---

## 🚀 Going Live

Once everything is tested:

1. ✅ Update all affiliate IDs with real values
2. ✅ Publish draft articles
3. ✅ Submit sitemaps to Google Search Console
4. ✅ Share on social media
5. ✅ Monitor analytics

---

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [Astro Documentation](https://docs.astro.build)
- [ShareASale Integration](https://www.shareasale.com/info/integration/)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

## ✨ Success!

You now have a complete affiliate marketing system running on Cloudflare's free tier!

**Next Steps:**
1. Start creating content
2. Apply to affiliate programs
3. Build your audience
4. Track your progress
5. Scale up as you grow

**Questions?** Check TROUBLESHOOTING.md or open an issue on GitHub.

---

**Made with ❤️ for digital nomads and affiliate marketers**
