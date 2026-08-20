export function calculateSeoScore(html: string, keyword: string): number {
  if (!keyword || keyword.trim() === '' || keyword === 'Assign Keyword...') return 0;
  
  const text = html.replace(/<[^>]*>?/gm, ' ').toLowerCase();
  const kw = keyword.toLowerCase().trim();
  
  if (!text || !kw) return 0;

  let score = 0;
  
  // 1. Is keyword in an H1 tag? (30 points)
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi);
  if (h1Match && h1Match.some(h1 => h1.toLowerCase().includes(kw))) {
    score += 30;
  }

  // 2. Is keyword in an H2 tag? (20 points)
  const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
  if (h2Match && h2Match.some(h2 => h2.toLowerCase().includes(kw))) {
    score += 20;
  }

  // 3. Keyword Density in body (Up to 30 points)
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const kwCount = (text.match(new RegExp(kw, 'g')) || []).length;
  
  if (wordCount > 0) {
    const density = (kwCount / wordCount) * 100;
    // Ideal density is usually between 1% and 3%
    if (density > 0 && density <= 1) {
      score += 15;
    } else if (density > 1 && density <= 3) {
      score += 30;
    } else if (density > 3) {
      // Keyword stuffing penalty
      score += 10;
    }
  }

  // 4. Word Count (Up to 20 points)
  // Over 300 words gets 10 points, over 600 gets 20 points
  if (wordCount >= 600) {
    score += 20;
  } else if (wordCount >= 300) {
    score += 10;
  } else if (wordCount > 0) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}
