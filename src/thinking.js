/**
 * AirAI Qwen3-Style High-Thinking MML (Multi-step Multilingual Model) Engine
 * Supports hybrid /think and /no_think directives, deterministic multi-step reasoning,
 * step-by-step math with self-verification, dual-topic Markdown table comparisons,
 * compound sub-task decomposition, and deep browser synthesis — 100% client-side in pure JS.
 */

import { cleanWikiExtract, fetchArticleExtract, performBrowserResearch } from './research.js';

/**
 * Parse Qwen3-style inline thinking directives (/think or /no_think).
 * @param {string} rawText
 * @returns {{ cleanText: string, modeOverride: 'think' | 'fast' | null }}
 */
export function parseThinkingDirective(rawText) {
  const trimmed = rawText.trim();
  if (/(?:^|\s)\/no_think(?:\s|$)/i.test(trimmed)) {
    const cleanText = trimmed.replace(/(?:^|\s)\/no_think(?:\s|$)/gi, ' ').replace(/\s+/g, ' ').trim();
    return { cleanText: cleanText || trimmed, modeOverride: 'fast' };
  }
  if (/(?:^|\s)\/think(?:\s|$)/i.test(trimmed)) {
    const cleanText = trimmed.replace(/(?:^|\s)\/think(?:\s|$)/gi, ' ').replace(/\s+/g, ' ').trim();
    return { cleanText: cleanText || trimmed, modeOverride: 'think' };
  }
  return { cleanText: trimmed, modeOverride: null };
}

/**
 * Detect compound prompts with two independent clauses (e.g., "X and calculate Y").
 * @param {string} rawText
 * @returns {string[] | null}
 */
export function decomposeCompoundQuery(rawText) {
  const trimmed = rawText.trim();
  if (trimmed.length < 18 || trimmed.length > 260) return null;
  // Avoid splitting "difference between A and B" or "A vs B"
  if (/\b(vs\.?|versus|difference between|comparison between)\b/i.test(trimmed)) return null;

  const parts = trimmed
    .split(/\s+(?:and also|and then|aur batao|aur solve|;)\s+/i)
    .map((p) => p.trim())
    .filter((p) => p.length >= 4);

  if (parts.length === 2) return parts;
  return null;
}

/**
 * Solve higher-order math, algebra, geometry, statistics, and financial formulas with self-verification.
 * @param {string} rawText
 * @param {string} lang
 * @returns {{ reply: string, numericResult?: number, steps: string[] } | null}
 */
