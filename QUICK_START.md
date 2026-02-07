# 🚀 Quick Start Guide

Get the SwankyBoys Affiliate System running locally in 15 minutes.

## Prerequisites

- Node.js 18+ installed
- Text editor (VS Code recommended)
- Terminal/command line access

## 1. Installation (5 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/swankyboys-affiliate-system.git
cd swankyboys-affiliate-system

# Install dependencies
npm install

# Install Wrangler CLI globally
npm install -g wrangler@latest

# Security check
npm audit
```

**Important:** If `npm audit` shows vulnerabilities, run `npm audit fix` before proceeding.

## 2. Environment Setup (3 minutes)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your favorite editor
nano .env  # or code .env
```

**Minimum required for local development:**
```env
OPENAI_API_KEY=sk-proj-xxxxx  # Get from platform.openai.com
```

**Optional (for full functionality):**
- CLOUDFLARE_ACCOUNT_ID
- RESEND_API_KEY (for contact forms)
- Affiliate network IDs

## 3. Database Setup (2 minutes)

For local development, we'll use local D1:

```bash
# Create local database
wrangler d1 create swankyboyz-db --local

# Run migrations
wrangler d1 execute swankyboyz-db --local --file=./database/schema.sql

# Seed with sample data
wrangler d1 execute swankyboyz-db --local --file=./database/seed-swankyboyz.sql
```

## 4. Start Development Server (1 minute)

```bash
# Start the SwankyBoyz site
cd sites/swankyboyz
npm install
npm run dev
```

Open http://localhost:4321 in your browser!

## 5. Test Workers Locally (4 minutes)

In a new terminal:

```bash
# Terminal 1: Link redirect worker
wrangler dev workers/link-redirect.js --local

# Terminal 2: Click tracker
wrangler dev workers/click-tracker.js --local --port 8788

# Terminal 3: Content generator
wrangler dev workers/content-generator.js --local --port 8789
```

---

## Quick Commands Reference

### Development

```bash
# Start site dev server
npm run dev

# Start all workers
npm run worker:dev

# Generate content
node scripts/generate-content.js swankyboyz
```

### Database

```bash
# Query database
wrangler d1 execute swankyboyz-db --local --command="SELECT * FROM products"

# Add new product
wrangler d1 execute swankyboyz-db --local --command="INSERT INTO products (title, price, affiliate_url, site) VALUES ('Test Product', 99.99, 'https://example.com', 'swankyboyz')"
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Next Steps

1. ✅ **Customize branding** - Edit colors, fonts, logo in `sites/swankyboyz/src/layouts/BaseLayout.astro`

2. ✅ **Add products** - Insert into database or create admin panel

3. ✅ **Generate content** - Run `node scripts/generate-content.js swankyboyz`

4. ✅ **Deploy** - Follow DEPLOY.md for full deployment guide

---

## Common Issues

**"Node not found"**
```bash
# Install Node.js from nodejs.org
# Verify: node --version (should be 18+)
```

**"wrangler not found"**
```bash
npm install -g wrangler@latest
```

**"Database not found"**
```bash
# Make sure you created local database
wrangler d1 list --local
```

**"Port already in use"**
```bash
# Change port in package.json
"dev": "astro dev --port 3001"
```

---

## File Structure Overview

```
swankyboys-affiliate-system/
├── database/          # Database schemas
├── workers/           # Cloudflare Workers
├── scripts/           # Utility scripts
├── sites/
│   └── swankyboyz/   # Main site
│       ├── src/
│       │   ├── layouts/      # Page templates
│       │   ├── pages/        # Routes
│       │   └── components/   # Reusable components
│       └── public/           # Static files
├── DEPLOY.md          # Full deployment guide
├── QUICK_START.md     # This file
└── README.md          # Project overview
```

---

## Development Workflow

1. **Make changes** to files in `sites/swankyboyz/src/`
2. **Auto-reload** happens instantly
3. **Test locally** at http://localhost:4321
4. **Build** with `npm run build`
5. **Deploy** when ready

---

## Getting Help

- 📖 **Full docs**: See DEPLOY.md
- 🐛 **Issues**: Check TROUBLESHOOTING.md
- 💬 **Questions**: Open GitHub issue

---

**You're ready to build! 🎉**

Start editing `sites/swankyboyz/src/pages/index.astro` and see changes instantly!
