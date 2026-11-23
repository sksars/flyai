/**
 * MyAI Offline Multilingual Knowledge Engine & UI Localization
 * Runs 100% client-side with zero server calls.
 */

export const SPEECH_LOCALES = {
  en: 'en-US',
  hi: 'hi-IN',
  hinglish: 'en-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  ar: 'ar-SA',
};

export const UI_TEXT = {
  en: {
    splashSubtitle: 'Offline Multilingual Assistant',
    newChat: 'New Chat',
    searchPlaceholder: 'Search chats...',
    noChats: 'No saved chats yet',
    today: 'Today',
    yesterday: 'Yesterday',
    earlier: 'Earlier',
    memoryBtn: 'Custom Memory',
    settingsBtn: 'Settings',
    welcomeHeading: 'How can I help you today?',
    welcomeSubheading:
      'Ask questions, solve math, write code, or speak using your microphone — completely offline.',
    placeholder: 'Message MyAI...',
    footnote: 'MyAI runs offline in your browser · Chats saved in local storage',
    listening: 'Listening... speak now',
    stop: 'Stop',
    copy: 'Copy',
    copied: 'Copied',
    speak: 'Listen',
    stopSpeaking: 'Stop',
    settingsTitle: 'Settings',
    tabPrefs: 'Preferences',
    tabMemory: 'Custom Memory',
    langLabel: 'Assistant Language',
    langDesc: 'Controls UI text, replies, voice recognition, and speech voice.',
    autoTtsLabel: 'Auto-Speak Replies',
    autoTtsDesc: 'Automatically read MyAI responses aloud after replying.',
    autoSendLabel: 'Auto-Send Voice Input',
    autoSendDesc: 'Automatically submit your spoken question when recording ends.',
    rateLabel: 'Speech Speed',
    rateDesc: 'Adjust text-to-speech playback speed.',
    clearChatsLabel: 'Clear All Conversations',
    clearChatsDesc: 'Delete every saved chat thread from local storage.',
    clearChatsBtn: 'Clear All',
    memoryIntro:
      'Teach MyAI custom answers or facts offline. When you ask a matching question, MyAI will use your saved knowledge.',
    memoryQPlaceholder: 'Question or keyword (e.g. my wifi password)',
    memoryAPlaceholder: 'Answer MyAI should remember...',
    memorySaveBtn: 'Save to Offline Memory',
    memoryEmpty: 'No custom memories saved yet.',
    micUnsupported: 'Voice input is not supported in this browser. Try Chrome or Edge.',
    micDenied: 'Microphone permission was denied. Please allow mic access in your browser.',
    ttsUnsupported: 'Text-to-speech is not supported in this browser.',
    confirmClear: 'Cleared all saved conversations.',
    researchBtn: 'Web Research',
    researching: 'Researching in browser...',
    researchSettingLabel: 'Browser Research Mode',
    researchSettingDesc: 'Fetch live web summaries when online for unknown topics or search queries.',
    ttsNoHindiVoice: 'No Hindi voice installed in this browser — using phonetic speech.',
    testVoiceBtn: 'Test Voice',
    autoLearnLabel: 'Learn from Browser Research',
    autoLearnDesc: 'Automatically save researched facts into local storage for future offline chats.',
    learnedHeading: 'Learned from Browser',
    learnedEmpty: 'No topics learned from browser research yet.',
    clearLearnedBtn: 'Clear',
    thinkingBtn: 'High Thinking MML',
    thinkingStatus: 'Thinking deeply (MML)...',
    thinkingLabel: 'High Thinking Model (MML)',
    thinkingDesc: 'Enable multi-step reasoning, step-by-step math, dual comparisons, and deep synthesis.',
    thinkingSummaryLabel: 'MML Reasoning',
    thinkingStepsWord: 'steps',
  },
  hi: {
    splashSubtitle: 'ऑफ़लाइन बहुभाषी सहायक',
    newChat: 'नई चैट',
    searchPlaceholder: 'चैट खोजें...',
    noChats: 'अभी कोई सहेजी गई चैट नहीं है',
    today: 'आज',
    yesterday: 'कल',
    earlier: 'पहले',
    memoryBtn: 'कस्टम मेमोरी',
    settingsBtn: 'सेटिंग्स',
    welcomeHeading: 'आज मैं आपकी क्या मदद कर सकता हूँ?',
    welcomeSubheading:
      'सवाल पूछें, गणित हल करें, कोड लिखें, या माइक से बोलकर पूछें — पूरी तरह ऑफ़लाइन।',
    placeholder: 'MyAI को संदेश लिखें...',
    footnote: 'MyAI आपके ब्राउज़र में ऑफ़लाइन चलता है · चैट लोकल स्टोरेज में सहेजी जाती है',
    listening: 'सुन रहा हूँ... अब बोलें',
    stop: 'रोकें',
    copy: 'कॉपी',
    copied: 'कॉपी हो गया',
    speak: 'सुनें',
    stopSpeaking: 'रोकें',
    settingsTitle: 'सेटिंग्स',
    tabPrefs: 'प्राथमिकताएँ',
    tabMemory: 'कस्टम मेमोरी',
    langLabel: 'सहायक की भाषा',
    langDesc: 'UI टेक्स्ट, उत्तर, वॉइस इनपुट और बोलने की भाषा नियंत्रित करता है।',
    autoTtsLabel: 'उत्तर अपने-आप बोलें',
    autoTtsDesc: 'जवाब आने के बाद MyAI उत्तर को खुद पढ़कर सुनाएगा।',
    autoSendLabel: 'वॉइस इनपुट ऑटो-सबमिट',
    autoSendDesc: 'बोलना समाप्त होने पर सवाल अपने-आप भेजें।',
    rateLabel: 'बोलने की गति',
    rateDesc: 'टेक्स्ट-टू-स्पीच की गति चुनें।',
    clearChatsLabel: 'सभी चैट हटाएँ',
    clearChatsDesc: 'लोकल स्टोरेज से सभी सहेजी गई बातचीत हटाएँ।',
    clearChatsBtn: 'सब हटाएँ',
    memoryIntro:
      'MyAI को ऑफ़लाइन नई बातें सिखाएँ। जब आप मिलता-जुलता सवाल पूछेंगे, तो MyAI आपकी सहेजी गई जानकारी से जवाब देगा।',
    memoryQPlaceholder: 'सवाल या कीवर्ड (जैसे: मेरा वाईफाई पासवर्ड)',
    memoryAPlaceholder: 'जवाब जो MyAI को याद रखना है...',
    memorySaveBtn: 'ऑफ़लाइन मेमोरी में सहेजें',
    memoryEmpty: 'अभी कोई कस्टम मेमोरी सहेजी नहीं गई है।',
    micUnsupported: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। Chrome या Edge आज़माएँ।',
    micDenied: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक की अनुमति दें।',
    ttsUnsupported: 'इस ब्राउज़र में टेक्स्ट-टू-स्पीच उपलब्ध नहीं है।',
    confirmClear: 'सभी सहेजी गई चैट हटा दी गईं।',
    researchBtn: 'ब्राउज़र रिसर्च',
    researching: 'ब्राउज़र में रिसर्च हो रही है...',
    researchSettingLabel: 'ब्राउज़र रिसर्च मोड',
    researchSettingDesc: 'ऑनलाइन होने पर अज्ञात विषयों के लिए लाइव वेब जानकारी खोजें।',
    ttsNoHindiVoice: 'इस ब्राउज़र में हिन्दी वॉइस उपलब्ध नहीं है — फ़ोनेटिक आवाज़ में बोल रहा हूँ।',
    testVoiceBtn: 'आवाज़ जाँचें',
    autoLearnLabel: 'ब्राउज़र रिसर्च से सीखें',
    autoLearnDesc: 'भविष्य की ऑफ़लाइन चैट के लिए रिसर्च की गई जानकारी को अपने-आप लोकल स्टोरेज में सहेजें।',
    learnedHeading: 'ब्राउज़र से सीखी गई जानकारी',
    learnedEmpty: 'अभी ब्राउज़र रिसर्च से कोई विषय नहीं सीखा गया है।',
    clearLearnedBtn: 'साफ़ करें',
    thinkingBtn: 'हाई थिंकिंग MML',
    thinkingStatus: 'गहन विश्लेषण हो रहा है (MML)...',
    thinkingLabel: 'हाई थिंकिंग मॉडल (MML)',
    thinkingDesc: 'मल्टी-स्टेप रीज़निंग, चरणबद्ध गणित, तुलना और गहन रिसर्च संश्लेषण चालू करें।',
    thinkingSummaryLabel: 'MML विचार प्रक्रिया',
    thinkingStepsWord: 'चरण',
  },
  hinglish: {
    splashSubtitle: 'Offline Multilingual Assistant',
    newChat: 'Nayi Chat',
    searchPlaceholder: 'Chats search karein...',
    noChats: 'Abhi koi saved chat nahi hai',
    today: 'Aaj',
    yesterday: 'Kal',
    earlier: 'Purani Chats',
    memoryBtn: 'Custom Memory',
    settingsBtn: 'Settings',
    welcomeHeading: 'Aaj main aapki kya madad kar sakta hoon?',
    welcomeSubheading:
      'Sawal poochein, math solve karein, code likhein, ya mic se bolkar poochein — bina internet aur server ke.',
    placeholder: 'MyAI ko message likhein...',
    footnote: 'MyAI offline local storage par chalta hai · Bina server ke',
    listening: 'Sun raha hoon... ab bolein',
    stop: 'Rokein',
    copy: 'Copy',
    copied: 'Copied',
    speak: 'Sunein',
    stopSpeaking: 'Stop',
    settingsTitle: 'Settings',
    tabPrefs: 'Preferences',
    tabMemory: 'Custom Memory',
    langLabel: 'Assistant Language',
    langDesc: 'UI text, jawab, voice input aur bolne ki language set karta hai.',
    autoTtsLabel: 'Auto-Speak Replies',
    autoTtsDesc: 'Jawab aane ke baad MyAI apne aap bolkar sunayega.',
    autoSendLabel: 'Auto-Send Voice Input',
    autoSendDesc: 'Bolna khatam hone par sawal apne aap send ho jayega.',
    rateLabel: 'Speech Speed',
    rateDesc: 'Text-to-speech bolne ki speed adjust karein.',
    clearChatsLabel: 'Saari Chats Delete Karein',
    clearChatsDesc: 'Local storage se sabhi saved chats delete karein.',
    clearChatsBtn: 'Clear All',
    memoryIntro:
      'MyAI ko offline naye answers sikhayein. Jab aap waisa sawal poochenge toh MyAI aapke saved data se jawab dega.',
    memoryQPlaceholder: 'Sawal ya keyword (jaise: mera exam date)',
    memoryAPlaceholder: 'Jawab jo MyAI yaad rakhe...',
    memorySaveBtn: 'Offline Memory Mein Save Karein',
    memoryEmpty: 'Abhi koi custom memory save nahi hai.',
    micUnsupported: 'Is browser mein voice input support nahi hai. Chrome ya Edge use karein.',
    micDenied: 'Microphone permission deny ho gayi. Browser settings se mic allow karein.',
    ttsUnsupported: 'Is browser mein text-to-speech support nahi hai.',
    confirmClear: 'Saari chats clear kar di gayi hain.',
    researchBtn: 'Browser Research',
    researching: 'Browser mein research kar raha hoon...',
    researchSettingLabel: 'Browser Research Mode',
    researchSettingDesc: 'Online hone par naye topics aur search sawalo ke liye live web summary laye.',
    ttsNoHindiVoice: 'Browser mein Hindi voice nahi mili — phonetic speech use ho rahi hai.',
    testVoiceBtn: 'Test Voice',
    autoLearnLabel: 'Browser Research Se Seekhein',
    autoLearnDesc: 'Research se mili jaankari ko offline chats ke liye local storage mein save karein.',
    learnedHeading: 'Browser Se Seekha Hua',
    learnedEmpty: 'Abhi browser research se koi topic save nahi hua hai.',
    clearLearnedBtn: 'Clear',
    thinkingBtn: 'High Thinking MML',
    thinkingStatus: 'Deep thinking chal rahi hai (MML)...',
    thinkingLabel: 'High Thinking Model (MML)',
    thinkingDesc: 'Multi-step reasoning, step-by-step math, comparison aur deep browser synthesis on rakhein.',
    thinkingSummaryLabel: 'MML Thinking Process',
    thinkingStepsWord: 'steps',
  },
  es: {
    splashSubtitle: 'Asistente Multilingüe Sin Conexión',
    newChat: 'Nuevo Chat',
    searchPlaceholder: 'Buscar chats...',
    noChats: 'Aún no hay chats guardados',
    today: 'Hoy',
    yesterday: 'Ayer',
    earlier: 'Anteriores',
    memoryBtn: 'Memoria Personal',
    settingsBtn: 'Ajustes',
    welcomeHeading: '¿En qué puedo ayudarte hoy?',
    welcomeSubheading:
      'Haz preguntas, resuelve matemáticas, escribe código o usa el micrófono — totalmente sin conexión.',
    placeholder: 'Escribe a MyAI...',
    footnote: 'MyAI funciona sin conexión en tu navegador · Guardado localmente',
    listening: 'Escuchando... habla ahora',
    stop: 'Detener',
    copy: 'Copiar',
    copied: 'Copiado',
    speak: 'Escuchar',
    stopSpeaking: 'Detener',
    settingsTitle: 'Ajustes',
    tabPrefs: 'Preferencias',
    tabMemory: 'Memoria Personal',
    langLabel: 'Idioma del Asistente',
    langDesc: 'Controla la interfaz, las respuestas, el dictado y la voz.',
    autoTtsLabel: 'Leer Respuestas Automáticamente',
    autoTtsDesc: 'Reproduce en voz alta las respuestas de MyAI al terminar.',
    autoSendLabel: 'Enviar Voz Automáticamente',
    autoSendDesc: 'Envía tu pregunta automáticamente al terminar de hablar.',
    rateLabel: 'Velocidad de Voz',
    rateDesc: 'Ajusta la velocidad de lectura en voz alta.',
    clearChatsLabel: 'Borrar Todas las Conversaciones',
    clearChatsDesc: 'Elimina todos los chats guardados del almacenamiento local.',
    clearChatsBtn: 'Borrar Todo',
    memoryIntro:
      'Enseña respuestas personalizadas a MyAI sin conexión. Cuando preguntes algo similar, usará tu conocimiento guardado.',
    memoryQPlaceholder: 'Pregunta o palabra clave',
    memoryAPlaceholder: 'Respuesta que MyAI debe recordar...',
    memorySaveBtn: 'Guardar en Memoria',
    memoryEmpty: 'Aún no hay memorias guardadas.',
    micUnsupported: 'El dictado por voz no es compatible con este navegador.',
    micDenied: 'Permiso de micrófono denegado.',
    ttsUnsupported: 'La síntesis de voz no es compatible con este navegador.',
    confirmClear: 'Se borraron todas las conversaciones.',
    researchBtn: 'Investigar',
    researching: 'Investigando en el navegador...',
    researchSettingLabel: 'Modo Investigación Web',
    researchSettingDesc: 'Busca resúmenes en línea cuando haya conexión para temas nuevos.',
    ttsNoHindiVoice: 'No hay voz en hindi instalada — usando pronunciación fonética.',
    testVoiceBtn: 'Probar Voz',
    autoLearnLabel: 'Aprender de la Investigación Web',
    autoLearnDesc: 'Guarda automáticamente los datos investigados en almacenamiento local para usarlos sin conexión.',
    learnedHeading: 'Aprendido del Navegador',
    learnedEmpty: 'Aún no hay temas aprendidos desde el navegador.',
    clearLearnedBtn: 'Limpiar',
    thinkingBtn: 'Pensamiento Profundo MML',
    thinkingStatus: 'Analizando paso a paso (MML)...',
    thinkingLabel: 'Modelo de Alto Razonamiento (MML)',
    thinkingDesc: 'Activa razonamiento multipaso, matemáticas detalladas, comparaciones y síntesis profunda.',
    thinkingSummaryLabel: 'Razonamiento MML',
    thinkingStepsWord: 'pasos',
  },
  fr: {
    splashSubtitle: 'Assistant Multilingue Hors Ligne',
    newChat: 'Nouveau Chat',
    searchPlaceholder: 'Rechercher...',
    noChats: 'Aucune discussion enregistrée',
    today: "Aujourd'hui",
    yesterday: 'Hier',
    earlier: 'Plus tôt',
    memoryBtn: 'Mémoire Locale',
    settingsBtn: 'Paramètres',
    welcomeHeading: "Comment puis-je vous aider aujourd'hui ?",
    welcomeSubheading:
      'Posez des questions, calculez, écrivez du code ou utilisez votre micro — 100 % hors ligne.',
    placeholder: 'Écrire à MyAI...',
    footnote: 'MyAI fonctionne hors ligne dans votre navigateur · Sauvegarde locale',
    listening: 'Écoute en cours... parlez',
    stop: 'Arrêter',
    copy: 'Copier',
    copied: 'Copié',
    speak: 'Écouter',
    stopSpeaking: 'Arrêter',
    settingsTitle: 'Paramètres',
    tabPrefs: 'Préférences',
    tabMemory: 'Mémoire Locale',
    langLabel: "Langue de l'Assistant",
    langDesc: "Définit la langue de l'interface, des réponses et de la voix.",
    autoTtsLabel: 'Lecture Automatique',
    autoTtsDesc: 'Lit automatiquement à haute voix les réponses de MyAI.',
    autoSendLabel: 'Envoi Auto après Dictée',
    autoSendDesc: "Envoie votre question automatiquement dès que l'écoute s'arrête.",
    rateLabel: 'Vitesse de Lecture',
    rateDesc: 'Réglez la vitesse de la synthèse vocale.',
    clearChatsLabel: 'Effacer Toutes les Discussions',
    clearChatsDesc: 'Supprime toutes les conversations du stockage local.',
    clearChatsBtn: 'Tout Effacer',
    memoryIntro:
      'Apprenez des réponses personnalisées à MyAI hors ligne. Il utilisera vos notes enregistrées.',
    memoryQPlaceholder: 'Question ou mot-clé',
    memoryAPlaceholder: 'Réponse à retenir...',
    memorySaveBtn: 'Enregistrer',
    memoryEmpty: 'Aucune mémoire enregistrée.',
    micUnsupported: "La saisie vocale n'est pas prise en charge par ce navigateur.",
    micDenied: "L'accès au microphone a été refusé.",
    ttsUnsupported: 'La synthèse vocale n’est pas prise en charge.',
    confirmClear: 'Toutes les discussions ont été effacées.',
    researchBtn: 'Recherche Web',
    researching: 'Recherche dans le navigateur...',
    researchSettingLabel: 'Mode Recherche Navigateur',
    researchSettingDesc: 'Récupère des résumés en ligne lorsqu’une connexion est disponible.',
    ttsNoHindiVoice: 'Aucune voix hindi installée — lecture phonétique activée.',
    testVoiceBtn: 'Tester la Voix',
    autoLearnLabel: 'Apprendre via la Recherche Web',
    autoLearnDesc: 'Enregistre automatiquement les faits recherchés localement pour les discussions hors ligne.',
    learnedHeading: 'Appris du Navigateur',
    learnedEmpty: 'Aucun sujet appris depuis le navigateur pour le moment.',
    clearLearnedBtn: 'Effacer',
    thinkingBtn: 'Réflexion Avancée MML',
    thinkingStatus: 'Analyse approfondie en cours (MML)...',
    thinkingLabel: 'Modèle Haute Réflexion (MML)',
    thinkingDesc: 'Active le raisonnement multi-étapes, les calculs détaillés et les comparaisons.',
    thinkingSummaryLabel: 'Raisonnement MML',
    thinkingStepsWord: 'étapes',
  },
  ar: {
    splashSubtitle: 'مساعد ذكي متعدد اللغات بدون إنترنت',
    newChat: 'محادثة جديدة',
    searchPlaceholder: 'ابحث في المحادثات...',
    noChats: 'لا توجد محادثات محفوظة بعد',
    today: 'اليوم',
    yesterday: 'أمس',
    earlier: 'سابقاً',
    memoryBtn: 'الذاكرة المخصصة',
    settingsBtn: 'الإعدادات',
    welcomeHeading: 'كيف يمكنني مساعدتك اليوم؟',
    welcomeSubheading:
      'اطرح الأسئلة، احسب المسائل، اكتب الأكواد، أو تحدث بالميكروفون — بالكامل بدون خادم.',
    placeholder: 'اكتب رسالتك لـ MyAI...',
    footnote: 'يعمل MyAI بدون إنترنت في متصفحك · المحادثات محفوظة محلياً',
    listening: 'جاري الاستماع... تحدث الآن',
    stop: 'إيقاف',
    copy: 'نسخ',
    copied: 'تم النسخ',
    speak: 'استماع',
    stopSpeaking: 'إيقاف',
    settingsTitle: 'الإعدادات',
    tabPrefs: 'التفضيلات',
    tabMemory: 'الذاكرة المخصصة',
    langLabel: 'لغة المساعد',
    langDesc: 'تتحكم في لغة الواجهة والردود والتعرف الصوتي والنطق.',
    autoTtsLabel: 'نطق الردود تلقائياً',
    autoTtsDesc: 'قراءة ردود MyAI بصوت عالٍ تلقائياً بعد الإجابة.',
    autoSendLabel: 'إرسال الصوت تلقائياً',
    autoSendDesc: 'إرسال سؤالك تلقائياً عند انتهاء التسجيل الصوتي.',
    rateLabel: 'سرعة النطق',
    rateDesc: 'اضبط سرعة تحويل النص إلى كلام.',
    clearChatsLabel: 'مسح جميع المحادثات',
    clearChatsDesc: 'حذف جميع المحادثات المحفوظة من التخزين المحلي.',
    clearChatsBtn: 'مسح الكل',
    memoryIntro:
      'علّم MyAI إجابات مخصصة بدون إنترنت. عند طرح سؤال مطابق سيستخدم معلوماتك المحفوظة.',
    memoryQPlaceholder: 'السؤال أو الكلمة المفتاحية',
    memoryAPlaceholder: 'الإجابة التي يجب تذكرها...',
    memorySaveBtn: 'حفظ في الذاكرة المحلية',
    memoryEmpty: 'لا توجد ذكريات محفوظة بعد.',
    micUnsupported: 'الإدخال الصوتي غير مدعوم في هذا المتصفح.',
    micDenied: 'تم رفض إذن الميكروفون.',
    ttsUnsupported: 'تحويل النص إلى كلام غير مدعوم في هذا المتصفح.',
    confirmClear: 'تم مسح جميع المحادثات.',
    researchBtn: 'بحث المتصفح',
    researching: 'جاري البحث في المتصفح...',
    researchSettingLabel: 'وضع بحث المتصفح',
    researchSettingDesc: 'جلب ملخصات مباشرة من الويب عند توفر الاتصال للمواضيع الجديدة.',
    ttsNoHindiVoice: 'لا يوجد صوت هندي مثبت — سيتم النطق صوتياً.',
    testVoiceBtn: 'اختبار الصوت',
    autoLearnLabel: 'التعلّم من بحث المتصفح',
    autoLearnDesc: 'حفظ المعلومات التي تم البحث عنها تلقائياً في التخزين المحلي للمحادثات بدون إنترنت.',
    learnedHeading: 'تم تعلّمه من المتصفح',
    learnedEmpty: 'لم يتم حفظ أي مواضيع من بحث المتصفح بعد.',
    clearLearnedBtn: 'مسح',
    thinkingBtn: 'التفكير العميق MML',
    thinkingStatus: 'جاري التفكير العميق (MML)...',
    thinkingLabel: 'نموذج التفكير العالي (MML)',
    thinkingDesc: 'تفعيل التفكير متعدد الخطوات، الحل التفصيلي للمسائل، والمقارنات الذكية.',
    thinkingSummaryLabel: 'تحليل MML',
    thinkingStepsWord: 'خطوات',
  },
};

