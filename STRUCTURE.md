# SwankyBoys Affiliate System - Project Structure

```
swankyboys-affiliate-system/
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Root package.json with workspaces
├── wrangler.toml               # Cloudflare Workers configuration
├── README.md                    # Project overview and requirements
├── DEPLOY.md                    # Deployment guide
├── STRUCTURE.md                 # This file
│
├── database/                    # Database schemas and migrations
│   ├── schema.sql              # Complete database schema
│   ├── seed-swankyboyz.sql     # Sample data for SwankyBoyz
│   └── seed-tours.sql          # Sample data for Tours
│
├── workers/                     # Cloudflare Workers (serverless functions)
│   ├── link-redirect.js        # Handles /go/ affiliate redirects
│   ├── click-tracker.js        # API for click tracking
│   ├── content-generator.js    # OpenAI content generation
│   └── contact-form.js         # Contact form handler with email
│
├── scripts/                     # Utility scripts
│   ├── generate-content.js     # Generate articles using OpenAI
│   ├── import-products.js      # Bulk import products from CSV
│   └── update-prices.js        # Update product prices from affiliate APIs
│
├── content/                     # Generated content storage
│   ├── swankyboyz/             # Generated articles for SwankyBoyz
│   ├── tours/                  # Generated articles for Tours
│   └── personal/               # Generated pages for Personal site
│
└── sites/                       # Frontend sites (Astro/Next.js)
    │
    ├── swankyboyz/             # SwankyBoyz.com
    │   ├── package.json
    │   ├── astro.config.mjs
    │   ├── src/
    │   │   ├── layouts/
    │   │   │   ├── BaseLayout.astro
    │   │   │   └── ArticleLayout.astro
    │   │   ├── pages/
    │   │   │   ├── index.astro
    │   │   │   ├── articles/
    │   │   │   ├── category/
    │   │   │   └── about.astro
    │   │   ├── components/
    │   │   │   ├── ProductCard.astro
    │   │   │   ├── ComparisonTable.astro
    │   │   │   ├── PriceBox.astro
    │   │   │   ├── ProductGrid.astro
    │   │   │   ├── Newsletter.astro
    │   │   │   └── AffiliateDisclosure.astro
    │   │   └── styles/
    │   │       └── global.css
    │   └── public/
    │       ├── images/
    │       └── js/
    │           └── track-clicks.js
    │
    ├── tours/                   # VaughnSterlingTours.com
    │   ├── package.json
    │   ├── astro.config.mjs
    │   ├── src/
    │   │   ├── layouts/
    │   │   ├── pages/
    │   │   ├── components/
    │   │   └── styles/
    │   └── public/
    │
    └── personal/                # VaughnSterling.com
        ├── package.json
        ├── astro.config.mjs
        ├── src/
        │   ├── layouts/
        │   ├── pages/
        │   │   ├── index.astro
        │   │   ├── services.astro
        │   │   ├── portfolio.astro
        │   │   └── contact.astro
        │   ├── components/
        │   └── styles/
        └── public/
```

## 📁 Directory Details

### Root Level

**Configuration Files:**
- `.env.example` - Template for environment variables (API keys, database IDs)
- `wrangler.toml` - Cloudflare Workers configuration
- `package.json` - Manages workspaces for all sites

### `/database/`

Database schemas and seed data for Cloudflare D1 (SQLite).

**Tables:**
- `products` - Affiliate products with pricing and network info
- `articles` - Content for all sites
- `clicks` - Click tracking with privacy-compliant hashing
- `subscribers` - Newsletter signups
- `service_inquiries` - Contact form submissions
- `content_log` - AI generation cost tracking
- `analytics_daily` - Daily traffic/revenue summaries

### `/workers/`

Cloudflare Workers (serverless edge functions).

**Workers:**
1. `link-redirect.js` - Redirects /go/X to affiliate URLs with tracking
2. `click-tracker.js` - REST API for manual click tracking
3. `content-generator.js` - OpenAI integration for article generation
4. `contact-form.js` - Form handler with email notifications (Resend.com)

### `/scripts/`

Node.js utility scripts for content and data management.

**Scripts:**
- `generate-content.js` - Generate articles using OpenAI GPT-4o-mini
- `import-products.js` - Bulk import from CSV
- `update-prices.js` - Scheduled price updates from affiliate APIs

### `/sites/`

Three separate Astro sites, one for each domain.

**Shared Components:**
- ProductCard - Display product with price and affiliate link
- ComparisonTable - Side-by-side product comparison
- PriceBox - Highlighted CTA box
- ProductGrid - Grid layout for category pages
- Newsletter - Email signup form
- AffiliateDisclosure - Legal compliance

## 🔧 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Astro | Static site generation (fast!) |
| Styling | Tailwind CSS | Utility-first styling |
| Backend | Cloudflare Workers | Serverless functions |
| Database | Cloudflare D1 | SQLite database |
| Storage | Cloudflare R2 | Image hosting |
| CDN | Cloudflare Pages | Static hosting + CDN |
| AI | OpenAI GPT-4o-mini | Content generation |
| Email | Resend.com | Transactional emails |
| Analytics | Cloudflare Analytics | Privacy-first analytics |

## 🚀 Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Generate content
node scripts/generate-content.js swankyboyz
```

### Database Management

```bash
# Create databases
npm run db:create

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed

# Query database
wrangler d1 execute swankyboyz-db --command="SELECT * FROM products"
```

### Deployment

```bash
# Deploy workers
npm run worker:deploy

# Build sites
npm run build

# Deploy sites
npm run deploy
```

## 📊 Free Tier Limits

| Service | Free Limit | Expected Usage |
|---------|------------|----------------|
| Pages | Unlimited | 3 sites |
| Workers | 100k req/day | ~10k/day |
| D1 Reads | Unlimited | ~50k/day |
| D1 Writes | 100k/day | ~1k/day |
| R2 Storage | 10 GB | ~2 GB |
| R2 Operations | 1M/month | ~100k/month |
| OpenAI | $5 credit | ~10k articles |
| Resend | 100 emails/day | ~5/day |

**Total Cost: ~$0-0.10/month**

## 🎯 Key Features

### Affiliate Management
- Multi-network support (ShareASale, CJ, Amazon, Booking, Agoda)
- Link cloaking (/go/ redirects)
- Click tracking with privacy compliance
- Commission rate tracking

### Content System
- AI-powered content generation
- Markdown/HTML support
- SEO optimization
- Schema markup for rich snippets

### Analytics
- Click tracking by product/article
- Geographic distribution
- Device type breakdown
- Revenue estimates

### Security
- GDPR compliant (IP hashing)
- Rate limiting
- SQL injection protection
- XSS prevention
- HTTPS only

## 📝 Next Steps

1. ✅ Review this structure
2. ✅ Follow DEPLOY.md for setup
3. ✅ Generate initial content
4. ✅ Add your affiliate IDs
5. ✅ Deploy to Cloudflare
6. ✅ Test everything
7. ✅ Go live!

## 🆘 Need Help?

- **Deployment issues?** See DEPLOY.md
- **Database questions?** Check database/schema.sql
- **Worker errors?** Review worker logs in Cloudflare dashboard
- **Content generation?** Run scripts/generate-content.js with --help

---

**Built for digital nomads and affiliate marketers 🚀**
