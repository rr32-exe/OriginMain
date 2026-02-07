-- Seed data for VaughnSterlingTours.com
-- Sample travel products and articles

INSERT INTO products (title, description, price, affiliate_url, affiliate_network, category, site, commission_rate, cookie_duration, is_active) VALUES
('Chiang Mai Boutique Hotel', 'Modern accommodation in Old City with rooftop pool', 45.00, 'https://www.booking.com/hotel/th/chiang-mai-boutique.html?aid=XXXXXX', 'booking', 'accommodation', 'tours', 4.00, 30, 1),
('Bangkok to Chiang Mai Flight', 'Direct flights with Thai Airways', 85.00, 'https://www.agoda.com/flights?cid=XXXXXX', 'agoda', 'flights', 'tours', 5.00, 7, 1),
('Digital Nomad Backpack', '40L carry-on with laptop compartment', 129.00, 'https://amazon.com/dp/XXXXXXX?tag=vaughnster-20', 'amazon', 'gear', 'tours', 8.00, 1, 1),
('Travel Insurance Annual', 'Comprehensive coverage for digital nomads', 399.00, 'https://www.dpbolvw.net/click-XXXXXX', 'cj', 'insurance', 'tours', 10.00, 30, 1),
('Portable Power Bank', '20,000mAh fast charging for all devices', 49.00, 'https://amazon.com/dp/XXXXXXX?tag=vaughnster-20', 'amazon', 'gear', 'tours', 8.00, 1, 1);

-- Sample article
INSERT INTO articles (site, slug, title, meta_description, content, category, status, publish_date, word_count, reading_time) VALUES
('tours', 'chiang-mai-500-month', 'Living in Chiang Mai on $500/Month: Complete Budget Breakdown', 'Real numbers from 6 months in Chiang Mai. Rent, food, transportation, and entertainment costs for digital nomads in 2025.', 
'<h1>Living in Chiang Mai on $500/Month: Complete Budget Breakdown</h1>

<p>After 6 months in Chiang Mai, I''ve proven you can live comfortably on $500/month. Here''s exactly where every dollar goes.</p>

<h2>Monthly Budget Breakdown</h2>

<table class="budget-table">
  <tr><td>Accommodation</td><td>$200</td></tr>
  <tr><td>Food</td><td>$150</td></tr>
  <tr><td>Transportation</td><td>$30</td></tr>
  <tr><td>Entertainment</td><td>$50</td></tr>
  <tr><td>Utilities & Internet</td><td>$40</td></tr>
  <tr><td>Miscellaneous</td><td>$30</td></tr>
  <tr><td><strong>Total</strong></td><td><strong>$500</strong></td></tr>
</table>

<h2>Accommodation: $200/month</h2>

<p>I''m staying at a <a href="/go/chiang-mai-studio" class="affiliate-link">modern studio in Nimman</a> for $200/month. It includes WiFi, air conditioning, and weekly cleaning. Pro tip: book directly with landlords on Facebook groups for better rates.</p>

<h2>Where to Stay in Chiang Mai</h2>

<p>For short-term stays, I recommend <a href="/go/chiang-mai-hotel" class="affiliate-link">boutique hotels in Old City</a>. They average $15-25/night and let you explore before committing to a long-term rental.</p>

<div class="cta-box">
  <h3>Ready to Move to Chiang Mai?</h3>
  <p>Download my free guide with accommodation listings, visa info, and cost-saving tips.</p>
  <a href="/resources/chiang-mai-guide" class="btn-large">Get Free Guide →</a>
</div>

<p><em>Disclosure: This post contains affiliate links for accommodations. I earn a small commission if you book, at no cost to you.</em></p>', 
'budget-living', 'published', datetime('now'), 2200, 9);
