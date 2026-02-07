# ⚡ Quick Start Guide for Limited Internet Access

## 🎯 Your Situation
You have limited internet access and need to deploy this efficiently at an internet café. This guide is optimized for your scenario.

---

## 📦 Before You Go to the Café

### At Home (Prep Work - 30 minutes)

1. **Create Accounts** (you can do this on mobile data):
   - Cloudflare account: https://dash.cloudflare.com/sign-up
   - GitHub account: https://github.com/join
   - OpenAI (optional): https://platform.openai.com/signup

2. **Add Your Domain to Cloudflare**:
   - Go to Cloudflare Dashboard
   - Click "Add a Site"
   - Enter: swankyboyz.com
   - Update nameservers at your domain registrar
   - Wait for activation (can take 24 hours)

3. **Prepare These on Paper**:
   ```
   Cloudflare Email: __________________
   Cloudflare Password: __________________
   Your Domain: swankyboyz.com (or your actual domain)
   GitHub Username: __________________
   GitHub Password: __________________
   ```

4. **Download This Project**:
   - If you have GitHub access, fork this repo
   - Or download as ZIP to USB drive

---

## ☕ At the Internet Café (4-6 Hours Total)

### Hour 1: Setup (60 min)

**Step 1: Extract and Install** (15 min)
```bash
# Plug in USB, copy to Desktop
cd ~/Desktop
# If you have the ZIP:
unzip OriginMain.zip
cd OriginMain/swankyboyz

# Install Node.js if not present
# Check version:
node --version  # Should be v18+

# Install dependencies
npm install
```

**Step 2: Login to Cloudflare** (10 min)
```bash
# Install Wrangler globally
npm install -g wrangler

# Login (will open browser)
wrangler login
# Sign in with your Cloudflare account
```

**Step 3: Create Database** (15 min)
```bash
# Create D1 database
wrangler d1 create swankyboyz-db

# IMPORTANT: Copy the database_id from output
# Example: database_id = "abc123-def456-ghi789"

# Edit wrangler.toml
nano wrangler.toml
# Find: database_id = "YOUR_DATABASE_ID_HERE"
# Replace with your actual database_id
# Save: Ctrl+O, Enter, Ctrl+X
```

**Step 4: Setup Database** (20 min)
```bash
# Create tables
wrangler d1 execute swankyboyz-db --file=./database/schema.sql

# Add sample data
wrangler d1 execute swankyboyz-db --file=./database/seed.sql

# Verify it worked
wrangler d1 execute swankyboyz-db --command="SELECT COUNT(*) FROM products"
# Should show: count = 10
```

---

### Hour 2: Test Locally (30 min)

```bash
# Build the site
npm run build

# Test locally
npm run dev
```

Open browser: http://localhost:4321

**Check These**:
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Product cards display
- [ ] Footer shows correctly
- [ ] Mobile view (resize browser to 375px width)

Press Ctrl+C to stop local server when done.

---

### Hour 3: Deploy (60 min)

**Step 1: Deploy Frontend** (20 min)
```bash
# Make sure you're in the swankyboyz directory
pwd  # Should show: .../swankyboyz

# Build for production
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy ./dist --project-name=swankyboyz

# Wait for deployment (2-3 minutes)
# Note the URL shown, example: https://swankyboyz.pages.dev
```

**Step 2: Deploy Worker** (10 min)
```bash
# Deploy the redirect handler
cd workers
wrangler deploy
cd ..

# Note: This handles the /go/* links
```

**Step 3: Configure Custom Domain** (30 min)
1. Go to: https://dash.cloudflare.com
2. Click on "Workers & Pages"
3. Find "swankyboyz" project
4. Click "Custom Domains" tab
5. Click "Set up a custom domain"
6. Enter: swankyboyz.com
7. Click "Activate domain"
8. Wait 5-10 minutes for SSL

**Visit Your Live Site!**
Open: https://swankyboyz.com (or your domain)

---

### Hour 4: Add Content (60 min)

**Option A: Manual Content** (Recommended First)

Add your first products:
```bash
# Add a product
wrangler d1 execute swankyboyz-db --command="
INSERT INTO products (title, description, price, affiliate_url, affiliate_network, category, commission_rate, cookie_duration, image_url) 
VALUES (
  'Your Product Name',
  'Product description here',
  99.99,
  'https://shareasale.com/r.cfm?b=YOUR_LINK',
  'shareasale',
  'Watches',
  15.00,
  30,
  '/images/products/product.jpg'
)
"

# Verify it was added
wrangler d1 execute swankyboyz-db --command="SELECT title FROM products ORDER BY id DESC LIMIT 5"
```

**Option B: Generate with AI** (If you have OpenAI key)
```bash
# Add your OpenAI key to .env
echo "OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE" > .env

# Generate 5 articles
npm run generate:articles

# This will cost about $0.02 (2 cents)
```

---

### Hour 5: Configure Affiliate Links (30 min)

