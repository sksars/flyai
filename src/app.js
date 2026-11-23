import {
  SPEECH_LOCALES,
  STARTER_PROMPTS,
  UI_TEXT,
  buildIntentClarificationReply,
  generateOfflineReply,
} from './knowledge.js';
import {
  buildLearnedEntry,
  formatResearchMarkdown,
  isExplicitResearchRequest,
  isFollowUpReference,
  needsBrowserResearch,
  performBrowserResearch,
  researchFollowUpOnTopic,
} from './research.js';
import {
  decomposeCompoundQuery,
  enhanceResearchWithThinking,
  generateStructuredCodeReply,
  parseComparisonQuery,
  parseThinkingDirective,
  runComparisonReasoning,
  solveAdvancedMathStepByStep,
  transformPreviousReply,
} from './thinking.js';

const STORAGE_KEYS = {
  chats: 'myai_chats_v1',
  activeChatId: 'myai_active_chat_v1',
  settings: 'myai_settings_v1',
  memory: 'myai_memory_v1',
  learned: 'myai_learned_v1',
  consent: 'myai_consent_v1',
};

const DEFAULT_SETTINGS = {
  language: 'en',
  theme: 'light',
  autoTts: false,
  voiceAutoSend: false,
  speechRate: 1,
  webResearch: true,
  autoLearn: true,
  highThinking: true,
};

/** @type {{ chats: Array<any>, activeChatId: string | null, settings: typeof DEFAULT_SETTINGS, memory: Array<any>, learnedKnowledge: Array<any> }} */
const state = {
  chats: [],
  activeChatId: null,
  settings: { ...DEFAULT_SETTINGS },
  memory: [],
  learnedKnowledge: [],
};

let streamTimerId = null;
let pendingSleepResolve = null;
let isGenerating = false;
let activeSpeechMsgId = null;
let recognition = null;
let isRecording = false;
let toastTimeoutId = null;

// DOM Elements
const $ = (id) => document.getElementById(id);

const els = {
  splashScreen: $('splash-screen'),
  splashSubtitle: $('splash-subtitle'),
  appShell: $('app-shell'),
  sidebar: $('sidebar'),
  sidebarBackdrop: $('sidebar-backdrop'),
  toggleSidebarBtn: $('toggle-sidebar-btn'),
  closeSidebarMobileBtn: $('close-sidebar-mobile-btn'),
  brandHomeBtn: $('brand-home-btn'),
  newChatBtn: $('new-chat-btn'),
  labelNewChat: $('label-new-chat'),
  chatSearchInput: $('chat-search-input'),
  chatHistoryList: $('chat-history-list'),
  openMemoryBtn: $('open-memory-btn'),
  labelMemoryBtn: $('label-memory-btn'),
  openSettingsBtn: $('open-settings-btn'),
  labelSettingsBtn: $('label-settings-btn'),
  activeChatTitle: $('active-chat-title'),
  modelModeSelect: $('model-mode-select'),
  languageSelect: $('language-select'),
  autoTtsBtn: $('auto-tts-btn'),
  themeToggleBtn: $('theme-toggle-btn'),
  themeIconMoon: $('theme-icon-moon'),
  themeIconSun: $('theme-icon-sun'),
  chatScrollArea: $('chat-scroll-area'),
  welcomeView: $('welcome-view'),
  welcomeHeading: $('welcome-heading'),
  welcomeSubheading: $('welcome-subheading'),
  starterGrid: $('starter-grid'),
  messagesContainer: $('messages-container'),
  voiceStatusBanner: $('voice-status-banner'),
  voiceStatusText: $('voice-status-text'),
  voiceStopBtn: $('voice-stop-btn'),
  toastBanner: $('toast-banner'),
  chatForm: $('chat-form'),
  thinkingToggleBtn: $('thinking-toggle-btn'),
  researchToggleBtn: $('research-toggle-btn'),
  micBtn: $('mic-btn'),
  promptInput: $('prompt-input'),
  sendBtn: $('send-btn'),
  sendIcon: $('send-icon'),
  stopGenIcon: $('stop-gen-icon'),
  composerFootnote: $('composer-footnote'),
  // Modal
  modalOverlay: $('modal-overlay'),
  modalTitle: $('modal-title'),
  modalCloseBtn: $('modal-close-btn'),
  tabSettings: $('tab-settings'),
  tabMemory: $('tab-memory'),
  panelSettings: $('panel-settings'),
  panelMemory: $('panel-memory'),
  settingLanguage: $('setting-language'),
  settingHighThinking: $('setting-high-thinking'),
  settingWebResearch: $('setting-web-research'),
  settingAutoLearn: $('setting-auto-learn'),
  settingAutoTts: $('setting-auto-tts'),
  settingVoiceAutoSend: $('setting-voice-auto-send'),
  settingSpeechRate: $('setting-speech-rate'),
  testVoiceBtn: $('test-voice-btn'),
  clearAllChatsBtn: $('clear-all-chats-btn'),
  labelSettingLang: $('label-setting-lang'),
  descSettingLang: $('desc-setting-lang'),
  labelSettingThinking: $('label-setting-thinking'),
  descSettingThinking: $('desc-setting-thinking'),
  labelSettingResearch: $('label-setting-research'),
  descSettingResearch: $('desc-setting-research'),
  labelSettingAutoLearn: $('label-setting-autolearn'),
  descSettingAutoLearn: $('desc-setting-autolearn'),
  labelSettingAutoTts: $('label-setting-autotts'),
  descSettingAutoTts: $('desc-setting-autotts'),
  labelSettingAutoSend: $('label-setting-autosend'),
  descSettingAutoSend: $('desc-setting-autosend'),
  labelSettingRate: $('label-setting-rate'),
  descSettingRate: $('desc-setting-rate'),
  labelClearChats: $('label-clear-chats'),
  descClearChats: $('desc-clear-chats'),
  memoryIntro: $('memory-intro'),
  memoryForm: $('memory-form'),
  memoryQInput: $('memory-question-input'),
  memoryAInput: $('memory-answer-input'),
  memorySaveBtn: $('memory-save-btn'),
  memoryList: $('memory-list'),
  learnedHeading: $('learned-heading'),
  clearLearnedBtn: $('clear-learned-btn'),
  learnedList: $('learned-list'),
  consentBanner: $('consent-banner'),
  consentAcceptBtn: $('consent-accept-btn'),
  consentEssentialBtn: $('consent-essential-btn'),
  openConsentBtn: $('open-consent-btn'),
};

/* =========================================================
   Storage Helpers
   ========================================================= */
function loadFromStorage() {
  try {
    const rawSettings = localStorage.getItem(STORAGE_KEYS.settings);
    if (rawSettings) {
      state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) };
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      state.settings.theme = 'dark';
    }

    const rawChats = localStorage.getItem(STORAGE_KEYS.chats);
    if (rawChats) {
      const parsed = JSON.parse(rawChats);
      if (Array.isArray(parsed)) state.chats = parsed;
    }

    const activeId = localStorage.getItem(STORAGE_KEYS.activeChatId);
    if (activeId && state.chats.some((c) => c.id === activeId)) {
      state.activeChatId = activeId;
    } else if (state.chats.length > 0) {
      state.activeChatId = state.chats[0].id;
    }

    const rawMemory = localStorage.getItem(STORAGE_KEYS.memory);
    if (rawMemory) {
      const parsedMem = JSON.parse(rawMemory);
      if (Array.isArray(parsedMem)) state.memory = parsedMem;
    }

    const rawLearned = localStorage.getItem(STORAGE_KEYS.learned);
    if (rawLearned) {
      const parsedLearned = JSON.parse(rawLearned);
      if (Array.isArray(parsedLearned)) state.learnedKnowledge = parsedLearned;
    }
  } catch {
    // Ignore malformed localStorage data gracefully
  }
}

function saveChats() {
  try {
    localStorage.setItem(STORAGE_KEYS.chats, JSON.stringify(state.chats));
    if (state.activeChatId) {
      localStorage.setItem(STORAGE_KEYS.activeChatId, state.activeChatId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeChatId);
    }
  } catch {
    showToast('Storage limit reached in browser.');
  }
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
  } catch {
    // Ignore storage errors
  }
}

function saveMemory() {
  try {
    localStorage.setItem(STORAGE_KEYS.memory, JSON.stringify(state.memory));
  } catch {
    // Ignore storage errors
  }
}

function saveLearnedKnowledge() {
  try {
    localStorage.setItem(STORAGE_KEYS.learned, JSON.stringify(state.learnedKnowledge));
  } catch {
    // Ignore storage errors
  }
}

function learnFromResearch(entry) {
  if (!entry || !entry.title || !entry.summary) return;
  const normTitle = entry.title.trim().toLowerCase();
  const existingIdx = state.learnedKnowledge.findIndex(
    (item) => (item.title || '').trim().toLowerCase() === normTitle
  );
  const record = {
    id: existingIdx >= 0 ? state.learnedKnowledge[existingIdx].id : createId(),
    title: entry.title.trim(),
    query: (entry.query || entry.title).trim(),
    summary: entry.summary.trim(),
    url: entry.url || '',
    updatedAt: Date.now(),
  };
  if (existingIdx >= 0) {
    state.learnedKnowledge.splice(existingIdx, 1);
  }
  state.learnedKnowledge.unshift(record);
  if (state.learnedKnowledge.length > 80) {
    state.learnedKnowledge = state.learnedKnowledge.slice(0, 80);
  }
  saveLearnedKnowledge();
  renderLearnedList();
}