export const STARTER_PROMPTS = {
  en: [
    { title: 'Browser Research', prompt: 'Research Quantum Computing' },
    { title: 'Solve a Math Problem', prompt: 'Calculate (245 * 18) + sqrt(144)' },
    { title: 'Write Responsive CSS', prompt: 'Give me a clean responsive CSS flexbox example' },
    { title: 'Teach Offline Memory', prompt: 'Remember that my favorite programming language is JavaScript' },
  ],
  hi: [
    { title: 'ब्राउज़र रिसर्च करें', prompt: 'Research Chandrayaan-3' },
    { title: 'गणित हल करें', prompt: 'Calculate (245 * 18) + sqrt(144)' },
    { title: 'पढ़ाई के टिप्स', prompt: 'पढ़ाई में ध्यान लगाने के सबसे अच्छे तरीके क्या हैं?' },
    { title: 'ऑफ़लाइन मेमोरी सिखाएँ', prompt: 'याद रखो कि मेरा नाम सुमित है' },
  ],
  hinglish: [
    { title: 'Browser Research Karein', prompt: 'Research ISRO Chandrayaan-3' },
    { title: 'Math Solve Karein', prompt: '15% of 2400 kitna hota hai?' },
    { title: 'HTML CSS JS Guide', prompt: 'HTML CSS aur JavaScript mein kya farq hai?' },
    { title: 'Memory Save Karein', prompt: 'Yaad rakho mera favorite subject Computer Science hai' },
  ],
  es: [
    { title: 'Investigar en Web', prompt: 'Investiga Computación Cuántica' },
    { title: 'Resolver Matemáticas', prompt: 'Calcula 25% de 1800' },
    { title: 'Aprender Programación', prompt: '¿Qué es JavaScript y para qué sirve?' },
    { title: 'Memoria Sin Conexión', prompt: 'Recuerda que mi color favorito es el verde esmeralda' },
  ],
  fr: [
    { title: 'Recherche Navigateur', prompt: 'Recherche Système Solaire' },
    { title: 'Calcul Rapide', prompt: 'Calcule (120 * 15) + 450' },
    { title: 'Code HTML & CSS', prompt: 'Montre-moi un exemple simple de bouton CSS' },
    { title: 'Mémoire Hors Ligne', prompt: 'Retiens que mon projet s appelle MyAI' },
  ],
  ar: [
    { title: 'بحث المتصفح', prompt: 'ابحث عن الحوسبة الكمومية' },
    { title: 'حل مسألة رياضية', prompt: 'احسب 25 * 48 + 120' },
    { title: 'نصائح للدراسة', prompt: 'ما هي أفضل نصائح التركيز والدراسة؟' },
    { title: 'حفظ معلومة محلية', prompt: 'تذكر أن لغتي المفضلة هي العربية' },
  ],
};

