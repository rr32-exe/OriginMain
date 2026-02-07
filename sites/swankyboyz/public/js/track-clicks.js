// Click tracking for affiliate links
document.addEventListener('DOMContentLoaded', () => {
  // Track clicks on affiliate links
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('a[href^="/go/"]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    const productId = href.replace('/go/', '');
    
    // Get article ID from page (if on article page)
    const articleId = document.body.dataset.articleId || null;
    
    try {
      // Track click (don't wait for response)
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          articleId,
          timestamp: Date.now()
        })
      }).catch(() => {
        // Silently fail - tracking shouldn't break user experience
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  });
  
  // Newsletter signup
  const newsletterForm = document.querySelector('form[action="/api/newsletter"]');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = newsletterForm.querySelector('input[type="email"]').value;
      const button = newsletterForm.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      
      button.textContent = 'Subscribing...';
      button.disabled = true;
      
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, site: 'swankyboyz' })
        });
        
        if (response.ok) {
          button.textContent = '✓ Subscribed!';
          button.classList.add('bg-green-600');
          newsletterForm.querySelector('input[type="email"]').value = '';
        } else {
          throw new Error('Subscription failed');
        }
      } catch (error) {
        button.textContent = 'Try Again';
        button.disabled = false;
        alert('Subscription failed. Please try again.');
      }
    });
  }
});