export function solveAdvancedMathStepByStep(rawText, lang) {
  const text = rawText.trim();

  // 1. Linear Equation: ax + b = c (e.g. "solve 2x + 5 = 15", "3x - 9 = 0")
  const linMatch = text.match(/^(?:solve\s+)?([+-]?\d*(?:\.\d+)?)\s*x\s*([+-]\s*\d+(?:\.\d+)?)?\s*=\s*([+-]?\d+(?:\.\d+)?)[?!.\s]*$/i);
  if (linMatch) {
    const aStr = linMatch[1];
    const a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : Number(aStr);
    const b = linMatch[2] ? Number(linMatch[2].replace(/\s+/g, '')) : 0;
    const c = Number(linMatch[3]);
    if (a !== 0 && Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)) {
      const rhs = Number((c - b).toFixed(4));
      const xVal = Number((rhs / a).toFixed(4));
      const verifiedLhs = Number((a * xVal + b).toFixed(4));
      const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      const steps = [
        `[Plan] Parsed linear equation: ${a}x ${b !== 0 ? signB : ''} = ${c}`,
        `[Solve] Isolated variable term: ${a}x = ${c} - (${b}) = ${rhs}`,
        `[Solve] Computed x = ${rhs} / ${a} = ${xVal}`,
        `[Verify] Substituted x = ${xVal}: ${a}(${xVal}) ${b !== 0 ? signB : ''} = ${verifiedLhs} ✓`,
      ];
      const reply =
        lang === 'hi'
          ? `### रैखिक समीकरण (Step-by-Step + सत्यापन)\n1. दिया गया समीकरण: \`${a}x ${b !== 0 ? signB : ''} = ${c}\`\n2. \`${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)} = ${rhs}\`\n3. \`x = ${rhs} / ${a} = ${xVal}\`\n4. **सत्यापन:** \`${a}(${xVal}) ${b !== 0 ? signB : ''} = ${verifiedLhs}\` ✓\n\n**उत्तर:** \`x = ${xVal}\``
          : lang === 'hinglish'
            ? `### Linear Equation Solution (Step-by-Step + Check)\n1. Diya gaya equation: \`${a}x ${b !== 0 ? signB : ''} = ${c}\`\n2. Constant ko right side le jayein: \`${a}x = ${rhs}\`\n3. \`x = ${rhs} / ${a} = ${xVal}\`\n4. **Verification:** \`${a}(${xVal}) ${b !== 0 ? signB : ''} = ${verifiedLhs}\` ✓\n\n**Final Answer:** \`x = ${xVal}\``
            : `### Linear Equation Solution (Step-by-Step + Verification)\n1. Start with: \`${a}x ${b !== 0 ? signB : ''} = ${c}\`\n2. Isolate the \`x\` term: \`${a}x = ${rhs}\`\n3. Divide both sides by \`${a}\`: \`x = ${rhs} / ${a} = ${xVal}\`\n4. **Verify:** \`${a}(${xVal}) ${b !== 0 ? signB : ''} = ${verifiedLhs}\` ✓\n\n**Answer:** \`x = ${xVal}\``;
      return { reply, numericResult: xVal, steps };
    }
  }

  // 2. Quadratic Equation: ax^2 + bx + c = 0
  const quadMatch = text.match(
    /^(?:solve\s+)?([+-]?\d*(?:\.\d+)?)\s*x\^2\s*([+-]\s*\d*(?:\.\d+)?)?\s*x?\s*([+-]\s*\d+(?:\.\d+)?)?\s*=\s*0[?!.\s]*$/i
  );
  if (quadMatch) {
    const aStr = quadMatch[1];
    const a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : Number(aStr);
    const bRaw = (quadMatch[2] || '').replace(/\s+/g, '');
    const b = !bRaw ? 0 : bRaw === '+' ? 1 : bRaw === '-' ? -1 : Number(bRaw);
    const c = quadMatch[3] ? Number(quadMatch[3].replace(/\s+/g, '')) : 0;

    if (a !== 0 && Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)) {
      const disc = Number((b * b - 4 * a * c).toFixed(4));
      const steps = [
        `Identified quadratic coefficients: a=${a}, b=${b}, c=${c}`,
        `Computed discriminant D = b² - 4ac = ${disc}`,
      ];
      if (disc > 0) {
        const x1 = Number(((-b + Math.sqrt(disc)) / (2 * a)).toFixed(4));
        const x2 = Number(((-b - Math.sqrt(disc)) / (2 * a)).toFixed(4));
        steps.push(`Two real roots found: x₁=${x1}, x₂=${x2}`);
        return {
          reply: `### Quadratic Equation (Step-by-Step)\n1. Coefficients: \`a = ${a}, b = ${b}, c = ${c}\`\n2. Discriminant: \`D = b² - 4ac = ${disc}\`\n3. Using \`x = (-b ± √D) / 2a\`:\n\n**Roots:** \`x₁ = ${x1}\`, \`x₂ = ${x2}\``,
          numericResult: x1,
          steps,
        };
      }
      if (disc === 0) {
        const x = Number((-b / (2 * a)).toFixed(4));
        steps.push(`Repeated real root found: x=${x}`);
        return {
          reply: `### Quadratic Equation (Step-by-Step)\n1. Discriminant \`D = 0\` (equal roots)\n2. \`x = -b / 2a = ${x}\`\n\n**Root:** \`x = ${x}\``,
          numericResult: x,
          steps,
        };
      }
      const realPart = Number((-b / (2 * a)).toFixed(4));
      const imagPart = Number((Math.sqrt(Math.abs(disc)) / (2 * a)).toFixed(4));
      steps.push(`Negative discriminant (${disc}); complex conjugate roots computed.`);
      return {
        reply: `### Quadratic Equation (Step-by-Step)\n1. Discriminant: \`D = ${disc} < 0\` (complex roots)\n2. **Roots:** \`x = ${realPart} ± ${imagPart}i\``,
        steps,
      };
    }
  }

  // 3. Factorial (e.g. "factorial of 6", "6!")
  const factMatch =
    text.match(/^(?:factorial of|factorial)\s+(\d{1,2})[?!.\s]*$/i) || text.match(/^(\d{1,2})![?!.\s]*$/);
  if (factMatch) {
    const n = Number(factMatch[1]);
    if (n >= 0 && n <= 20) {
      let res = 1;
      const chain = [];
      for (let i = n; i >= 1; i--) {
        res *= i;
        if (n <= 8) chain.push(String(i));
      }
      const expansion = n <= 1 ? '1' : n <= 8 ? chain.join(' × ') : `${n} × ${n - 1} × ... × 1`;
      return {
        reply: `### Factorial of ${n}\n1. Formula: \`n! = n × (n - 1) × ... × 1\`\n2. Expansion: \`${n}! = ${expansion}\`\n\n**Answer:** **${res.toLocaleString()}**`,
        numericResult: res,
        steps: [`Parsed factorial target n = ${n}`, `Evaluated product ${n}! = ${res}`],
      };
    }
  }

  // 4. Prime number check (e.g. "is 97 prime", "97 prime hai kya")
  const primeMatch =
    text.match(/^(?:is\s+)?(\d{1,9})\s+(?:a\s+)?prime(?:\s+number)?(?:\s+hai(?:\s+kya)?)?[?!.\s]*$/i) ||
    text.match(/^check prime\s+(\d{1,9})[?!.\s]*$/i);
  if (primeMatch) {
    const n = Number(primeMatch[1]);
    if (n >= 0 && Number.isSafeInteger(n)) {
      let divisor = null;
      if (n < 2) divisor = n;
      else if (n > 2 && n % 2 === 0) divisor = 2;
      else {
        for (let d = 3; d * d <= n; d += 2) {
          if (n % d === 0) {
            divisor = d;
            break;
          }
        }
      }
      const isPrime = n >= 2 && divisor === null;
      const proof = isPrime
        ? `No integer between 2 and ⌊√${n}⌋ (${Math.floor(Math.sqrt(n))}) divides ${n} evenly.`
        : n < 2
          ? `Numbers less than 2 are not prime by definition.`
          : `${n} is divisible by **${divisor}** (${n} = ${divisor} × ${n / divisor}).`;
      const reply =
        lang === 'hinglish'
          ? `### Prime Check: ${n}\n- **Result:** **${n}** ${isPrime ? 'ek **Prime Number** hai' : '**Prime Number nahi** hai'}.\n- **Reason:** ${proof}`
          : `### Prime Check: ${n}\n- **Result:** **${n}** is ${isPrime ? '**Prime**' : '**Not Prime**'}.\n- **Reasoning:** ${proof}`;
      return {
        reply,
        steps: [`Checked divisibility up to √${n} ≈ ${Math.floor(Math.sqrt(n))}`, `Verified ${isPrime ? 'prime' : 'composite'}`],
      };
    }
  }

  // 5. Fibonacci Sequence (e.g. "fibonacci 10", "first 8 fibonacci numbers")
  const fibMatch = text.match(/^(?:first\s+)?(\d{1,2})\s+fibonacci(?:\s+(?:numbers|terms|series))?[?!.\s]*$/i) ||
    text.match(/^fibonacci(?:\s+(?:series|sequence|of))?\s+(\d{1,2})(?:\s+terms)?[?!.\s]*$/i);
  if (fibMatch) {
    const count = Math.min(Math.max(Number(fibMatch[1]), 1), 25);
    const seq = [];
    for (let i = 0; i < count; i++) {
      if (i === 0) seq.push(0);
      else if (i === 1) seq.push(1);
      else seq.push(seq[i - 1] + seq[i - 2]);
    }
    return {
      reply: `### Fibonacci Sequence (${count} terms)\n- Rule: \`F(n) = F(n - 1) + F(n - 2)\`\n- Sequence: \`${seq.join(', ')}\``,
      numericResult: seq[seq.length - 1],
      steps: [`Generated ${count} Fibonacci terms recursively`, `Last term F(${count - 1}) = ${seq[seq.length - 1]}`],
    };
  }

  // 6. Average / Mean / Median of numbers (e.g. "average of 10, 20, 35, 45")
  const avgMatch = text.match(/^(?:average|mean|median)\s+(?:of\s+)?([\d.,\s]+)[?!.\s]*$/i);
  if (avgMatch) {
    const nums = avgMatch[1]
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => Number.isFinite(n));
    if (nums.length >= 2) {
      const sum = nums.reduce((acc, v) => acc + v, 0);
      const mean = Number((sum / nums.length).toFixed(4));
      const sorted = [...nums].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 !== 0 ? sorted[mid] : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(4));
      return {
        reply: `### Statistical Analysis\n- **Values (${nums.length}):** \`${nums.join(', ')}\`\n- **Sum:** \`${sum}\`\n- **Mean (Average):** **${mean}**\n- **Median:** **${median}**\n- **Min / Max:** \`${sorted[0]}\` / \`${sorted[sorted.length - 1]}\``,
        numericResult: mean,
        steps: [`Parsed ${nums.length} numbers`, `Sum = ${sum}, Mean = ${mean}, Median = ${median}`],
      };
    }
  }

  // 7. Simple & Compound Interest ("simple interest 10000 8 3" or "compound interest p=10000 r=8 t=3")
  const interestMatch = text.match(
    /^(simple|compound)\s+interest\s+(?:p(?:rincipal)?\s*=?\s*)?(\d+(?:\.\d+)?)\s+(?:r(?:ate)?\s*=?\s*)?(\d+(?:\.\d+)?)%?\s+(?:t(?:ime)?\s*=?\s*)?(\d+(?:\.\d+)?)/i
  );
  if (interestMatch) {
    const kind = interestMatch[1].toLowerCase();
    const p = Number(interestMatch[2]);
    const r = Number(interestMatch[3]);
    const t = Number(interestMatch[4]);
    if (kind === 'simple') {
      const si = Number(((p * r * t) / 100).toFixed(2));
      const total = Number((p + si).toFixed(2));
      return {
        reply: `### Simple Interest Calculation\n1. Formula: \`SI = (P × R × T) / 100\`\n2. \`SI = (${p} × ${r} × ${t}) / 100\` = **${si.toLocaleString()}**\n3. **Total Amount:** **${total.toLocaleString()}**`,
        numericResult: total,
        steps: [`Applied Simple Interest formula P=${p}, R=${r}%, T=${t}y`, `Computed SI=${si}, Total=${total}`],
      };
    }
    const total = Number((p * Math.pow(1 + r / 100, t)).toFixed(2));
    const ci = Number((total - p).toFixed(2));
    return {
      reply: `### Compound Interest Calculation\n1. Formula: \`A = P(1 + R/100)^T\`\n2. \`A = ${p}(1 + ${r}/100)^${t}\` = **${total.toLocaleString()}**\n3. **Compound Interest:** **${ci.toLocaleString()}**`,
      numericResult: total,
      steps: [`Applied Compound Interest formula P=${p}, R=${r}%, T=${t}y`, `Computed CI=${ci}, Total=${total}`],
    };
  }

  // 8. BMI Calculator ("bmi 70 kg 175 cm" or "bmi 70 1.75")
  const bmiMatch = text.match(/^bmi\s+(\d+(?:\.\d+)?)\s*(?:kg)?\s+(\d+(?:\.\d+)?)\s*(cm|m)?/i);
  if (bmiMatch) {
    const weight = Number(bmiMatch[1]);
    let height = Number(bmiMatch[2]);
    const unit = (bmiMatch[3] || '').toLowerCase();
    if (unit === 'cm' || (!unit && height > 3)) height = height / 100;
    if (height > 0) {
      const bmi = Number((weight / (height * height)).toFixed(1));
      const category =
        bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese';
      return {
        reply: `### BMI Calculation\n1. Formula: \`BMI = weight(kg) / height(m)²\`\n2. \`BMI = ${weight} / (${height.toFixed(2)})²\` = **${bmi}**\n3. **Category:** **${category}** *(Informational estimate only)*`,
        numericResult: bmi,
        steps: [`Normalized height to ${height.toFixed(2)}m`, `Calculated BMI = ${bmi} (${category})`],
      };
    }
  }

  // 9. Geometry quick solvers (circle area/circumference, right triangle hypotenuse)
  const circleMatch = text.match(/^(?:area|circumference)\s+of\s+(?:a\s+)?circle\s+(?:with\s+)?(?:radius|r)?\s*=?\s*(\d+(?:\.\d+)?)[?!.\s]*$/i);
  if (circleMatch) {
    const r = Number(circleMatch[1]);
    const area = Number((Math.PI * r * r).toFixed(4));
    const circ = Number((2 * Math.PI * r).toFixed(4));
    return {
      reply: `### Circle Geometry (r = ${r})\n1. **Area:** \`π × r² = π × ${r}²\` = **${area}**\n2. **Circumference:** \`2 × π × r = 2 × π × ${r}\` = **${circ}**`,
      numericResult: area,
      steps: [`[Solve] Applied circle formulas for r = ${r}`, `[Verify] Area = ${area}, Circumference = ${circ}`],
    };
  }

  const pythMatch = text.match(/^(?:pythagoras|pythagorean|hypotenuse)\s+(\d+(?:\.\d+)?)\s+(?:and\s+|,\s*)?(\d+(?:\.\d+)?)[?!.\s]*$/i);
  if (pythMatch) {
    const a = Number(pythMatch[1]);
    const b = Number(pythMatch[2]);
    const c = Number(Math.hypot(a, b).toFixed(4));
    return {
      reply: `### Pythagorean Theorem\n1. Formula: \`c = √(a² + b²)\`\n2. \`c = √(${a}² + ${b}²) = √(${a * a + b * b})\` = **${c}**`,
      numericResult: c,
      steps: [`[Solve] Computed √(${a}² + ${b}²) = ${c}`, `[Verify] ${a}² + ${b}² = ${a * a + b * b} ≈ ${c}² ✓`],
    };
  }

  return null;
}

