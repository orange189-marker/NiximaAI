export type Language = 'en' | 'uk';

export interface Translations {
  common: {
    save: string;
    cancel: string;
    close: string;
    copy: string;
    copied: string;
    delete: string;
    clear: string;
    edit: string;
    retry: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    status: string;
    loading: string;
    success: string;
    error: string;
    reset: string;
    active: string;
    offline: string;
    online: string;
    back: string;
    next: string;
    confirm: string;
    language: string;
    english: string;
    ukrainian: string;
  };

  auth: {
    languageSelectorTitle: string;
    badgeSovereignMesh: string;
    step1Title: string;
    step1Subtitle: string;
    step1LanguageLabel: string;
    step1LanguageHint: string;
    handleLabel: string;
    handlePlaceholder: string;
    handlePrefixNotice: string;
    handleFormatHelp: string;
    handleRules: {
      length: string;
      chars: string;
      reserved: string;
    };
    checkingHandle: string;
    handleAvailable: string;
    handleTaken: string;
    btnClaimAndProceed: string;
    btnLocking: string;

    step2Title: string;
    step2Subtitle: string;
    operatorBadge: string;
    nameLabel: string;
    namePlaceholder: string;
    nameHelp: string;
    passphraseLabel: string;
    passphrasePlaceholder: string;
    passphraseHelp: string;
    btnConfirmAndLaunch: string;
    btnBackToHandle: string;

    signInTab: string;
    registerTab: string;
    signInTitle: string;
    signInSubtitle: string;
    signInHandlePlaceholder: string;
    signInPassphrasePlaceholder: string;
    btnSignIn: string;
    noAccountYet: string;
    alreadyHaveAccount: string;
    switchIdentity: string;

    quickPassTitle: string;
    quickPassSubtitle: string;
    quickPassBadge: string;
    quickPassRole: string;
    btnLaunchWorkspace: string;
    btnSwitchAccount: string;
    rememberTerminal: string;

    crossoverBtn: string;
    crossoverModalTitle: string;
    crossoverModalSubtitle: string;
    crossoverMethod1Title: string;
    crossoverMethod1Desc: string;
    btnForceCloudSync: string;
    crossoverMethod2Title: string;
    crossoverMethod2Desc: string;
    btnExportSyncKey: string;
    syncKeyCopied: string;
    importKeyPlaceholder: string;
    btnLinkAndSync: string;
    cloudSyncedNotice: string;

    vaultLaunch: {
      initializing: string;
      stepDecrypt: string;
      stepNodes: string;
      stepReady: string;
    };
  };

  header: {
    selectModel: string;
    sovereignEngine: string;
    tuning: string;
    meshActive: string;
    newChatTooltip: string;
    newChatMobile: string;
    aboutTooltip: string;
    settingsTooltip: string;
    collapseSidebarTooltip: string;
    expandSidebarTooltip: string;
    closeMenu: string;
    defaultBadge: string;
  };

  sidebar: {
    conversationsTitle: string;
    newChatButton: string;
    searchPlaceholder: string;
    pinnedSection: string;
    recentSection: string;
    today: string;
    yesterday: string;
    previous7Days: string;
    previous30Days: string;
    noConversations: string;
    noMatchingConversations: string;
    untitledConversation: string;
    pinChatTooltip: string;
    unpinChatTooltip: string;
    renameTooltip: string;
    exportMarkdownTooltip: string;
    deleteChatTooltip: string;
    defaultOperator: string;
    signOutTooltip: string;
    researchLink: string;
    clearAllChats: string;
  };

  chatInput: {
    placeholder: string;
    modifierLabel: string;
    modifiers: {
      concise: { label: string; prompt: string };
      codeOnly: { label: string; prompt: string };
      deepProof: { label: string; prompt: string };
      table: { label: string; prompt: string };
    };
    deepThink: string;
    deepThinkTooltip: string;
    search: string;
    searchTooltip: string;
    audioMute: string;
    audioEnable: string;
    attachTooltip: string;
    stopTooltip: string;
    sendTooltip: string;
    chars: string;
    meshOnline: string;
    enterToSend: string;
    shiftEnterNewline: string;
  };

  chatMessage: {
    you: string;
    thinking: string;
    reasoning: string;
    generatingTrace: string;
    reasoningProcess: string;
    chainOfThought: string;
    saveAndResend: string;
    tokensCount: string;
    copyResponse: string;
    copied: string;
    regenerate: string;
    editPrompt: string;
    helpful: string;
    notHelpful: string;
    copyCode: string;
    downloadCode: string;
  };

  table: {
    filterPlaceholder: string;
    showingRows: (count: number, total: number) => string;
    copyCsv: string;
    copyMarkdown: string;
    exportCsv: string;
    copiedCsv: string;
    copiedMarkdown: string;
  };

  emptyChat: {
    brandBadge: (model: string) => string;
    heroTitle: string;
    heroSubtitle: (model: string) => string;
    promptCards: Array<{
      category: string;
      title: string;
      prompt: string;
    }>;
    contextWindowLabel: string;
    throughputLabel: string;
    precisionSlaLabel: string;
  };