/**
 * Safe recursive-descent math expression evaluator (no eval/Function).
 * Supports +, -, *, /, ^, %, parentheses, and sqrt().
 * @param {string} expr
 * @returns {number | null}
 */
function safeEvaluateMath(expr) {
  const cleaned = expr
    .toLowerCase()
    .replace(/sqrt\s*\(/g, 's(')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '');

  if (!/^[0-9+\-*/().^s]+$/.test(cleaned)) {
    return null;
  }

  let pos = 0;

  function parseExpression() {
    let val = parseTerm();
    while (pos < cleaned.length && (cleaned[pos] === '+' || cleaned[pos] === '-')) {
      const op = cleaned[pos++];
      const right = parseTerm();
      val = op === '+' ? val + right : val - right;
    }
    return val;
  }

  function parseTerm() {
    let val = parsePower();
    while (pos < cleaned.length && (cleaned[pos] === '*' || cleaned[pos] === '/')) {
      const op = cleaned[pos++];
      const right = parsePower();
      if (op === '/') {
        if (right === 0) throw new Error('Division by zero');
        val /= right;
      } else {
        val *= right;
      }
    }
    return val;
  }

  function parsePower() {
    let base = parseUnary();
    if (pos < cleaned.length && cleaned[pos] === '^') {
      pos++;
      const exp = parsePower();
      return Math.pow(base, exp);
    }
    return base;
  }

  function parseUnary() {
    if (cleaned[pos] === '-') {
      pos++;
      return -parseUnary();
    }
    if (cleaned[pos] === '+') {
      pos++;
      return parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary() {
    if (cleaned[pos] === 's' && cleaned[pos + 1] === '(') {
      pos += 2;
      const inner = parseExpression();
      if (cleaned[pos] !== ')') throw new Error('Missing )');
      pos++;
      if (inner < 0) throw new Error('Negative sqrt');
      return Math.sqrt(inner);
    }
    if (cleaned[pos] === '(') {
      pos++;
      const val = parseExpression();
      if (cleaned[pos] !== ')') throw new Error('Missing )');
      pos++;
      return val;
    }
    const start = pos;
    while (pos < cleaned.length && (/[0-9.]/.test(cleaned[pos]))) {
      pos++;
    }
    if (start === pos) throw new Error('Unexpected token');
    const num = Number(cleaned.slice(start, pos));
    if (!Number.isFinite(num)) throw new Error('Invalid number');
    return num;
  }

  try {
    const result = parseExpression();
    if (pos !== cleaned.length || !Number.isFinite(result)) return null;
    return Number(result.toFixed(8));
  } catch {
    return null;
  }
}

/**
 * Try math, percentage, or unit conversion queries.
 * @param {string} raw
 * @param {string} lang
 * @returns {string | null}
 */
function tryMathAndConversion(raw, lang) {
  const text = raw.trim();

  // Percentage: e.g. "15% of 2400" or "25% de 1800"
  const pctMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|de|ka|ki|का)\s*(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const pct = Number(pctMatch[1]);
    const total = Number(pctMatch[2]);
    const ans = Number(((pct / 100) * total).toFixed(4));
    if (lang === 'hi') return { text: `**${total}** का **${pct}%** = **${ans}** होता है।`, value: ans };
    if (lang === 'hinglish') return { text: `**${total}** ka **${pct}%** = **${ans}** hota hai.`, value: ans };
    if (lang === 'es') return { text: `El **${pct}%** de **${total}** es **${ans}**.`, value: ans };
    if (lang === 'fr') return { text: `**${pct}%** de **${total}** = **${ans}**.`, value: ans };
    if (lang === 'ar') return { text: `**${pct}%** من **${total}** يساوي **${ans}**.`, value: ans };
    return { text: `**${pct}%** of **${total}** is **${ans}**.`, value: ans };
  }

  // Unit conversions: km/miles, c/f, kg/lbs
  const convMatch = text.match(
    /(-?\d+(?:\.\d+)?)\s*(km|kilometers?|miles?|mi|c|celsius|f|fahrenheit|kg|kilograms?|lbs?|pounds?)\s+(?:to|in|into|में|en|a)\s+(km|kilometers?|miles?|mi|c|celsius|f|fahrenheit|kg|kilograms?|lbs?|pounds?)/i
  );
  if (convMatch) {
    const val = Number(convMatch[1]);
    const from = convMatch[2].toLowerCase();
    const to = convMatch[3].toLowerCase();
    let converted = null;
    let unitOut = to;

    if ((from.startsWith('km') || from.startsWith('kilo')) && (to.startsWith('mi'))) {
      converted = val * 0.621371;
      unitOut = 'miles';
    } else if (from.startsWith('mi') && to.startsWith('km')) {
      converted = val * 1.60934;
      unitOut = 'km';
    } else if ((from === 'c' || from.startsWith('cel')) && (to === 'f' || to.startsWith('fah'))) {
      converted = (val * 9) / 5 + 32;
      unitOut = '°F';
    } else if ((from === 'f' || from.startsWith('fah')) && (to === 'c' || to.startsWith('cel'))) {
      converted = ((val - 32) * 5) / 9;
      unitOut = '°C';
    } else if (from.startsWith('kg') && (to.startsWith('lb') || to.startsWith('pound'))) {
      converted = val * 2.20462;
      unitOut = 'lbs';
    } else if ((from.startsWith('lb') || from.startsWith('pound')) && to.startsWith('kg')) {
      converted = val / 2.20462;
      unitOut = 'kg';
    }

    if (converted !== null) {
      const rounded = Number(converted.toFixed(2));
      return { text: `**${val} ${convMatch[2]}** = **${rounded} ${unitOut}**`, value: rounded };
    }
  }

  // General arithmetic expression inside sentence
  const stripped = text
    .replace(/^(what is|calculate|solve|calc|kitna hota hai|kitna hoga|calcula|calcule|احسب|बताओ)\s+/i, '')
    .replace(/[?=؟]+$/g, '')
    .trim();

  if (/[0-9]/.test(stripped) && /[+\-*/^]|sqrt/.test(stripped)) {
    const mathRes = safeEvaluateMath(stripped);
    if (mathRes !== null) {
      if (lang === 'hi') return { text: `गणना का उत्तर:\n\n\`${stripped}\` = **${mathRes}**`, value: mathRes };
      if (lang === 'hinglish') return { text: `Calculation ka jawab:\n\n\`${stripped}\` = **${mathRes}**`, value: mathRes };
      if (lang === 'es') return { text: `Resultado:\n\n\`${stripped}\` = **${mathRes}**`, value: mathRes };
      if (lang === 'fr') return { text: `Résultat :\n\n\`${stripped}\` = **${mathRes}**`, value: mathRes };
      if (lang === 'ar') return { text: `النتيجة:\n\n\`${stripped}\` = **${mathRes}**`, value: mathRes };
      return { text: `Result:\n\n\`${stripped}\` = **${mathRes}**`, value: mathRes };
    }
  }

  return null;
}

/**
 * Detect script/language hints automatically if user switches language mid-chat.
 * @param {string} text
 * @param {string} selectedLang
 * @returns {string}
 */
function resolveReplyLanguage(text, selectedLang) {
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (
    selectedLang === 'en' &&
    /\b(kya|kaise|kitna|batao|yaad|rakho|mera|meri|tum|aap|hai|hain|karo|samjhao)\b/i.test(text)
  ) {
    return 'hinglish';
  }
  return selectedLang;
}

/**
 * Knowledge Base Topics (multilingual answers).
 */
const KNOWLEDGE_BASE = [
  {
    isChitchat: true,
    keywords: ['hello', 'hi', 'hey', 'namaste', 'salam', 'hola', 'bonjour', 'kaise ho', 'kaise hain', 'kya haal', 'how are you', 'good morning', 'good evening', 'good afternoon', 'नमस्ते', 'प्रणाम', 'कैसे हो', 'कैसे हैं', 'क्या हाल', 'हेलो'],
    replies: {
      en: "Hello! I'm **MyAI (MML High Thinking)** — ready to analyze, reason step-by-step, solve math, research live web/code, and remember our conversation.",
      hi: 'नमस्ते! मैं **MyAI (MML हाई थिंकिंग मॉडल)** हूँ। आप मुझसे गहन सवाल, स्टेप-बाय-स्टेप गणित, तुलना, कोड या ब्राउज़र रिसर्च करा सकते हैं। बताइए आज क्या मदद करूँ?',
      hinglish: 'Namaste! Main **MyAI (MML High Thinking Model)** hoon. Aap mujhse deep questions, step-by-step math, comparisons, code ya live browser research kara sakte hain. Bataiye kya help chahiye?',
      es: '¡Hola! Soy **MyAI (MML High Thinking)**. Puedo razonar paso a paso, comparar temas, resolver matemáticas e investigar en la web.',
      fr: 'Bonjour ! Je suis **MyAI (MML High Thinking)**, prêt à raisonner étape par étape, comparer des sujets et rechercher en ligne.',
      ar: 'مرحباً! أنا **MyAI (نموذج التفكير العالي MML)**، جاهز للتحليل المتعمق وحل المسائل والبحث في المتصفح.',
    },
  },
  {
    isChitchat: true,
    keywords: ['what can you do', 'your features', 'help me', 'kya kar sakte ho', 'tum kya karte ho', 'aap kya kar sakte', 'क्या कर सकते हो', 'मदद', 'सहायता'],
    replies: {
      en: '### What MyAI MML Can Do\n- **Multi-Step Thinking & Comparisons**: Compare two subjects (`Python vs JavaScript`), transform answers into simple points or quizzes.\n- **Step-by-Step Math & Algebra**: Linear/quadratic equations (`2x + 5 = 15`), interest, BMI, factorials, primes, and statistics.\n- **Browser & Code Research**: Pull verified Wikipedia explanations and Stack Overflow code snippets, then auto-learn them offline.\n- **Voice Input & Hindi/Multilingual TTS**: Speak and listen hands-free with `localStorage` persistence.',
      hi: '### MyAI MML की मुख्य क्षमताएँ\n- **गहन चिंतन व तुलना**: दो विषयों की तुलना (`Python vs JavaScript`), सरल व्याख्या और अभ्यास प्रश्न।\n- **चरणबद्ध गणित व बीजगणित**: समीकरण (`2x + 5 = 15`), ब्याज, प्रतिशत, प्राइम जांच और सांख्यिकी।\n- **ब्राउज़र व कोड रिसर्च**: लाइव वेब और कोड उदाहरण खोजकर ऑफ़लाइन मेमोरी में सहेजना।\n- **वॉइस और बहुभाषी स्पीच**: बोलकर पूछें और सुनें।',
      hinglish: '### MyAI MML Kya-Kya Kar Sakta Hai?\n- **Deep Thinking & Comparison**: Do topics compare karna (`Python vs JavaScript`), pros/cons aur quiz banana.\n- **Step-by-Step Math & Algebra**: Equations (`2x + 5 = 15`), factorial, prime check, interest aur stats solve karna.\n- **Browser & Code Research**: Live Wikipedia aur Stack Overflow code research karke offline ke liye learn karna.\n- **Voice & Hindi TTS**: Mic se bolkar poochhna aur Hindi/English mein sunna.',
      es: 'Puedo comparar temas, resolver ecuaciones paso a paso, investigar código y resúmenes en el navegador, y guardar conocimiento localmente.',
      fr: 'Je peux comparer des sujets, résoudre des équations étape par étape, rechercher du code en ligne et mémoriser vos notes localement.',
      ar: 'يمكنني مقارنة المواضيع، وحل المعادلات خطوة بخطوة، والبحث عن الأكواد في المتصفح، وحفظ المعرفة محلياً.',
    },
  },
  {
    isChitchat: true,
    keywords: ['bye', 'goodbye', 'good night', 'alvida', 'chalta hoon', 'see you', 'शुभ रात्रि', 'अलविदा'],
    replies: {
      en: 'Goodbye! All your chats remain safely saved in your browser. Come back anytime!',
      hi: 'अलविदा! आपकी सभी चैट आपके ब्राउज़र में सुरक्षित सहेजी गई हैं। जब चाहें वापस आएँ!',
      hinglish: 'Bye! Aapki saari chats browser ke local storage mein safe hain. Jab chahein wapas aayein!',
      es: '¡Hasta luego! Tus conversaciones quedan guardadas localmente.',
      fr: 'Au revoir ! Vos discussions restent enregistrées localement.',
      ar: 'إلى اللقاء! جميع محادثاتك محفوظة بأمان في متصفحك.',
    },
  },
  {
    isChitchat: true,
    keywords: ['who are you', 'what is myai', 'your name', 'kaun ho', 'tum kaun', 'tumhara naam', 'quien eres', 'qui es-tu', 'من انت', 'कौन हो', 'तुम्हारा नाम', 'आप कौन'],
    replies: {
      en: "I'm **MyAI** running the **High-Thinking MML engine** — a serverless, offline-capable assistant built with pure HTML, CSS & JS. All your chats, learned topics, and custom memory stay privately in `localStorage`.",
      hi: 'मैं **MyAI (High-Thinking MML मॉडल)** हूँ — एक ऑफ़लाइन और सर्वर-रहित सहायक जो सीधे आपके ब्राउज़र में चलता है। आपकी चैट और सीखी गई जानकारी `localStorage` में सुरक्षित रहती है।',
      hinglish: 'Main **MyAI** hoon (**High-Thinking MML Model** ke saath) — ek serverless, high-trained offline + browser research chatbot jo pure HTML, CSS aur JS par chalta hai.',
      es: 'Soy **MyAI**, un asistente sin servidor con razonamiento multipaso (MML) que funciona en tu navegador y guarda todo en `localStorage`.',
      fr: 'Je suis **MyAI**, un assistant sans serveur doté du moteur de réflexion MML qui fonctionne localement dans votre navigateur.',
      ar: 'أنا **MyAI** بمحرك التفكير العالي (MML) — مساعد ذكي بدون خادم يعمل في متصفحك ويحفظ بياناتك محلياً.',
    },
  },
  {
    keywords: ['offline', 'local storage', 'localstorage', 'server', 'internet', 'bina server', 'sin conexion', 'hors ligne', 'ऑफ़लाइन', 'लोकल स्टोरेज', 'बिना सर्वर'],
    replies: {
      en: '### How MyAI Works Offline\n- **Zero Server**: All question matching, math evaluation, and text tools run locally in JavaScript.\n- **Local Storage**: Conversations, theme, language, and custom memories are saved in `localStorage`.\n- **Browser Speech**: Voice input and text-to-speech use the built-in Web Speech APIs.',
      hi: '### MyAI बिना सर्वर के कैसे काम करता है?\n- **कोई सर्वर नहीं**: सवालों के जवाब, गणित और टेक्स्ट टूल्स सीधे JavaScript में चलते हैं।\n- **लोकल स्टोरेज**: आपकी चैट, भाषा और मेमोरी `localStorage` में सहेजी जाती है।\n- **वॉइस फीचर**: बोलकर पूछने और सुनने के लिए ब्राउज़र के Web Speech API का उपयोग होता है।',
      hinglish: '### MyAI Bina Server aur Offline Kaise Chalta Hai?\n- **No Server Needed**: Saara Q&A engine aur math solver browser ke JavaScript mein chalta hai.\n- **LocalStorage**: Aapki chats, language aur custom memory device ke `localStorage` mein store hoti hain.\n- **Voice Support**: Mic aur Text-to-Speech browser ke built-in Web Speech API se kaam karte hain.',
      es: 'MyAI procesa todo localmente con JavaScript y guarda tu historial en `localStorage`, por lo que no depende de ningún servidor externo.',
      fr: 'MyAI exécute toute la logique localement en JavaScript et stocke vos conversations dans `localStorage`, sans serveur.',
      ar: 'يعمل MyAI بالكامل عبر JavaScript داخل المتصفح ويحفظ بياناتك في `localStorage` دون الحاجة إلى خادم.',
    },
  },
  {
    keywords: ['html', 'css', 'javascript', 'js', 'flexbox', 'web development', 'website', 'coding', 'farq', 'कोडिंग', 'वेबसाइट'],
    replies: {
      en: "### Web Basics: HTML, CSS & JavaScript\n- **HTML** gives structure (headings, buttons, inputs).\n- **CSS** controls layout, colors, and responsive design.\n- **JavaScript** adds interactivity, logic, and storage.\n\nHere is a clean responsive Flexbox snippet:\n```css\n.container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  justify-content: center;\n}\n```",
      hi: "### HTML, CSS और JavaScript क्या हैं?\n- **HTML** वेब पेज का ढाँचा (structure) बनाता है।\n- **CSS** रंग, फ़ॉन्ट और मोबाइल-डेस्कटॉप रिस्पॉन्सिव डिज़ाइन देता है।\n- **JavaScript** पेज को इंटरैक्टिव और स्मार्ट बनाता है।\n\n```css\n.container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n```",
      hinglish: "### HTML, CSS aur JavaScript mein Farq\n- **HTML**: Page ka structure banata hai (buttons, text, forms).\n- **CSS**: Design, colors aur mobile responsive layout set karta hai.\n- **JavaScript**: Logic, click events aur `localStorage` handle karta hai.\n\n```css\n.card-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n```",
      es: "### HTML, CSS y JavaScript\n- **HTML** define la estructura.\n- **CSS** diseña los estilos y el diseño adaptable.\n- **JavaScript** añade lógica e interactividad.\n\n```css\n.container {\n  display: flex;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n```",
      fr: "### HTML, CSS et JavaScript\n- **HTML** structure le contenu.\n- **CSS** gère l'apparence et le responsive.\n- **JavaScript** apporte l'interactivité.\n\n```css\n.btn {\n  padding: 10px 18px;\n  border-radius: 10px;\n  background: #0d9488;\n  color: #fff;\n}\n```",
      ar: "### أساسيات الويب: HTML و CSS و JavaScript\n- **HTML**: لبناء هيكل الصفحة.\n- **CSS**: للتنسيق والألوان والتصميم المتجاوب.\n- **JavaScript**: لإضافة التفاعل والمنطق البرمجي.\n\n```css\n.container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n```",
    },
  },
  {
    keywords: ['python', 'loop', 'function', 'programming', 'code'],
    replies: {
      en: "Here's a quick **Python** example showing a function and a loop:\n```python\ndef greet_users(names):\n    for name in names:\n        print(f\"Hello, {name}!\")\n\ngreet_users([\"Aarav\", \"Maya\", \"Liam\"])\n```",
      hi: "यहाँ **Python** में फ़ंक्शन और लूप का एक आसान उदाहरण है:\n```python\ndef greet_users(names):\n    for name in names:\n        print(f\"नमस्ते, {name}!\")\n\ngreet_users([\"आरव\", \"प्रिया\"])\n```",
      hinglish: "Yeh raha **Python** function aur loop ka simple example:\n```python\ndef greet_users(names):\n    for name in names:\n        print(f\"Hello, {name}!\")\n\ngreet_users([\"Amit\", \"Priya\"])\n```",
      es: "Aquí tienes un ejemplo sencillo de **Python**:\n```python\ndef saludar(nombres):\n    for nombre in nombres:\n        print(f\"Hola, {nombre}!\")\n```",
      fr: "Voici un exemple simple en **Python** :\n```python\ndef saluer(noms):\n    for nom in noms:\n        print(f\"Bonjour, {nom} !\")\n```",
      ar: "إليك مثال بسيط بلغة **Python**:\n```python\ndef greet(names):\n    for name in names:\n        print(f\"مرحباً {name}\")\n```",
    },
  },
  {
    keywords: ['artificial intelligence', 'machine learning', 'ai ', 'deep learning', 'neural', 'आर्टिफिशियल', 'الذكاء الاصطناعي'],
    replies: {
      en: '### How Artificial Intelligence Works\n1. **Data**: AI models learn patterns from large examples of text, images, or numbers.\n2. **Training**: Algorithms adjust mathematical weights so predictions get more accurate over time.\n3. **Inference**: When you ask a question, the model predicts the most helpful answer based on learned patterns.',
      hi: '### आर्टिफिशियल इंटेलिजेंस (AI) कैसे काम करता है?\n1. **डेटा**: AI सिस्टम बहुत सारे उदाहरणों (टेक्स्ट, फ़ोटो, आवाज़) से पैटर्न सीखते हैं।\n2. **ट्रेनिंग**: गणितीय मॉडल बार-बार अभ्यास करके सही उत्तर देने की क्षमता बढ़ाते हैं।\n3. **उपयोग**: जब आप कोई सवाल पूछते हैं, तो AI सीखे हुए पैटर्न से सटीक उत्तर बनाता है।',
      hinglish: '### AI Kaise Kaam Karta Hai?\n1. **Data**: AI models lakho examples (text, photos, audio) se patterns seekhte hain.\n2. **Training**: Algorithms practice karke apni accuracy improve karte hain.\n3. **Prediction**: Jab aap sawal poochte hain, AI us pattern ke basis par best jawab deta hai.',
      es: '### ¿Cómo funciona la IA?\nLa inteligencia artificial aprende patrones a partir de grandes cantidades de datos y utiliza modelos matemáticos para predecir respuestas útiles.',
      fr: "### Comment fonctionne l'IA ?\nL'intelligence artificielle analyse de grandes quantités de données pour repérer des motifs et générer des prédictions ou des réponses pertinentes.",
      ar: '### كيف يعمل الذكاء الاصطناعي؟\nيتعلم الذكاء الاصطناعي الأنماط من كميات كبيرة من البيانات عبر التدريب الرياضي، ثم يستخدم هذه الأنماط لتوليد الإجابات والحلول.',
    },
  },
  {
    keywords: ['study', 'focus', 'exam', 'padhai', 'concentrate', 'memory', 'tips', 'पढ़ाई', 'الدراسة', 'estudiar'],
    replies: {
      en: '### 4 Proven Study & Focus Techniques\n- **Pomodoro Method**: Study with full focus for 25 minutes, then take a 5-minute break.\n- **Active Recall**: Close your book and test yourself instead of only re-reading.\n- **Spaced Repetition**: Review difficult topics after 1 day, 3 days, and 7 days.\n- **Phone Away**: Keep notifications muted during deep study blocks.',
      hi: '### पढ़ाई में ध्यान लगाने के 4 असरदार तरीके\n- **पोमोडोरो तकनीक**: 25 मिनट पूरा ध्यान लगाकर पढ़ें, फिर 5 मिनट आराम करें।\n- **एक्टिव रिकॉल**: सिर्फ पढ़ने के बजाय खुद से सवाल पूछकर याद करें।\n- **नियमित दोहराव**: कठिन विषयों को 1 दिन, 3 दिन और 7 दिन बाद दोहराएँ।\n- **ध्यान भटकाव से बचें**: पढ़ते समय मोबाइल नोटिफ़िकेशन बंद रखें।',
      hinglish: '### Padhai aur Focus Badhane ke 4 Best Tips\n- **Pomodoro Technique**: 25 minute focus se padhein, phir 5 minute break lein.\n- **Active Recall**: Sirf read karne ke bajaye bina dekhe likhkar ya bolkar test karein.\n- **Revision Schedule**: Mushkil topics ko 1 din, 3 din aur 7 din baad revise karein.\n- **No Distractions**: Padhte waqt phone silent par rakhein.',
      es: '### Consejos para Estudiar Mejor\n- Usa bloques de **25 minutos** (Pomodoro) con 5 de descanso.\n- Practica el **recuerdo activo** explicando el tema con tus propias palabras.\n- Repasa de forma espaciada y evita distracciones.',
      fr: '### Conseils pour Mieux Étudier\n- Travaillez par sessions de **25 minutes** (Pomodoro).\n- Testez vos connaissances sans regarder vos notes.\n- Révisez régulièrement à intervalles espacés.',
      ar: '### أفضل نصائح للدراسة والتركيز\n- **تقنية بومودورو**: ركّز 25 دقيقة ثم استرح 5 دقائق.\n- **الاسترجاع النشط**: اختبر نفسك بدون النظر للكتاب.\n- **التكرار المتباعد**: راجع الدروس بعد يوم و3 أيام وأسبوع.',
    },
  },
  {
    keywords: ['health', 'fitness', 'sleep', 'water', 'diet', 'exercise', 'fit', 'energetic', 'स्वास्थ्य'],
    replies: {
      en: '### Daily Health & Energy Habits\n- **Hydration**: Drink 2–3 liters of water across the day.\n- **Sleep**: Aim for 7–8 hours at consistent sleep/wake times.\n- **Movement**: Even a brisk 25-minute walk boosts mood and metabolism.\n- **Balanced Plate**: Include protein, fiber-rich vegetables, and whole grains.',
      hi: '### स्वस्थ और ऊर्जावान रहने के आसान नियम\n- **पानी**: दिन भर में पर्याप्त (2.5–3 लीटर) पानी पिएँ।\n- **नींद**: रोज़ 7–8 घंटे की अच्छी नींद लें।\n- **व्यायाम**: रोज़ कम से कम 25–30 मिनट तेज़ चलें या योग करें।\n- **संतुलित भोजन**: खाने में दाल, सब्ज़ियाँ, फल और प्रोटीन शामिल करें।',
      hinglish: '### Roz Fit aur Energetic Rehne ke Tips\n- **Hydration**: Din bhar mein 2.5–3 liter paani zaroor piyein.\n- **Sleep**: Roz 7–8 ghante ki proper neend lein.\n- **Daily Walk / Exercise**: Kam se kam 25–30 minute walk ya workout karein.\n- **Balanced Diet**: Junk food kam karein aur protein, fruits aur veggies add karein.',
      es: '### Hábitos Diarios de Salud\n- Bebe suficiente agua durante el día.\n- Duerme entre 7 y 8 horas diarias.\n- Camina o haz ejercicio al menos 30 minutos al día.',
      fr: '### Habitudes Santé Quotidiennes\n- Buvez régulièrement tout au long de la journée.\n- Dormez 7 à 8 heures par nuit.\n- Bougez au moins 30 minutes par jour.',
      ar: '### عادات يومية للصحة والنشاط\n- اشرب كمية كافية من الماء يومياً.\n- نم 7 إلى 8 ساعات بانتظام.\n- مارس المشي أو الرياضة لمدة 30 دقيقة يومياً.',
    },
  },
  {
    keywords: ['space', 'planet', 'sun', 'moon', 'earth', 'solar system', 'universe', 'mars', 'अंतरिक्ष', 'ग्रह', 'सूर्य', 'पृथ्वी', 'चाँद'],
    replies: {
      en: '### Solar System Quick Facts\n- **8 Planets**: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.\n- **Light Speed**: Sunlight takes about **8 minutes 20 seconds** to reach Earth.\n- **Largest Planet**: Jupiter is more than 11 times wider than Earth.',
      hi: '### सौर मंडल के रोचक तथ्य\n- हमारे सौर मंडल में **8 ग्रह** हैं (बुध, शुक्र, पृथ्वी, मंगल, बृहस्पति, शनि, अरुण, वरुण)।\n- सूर्य का प्रकाश पृथ्वी तक पहुँचने में लगभग **8 मिनट 20 सेकंड** लेता है।\n- **बृहस्पति (Jupiter)** सौर मंडल का सबसे बड़ा ग्रह है।',
      hinglish: '### Space & Solar System Facts\n- Hamare solar system mein **8 planets** hain.\n- Suraj ki roshni Earth tak pahunchne mein lagbhag **8 minute 20 second** leti hai.\n- **Jupiter** sabse bada planet hai aur **Mars** ko Red Planet kehte hain.',
      es: 'El sistema solar tiene **8 planetas**. La luz del Sol tarda unos **8 minutos y 20 segundos** en llegar a la Tierra.',
      fr: 'Le système solaire compte **8 planètes**. La lumière du Soleil met environ **8 minutes et 20 secondes** pour atteindre la Terre.',
      ar: 'يضم نظامنا الشمسي **8 كواكب**، ويستغرق ضوء الشمس حوالي **8 دقائق و20 ثانية** للوصول إلى الأرض.',
    },
  },
  {
    keywords: ['joke', 'funny', 'laugh', 'riddle', 'chutkula', 'majak', 'chiste', 'blague', 'نكتة', 'चुटकुला', 'हँसी', 'मज़ाक'],
    replies: {
      en: "Why do programmers prefer dark mode?\n\nBecause **light attracts bugs!** 😄",
      hi: 'टीचर: "बताओ बिजली कहाँ से आती है?"\nछात्र: "सर, मामा के घर से!"\nटीचर: "वो कैसे?"\nछात्र: "जब भी लाइट जाती है, पापा कहते हैं—सालों ने फिर काट दी!" 😄',
      hinglish: 'Ek programmer coffee peete hue bola:\n"Meri zindagi mein bas do hi cheezein hain — **code chal raha hai** ya **pata nahi kyun chal raha hai!**" 😄',
      es: '¿Por qué los programadores confunden Halloween y Navidad?\n\nPorque **OCT 31 == DEC 25**. 😄',
      fr: 'Pourquoi les développeurs détestent-ils la nature ?\n\nParce qu’il y a trop de **bugs** ! 😄',
      ar: 'لماذا يحب المبرمجون الوضع الليلي؟\n\nلأن الضوء يجذب الحشرات البرمجية (**Bugs**)! 😄',
    },
  },
  {
    keywords: ['quote', 'motivate', 'motivation', 'inspire', 'suvichar', 'cita', 'सुविचार', 'प्रेरणा'],
    replies: {
      en: '> "Small daily improvements over time lead to stunning results."\n\nFocus on one meaningful step today — consistency beats intensity.',
      hi: '> "छोटे-छोटे रोज़ाना प्रयास समय के साथ बहुत बड़े परिणाम लाते हैं।"\n\nआज बस एक अच्छा कदम आगे बढ़ाएँ — निरंतरता ही सफलता की कुंजी है।',
      hinglish: '> "Roz ki chhoti-chhoti mehnat ek din bada result ban jaati hai."\n\nAaj bas apna next small step complete karo — consistency sabse powerful hoti hai!',
      es: '> "Pequeñas mejoras diarias producen grandes resultados con el tiempo."\n\nDa hoy un paso constante hacia tu meta.',
      fr: '> "De petits progrès quotidiens mènent à de grands résultats."\n\nAvancez d’un pas aujourd’hui, avec régularité.',
      ar: '> "التحسن البسيط اليومي يصنع نتائج مذهلة مع مرور الوقت."\n\nركّز على خطوة واحدة مهمة اليوم.',
    },
  },
  {
    keywords: ['email', 'letter', 'leave', 'application', 'resume', 'write', 'ईमेल', 'पत्र', 'छुट्टी'],
    replies: {
      en: "Here is a clean, ready-to-use **Professional Email Template**:\n\n**Subject:** Request for [Topic / Leave]\n\nDear [Name],\n\nI hope you are doing well. I am writing to kindly request [details]. Please let me know if you need any further information.\n\nBest regards,\n[Your Name]",
      hi: 'यहाँ एक साफ़ **प्रोफ़ेशनल ईमेल टेम्पलेट** है:\n\n**विषय:** [विषय लिखें]\n\nआदरणीय [नाम],\n\nसादर नमस्कार। मैं यह ईमेल [कारण] के संबंध में लिख रहा हूँ। कृपया इस पर विचार करने की कृपा करें।\n\nधन्यवाद,\n[आपका नाम]',
      hinglish: 'Yeh raha ek clean **Professional Email Template**:\n\n**Subject:** Request regarding [Topic]\n\nDear [Name],\n\nI hope you are doing well. Main yeh email [reason] ke liye likh raha hoon. Please batayein agar kisi aur detail ki zaroorat ho.\n\nBest regards,\n[Aapka Naam]',
      es: 'Aquí tienes una plantilla breve de correo profesional:\n\n**Asunto:** Solicitud sobre [Tema]\n\nEstimado/a [Nombre],\n\nEspero que se encuentre bien. Le escribo para solicitar [detalle]. Quedo atento a su respuesta.\n\nSaludos cordiales,\n[Tu Nombre]',
      fr: 'Voici un modèle simple de courriel professionnel :\n\n**Objet :** Demande concernant [Sujet]\n\nBonjour [Nom],\n\nJe me permets de vous contacter au sujet de [détail]. Merci par avance pour votre retour.\n\nCordialement,\n[Votre Nom]',
      ar: 'إليك قالب رسالة بريد إلكتروني احترافية:\n\n**الموضوع:** طلب بخصوص [الموضوع]\n\nتحية طيبة [الاسم]،\nأتمنى أن تكون بخير. أكتب إليك بخصوص [التفاصيل].\n\nمع خالص التحية،\n[اسمك]',
    },
  },
  {
    isChitchat: true,
    keywords: ['thank', 'thanks', 'shukriya', 'dhanyawad', 'gracias', 'merci', 'شكرا', 'धन्यवाद', 'शुक्रिया'],
    replies: {
      en: "You're very welcome! Feel free to ask anytime.",
      hi: 'आपका स्वागत है! जब चाहें तब पूछें।',
      hinglish: 'Aapka welcome hai! Jab bhi zaroorat ho pooch sakte hain.',
      es: '¡De nada! Pregunta cuando quieras.',
      fr: 'Avec plaisir ! N’hésitez pas si vous avez d’autres questions.',
      ar: 'على الرحب والسعة! يمكنك سؤالي في أي وقت.',
    },
  },
  {
    keywords: ['data structure', 'algorithm', 'big o', 'time complexity', 'binary search', 'linked list', 'stack', 'queue', 'sorting', 'dsa'],
    replies: {
      en: '### Data Structures & Algorithms Essentials\n- **Arrays (`O(1)` access)**: Fast indexed lookup; fixed/contiguous memory.\n- **Hash Map (`O(1)` avg lookup)**: Best for frequency counts, caching, and deduplication.\n- **Stack (LIFO) & Queue (FIFO)**: Undo/call stack vs task scheduling and BFS.\n- **Binary Search (`O(log n)`)**: Halves a sorted search space each step.\n- **Sorting (`O(n log n)`)**: Merge Sort (stable), Quick Sort (fast average in-place).',
      hi: '### डेटा स्ट्रक्चर और एल्गोरिदम (DSA)\n- **Array (`O(1)` एक्सेस)**: इंडेक्स से तुरंत डेटा पढ़ना।\n- **Hash Map (`O(1)` औसत खोज)**: तेज़ सर्च और कैशिंग के लिए श्रेष्ठ।\n- **Stack (LIFO) व Queue (FIFO)**: Undo/कॉल स्टैक बनाम कतार व BFS।\n- **Binary Search (`O(log n)`)**: सॉर्टेड डेटा में आधी-आधी खोज।',
      hinglish: '### DSA & Algorithms Cheat Sheet\n- **Array (`O(1)` access)**: Index se fast lookup.\n- **Hash Map (`O(1)` avg)**: Fast key-value search aur frequency counting.\n- **Stack (LIFO) & Queue (FIFO)**: Recursion/Undo ke liye Stack, BFS/Tasks ke liye Queue.\n- **Binary Search (`O(log n)`)**: Sorted array mein fastest search.\n- **Merge / Quick Sort (`O(n log n)`)**: Efficient general sorting.',
    },
  },
  {
    keywords: ['git', 'github', 'commit', 'branch', 'merge', 'pull request', 'push', 'repository'],
    replies: {
      en: '### Essential Git & GitHub Workflow\n```bash\ngit init\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit remote add origin <repo-url>\ngit push -u origin main\n```\n- Use `git checkout -b feature-name` for safe parallel work and `git status` before committing.',
      hi: '### Git और GitHub के मुख्य कमांड\n```bash\ngit init\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit push -u origin main\n```\n- नई ब्रांच बनाने के लिए `git checkout -b feature` का उपयोग करें।',
      hinglish: '### Git & GitHub Essential Commands\n```bash\ngit init\ngit add .\ngit commit -m "Save changes"\ngit branch -M main\ngit push -u origin main\n```\n- Naye feature ke liye `git checkout -b feature-x` aur status check karne ke liye `git status` chalayein.',
    },
  },
  {
    keywords: ['database', 'sql', 'nosql', 'mysql', 'postgresql', 'mongodb', 'primary key', 'index'],
    replies: {
      en: '### Databases: SQL vs NoSQL\n- **SQL (PostgreSQL, MySQL)**: Structured tables, strict schemas, JOIN queries, and ACID transactions — ideal for finance, inventory, and relational data.\n- **NoSQL (MongoDB, Firestore)**: Flexible JSON-like documents and horizontal scaling — great for rapid iteration, feeds, and nested objects.\n- **Indexing**: Speeds up `WHERE` and `JOIN` lookups dramatically at the cost of slightly slower writes.',
      hi: '### डेटाबेस: SQL बनाम NoSQL\n- **SQL (PostgreSQL, MySQL)**: निश्चित टेबल, रिलेशनशिप (JOIN) और ACID सुरक्षा — बैंकिंग व संरचित डेटा के लिए।\n- **NoSQL (MongoDB, Firestore)**: लचीले डॉक्यूमेंट और तेज़ स्केलिंग के लिए।',
      hinglish: '### Databases: SQL vs NoSQL\n- **SQL (PostgreSQL, MySQL)**: Fixed tables, relationships (JOINs) aur strict ACID reliability.\n- **NoSQL (MongoDB, Firestore)**: Flexible document structure aur fast horizontal scaling.\n- **Indexes**: Read queries fast karte hain.',
    },
  },
  {
    keywords: ['rest api', 'http', 'https', 'json', 'status code', 'backend', 'cors', 'cybersecurity', 'encryption'],
    replies: {
      en: '### Web APIs, HTTP & Security Basics\n- **HTTP Methods**: `GET` (read), `POST` (create), `PUT/PATCH` (update), `DELETE` (remove).\n- **Status Codes**: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Server Error`.\n- **Security Essentials**: Always serve over **HTTPS**, validate inputs, escape untrusted HTML to prevent XSS, and never expose private API keys in frontend JS.',
      hinglish: '### Web APIs, HTTP & Security Guide\n- **Methods**: `GET` (fetch), `POST` (send/create), `PATCH` (update), `DELETE` (remove).\n- **Status Codes**: `200` Success, `400` Bad Input, `401` Auth Failed, `404` Not Found, `500` Server Issue.\n- **Security**: HTTPS use karein, inputs validate karein, aur secret keys kabhi frontend code mein na rakhein.',
    },
  },
  {
    keywords: ['newton', 'gravity', 'physics', 'ohm', 'electricity', 'force', 'energy', 'photosynthesis', 'biology', 'dna', 'cell'],
    replies: {
      en: '### Core Science & Physics Principles\n- **Newton’s Laws**: (1) Inertia — objects keep their state unless acted on by net force; (2) `F = m × a`; (3) Every action has an equal and opposite reaction.\n- **Ohm’s Law**: `V = I × R` (Voltage = Current × Resistance).\n- **Photosynthesis**: Plants convert `CO₂ + H₂O + Sunlight` into **Glucose (`C₆H₁₂O₆`) + Oxygen (`O₂`)** inside chloroplasts.\n- **DNA**: Double-helix molecule carrying genetic instructions (`A–T`, `C–G` base pairs).',
      hi: '### विज्ञान के प्रमुख सिद्धांत\n- **न्यूटन के नियम**: (1) जड़त्व का नियम, (2) `F = m × a`, (3) क्रिया-प्रतिक्रिया का नियम।\n- **ओम का नियम**: `V = I × R` (वोल्टेज = धारा × प्रतिरोध)।\n- **प्रकाश संश्लेषण**: पौधे सूर्य के प्रकाश में `CO₂` और पानी से ग्लूकोज़ व ऑक्सीजन बनाते हैं।',
      hinglish: '### Science & Physics Key Concepts\n- **Newton’s Laws**: (1) Inertia, (2) `F = m × a`, (3) Equal & opposite reaction.\n- **Ohm’s Law**: `V = I × R`.\n- **Photosynthesis**: Plants sunlight se `CO₂ + Water` ko Glucose aur Oxygen mein convert karte hain.',
    },
  },
  {
    keywords: ['resume', 'cv', 'interview', 'job', 'career', 'star method', 'salary'],
    replies: {
      en: '### High-Impact Resume & Interview (STAR Method)\n- **Resume Rules**: Keep it 1 page (for <5 yrs experience), start bullets with action verbs + measurable results (*"Reduced load time by 40%"*).\n- **STAR Interview Framework**:\n  1. **S**ituation — Set the context briefly.\n  2. **T**ask — What problem were you responsible for?\n  3. **A**ction — Exact steps *you* took.\n  4. **R**esult — Measurable outcome or lesson learned.',
      hi: '### रिज़्यूमे और इंटरव्यू (STAR तरीका)\n- **रिज़्यूमे**: 1 पेज में रखें और उपलब्धियों को संख्या/प्रतिशत के साथ लिखें।\n- **STAR उत्तर विधि**: **S**ituation (स्थिति) → **T**ask (कार्य) → **A**ction (आपका कदम) → **R**esult (परिणाम)।',
      hinglish: '### Resume aur Interview Crack Karne ka STAR Formula\n- **Resume**: 1 page crisp rakhein, projects aur measurable results (*"Improved speed by 35%"*) likhein.\n- **STAR Method**: Answer dete waqt **S**ituation → **T**ask → **A**ction → **R**esult sequence follow karein.',
    },
  },
];

/**
 * Generates an intelligent offline response using:
 * 1. "Remember that..." learning parser
 * 2. User-saved Custom Memory in localStorage
 * 3. Live Date & Time
 * 4. Math & Unit Conversions
 * 5. Text utilities (word count, reverse)
 * 6. Multilingual Knowledge Base
 * 7. Helpful contextual fallback
 *
 * @param {string} userText
 * @param {string} selectedLang
 * @param {Array<{id: string, question: string, answer: string}>} customMemory
 * @param {(question: string, answer: string) => void} saveMemoryFn
 * @param {Array<{ id: string, title: string, query?: string, summary: string, url?: string }>} [learnedKnowledge]
 * @returns {{ reply: string, matched: boolean, kind: 'utility' | 'chitchat' | 'topic' | 'fallback', switchLang?: string, numericResult?: number, topicLabel?: string, fromLearned?: boolean }}
 */
export function generateOfflineReply(userText, selectedLang, customMemory, saveMemoryFn, learnedKnowledge = []) {
  const trimmed = userText.trim();
  const lower = trimmed.toLowerCase();
  const lang = resolveReplyLanguage(trimmed, selectedLang);

  // 0. Conversational language switch request
  if (
    /\b(speak in hindi|reply in hindi|talk in hindi|hindi mein bolo|hindi me bolo|hindi mein baat|hindi me baat|hindi mein jawab|switch to hindi)\b|हिन्दी में बोलो|हिंदी में बोलो|हिन्दी में बात/i.test(
      trimmed
    )
  ) {
    return {
      matched: true,
      kind: 'utility',
      switchLang: 'hi',
      reply: 'ज़रूर! अब मैं आपसे **हिन्दी** में बात करूँगा और हिन्दी में ही उत्तर पढ़कर सुनाऊँगा। बताइए, मैं आपकी क्या मदद कर सकता हूँ?',
    };
  }
  if (/\b(speak in english|reply in english|switch to english|english mein bolo)\b/i.test(trimmed)) {
    return {
      matched: true,
      kind: 'utility',
      switchLang: 'en',
      reply: 'Sure! I have switched to **English**. How can I help you today?',
    };
  }
  if (/\b(hinglish mein bolo|switch to hinglish|hinglish me baat)\b/i.test(trimmed)) {
    return {
      matched: true,
      kind: 'utility',
      switchLang: 'hinglish',
      reply: 'Bilkul! Ab main **Hinglish** mein baat karunga. Bataiye kya sawal hai?',
    };
  }

  // 1. Teach MyAI directly from chat ("remember that my name is X" / "yaad rakho mera naam X hai")
  const rememberMatch = trimmed.match(
    /^(?:remember that|remember|yaad rakho ki|yaad rakho|याद रखो कि|याद रखो|recuerda que|retiens que|تذكر أن)\s+(.+)$/i
  );
  if (rememberMatch) {
    const fact = rememberMatch[1].trim();
    saveMemoryFn(fact, fact);
    if (lang === 'hi') return { matched: true, kind: 'utility', reply: `ठीक है, मैंने ऑफ़लाइन मेमोरी में सहेज लिया है: **"${fact}"**` };
    if (lang === 'hinglish') return { matched: true, kind: 'utility', reply: `Done! Maine offline memory mein save kar liya hai: **"${fact}"**` };
    if (lang === 'es') return { matched: true, kind: 'utility', reply: `Entendido, lo guardé en tu memoria local: **"${fact}"**` };
    if (lang === 'fr') return { matched: true, kind: 'utility', reply: `C'est noté ! Enregistré localement : **"${fact}"**` };
    if (lang === 'ar') return { matched: true, kind: 'utility', reply: `حسناً، تم الحفظ في الذاكرة المحلية: **"${fact}"**` };
    return { matched: true, kind: 'utility', reply: `Got it! I saved that to your offline memory: **"${fact}"**` };
  }

  // 2. Match against user's Custom Memory
  if (Array.isArray(customMemory) && customMemory.length > 0) {
    const userWords = lower.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 2);
    let bestItem = null;
    let bestScore = 0;

    for (const item of customMemory) {
      const qLower = item.question.toLowerCase();
      if (lower.includes(qLower) || qLower.includes(lower)) {
        bestItem = item;
        bestScore = 999;
        break;
      }
      const qWords = qLower.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 2);
      const overlap = userWords.filter((w) => qWords.includes(w)).length;
      if (overlap >= 2 && overlap > bestScore) {
        bestScore = overlap;
        bestItem = item;
      }
    }

    if (bestItem) {
      if (lang === 'hi') return { matched: true, kind: 'utility', reply: `आपकी सहेजी गई मेमोरी के अनुसार:\n\n**${bestItem.answer}**` };
      if (lang === 'hinglish') return { matched: true, kind: 'utility', reply: `Aapki saved memory ke hisaab se:\n\n**${bestItem.answer}**` };
      return { matched: true, kind: 'utility', reply: `From your saved offline memory:\n\n**${bestItem.answer}**` };
    }
  }

  // 3. Date & Time
  if (/\b(time|date|today|day is it|samay|waqt|tarikh|aaj kaun sa din|din kya|hora|fecha|heure|الوقت|التاريخ)\b/i.test(lower)) {
    const now = new Date();
    const locale = SPEECH_LOCALES[lang] || 'en-US';
    const dateStr = now.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    if (lang === 'hi') return { matched: true, kind: 'utility', reply: `अभी का समय **${timeStr}** है और आज **${dateStr}** है।` };
    if (lang === 'hinglish') return { matched: true, kind: 'utility', reply: `Abhi time **${timeStr}** hai aur aaj **${dateStr}** hai.` };
    if (lang === 'es') return { matched: true, kind: 'utility', reply: `Ahora son las **${timeStr}** y hoy es **${dateStr}**.` };
    if (lang === 'fr') return { matched: true, kind: 'utility', reply: `Il est **${timeStr}** et nous sommes le **${dateStr}**.` };
    if (lang === 'ar') return { matched: true, kind: 'utility', reply: `الوقت الآن **${timeStr}** وتاريخ اليوم **${dateStr}**.` };
    return { matched: true, kind: 'utility', reply: `The current time is **${timeStr}** and today is **${dateStr}**.` };
  }

  // 4. Math & Unit conversions
  const mathReply = tryMathAndConversion(trimmed, lang);
  if (mathReply) return { matched: true, kind: 'utility', reply: mathReply.text, numericResult: mathReply.value };

  // 5. Text utilities
  const wordCountMatch = trimmed.match(/^(?:count words in|word count of|words in)\s+(.+)$/i);
  if (wordCountMatch) {
    const sample = wordCountMatch[1].trim();
    const words = sample.split(/\s+/).filter(Boolean).length;
    return { matched: true, kind: 'utility', reply: `Word count: **${words}** words · **${sample.length}** characters.` };
  }

  const reverseMatch = trimmed.match(/^(?:reverse|ulta karo)\s+(.+)$/i);
  if (reverseMatch) {
    const reversed = Array.from(reverseMatch[1].trim()).reverse().join('');
    return { matched: true, kind: 'utility', reply: `Reversed text:\n\n\`${reversed}\`` };
  }

  // 6. Multilingual Knowledge Base weighted keyword matching
  let topTopic = null;
  let topHits = 0;

  for (let idx = 0; idx < KNOWLEDGE_BASE.length; idx++) {
    const topic = KNOWLEDGE_BASE[idx];
    let hits = 0;
    for (const kw of topic.keywords) {
      const cleanKw = kw.trim();
      if (!cleanKw) continue;
      if (cleanKw.length <= 3) {
        const rx = new RegExp(`(?:^|[^\\p{L}\\p{N}])${cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:$|[^\\p{L}\\p{N}])`, 'iu');
        if (rx.test(lower)) hits += 2;
      } else if (lower.includes(cleanKw)) {
        hits += cleanKw.includes(' ') ? 4 : 2;
      }
    }
    if (hits > topHits) {
      topHits = hits;
      topTopic = { topic, idx };
    }
  }

  if (topTopic) {
    const kind = topTopic.topic.isChitchat ? 'chitchat' : 'topic';
    if (kind === 'chitchat') {
      return {
        matched: true,
        kind,
        topicLabel: topTopic.topic.keywords[0],
        reply: topTopic.topic.replies[lang] || topTopic.topic.replies.en,
      };
    }
  }

  // 6b. Check previously learned browser research knowledge stored locally
  if (Array.isArray(learnedKnowledge) && learnedKnowledge.length > 0) {
    const stopSet = new Set([
      'what', 'who', 'when', 'where', 'why', 'how', 'tell', 'about', 'explain', 'define', 'learn',
      'research', 'search', 'mean', 'meaning', 'kya', 'hai', 'hain', 'kaun', 'kon', 'kab', 'kahan',
      'kaise', 'batao', 'bataiye', 'samjhao', 'bare', 'baare', 'mein', 'me', 'sikho', 'the', 'and',
      'क्या', 'कौन', 'कब', 'कहाँ', 'कैसे', 'बताओ', 'बताइए', 'बारे', 'में', 'है', 'हैं',
    ]);
    const userTokens = lower
      .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 2 && !stopSet.has(w));

    let bestLearned = null;
    let bestScore = 0;

    for (const item of learnedKnowledge) {
      const titleLower = (item.title || '').toLowerCase();
      const queryLower = (item.query || '').toLowerCase();
      if (!titleLower) continue;

      let score = 0;
      if (titleLower.length >= 3 && (lower.includes(titleLower) || titleLower === lower)) {
        score += 100;
      }
      if (queryLower.length >= 3 && (lower.includes(queryLower) || queryLower === lower)) {
        score += 60;
      }

      if (userTokens.length > 0) {
        const titleWords = `${titleLower} ${queryLower}`
          .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
          .split(/\s+/)
          .filter((w) => w.length >= 2);
        const summaryLower = (item.summary || '').toLowerCase();
        let hits = 0;
        for (const tok of userTokens) {
          if (titleWords.some((tw) => tw === tok || (tok.length >= 4 && tw.includes(tok)))) {
            hits += 2;
          } else if (tok.length >= 4 && summaryLower.includes(tok)) {
            hits += 1;
          }
        }
        if (hits >= 2) score += hits * 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestLearned = item;
      }
    }

    if (bestLearned && bestScore >= 20) {
      const sourceBlock = bestLearned.url
        ? `\n\n#### ${lang === 'hi' ? 'स्रोत' : lang === 'es' ? 'Fuente' : lang === 'fr' ? 'Source' : lang === 'ar' ? 'المصدر' : 'Source'}\n- [${bestLearned.title}](${bestLearned.url})`
        : '';
      let intro = `From what I learned via browser research on **${bestLearned.title}**:`;
      if (lang === 'hi') intro = `ब्राउज़र रिसर्च से **${bestLearned.title}** के बारे में जो मैंने सीखा है:`;
      else if (lang === 'hinglish') intro = `Browser research se **${bestLearned.title}** ke baare mein jo maine seekha hai:`;
      else if (lang === 'es') intro = `Según lo que aprendí del navegador sobre **${bestLearned.title}**:`;
      else if (lang === 'fr') intro = `D'après ce que j'ai appris sur **${bestLearned.title}** :`;
      else if (lang === 'ar') intro = `مما تعلمته من بحث المتصفح حول **${bestLearned.title}**:`;

      return {
        matched: true,
        kind: 'topic',
        fromLearned: true,
        topicLabel: bestLearned.title,
        reply: `${intro}\n\n${bestLearned.summary}${sourceBlock}`,
      };
    }
  }

  if (topTopic) {
    return {
      matched: true,
      kind: 'topic',
      topicLabel: topTopic.topic.keywords[0],
      reply: topTopic.topic.replies[lang] || topTopic.topic.replies.en,
    };
  }

  // 7. Helpful offline fallback
  if (lang === 'hi') {
    return {
      matched: false,
      kind: 'fallback',
      reply: `मैंने आपका प्रश्न पढ़ा: **"${trimmed}"**\n\nमैं एक ऑफ़लाइन सहायक हूँ, इसलिए बिना इंटरनेट के वेब सर्च नहीं हो सकता। लेकिन मैं इनमें मदद कर सकता हूँ:\n- **गणित और यूनिट कन्वर्ज़न** (जैसे \`15% of 2400\` या \`10 km to miles\`)\n- **कोडिंग, विज्ञान, पढ़ाई और स्वास्थ्य के सवाल**\n- **कस्टम मेमोरी**: आप **"याद रखो कि ..."** लिखकर मुझे नया जवाब सिखा सकते हैं।`,
    };
  }
  if (lang === 'hinglish') {
    return {
      matched: false,
      kind: 'fallback',
      reply: `Maine aapka sawal padha: **"${trimmed}"**\n\nAbhi offline mode active hai. Online hone par **Browser Research** button on karke aap live web summaries bhi paa sakte hain, ya offline mein:\n- **Math & Conversions**: \`245 * 18\` ya \`10 km to miles\`\n- **Coding, AI, Study, Health, Space, Email templates**\n- **Custom Memory**: **"Yaad rakho ..."** likhkar apna jawab save karein!`,
    };
  }
  if (lang === 'es') {
    return {
      matched: false,
      kind: 'fallback',
      reply: `Leí tu consulta: **"${trimmed}"**\n\nEn modo sin conexión puedo ayudarte con matemáticas, conversiones, programación, consejos de estudio o guardar respuestas en **Memoria Personal**. Activa **Investigar** cuando tengas conexión para buscar resúmenes web.`,
    };
  }
  if (lang === 'fr') {
    return {
      matched: false,
      kind: 'fallback',
      reply: `J'ai bien reçu votre message : **"${trimmed}"**\n\nHors ligne, je peux résoudre des calculs, convertir des unités, donner des exemples de code ou mémoriser vos propres réponses. Activez **Recherche Web** en ligne pour rechercher des résumés.`,
    };
  }
  if (lang === 'ar') {
    return {
      matched: false,
      kind: 'fallback',
      reply: `قرأت سؤالك: **"${trimmed}"**\n\nفي الوضع غير المتصل يمكنني مساعدتك في الحسابات وتحويل الوحدات والبرمجة والذاكرة المخصصة. فعّل **بحث المتصفح** عند الاتصال للحصول على ملخصات الويب.`,
    };
  }

  return {
    matched: false,
    kind: 'fallback',
    reply: `I received your question: **"${trimmed}"**\n\nRight now I'm answering offline from local memory. Turn on **Web Research** (globe button in the composer) while online to look up live summaries, or use offline features:\n- **Math & Unit Conversions** (try \`(245 * 18) + sqrt(144)\` or \`10 km to miles\`)\n- **Coding, Science, Study & Health Guides**\n- **Custom Offline Memory**: Type \`Remember that ...\` or open **Custom Memory** in the sidebar!`,
  };
}
