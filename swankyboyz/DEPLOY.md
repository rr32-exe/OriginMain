# SwankyBoyz Affiliate System - Deployment Guide

## 🚀 Quick Start (4-6 Hours at Internet Café)

### Prerequisites
- Cloudflare account (free tier)
- GitHub account
- OpenAI API key (optional, for content generation)
- Node.js v18+ installed

### Pre-Café Preparation (Do at home if possible)
- [ ] Create Cloudflare account at cloudflare.com
- [ ] Add your domain to Cloudflare DNS
- [ ] Create GitHub account
- [ ] Get OpenAI API key at platform.openai.com (optional)
- [ ] Download this project as ZIP to USB drive

---

## Hour 1: Local Setup

### 1. Extract Project Files
```bash
# Extract from USB
cd ~/Desktop
unzip swankyboyz-affiliate.zip
cd swankyboyz
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

Required variables:
- `CLOUDFLARE_ACCOUNT_ID` - From Cloudflare dashboard
- `CLOUDFLARE_API_TOKEN` - Generate at Cloudflare API Tokens
- Add affiliate network IDs (optional, can add later)

---

## Hour 2: Database Setup

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### 2. Create D1 Database
```bash
# Create database
wrangler d1 create swankyboyz-db

# Copy the database_id from output
# Update wrangler.toml with your database_id
```

### 3. Run Migrations
```bash
# Create tables
wrangler d1 execute swankyboyz-db --file=./database/schema.sql

# Seed with sample data
wrangler d1 execute swankyboyz-db --file=./database/seed.sql
```

### 4. Verify Database
```bash
# List tables
wrangler d1 execute swankyboyz-db --command="SELECT name FROM sqlite_master WHERE type='table'"

# Check products
wrangler d1 execute swankyboyz-db --command="SELECT COUNT(*) FROM products"
```

---

## Hour 3: Build & Test Locally

### 1. Build the Project
```bash
npm run build
```

### 2. Test Locally
```bash
npm run dev
```

Open browser: http://localhost:4321

### 3. Verify Functionality
- [ ] Homepage loads correctly
- [ ] Product cards display
- [ ] Navigation works
- [ ] Mobile responsive (resize browser)

---

## Hour 4: Deploy to Cloudflare Pages

### 1. Deploy Frontend
```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy ./dist --project-name=swankyboyz
```

### 2. Deploy Worker (for /go/* redirects)
```bash
cd workers
wrangler deploy
```

### 3. Configure Custom Domain
In Cloudflare Dashboard:
1. Go to Pages > swankyboyz > Custom Domains
2. Add your domain: swankyboyz.com
3. Follow DNS setup instructions
4. Wait for SSL certificate (5-10 minutes)

---

## Hour 5: Content Setup

### 1. Add Your Affiliate IDs

Update `wrangler.toml` with your affiliate network IDs:
```toml
[vars]
AMAZON_TAG = "your-tag-20"
SHAREASALE_ID = "your-id"
```

### 2. Update Product Links

Edit products in D1 database:
```bash
wrangler d1 execute swankyboyz-db --command="
  UPDATE products 
  SET affiliate_url = REPLACE(affiliate_url, 'YOURID', 'your-actual-id')
  WHERE affiliate_network = 'shareasale'
"
```

### 3. Generate Content (Optional)

If you have OpenAI API key:
```bash
# Generate 10 articles
npm run generate:articles
```

---

## Hour 6: Final Configuration

### 1. Enable Cloudflare Analytics
1. Go to Cloudflare Dashboard > Analytics
2. Copy your analytics token
3. Add to `.env` file
4. Redeploy: `wrangler pages deploy ./dist --project-name=swankyboyz`

### 2. Test Everything
- [ ] Visit your live site
- [ ] Click affiliate links (verify redirects work)
- [ ] Test on mobile phone
- [ ] Submit newsletter form
- [ ] Check analytics dashboard

### 3. Submit to Search Engines
```bash
# Generate sitemap
npm run generate:sitemap

# Submit to Google Search Console
# Go to search.google.com/search-console
# Add property and verify ownership
# Submit sitemap: https://swankyboyz.com/sitemap.xml
```

---

## Post-Deployment (Next Day)

### Monitor Performance
- Check Cloudflare Analytics (wait 24 hours for data)
- Monitor click tracking in D1 database:
  ```bash
  wrangler d1 execute swankyboyz-db --command="SELECT COUNT(*) FROM clicks"
  ```

### Add More Content
- Write new articles in `/src/pages/articles/`
- Add more products via admin dashboard (to be built)
- Update product prices regularly

### Optimize
- Run Lighthouse audit: developers.google.com/speed/pagespeed/insights
- Check Core Web Vitals
- Optimize images if needed

---

## Common Issues & Solutions

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Database Connection Fails
- Verify `database_id` in `wrangler.toml`
- Check you're logged in: `wrangler whoami`
- Recreate database if needed

### Affiliate Links Don't Work
- Check Worker is deployed: `wrangler deployments list`
- Verify route patterns in `wrangler.toml`
- Test redirect: `curl -I https://swankyboyz.com/go/1`

### Site Not Loading
- Check DNS propagation: dnschecker.org
- Verify SSL certificate is active (may take 10 minutes)
- Check Cloudflare Dashboard > Pages for build logs

---

## Updating the Site

### Update Content
```bash
# Edit files locally
nano src/pages/index.astro

# Rebuild and deploy
npm run build
wrangler pages deploy ./dist --project-name=swankyboyz
```

### Update Database
```bash
# Add new product
wrangler d1 execute swankyboyz-db --command="
  INSERT INTO products (title, price, affiliate_url, category) 
  VALUES ('New Watch', 299.00, 'https://...', 'Watches')
"
```

---

## Free Tier Limits

### Cloudflare Pages
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ 20,000 files

### Cloudflare Workers
- ✅ 100,000 requests/day
- ✅ 10ms CPU time/request

### Cloudflare D1
- ✅ Unlimited reads
- ✅ 100,000 writes/day
- ✅ 5GB storage

### Cloudflare R2
- ✅ 10GB storage
- ✅ 1M Class A operations/month
- ✅ 10M Class B operations/month

**You can handle 100,000+ page views/month on free tier!**

---

## Support

- Cloudflare Docs: developers.cloudflare.com
- Astro Docs: docs.astro.build
- Issues: Create issue in GitHub repo

---

## Next Steps

1. **Week 1**: Add 10-20 products manually
2. **Week 2**: Write/generate 5 high-quality articles
3. **Week 3**: Apply to affiliate networks
4. **Week 4**: Start promoting on social media
5. **Month 2**: Build admin dashboard for easier management

---

## Success Checklist

- [ ] Site loads at your domain
- [ ] All pages are mobile responsive
- [ ] Affiliate links redirect correctly
- [ ] Click tracking works
- [ ] Newsletter signup works
- [ ] Database has products
- [ ] Sitemap submitted to Google
- [ ] Analytics tracking active

**You're live! 🎉**
