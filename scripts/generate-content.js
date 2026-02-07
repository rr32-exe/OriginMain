/**
 * Content Generation Script
 * Generates articles using OpenAI API
 * 
 * Usage: node scripts/generate-content.js [site]
 * Example: node scripts/generate-content.js swankyboyz
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ARTICLE_TOPICS = {
  swankyboyz: [
    "15 Affordable Luxury Watches Under $500 That Look $5,000",
    "The Complete Men's Grooming Kit: 12 Essential Products",
    "Best Tech Gadgets Every Modern Man Needs in 2025",
    "How to Build a Minimalist Wardrobe: 30 Pieces, Infinite Outfits",
    "Top 10 Fitness Trackers Compared: Which One Actually Works?",
    "Premium Leather Goods That Won't Break the Bank",
    "Best Noise-Cancelling Headphones for Under $300",
    "10 Subscription Boxes Worth Your Money (And 10 That Aren't)",
    "How to Upgrade Your Home Office Setup for Under $1,000",
    "Best Cologne for Men: 20 Fragrances by Occasion"
  ],
  
  tours: [
    "How I'm Escaping South Africa with R0 Savings (Month-by-Month Plan)",
    "Digital Nomad Visa Guide 2025: Every Country's Requirements",
    "Living in Chiang Mai on $500/Month: Complete Budget Breakdown",
    "Best Cities for Digital Nomads in Southeast Asia (Ranked)",
    "South African Expat Guide: Legal, Financial & Emotional Prep",
    "How to Make Your First $1,000 Online Before You Travel",
    "Budget Travel Hacking: How I Fly for 70% Less",
    "Essential Gear for Digital Nomads: My 40L Backpack Packing List",
    "Freelancing from Anywhere: 15 Skills You Can Monetize Today",
    "Vietnam vs Thailand vs Bali: Where Should You Go First?"
  ],
  
  personal: [
    "About Vaughn: From Broke in SA to Building Online",
    "Services: Custom AI-Powered Niche Sites",
    "Portfolio: Case Studies & Results",
    "Free Resources: Guides, Templates & Tools",
    "Contact: Let's Build Your Online Income"
  ]
};

async function generateContent(site) {
  console.log(`🚀 Starting content generation for: ${site}\n`);
  
  if (!ARTICLE_TOPICS[site]) {
    console.error(`❌ Unknown site: ${site}`);
    console.log(`Available sites: ${Object.keys(ARTICLE_TOPICS).join(', ')}`);
    process.exit(1);
  }
  
  const topics = ARTICLE_TOPICS[site];
  const results = [];
  
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`\n📝 Generating ${i + 1}/${topics.length}: ${topic}`);
    
    try {
      const article = await generateArticle(topic, site);
      results.push({
        success: true,
        topic,
        article
      });
      
      // Save to file
      const outputDir = path.join(__dirname, '../content', site);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const slug = generateSlug(topic);
      const filename = `${slug}.json`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(article, null, 2));
      
      console.log(`✅ Saved to: ${filepath}`);
      console.log(`   Words: ${article.wordCount}, Reading time: ${article.readingTime} min`);
      
      // Delay to respect rate limits
      if (i < topics.length - 1) {
        console.log('⏳ Waiting 3 seconds...');
        await sleep(3000);
      }
      
    } catch (error) {
      console.error(`❌ Failed to generate "${topic}":`, error.message);
      results.push({
        success: false,
        topic,
        error: error.message
      });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📁 Output directory: content/${site}/`);
  
  // Save summary
  const summaryPath = path.join(__dirname, '../content', site, '_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Full summary saved to: ${summaryPath}`);
}

async function generateArticle(topic, site) {
  const systemPrompt = getSystemPrompt(site);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Write a comprehensive 2000-2500 word article about: ${topic}\n\nFormat as HTML with proper heading tags (h2, h3) and paragraphs. Include natural product recommendations.`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  const content = data.choices[0].message.content;
  const usage = data.usage;
  
  // Generate meta description
  const metaDescription = await generateMetaDescription(content);
  
  // Extract title or use topic
  const title = extractTitle(content) || topic;
  const slug = generateSlug(title);
  
  // Calculate stats
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  // Calculate cost (GPT-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens)
  const cost = (usage.prompt_tokens * 0.15 / 1000000) + (usage.completion_tokens * 0.60 / 1000000);
  
  return {
    title,
    slug,
    metaDescription,
    content,
    wordCount,
    readingTime,
    usage,
    cost: cost.toFixed(4),
    generated_at: new Date().toISOString()
  };
}

async function generateMetaDescription(content) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Write a compelling 155-character meta description for this article:\n\n${content.substring(0, 500)}...`
        }
      ],
      max_tokens: 100
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content.trim().substring(0, 160);
}

function getSystemPrompt(site) {
  const prompts = {
    swankyboyz: `You are a men's lifestyle expert writing for SwankyBoyz.com. 
    Write in a sophisticated, knowledgeable tone. Focus on quality over quantity.
    Include specific product recommendations naturally.
    Structure: Engaging intro, 5-7 H2 sections with practical advice, Conclusion with clear CTA.
    SEO: Use keywords naturally. Add affiliate disclosure at the end.
    Write in HTML format with proper tags.`,
    
    tours: `You are Vaughn Sterling, documenting your journey from South Africa to Southeast Asia.
    Write authentically and vulnerably, with real numbers and experiences.
    Be motivational but realistic. Include budget breakdowns and practical tips.
    Tone: Inspiring underdog story with actionable advice.
    End with encouraging message about taking action.
    Write in HTML format with proper tags.`,
    
    personal: `You are a professional consultant writing thought leadership content.
    Demonstrate expertise in AI automation and niche site building.
    Provide actionable insights backed by experience.
    End with clear CTA for services (professional, not pushy).
    Tone: Professional, authoritative, approachable.
    Write in HTML format with proper tags.`
  };
  
  return prompts[site] || prompts.swankyboyz;
}

function extractTitle(content) {
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  return h1Match ? h1Match[1].replace(/<[^>]*>/g, '') : null;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run script
const site = process.argv[2];

if (!site) {
  console.error('❌ Please specify a site: swankyboyz, tours, or personal');
  console.log('\nUsage: node scripts/generate-content.js [site]');
  console.log('Example: node scripts/generate-content.js swankyboyz');
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment variables');
  console.log('Please add it to your .env file');
  process.exit(1);
}

generateContent(site)
  .then(() => {
    console.log('\n✨ Content generation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
