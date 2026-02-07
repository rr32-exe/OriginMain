-- Seed data for SwankyBoyz.com
-- Sample products to get started

INSERT INTO products (title, description, price, affiliate_url, affiliate_network, category, site, commission_rate, cookie_duration, is_active) VALUES
('Orient Bambino Automatic Watch', 'Classic dress watch with automatic movement, sapphire crystal, and elegant design', 289.00, 'https://shareasale.com/r.cfm?b=XXXXXX&u=XXXXXX&m=XXXXXX', 'shareasale', 'watches', 'swankyboyz', 15.00, 30, 1),
('Leather Weekender Bag', 'Full-grain leather travel bag with brass hardware', 195.00, 'https://www.anrdoezrs.net/click-XXXXXX', 'cj', 'bags', 'swankyboyz', 12.00, 30, 1),
('Premium Grooming Kit', 'Complete grooming set with beard oil, trimmer, and care tools', 79.00, 'https://amazon.com/dp/XXXXXXX?tag=vaughnster-20', 'amazon', 'grooming', 'swankyboyz', 8.00, 1, 1),
('Noise-Cancelling Headphones', 'Studio-quality headphones with 30-hour battery life', 249.00, 'https://shareasale.com/r.cfm?b=XXXXXX&u=XXXXXX&m=XXXXXX', 'shareasale', 'tech', 'swankyboyz', 10.00, 30, 1),
('Minimalist Wallet', 'RFID-blocking slim wallet in genuine leather', 45.00, 'https://www.dpbolvw.net/click-XXXXXX', 'cj', 'accessories', 'swankyboyz', 15.00, 30, 1);

-- Sample article
INSERT INTO articles (site, slug, title, meta_description, content, category, status, publish_date, word_count, reading_time) VALUES
('swankyboyz', 'affordable-luxury-watches', '15 Affordable Luxury Watches Under $500 That Look $5,000', 'Discover the best luxury watches under $500 that rival timepieces 10x their price. Expert reviews and buying guide.', 
'<h1>15 Affordable Luxury Watches Under $500 That Look $5,000</h1>

<p>You don''t need to spend thousands to own a watch that commands attention. After testing over 50 timepieces in this price range, I''ve found watches that punch well above their weight class.</p>

<h2>Why These Watches Look Expensive</h2>

<p>The secret lies in three key factors: automatic movements (no batteries), quality materials (sapphire crystal, stainless steel), and timeless designs that mirror high-end brands.</p>

<h2>1. Orient Bambino - The Classic Choice</h2>

<p>The <a href="/go/orient-bambino" class="affiliate-link">Orient Bambino</a> is my top pick for anyone wanting a dress watch that looks like it costs $2,000+. With its domed crystal, Roman numerals, and in-house automatic movement, it''s the perfect first luxury watch.</p>

<div class="product-card">
  <h3>Orient Bambino Automatic Watch</h3>
  <p class="price">$289</p>
  <a href="/go/orient-bambino" class="btn-primary">Check Price →</a>
</div>

<h2>Key Features to Look For</h2>

<ul>
  <li>Automatic movement (no battery changes)</li>
  <li>Sapphire crystal (scratch-resistant)</li>
  <li>Stainless steel case</li>
  <li>Classic design (ages well)</li>
  <li>Reputable brand</li>
</ul>

<p><em>Note: This article contains affiliate links. If you make a purchase, I may earn a commission at no cost to you.</em></p>', 
'watches', 'published', datetime('now'), 2500, 10);