function createId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/* =========================================================
   Localization & Theme
   ========================================================= */
function t() {
  return UI_TEXT[state.settings.language] || UI_TEXT.en;
}

function applyTheme() {
  const isDark = state.settings.theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  els.themeIconMoon.classList.toggle('hidden', isDark);
  els.themeIconSun.classList.toggle('hidden', !isDark);
}

function applyLocalization() {
  const copy = t();
  els.splashSubtitle.textContent = copy.splashSubtitle;
  els.labelNewChat.textContent = copy.newChat;
  els.chatSearchInput.placeholder = copy.searchPlaceholder;
  els.labelMemoryBtn.textContent = copy.memoryBtn;
  els.labelSettingsBtn.textContent = copy.settingsBtn;
  els.welcomeHeading.textContent = copy.welcomeHeading;
  els.welcomeSubheading.textContent = copy.welcomeSubheading;
  els.promptInput.placeholder = copy.placeholder;
  els.composerFootnote.textContent = copy.footnote;
  els.voiceStopBtn.textContent = copy.stop;

  els.modalTitle.textContent = copy.settingsTitle;
  els.tabSettings.textContent = copy.tabPrefs;
  els.tabMemory.textContent = copy.tabMemory;
  els.labelSettingLang.textContent = copy.langLabel;
  els.descSettingLang.textContent = copy.langDesc;
  if (els.labelSettingThinking) els.labelSettingThinking.textContent = copy.thinkingLabel;
  if (els.descSettingThinking) els.descSettingThinking.textContent = copy.thinkingDesc;
  els.labelSettingResearch.textContent = copy.researchSettingLabel;
  els.descSettingResearch.textContent = copy.researchSettingDesc;
  els.labelSettingAutoLearn.textContent = copy.autoLearnLabel;
  els.descSettingAutoLearn.textContent = copy.autoLearnDesc;
  els.labelSettingAutoTts.textContent = copy.autoTtsLabel;
  els.descSettingAutoTts.textContent = copy.autoTtsDesc;
  els.labelSettingAutoSend.textContent = copy.autoSendLabel;
  els.descSettingAutoSend.textContent = copy.autoSendDesc;
  els.labelSettingRate.textContent = copy.rateLabel;
  els.descSettingRate.textContent = copy.rateDesc;
  els.testVoiceBtn.textContent = copy.testVoiceBtn;
  els.labelClearChats.textContent = copy.clearChatsLabel;
  els.descClearChats.textContent = copy.clearChatsDesc;
  els.clearAllChatsBtn.textContent = copy.clearChatsBtn;
  els.memoryIntro.textContent = copy.memoryIntro;
  els.memoryQInput.placeholder = copy.memoryQPlaceholder;
  els.memoryAInput.placeholder = copy.memoryAPlaceholder;
  els.memorySaveBtn.textContent = copy.memorySaveBtn;
  els.learnedHeading.textContent = copy.learnedHeading;
  els.clearLearnedBtn.textContent = copy.clearLearnedBtn;

  els.languageSelect.value = state.settings.language;
  els.settingLanguage.value = state.settings.language;
  if (els.modelModeSelect) {
    const modeSel = /** @type {HTMLSelectElement} */ (els.modelModeSelect);
    modeSel.value = state.settings.highThinking ? 'think' : 'fast';
    if (modeSel.options[0] && copy.modelThinkLabel) modeSel.options[0].textContent = copy.modelThinkLabel;
    if (modeSel.options[1] && copy.modelFastLabel) modeSel.options[1].textContent = copy.modelFastLabel;
  }
  if (els.settingHighThinking) {
    /** @type {HTMLInputElement} */ (els.settingHighThinking).checked = Boolean(state.settings.highThinking);
  }
  if (els.thinkingToggleBtn) {
    els.thinkingToggleBtn.setAttribute('aria-pressed', String(Boolean(state.settings.highThinking)));
    els.thinkingToggleBtn.title = copy.thinkingBtn;
  }
  els.settingWebResearch.checked = state.settings.webResearch;
  els.settingAutoLearn.checked = state.settings.autoLearn;
  els.researchToggleBtn.setAttribute('aria-pressed', String(state.settings.webResearch));
  els.researchToggleBtn.title = copy.researchBtn;
  els.settingAutoTts.checked = state.settings.autoTts;
  els.settingVoiceAutoSend.checked = state.settings.voiceAutoSend;
  els.settingSpeechRate.value = String(state.settings.speechRate);
  els.autoTtsBtn.setAttribute('aria-pressed', String(state.settings.autoTts));

  renderStarterPrompts();
  renderChatHistory();
  renderActiveChat();
  renderMemoryList();
  renderLearnedList();
}

function showToast(msg) {
  els.toastBanner.textContent = msg;
  els.toastBanner.classList.remove('hidden');
  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    els.toastBanner.classList.add('hidden');
  }, 3500);
}

/* =========================================================
   Markdown Renderer (XSS-Safe)
   ========================================================= */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => {
    return `<a class="md-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  out = out.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
}

function renderMarkdown(rawText) {
  const codeBlocks = [];
  const withPlaceholders = rawText.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: lang || 'code', code: code.replace(/\n$/, '') });
    return `@@CODE_BLOCK_${idx}@@`;
  });

  const lines = withPlaceholders.split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      html += '</ul>';
      inUl = false;
    }
    if (inOl) {
      html += '</ol>';
      inOl = false;
    }
  };

  const parseTableCells = (rowStr) => {
    let s = rowStr.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|')) s = s.slice(0, -1);
    return s.split('|').map((c) => c.trim());
  };

  const isTableSeparator = (rowStr) => {
    const trimmedRow = rowStr.trim();
    if (!trimmedRow.includes('|') || !trimmedRow.includes('-')) return false;
    const cells = parseTableCells(trimmedRow);
    return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const blockMatch = trimmed.match(/^@@CODE_BLOCK_(\d+)@@$/);
    if (blockMatch) {
      closeLists();
      const blk = codeBlocks[Number(blockMatch[1])];
      html += `<div class="code-block-wrap"><div class="code-block-header"><span>${escapeHtml(
        blk.lang
      )}</span><button type="button" class="code-copy-btn" data-code="${encodeURIComponent(
        blk.code
      )}">${escapeHtml(t().copy)}</button></div><pre><code>${escapeHtml(blk.code)}</code></pre></div>`;
      continue;
    }

    // Markdown Table block: header line + separator line + body rows
    if (trimmed.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      closeLists();
      const headers = parseTableCells(trimmed);
      i += 2; // Skip separator line
      const bodyRows = [];
      while (i < lines.length && lines[i].trim().includes('|') && !lines[i].trim().startsWith('@@CODE_BLOCK_')) {
        bodyRows.push(parseTableCells(lines[i]));
        i++;
      }
      i--; // Adjust loop index for outer increment
      const thead = `<thead><tr>${headers.map((h) => `<th>${formatInline(h)}</th>`).join('')}</tr></thead>`;
      const tbody = `<tbody>${bodyRows
        .map(
          (r) =>
            `<tr>${headers.map((_, colIdx) => `<td>${formatInline(r[colIdx] || '')}</td>`).join('')}</tr>`
        )
        .join('')}</tbody>`;
      html += `<div class="md-table-wrap"><table class="md-table">${thead}${tbody}</table></div>`;
      continue;
    }

    if (!trimmed) {
      closeLists();
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      closeLists();
      html += `<h4>${formatInline(trimmed.slice(5))}</h4>`;
    } else if (trimmed.startsWith('### ')) {
      closeLists();
      html += `<h3>${formatInline(trimmed.slice(4))}</h3>`;
    } else if (trimmed.startsWith('## ')) {
      closeLists();
      html += `<h3>${formatInline(trimmed.slice(3))}</h3>`;
    } else if (trimmed.startsWith('> ')) {
      closeLists();
      html += `<p><em>${formatInline(trimmed.slice(2))}</em></p>`;
    } else if (/^[-*]\s+/.test(trimmed)) {
      if (inOl) {
        html += '</ol>';
        inOl = false;
      }
      if (!inUl) {
        html += '<ul>';
        inUl = true;
      }
      html += `<li>${formatInline(trimmed.replace(/^[-*]\s+/, ''))}</li>`;
    } else if (/^\d+\.\s+/.test(trimmed)) {
      if (inUl) {
        html += '</ul>';
        inUl = false;
      }
      if (!inOl) {
        html += '<ol>';
        inOl = true;
      }
      html += `<li>${formatInline(trimmed.replace(/^\d+\.\s+/, ''))}</li>`;
    } else {
      closeLists();
      html += `<p>${formatInline(trimmed)}</p>`;
    }
  }

  closeLists();
  return html;
}

