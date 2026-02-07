-- SwankyBoys Affiliate System Database Schema
-- Compatible with Cloudflare D1 (SQLite)

-- Products Table (for SwankyBoyz + VaughnSterlingTours)
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  affiliate_url TEXT NOT NULL,
  affiliate_network VARCHAR(50), -- 'shareasale', 'cj', 'amazon', 'booking', 'agoda'
  merchant_id VARCHAR(100),
  image_url TEXT,
  category VARCHAR(100),
  site VARCHAR(50), -- 'swankyboyz' or 'tours'
  commission_rate DECIMAL(5,2),
  cookie_duration INTEGER, -- days
  is_active BOOLEAN DEFAULT 1,
  last_price_check DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_site ON products(site);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- Articles Table (All Sites)
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site VARCHAR(50) NOT NULL, -- 'swankyboyz', 'tours', 'vaughnsterling'
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description VARCHAR(160),
  content TEXT NOT NULL,
  featured_image TEXT,
  category VARCHAR(100),
  tags TEXT, -- JSON array
  author VARCHAR(100) DEFAULT 'Vaughn Sterling',
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, scheduled
  publish_date DATETIME,
  seo_score INTEGER, -- 0-100
  word_count INTEGER,
  reading_time INTEGER, -- minutes
  views INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_site ON articles(site);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_publish_date ON articles(publish_date);

-- Article-Product Junction (for affiliate links in articles)
CREATE TABLE IF NOT EXISTS article_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  position INTEGER, -- where in article
  context TEXT, -- surrounding text for natural placement
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_article_products_article ON article_products(article_id);
CREATE INDEX idx_article_products_product ON article_products(product_id);

-- Click Tracking (Critical for Revenue Analytics)
CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  article_id INTEGER,
  ip_hash VARCHAR(64), -- SHA256 hashed for privacy
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(2),
  device VARCHAR(20), -- mobile, desktop, tablet
  clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL
);

CREATE INDEX idx_clicks_product ON clicks(product_id);
CREATE INDEX idx_clicks_article ON clicks(article_id);
CREATE INDEX idx_clicks_date ON clicks(clicked_at);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  site VARCHAR(50), -- which site they signed up from
  status VARCHAR(20) DEFAULT 'active', -- active, unsubscribed, bounced
  source_article INTEGER, -- which article they found
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME,
  last_email_sent DATETIME,
  FOREIGN KEY (source_article) REFERENCES articles(id) ON DELETE SET NULL
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);

-- Service Inquiries (VaughnSterling.com)
CREATE TABLE IF NOT EXISTS service_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  service VARCHAR(100), -- 'niche-site', 'articles', 'automation', 'consulting'
  message TEXT,
  budget VARCHAR(50),
  timeline VARCHAR(50),
  status VARCHAR(20) DEFAULT 'new', -- new, contacted, qualified, converted, lost
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inquiries_status ON service_inquiries(status);
CREATE INDEX idx_inquiries_created ON service_inquiries(created_at);

-- Content Generation Log (Track AI usage & costs)
CREATE TABLE IF NOT EXISTS content_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_cost DECIMAL(10,4),
  model VARCHAR(50),
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL
);

CREATE INDEX idx_content_log_article ON content_log(article_id);

-- Analytics Summary (Daily rollup)
CREATE TABLE IF NOT EXISTS analytics_daily (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site VARCHAR(50),
  date DATE,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  estimated_revenue DECIMAL(10,2) DEFAULT 0,
  new_subscribers INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_time_on_site INTEGER, -- seconds
  UNIQUE(site, date)
);

CREATE INDEX idx_analytics_site_date ON analytics_daily(site, date);