  settings: {
    title: string;
    tabs: {
      general: string;
      inference: string;
      persona: string;
      data: string;
      api: string;
    };
    languageSectionTitle: string;
    languageSectionDesc: string;
    languageUkTitle: string;
    languageUkDesc: string;
    languageEnTitle: string;
    languageEnDesc: string;
    accountTitle: string;
    sovereignBadge: string;
    systemPromptTitle: string;
    systemPromptDesc: string;
    temperatureTitle: string;
    temperatureDesc: string;
    topPTitle: string;
    topPDesc: string;
    contextLimitTitle: string;
    contextLimitDesc: string;
    personaToneTitle: string;
    personaToneDesc: string;
    tones: Array<{ id: string; name: string; desc: string }>;
    audioEffectsTitle: string;
    audioEffectsDesc: string;
    wallpaperTitle: string;
    wallpaperDesc: string;
    hotkeySectionTitle: string;
    hotkeySectionDesc: string;
    btnCustomizeHotkey: string;
    exportDataTitle: string;
    exportDataDesc: string;
    btnExportJson: string;
    importDataTitle: string;
    importDataDesc: string;
    btnImportJson: string;
    dangerZoneTitle: string;
    dangerZoneDesc: string;
    btnClearAll: string;
    apiKeyTitle: string;
    apiKeyDesc: string;
    btnCopyApiKey: string;
    btnResetDefaults: string;
    btnDone: string;
  };

  company: {
    title: string;
    overviewBadge: string;
    heroHeading: string;
    heroDescription: string;
    pillars: {
      engineTitle: string;
      engineDesc: string;
      logicTitle: string;
      logicDesc: string;
      developerTitle: string;
      developerDesc: string;
      edgeTitle: string;
      edgeDesc: string;
    };
    hqLabel: string;
    hqValue: string;
    copyright: string;
    closeBtn: string;
  };

  hotkeys: {
    title: string;
    subtitle: string;
    deviceProfile: string;
    presetsTitle: string;
    recordTitle: string;
    recordDesc: string;
    recordPrompt: string;
    recordActive: string;
    btnResetDefault: string;
    btnSave: string;
    btnCancel: string;
  };