/* =========================================================
   Chat Management & Rendering
   ========================================================= */
function getActiveChat() {
  return state.chats.find((c) => c.id === state.activeChatId) || null;
}

function startNewChat() {
  stopStreaming();
  stopSpeaking();
  state.activeChatId = null;
  saveChats();
  renderChatHistory();
  renderActiveChat();
  closeMobileSidebar();
  els.promptInput.focus();
}

function selectChat(chatId) {
  stopStreaming();
  stopSpeaking();
  state.activeChatId = chatId;
  saveChats();
  renderChatHistory();
  renderActiveChat();
  closeMobileSidebar();
}

function deleteChat(chatId) {
  state.chats = state.chats.filter((c) => c.id !== chatId);
  if (state.activeChatId === chatId) {
    state.activeChatId = state.chats.length > 0 ? state.chats[0].id : null;
  }
  saveChats();
  renderChatHistory();
  renderActiveChat();
}

function renderStarterPrompts() {
  const prompts = STARTER_PROMPTS[state.settings.language] || STARTER_PROMPTS.en;
  els.starterGrid.innerHTML = '';

  for (const item of prompts) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'starter-card';
    btn.innerHTML = `<span class="starter-card-title">${escapeHtml(
      item.title
    )}</span><span class="starter-card-prompt">${escapeHtml(item.prompt)}</span>`;
    btn.addEventListener('click', () => {
      els.promptInput.value = item.prompt;
      autoResizeInput();
      updateSendButton();
      submitPrompt();
    });
    els.starterGrid.appendChild(btn);
  }
}

function renderChatHistory() {
  const query = els.chatSearchInput.value.trim().toLowerCase();
  const filtered = state.chats.filter((chat) => {
    if (!query) return true;
    return (
      chat.title.toLowerCase().includes(query) ||
      chat.messages.some((m) => m.text.toLowerCase().includes(query))
    );
  });

  els.chatHistoryList.innerHTML = '';
  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'history-empty';
    empty.textContent = t().noChats;
    els.chatHistoryList.appendChild(empty);
    return;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;

  const groups = [
    { label: t().today, items: [] },
    { label: t().yesterday, items: [] },
    { label: t().earlier, items: [] },
  ];

  for (const chat of filtered) {
    if (chat.updatedAt >= startOfToday) groups[0].items.push(chat);
    else if (chat.updatedAt >= startOfYesterday) groups[1].items.push(chat);
    else groups[2].items.push(chat);
  }

  for (const group of groups) {
    if (group.items.length === 0) continue;
    const header = document.createElement('div');
    header.className = 'history-group-label';
    header.textContent = group.label;
    els.chatHistoryList.appendChild(header);

    for (const chat of group.items) {
      const row = document.createElement('div');
      row.className = `history-item${chat.id === state.activeChatId ? ' active' : ''}`;

      const selectBtn = document.createElement('button');
      selectBtn.type = 'button';
      selectBtn.className = 'history-select-btn';
      selectBtn.textContent = chat.title;
      selectBtn.addEventListener('click', () => selectChat(chat.id));

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'history-delete-btn';
      delBtn.setAttribute('aria-label', `Delete ${chat.title}`);
      delBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteChat(chat.id);
      });

      row.append(selectBtn, delBtn);
      els.chatHistoryList.appendChild(row);
    }
  }
}