**Step 1: Get Your Affiliate IDs**
- ShareASale: shareasale.com → Account → Affiliate ID
- CJ Affiliate: cj.com → Account Settings
- Amazon: affiliate-program.amazon.com → Your Tag

**Step 2: Update Products**
```bash
# Update ShareASale links
wrangler d1 execute swankyboyz-db --command="
UPDATE products 
SET affiliate_url = REPLACE(affiliate_url, 'YOURID', 'YOUR_ACTUAL_ID')
WHERE affiliate_network = 'shareasale'
"

# Update Amazon links
wrangler d1 execute swankyboyz-db --command="
UPDATE products 
SET affiliate_url = REPLACE(affiliate_url, 'YOURTAG', 'yourusername-20')
WHERE affiliate_network = 'amazon'
"

# Test a redirect
curl -I https://swankyboyz.com/go/1
# Should show: 301 redirect
```

---

### Hour 6: Final Checks (30 min)

**Test Everything**:
- [ ] Visit your site on desktop
- [ ] Visit on your phone (use café WiFi)
- [ ] Click an affiliate link (should redirect)
- [ ] Check database for click tracking:
  ```bash
  wrangler d1 execute swankyboyz-db --command="SELECT COUNT(*) FROM clicks"
  ```
- [ ] Subscribe to newsletter (test form)

**Set Up Analytics**:
1. Go to Cloudflare Dashboard
2. Navigate to your site
3. Click "Web Analytics"
4. Copy the analytics token
5. Add to your site (optional, can do later)

**Submit to Google**:
1. Go to: search.google.com/search-console
2. Add property: swankyboyz.com
3. Verify ownership (DNS method)
4. Submit sitemap: swankyboyz.com/sitemap.xml

---

## 📝 What to Write Down Before Leaving

On paper, note these for future updates:

```
Database ID: _______________________________
Project URL: https://swankyboyz.pages.dev
Custom Domain: swankyboyz.com
Deployment Date: _______________________________

Affiliate IDs Added:
- ShareASale: _______________________________
- CJ Affiliate: _______________________________
- Amazon: _______________________________

Products Added: _____ total

Notes:
_____________________________________________
_____________________________________________
```

---

## 🚨 If Something Goes Wrong

### Can't Login to Cloudflare
```bash
# Logout and try again
wrangler logout
wrangler login
```

### Build Fails
```bash
# Clear everything and reinstall
rm -rf node_modules dist .astro
npm install
npm run build
```

### Database Won't Create
```bash
# Check you're logged in
wrangler whoami

# Try with different name
wrangler d1 create swankyboyz-db-2
```

### Site Won't Load
- Wait 10 minutes (DNS propagation)
- Check: dnschecker.org
- Verify SSL is active in Cloudflare Dashboard

### Worker Not Working
```bash
# Redeploy worker
cd workers
wrangler deploy --force
```

---

## 💾 Save for Next Time

Before you leave the café, save these files to USB:

```bash
# Create a backup folder
mkdir ~/Desktop/swankyboyz-backup

# Copy important files
cp wrangler.toml ~/Desktop/swankyboyz-backup/
cp .env ~/Desktop/swankyboyz-backup/
cp -r database ~/Desktop/swankyboyz-backup/

# Note: Don't upload .env to GitHub!
```

---

## 📱 Managing Remotely (After Deployment)

You can manage your site with limited internet:

**Add Products via Phone**:
```bash
# SSH into a server or use Cloudflare Dashboard
# Use SQL commands to add products
```

**Check Analytics**:
- Visit: dash.cloudflare.com/analytics
- View on mobile browser
- Takes <1MB of data

**Update Content**:
- Can do at next café visit
- Or use GitHub web editor on mobile

---

## 🎯 Success Checklist

Before leaving the café, verify:

- [ ] Site loads at your domain
- [ ] At least 5 products added
- [ ] Affiliate links work (tested /go/1)
- [ ] Mobile responsive (checked on phone)
- [ ] Database has data
- [ ] Analytics set up
- [ ] Wrote down important info on paper
- [ ] Backed up files to USB

---

## 💡 Tips for Your Situation

1. **Batch Updates**: When you have internet, add 10-20 products at once
2. **Use Mobile**: Check analytics and basic updates on your phone
3. **Offline Content**: Write articles offline, add when online
4. **GitHub Mobile**: Can edit files via github.com on phone
5. **Low Data Mode**: Analytics Dashboard works on slow connections

---

## 📞 Emergency Contacts

If stuck:
- Cloudflare Community: community.cloudflare.com
- GitHub Issues: github.com/rr32-exe/OriginMain/issues
- Wrangler Docs: developers.cloudflare.com/workers/wrangler

---

## 🎉 You Did It!

After these 6 hours, you'll have:
- ✅ Live affiliate website
- ✅ Database with products
- ✅ Click tracking working
- ✅ Ready to earn commissions
- ✅ Zero monthly costs

**Next visit**: Add more content and check analytics!

**Good luck! 🚀**
