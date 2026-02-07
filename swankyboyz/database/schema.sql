-- SwankyBoyz Affiliate System Database Schema
-- For Cloudflare D1 (SQLite)

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  affiliate_url TEXT NOT NULL,
  affiliate_network VARCHAR(50), -- 'shareasale', 'cj', 'amazon', 'impact', 'awin'
  merchant_id VARCHAR(100),
  image_url TEXT,
  category VARCHAR(100),
  site VARCHAR(50) DEFAULT 'swankyboyz',
  commission_rate DECIMAL(5,2),
  cookie_duration INTEGER, -- days
  is_active BOOLEAN DEFAULT 1,
  last_price_check DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  parent_id INTEGER,
  site VARCHAR(50) DEFAULT 'swankyboyz',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site VARCHAR(50) NOT NULL DEFAULT 'swankyboyz',
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description VARCHAR(160),
  content TEXT NOT NULL,
  featured_image TEXT,
  category VARCHAR(100),
  tags TEXT, -- JSON array
  author VARCHAR(100) DEFAULT 'SwankyBoyz Team',
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, scheduled
  publish_date DATETIME,
  seo_score INTEGER, -- 0-100
  word_count INTEGER,
  reading_time INTEGER, -- minutes
  views INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Article-Product Junction (for affiliate links in articles)
CREATE TABLE IF NOT EXISTS article_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  position INTEGER, -- where in article
  context TEXT, -- surrounding text for natural placement
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

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
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- Commission Rates Table
CREATE TABLE IF NOT EXISTS commission_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  network VARCHAR(50) NOT NULL,
  merchant_id VARCHAR(100),
  category VARCHAR(100),
  rate DECIMAL(5,2) NOT NULL,
  cookie_duration INTEGER, -- days
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  site VARCHAR(50) DEFAULT 'swankyboyz',
  status VARCHAR(20) DEFAULT 'active', -- active, unsubscribed, bounced
  source_article INTEGER,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME,
  last_email_sent DATETIME,
  FOREIGN KEY (source_article) REFERENCES articles(id)
);

-- Service Inquiries (for contact form)
CREATE TABLE IF NOT EXISTS service_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  service VARCHAR(100),
  message TEXT,
  budget VARCHAR(50),
  timeline VARCHAR(50),
  status VARCHAR(20) DEFAULT 'new', -- new, contacted, qualified, converted, lost
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content Generation Log (Track AI usage & costs)
CREATE TABLE IF NOT EXISTS content_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_cost DECIMAL(10,4),
  model VARCHAR(50),
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- Analytics Summary (Daily rollup)
CREATE TABLE IF NOT EXISTS analytics_daily (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site VARCHAR(50) DEFAULT 'swankyboyz',
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  estimated_revenue DECIMAL(10,2) DEFAULT 0,
  new_subscribers INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_time_on_site INTEGER, -- seconds
  UNIQUE(site, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_network ON products(affiliate_network);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date);
CREATE INDEX IF NOT EXISTS idx_clicks_product ON clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_clicks_article ON clicks(article_id);
CREATE INDEX IF NOT EXISTS idx_clicks_date ON clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_daily(date);
