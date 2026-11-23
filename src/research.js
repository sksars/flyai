/**
 * AirAI Client-Side Browser Research Module
 * Performs high-accuracy, context-dependent client-side research using
 * CORS-enabled Wikipedia Search/Summary/Extracts/Langlinks APIs and Dictionary API.
 */

const WIKI_LANG_MAP = {
  en: 'en',
  hi: 'hi',
  hinglish: 'en',
  es: 'es',
  fr: 'fr',
  ar: 'ar',
};

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'is', 'are', 'was', 'were',
  'by', 'from', 'with', 'about', 'what', 'who', 'where', 'when', 'why', 'how', 'which', 'did', 'does',
  'it', 'its', 'this', 'that', 'he', 'him', 'his', 'she', 'her', 'they', 'their', 'them', 'there',
  'ka', 'ki', 'ke', 'ko', 'me', 'mein', 'se', 'par', 'hai', 'hain', 'ho', 'hota', 'hoti',
  'kya', 'kaun', 'kon', 'kahan', 'kab', 'kaise', 'batao', 'bataiye', 'bare', 'baare',
  'uska', 'uski', 'uske', 'iska', 'iski', 'iske', 'unke', 'unka', 'unki', 'wo', 'woh', 'yeh', 'wahan',
]);

const HINGLISH_TO_EN_HINTS = {
  kisne: 'built founded created invented author',
  banaya: 'built constructed designed created',
  banya: 'built constructed',
  kab: 'year date built born founded established',
  bana: 'built completed constructed established',
  kahan: 'located location city country place',
  sthit: 'located situated',
  janam: 'born birth',
  mrityu: 'died death',
  maut: 'died death',
  fayde: 'benefits uses advantages',
  nuksan: 'disadvantages risks side effects',
  itihas: 'history background origin',
  rajdhani: 'capital',
  bhasha: 'language',
  unchai: 'height metres feet',
  lamba: 'length',
  kimat: 'cost price',
  karna: 'purpose function',
};

/**
 * Clean conversational filler from a user query to extract core search keywords.
 * @param {string} raw
 * @returns {string}
 */
