/** Deterministic, local KORA skill routing. This is not an ML model. */
export const MAX_SKILLS = 2;

export function normalizeRouteText(text) {
  return String(text ?? '')
    .toLocaleLowerCase('pt-BR')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function routeKoraRequest(text, routes) {
  if (typeof text !== 'string' || !text.trim()) {
    return { domains: [], skills: [], confidence: 0, scores: {}, reason: 'empty' };
  }
  if (!Array.isArray(routes)) throw new TypeError('Route registry must be an array');
  const normalized = ' ' + normalizeRouteText(text) + ' ';
  const words = new Set(normalized.trim().split(/\s+/).filter(Boolean));
  const scored = [];

  for (const item of routes) {
    if (!item || !/^[a-z0-9-]+$/.test(item.domain ?? '')
        || !/^kora-[a-z0-9-]+$/.test(item.skill ?? '')
        || !Array.isArray(item.phrases) || !Array.isArray(item.keywords)) {
      throw new TypeError('Invalid route registry record');
    }
    const phrases = new Set(item.phrases.map(normalizeRouteText));
    let phraseCount = 0;
    for (const phrase of phrases) {
      if (phrase && normalized.includes(' ' + phrase + ' ')) phraseCount += 1;
    }
    const keywordSet = new Set(item.keywords.map(normalizeRouteText));
    let keywordCount = 0;
    for (const word of words) if (keywordSet.has(word)) keywordCount += 1;
    const score = phraseCount * 3 + keywordCount;
    if (score) scored.push({ score, domain: item.domain, skill: item.skill });
  }

  scored.sort((a, b) => b.score - a.score || a.domain.localeCompare(b.domain, 'en'));
  if (!scored.length || scored[0].score < 2) {
    return {
      domains: [], skills: [], confidence: 0,
      scores: Object.fromEntries(scored.map(({ domain, score }) => [domain, score])),
      reason: scored.length ? 'below_threshold' : 'no_cue',
    };
  }

  const selected = [scored[0]];
  const second = scored[1];
  if (second && second.score >= 2 && second.score >= scored[0].score * 0.55) {
    selected.push(second);
  }
  const topScore = selected[0].score;
  const secondScore = selected[1]?.score ?? 0;
  const confidence = Math.round(Math.min(0.98, topScore / (topScore + secondScore + 2)) * 100) / 100;
  return {
    domains: selected.slice(0, MAX_SKILLS).map(item => item.domain),
    skills: selected.slice(0, MAX_SKILLS).map(item => item.skill),
    confidence,
    scores: Object.fromEntries(scored.map(({ domain, score }) => [domain, score])),
    reason: selected.length > 1 ? 'mixed_domains' : 'lexical_match',
  };
}
