// Click Tracking Script
// Tracks affiliate link clicks and sends to API

(function() {
  // Track all affiliate link clicks
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('a[href^="/go/"]');
    if (!link) return;

    const productId = link.dataset.productId;
    const articleId = link.dataset.articleId;
    
    // Don't block navigation, track async
    try {
      // Use sendBeacon for reliability (doesn't block page unload)
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          productId: productId,
          articleId: articleId,
          timestamp: Date.now(),
          referrer: document.referrer,
          userAgent: navigator.userAgent
        });
        
        navigator.sendBeacon('/api/track-click', data);
      } else {
        // Fallback to fetch
        fetch('/api/track-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: productId,
            articleId: articleId,
            timestamp: Date.now()
          }),
          keepalive: true
        }).catch(() => {
          // Fail silently to not interfere with user experience
        });
      }
    } catch (error) {
      // Fail silently
      console.debug('Click tracking failed:', error);
    }
  });

  // Track page views
  if (window.location.pathname.startsWith('/articles/')) {
    const articleSlug = window.location.pathname.split('/').pop();
    
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: articleSlug,
        timestamp: Date.now()
      })
    }).catch(() => {});
  }
})();
