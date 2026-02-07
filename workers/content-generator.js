/**
 * Content Generator Worker
 * Uses OpenAI GPT-4o-mini to generate article content
 * 
 * POST /api/generate-content
 * Body: { topic, site, category }
 */

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    try {
      const { topic, site, category } = await request.json();
      
      if (!topic || !site) {
        return new Response('Missing required fields', { status: 400 });
      }
      
      // Generate article using OpenAI
      const article = await generateArticle(topic, site, category, env);
      
      // Save to database
      const articleId = await saveArticle(article, site, env);
      
      return new Response(JSON.stringify({ success: true, articleId, article }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Generation error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

async function generateArticle(topic, site, category, env) {
  const systemPrompt = getSystemPrompt(site, category);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
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
          content: `Write a comprehensive 2000-2500 word article about: ${topic}\n\nFormat as HTML with proper heading tags (h2, h3) and paragraphs. Include natural product recommendations with [PRODUCT:id] placeholders.`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.choices[0].message.content;
  const usage = data.usage;
  
  // Generate meta description
  const metaDescription = await generateMetaDescription(content, env);
  
  // Extract title from content or use topic
  const title = extractTitle(content) || topic;
  
  // Generate slug from title
  const slug = generateSlug(title);
  
  // Calculate word count and reading time
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed
  
  return {
    title,
    slug,
    metaDescription,
    content,
    category,
    wordCount,
    readingTime,
    usage
  };
}

async function generateMetaDescription(content, env) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
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
  return data.choices[0].message.content.trim();
}

function getSystemPrompt(site, category) {
  const prompts = {
    swankyboyz: `You are a men's lifestyle expert writing for SwankyBoyz.com. 
    Write in a sophisticated, knowledgeable tone. Focus on quality over quantity.
    Include specific product recommendations naturally using [PRODUCT:id] placeholders.
    Structure: Intro (hook the reader), 5-7 H2 sections with practical advice, Conclusion with clear CTA.
    SEO: Use keywords naturally, write for humans first. Include comparison insights.
    Add affiliate disclosure at the end.`,
    
    tours: `You are Vaughn Sterling, documenting your journey from South Africa to Southeast Asia.
    Write authentically and vulnerably, with real numbers and experiences.
    Be motivational but realistic about challenges. Include budget breakdowns and practical tips.
    Use [PRODUCT:id] for hotel/gear recommendations.
    Tone: Inspiring underdog story with actionable advice.
    End with an encouraging message about taking action.`,
    
    vaughnsterling: `You are a professional consultant writing thought leadership content.
    Demonstrate expertise in AI automation, content generation, and niche site building.
    Provide actionable insights backed by real experience.
    End with clear CTA for services (but not pushy).
    Tone: Professional, authoritative, but approachable.`
  };
  
  return prompts[site] || prompts.swankyboyz;
}

function extractTitle(content) {
  const h1Match = content.match(/<h1>(.*?)<\/h1>/);
  return h1Match ? h1Match[1] : null;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

async function saveArticle(article, site, env) {
  const result = await env.DB.prepare(`
    INSERT INTO articles (
      site, slug, title, meta_description, content, category,
      status, publish_date, word_count, reading_time
    ) VALUES (?, ?, ?, ?, ?, ?, 'draft', datetime('now'), ?, ?)
  `).bind(
    site,
    article.slug,
    article.title,
    article.metaDescription,
    article.content,
    article.category,
    article.wordCount,
    article.readingTime
  ).run();
  
  // Log content generation for cost tracking
  if (article.usage) {
    await env.DB.prepare(`
      INSERT INTO content_log (article_id, prompt_tokens, completion_tokens, model)
      VALUES (?, ?, ?, 'gpt-4o-mini')
    `).bind(
      result.lastRowId,
      article.usage.prompt_tokens,
      article.usage.completion_tokens
    ).run();
  }
  
  return result.lastRowId;
}