export function extractSearchQuery(raw) {
  let q = raw.trim();

  const prefixes = [
    /^(?:please\s+)?(?:research|search|google|wikipedia|wiki|lookup|look up|find out|find|learn about|learn)\s+(?:from browser\s+)?(?:about|for|on)?\s*/i,
    /^(?:can you\s+|please\s+)?(?:tell me about|explain to me|explain|describe|define|meaning of|definition of)\s+/i,
    /^(?:what is|what are|who is|who are|who was|where is|when was|how does)\s+(?:the\s+)?/i,
    /^(?:browser se\s+)?(?:mujhe\s+)?(?:khojo|search karo|sikho|seekho|batao|bataiye|batayein|samjhao)\s+/i,
    /^(?:busca|investiga|qué es|quién es)\s+/i,
    /^(?:recherche|cherche|qu'est-ce que|qui est)\s+/i,
    /^(?:ابحث عن|ما هو|من هو)\s+/i,
  ];

  for (const rx of prefixes) {
    q = q.replace(rx, '');
  }

  const suffixes = [
    /\s+(?:from browser|in hindi|in english|in simple words|in detail|in short|please)$/i,
    /\s+(?:browser se sikho|browser se seekho|ke bare mein|ke baare mein|ke bare me|ke baare me|kya hota hai|kya hoti hai|kya hai|kya h|kaun hai|kaun hain|kon hai|kon h|kahan hai|kahan sthit hai|ka matlab|batao|bataiye|batayein|samjhao|dikhao|sikho|seekho)$/i,
    /\s+(?:के बारे में बताओ|के बारे में बताइए|के बारे में|क्या होता है|क्या होती है|क्या है|कौन है|कौन हैं|कहाँ है|कहाँ स्थित है|बताओ|बताइए|समझाओ|सीखो)$/i,
  ];

  for (let pass = 0; pass < 2; pass++) {
    for (const rx of suffixes) {
      q = q.replace(rx, '');
    }
    q = q.replace(/[?!.؟।]+$/g, '').trim();
  }

  return q || raw.trim();
}

/**
 * Determine whether the user explicitly asked for web/browser research or learning.
 * @param {string} text
 * @returns {boolean}
 */
export function isExplicitResearchRequest(text) {
  return /\b(research|search|google|wikipedia|wiki|lookup|look up|web search|search karo|khojo|learn about|sikho|seekho|browser se|investiga|recherche)\b|खोजो|सर्च|रिसर्च|सीखो|ابحث/i.test(
    text
  );
}

/**
 * Clean Wikipedia extract artifacts (citations, IPA brackets) so replies read and speak naturally.
 * @param {string} text
 * @returns {string}
 */
export function cleanWikiExtract(text) {
  return text
    .replace(/\[(?:\d+|[a-zA-Z]|citation needed|note \d+)\]/g, '')
    .replace(/\([^)]*(?:listen|pronunciation|ˈ|ˌ|ə|ɪ|ʃ|ʒ|θ|ð|ŋ|ɑː)[^)]*\)/gi, '')
    .replace(/\(\s*[;,]\s*/g, '(')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const CONVERSATIONAL_WORDS = new Set([
  'hi', 'hey', 'hello', 'helo', 'hlo', 'hola', 'bonjour', 'namaste', 'namaskar', 'pranam', 'salam',
  'bye', 'goodbye', 'alvida', 'ok', 'okay', 'kk', 'k', 'alright', 'yes', 'yep', 'yeah', 'yup',
  'no', 'nope', 'nah', 'nahi', 'nhi', 'na', 'naa', 'haan', 'haa', 'ha', 'hn', 'ji', 'hanji',
  'accha', 'achha', 'acha', 'theek', 'thik', 'thk', 'sahi', 'badhiya', 'badiya', 'mast', 'super', 'zabardast',
  'hmm', 'hm', 'mm', 'uh', 'um', 'oh', 'ah', 'arre', 'arey', 'oye', 'wah', 'wow',
  'nice', 'cool', 'good', 'great', 'awesome', 'amazing', 'fantastic', 'fine', 'well', 'done',
  'thank', 'thanks', 'thankyou', 'shukriya', 'dhanyawad', 'gracias', 'merci',
  'sorry', 'maaf', 'please', 'pls', 'plz', 'excuse', 'wait', 'ruko',
  'bhai', 'bhaiya', 'bro', 'yaar', 'yr', 'dost', 'friend', 'sir', 'madam', 'mate', 'buddy', 'dude', 'boss', 'airai',
  'batao', 'btao', 'bataiye', 'btaiye', 'bolo', 'bol', 'suno', 'sun', 'dekho', 'listen', 'tell', 'help', 'samjhao', 'smjhao', 'dikhao',
  'samajh', 'smjh', 'gaya', 'gya', 'gayi', 'gyi', 'gaye', 'got', 'understood', 'clear', 'noted',
  'kya', 'kyun', 'kyu', 'kaise', 'kaisa', 'kaisi', 'kaun', 'kon', 'kab', 'kahan', 'kitna', 'kuch',
  'ab', 'to', 'toh', 'phir', 'fir', 'bhi', 'aur', 'bas', 'abhi', 'chal', 'chalo', 'chalta', 'chalti', 'ek', 'koi',
  'kar', 'kr', 'karo', 'kro', 'karein', 'karu', 'karenge', 'karna', 'raha', 'rha', 'rahi', 'rhi', 'rahe', 'rhe',
  'ho', 'hu', 'hoon', 'hun', 'h', 'hai', 'hain', 'tha', 'thi', 'the', 'sab', 'lag', 'laga',
  'main', 'hum', 'tum', 'aap', 'tu', 'you', 'your', 'yours', 'im', 'am', 'mera', 'meri', 'tera', 'teri', 'aapka', 'tumhara',
  'up', 'wassup', 'sup', 'whats', 'hows', 'doing', 'going', 'day', 'today', 'something', 'anything', 'everything', 'someone',
  'bored', 'bore', 'tired', 'thak', 'sad', 'udaas', 'happy', 'khush', 'mood', 'off',
  'really', 'seriously', 'sach', 'mein', 'me', 'actually', 'just', 'nothing',
  'lol', 'haha', 'hehe', 'lmao', 'rofl', 'morning', 'evening', 'afternoon', 'night', 'haal', 'baat',
]);

function collapseElongatedWord(word) {
  return word.toLowerCase().replace(/(.)\1+$/g, '$1');
}

function isPureConversationalPhrase(text) {
  const tokens = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return true;
  return tokens.every((tok) => {
    const collapsed = collapseElongatedWord(tok);
    const semiCollapsed = tok.replace(/(.)\1+/g, '$1$1');
    return (
      CONVERSATIONAL_WORDS.has(tok) ||
      CONVERSATIONAL_WORDS.has(collapsed) ||
      CONVERSATIONAL_WORDS.has(semiCollapsed) ||
      STOP_WORDS.has(tok)
    );
  });
}

/**
 * Determine whether a prompt genuinely requires live browser/Wikipedia research.
 * Understands human communication words carefully so casual chat never triggers web search.
 * @param {string} rawText
 * @returns {boolean}
 */
export function needsBrowserResearch(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) return false;

  if (isExplicitResearchRequest(trimmed) || isCodeRequest(trimmed)) {
    return true;
  }

  // Explicit definition or factual question structures always merit research
  if (
    /^(?:define|meaning of|definition of|what is|what are|who is|who are|who was|who invented|where is|when was|why does|how does|history of|benefits of|advantages of|difference between)\b/i.test(
      trimmed
    ) ||
    /\b(?:ka matlab|kya hota hai|kya hoti hai|ke bare mein|ke baare mein|kisne banaya|kaun tha|vs\.?|versus)\b|क्या होता है|कौन था|किसने बनाया|के बारे में/i.test(
      trimmed
    )
  ) {
    return true;
  }

  // Reject purely conversational / filler / greeting / emotional phrases
  if (isPureConversationalPhrase(trimmed)) {
    return false;
  }

  const cleaned = extractSearchQuery(trimmed);
  const meaningfulTokens = getQueryTokens(cleaned).filter((tok) => {
    const collapsed = collapseElongatedWord(tok);
    return !CONVERSATIONAL_WORDS.has(tok) && !CONVERSATIONAL_WORDS.has(collapsed);
  });

  return meaningfulTokens.length > 0;
}

/**
 * Detect whether the user's message depends on the previous chat topic/context.
 * @param {string} text
 * @returns {boolean}
 */