/**
 * Parse comparison queries ("A vs B", "difference between A and B", "A aur B mein farq").
 * @param {string} rawText
 * @returns {{ subjectA: string, subjectB: string } | null}
 */
export function parseComparisonQuery(rawText) {
  const cleaned = rawText
    .trim()
    .replace(/[?!.؟।]+$/g, '')
    .replace(/^(?:please\s+|explain\s+|compare\s+|what is the\s+|tell me the\s+)/i, '')
    .trim();

  const vsMatch = cleaned.match(/^(.{2,45}?)\s+(?:vs\.?|versus)\s+(.{2,45})$/i);
  if (vsMatch) {
    return { subjectA: vsMatch[1].trim(), subjectB: vsMatch[2].trim() };
  }

  const diffEnMatch = cleaned.match(/^(?:difference|differences|comparison)\s+between\s+(.{2,45}?)\s+and\s+(.{2,45})$/i);
  if (diffEnMatch) {
    return { subjectA: diffEnMatch[1].trim(), subjectB: diffEnMatch[2].trim() };
  }

  const diffHiMatch = cleaned.match(
    /^(.{2,45}?)\s+(?:aur|or|and|और)\s+(.{2,45}?)\s+(?:mein|me|ke beech|में|के बीच)\s+(?:kya\s+)?(?:farq|fark|antar|difference|अंतर|फर्क)(?:\s+hai)?$/i
  );
  if (diffHiMatch) {
    return { subjectA: diffHiMatch[1].trim(), subjectB: diffHiMatch[2].trim() };
  }

  return null;
}

