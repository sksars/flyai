// Lightweight theme sync & interactive contact form handler for legal/info pages
(function initLegalPage() {
  try {
    const raw = localStorage.getItem('myai_settings_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  } catch {
    // Ignore storage read errors
  }

  const themeBtn = document.getElementById('legal-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      try {
        const raw = localStorage.getItem('myai_settings_v1');
        const settings = raw ? JSON.parse(raw) : {};
        settings.theme = isDark ? 'dark' : 'light';
        localStorage.setItem('myai_settings_v1', JSON.stringify(settings));
      } catch {
        // Ignore storage write errors
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-status');
  if (contactForm && statusEl) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = /** @type {HTMLInputElement | null} */ (document.getElementById('contact-name'));
      const emailInput = /** @type {HTMLInputElement | null} */ (document.getElementById('contact-email'));
      const topicSelect = /** @type {HTMLSelectElement | null} */ (document.getElementById('contact-topic'));
      const messageInput = /** @type {HTMLTextAreaElement | null} */ (document.getElementById('contact-message'));

      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const topic = topicSelect?.value || 'General Feedback';
      const message = messageInput?.value.trim() || '';

      if (!name || !email || !message) return;

      const subject = encodeURIComponent(`[MyAI] ${topic} from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nReply Email: ${email}\nTopic: ${topic}\n\n${message}`);
      const mailtoLink = /** @type {HTMLAnchorElement | null} */ (document.getElementById('contact-mailto-link'));
      if (mailtoLink) {
        mailtoLink.href = `mailto:contact@myai-assistant.example?subject=${subject}&body=${body}`;
        mailtoLink.classList.remove('hidden');
      }

      statusEl.textContent =
        'Thank you! Your message has been prepared. Click "Open in Email App" below to send it directly to the site administrator.';
      statusEl.classList.remove('hidden');
    });
  }
})();