  models: Record<string, {
    name: string;
    badge: string;
    description: string;
    strengths: string[];
  }>;
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      copy: 'Copy',
      copied: 'Copied!',
      delete: 'Delete',
      clear: 'Clear',
      edit: 'Edit',
      retry: 'Retry',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      status: 'Status',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      reset: 'Reset',
      active: 'Active',
      offline: 'Offline',
      online: 'Online',
      back: 'Back',
      next: 'Next',
      confirm: 'Confirm',
      language: 'Language',
      english: 'English',
      ukrainian: 'Ukrainian',
    },

    auth: {
      languageSelectorTitle: 'Interface Language',
      badgeSovereignMesh: 'Sovereign Intelligence Mesh',
      step1Title: 'Create Sovereign Nixima ID',
      step1Subtitle: 'Claim your exclusive handle across the decentralized Nixima AI neural network.',
      step1LanguageLabel: 'Preferred Language / Бажана мова',
      step1LanguageHint: 'Choose your preferred language for this terminal and your profile.',
      handleLabel: 'Nixima Sovereign Handle',
      handlePlaceholder: 'e.g. bogdan, neo, alex',
      handlePrefixNotice: 'Will be bound as',
      handleFormatHelp: '3–24 characters. Lowercase letters, numbers, underscores or hyphens.',
      handleRules: {
        length: 'Minimum 3 characters',
        chars: 'Alphanumeric and hyphens only',
        reserved: 'Globally unique handle',
      },
      checkingHandle: 'Checking availability...',
      handleAvailable: 'Handle is available to claim',
      handleTaken: 'Handle is already claimed on the mesh',
      btnClaimAndProceed: 'Claim Nixima ID & Proceed to Step 2',
      btnLocking: 'Reserving Sovereign ID...',

      step2Title: 'Finalize Operator Credentials',
      step2Subtitle: 'Protect your neural vault with an operator callsign and security passphrase.',
      operatorBadge: 'Reserved Identity',
      nameLabel: 'Operator Name or Callsign',
      namePlaceholder: 'e.g. Bogdan, Lead Architect',
      nameHelp: 'Displayed across your sovereign workspace and conversations.',
      passphraseLabel: 'Security Passphrase',
      passphrasePlaceholder: 'Create a strong passphrase (min. 4 chars)',
      passphraseHelp: 'Used to unlock your workspace session across verified terminals.',
      btnConfirmAndLaunch: 'Confirm & Launch Workspace',
      btnBackToHandle: '← Change Sovereign Handle',

      signInTab: 'Sign In',
      registerTab: 'Create Nixima ID',
      signInTitle: 'Welcome Back, Operator',
      signInSubtitle: 'Enter your credentials to unlock your encrypted sovereign workspace.',
      signInHandlePlaceholder: 'Handle or handle@nixima.ai',
      signInPassphrasePlaceholder: 'Security Passphrase',
      btnSignIn: 'Unlock Workspace',
      noAccountYet: "Don't have a Nixima ID yet?",
      alreadyHaveAccount: 'Already have a registered Nixima ID?',
      switchIdentity: 'Switch Account / Create New ID',

      quickPassTitle: 'Welcome Back',
      quickPassSubtitle: 'Your encrypted session key is active on this terminal.',
      quickPassBadge: '1-Click Ready',
      quickPassRole: 'Founding Operator',
      btnLaunchWorkspace: 'Enter Workspace in 1-Click',
      btnSwitchAccount: 'Switch Identity or Register New',
      rememberTerminal: 'Enable 1-Click Fast Sign-In on this terminal',

      crossoverBtn: 'Cross-Device Crossover',
      crossoverModalTitle: 'Cross-Device Synchronization',
      crossoverModalSubtitle: 'Seamlessly share accounts and conversations between laptop, mobile, and tablets.',
      crossoverMethod1Title: 'Method 1: Cloud Mesh Sync',
      crossoverMethod1Desc: 'Accounts synchronize automatically across all devices connected to the Nixima network.',
      btnForceCloudSync: 'Force Sync With Nixima Cloud',
      crossoverMethod2Title: 'Method 2: Sovereign Link Key',
      crossoverMethod2Desc: 'Export an encrypted sync key to instantly link this device with another terminal.',
      btnExportSyncKey: 'Export & Copy Sovereign Link Key',
      syncKeyCopied: 'Link Key Copied to Clipboard!',
      importKeyPlaceholder: 'Paste NXK-... key from another device',
      btnLinkAndSync: 'Link & Sync Device',
      cloudSyncedNotice: 'Synchronized with Nixima Cloud Mesh',

      vaultLaunch: {
        initializing: 'Initializing Sovereign Vault...',
        stepDecrypt: 'Decrypting Sovereign Vault...',
        stepNodes: 'Binding Neural Mesh Nodes...',
        stepReady: 'Workspace Initialized',
      },
    },

    header: {
      selectModel: 'Select Nixima Model',
      sovereignEngine: 'Sovereign Engine',
      tuning: 'Tuning',
      meshActive: 'Mesh Active',
      newChatTooltip: 'New conversation',
      newChatMobile: 'New chat',
      aboutTooltip: 'About Nixima AI',
      settingsTooltip: 'Model & System Settings',
      collapseSidebarTooltip: 'Collapse sidebar',
      expandSidebarTooltip: 'Expand sidebar',
      closeMenu: 'Close menu',
      defaultBadge: 'DEFAULT',
    },

    sidebar: {
      conversationsTitle: 'Conversations',
      newChatButton: 'New conversation',
      searchPlaceholder: 'Search chats...',
      pinnedSection: 'Pinned',
      recentSection: 'Recent',
      today: 'Today',
      yesterday: 'Yesterday',
      previous7Days: 'Previous 7 days',
      previous30Days: 'Previous 30 days',
      noConversations: 'No conversations yet',
      noMatchingConversations: 'No matching conversations',
      untitledConversation: 'Untitled Conversation',
      pinChatTooltip: 'Pin chat',
      unpinChatTooltip: 'Unpin chat',
      renameTooltip: 'Rename title',
      exportMarkdownTooltip: 'Export as Markdown (.md)',
      deleteChatTooltip: 'Delete chat',
      defaultOperator: 'Nixima Operator',
      signOutTooltip: 'Sign out / Switch account',
      researchLink: 'Nixima AI Research',
      clearAllChats: 'Clear all chats',
    },

    chatInput: {
      placeholder: 'Ask Nixima anything...',
      modifierLabel: 'Modifier:',
      modifiers: {
        concise: { label: 'Concise', prompt: '[Be concise and direct]' },
        codeOnly: { label: 'Code Only', prompt: '[Provide production-ready code with minimal explanation]' },
        deepProof: { label: 'Deep Proof', prompt: '[Formulate rigorous mathematical or logical derivation]' },
        table: { label: 'Comparison Table', prompt: '[Format output into structured markdown comparison tables]' },
      },
      deepThink: 'Deep Think',
      deepThinkTooltip: 'Activate extended multi-step reasoning',
      search: 'Search',
      searchTooltip: 'Search live web data',
      audioMute: 'Mute typing audio',
      audioEnable: 'Enable typing audio',
      attachTooltip: 'Attach document context',
      stopTooltip: 'Stop generation (Esc)',
      sendTooltip: 'Send message (Enter)',
      chars: 'chars',
      meshOnline: 'Nixima AI Mesh • Online',
      enterToSend: 'Press Enter ↵ to send',
      shiftEnterNewline: 'Shift + Enter for newline',
    },

    chatMessage: {
      you: 'You',
      thinking: 'Nixima is thinking',
      reasoning: 'Nixima is reasoning',
      generatingTrace: 'Generating trace...',
      reasoningProcess: 'Reasoning Process',
      chainOfThought: '(Chain-of-thought)',
      saveAndResend: 'Save & Resend',
      tokensCount: 'tok',
      copyResponse: 'Copy response',
      copied: 'Copied',
      regenerate: 'Regenerate',
      editPrompt: 'Edit prompt',
      helpful: 'Helpful',
      notHelpful: 'Not helpful',
      copyCode: 'Copy code',
      downloadCode: 'Download',
    },

    table: {
      filterPlaceholder: 'Filter table...',
      showingRows: (count: number, total: number) => `Showing ${count} of ${total} rows`,
      copyCsv: 'Copy CSV',
      copyMarkdown: 'Copy MD',
      exportCsv: 'Export CSV',
      copiedCsv: 'Copied CSV!',
      copiedMarkdown: 'Copied MD!',
    },

    emptyChat: {
      brandBadge: (model: string) => `Nixima Neural Engine • Model: ${model}`,
      heroTitle: 'Where intelligence meets precision.',
      heroSubtitle: (model: string) =>
        `Autonomous synthetic intelligence powered by the high-throughput ${model} frontier reasoning engine.`,
      promptCards: [
        {
          category: 'SYSTEMS',
          title: 'Distributed Rust Service',
          prompt: 'Write an asynchronous high-throughput event loop in Rust using Tokio with lock-free queues.',
        },
        {
          category: 'DEEP DIVE',
          title: 'Nixima-0.1 Architecture',
          prompt: 'Explain the internal Sparse Rotary Attention and Mixture-of-Experts architecture of Nixima-0.1.',
        },
        {
          category: 'FRONTEND',
          title: 'Full-Stack React & AI',
          prompt: 'Create a responsive React component that streams token embeddings with real-time audio visualization.',
        },
        {
          category: 'PERFORMANCE',
          title: 'System Optimization',
          prompt: 'Diagnose memory leaks in Node.js event listeners and propose deterministic garbage collection tuning.',
        },
      ],
      contextWindowLabel: 'Context Window',
      throughputLabel: 'Throughput',
      precisionSlaLabel: 'Precision SLA',
    },

    settings: {
      title: 'Nixima AI Control Panel',
      tabs: {
        general: 'General',
        inference: 'Inference',
        persona: 'Persona',
        data: 'Data & Backup',
        api: 'Mesh API',
      },
      languageSectionTitle: 'Language / Мова',
      languageSectionDesc: 'Select your preferred interface language. Changes apply immediately.',
      languageUkTitle: 'Українська',
      languageUkDesc: 'Повна локалізація інтерфейсу та термінології',
      languageEnTitle: 'English (US)',
      languageEnDesc: 'Default international language profile',
      accountTitle: 'Operator Profile',
      sovereignBadge: 'Sovereign Operator',
      systemPromptTitle: 'System Instructions',
      systemPromptDesc: 'Direct the cognitive behavior and core reasoning posture of the model.',
      temperatureTitle: 'Sampling Temperature',
      temperatureDesc: 'Higher values introduce creative variance; lower values maximize deterministic precision.',
      topPTitle: 'Top-P Nucleus Sampling',
      topPDesc: 'Cumulative probability threshold for candidate token evaluation.',
      contextLimitTitle: 'Maximum Generation Length',
      contextLimitDesc: 'Upper ceiling on tokens generated per inference sequence.',
      personaToneTitle: 'Cognitive Persona & Voice',
      personaToneDesc: 'Choose the conversational and architectural tone of responses.',
      tones: [
        { id: 'architect', name: 'Frontier Architect', desc: 'Rigorous, highly technical, precise systems design.' },
        { id: 'cyberpunk', name: 'Cyberpunk Hacker', desc: 'Direct, sharp, minimal fluff, maximum execution speed.' },
        { id: 'academic', name: 'Academic Researcher', desc: 'Theoretical rigor, mathematical deduction, citations.' },
        { id: 'executive', name: 'Executive Strategist', desc: 'High-level synthesis, product vision, commercial impact.' },
      ],
      audioEffectsTitle: 'Synthesizer Audio Feedback',
      audioEffectsDesc: 'Mechanical keystroke feedback and completion acoustics via Web Audio API.',
      wallpaperTitle: 'Dynamic Ambient Matrix Wallpaper',
      wallpaperDesc: 'Fluid animated neural background canvas.',
      hotkeySectionTitle: 'New Conversation Hotkey',
      hotkeySectionDesc: 'Trigger new chats instantly using custom key combinations or gestures.',
      btnCustomizeHotkey: 'Customize Hotkey',
      exportDataTitle: 'Export Conversation History',
      exportDataDesc: 'Download your full conversation database as structured JSON.',
      btnExportJson: 'Export Backup (JSON)',
      importDataTitle: 'Import Conversations',
      importDataDesc: 'Restore conversation archives from a previously exported backup file.',
      btnImportJson: 'Import from JSON',
      dangerZoneTitle: 'Danger Zone',
      dangerZoneDesc: 'Irreversibly erase all stored conversations for this operator profile.',
      btnClearAll: 'Purge All Conversations',
      apiKeyTitle: 'Mesh Client Key',
      apiKeyDesc: 'Cryptographic access token for distributed sovereign mesh nodes.',
      btnCopyApiKey: 'Copy API Key',
      btnResetDefaults: 'Reset to Defaults',
      btnDone: 'Done',
    },

    company: {
      title: 'NIXIMA AI',
      overviewBadge: 'Company Overview',
      heroHeading: 'Architecting Sovereign Synthetic Intelligence',
      heroDescription:
        'Nixima AI is an artificial intelligence research and frontier technology company. We build sparse mixture-of-experts architectures that deliver radical inference efficiency, extended reasoning horizons, and verified mathematical correctness.',
      pillars: {
        engineTitle: 'Nixima-0.1 Engine',
        engineDesc: '480B parameter MoE flagship with dynamic token routing and 2M token context window.',
        logicTitle: 'Deterministic Logic',
        logicDesc: 'Autonomous step-by-step verification pipeline minimizing hallucinations to near-zero.',
        developerTitle: 'Developer First',
        developerDesc: 'Native code synthesis, terminal tooling, and zero-latency streaming pipelines.',
        edgeTitle: 'Edge Deployment',
        edgeDesc: 'High-performance distributed edge mesh running globally with sub-50ms latency.',
      },
      hqLabel: 'Headquarters',
      hqValue: 'Zurich • San Francisco',
      copyright: 'Nixima AI © 2026',
      closeBtn: 'Close',
    },

    hotkeys: {
      title: 'Customize Hotkey & Gestures',
      subtitle: 'Personalize the hotkey for creating a new conversation across your devices.',
      deviceProfile: 'Active Device Profile',
      presetsTitle: 'Quick Platform Presets',
      recordTitle: 'Record Custom Combination',
      recordDesc: 'Press any keyboard combination to immediately capture your shortcut.',
      recordPrompt: 'Click to Record Custom Shortcut',
      recordActive: 'Press keys on keyboard now...',
      btnResetDefault: 'Reset to Platform Default',
      btnSave: 'Save Hotkey',
      btnCancel: 'Cancel',
    },

    models: {
      'nixima-0.1': {
        name: 'Nixima-0.1',
        badge: 'FLAGSHIP',
        description: 'Frontier reasoning and general synthetic intelligence, dynamically routed to top-tier free intelligence clusters.',
        strengths: ['General Intelligence', 'High-Order Logic', 'Multi-turn Memory', 'Agentic Workflows'],
      },
      'nixima-0.1-reasoning': {
        name: 'Nixima-0.1 Reasoning',
        badge: 'CHAIN-OF-THOUGHT',
        description: 'Extended step-by-step chain-of-thought problem solver, powered by NVIDIA Nemotron Nano Omni Reasoning.',
        strengths: ['Math & Physics', 'Formal Logic', 'Deep Deduction', 'Verification'],
      },
      'nixima-0.1-coder': {
        name: 'Nixima-0.1 Coder',
        badge: 'DEV',
        description: 'Specialized code generation, debugging, and systems engineering powered by Cohere North Mini Code.',
        strengths: ['Full-stack App Gen', 'Refactoring', 'Bug Hunting', 'CLI & DevOps'],
      },
      'nixima-0.1-flash': {
        name: 'Nixima-0.1 Flash',
        badge: 'FAST',
        description: 'Sub-millisecond latency for ultra-fast conversation and document parsing, powered by NVIDIA Nemotron Lightning.',
        strengths: ['Instant Responses', 'Document Scanning', 'Rapid Brainstorming'],
      },
    },
  },

  uk: {
    common: {
      save: 'Зберегти',
      cancel: 'Скасувати',
      close: 'Закрити',
      copy: 'Копіювати',
      copied: 'Скопійовано!',
      delete: 'Видалити',
      clear: 'Очистити',
      edit: 'Редагувати',
      retry: 'Повторити',
      search: 'Пошук',
      filter: 'Фільтр',
      export: 'Експорт',
      import: 'Імпорт',
      status: 'Статус',
      loading: 'Завантаження...',
      success: 'Успішно',
      error: 'Помилка',
      reset: 'Скинути',
      active: 'Активно',
      offline: 'Офлайн',
      online: 'В мережі',
      back: 'Назад',
      next: 'Далі',
      confirm: 'Підтвердити',
      language: 'Мова',
      english: 'Англійська',
      ukrainian: 'Українська',
    },

    auth: {
      languageSelectorTitle: 'Мова інтерфейсу',
      badgeSovereignMesh: 'Суверенна нейромережа штучного інтелекту',
      step1Title: 'Створіть суверенний Nixima ID',
      step1Subtitle: 'Зарезервуйте ваш унікальний нікнейм у децентралізованій нейромережі Nixima AI.',
      step1LanguageLabel: 'Бажана мова інтерфейсу',
      step1LanguageHint: 'Оберіть зручну мову для вашого терміналу та облікового запису.',
      handleLabel: 'Суверенний нікнейм Nixima',
      handlePlaceholder: 'напр. bogdan, neo, alex',
      handlePrefixNotice: 'Буде закріплено як',
      handleFormatHelp: 'Від 3 до 24 символів. Латинські літери, цифри, дефіс або підкреслення.',
      handleRules: {
        length: 'Мінімум 3 символи',
        chars: 'Лише латиниця, цифри та дефіси',
        reserved: 'Глобально унікальний нікнейм',
      },
      checkingHandle: 'Перевірка доступності в мережі...',
      handleAvailable: 'Нікнейм вільний для резервування',
      handleTaken: 'Цей нікнейм вже зайнятий у мережі',
      btnClaimAndProceed: 'Зарезервувати Nixima ID та перейти до кроку 2',
      btnLocking: 'Блокування суверенного ID...',

      step2Title: 'Облікові дані оператора',
      step2Subtitle: 'Захистіть свій нейросховище позивним оператора та ключовою фразою.',
      operatorBadge: 'Зарезервований ID',
      nameLabel: "Ім'я оператора або позивний",
      namePlaceholder: "напр. Богдан, Головний архітектор",
      nameHelp: 'Відображатиметься у вашому робочому просторі та діалогах.',
      passphraseLabel: 'Ключова фраза доступу',
      passphrasePlaceholder: 'Створіть надійну фразу (мін. 4 символи)',
      passphraseHelp: 'Використовується для безпечного входу з будь-якого терміналу.',
      btnConfirmAndLaunch: 'Підтвердити та відкрити робочий простір',
      btnBackToHandle: '← Змінити суверенний нікнейм',

      signInTab: 'Вхід',
      registerTab: 'Створити Nixima ID',
      signInTitle: 'З поверненням, Операторе',
      signInSubtitle: 'Введіть ваші облікові дані для розблокування зашифрованого простору.',
      signInHandlePlaceholder: 'Нікнейм або нікнейм@nixima.ai',
      signInPassphrasePlaceholder: 'Ключова фраза доступу',
      btnSignIn: 'Розблокувати простір',
      noAccountYet: 'Ще не маєте суверенного Nixima ID?',
      alreadyHaveAccount: 'Вже маєте зареєстрований Nixima ID?',
      switchIdentity: 'Змінити обліковий запис / Створити новий ID',

      quickPassTitle: 'З поверненням',
      quickPassSubtitle: 'Ваш зашифрований ключ сесії активний на цьому терміналі.',
      quickPassBadge: '1-клік готовий',
      quickPassRole: 'Оператор-засновник',
      btnLaunchWorkspace: 'Увійти в простір в 1 клік',
      btnSwitchAccount: 'Змінити профіль або зареєструвати інший',
      rememberTerminal: 'Увімкнути швидкий вхід в 1 клік на цьому пристрої',

      crossoverBtn: 'Крос-девайс синхронізація',
      crossoverModalTitle: 'Крос-девайс синхронізація',
      crossoverModalSubtitle: 'Безперешкодний обмін профілями та діалогами між ноутбуком, телефоном і планшетом.',
      crossoverMethod1Title: 'Метод 1: Хмарна синхронізація',
      crossoverMethod1Desc: 'Облікові записи автоматично синхронізуються між усіма пристроями в мережі Nixima.',
      btnForceCloudSync: 'Синхронізувати з хмарою Nixima',
      crossoverMethod2Title: "Метод 2: Суверенний ключ зв'язку",
      crossoverMethod2Desc: "Експортуйте зашифрований ключ для миттєвого зв'язку цього пристрою з іншим.",
      btnExportSyncKey: "Експортувати та скопіювати ключ зв'язку",
      syncKeyCopied: "Ключ зв'язку скопійовано в буфер обміну!",
      importKeyPlaceholder: 'Вставте ключ NXK-... з іншого пристрою',
      btnLinkAndSync: "Зв'язати та синхронізувати",
      cloudSyncedNotice: 'Синхронізовано з хмарою Nixima Cloud Mesh',

      vaultLaunch: {
        initializing: 'Ініціалізація суверенного сховища...',
        stepDecrypt: 'Розшифрування суверенного сховища...',
        stepNodes: 'Підключення вузлів нейромережі...',
        stepReady: 'Робочий простір активовано',
      },
    },

    header: {
      selectModel: 'Оберіть модель Nixima',
      sovereignEngine: 'Суверенний рушій',
      tuning: 'Тюнінг',
      meshActive: 'Мережа активна',
      newChatTooltip: 'Новий діалог',
      newChatMobile: 'Новий діалог',
      aboutTooltip: 'Про Nixima AI',
      settingsTooltip: 'Налаштування моделі та системи',
      collapseSidebarTooltip: 'Згорнути бічну панель',
      expandSidebarTooltip: 'Розгорнути бічну панель',
      closeMenu: 'Закрити меню',
      defaultBadge: 'СТАНДАРТ',
    },

    sidebar: {
      conversationsTitle: 'Діалоги',
      newChatButton: 'Новий діалог',
      searchPlaceholder: 'Пошук діалогів...',
      pinnedSection: 'Закріплені',
      recentSection: 'Недавні',
      today: 'Сьогодні',
      yesterday: 'Вчора',
      previous7Days: 'Попередні 7 днів',
      previous30Days: 'Попередні 30 днів',
      noConversations: 'Немає діалогів',
      noMatchingConversations: 'Діалогів не знайдено',
      untitledConversation: 'Без назви',
      pinChatTooltip: 'Закріпити діалог',
      unpinChatTooltip: 'Відкріпити діалог',
      renameTooltip: 'Перейменувати',
      exportMarkdownTooltip: 'Експортувати у Markdown (.md)',
      deleteChatTooltip: 'Видалити діалог',
      defaultOperator: 'Оператор Nixima',
      signOutTooltip: 'Вийти / Змінити профіль',
      researchLink: 'Дослідження Nixima AI',
      clearAllChats: 'Очистити всі діалоги',
    },

    chatInput: {
      placeholder: 'Запитайте Nixima про будь-що...',
      modifierLabel: 'Модифікатор:',
      modifiers: {
        concise: { label: 'Лаконічно', prompt: '[Будьте лаконічними та відповідайте чітко по суті]' },
        codeOnly: { label: 'Лише код', prompt: '[Надайте готовий до продакшену код з мінімальними поясненнями]' },
        deepProof: { label: 'Глибинне доведення', prompt: '[Сформулюйте суворе математичне або логічне доведення]' },
        table: { label: 'Порівняльна таблиця', prompt: '[Сформуйте вивід у вигляді структурованої порівняльної markdown-таблиці]' },
      },
      deepThink: 'Глибинне мислення',
      deepThinkTooltip: 'Активувати розширене багатокрокове міркування',
      search: 'Пошук',
      searchTooltip: 'Пошук актуальних даних в Інтернеті',
      audioMute: 'Вимкнути звук клавіш',
      audioEnable: 'Увімкнути звук клавіш',
      attachTooltip: 'Прикріпити документ',
      stopTooltip: 'Зупинити генерацію (Esc)',
      sendTooltip: 'Надіслати повідомлення (Enter)',
      chars: 'симв.',
      meshOnline: 'Мережа Nixima AI • В мережі',
      enterToSend: 'Натисніть Enter ↵ для відправки',
      shiftEnterNewline: 'Shift + Enter для нового рядка',
    },

    chatMessage: {
      you: 'Ви',
      thinking: 'Nixima думає',
      reasoning: 'Nixima міркує',
      generatingTrace: 'Генерація ланцюжка...',
      reasoningProcess: 'Процес міркування',
      chainOfThought: '(Ланцюжок міркувань)',
      saveAndResend: 'Зберегти й надіслати',
      tokensCount: 'ток',
      copyResponse: 'Скопіювати відповідь',
      copied: 'Скопійовано',
      regenerate: 'Перегенерувати',
      editPrompt: 'Редагувати запит',
      helpful: 'Корисно',
      notHelpful: 'Не корисно',
      copyCode: 'Копіювати код',
      downloadCode: 'Завантажити',
    },

    table: {
      filterPlaceholder: 'Фільтрувати таблицю...',
      showingRows: (count: number, total: number) => `Відображено ${count} з ${total} рядків`,
      copyCsv: 'Копіювати CSV',
      copyMarkdown: 'Копіювати MD',
      exportCsv: 'Експортувати CSV',
      copiedCsv: 'CSV скопійовано!',
      copiedMarkdown: 'MD скопійовано!',
    },

    emptyChat: {
      brandBadge: (model: string) => `Нейрорушій Nixima • Модель: ${model}`,
      heroTitle: 'Там, де інтелект зустрічається з точністю.',
      heroSubtitle: (model: string) =>
        `Автономний синтетичний інтелект на базі високопродуктивного передового рушія міркувань ${model}.`,
      promptCards: [
        {
          category: 'СИСТЕМИ',
          title: 'Розподілений сервіс на Rust',
          prompt: 'Напиши асинхронний високонавантажений event loop на Rust з використанням Tokio та lock-free черг.',
        },
        {
          category: 'ГЛИБИННИЙ АНАЛІЗ',
          title: 'Архітектура Nixima-0.1',
          prompt: 'Поясни внутрішній механізм Sparse Rotary Attention та архітектуру Mixture-of-Experts у моделі Nixima-0.1.',
        },
        {
          category: 'ФРОНТЕНД',
          title: 'Повний стек: React та ШІ',
          prompt: 'Створи адаптивний React-компонент для потокового відображення токенів з аудіовізуалізацією в реальному часі.',
        },
        {
          category: 'ОПТИМІЗАЦІЯ',
          title: 'Системна оптимізація',
          prompt: 'Діагностуй витоки пам’яті в обробниках подій Node.js та запропонуй детерміноване налаштування збирача сміття.',
        },
      ],
      contextWindowLabel: 'Контекстне вікно',
      throughputLabel: 'Пропускна здатність',
      precisionSlaLabel: 'Точність SLA',
    },

    settings: {
      title: 'Панель керування Nixima AI',
      tabs: {
        general: 'Загальні',
        inference: 'Інференс',
        persona: 'Персона',
        data: 'Дані та бекап',
        api: 'Mesh API',
      },
      languageSectionTitle: 'Мова інтерфейсу / Language',
      languageSectionDesc: 'Оберіть бажану мову інтерфейсу. Зміни застосовуються миттєво.',
      languageUkTitle: 'Українська',
      languageUkDesc: 'Повна локалізація інтерфейсу та технічної термінології',
      languageEnTitle: 'English (US)',
      languageEnDesc: 'Стандартний міжнародний мовний профіль',
      accountTitle: 'Профіль оператора',
      sovereignBadge: 'Суверенний оператор',
      systemPromptTitle: 'Системні інструкції',
      systemPromptDesc: 'Визначає когнітивну поведінку та базову логіку міркувань моделі.',
      temperatureTitle: 'Температура вибірки',
      temperatureDesc: 'Вищі значення додають творчості; нижчі максимізують детерміновану точність.',
      topPTitle: 'Top-P ядерне семплювання',
      topPDesc: 'Поріг кумулятивної ймовірності для відбору токенів-кандидатів.',
      contextLimitTitle: 'Максимальна довжина генерації',
      contextLimitDesc: 'Граничний ліміт токенів для кожної згенерованої відповіді.',
      personaToneTitle: 'Когнітивна персона та стиль',
      personaToneDesc: 'Оберіть стиль спілкування та структурування відповідей.',
      tones: [
        { id: 'architect', name: 'Провідний архітектор', desc: 'Суворий, високотехнічний та точний дизайн систем.' },
        { id: 'cyberpunk', name: 'Кіберпанк-хакер', desc: 'Прямий, різкий стиль, мінімум зайвого, максимальна швидкість.' },
        { id: 'academic', name: 'Академічний дослідник', desc: 'Теоретична точність, математична дедукція та цитування.' },
        { id: 'executive', name: 'Стратегічний керівник', desc: 'Високорівневий синтез, бачення продукту та бізнес-імпакт.' },
      ],
      audioEffectsTitle: 'Аудіовідгук синтезатора',
      audioEffectsDesc: 'Механічний звук клавіш та акустичні сигнали завершення через Web Audio API.',
      wallpaperTitle: 'Динамічні матричні шпалери',
      wallpaperDesc: 'Плавне анімоване полотно нейромережі на задньому плані.',
      hotkeySectionTitle: 'Гаряча клавіша нового діалогу',
      hotkeySectionDesc: 'Миттєве створення нових діалогів за допомогою власної комбінації або жесту.',
      btnCustomizeHotkey: 'Налаштувати комбінацію',
      exportDataTitle: 'Експорт історії діалогів',
      exportDataDesc: 'Завантажте повну базу ваших діалогів у структурованому форматі JSON.',
      btnExportJson: 'Експортувати бекап (JSON)',
      importDataTitle: 'Імпорт діалогів',
      importDataDesc: 'Відновіть архів діалогів з раніше експортованого файлу бекапу.',
      btnImportJson: 'Імпортувати з JSON',
      dangerZoneTitle: 'Небезпечна зона',
      dangerZoneDesc: 'Безповоротно видалити всі збережені діалоги для цього оператора.',
      btnClearAll: 'Очистити всі діалоги',
      apiKeyTitle: 'Ключ клієнта Mesh',
      apiKeyDesc: 'Криптографічний токен доступу до розподілених суверенних вузлів.',
      btnCopyApiKey: 'Копіювати API-ключ',
      btnResetDefaults: 'Скинути до стандартних',
      btnDone: 'Готово',
    },

    company: {
      title: 'NIXIMA AI',
      overviewBadge: 'Про компанію',
      heroHeading: 'Створення суверенного синтетичного інтелекту',
      heroDescription:
        'Nixima AI — це дослідницька лабораторія штучного інтелекту та передових технологій. Ми розробляємо розріджені MoE-архітектури, які забезпечують надзвичайну швидкість інференсу, розширені горизонти міркувань та верифіковану математичну точність.',
      pillars: {
        engineTitle: 'Рушій Nixima-0.1',
        engineDesc: 'Флагманська MoE-модель на 480 млрд параметрів з динамічною маршрутизацією та контекстом 2M токенів.',
        logicTitle: 'Детермінована логіка',
        logicDesc: 'Автономний покроковий конвеєр верифікації, що зводить галюцинації майже до нуля.',
        developerTitle: 'Орієнтовано на розробників',
        developerDesc: 'Нативна генерація коду, термінальний інструментарій та потокові конвеєри без затримок.',
        edgeTitle: 'Edge-розгортання',
        edgeDesc: 'Високопродуктивна розподілена периферійна мережа з глобальною затримкою менше 50 мс.',
      },
      hqLabel: 'Штаб-квартири',
      hqValue: 'Цюрих • Сан-Франциско',
      copyright: 'Nixima AI © 2026',
      closeBtn: 'Закрити',
    },

    hotkeys: {
      title: 'Налаштування гарячих клавіш та жестів',
      subtitle: 'Персоналізуйте скорочення для створення нового діалогу на всіх ваших пристроях.',
      deviceProfile: 'Активний профіль пристрою',
      presetsTitle: 'Швидкі пресети платформи',
      recordTitle: 'Запис власної комбінації',
      recordDesc: 'Натисніть будь-яку комбінацію на клавіатурі для автоматичного збереження.',
      recordPrompt: 'Натисніть для запису власного скорочення',
      recordActive: 'Натисніть клавіші на клавіатурі зараз...',
      btnResetDefault: 'Скинути до стандарту платформи',
      btnSave: 'Зберегти скорочення',
      btnCancel: 'Скасувати',
    },

    models: {
      'nixima-0.1': {
        name: 'Nixima-0.1',
        badge: 'ФЛАГМАН',
        description: 'Передовий інтелект та загальні міркування, динамічно маршрутизовані до найшвидших вільних обчислювальних кластерів.',
        strengths: ['Загальний інтелект', 'Вища логіка', 'Багатокрокова пам’ять', 'Агентні робочі процеси'],
      },
      'nixima-0.1-reasoning': {
        name: 'Nixima-0.1 Reasoning',
        badge: 'ЛАНЦЮЖОК ДУМОК',
        description: 'Покрокове розв’язання складних завдань на базі NVIDIA Nemotron Nano Omni Reasoning.',
        strengths: ['Математика та фізика', 'Формальна логіка', 'Глибинна дедукція', 'Верифікація'],
      },
      'nixima-0.1-coder': {
        name: 'Nixima-0.1 Coder',
        badge: 'РОЗРОБКА',
        description: 'Спеціалізована генерація коду, налагодження та системна інженерія на базі Cohere North Mini Code.',
        strengths: ['Full-stack розробка', 'Рефакторинг', 'Пошук багів', 'CLI та DevOps'],
      },
      'nixima-0.1-flash': {
        name: 'Nixima-0.1 Flash',
        badge: 'ШВИДКИЙ',
        description: 'Субмілісекундна швидкість для миттєвих діалогів та парсингу документів на базі NVIDIA Nemotron Lightning.',
        strengths: ['Миттєві відповіді', 'Сканування документів', 'Швидкий брейнштормінг'],
      },
    },
  },
};