export function isFollowUpReference(text) {
  const trimmed = text.trim();
  if (isPureConversationalPhrase(trimmed)) {
    return false;
  }
  if (
    /^(?:more|more details|tell me more|explain more|continue|elaborate|go on|next|aur|aur batao|aur detail|detail mein|detail me|vishtar se|aage batao|और बताओ|विस्तार से)[?!.\s]*$/i.test(
      trimmed
    )
  ) {
    return true;
  }
  if (
    /^(?:in hindi|hindi mein|hindi me|hindi mein batao|hindi me batao|translate to hindi|hindi mein samjhao|हिन्दी में|हिंदी में|हिन्दी में बताओ)[?!.\s]*$/i.test(
      trimmed
    )
  ) {
    return true;
  }
  if (
    /\b(it|its|this|that|he|him|his|she|her|they|their|them|there|uska|uski|uske|unke|unka|unki|iska|iski|iske|inhe|inhone|unhone|wo|woh|yeh|wahan|usme|isme)\b|इसके|उसके|उनके|वहाँ|यहाँ|उसने|इसने/i.test(
      trimmed
    ) &&
    !/\b(?:got it|thank you for that|thanks for that|that's nice|that is nice|that's cool|that's great|ok that|it's ok|it is ok)\b/i.test(
      trimmed
    )
  ) {
    return true;
  }
  if (
    /^(?:who built|where is|when was|why is|how old|how tall|founder|capital|history|benefits|advantages|uses|meaning|kisne banaya|kab bana|kahan hai|fayde)\??$/i.test(
      trimmed
    )
  ) {
    return true;
  }
  if (
    /\b(?:iska code|uska code|code do|code likho|give code|give me code|show code|code example|in python|in javascript|in js|in java|in cpp|in c\+\+|in html|in css)\b/i.test(
      trimmed
    )
  ) {
    return true;
  }
  return false;
}

const CODE_INTENT_RE =
  /\b(?:code|program|script|snippet|source code|example code|coding|likho|banao|implement|write a|create a|build a|how to code|flexbox|navbar|login form|fibonacci|factorial|palindrome|bubble sort|binary search|quicksort|linked list|fetch api)\b|कोड|प्रोग्राम|स्क्रिप्ट/i;