function isRtlText(str) {
  return /[\u0600-\u06FF]/.test(str);
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createMessageElement(msg) {
  const row = document.createElement('article');
  row.className = `message-row message-row--${msg.role}`;
  row.dataset.msgId = msg.id;

  if (msg.role === 'user') {
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble--user';
    if (isRtlText(msg.text)) bubble.setAttribute('dir', 'rtl');
    bubble.textContent = msg.text;
    row.appendChild(bubble);
    return row;
  }

  const header = document.createElement('div');
  header.className = 'assistant-header';
  header.innerHTML = `
    <span class="assistant-avatar" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="8" stroke="currentColor" stroke-width="2.2" />
        <path d="M10.5 21.5L16 9.5L21.5 21.5M12.5 17.5H19.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="assistant-meta">
      <span class="assistant-name">AirAI</span>
      <span aria-hidden="true">·</span>
      <span class="message-time">${formatTime(msg.timestamp)}</span>
    </span>
  `;

  const thinkingEl =
    Array.isArray(msg.thinkingTrace) && msg.thinkingTrace.length > 0
      ? createThinkingElement(msg.thinkingTrace, msg.thinkingDurationMs)
      : null;

  const content = document.createElement('div');
  content.className = 'assistant-content';
  if (isRtlText(msg.text)) content.setAttribute('dir', 'rtl');
  content.innerHTML = renderMarkdown(msg.text);

  const actions = document.createElement('div');
  actions.className = 'message-actions';

  const speakBtn = document.createElement('button');
  speakBtn.type = 'button';
  const isSpeakingThis = activeSpeechMsgId === msg.id;
  speakBtn.className = `msg-action-btn${isSpeakingThis ? ' speaking' : ''}`;
  speakBtn.dataset.action = 'speak';
  speakBtn.innerHTML = getSpeakBtnHtml(isSpeakingThis);
  speakBtn.addEventListener('click', () => toggleSpeakMessage(msg));

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'msg-action-btn';
  copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>${escapeHtml(
    t().copy
  )}</span>`;
  copyBtn.addEventListener('click', () => copyText(msg.text, copyBtn));

  actions.append(speakBtn, copyBtn);
  if (thinkingEl) {
    row.append(header, thinkingEl, content, actions);
  } else {
    row.append(header, content, actions);
  }
  return row;
}

function appendThinkingStepItem(listEl, stepText) {
  const li = document.createElement('li');
  const tagMatch = stepText.match(/^(\[[A-Za-z]+\])\s+(.+)$/);
  if (tagMatch) {
    const tag = document.createElement('span');
    tag.className = 'thinking-phase-tag';
    tag.textContent = tagMatch[1];
    li.append(tag, document.createTextNode(tagMatch[2]));
  } else {
    li.textContent = stepText;
  }
  listEl.appendChild(li);
}

function createThinkingElement(trace, durationMs, options = { streaming: false }) {
  const details = document.createElement('details');
  details.className = `thinking-block${options.streaming ? ' is-streaming' : ''}`;
  if (options.streaming) {
    details.open = true;
  }

  const copy = t();
  const label = options.streaming
    ? copy.thinkingLiveLabel || 'Thinking...'
    : copy.thinkingSummaryLabel || 'Thought process';
  const stepsWord = copy.thinkingStepsWord || 'steps';
  const durationLabel =
    !options.streaming && typeof durationMs === 'number' && durationMs > 0
      ? ` · ${(Math.max(durationMs, 10) / 1000).toFixed(2)}s`
      : '';

  const summary = document.createElement('summary');
  summary.className = 'thinking-summary';
  summary.innerHTML = `
    <svg class="thinking-summary-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .4.07.79.2 1.15A3.5 3.5 0 0 0 5 11.5c0 1.25.66 2.35 1.65 2.96A3.5 3.5 0 0 0 10 19.5h1.5V4h-2zM14.5 4a3.5 3.5 0 0 1 3.5 3.5c0 .4-.07.79-.2 1.15A3.5 3.5 0 0 1 19 11.5c0 1.25-.66 2.35-1.65 2.96A3.5 3.5 0 0 1 14 19.5h-1.5V4h2z" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="thinking-summary-label">${escapeHtml(label)}</span>
    <span class="thinking-meta">${options.streaming ? '' : `(${trace.length} ${escapeHtml(stepsWord)}${escapeHtml(durationLabel)})`}</span>
    <svg class="thinking-summary-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const list = document.createElement('ol');
  list.className = 'thinking-steps';
  if (!options.streaming) {
    for (const step of trace) {
      appendThinkingStepItem(list, step);
    }
  }

  details.append(summary, list);
  return details;
}

function getSpeakBtnHtml(isSpeaking) {
  if (isSpeaking) {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg><span>${escapeHtml(
      t().stopSpeaking
    )}</span>`;
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke-linejoin="round"/><path d="M15.5 8.5a5 5 0 0 1 0 7" stroke-linecap="round"/></svg><span>${escapeHtml(
    t().speak
  )}</span>`;
}

function renderActiveChat() {
  const chat = getActiveChat();
  if (!chat || chat.messages.length === 0) {
    els.activeChatTitle.textContent = t().newChat;
    els.welcomeView.classList.remove('hidden');
    els.messagesContainer.classList.add('hidden');
    els.messagesContainer.innerHTML = '';
    return;
  }

  els.activeChatTitle.textContent = chat.title;
  els.welcomeView.classList.add('hidden');
  els.messagesContainer.classList.remove('hidden');
  els.messagesContainer.innerHTML = '';

  for (const msg of chat.messages) {
    els.messagesContainer.appendChild(createMessageElement(msg));
  }
  scrollToBottom();
}

function scrollToBottom() {
  els.chatScrollArea.scrollTop = els.chatScrollArea.scrollHeight;
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const labelEl = btn.querySelector('span');
    if (labelEl) {
      const prev = labelEl.textContent;
      labelEl.textContent = t().copied;
      setTimeout(() => {
        labelEl.textContent = prev;
      }, 1500);
    }
  } catch {
    showToast('Unable to copy text.');
  }
}

/* =========================================================
   Prompt Submission & Streaming Reply
   ========================================================= */
function updateSendButton() {
  if (isGenerating) {
    els.sendBtn.disabled = false;
    els.sendIcon.classList.add('hidden');
    els.stopGenIcon.classList.remove('hidden');
    return;
  }
  els.sendIcon.classList.remove('hidden');
  els.stopGenIcon.classList.add('hidden');
  els.sendBtn.disabled = els.promptInput.value.trim().length === 0;
}

function autoResizeInput() {
  els.promptInput.style.height = 'auto';
  els.promptInput.style.height = `${Math.min(els.promptInput.scrollHeight, 160)}px`;
}

function stopStreaming() {
  if (streamTimerId) {
    clearTimeout(streamTimerId);
    streamTimerId = null;
  }
  isGenerating = false;
  if (pendingSleepResolve) {
    const resolve = pendingSleepResolve;
    pendingSleepResolve = null;
    resolve();
  }
  updateSendButton();
}

function addMemoryItem(question, answer) {
  state.memory.unshift({ id: createId(), question: question.trim(), answer: answer.trim() });
  saveMemory();
  renderMemoryList();
}

function summarizeTextBrief(markdownText, lang) {
  const plain = markdownText
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
    .replace(/^#+\s+.*$/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = plain.split(/(?<=[.!?।])\s+/).filter((s) => s.length > 15);
  const top = sentences.slice(0, 3);
  if (top.length === 0) return null;

  const heading =
    lang === 'hi'
      ? '### संक्षिप्त सारांश'
      : lang === 'hinglish'
        ? '### Short Summary'
        : '### Summary';
  return `${heading}\n${top.map((s) => `- ${s}`).join('\n')}`;
}

function resolveChatContextOffline(text, chat, lang) {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  if (!chat.userFacts) chat.userFacts = {};

  // 1. Capture user's name inside current chat ("my name is X" / "mera naam X hai")
  const nameIntro = trimmed.match(/^(?:my name is|i am|mera naam)\s+([a-zA-Z\u0900-\u097F]{2,24})(?:\s+hai)?[.!]*$/i);
  if (nameIntro) {
    const userName = nameIntro[1].trim();
    chat.userFacts.name = userName;
    if (lang === 'hi') return { reply: `नमस्ते **${userName}**! मैंने इस चैट में आपका नाम याद रख लिया है। बताइए, आप किस विषय पर रिसर्च करना चाहते हैं?` };
    if (lang === 'hinglish') return { reply: `Namaste **${userName}**! Maine is chat mein aapka naam yaad rakh liya hai. Bataiye kis topic par research karein?` };
    return { reply: `Nice to meet you, **${userName}**! I'll remember your name in this conversation. What would you like to explore?` };
  }

  // 2. Recall user's name in this chat
  if (/\b(what is my name|who am i|mera naam kya hai|mera naam)\b/i.test(lower) && chat.userFacts.name) {
    const n = chat.userFacts.name;
    if (lang === 'hi') return { reply: `इस चैट के अनुसार आपका नाम **${n}** है।` };
    if (lang === 'hinglish') return { reply: `Is chat ke hisaab se aapka naam **${n}** hai.` };
    return { reply: `In this chat, you told me your name is **${n}**.` };
  }

  // 3. Recall conversation topic / previous question in this chat
  if (
    /\b(what are we talking about|current topic|what was my first question|what did i ask|previous question|hum kis bare mein|maine pehle kya|kis topic par)\b/i.test(
      lower
    )
  ) {
    const priorUsers = chat.messages.filter((m) => m.role === 'user');
    const firstQ = priorUsers[0]?.text;
    const prevQ = priorUsers.length >= 2 ? priorUsers[priorUsers.length - 2]?.text : null;
    if (chat.lastTopic || prevQ) {
      if (lang === 'hi') {
        return {
          reply: `इस चैट में हम **${chat.lastTopic || prevQ}** के बारे में बात कर रहे हैं।${firstQ ? `\n- आपका पहला सवाल था: *"${firstQ}"*` : ''}`,
        };
      }
      if (lang === 'hinglish') {
        return {
          reply: `Is chat mein hum **${chat.lastTopic || prevQ}** par baat kar rahe hain.${firstQ ? `\n- Aapka pehla sawal tha: *"${firstQ}"*` : ''}`,
        };
      }
      return {
        reply: `In this conversation, we are currently discussing **${chat.lastTopic || prevQ}**.${firstQ ? `\n- Your first question was: *"${firstQ}"*` : ''}`,
      };
    }
  }

  // 4. Summarize the previous assistant reply in this chat
  if (/^(?:summarize|summary|in short|short mein|short mein batao|short me|संक्षेप में|सारांश)[?!.\s]*$/i.test(trimmed)) {
    const lastAssistant = [...chat.messages].reverse().find((m) => m.role === 'assistant' && m.text.trim().length > 0);
    if (lastAssistant) {
      const brief = summarizeTextBrief(lastAssistant.text, lang);
      if (brief) return { reply: brief };
    }
  }

  // 5. Chain math operations onto previous numeric result (e.g. "+ 50", "* 2", "divide by 4")
  if (typeof chat.lastNumeric === 'number') {
    const opMatch =
      trimmed.match(/^([+\-*/])\s*(\d+(?:\.\d+)?)$/) ||
      trimmed.match(/^(?:add|plus|\+)\s+(\d+(?:\.\d+)?)$/i) ||
      trimmed.match(/^(?:subtract|minus|-)\s+(\d+(?:\.\d+)?)$/i) ||
      trimmed.match(/^(?:multiply by|times|\*)\s+(\d+(?:\.\d+)?)$/i) ||
      trimmed.match(/^(?:divide by|\/)\s+(\d+(?:\.\d+)?)$/i);

    if (opMatch) {
      let op = opMatch[1];
      let numStr = opMatch[2];
      if (!numStr) {
        numStr = opMatch[1];
        if (/^(add|plus)/i.test(trimmed)) op = '+';
        else if (/^(subtract|minus)/i.test(trimmed)) op = '-';
        else if (/^(multiply|times)/i.test(trimmed)) op = '*';
        else if (/^divide/i.test(trimmed)) op = '/';
      }
      const chainedExpr = `${chat.lastNumeric} ${op} ${numStr}`;
      const res = generateOfflineReply(chainedExpr, lang, state.memory, addMemoryItem, state.learnedKnowledge);
      if (typeof res.numericResult === 'number') {
        chat.lastNumeric = res.numericResult;
        return { reply: res.reply };
      }
    }
  }

  return null;
}

function recordTopic(chat, topic) {
  if (!topic || typeof topic !== 'string') return;
  const clean = topic.trim();
  if (!clean) return;
  chat.lastTopic = clean;
  if (!Array.isArray(chat.topicHistory)) chat.topicHistory = [];
  chat.topicHistory = [clean, ...chat.topicHistory.filter((item) => item !== clean)].slice(0, 5);
}

async function submitPrompt() {
  if (isGenerating) {
    stopStreaming();
    return;
  }

  const text = els.promptInput.value.trim();
  if (!text) return;

  if (isRecording) stopVoiceInput();

  let chat = getActiveChat();
  if (!chat) {
    chat = {
      id: createId(),
      title: text.length > 36 ? `${text.slice(0, 36)}...` : text,
      updatedAt: Date.now(),
      messages: [],
      lastTopic: '',
      topicHistory: [],
      lastWikiLang: 'en',
      lastExtractOffset: 1,
      lastNumeric: null,
      userFacts: {},
    };
    state.chats.unshift(chat);
    state.activeChatId = chat.id;
  }

  const userMsg = {
    id: createId(),
    role: 'user',
    text,
    timestamp: Date.now(),
  };
  chat.messages.push(userMsg);
  chat.updatedAt = Date.now();

  // Move active chat to top
  state.chats = [chat, ...state.chats.filter((c) => c.id !== chat.id)];
  saveChats();

  els.promptInput.value = '';
  autoResizeInput();
  renderChatHistory();
  renderActiveChat();

  const assistantMsg = {
    id: createId(),
    role: 'assistant',
    text: '',
    timestamp: Date.now(),
    thinkingTrace: null,
    thinkingDurationMs: 0,
  };
  chat.messages.push(assistantMsg);

  const rowEl = createMessageElement(assistantMsg);
  els.messagesContainer.appendChild(rowEl);
  const contentEl = rowEl.querySelector('.assistant-content');
  scrollToBottom();

  isGenerating = true;
  updateSendButton();

  const startedAt = Date.now();
  const { cleanText, modeOverride } = parseThinkingDirective(text);
  const highThinking =
    modeOverride === 'think' ? true : modeOverride === 'fast' ? false : Boolean(state.settings.highThinking);
  const lang = state.settings.language;
  const canResearchOnline =
    state.settings.webResearch && (typeof navigator === 'undefined' || navigator.onLine !== false);
  /** @type {string[]} */
  let thinkingSteps = [];
  let fullReply = '';

  if (highThinking && modeOverride === 'think') {
    thinkingSteps.push('[Mode] Activated /think override (Qwen3-MML deep reasoning)');
  }

  const resolveSingleSubtask = async (subQuery) => {
    const adv = solveAdvancedMathStepByStep(subQuery, lang);
    if (adv) {
      if (typeof adv.numericResult === 'number') chat.lastNumeric = adv.numericResult;
      return { reply: adv.reply, steps: adv.steps };
    }
    const off = generateOfflineReply(subQuery, lang, state.memory, addMemoryItem, state.learnedKnowledge);
    if (typeof off.numericResult === 'number') chat.lastNumeric = off.numericResult;
    if (off.kind === 'utility' || off.kind === 'chitchat') {
      return {
        reply: off.reply,
        steps: [
          off.kind === 'chitchat'
            ? `[Intent] Understood "${subQuery}" as human conversation`
            : `[Tool] Solved "${subQuery}" via deterministic utility engine`,
        ],
      };
    }
    if (canResearchOnline && needsBrowserResearch(subQuery)) {
      const res = await performBrowserResearch(subQuery, lang);
      if (res.ok) {
        if (res.results?.[0]?.title) recordTopic(chat, res.results[0].title);
        if (state.settings.autoLearn) {
          const entry = buildLearnedEntry(res);
          if (entry) learnFromResearch(entry);
        }
        return {
          reply: formatResearchMarkdown(subQuery, lang, res),
          steps: [`[Tool] Researched "${subQuery}" via browser knowledge sources`],
        };
      }
    }
    return { reply: off.reply, steps: [`[Tool] Resolved "${subQuery}" via offline MML knowledge`] };
  };

  const cleanupAbortedAssistant = () => {
    if (!assistantMsg.text) {
      chat.messages = chat.messages.filter((m) => m.id !== assistantMsg.id);
      rowEl.remove();
      saveChats();
    }
  };

  // Step 1: Check conversation-dependent context handlers (name recall, history, summary, math chaining)
  const contextDirect = resolveChatContextOffline(cleanText, chat, lang);
  if (contextDirect) {
    fullReply = contextDirect.reply;
    if (highThinking) {
      thinkingSteps.push('[Context] Checked active conversation memory and prompt history');
      thinkingSteps.push('[Solve] Resolved answer directly from current chat context');
    }
  } else {
    // Step 2: Check High-Thinking context transforms (simplify / bullet points / quiz) & advanced step-by-step math
    const transformRes = highThinking ? transformPreviousReply(cleanText, chat, lang) : null;
    const advMathRes = !transformRes && highThinking ? solveAdvancedMathStepByStep(cleanText, lang) : null;
    const compoundParts = !transformRes && !advMathRes && highThinking ? decomposeCompoundQuery(cleanText) : null;

    if (transformRes) {
      fullReply = transformRes.reply;
      thinkingSteps.push(...transformRes.steps);
    } else if (advMathRes) {
      fullReply = advMathRes.reply;
      if (typeof advMathRes.numericResult === 'number') {
        chat.lastNumeric = advMathRes.numericResult;
      }
      thinkingSteps.push(...advMathRes.steps);
    } else if (compoundParts) {
      const statusMsg = t().thinkingStatus || t().researching;
      contentEl.innerHTML = `<p class="researching-status">${escapeHtml(statusMsg)}</p>`;
      scrollToBottom();

      thinkingSteps.push(`[Plan] Decomposed compound prompt into 2 sub-tasks`);
      const [partOne, partTwo] = await Promise.all([
        resolveSingleSubtask(compoundParts[0]),
        resolveSingleSubtask(compoundParts[1]),
      ]);
      if (!isGenerating) {
        cleanupAbortedAssistant();
        return;
      }
      thinkingSteps.push(...partOne.steps, ...partTwo.steps);
      thinkingSteps.push('[Synthesis] Merged both verified sub-task results into one response');
      fullReply = `### 1. ${compoundParts[0]}\n${partOne.reply}\n\n---\n\n### 2. ${compoundParts[1]}\n${partTwo.reply}`;
    } else {
      // Step 3: Check dual-subject comparison query ("A vs B", "difference between A and B") when High Thinking is ON
      const compPair = highThinking ? parseComparisonQuery(cleanText) : null;
      if (compPair) {
        const statusMsg = t().thinkingStatus || t().researching;
        contentEl.innerHTML = `<p class="researching-status">${escapeHtml(statusMsg)}</p>`;
        scrollToBottom();

        const compRes = await runComparisonReasoning(compPair, lang, canResearchOnline, (q) =>
          generateOfflineReply(q, lang, state.memory, addMemoryItem, state.learnedKnowledge)
        );
        if (!isGenerating) {
          cleanupAbortedAssistant();
          return;
        }
        fullReply = compRes.reply;
        recordTopic(chat, compRes.topicLabel);
        thinkingSteps.push(...compRes.steps);
      } else {
        // Step 4: Structured Coder Templates + Offline MML + Browser Research + Qwen3 Deep Synthesis
        const offlineResult = generateOfflineReply(cleanText, lang, state.memory, addMemoryItem, state.learnedKnowledge);
        if (offlineResult.switchLang) {
          state.settings.language = offlineResult.switchLang;
          saveSettings();
          els.languageSelect.value = state.settings.language;
          els.settingLanguage.value = state.settings.language;
          chat._didSwitchLang = true;
        }
        if (typeof offlineResult.numericResult === 'number') {
          chat.lastNumeric = offlineResult.numericResult;
        }

        const isHumanChat = offlineResult.kind === 'chitchat';
        const isFollowUp = Boolean(chat.lastTopic) && !isHumanChat && isFollowUpReference(cleanText);
        const explicitResearch = isExplicitResearchRequest(cleanText);
        const researchNeeded = explicitResearch || isFollowUp || (!isHumanChat && needsBrowserResearch(cleanText));
        const coderReply =
          offlineResult.kind !== 'utility' && !isHumanChat ? generateStructuredCodeReply(cleanText, lang) : null;

        if (coderReply) {
          fullReply = coderReply.reply;
          recordTopic(chat, coderReply.topicLabel);
          if (highThinking) thinkingSteps.push(...coderReply.steps);
        } else {
          const shouldUseResearch = canResearchOnline && offlineResult.kind !== 'utility' && researchNeeded;

          fullReply = offlineResult.reply;

          if (shouldUseResearch) {
            const statusMsg = highThinking ? t().thinkingStatus || t().researching : t().researching;
            contentEl.innerHTML = `<p class="researching-status">${escapeHtml(statusMsg)}</p>`;
            scrollToBottom();

            if (isFollowUp && chat.lastTopic && !explicitResearch) {
              if (highThinking) {
                thinkingSteps.push(`[Context] Linked follow-up prompt to active chat topic "${chat.lastTopic}"`);
              }
              const followRes = await researchFollowUpOnTopic(cleanText, chat, state.settings.language);
              if (!isGenerating) {
                cleanupAbortedAssistant();
                return;
              }
              if (followRes.ok && followRes.reply) {
                fullReply = followRes.reply;
                if (followRes.nextTopic) recordTopic(chat, followRes.nextTopic);
                if (followRes.nextWikiLang) chat.lastWikiLang = followRes.nextWikiLang;
                if (typeof followRes.nextOffset === 'number') chat.lastExtractOffset = followRes.nextOffset;
                if (highThinking) {
                  thinkingSteps.push(`[Tool] Fetched next verified section on "${chat.lastTopic}"`);
                }
                if (state.settings.autoLearn && followRes.learnedEntry) {
                  learnFromResearch(followRes.learnedEntry);
                }
              } else {
                const research = await performBrowserResearch(`${chat.lastTopic} ${cleanText}`, state.settings.language);
                if (!isGenerating) {
                  cleanupAbortedAssistant();
                  return;
                }
                if (research.ok) {
                  fullReply = formatResearchMarkdown(
                    `${chat.lastTopic} — ${cleanText}`,
                    state.settings.language,
                    research
                  );
                  const resolvedTopic =
                    research.codeSnippet?.title ||
                    research.results?.[0]?.title ||
                    research.dictionary?.word ||
                    chat.lastTopic;
                  recordTopic(chat, resolvedTopic);
                  chat.lastWikiLang = research.wikiLang || chat.lastWikiLang || 'en';
                  if (highThinking) {
                    thinkingSteps.push(`[Tool] Researched combined topic "${chat.lastTopic} ${cleanText}" in browser`);
                  }
                  if (state.settings.autoLearn) {
                    const entry = buildLearnedEntry(research);
                    if (entry) learnFromResearch(entry);
                  }
                }
              }
            } else {
              const research = await performBrowserResearch(cleanText, state.settings.language);
              if (!isGenerating) {
                cleanupAbortedAssistant();
                return;
              }

              if (research.ok) {
                if (highThinking && !research.codeSnippet && research.results && research.results.length > 0) {
                  const deepSynth = await enhanceResearchWithThinking(
                    cleanText,
                    state.settings.language,
                    research,
                    chat
                  );
                  if (!isGenerating) {
                    cleanupAbortedAssistant();
                    return;
                  }
                  if (deepSynth) {
                    fullReply = deepSynth.markdown;
                    thinkingSteps.push(...deepSynth.steps);
                  } else {
                    fullReply = formatResearchMarkdown(cleanText, state.settings.language, research);
                  }
                } else {
                  fullReply = formatResearchMarkdown(cleanText, state.settings.language, research);
                  if (highThinking) {
                    if (research.codeSnippet) {
                      thinkingSteps.push(`[Tool] Researched browser coding references for "${research.codeSnippet.title}"`);
                    } else if (research.dictionary) {
                      thinkingSteps.push(`[Tool] Queried lexical definition for "${research.dictionary.word}"`);
                    } else if (research.results?.[0]) {
                      thinkingSteps.push(`[Tool] Matched live browser knowledge for "${research.results[0].title}"`);
                    }
                  }
                }

                if (research.codeSnippet?.title) {
                  recordTopic(chat, research.codeSnippet.title);
                  chat.lastWikiLang = research.wikiLang || 'en';
                  chat.lastExtractOffset = 1;
                } else if (research.results && research.results[0]) {
                  recordTopic(chat, research.results[0].title);
                  chat.lastWikiLang = research.wikiLang || 'en';
                  chat.lastExtractOffset = 1;
                } else if (research.dictionary?.word) {
                  recordTopic(chat, research.dictionary.word);
                  chat.lastWikiLang = 'en';
                  chat.lastExtractOffset = 1;
                }

                if (state.settings.autoLearn) {
                  const entry = buildLearnedEntry(research);
                  if (entry) {
                    learnFromResearch(entry);
                    if (highThinking) {
                      thinkingSteps.push(`[Memory] Saved "${entry.title}" into local offline knowledge`);
                    }
                  }
                }
              } else if (offlineResult.matched) {
                fullReply = offlineResult.reply;
                if (offlineResult.topicLabel) recordTopic(chat, offlineResult.topicLabel);
                if (highThinking) {
                  thinkingSteps.push('[Fallback] Browser research had no direct hit; scored offline MML model');
                  if (offlineResult.topicLabel) {
                    thinkingSteps.push(`[Knowledge] Matched trained module: "${offlineResult.topicLabel}"`);
                  }
                }
              } else {
                fullReply = formatResearchMarkdown(cleanText, state.settings.language, research);
                if (highThinking) {
                  thinkingSteps.push('[Search] No exact Wikipedia/offline match; generated verified web search links');
                }
              }
            }
          } else {
            if (offlineResult.kind === 'topic' && offlineResult.topicLabel) {
              recordTopic(chat, offlineResult.topicLabel);
            }
            if (!offlineResult.matched && !researchNeeded) {
              fullReply = buildIntentClarificationReply(cleanText, lang);
            }
            if (highThinking) {
              if (isHumanChat) {
                thinkingSteps.push('[Intent] Recognized human conversational phrase — skipped unnecessary web search');
                thinkingSteps.push('[Reply] Formulated natural conversational response directly');
              } else if (offlineResult.kind === 'utility') {
                thinkingSteps.push('[Tool] Solved deterministically via built-in math/utility engine');
              } else if (!offlineResult.matched && !researchNeeded) {
                thinkingSteps.push('[Intent] Carefully analyzed words — looks conversational or unclear rather than a factual query');
                thinkingSteps.push('[Reply] Asked for clarification instead of running unneeded web research');
              } else if (offlineResult.matched) {
                thinkingSteps.push(
                  `[Knowledge] Matched offline MML knowledge base${offlineResult.topicLabel ? ` (${offlineResult.topicLabel})` : ''}`
                );
              } else {
                thinkingSteps.push('[Offline] Analyzed prompt locally; Browser Research is disabled or offline');
              }
            }
          }
        }
      }
    }
  }

  // Qwen3-style Live Streaming Thought Process before streaming final response
  if (highThinking && thinkingSteps.length > 0) {
    assistantMsg.thinkingTrace = thinkingSteps;
    const liveThinkingEl = createThinkingElement(thinkingSteps, 0, { streaming: true });
    rowEl.insertBefore(liveThinkingEl, contentEl);
    contentEl.innerHTML = '';
    const stepListEl = liveThinkingEl.querySelector('.thinking-steps');

    for (const stepText of thinkingSteps) {
      if (!isGenerating) {
        cleanupAbortedAssistant();
        return;
      }
      if (stepListEl) appendThinkingStepItem(stepListEl, stepText);
      scrollToBottom();
      await new Promise((resolve) => {
        pendingSleepResolve = resolve;
        streamTimerId = setTimeout(() => {
          pendingSleepResolve = null;
          streamTimerId = null;
          resolve();
        }, 65);
      });
    }

    if (!isGenerating) {
      cleanupAbortedAssistant();
      return;
    }
    assistantMsg.thinkingDurationMs = Date.now() - startedAt;
    const finalizedThinkingEl = createThinkingElement(assistantMsg.thinkingTrace, assistantMsg.thinkingDurationMs, {
      streaming: false,
    });
    liveThinkingEl.replaceWith(finalizedThinkingEl);
  }

  if (isRtlText(fullReply)) contentEl.setAttribute('dir', 'rtl');

  const tokens = fullReply.split(/(\s+)/);
  let idx = 0;

  const tick = () => {
    if (!isGenerating) {
      saveChats();
      return;
    }
    const step = tokens.length > 60 ? 3 : 2;
    for (let i = 0; i < step && idx < tokens.length; i++, idx++) {
      assistantMsg.text += tokens[idx];
    }
    contentEl.innerHTML = renderMarkdown(assistantMsg.text);
    scrollToBottom();

    if (idx < tokens.length) {
      streamTimerId = setTimeout(tick, 22);
    } else {
      isGenerating = false;
      streamTimerId = null;
      chat.updatedAt = Date.now();
      saveChats();
      updateSendButton();
      // Re-bind action buttons with final text
      const freshRow = createMessageElement(assistantMsg);
      rowEl.replaceWith(freshRow);
      if (chat._didSwitchLang) {
        delete chat._didSwitchLang;
        applyLocalization();
      }
      scrollToBottom();

      if (state.settings.autoTts) {
        speakText(assistantMsg.text, assistantMsg.id);
      }
    }
  };

  streamTimerId = setTimeout(tick, 30);
}

/* =========================================================
   Voice Input (Web Speech API)
   ========================================================= */
function startVoiceInput() {
  const SpeechRecognitionCtor =
    /** @type {any} */ (window).SpeechRecognition || /** @type {any} */ (window).webkitSpeechRecognition;

  if (!SpeechRecognitionCtor) {
    showToast(t().micUnsupported);
    return;
  }

  if (isRecording) {
    stopVoiceInput();
    return;
  }

  stopSpeaking();

  try {
    recognition = new SpeechRecognitionCtor();
    recognition.lang = SPEECH_LOCALES[state.settings.language] || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    const baseText = els.promptInput.value.trim();
    let finalTranscript = '';

    recognition.onstart = () => {
      isRecording = true;
      els.micBtn.classList.add('recording');
      els.voiceStatusText.textContent = t().listening;
      els.voiceStatusBanner.classList.remove('hidden');
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      const combined = [baseText, (finalTranscript || interim).trim()].filter(Boolean).join(' ');
      els.promptInput.value = combined;
      autoResizeInput();
      updateSendButton();
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        showToast(t().micDenied);
      }
      cleanupRecording();
    };

    recognition.onend = () => {
      const hadText = els.promptInput.value.trim().length > 0;
      cleanupRecording();
      if (hadText && state.settings.voiceAutoSend) {
        submitPrompt();
      } else {
        els.promptInput.focus();
      }
    };

    recognition.start();
  } catch {
    cleanupRecording();
    showToast(t().micUnsupported);
  }
}

function stopVoiceInput() {
  if (recognition && isRecording) {
    try {
      recognition.stop();
    } catch {
      cleanupRecording();
    }
  }
}

function cleanupRecording() {
  isRecording = false;
  els.micBtn.classList.remove('recording');
  els.voiceStatusBanner.classList.add('hidden');
}

/* =========================================================
   Text-to-Speech (SpeechSynthesis API + Hindi Resilience)
   ========================================================= */
let speechSessionToken = 0;
let speechStartTimer = null;
let notifiedNoHindiVoice = false;

const DEVANAGARI_CONSONANTS = {
  क: 'k', ख: 'kh', ग: 'g', घ: 'gh', ङ: 'ng',
  च: 'ch', छ: 'chh', ज: 'j', झ: 'jh', ञ: 'ny',
  ट: 't', ठ: 'th', ड: 'd', ढ: 'dh', ण: 'n',
  त: 't', थ: 'th', द: 'd', ध: 'dh', न: 'n',
  प: 'p', फ: 'ph', ब: 'b', भ: 'bh', म: 'm',
  य: 'y', र: 'r', ल: 'l', व: 'v',
  श: 'sh', ष: 'sh', स: 's', ह: 'h',
  क़: 'q', ख़: 'kh', ग़: 'gh', ज़: 'z', ड़: 'r', ढ़: 'rh', फ़: 'f', य़: 'y',
  ळ: 'l',
};

const DEVANAGARI_VOWELS = {
  अ: 'a', आ: 'aa', इ: 'i', ई: 'ee', उ: 'u', ऊ: 'oo', ऋ: 'ri',
  ए: 'e', ऐ: 'ai', ओ: 'o', औ: 'au', ऑ: 'o',
};

const DEVANAGARI_MATRAS = {
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ॉ': 'o', 'ॅ': 'e',
};

const DEVANAGARI_DIGITS = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
};

