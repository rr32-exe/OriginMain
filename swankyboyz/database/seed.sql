-- Seed data for SwankyBoyz Affiliate System

-- Insert Categories
INSERT INTO categories (name, slug, description) VALUES
('Watches', 'watches', 'Luxury and affordable timepieces for the modern man'),
('Grooming', 'grooming', 'Premium grooming products and essentials'),
('Fashion', 'fashion', 'Stylish clothing and accessories'),
('Tech', 'tech', 'Latest gadgets and tech accessories'),
('Fitness', 'fitness', 'Fitness gear and health tracking devices'),
('Home Office', 'home-office', 'Premium office setup and productivity tools'),
('Fragrances', 'fragrances', 'Signature scents for every occasion'),
('Leather Goods', 'leather-goods', 'Quality leather wallets, bags, and accessories');

-- Insert Sample Products
INSERT INTO products (title, description, price, affiliate_url, affiliate_network, category, commission_rate, cookie_duration, image_url) VALUES
('Orient Bambino Automatic Watch', 'Classic dress watch with automatic movement, perfect for any occasion', 289.00, 'https://shareasale.com/r.cfm?b=123&u=YOURID&m=12345', 'shareasale', 'Watches', 15.00, 30, '/images/products/orient-bambino.jpg'),
('Seiko 5 Sports Watch', 'Automatic sports watch with 100m water resistance', 295.00, 'https://shareasale.com/r.cfm?b=124&u=YOURID&m=12345', 'shareasale', 'Watches', 15.00, 30, '/images/products/seiko-5.jpg'),
('Timex Weekender Chronograph', 'Affordable and versatile everyday watch', 89.00, 'https://amazon.com/dp/EXAMPLE?tag=YOURTAG', 'amazon', 'Watches', 8.00, 1, '/images/products/timex-weekender.jpg'),
('Philips Norelco Electric Shaver', 'Premium electric shaver with SkinComfort technology', 149.99, 'https://shareasale.com/r.cfm?b=125&u=YOURID&m=12346', 'shareasale', 'Grooming', 12.00, 30, '/images/products/philips-shaver.jpg'),
('Beard Growth Kit by Gentlemans Club', 'Complete beard care set with oil, balm, and brush', 39.99, 'https://cj.com/EXAMPLE', 'cj', 'Grooming', 18.00, 45, '/images/products/beard-kit.jpg'),
('Apple AirPods Pro', 'Premium noise-canceling earbuds', 249.00, 'https://amazon.com/dp/EXAMPLE?tag=YOURTAG', 'amazon', 'Tech', 3.00, 1, '/images/products/airpods-pro.jpg'),
('Sony WH-1000XM5 Headphones', 'Industry-leading noise cancellation', 399.00, 'https://shareasale.com/r.cfm?b=126&u=YOURID&m=12347', 'shareasale', 'Tech', 10.00, 30, '/images/products/sony-headphones.jpg'),
('Fitbit Charge 6', 'Advanced fitness tracker with heart rate monitoring', 159.95, 'https://amazon.com/dp/EXAMPLE?tag=YOURTAG', 'amazon', 'Fitness', 8.00, 1, '/images/products/fitbit-charge6.jpg'),
('Dior Sauvage Eau de Toilette', 'Classic masculine fragrance', 95.00, 'https://shareasale.com/r.cfm?b=127&u=YOURID&m=12348', 'shareasale', 'Fragrances', 15.00, 30, '/images/products/dior-sauvage.jpg'),
('Leather Bifold Wallet by Ridge', 'Minimalist RFID-blocking wallet', 75.00, 'https://cj.com/EXAMPLE2', 'cj', 'Leather Goods', 20.00, 60, '/images/products/ridge-wallet.jpg');

-- Insert Commission Rates
INSERT INTO commission_rates (network, category, rate, cookie_duration, notes) VALUES
('shareasale', 'Watches', 15.00, 30, 'Watch brands typically offer 12-20% commission'),
('shareasale', 'Grooming', 12.00, 30, 'Grooming products average 10-15%'),
('shareasale', 'Fashion', 10.00, 30, 'Fashion items standard commission'),
('shareasale', 'Tech', 10.00, 30, 'Tech accessories'),
('cj', 'Watches', 18.00, 45, 'CJ offers higher rates for luxury watches'),
('cj', 'Grooming', 15.00, 45, 'Premium grooming brands'),
('cj', 'Leather Goods', 20.00, 60, 'High-end leather goods'),
('amazon', 'Watches', 8.00, 1, 'Amazon standard watch category'),
('amazon', 'Tech', 3.00, 1, 'Amazon electronics category (lowest tier)'),
('amazon', 'Fitness', 8.00, 1, 'Amazon sports category'),
('impact', 'Fashion', 12.00, 30, 'Fashion brands on Impact'),
('awin', 'Fragrances', 15.00, 30, 'Perfume and cologne brands');

-- Insert Sample Article
INSERT INTO articles (
  slug, 
  title, 
  meta_description, 
  content, 
  category, 
  tags, 
  status, 
  publish_date,
  word_count,
  reading_time,
  seo_score
) VALUES (
  '15-affordable-luxury-watches-under-500',
  '15 Affordable Luxury Watches Under $500 That Look $5,000',
  'Discover the best affordable luxury watches that combine style, quality, and value. Expert reviews of watches under $500 that punch above their weight.',
  '<p>Looking for a watch that makes a statement without breaking the bank? You''re in the right place.</p><p>After testing 15 different timepieces under $500, the <a href="/go/orient-bambino" class="affiliate-link">Orient Bambino</a> consistently outperformed competitors in both style and reliability.</p><h2>What Makes a Great Affordable Watch?</h2><p>Content continues here...</p>',
  'Watches',
  '["watches","luxury watches","affordable watches","men''s style"]',
  'published',
  datetime('now'),
  2500,
  12,
  95
);

-- Link products to article
INSERT INTO article_products (article_id, product_id, position, context) VALUES
(1, 1, 1, 'After testing 15 different timepieces'),
(1, 2, 2, 'Another excellent option is the'),
(1, 3, 3, 'For those on a tighter budget');