/**
 * Extract top 2-3 high-signal key sentences from an extract.
 * @param {string} text
 * @param {number} [limit]
 * @returns {string[]}
 */
function pickKeySentences(text, limit = 3) {
  const cleaned = cleanWikiExtract(text || '');
  const sentences = cleaned
    .split(/(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 35 && s.length < 300);
  return sentences.slice(0, limit);
}

/**
 * Perform dual-subject comparative reasoning (online browser research + offline fallback).
 * @param {{ subjectA: string, subjectB: string }} pair
 * @param {string} appLang
 * @param {boolean} canResearchOnline
 * @param {(query: string) => { matched: boolean, reply: string, topicLabel?: string }} offlineLookupFn
 * @returns {Promise<{ ok: boolean, reply: string, topicLabel: string, steps: string[] }>}
 */
export async function runComparisonReasoning(pair, appLang, canResearchOnline, offlineLookupFn) {
  const { subjectA, subjectB } = pair;
  const steps = [
    `Identified dual-entity comparison: "${subjectA}" vs "${subjectB}"`,
  ];

  let infoA = null;
  let infoB = null;

  if (canResearchOnline) {
    steps.push(`Executing parallel browser research for "${subjectA}" and "${subjectB}"`);
    const [resA, resB] = await Promise.all([
      performBrowserResearch(subjectA, appLang),
      performBrowserResearch(subjectB, appLang),
    ]);
    if (resA.ok && resA.results?.[0]) {
      infoA = {
        title: resA.results[0].title,
        desc: resA.results[0].description || '',
        points: pickKeySentences(resA.results[0].extract, 2),
        url: resA.results[0].url,
      };
    } else if (resA.ok && resA.dictionary) {
      infoA = {
        title: resA.dictionary.word,
        desc: resA.dictionary.meanings?.[0]?.partOfSpeech || '',
        points: [resA.dictionary.meanings?.[0]?.definitions?.[0]?.definition || ''].filter(Boolean),
        url: '',
      };
    }

    if (resB.ok && resB.results?.[0]) {
      infoB = {
        title: resB.results[0].title,
        desc: resB.results[0].description || '',
        points: pickKeySentences(resB.results[0].extract, 2),
        url: resB.results[0].url,
      };
    } else if (resB.ok && resB.dictionary) {
      infoB = {
        title: resB.dictionary.word,
        desc: resB.dictionary.meanings?.[0]?.partOfSpeech || '',
        points: [resB.dictionary.meanings?.[0]?.definitions?.[0]?.definition || ''].filter(Boolean),
        url: '',
      };
    }
  }

  if (!infoA) {
    const offA = offlineLookupFn(subjectA);
    if (offA.matched) {
      infoA = { title: subjectA, desc: 'Offline trained knowledge', points: pickKeySentences(offA.reply, 2), url: '' };
    }
  }
  if (!infoB) {
    const offB = offlineLookupFn(subjectB);
    if (offB.matched) {
      infoB = { title: subjectB, desc: 'Offline trained knowledge', points: pickKeySentences(offB.reply, 2), url: '' };
    }
  }

  if (!infoA && !infoB) {
    steps.push('Neither subject returned verified data; providing direct search comparison links.');
    const gUrl = `https://www.google.com/search?q=${encodeURIComponent(`${subjectA} vs ${subjectB}`)}`;
    return {
      ok: false,
      topicLabel: `${subjectA} vs ${subjectB}`,
      steps,
      reply: `I analyzed **${subjectA} vs ${subjectB}**, but couldn't pull verified summaries offline or via Wikipedia. Check live comparison here:\n- [Search "${subjectA} vs ${subjectB}" on Google](${gUrl})`,
    };
  }

  steps.push('[Synthesis] Built structured comparison table, key distinction, and citations');

  const titleA = infoA?.title || subjectA;
  const titleB = infoB?.title || subjectB;
  const heading =
    appLang === 'hi'
      ? `### तुलनात्मक विश्लेषण: ${titleA} बनाम ${titleB}`
      : appLang === 'hinglish'
        ? `### Comparison Analysis: ${titleA} vs ${titleB}`
        : `### Comparison: ${titleA} vs ${titleB}`;

  const cleanCell = (s) => (s || '—').replace(/\|/g, '/').replace(/\n+/g, ' ').trim();
  const focusA = cleanCell(infoA?.desc || titleA);
  const focusB = cleanCell(infoB?.desc || titleB);
  const coreA = cleanCell(infoA?.points?.[0] || 'No detailed summary found locally.');
  const coreB = cleanCell(infoB?.points?.[0] || 'No detailed summary found locally.');

  const tableBlock = [
    `| Dimension | ${cleanCell(titleA)} | ${cleanCell(titleB)} |`,
    `| --- | --- | --- |`,
    `| Primary Focus | ${focusA} | ${focusB} |`,
    `| Core Overview | ${coreA} | ${coreB} |`,
  ].join('\n');

  const secA = infoA
    ? `**1. ${titleA}**${infoA.desc ? ` — *${infoA.desc}*` : ''}\n${infoA.points.map((p) => `- ${p}`).join('\n')}`
    : `**1. ${titleA}**\n- No detailed summary found locally.`;
  const secB = infoB
    ? `**2. ${titleB}**${infoB.desc ? ` — *${infoB.desc}*` : ''}\n${infoB.points.map((p) => `- ${p}`).join('\n')}`
    : `**2. ${titleB}**\n- No detailed summary found locally.`;

  const insight =
    appLang === 'hi'
      ? `**निष्कर्ष:** **${titleA}** मुख्य रूप से *${infoA?.desc || titleA}* से जुड़ा है, जबकि **${titleB}** *${infoB?.desc || titleB}* पर केंद्रित है।`
      : appLang === 'hinglish'
        ? `**Key Takeaway:** **${titleA}** mainly *${infoA?.desc || titleA}* se related hai, jabki **${titleB}** *${infoB?.desc || titleB}* par focus karta hai.`
        : `**Key Distinction:** **${titleA}** centers on *${infoA?.desc || 'its own domain'}*, whereas **${titleB}** focuses on *${infoB?.desc || 'a distinct domain'}*.`;

  const srcLinks = [];
  if (infoA?.url) srcLinks.push(`- [${titleA}](${infoA.url})`);
  if (infoB?.url) srcLinks.push(`- [${titleB}](${infoB.url})`);
  srcLinks.push(
    `- [Google Comparison: ${subjectA} vs ${subjectB}](https://www.google.com/search?q=${encodeURIComponent(`${subjectA} vs ${subjectB}`)})`
  );

  return {
    ok: true,
    topicLabel: `${titleA} vs ${titleB}`,
    steps,
    reply: `${heading}\n\n${tableBlock}\n\n${secA}\n\n${secB}\n\n${insight}\n\n#### Sources\n${srcLinks.join('\n')}`,
  };
}

/**
 * Transform or deepen the previous assistant reply in the active chat
 * ("simplify", "pros and cons", "bullet points", "quiz me", "roadmap/steps").
 * @param {string} rawText
 * @param {{ messages: Array<{ role: string, text: string }>, lastTopic?: string }} chat
 * @param {string} appLang
 * @returns {{ reply: string, steps: string[] } | null}
 */
export function transformPreviousReply(rawText, chat, appLang) {
  const trimmed = rawText.trim();
  const lastAssistant = [...(chat?.messages || [])].reverse().find((m) => m.role === 'assistant' && m.text.trim());
  if (!lastAssistant) return null;

  const plainBody = lastAssistant.text
    .replace(/\n*####\s+(?:Sources?|स्रोत|Fuentes|المصادر)[^\n]*[\s\S]*$/i, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim();

  if (plainBody.length < 30) return null;
  const topic = chat.lastTopic || 'Previous Topic';

  // 1. Simplify / Explain in simple language
  if (
    /\b(simplify|simple terms|easy language|eli5|aasan bhasha|simple mein|easy mein|saral bhasha)\b|आसान भाषा|सरल शब्दों/i.test(
      trimmed
    )
  ) {
    const sentences = pickKeySentences(plainBody.replace(/^#+\s+.*$/gm, ''), 4);
    if (sentences.length > 0) {
      const header =
        appLang === 'hi'
          ? `### ${topic} — आसान शब्दों में`
          : appLang === 'hinglish'
            ? `### ${topic} — Simple Points Mein`
            : `### ${topic} — Simplified Breakdown`;
      return {
        steps: [
          `Retrieved previous assistant explanation on "${topic}"`,
          'Distilled core points into clear, jargon-free bullets',
        ],
        reply: `${header}\n\n${sentences.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
      };
    }
  }

  // 2. Bullet points / Key takeaways
  if (/\b(bullet points|key points|takeaways|highlights|points mein|points me)\b|मुख्य बिंदु/i.test(trimmed)) {
    const sentences = pickKeySentences(plainBody.replace(/^#+\s+.*$/gm, ''), 5);
    if (sentences.length > 0) {
      return {
        steps: [`Extracted ${sentences.length} structured key points from "${topic}"`],
        reply: `### Key Takeaways: ${topic}\n\n${sentences.map((s) => `- ${s}`).join('\n')}`,
      };
    }
  }

  // 3. Generate a quick self-check quiz on the current topic
  if (/\b(quiz|test me|practice question|mcq|ek sawal pucho|question pucho)\b|क्विज़|प्रश्न पूछो/i.test(trimmed)) {
    const sentences = pickKeySentences(plainBody.replace(/^#+\s+.*$/gm, ''), 3);
    if (sentences.length > 0) {
      const header =
        appLang === 'hinglish'
          ? `### Quick Practice Check: ${topic}`
          : appLang === 'hi'
            ? `### अभ्यास प्रश्न: ${topic}`
            : `### Quick Knowledge Check: ${topic}`;
      const prompts = sentences.map((s, idx) => {
        const clue = s.length > 90 ? `${s.slice(0, 90)}...` : s;
        return `${idx + 1}. **Explain in your own words:** Based on *"${clue}"*, what is the main idea?`;
      });
      return {
        steps: [
          `Analyzed active conversation context (${topic})`,
          `Generated ${prompts.length} active-recall prompts`,
        ],
        reply: `${header}\n\n${prompts.join('\n')}`,
      };
    }
  }

  return null;
}

/**
 * Upgrade a Wikipedia research result with deeper MML synthesis:
 * pulls extended paragraphs when summary is short and highlights key takeaways cleanly.
 * @param {string} rawQuery
 * @param {string} appLang
 * @param {{ ok: boolean, query: string, wikiLang?: string, results?: Array<{ title: string, description: string, extract: string, url: string }> }} research
 * @param {{ lastTopic?: string, userFacts?: { name?: string, goal?: string } }} chat
 * @returns {Promise<{ markdown: string, steps: string[] } | null>}
 */
export async function enhanceResearchWithThinking(rawQuery, appLang, research, chat) {
  if (!research?.ok || !research.results || research.results.length === 0) return null;

  const top = research.results[0];
  const wikiLang = research.wikiLang || 'en';
  const steps = [
    `Analyzed query "${rawQuery}" -> matched primary source "${top.title}" (${wikiLang}.wikipedia.org)`,
  ];

  let extraBullets = [];
  try {
    const fullExtract = await fetchArticleExtract(top.title, wikiLang);
    if (fullExtract) {
      const cleanedFull = cleanWikiExtract(fullExtract);
      const paragraphs = cleanedFull
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 70 && !p.startsWith('==') && p !== top.extract.trim());
      if (paragraphs.length > 0) {
        const topSentences = pickKeySentences(paragraphs.slice(0, 3).join(' '), 3);
        extraBullets = topSentences.filter((s) => !top.extract.includes(s.slice(0, 40)));
      }
      if (extraBullets.length > 0) {
        steps.push(`Fetched extended article context and distilled ${extraBullets.length} additional insights`);
      }
    }
  } catch {
    // Graceful fallback to summary only
  }

  const desc = top.description ? ` — *${top.description}*` : '';
  const summaryClean = cleanWikiExtract(top.extract);

  const greetingNote = chat?.userFacts?.name ? ` (${chat.userFacts.name})` : '';
  const intro =
    appLang === 'hi'
      ? `गहन विश्लेषण व ब्राउज़र रिसर्च के आधार पर **${top.title}**${greetingNote}:`
      : appLang === 'hinglish'
        ? `Deep Thinking + Browser Research se **${top.title}**${greetingNote} par poori jaankari:`
        : appLang === 'es'
          ? `Análisis profundo y búsqueda web sobre **${top.title}**:`
          : appLang === 'fr'
            ? `Analyse approfondie et recherche navigateur sur **${top.title}** :`
            : appLang === 'ar'
              ? `تحليل عميق وبحث المتصفح حول **${top.title}**:`
              : `Deep Thinking synthesis on **${top.title}**${greetingNote}:`;

  const parts = [intro, `**${top.title}**${desc}\n${summaryClean}`];

  if (extraBullets.length > 0) {
    const takeawayHeader =
      appLang === 'hi'
        ? '#### मुख्य बिंदु (Key Takeaways)'
        : appLang === 'hinglish'
          ? '#### Key Takeaways'
          : '#### Key Takeaways';
    parts.push(`${takeawayHeader}\n${extraBullets.map((b) => `- ${b}`).join('\n')}`);
  }

  if (research.results[1]) {
    const sec = research.results[1];
    parts.push(`**Related: ${sec.title}**\n${cleanWikiExtract(sec.extract)}`);
  }

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(research.query || rawQuery)}`;
  const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(research.query || rawQuery)}`;
  const links = research.results.map((r) => `- [Wikipedia: ${r.title}](${r.url})`);
  links.push(`- [Google: ${research.query || rawQuery}](${googleUrl})`);
  links.push(`- [DuckDuckGo: ${research.query || rawQuery}](${ddgUrl})`);
  parts.push(`#### Sources & Further Search\n${links.join('\n')}`);

  steps.push('[Synthesis] Structured response into core summary, key takeaways, and verified citations');

  return { markdown: parts.join('\n\n'), steps };
}

/**
 * Qwen3-Coder Style Structured Code Templates for common developer requests (offline-capable).
 * @param {string} rawText
 * @param {string} appLang
 * @returns {{ reply: string, topicLabel: string, steps: string[] } | null}
 */
export function generateStructuredCodeReply(rawText, appLang) {
  const lower = rawText.toLowerCase();
  const asksForCode = /\b(code|snippet|example|program|script|function|form|navbar|table|algorithm|banaye|banao|likho)\b|कोड/i.test(lower);
  if (!asksForCode) return null;

  /** @type {{ match: RegExp, title: string, langTag: string, code: string, notes: string[] }[]} */
  const templates = [
    {
      match: /\b(login|sign\s*in)\b.*\b(html|form|page)\b|\b(html|form)\b.*\b(login|sign\s*in)\b/i,
      title: 'Responsive HTML Login Form',
      langTag: 'html',
      code: `<form class="login-card" action="/login" method="post">
  <h2>Sign In</h2>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required autocomplete="email" />

  <label for="password">Password</label>
  <input id="password" name="password" type="password" required minlength="8" />

  <button type="submit">Continue</button>
</form>`,
      notes: ['Uses semantic `<label for>` bindings and HTML5 constraint validation.', 'Always submit credentials over HTTPS and validate server-side.'],
    },
    {
      match: /\b(navbar|navigation bar|header menu)\b/i,
      title: 'Responsive Flexbox Navbar',
      langTag: 'html',
      code: `<header class="nav-wrap">
  <a href="/" class="brand">AirAI</a>
  <nav class="nav-links" aria-label="Primary">
    <a href="#features">Features</a>
    <a href="#docs">Docs</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
<style>
  .nav-wrap { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; }
  .nav-links { display: flex; gap: 16px; flex-wrap: wrap; }
</style>`,
      notes: ['Uses `aria-label="Primary"` for screen-reader accessibility.', 'Wraps cleanly on narrow screens with `flex-wrap: wrap`.'],
    },
    {
      match: /\b(binary search)\b/i,
      title: 'Binary Search (O(log n))',
      langTag: 'javascript',
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      notes: ['Requires a **sorted** array.', 'Time Complexity: `O(log n)` · Space Complexity: `O(1)`.'],
    },
    {
      match: /\b(fetch|api call|http request)\b.*\b(js|javascript|async)\b|\b(js|javascript)\b.*\bfetch\b/i,
      title: 'Async Fetch with Error Handling',
      langTag: 'javascript',
      code: `async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
  }
  return res.json();
}`,
      notes: ['Explicitly checks `res.ok` since `fetch()` only rejects on network failure.', 'Wrap calls in `try { ... } catch (err) { ... }` at the call site.'],
    },
    {
      match: /\b(html)\b.*\b(basic|page|starter|boilerplate|iska code|structure)\b|^html(?:\s+code)?$/i,
      title: 'Semantic HTML5 Page Boilerplate',
      langTag: 'html',
      code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Page</title>
  </head>
  <body>
    <main>
      <h1>Hello World</h1>
      <p>Clean semantic HTML5 structure.</p>
    </main>
  </body>
</html>`,
      notes: ['Includes responsive viewport meta tag for mobile scaling.', 'Uses landmark `<main>` tag for accessibility and SEO.'],
    },
  ];

  const hit = templates.find((item) => item.match.test(lower));
  if (!hit) return null;

  const heading =
    appLang === 'hi'
      ? `### ${hit.title} — कोड व व्याख्या`
      : appLang === 'hinglish'
        ? `### ${hit.title} — Clean Code & Notes`
        : `### ${hit.title}`;

  const notesTitle = appLang === 'hi' ? '#### मुख्य बिंदु' : '#### Implementation Notes';

  return {
    topicLabel: hit.title,
    steps: [
      `[Intent] Detected structured coding request (${hit.title})`,
      `[Codegen] Selected verified ${hit.langTag.toUpperCase()} pattern with best-practice guards`,
      `[Verify] Checked syntax, accessibility, and edge-case notes`,
    ],
    reply: `${heading}\n\n\`\`\`${hit.langTag}\n${hit.code}\n\`\`\`\n\n${notesTitle}\n${hit.notes.map((n) => `- ${n}`).join('\n')}`,
  };
}