/**
 * Phonetic Devanagari-to-Latin fallback when a device/browser has zero Hindi TTS voices installed.
 * @param {string} input
 * @returns {string}
 */
function transliterateDevanagariToPhonetic(input) {
  const normalized = input.replace(/[।॥]/g, '. ');
  const chars = Array.from(normalized);
  let out = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1] || '';

    // Handle nukta combinations (consonant + \u093C)
    if (next === '\u093C' && DEVANAGARI_CONSONANTS[ch + next]) {
      const comb = DEVANAGARI_CONSONANTS[ch + next];
      i++;
      const after = chars[i + 1] || '';
      if (after === '्') {
        out += comb;
        i++;
      } else if (DEVANAGARI_MATRAS[after]) {
        out += comb + DEVANAGARI_MATRAS[after];
        i++;
      } else {
        const isWordEnd = !after || /[\s.,!?;:()\-"'ंँः]/.test(after);
        out += isWordEnd ? comb : comb + 'a';
      }
      continue;
    }

    if (DEVANAGARI_CONSONANTS[ch]) {
      const base = DEVANAGARI_CONSONANTS[ch];
      if (next === '्') {
        out += base;
        i++;
      } else if (DEVANAGARI_MATRAS[next]) {
        out += base + DEVANAGARI_MATRAS[next];
        i++;
      } else {
        const prev = i > 0 ? chars[i - 1] : '';
        const isFirst = !prev || /[\s.,!?;:()\-"']/.test(prev);
        const isWordEnd = !next || /[\s.,!?;:()\-"'ंँः]/.test(next);
        out += !isFirst && isWordEnd ? base : base + 'a';
      }
    } else if (DEVANAGARI_VOWELS[ch]) {
      out += DEVANAGARI_VOWELS[ch];
    } else if (ch === 'ं' || ch === 'ँ') {
      out += 'n';
    } else if (ch === 'ः') {
      out += 'h';
    } else if (DEVANAGARI_DIGITS[ch]) {
      out += DEVANAGARI_DIGITS[ch];
    } else if (ch !== '\u093C' && ch !== '्') {
      out += ch;
    }
  }

  return out
    .replace(/\bmain\b/gi, 'main')
    .replace(/\bhoon\b/gi, 'hoon')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTextForSpeech(markdown) {
  return markdown
    .replace(/\n*####\s+(?:Sources?|स्रोत|Fuentes|المصادر)[^\n]*[\s\S]*$/i, '')
    .replace(/```[\s\S]*?```/g, ' code snippet ')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
    .replace(/\[\d+\]/g, '')
    .replace(/\(\s*\/[^/]+\/\s*\)/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#>*_]/g, '')
    .replace(/[।॥]/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSpeechChunks(text, maxLen = 160) {
  const sentences = text.split(/(?<=[.!?।])\s+|\n+/).filter(Boolean);
  const chunks = [];
  for (const s of sentences) {
    if (s.length <= maxLen) {
      chunks.push(s);
    } else {
      const words = s.split(/\s+/);
      let cur = '';
      for (const w of words) {
        if ((cur + ' ' + w).trim().length > maxLen && cur) {
          chunks.push(cur.trim());
          cur = w;
        } else {
          cur = (cur + ' ' + w).trim();
        }
      }
      if (cur) chunks.push(cur.trim());
    }
  }
  return chunks.length > 0 ? chunks : [text];
}

function getVoicesReady() {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
    setTimeout(finish, 300);
  });
}

function findBestVoice(voices, targetLocale) {
  const lowerTarget = targetLocale.toLowerCase();
  const prefix = lowerTarget.split('-')[0];
  return (
    voices.find((v) => v.lang.toLowerCase() === lowerTarget) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
    (prefix === 'hi'
      ? voices.find((v) => /hindi|हिन्दी|lekha|swara|madhur/i.test(v.name))
      : null) ||
    null
  );
}

function stopSpeaking() {
  speechSessionToken++;
  if (speechStartTimer) {
    clearTimeout(speechStartTimer);
    speechStartTimer = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  activeSpeechMsgId = null;
  updateSpeakButtonsUI();
}

function updateSpeakButtonsUI() {
  const rows = els.messagesContainer.querySelectorAll('.message-row--assistant');
  for (const row of rows) {
    const id = row.getAttribute('data-msg-id');
    const btn = row.querySelector('[data-action="speak"]');
    if (!btn) continue;
    const active = id === activeSpeechMsgId;
    btn.classList.toggle('speaking', active);
    btn.innerHTML = getSpeakBtnHtml(active);
  }
}

async function speakText(text, msgId) {
  if (!('speechSynthesis' in window)) {
    showToast(t().ttsUnsupported);
    return;
  }

  stopSpeaking();
  const myToken = speechSessionToken;

  let cleaned = cleanTextForSpeech(text);
  if (!cleaned) return;

  const hasDevanagari = /[\u0900-\u097F]/.test(cleaned);
  const hasArabic = /[\u0600-\u06FF]/.test(cleaned);

  let targetLocale = SPEECH_LOCALES[state.settings.language] || 'en-US';
  if (hasDevanagari) targetLocale = 'hi-IN';
  else if (hasArabic) targetLocale = 'ar-SA';

  const voices = await getVoicesReady();
  if (myToken !== speechSessionToken) return;

  let chosenVoice = findBestVoice(voices, targetLocale);

  // If Devanagari Hindi is present but browser/OS has zero Hindi voices installed,
  // use phonetic transliteration with Indian English / English voice so it never stays silent.
  if (hasDevanagari && !chosenVoice) {
    cleaned = transliterateDevanagariToPhonetic(cleaned);
    targetLocale = 'en-IN';
    chosenVoice =
      findBestVoice(voices, 'en-IN') ||
      findBestVoice(voices, 'en-GB') ||
      findBestVoice(voices, 'en-US') ||
      voices[0] ||
      null;

    if (!notifiedNoHindiVoice) {
      notifiedNoHindiVoice = true;
      showToast(t().ttsNoHindiVoice);
    }
  }

  const chunks = splitSpeechChunks(cleaned);
  activeSpeechMsgId = msgId;
  updateSpeakButtonsUI();

  const speakChunkAt = (index) => {
    if (myToken !== speechSessionToken) return;
    if (index >= chunks.length) {
      activeSpeechMsgId = null;
      updateSpeakButtonsUI();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = targetLocale;
    utterance.rate = Number(state.settings.speechRate) || 1;
    if (chosenVoice) utterance.voice = chosenVoice;

    utterance.onend = () => {
      if (myToken !== speechSessionToken) return;
      speakChunkAt(index + 1);
    };

    utterance.onerror = () => {
      if (myToken !== speechSessionToken) return;
      activeSpeechMsgId = null;
      updateSpeakButtonsUI();
    };

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  speechStartTimer = setTimeout(() => {
    speechStartTimer = null;
    speakChunkAt(0);
  }, 45);
}

function toggleSpeakMessage(msg) {
  if (activeSpeechMsgId === msg.id) {
    stopSpeaking();
  } else {
    speakText(msg.text, msg.id);
  }
}

/* =========================================================
   Sidebar & Modal Controls
   ========================================================= */
function isMobileViewport() {
  return window.innerWidth <= 820;
}

function openMobileSidebar() {
  els.sidebar.classList.add('sidebar--open');
  els.sidebarBackdrop.classList.add('visible');
}

function closeMobileSidebar() {
  els.sidebar.classList.remove('sidebar--open');
  els.sidebarBackdrop.classList.remove('visible');
}

function toggleSidebar() {
  if (isMobileViewport()) {
    if (els.sidebar.classList.contains('sidebar--open')) closeMobileSidebar();
    else openMobileSidebar();
  } else {
    els.sidebar.classList.toggle('sidebar--collapsed');
  }
}

function openModal(tab = 'settings') {
  els.modalOverlay.classList.remove('hidden');
  switchModalTab(tab);
  closeMobileSidebar();
}

function closeModal() {
  els.modalOverlay.classList.add('hidden');
}

function switchModalTab(tab) {
  const isSettings = tab === 'settings';
  els.tabSettings.classList.toggle('active', isSettings);
  els.tabMemory.classList.toggle('active', !isSettings);
  els.tabSettings.setAttribute('aria-selected', String(isSettings));
  els.tabMemory.setAttribute('aria-selected', String(!isSettings));
  els.panelSettings.classList.toggle('hidden', !isSettings);
  els.panelMemory.classList.toggle('hidden', isSettings);
}

function renderMemoryList() {
  els.memoryList.innerHTML = '';
  if (state.memory.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'history-empty';
    empty.textContent = t().memoryEmpty;
    els.memoryList.appendChild(empty);
    return;
  }

  for (const item of state.memory) {
    const card = document.createElement('div');
    card.className = 'memory-item';

    const info = document.createElement('div');
    info.innerHTML = `<div class="memory-item-q">${escapeHtml(item.question)}</div><div class="memory-item-a">${escapeHtml(
      item.answer
    )}</div>`;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'memory-delete-btn';
    delBtn.setAttribute('aria-label', 'Delete memory item');
    delBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>';
    delBtn.addEventListener('click', () => {
      state.memory = state.memory.filter((m) => m.id !== item.id);
      saveMemory();
      renderMemoryList();
    });

    card.append(info, delBtn);
    els.memoryList.appendChild(card);
  }
}

function renderLearnedList() {
  els.learnedList.innerHTML = '';
  els.clearLearnedBtn.disabled = state.learnedKnowledge.length === 0;
  if (state.learnedKnowledge.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'history-empty';
    empty.textContent = t().learnedEmpty;
    els.learnedList.appendChild(empty);
    return;
  }

  for (const item of state.learnedKnowledge) {
    const card = document.createElement('div');
    card.className = 'memory-item';

    const preview =
      item.summary.length > 140 ? `${item.summary.slice(0, 140).trim()}...` : item.summary;

    const info = document.createElement('div');
    info.innerHTML = `<div class="memory-item-q">${escapeHtml(item.title)}</div><div class="memory-item-a">${escapeHtml(
      preview
    )}</div>`;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'memory-delete-btn';
    delBtn.setAttribute('aria-label', `Delete ${item.title}`);
    delBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>';
    delBtn.addEventListener('click', () => {
      state.learnedKnowledge = state.learnedKnowledge.filter((x) => x.id !== item.id);
      saveLearnedKnowledge();
      renderLearnedList();
    });

    card.append(info, delBtn);
    els.learnedList.appendChild(card);
  }
}

/* =========================================================
   Event Wiring & Splash Sequence
   ========================================================= */
function bindEvents() {
  els.toggleSidebarBtn.addEventListener('click', toggleSidebar);
  els.closeSidebarMobileBtn.addEventListener('click', closeMobileSidebar);
  els.sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  els.brandHomeBtn.addEventListener('click', startNewChat);
  els.newChatBtn.addEventListener('click', startNewChat);
  els.chatSearchInput.addEventListener('input', renderChatHistory);

  els.languageSelect.addEventListener('change', (e) => {
    state.settings.language = /** @type {HTMLSelectElement} */ (e.target).value;
    saveSettings();
    applyLocalization();
  });

  els.settingLanguage.addEventListener('change', (e) => {
    state.settings.language = /** @type {HTMLSelectElement} */ (e.target).value;
    saveSettings();
    applyLocalization();
  });

  els.modelModeSelect?.addEventListener('change', (e) => {
    state.settings.highThinking = /** @type {HTMLSelectElement} */ (e.target).value === 'think';
    saveSettings();
    applyLocalization();
  });

  els.thinkingToggleBtn?.addEventListener('click', () => {
    state.settings.highThinking = !state.settings.highThinking;
    saveSettings();
    applyLocalization();
  });

  els.settingHighThinking?.addEventListener('change', (e) => {
    state.settings.highThinking = /** @type {HTMLInputElement} */ (e.target).checked;
    saveSettings();
    applyLocalization();
  });

  els.researchToggleBtn.addEventListener('click', () => {
    state.settings.webResearch = !state.settings.webResearch;
    saveSettings();
    applyLocalization();
  });

  els.settingWebResearch.addEventListener('change', (e) => {
    state.settings.webResearch = /** @type {HTMLInputElement} */ (e.target).checked;
    saveSettings();
    applyLocalization();
  });

  els.settingAutoLearn.addEventListener('change', (e) => {
    state.settings.autoLearn = /** @type {HTMLInputElement} */ (e.target).checked;
    saveSettings();
    applyLocalization();
  });

  els.autoTtsBtn.addEventListener('click', () => {
    state.settings.autoTts = !state.settings.autoTts;
    if (!state.settings.autoTts) stopSpeaking();
    saveSettings();
    applyLocalization();
  });

  els.settingAutoTts.addEventListener('change', (e) => {
    state.settings.autoTts = /** @type {HTMLInputElement} */ (e.target).checked;
    if (!state.settings.autoTts) stopSpeaking();
    saveSettings();
    applyLocalization();
  });

  els.settingVoiceAutoSend.addEventListener('change', (e) => {
    state.settings.voiceAutoSend = /** @type {HTMLInputElement} */ (e.target).checked;
    saveSettings();
  });

  els.settingSpeechRate.addEventListener('change', (e) => {
    state.settings.speechRate = Number(/** @type {HTMLSelectElement} */ (e.target).value);
    saveSettings();
  });

  els.testVoiceBtn.addEventListener('click', () => {
    const samples = {
      en: 'Hello! AirAI voice output is working smoothly.',
      hi: 'नमस्ते! AirAI अब हिन्दी में बोलने के लिए तैयार है।',
      hinglish: 'Namaste! AirAI ab Hindi aur English dono mein bol sakta hai.',
      es: '¡Hola! La voz de AirAI funciona correctamente.',
      fr: 'Bonjour ! La synthèse vocale de AirAI fonctionne bien.',
      ar: 'مرحباً! الصوت في AirAI يعمل بشكل ممتاز.',
    };
    const sample = samples[state.settings.language] || samples.en;
    speakText(sample, 'test_voice');
  });

  els.themeToggleBtn.addEventListener('click', () => {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings();
    applyTheme();
  });

  els.clearAllChatsBtn.addEventListener('click', () => {
    stopStreaming();
    stopSpeaking();
    state.chats = [];
    state.activeChatId = null;
    saveChats();
    renderChatHistory();
    renderActiveChat();
    closeModal();
    showToast(t().confirmClear);
  });

  els.openSettingsBtn.addEventListener('click', () => openModal('settings'));
  els.openMemoryBtn.addEventListener('click', () => openModal('memory'));
  els.modalCloseBtn.addEventListener('click', closeModal);
  els.modalOverlay.addEventListener('click', (e) => {
    if (e.target === els.modalOverlay) closeModal();
  });
  els.tabSettings.addEventListener('click', () => switchModalTab('settings'));
  els.tabMemory.addEventListener('click', () => switchModalTab('memory'));

  els.memoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = els.memoryQInput.value.trim();
    const a = els.memoryAInput.value.trim();
    if (!q || !a) return;
    addMemoryItem(q, a);
    els.memoryQInput.value = '';
    els.memoryAInput.value = '';
  });

  els.clearLearnedBtn.addEventListener('click', () => {
    state.learnedKnowledge = [];
    saveLearnedKnowledge();
    renderLearnedList();
  });

  els.promptInput.addEventListener('input', () => {
    autoResizeInput();
    updateSendButton();
  });

  els.promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!els.sendBtn.disabled) submitPrompt();
    }
  });

  els.chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitPrompt();
  });

  els.micBtn.addEventListener('click', startVoiceInput);
  els.voiceStopBtn.addEventListener('click', stopVoiceInput);

  // Delegate code block copy button clicks
  els.messagesContainer.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    const btn = target.closest('.code-copy-btn');
    if (!btn) return;
    const rawCode = decodeURIComponent(btn.getAttribute('data-code') || '');
    navigator.clipboard
      .writeText(rawCode)
      .then(() => {
        btn.textContent = t().copied;
        setTimeout(() => {
          btn.textContent = t().copy;
        }, 1500);
      })
      .catch(() => {});
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !els.modalOverlay.classList.contains('hidden')) {
      closeModal();
    }
  });

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

