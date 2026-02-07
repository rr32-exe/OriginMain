// Content Generation Script
// Generates articles using OpenAI API

import 'dotenv/config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment variables');
  process.exit(1);
}

// Article titles from the README
const articleTopics = [
  {
    title: "15 Affordable Luxury Watches Under $500 That Look $5,000",
    category: "Watches",
    slug: "affordable-luxury-watches-under-500"
  },
  {
    title: "The Complete Men's Grooming Kit: 12 Essential Products",
    category: "Grooming",
    slug: "complete-mens-grooming-kit"
  },
  {
    title: "Best Tech Gadgets Every Modern Man Needs in 2025",
    category: "Tech",
    slug: "best-tech-gadgets-2025"
  },
  {
    title: "How to Build a Minimalist Wardrobe: 30 Pieces, Infinite Outfits",
    category: "Fashion",
    slug: "minimalist-wardrobe-guide"
  },
  {
    title: "Top 10 Fitness Trackers Compared: Which One Actually Works?",
    category: "Fitness",
    slug: "fitness-trackers-comparison"
  }
];

const systemPrompt = `You are a men's lifestyle expert writing for SwankyBoyz.com. 
Write in a sophisticated, knowledgeable tone. Focus on quality over quantity.
Include specific product recommendations naturally throughout the article.

Article Structure:
1. Engaging introduction (2-3 paragraphs)
2. 5-7 H2 sections with detailed content
3. Include specific product mentions in each section
4. Add comparison points where relevant
5. Strong conclusion with clear call-to-action

SEO Requirements:
- Use keywords naturally
- Include listicles and tables where appropriate
- Write 2000-2500 words
- Focus on buyer intent

Tone: Professional but approachable, like a knowledgeable friend giving advice`;

async function generateArticle(topic) {
  console.log(`\n📝 Generating: ${topic.title}...`);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cost-effective choice
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Write a comprehensive 2000-2500 word article about: ${topic.title}

Category: ${topic.category}

Make sure to:
- Start with a compelling hook
- Include 5-7 detailed sections
- Mention specific products naturally (use placeholder product names)
- Add actionable advice
- End with a strong conclusion and CTA

Format in HTML with proper heading tags (h2, h3, p, ul, etc).`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Generate meta description
    const metaResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Write a compelling meta description (max 155 characters) for this article title: ${topic.title}`
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const metaData = await metaResponse.json();
    const metaDescription = metaData.choices[0].message.content.replace(/['"]/g, '');

    // Calculate reading time (average 250 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 250);

    console.log(`✅ Generated ${wordCount} words (${readingTime} min read)`);
    console.log(`💰 Cost: ~$${(data.usage.total_tokens * 0.00015 / 1000).toFixed(4)}`);

    return {
      ...topic,
      content,
      metaDescription,
      wordCount,
      readingTime,
      tokens: data.usage
    };
  } catch (error) {
    console.error(`❌ Error generating article: ${error.message}`);
    return null;
  }
}

async function saveArticle(article) {
  const fs = await import('fs/promises');
  const path = await import('path');

  const articleContent = `---
title: "${article.title}"
slug: "${article.slug}"
description: "${article.metaDescription}"
category: "${article.category}"
publishDate: ${new Date().toISOString()}
author: "SwankyBoyz Team"
featured: true
tags: ${JSON.stringify([article.category.toLowerCase(), 'reviews', 'buying guide'])}
readingTime: ${article.readingTime}
---

import MainLayout from '../../layouts/MainLayout.astro';
import ProductCard from '../../components/ProductCard.astro';
import ComparisonTable from '../../components/ComparisonTable.astro';

<MainLayout title="${article.title}" description="${article.metaDescription}">
  <article class="max-w-4xl mx-auto prose prose-lg">
    ${article.content}
  </article>
</MainLayout>
`;

  const articlesDir = path.join(process.cwd(), 'src', 'pages', 'articles');
  await fs.mkdir(articlesDir, { recursive: true });

  const filePath = path.join(articlesDir, `${article.slug}.astro`);
  await fs.writeFile(filePath, articleContent);

  console.log(`💾 Saved to: ${filePath}`);
}

async function main() {
  console.log('🚀 SwankyBoyz Content Generator');
  console.log('================================\n');

  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'sk-proj-xxxxxxxxxxxxx') {
    console.log('⚠️  No valid OpenAI API key found.');
    console.log('📝 Creating article templates instead...\n');
    
    // Create template files without AI generation
    for (const topic of articleTopics.slice(0, 3)) {
      console.log(`📝 Creating template: ${topic.title}`);
      await saveArticle({
        ...topic,
        content: `<h2>Introduction</h2>
<p>Article content will be added here...</p>

<h2>Main Content</h2>
<p>Detailed information about ${topic.category.toLowerCase()} products...</p>

<h2>Conclusion</h2>
<p>Summary and call to action...</p>`,
        metaDescription: `Discover the best ${topic.category.toLowerCase()} products for men.`,
        wordCount: 0,
        readingTime: 10
      });
    }
    
    console.log('\n✅ Templates created! Add your API key to generate full articles.');
    return;
  }

  // Generate articles with AI
  let totalCost = 0;
  const generated = [];

  for (const topic of articleTopics) {
    const article = await generateArticle(topic);
    
    if (article) {
      await saveArticle(article);
      generated.push(article);
      totalCost += (article.tokens.total_tokens * 0.00015 / 1000);
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n================================');
  console.log(`✅ Generated ${generated.length} articles`);
  console.log(`💰 Total cost: ~$${totalCost.toFixed(4)}`);
  console.log(`📊 Total words: ${generated.reduce((sum, a) => sum + a.wordCount, 0)}`);
  console.log('\n🎉 Content generation complete!');
}

main().catch(console.error);