const CODE_LANG_RE =
  /\b(?:html|css|javascript|js|python|java|c\+\+|cpp|c#|csharp|php|sql|react|typescript|ts|node|nodejs|bash|shell|rust|go|golang|kotlin|swift|regex)\b/i;

/**
 * Determine whether the user is asking for programming code or an implementation snippet.
 * @param {string} text
 * @returns {boolean}
 */
export function isCodeRequest(text) {
  const t = text.trim();
  if (/\b(?:what is|who invented|history of|definition of|meaning of|kya hai|kya hota hai)\b/i.test(t) && !/\bcode\b/i.test(t)) {
    return false;
  }
  if (/\b(?:code|program|script|snippet|source code|कोड|प्रोग्राम)\b/i.test(t)) return true;
  return CODE_INTENT_RE.test(t) && CODE_LANG_RE.test(t);
}

/**
 * Extract clean coding keywords for Stack Overflow / Wikipedia code search.
 * @param {string} raw
 * @returns {string}
 */
function extractCodeQuery(raw) {
  let q = raw.trim();
  q = q
    .replace(/^(?:please\s+)?(?:give me|write|create|build|make|show me|generate|research|search|find)\s+(?:a|an|the)?\s*/i, '')
    .replace(/^(?:mujhe|browser se)\s+/i, '')
    .replace(
      /\b(?:ka code|ki coding|ka program|iska|uska|is|ye|yeh|wo|woh|code do|code likho|code batao|code chahiye|program likho|code|likho|banao|do|batao|bataiye|mein|me|ke liye|example please|please)\b/gi,
      ' '
    )
    .replace(/[?!.؟।]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (/^(html|html5)$/i.test(q)) return 'html basic page example';
  if (/^css$/i.test(q)) return 'css flexbox layout example';
  if (/^(javascript|js)$/i.test(q)) return 'javascript basic example';
  if (/^python$/i.test(q)) return 'python basic function example';

  return q || raw.trim();
}

/**
 * Infer fenced-code syntax highlight tag from user query or Stack Overflow tags.
 * @param {string} query
 * @param {string[]} [tags]
 * @returns {string}
 */
function detectCodeLanguage(query, tags = []) {
  const combined = `${query} ${tags.join(' ')}`.toLowerCase();
  if (/\b(python|py)\b/.test(combined)) return 'python';
  if (/\b(javascript|js|node|nodejs|react|fetch)\b/.test(combined)) return 'javascript';
  if (/\b(typescript|ts)\b/.test(combined)) return 'typescript';
  if (/\bhtml\b/.test(combined)) return 'html';
  if (/\bcss|flexbox|grid\b/.test(combined)) return 'css';
  if (/\b(c\+\+|cpp)\b/.test(combined)) return 'cpp';
  if (/\bjava\b/.test(combined)) return 'java';
  if (/\bsql|mysql|postgres\b/.test(combined)) return 'sql';
  if (/\bphp\b/.test(combined)) return 'php';
  if (/\bbash|shell|sh\b/.test(combined)) return 'bash';
  if (/\bjson\b/.test(combined)) return 'json';
  return tags[0] || 'code';
}

/**
 * Extract significant search tokens from a query.
 * @param {string} query
 * @returns {string[]}
 */
function getQueryTokens(query) {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasWholeToken(haystack, token) {
  if (!token) return false;
  if (token.length > 4) return haystack.includes(token);
  const rx = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRegex(token)}(?:$|[^\\p{L}\\p{N}])`, 'iu');
  return rx.test(haystack);
}

/**
 * Score how well a Wikipedia summary matches the user's query.
 * @param {string} query
 * @param {string[]} tokens
 * @param {{ title: string, description: string, extract: string, type?: string }} item
 * @returns {number}
 */
function scoreCandidate(query, tokens, item) {
  if (!item.extract || item.extract.trim().length < 20) return -1;
  if (item.type === 'disambiguation') return -1;

  const qLower = query.toLowerCase().trim();
  const titleLower = item.title.toLowerCase().trim();
  const descLower = (item.description || '').toLowerCase();
  const extractStart = item.extract.slice(0, 320).toLowerCase();

  let score = 0;
  if (titleLower === qLower) score += 100;
  else if (hasWholeToken(titleLower, qLower) || (titleLower.length >= 4 && hasWholeToken(qLower, titleLower))) {
    score += 45;
  }

  if (tokens.length > 0) {
    let titleMatches = 0;
    let bodyMatches = 0;
    for (const tok of tokens) {
      if (hasWholeToken(titleLower, tok)) titleMatches++;
      if (hasWholeToken(descLower, tok) || hasWholeToken(extractStart, tok)) bodyMatches++;
    }

    const titleRatio = titleMatches / tokens.length;
    const bodyRatio = bodyMatches / tokens.length;

    if (titleMatches === 0 && bodyMatches === 0) {
      return -1;
    }
    score += titleRatio * 40 + bodyRatio * 20;
  }

  return score;
}

/**
 * Query Free Dictionary API for explicit "define ..." requests or single-word fallbacks.
 * Normalizes repeated trailing letters (e.g. "hii" -> "hi", "hellooo" -> "hello").
 * @param {string} rawQuery
 * @param {boolean} [allowSingleWord]
 * @returns {Promise<{ ok: boolean, word: string, phonetic?: string, meanings?: Array<any> } | null>}
 */
async function tryDictionaryLookup(rawQuery, allowSingleWord = false) {
  const trimmed = rawQuery.trim();
  const defMatch =
    trimmed.match(/^(?:define|meaning of|definition of)\s+([a-zA-Z-]{2,32})[?!.]*$/i) ||
    trimmed.match(/^([a-zA-Z-]{2,32})\s+(?:ka matlab|meaning)[?!.]*$/i);

  let rawWord = defMatch ? defMatch[1].toLowerCase() : '';
  const isExplicitDefine = Boolean(rawWord);
  if (!rawWord && allowSingleWord) {
    const cleanSingle = trimmed.replace(/[?!.]+$/g, '');
    if (/^[a-zA-Z]{2,24}$/.test(cleanSingle)) {
      rawWord = cleanSingle.toLowerCase();
    }
  }
  if (!rawWord) return null;

  const collapsed = collapseElongatedWord(rawWord);
  if (
    !isExplicitDefine &&
    (CONVERSATIONAL_WORDS.has(rawWord) || CONVERSATIONAL_WORDS.has(collapsed))
  ) {
    return null;
  }

  const candidates = [rawWord];
  if (collapsed && collapsed !== rawWord) candidates.push(collapsed);
  const fullCollapsed = rawWord.replace(/(.)\1+/g, '$1$1');
  if (fullCollapsed && !candidates.includes(fullCollapsed)) candidates.push(fullCollapsed);

  for (const word of candidates) {
    try {
      const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      const entry = Array.isArray(data) ? data[0] : null;
      if (!entry || !Array.isArray(entry.meanings)) continue;
      return {
        ok: true,
        word: entry.word || word,
        phonetic: entry.phonetic || '',
        meanings: entry.meanings.slice(0, 2),
      };
    } catch {
      // Try next candidate
    }
  }
  return null;
}

/**
 * Pick Wikipedia language based on query script first, then app UI language.
 * @param {string} query
 * @param {string} appLang
 * @returns {string}
 */
function pickWikiLanguage(query, appLang) {
  if (/[\u0900-\u097F]/.test(query)) return 'hi';
  if (/[\u0600-\u06FF]/.test(query)) return 'ar';
  if (appLang === 'hi' || appLang === 'hinglish') return 'en';
  return WIKI_LANG_MAP[appLang] || 'en';
}

/**
 * Fetch verified code snippet & short explanation from CORS-enabled Stack Overflow API.
 * Uses DOMParser so third-party HTML is never injected into the live page DOM.
 * @param {string} rawQuery
 * @returns {Promise<{ title: string, language: string, explanation: string, code: string, url: string, sourceName: string } | null>}
 */
async function tryStackOverflowCodeResearch(rawQuery) {
  const cleanQ = extractCodeQuery(rawQuery);
  if (!cleanQ) return null;

  try {
    const searchUrl = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(
      cleanQ
    )}&answers=1&site=stackoverflow&pagesize=4&filter=withbody`;
    const qResp = await fetch(searchUrl);
    if (!qResp.ok) return null;
    const qData = await qResp.json();
    const questions = Array.isArray(qData?.items) ? qData.items : [];
    if (questions.length === 0) return null;

    const topQuestions = questions.slice(0, 3);
    const ids = topQuestions.map((q) => q.question_id).join(';');
    const ansUrl = `https://api.stackexchange.com/2.3/questions/${ids}/answers?order=desc&sort=votes&site=stackoverflow&pagesize=6&filter=withbody`;
    const aResp = await fetch(ansUrl);
    if (!aResp.ok) return null;
    const aData = await aResp.json();
    const answers = Array.isArray(aData?.items) ? aData.items : [];
    if (answers.length === 0) return null;

    const parser = new DOMParser();

    for (const q of topQuestions) {
      const matchingAnswers = answers
        .filter((a) => a.question_id === q.question_id)
        .sort((a, b) => Number(b.is_accepted) - Number(a.is_accepted) || (b.score || 0) - (a.score || 0));

      for (const ans of matchingAnswers) {
        if (!ans.body) continue;
        const doc = parser.parseFromString(ans.body, 'text/html');
        const codeEls = Array.from(doc.querySelectorAll('pre code, pre'));
        const snippets = codeEls
          .map((el) => (el.textContent || '').trim())
          .filter((txt) => txt.length >= 16 && txt.length <= 2600);

        if (snippets.length === 0) continue;

        const bestCode = snippets.slice(0, 2).join('\n\n');
        const paragraphs = Array.from(doc.querySelectorAll('p'))
          .map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim())
          .filter((p) => p.length > 20 && p.length < 320);
        const explanation = paragraphs.slice(0, 2).join(' ');
        const qTitle = (parser.parseFromString(q.title || cleanQ, 'text/html').body.textContent || cleanQ).trim();

        return {
          title: qTitle,
          language: detectCodeLanguage(cleanQ, q.tags || []),
          explanation,
          code: bestCode,
          url: q.link || `https://stackoverflow.com/questions/${q.question_id}`,
          sourceName: 'Stack Overflow',
        };
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Fallback code extractor using Wikipedia Parse API (<pre> / .mw-highlight blocks) for CS algorithms/concepts.
 * @param {string} rawQuery
 * @returns {Promise<{ title: string, language: string, explanation: string, code: string, url: string, sourceName: string } | null>}
 */
async function tryWikipediaCodeFallback(rawQuery) {
  const cleanQ = extractCodeQuery(rawQuery);
  if (!cleanQ) return null;

  try {
    const openResp = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        cleanQ
      )}&limit=3&namespace=0&format=json&origin=*`
    );
    if (!openResp.ok) return null;
    const openData = await openResp.json();
    const titles = Array.isArray(openData?.[1]) ? openData[1] : [];
    if (titles.length === 0) return null;

    const parser = new DOMParser();

    for (const title of titles.slice(0, 2)) {
      const parseResp = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
          title
        )}&prop=text&format=json&origin=*`
      );
      if (!parseResp.ok) continue;
      const parseData = await parseResp.json();
      const html = parseData?.parse?.text?.['*'];
      if (!html) continue;

      const doc = parser.parseFromString(html, 'text/html');
      const codeBlocks = Array.from(doc.querySelectorAll('.mw-highlight pre, pre'))
        .map((el) => (el.textContent || '').trim())
        .filter((txt) => txt.length >= 20 && txt.length <= 2400);

      if (codeBlocks.length === 0) continue;

      const firstPara = Array.from(doc.querySelectorAll('.mw-parser-output > p'))
        .map((p) => cleanWikiExtract((p.textContent || '').trim()))
        .find((p) => p.length > 40);

      return {
        title,
        language: detectCodeLanguage(cleanQ),
        explanation: firstPara || '',
        code: codeBlocks[0],
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
        sourceName: 'Wikipedia',
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Query Wikipedia OpenSearch + Query Search + REST Summary API (and Stack Overflow / Wikipedia code extractors for code requests).
 * @param {string} rawQuery
 * @param {string} appLang
 * @returns {Promise<{ ok: boolean, query: string, wikiLang?: string, reason?: string, dictionary?: any, codeSnippet?: { title: string, language: string, explanation: string, code: string, url: string, sourceName: string }, results?: Array<{ title: string, description: string, extract: string, url: string, score?: number }> }>}
 */
export async function performBrowserResearch(rawQuery, appLang) {
  const query = extractSearchQuery(rawQuery);
  if (!query) return { ok: false, query: rawQuery, reason: 'empty' };

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { ok: false, query, reason: 'offline' };
  }

  if (isCodeRequest(rawQuery)) {
    const soResult = await tryStackOverflowCodeResearch(rawQuery);
    if (soResult) {
      return { ok: true, query: extractCodeQuery(rawQuery), codeSnippet: soResult, results: [] };
    }
    const wikiCode = await tryWikipediaCodeFallback(rawQuery);
    if (wikiCode) {
      return { ok: true, query: extractCodeQuery(rawQuery), wikiLang: 'en', codeSnippet: wikiCode, results: [] };
    }
  }

  const dict = await tryDictionaryLookup(rawQuery);
  if (dict) {
    return { ok: true, query: dict.word, dictionary: dict, results: [] };
  }

  const primaryWiki = pickWikiLanguage(query, appLang);
  const tokens = getQueryTokens(query);

  async function searchWiki(wikiCode) {
    const [openRes, queryRes] = await Promise.allSettled([
      fetch(
        `https://${wikiCode}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
          query
        )}&limit=4&namespace=0&format=json&origin=*`
      ).then((r) => (r.ok ? r.json() : null)),
      fetch(
        `https://${wikiCode}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          query
        )}&srlimit=5&utf8=1&format=json&origin=*`
      ).then((r) => (r.ok ? r.json() : null)),
    ]);

    const titles = [];
    const seen = new Set();

    if (openRes.status === 'fulfilled' && Array.isArray(openRes.value?.[1])) {
      for (const title of openRes.value[1]) {
        if (title && !seen.has(title.toLowerCase())) {
          seen.add(title.toLowerCase());
          titles.push(title);
        }
      }
    }

    if (queryRes.status === 'fulfilled' && Array.isArray(queryRes.value?.query?.search)) {
      for (const hit of queryRes.value.query.search) {
        if (hit?.title && !seen.has(hit.title.toLowerCase())) {
          seen.add(hit.title.toLowerCase());
          titles.push(hit.title);
        }
      }
    }

    if (titles.length === 0) return [];

    const candidateTitles = titles.slice(0, 4);
    const summaries = await Promise.all(
      candidateTitles.map(async (title) => {
        const titleSlug = encodeURIComponent(title.replace(/ /g, '_'));
        const sumUrl = `https://${wikiCode}.wikipedia.org/api/rest_v1/page/summary/${titleSlug}`;
        try {
          const sResp = await fetch(sumUrl);
          if (!sResp.ok) return null;
          const sData = await sResp.json();
          const candidate = {
            title: sData.title || title,
            description: sData.description || '',
            extract: sData.extract || '',
            type: sData.type || 'standard',
            url: sData.content_urls?.desktop?.page || `https://${wikiCode}.wikipedia.org/wiki/${titleSlug}`,
          };
          const score = scoreCandidate(query, tokens, candidate);
          if (score < 12) return null;
          return { ...candidate, score };
        } catch {
          return null;
        }
      })
    );

    const valid = summaries.filter(Boolean).sort((a, b) => b.score - a.score);
    if (valid.length === 0) return [];

    const picked = [valid[0]];
    if (valid[1] && valid[1].score >= 45 && valid[0].score < 100) {
      picked.push(valid[1]);
    }
    return picked;
  }

  try {
    let usedLang = primaryWiki;
    let results = await searchWiki(primaryWiki);
    if (results.length === 0 && primaryWiki !== 'en') {
      usedLang = 'en';
      results = await searchWiki('en');
    }

    if (results.length === 0) {
      const singleWordDict = await tryDictionaryLookup(query, true);
      if (singleWordDict) {
        return { ok: true, query: singleWordDict.word, dictionary: singleWordDict, results: [] };
      }
      return { ok: false, query, reason: 'not_found' };
    }

    return { ok: true, query, wikiLang: usedLang, results };
  } catch {
    return { ok: false, query, reason: 'network' };
  }
}

/**
 * Fetch extended Wikipedia article text for deep follow-up answers on an active chat topic.
 * @param {string} title
 * @param {string} wikiLang
 * @returns {Promise<string>}
 */
export async function fetchArticleExtract(title, wikiLang) {
  const url = `https://${wikiLang}.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exchars=5500&titles=${encodeURIComponent(
    title
  )}&format=json&origin=*`;
  const resp = await fetch(url);
  if (!resp.ok) return '';
  const data = await resp.json();
  const pages = data?.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  return firstPage?.extract || '';
}

/**
 * Resolve a follow-up question against the active chat's last researched topic.
 * Handles:
 * 1. Code follow-ups ("iska code do", "in python") -> live code research on active topic
 * 2. "in hindi" / "hindi mein batao" (via Wikipedia langlinks)
 * 3. "more details" / "aur batao" (via progressive paragraph offset)
 * 4. Targeted follow-up questions ("who built it", "where is it", "kab bana", etc.)
 *
 * @param {string} userText
 * @param {{ lastTopic: string, lastWikiLang?: string, lastExtractOffset?: number }} context
 * @param {string} appLang
 * @returns {Promise<{ ok: boolean, reply?: string, nextOffset?: number, nextWikiLang?: string, nextTopic?: string, learnedEntry?: { title: string, query: string, summary: string, url: string } | null }>}
 */
export async function researchFollowUpOnTopic(userText, context, appLang) {
  if (!context?.lastTopic) return { ok: false };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { ok: false };

  const topic = context.lastTopic;
  const wikiLang = context.lastWikiLang || 'en';
  const trimmed = userText.trim();
  const pageUrl = `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(topic.replace(/ /g, '_'))}`;

  // 0. Follow-up asking for code on the active topic (e.g. "iska code do", "in python")
  if (isCodeRequest(trimmed) || /\b(?:in python|in javascript|in js|in java|in cpp|in c\+\+|in html|in css)\b/i.test(trimmed)) {
    const combinedCodeQuery = `${topic} ${extractCodeQuery(trimmed) || 'code'}`.trim();
    const codeRes = await performBrowserResearch(combinedCodeQuery, appLang);
    if (codeRes.ok) {
      return {
        ok: true,
        nextTopic: codeRes.codeSnippet?.title || codeRes.results?.[0]?.title || topic,
        nextWikiLang: codeRes.wikiLang || wikiLang,
        learnedEntry: buildLearnedEntry(codeRes),
        reply: formatResearchMarkdown(combinedCodeQuery, appLang, codeRes),
      };
    }
  }

  // 1. Translate/fetch same topic in Hindi via Wikipedia langlinks
  if (
    /^(?:in hindi|hindi mein|hindi me|hindi mein batao|hindi me batao|translate to hindi|hindi mein samjhao|हिन्दी में|हिंदी में|हिन्दी में बताओ)[?!.\s]*$/i.test(
      trimmed
    )
  ) {
    try {
      const llUrl = `https://${wikiLang}.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=hi&titles=${encodeURIComponent(
        topic
      )}&format=json&origin=*`;
      const llResp = await fetch(llUrl);
      const llData = await llResp.json();
      const page = Object.values(llData?.query?.pages || {})[0];
      const hiTitle = page?.langlinks?.[0]?.['*'];
      if (hiTitle) {
        const sumResp = await fetch(
          `https://hi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hiTitle.replace(/ /g, '_'))}`
        );
        if (sumResp.ok) {
          const sData = await sumResp.json();
          if (sData.extract) {
            const hiUrl =
              sData.content_urls?.desktop?.page ||
              `https://hi.wikipedia.org/wiki/${encodeURIComponent(hiTitle.replace(/ /g, '_'))}`;
            return {
              ok: true,
              nextTopic: sData.title || hiTitle,
              nextWikiLang: 'hi',
              nextOffset: 1,
              reply: `### ${sData.title || hiTitle}\n\n${sData.extract}\n\n#### स्रोत\n- [Wikipedia (हिन्दी): ${sData.title || hiTitle}](${hiUrl})`,
            };
          }
        }
      }
    } catch {
      // Fall through to standard follow-up
    }
  }

  // 2. "More details" / "aur batao" -> fetch next unseen paragraphs of the same article
  if (
    /^(?:more|more details|tell me more|explain more|continue|elaborate|go on|next|aur|aur batao|aur detail|detail mein|detail me|vishtar se|aage batao|और बताओ|विस्तार से)[?!.\s]*$/i.test(
      trimmed
    )
  ) {
    try {
      const fullText = await fetchArticleExtract(topic, wikiLang);
      const paragraphs = fullText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 60 && !p.startsWith('=='));

      const offset = context.lastExtractOffset || 1;
      const slice = paragraphs.slice(offset, offset + 2);
      if (slice.length > 0) {
        const header =
          appLang === 'hi'
            ? `### ${topic} — अतिरिक्त जानकारी`
            : `### ${topic} — Further Research`;
        return {
          ok: true,
          nextOffset: offset + slice.length,
          reply: `${header}\n\n${slice.join('\n\n')}\n\n#### Source\n- [Wikipedia: ${topic}](${pageUrl})`,
        };
      }
    } catch {
      return { ok: false };
    }
  }

  // 3. Specific follow-up question on lastTopic (e.g. "who built it?", "where is it?", "kab bana?")
  try {
    const rawTokens = getQueryTokens(trimmed);
    const expandedTokens = [];
    for (const tok of rawTokens) {
      expandedTokens.push(tok);
      if (HINGLISH_TO_EN_HINTS[tok]) {
        expandedTokens.push(...HINGLISH_TO_EN_HINTS[tok].split(' '));
      }
    }

    if (expandedTokens.length > 0) {
      const fullText = await fetchArticleExtract(topic, wikiLang);
      const sentences = fullText
        .replace(/==+[^=]+==+/g, ' ')
        .split(/(?<=[.!?।])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 25);

      const scored = sentences
        .map((sent) => {
          const sLower = sent.toLowerCase();
          let hits = 0;
          for (const kw of expandedTokens) {
            if (sLower.includes(kw)) hits++;
          }
          return { sent, hits };
        })
        .filter((x) => x.hits > 0)
        .sort((a, b) => b.hits - a.hits);

      if (scored.length > 0) {
        const bestLines = scored.slice(0, 3).map((x) => x.sent);
        const heading =
          appLang === 'hi'
            ? `### ${topic} — संदर्भ उत्तर`
            : `### ${topic} — Contextual Research`;
        return {
          ok: true,
          reply: `${heading}\n\n${bestLines.join(' ')}\n\n#### Source\n- [Wikipedia: ${topic}](${pageUrl})`,
        };
      }
    }

    // Fallback: combined search "<lastTopic> <user keywords>"
    const combinedQuery = `${topic} ${rawTokens.join(' ')}`.trim();
    const combinedResearch = await performBrowserResearch(combinedQuery, appLang);
    if (combinedResearch.ok) {
      return {
        ok: true,
        nextTopic: combinedResearch.results?.[0]?.title || topic,
        nextWikiLang: combinedResearch.wikiLang || wikiLang,
        reply: formatResearchMarkdown(combinedQuery, appLang, combinedResearch),
      };
    }
  } catch {
    return { ok: false };
  }

  return { ok: false };
}

/**
 * Format Browser Research results as clean localized markdown with source links.
 * @param {string} rawQuery
 * @param {string} appLang
 * @param {{ ok: boolean, query: string, reason?: string, dictionary?: any, results?: Array<{ title: string, description: string, extract: string, url: string }> }} research
 * @returns {string}
 */
export function formatResearchMarkdown(rawQuery, appLang, research) {
  const q = research.query || rawQuery;
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
  const githubCodeUrl = `https://github.com/search?q=${encodeURIComponent(q)}&type=code`;

  if (research.ok && research.codeSnippet) {
    const c = research.codeSnippet;
    const intro =
      appLang === 'hi'
        ? `ब्राउज़र रिसर्च (**${c.sourceName}**) से **${c.title}** के लिए कोड:`
        : appLang === 'hinglish'
          ? `Browser research (**${c.sourceName}**) se **${c.title}** ka code:`
          : appLang === 'es'
            ? `Código encontrado en el navegador (**${c.sourceName}**) para **${c.title}**:`
            : appLang === 'fr'
              ? `Code trouvé via la recherche navigateur (**${c.sourceName}**) pour **${c.title}** :`
              : appLang === 'ar'
                ? `الكود الذي تم العثور عليه عبر متصفح البحث (**${c.sourceName}**) لـ **${c.title}**:`
                : `Here is the code found via browser research (**${c.sourceName}**) for **${c.title}**:`;

    const parts = [intro];
    if (c.explanation) parts.push(c.explanation);
    parts.push(`\`\`\`${c.language || 'code'}\n${c.code}\n\`\`\``);

    const sourceHeading = appLang === 'hi' ? 'स्रोत और आगे कोड खोजें' : 'Sources & Further Code';
    parts.push(
      `#### ${sourceHeading}\n- [${c.sourceName}: ${c.title}](${c.url})\n- [GitHub Code Search: ${q}](${githubCodeUrl})\n- [Google: ${q}](${googleUrl})`
    );
    return parts.join('\n\n');
  }

  if (research.ok && research.dictionary) {
    const d = research.dictionary;
    const dictIntro =
      appLang === 'hi'
        ? `ब्राउज़र रिसर्च से **"${d.word}"** का अर्थ:`
        : appLang === 'hinglish'
          ? `Browser research se **"${d.word}"** ka matlab:`
          : `Browser research result for **${d.word}**${d.phonetic ? ` (${d.phonetic})` : ''}:`;
    const lines = [dictIntro];
    for (const m of d.meanings) {
      const def = m.definitions?.[0];
      if (!def) continue;
      lines.push(`- **${m.partOfSpeech}**: ${def.definition}${def.example ? `\n  *Example:* "${def.example}"` : ''}`);
    }
    const sourceHeading = appLang === 'hi' ? 'स्रोत' : 'Sources & Further Search';
    lines.push(`#### ${sourceHeading}\n- [Google: ${q}](${googleUrl})\n- [DuckDuckGo: ${q}](${ddgUrl})`);
    return lines.join('\n\n');
  }

  if (!research.ok || !research.results || research.results.length === 0) {
    if (research.reason === 'offline') {
      if (appLang === 'hi') {
        return `आप अभी **ऑफ़लाइन** हैं, इसलिए लाइव ब्राउज़र रिसर्च उपलब्ध नहीं है। इंटरनेट कनेक्ट होने पर मैं वेब से जानकारी खोज सकता हूँ।`;
      }
      if (appLang === 'hinglish') {
        return `Aap abhi **offline** hain, isliye live browser research nahi ho payi. Internet connect hone par main web se live research kar sakta hoon.`;
      }
      return `You appear to be **offline**, so live browser research isn't available right now. Connect to the internet to research **"${q}"** live.`;
    }

    if (appLang === 'hi') {
      return `**"${q}"** पर सटीक सारांश नहीं मिला। आप सीधे ब्राउज़र में सटीक खोज खोल सकते हैं:\n- [Google पर "${q}" खोजें](${googleUrl})\n- [DuckDuckGo पर "${q}" खोजें](${ddgUrl})`;
    }
    if (appLang === 'hinglish') {
      return `**"${q}"** par exact match nahi mila. Sahi web results ke liye aap seedha browser mein open karke dekh sakte hain:\n- [Google par "${q}" search karein](${googleUrl})\n- [DuckDuckGo par "${q}" search karein](${ddgUrl})`;
    }
    return `I couldn't verify an exact encyclopedia summary for **"${q}"**, so rather than guessing an unrelated topic, you can check live web results directly:\n- [Search "${q}" on Google](${googleUrl})\n- [Search "${q}" on DuckDuckGo](${ddgUrl})`;
  }

  const intros = {
    en: `Here is what I found and learned from browser research on **${q}**:`,
    hi: `ब्राउज़र रिसर्च से **${q}** के बारे में मैंने यह जानकारी सीखी है:`,
    hinglish: `Browser research se maine **${q}** ke baare mein yeh jaankari seekhi hai:`,
    es: `Esto es lo que encontré en el navegador sobre **${q}**:`,
    fr: `Voici ce que j'ai trouvé et retenu sur **${q}** :`,
    ar: `إليك ما وجدته وتعلمته من بحث المتصفح حول **${q}**:`,
  };

  const sourceLabels = {
    en: 'Sources & Further Search',
    hi: 'स्रोत और आगे खोजें',
    hinglish: 'Sources aur Further Search',
    es: 'Fuentes y más búsqueda',
    fr: 'Sources et recherche approfondie',
    ar: 'المصادر ومزيد من البحث',
  };

  const parts = [intros[appLang] || intros.en];

  for (const item of research.results) {
    const desc = item.description ? ` — *${item.description}*` : '';
    parts.push(`**${item.title}**${desc}\n${cleanWikiExtract(item.extract)}`);
  }

  const links = research.results.map((r) => `- [Wikipedia: ${r.title}](${r.url})`);
  links.push(`- [Google: ${q}](${googleUrl})`);
  links.push(`- [DuckDuckGo: ${q}](${ddgUrl})`);

  parts.push(`#### ${sourceLabels[appLang] || sourceLabels.en}\n${links.join('\n')}`);

  return parts.join('\n\n');
}

/**
 * Extract a compact offline knowledge record from a successful research result
 * so AirAI remembers what to say even when offline later.
 * @param {{ ok: boolean, query: string, dictionary?: any, codeSnippet?: { title: string, language: string, explanation: string, code: string, url: string }, results?: Array<{ title: string, description: string, extract: string, url: string }> }} research
 * @returns {{ title: string, query: string, summary: string, url: string } | null}
 */
export function buildLearnedEntry(research) {
  if (!research?.ok) return null;
  if (research.codeSnippet) {
    const c = research.codeSnippet;
    const summaryParts = [];
    if (c.explanation) summaryParts.push(c.explanation);
    summaryParts.push(`\`\`\`${c.language || 'code'}\n${c.code}\n\`\`\``);
    return {
      title: c.title,
      query: research.query || c.title,
      summary: summaryParts.join('\n\n'),
      url: c.url,
    };
  }
  if (research.dictionary) {
    const d = research.dictionary;
    const lines = d.meanings
      .map((m) => {
        const def = m.definitions?.[0];
        return def ? `${m.partOfSpeech}: ${def.definition}` : '';
      })
      .filter(Boolean);
    if (lines.length === 0) return null;
    return {
      title: d.word,
      query: d.word,
      summary: lines.join(' '),
      url: `https://www.google.com/search?q=${encodeURIComponent(d.word)}`,
    };
  }
  const top = research.results?.[0];
  if (!top || !top.extract) return null;
  return {
    title: top.title,
    query: research.query || top.title,
    summary: cleanWikiExtract(top.extract),
    url: top.url,
  };
}