function runSplashTransition() {
  setTimeout(() => {
    els.splashScreen.classList.add('splash-screen--exit');
    els.appShell.classList.remove('app-shell--hidden');
    setTimeout(() => {
      els.splashScreen.classList.add('hidden');
    }, 420);
  }, 1250);
}

function saveConsent(choice) {
  try {
    localStorage.setItem(STORAGE_KEYS.consent, JSON.stringify({ choice, updatedAt: Date.now() }));
  } catch {
    // Ignore storage errors
  }
  els.consentBanner?.classList.add('hidden');
}

function initConsentBanner() {
  if (!els.consentBanner) return;
  els.consentAcceptBtn?.addEventListener('click', () => saveConsent('all'));
  els.consentEssentialBtn?.addEventListener('click', () => saveConsent('essential'));
  els.openConsentBtn?.addEventListener('click', () => {
    els.consentBanner?.classList.remove('hidden');
  });

  let hasConsent = false;
  try {
    hasConsent = Boolean(localStorage.getItem(STORAGE_KEYS.consent));
  } catch {
    hasConsent = false;
  }
  if (!hasConsent) {
    setTimeout(() => {
      els.consentBanner?.classList.remove('hidden');
    }, 1700);
  }
}

function init() {
  loadFromStorage();
  applyTheme();
  applyLocalization();
  bindEvents();
  initConsentBanner();
  updateSendButton();
  runSplashTransition();
}

init();
