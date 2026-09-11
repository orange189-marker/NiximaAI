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
    allModelsTab: string;
    gen03Tab: string;
    gen02Tab: string;
    searchOptimizedTab: string;
    codingTab: string;
    noModelsFound: string;
    searchEngineBadge: string;
    activeSearchBanner: (mode: string, modelName: string) => string;
    switchModelBtn: string;
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
    deepThinkingV21: string;
    deepThinkingV21Desc: string;
    ultraThinking: string;
    ultraThinkingV1: string;
    ultraThinkingTooltip: string;
    ultraThinkingDesc: string;
    basicThinking: string;
    basicThinkingTooltip: string;
    thinkingEngineTitle: string;
    thinkingEngineSubtitle: string;
    basicThinkingDesc: string;
    deepThinkingDesc: string;
    omniBadge: string;
    omniTooltip: string;
    search: string;
    searchTooltip: string;
    searchFast: string;
    searchFastTooltip: string;
    searchEngineTitle: string;
    searchEngineSubtitle: string;
    searchFastDesc: string;
    searchStandardDesc: string;
    searchMegaDesc: string;
    autoSyncModel: string;
    switchModelTip: string;
    applyModel: string;
    audioMute: string;
    audioEnable: string;
    attachTooltip: string;
    infiniteOutput: string;
    infiniteOutputShort: string;
    infiniteOutputActiveTooltip: string;
    infiniteOutputInactiveTooltip: string;
    infiniteOutputBadge: string;
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
    copyLatex: string;
    copiedLatex: string;
    formulaBadge: string;
    readAloud: string;
    stopReading: string;
    explainSimpler: string;
    elaborate: string;
    translate: string;
    critique: string;
    branchChat: string;
    downloadMessage: string;
    deepThinkingV2: string;
    deepThinkingV21: string;
    coderV21Architecture: string;
    stagesVerifiedV21: (count: number) => string;
    ultraThinkingV1: string;
    ultraThinkingStruggle: string;
    ultraStagesVerified: (count: number) => string;
    basicThinking: string;
    agileSynthesis: string;
    agileStages: (count: number) => string;
    epistemicVerification: string;
    stagesVerified: (count: number) => string;
    copyThoughtTrace: string;
    copiedThoughtTrace: string;
    searchV2Grounded: string;
    searchV2FastGrounded: string;
    inspectSources: (count: number) => string;
    hideSources: string;
    verifiedSources: string;
    queriedMesh: (query: string) => string;
    searchLatency: (ms: number) => string;
    fastLatency: (ms: number) => string;
    searchActionRadar: string;
    aiObservationReaction: string;
    extractedEvidence: string;
    consensusVerified: string;
    visitSource: string;
    searchActionsTelemetry: (websitesCount: number, actionsCount: number) => string;
    hideSearchActions: string;
    inspectSearchActions: (count: number) => string;
    stepDispatchQuery: string;
    stepInspectWebsite: string;
    stepCrossReference: string;
    stepExtractData: string;
    stepSynthesize: string;
    activeScanning: string;
    relevanceMatch: (pct: number) => string;
    openInCanvas: string;
    launchInCanvas: string;
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

  credits: {
    badge: string;
    unit: string;
    balance: string;
    estCost: (min: number, max: number) => string;
    insufficientCredits: string;
    insufficientTooltip: (cost: number, balance: number) => string;
    spent: (amount: number) => string;
    dailyGrantTitle: string;
    dailyGrantDesc: string;
    claimDailyGrant: string;
    dailyGrantClaimed: string;
    ratesTitle: string;
    ratesDesc: string;
    hardPromptNotice: string;
    rechargeModalTitle: string;
    initialBonusNotice: string;
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
    graphSectionTitle: string;
    graphSectionSubtitle?: string;
    graphChips: Array<{
      title: string;
      prompt: string;
      tag?: string;
      chartType?: 'bar' | 'area' | 'line' | 'pyramid';
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
      credits: string;
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
    antiGlitchTitle: string;
    antiGlitchDesc: string;
    infiniteOutputTitle: string;
    infiniteOutputDesc: string;
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

  releaseAnnouncement: {
    badge: string;
    headline: string;
    subheadline: string;
    exploreBtn: string;
    detailsBtn: string;
    dismiss: string;
    modalTitle: string;
    modalSubtitle: string;
    keyHighlightsTitle: string;
    highlight1Title: string;
    highlight1Desc: string;
    highlight2Title: string;
    highlight2Desc: string;
    highlight3Title: string;
    highlight3Desc: string;
    highlight4Title: string;
    highlight4Desc: string;
    activateModel: string;
    activeNow: string;
    close: string;
  };

  models: Record<string, {
    name: string;
    badge: string;
    description: string;
    strengths: string[];
  }>;

  canvas: {
    studioTitle: string;
    studioSubtitle: string;
    previewTab: string;
    codeTab: string;
    consoleTab: string;
    version: string;
    versionHistory: string;
    latest: string;
    applyAndRefresh: string;
    runCode: string;
    running: string;
    clearConsole: string;
    consoleEmpty: string;
    copiedCode: string;
    exportFile: string;
    openInNewTab: string;
    maximize: string;
    restore: string;
    close: string;
    htmlApp: string;
    reactComponent: string;
    svgGraphic: string;
    markdownDoc: string;
    scriptCode: string;
    interactiveSandbox: string;
    promptSuggestions: {
      darkMode: string;
      addInteractivity: string;
      refactorCode: string;
      makeResponsive: string;
    };
  };
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
      allModelsTab: 'All',
      gen03Tab: '0.3 Gen',
      gen02Tab: '0.2 Gen',
      searchOptimizedTab: 'Search',
      codingTab: 'Coding',
      noModelsFound: 'No models found in this category',
      searchEngineBadge: 'SEARCH PARTNER',
      activeSearchBanner: (mode: string, modelName: string) => `Active Search: ${mode} • Recommended model is ${modelName}`,
      switchModelBtn: 'Switch',
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
      deepThink: 'DeepThinking V2',
      deepThinkTooltip: 'DeepThinking V2: Activate multi-stage epistemic reasoning & proof verification',
      deepThinkingV21: 'DeepThinking V2.1',
      deepThinkingV21Desc: 'Zero-laziness software & game architecture engine. Complete runnable code, modern neon aesthetics, and Web Audio API synthesis.',
      ultraThinking: 'UltraThinking',
      ultraThinkingV1: 'UltraThinking V1.0',
      ultraThinkingTooltip: 'UltraThinking V1.0: Deepest epistemic struggle & exhaustive multi-branch deduction (Nixima-0.2 Pro)',
      ultraThinkingDesc: 'Frontier dialectical struggle engine. Forces model to struggle through multiple hypotheses, adversarial falsification, and rigorous mathematical proofs before finalizing.',
      basicThinking: 'Thinking',
      basicThinkingTooltip: 'Thinking: Agile reasoning & prompt analysis',
      thinkingEngineTitle: 'Thinking Engine',
      thinkingEngineSubtitle: 'Select cognitive reasoning depth & latency',
      basicThinkingDesc: 'Agile thought process (~1-2 steps) for general reasoning and code without heavy latency.',
      deepThinkingDesc: 'Rigorous multi-stage epistemic deduction, boundary proof & counterfactual testing.',
      omniBadge: '0.2O Omni Autonomous',
      omniTooltip: 'Nixima-0.2O Omni: All-in-one sovereign model. DeepThinking reasoning and real-time WebSearch trigger autonomously on demand.',
      search: 'Search V2',
      searchTooltip: 'Search V2: Real-time web mesh grounding & verified sources',
      searchFast: 'Fast',
      searchFastTooltip: 'Search V2 Fast: Ultra-low-latency real-time lookup (<50ms)',
      searchEngineTitle: 'Search V2 Grounding Engine',
      searchEngineSubtitle: 'Select search speed, depth & AI engine pairing',
      searchFastDesc: 'Sub-50ms instant live facts, headlines, and rapid snippet synthesis.',
      searchStandardDesc: 'Comprehensive multi-domain web grounding with balanced factual synthesis.',
      searchMegaDesc: 'Sovereign deep web crawler indexing 20+ sources across 5 clusters.',
      autoSyncModel: 'Auto-sync optimal AI model for search mode',
      switchModelTip: 'Switch AI model to match',
      applyModel: 'Apply Engine',
      audioMute: 'Mute key sounds',
      audioEnable: 'Enable key sounds',
      attachTooltip: 'Attach dataset / document',
      infiniteOutput: 'Infinite Output',
      infiniteOutputShort: 'Infinite',
      infiniteOutputActiveTooltip: 'Infinite Output Active: Unbounded token output clearance. Client stream will remain open until exhaustive generation completes without 4,096 token truncation.',
      infiniteOutputInactiveTooltip: 'Infinite Output (Creator Exclusive): Bypass max output token limit for full code synthesis.',
      infiniteOutputBadge: 'MAX',
      stopTooltip: 'Stop generation (Esc)',
      sendTooltip: 'Send prompt (Enter)',
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
      copyLatex: 'Copy LaTeX',
      copiedLatex: 'Copied LaTeX!',
      formulaBadge: 'LaTeX Formula',
      readAloud: 'Read aloud',
      stopReading: 'Stop reading',
      explainSimpler: 'Explain simpler',
      elaborate: 'Elaborate further',
      translate: 'Translate response',
      critique: 'Fact-check & verify',
      branchChat: 'Branch chat from here',
      downloadMessage: 'Download response (.md)',
      deepThinkingV2: 'DeepThinking V2',
      deepThinkingV21: 'DeepThinking V2.1 Coder',
      coderV21Architecture: 'V2.1 Code & UI Synthesis',
      stagesVerifiedV21: (count: number) => `${count} Architectural Stages Verified (Zero-Laziness)`,
      ultraThinkingV1: 'UltraThinking V1.0',
      ultraThinkingStruggle: 'Quantum Dialectical Proof (Nixima-0.2 Pro)',
      ultraStagesVerified: (count: number) => `${count} Ultra-Reasoning Branches Verified`,
      basicThinking: 'Thinking',
      agileSynthesis: 'Agile Synthesis',
      agileStages: (count: number) => `${count} ${count === 1 ? 'Agile Step' : 'Agile Steps'}`,
      epistemicVerification: 'L3 Epistemic Proof',
      stagesVerified: (count: number) => `${count} Reasoning Stages Verified`,
      copyThoughtTrace: 'Copy trace',
      copiedThoughtTrace: 'Trace copied!',
      searchV2Grounded: 'Search V2 Grounded',
      searchV2FastGrounded: 'Search V2 FAST Grounded',
      inspectSources: (count: number) => `Inspect Sources (${count})`,
      hideSources: 'Hide Sources',
      verifiedSources: 'Verified Web Sources',
      queriedMesh: (query: string) => `Query: "${query}"`,
      searchLatency: (ms: number) => `Retrieved in ${ms}ms via Nixima Web Mesh`,
      fastLatency: (ms: number) => `Instant retrieval in ${ms}ms via Lightning Mesh`,
      searchActionRadar: 'Search V2 Tool Actions & Live Reasoning',
      aiObservationReaction: 'AI Observation & Live Reaction',
      extractedEvidence: 'Extracted Evidence & Key Datapoints',
      consensusVerified: 'Consensus Verified across Sources',
      visitSource: 'Visit Site',
      searchActionsTelemetry: (websitesCount: number, actionsCount: number) => `${websitesCount} Websites Inspected • ${actionsCount} Reasoning Steps`,
      hideSearchActions: 'Hide Search Actions',
      inspectSearchActions: (count: number) => `Inspect Search Actions (${count})`,
      stepDispatchQuery: 'Dispatch Targeted Query',
      stepInspectWebsite: 'Inspect & Read Website',
      stepCrossReference: 'Cross-Reference & Validate',
      stepExtractData: 'Extract Authoritative Facts',
      stepSynthesize: 'Multi-Source Synthesis & Consensus',
      activeScanning: 'Inspecting website content in real time...',
      relevanceMatch: (pct: number) => `${pct}% Match`,
      openInCanvas: 'Open in Canvas',
      launchInCanvas: 'Open in Canvas',
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

    credits: {
      badge: 'Nixima Credits',
      unit: 'CR',
      balance: 'Credits Balance',
      estCost: (min: number, max: number) => `~${min}-${max} CR`,
      insufficientCredits: 'Insufficient Credits',
      insufficientTooltip: (cost: number, balance: number) =>
        `This prompt requires ~${cost} CR, but your balance is ${balance} CR. Claim daily recharge in Settings to continue.`,
      spent: (amount: number) => `-${amount} CR`,
      dailyGrantTitle: 'Daily Mesh Credit Grant',
      dailyGrantDesc: 'Claim +500 Nixima Credits every 24 hours to recharge your frontier intelligence pool.',
      claimDailyGrant: 'Claim +500 Credits',
      dailyGrantClaimed: '500 Credits Claimed!',
      ratesTitle: 'Model Consumption Rates & Multipliers',
      ratesDesc: 'Credit consumption scales dynamically with model tier, reasoning depth, and prompt difficulty.',
      hardPromptNotice: 'High-complexity prompts (code synthesis, mathematical proofs, long context, and Deep Think) consume compute power proportionally.',
      rechargeModalTitle: 'Nixima Credits Ledger & Top-Up',
      initialBonusNotice: 'Every new operator is automatically provisioned with 1,000 complimentary Nixima Credits.',
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
      graphSectionTitle: 'Interactive Graph & Data Visualizations',
      graphSectionSubtitle: 'One-click live charts, coordinate mathematics & interactive models',
      graphChips: [
        {
          title: 'World GDP Leaders',
          tag: 'BAR',
          chartType: 'bar',
          prompt: 'Generate an interactive horizontal bar chart comparing the top 10 economies by nominal GDP in trillions USD.',
        },
        {
          title: 'World Population 1960–2020',
          tag: 'AREA',
          chartType: 'area',
          prompt: 'Plot an interactive area chart showing global population growth from 1960 to 2020 by decade.',
        },
        {
          title: 'Linear Graph f(x) = 2x + 1',
          tag: 'MATH 2D',
          chartType: 'line',
          prompt: 'Plot the linear function f(x) = 2x + 1 on a 2D Cartesian coordinate grid with slope and root telemetry.',
        },
        {
          title: 'Population Age Pyramid',
          tag: 'PYRAMID',
          chartType: 'pyramid',
          prompt: 'Generate a demographic population age pyramid comparing male vs female cohorts across age brackets.',
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
        credits: 'Credits',
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
      antiGlitchTitle: 'Token Purity & Anti-Glitch Guard',
      antiGlitchDesc: 'Real-time suppression of tokenizer drift, CJK ideograph bleeding, and word/phrase stutter loops across 0.2 generation models.',
      infiniteOutputTitle: 'Infinite Output Clearance',
      infiniteOutputDesc: 'Sovereign override that removes the 4,096 max output token constraint. Nixima will stream exhaustive, complete codebases and files without truncation or abbreviation.',
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

    releaseAnnouncement: {
      badge: 'NIXIMA 0.2 GENERATION RELEASE',
      headline: 'Introducing the Nixima-0.2 Generation',
      subheadline: 'Four next-gen sovereign neural engines engineered for frontier reasoning, production systems code, and 2M token hyper-speed intelligence.',
      exploreBtn: 'Try Nixima-0.2 Flagship',
      detailsBtn: 'Explore 0.2 Architecture',
      dismiss: 'Dismiss release card',
      modalTitle: 'Nixima 0.2 Generation Architecture & Release Briefing',
      modalSubtitle: 'Official release briefing and benchmark specifications engineered by Bogdan.',
      keyHighlightsTitle: 'Architectural Breakthroughs in 0.2',
      highlight1Title: 'Sparse Rotary Attention (SRA v2)',
      highlight1Desc: 'Enables dynamic multi-head token routing with zero performance degradation across 500,000+ context lengths.',
      highlight2Title: 'Hyper-Throughput 2M Context Window',
      highlight2Desc: 'Nixima-0.2 Flash processes 2,000,000 tokens with sub-10ms latency for real-time document analysis and streaming.',
      highlight3Title: 'Autonomous Epistemic Chain-of-Thought',
      highlight3Desc: 'Nixima-0.2 Pro incorporates self-correcting logic verification, rigorous math proofs, and transparent <think> traces.',
      highlight4Title: 'Neural Token Purity & Anti-Glitch Engine',
      highlight4Desc: 'Active sanitization against cross-lingual CJK bleeding (e.g. "co[CJK]ol" -> "cool") and logit repetition stutters.',
      activateModel: 'Activate Model',
      activeNow: 'Active Engine',
      close: 'Close Briefing',
    },

    models: {
      'nixima-0.2-omni': {
        name: 'Nixima-0.2O',
        badge: 'OMNI ALL-IN-ONE',
        description: 'Sovereign frontier all-in-one multimodal model combining deep epistemic reasoning, production systems engineering, live web search synthesis, and ultra-high throughput with zero manual toggles required.',
        strengths: ['Omni Sovereign Intelligence', 'Autonomous Reasoning & Web Grounding', 'Zero Manual Toggles Required', '1M Context Adaptive Throughput'],
      },
      'nixima-0.3-coder': {
        name: 'Nixima-0.3 Coder',
        badge: '0.3 TITAN CODER',
        description: 'Frontier next-generation software architect & interactive game engineer. Powered by DeepThinking V2.1 with zero thinking laziness, complete runnable code, modern neon aesthetics, 60fps loops, and pure Web Audio sound synthesis.',
        strengths: [
          'DeepThinking V2.1 Code & UI Architecture',
          'Zero Thinking Laziness (Complete Code Only)',
          'Polished Game Mechanics & Web Audio',
          'High-Performance Concurrent Systems'
        ],
      },
      'nixima-0.2': {
        name: 'Nixima-0.2',
        badge: 'FLAGSHIP',
        description: 'Next-generation frontier general synthetic intelligence with adaptive Sparse Rotary Attention v2 and multi-turn autonomous synthesis.',
        strengths: ['Frontier General Intelligence', 'Adaptive SRA v2 Architecture', 'Autonomous Synthesis', 'Multi-turn Long Context'],
      },
      'nixima-0.2-pro': {
        name: 'Nixima-0.2 Pro',
        badge: 'REASONING PRO',
        description: 'Autonomous high-order reasoning powerhouse with deep chain-of-thought, epistemic deduction, and mathematical verification.',
        strengths: ['Deep Chain-of-Thought', 'Epistemic Logic & Proofs', 'Scientific Deduction', 'Complex System Theory'],
      },
      'nixima-0.2-coder': {
        name: 'Nixima-0.2 Coder',
        badge: 'SYSTEMS DEV',
        description: 'Specialized production software architect. Unrivaled in full-stack systems engineering, zero-defect algorithms, async concurrency, and deep refactoring.',
        strengths: ['Production Architecture', 'Zero-defect TypeScript/Rust/Python', 'Concurrent Systems', 'Full-stack Engineering'],
      },
      'nixima-0.2-flash': {
        name: 'Nixima-0.2 Flash',
        badge: 'HYPER SPEED',
        description: 'Ultra-high throughput sub-millisecond response engine with massive 2,000,000 token context window for instantaneous analysis and streaming.',
        strengths: ['Sub-millisecond Latency', 'Massive 2M Context', 'High-speed Document Processing', 'Real-time Streaming'],
      },
      // Legacy 0.1 compatibility
      'nixima-0.1': {
        name: 'Nixima-0.1',
        badge: 'LEGACY',
        description: 'First generation frontier reasoning and synthetic intelligence.',
        strengths: ['General Intelligence', 'High-Order Logic', 'Multi-turn Memory'],
      },
      'nixima-0.1-reasoning': {
        name: 'Nixima-0.1 Reasoning',
        badge: 'LEGACY',
        description: 'Extended step-by-step chain-of-thought problem solver.',
        strengths: ['Math & Physics', 'Formal Logic', 'Deep Deduction'],
      },
      'nixima-0.1-coder': {
        name: 'Nixima-0.1 Coder',
        badge: 'LEGACY',
        description: 'Specialized code generation and debugging engine.',
        strengths: ['Full-stack App Gen', 'Refactoring', 'Bug Hunting'],
      },
      'nixima-0.1-flash': {
        name: 'Nixima-0.1 Flash',
        badge: 'LEGACY',
        description: 'Sub-millisecond latency for ultra-fast conversation.',
        strengths: ['Instant Responses', 'Document Scanning'],
      },
    },

    canvas: {
      studioTitle: 'Nixima Canvas',
      studioSubtitle: 'Interactive Artifacts & Sandbox Studio',
      previewTab: 'Preview',
      codeTab: 'Code',
      consoleTab: 'Console',
      version: 'Version',
      versionHistory: 'Version History',
      latest: 'Latest',
      applyAndRefresh: 'Apply & Run',
      runCode: 'Run Code',
      running: 'Executing...',
      clearConsole: 'Clear',
      consoleEmpty: 'No console logs yet. Run code or interact with the preview to see outputs.',
      copiedCode: 'Code copied to clipboard!',
      exportFile: 'Export File',
      openInNewTab: 'Open in New Tab',
      maximize: 'Full Screen',
      restore: 'Exit Full Screen',
      close: 'Close Canvas',
      htmlApp: 'Interactive Web App',
      reactComponent: 'React Component',
      svgGraphic: 'SVG Vector Graphic',
      markdownDoc: 'Markdown Document',
      scriptCode: 'Code Script',
      interactiveSandbox: 'Live Sandboxed Environment',
      promptSuggestions: {
        darkMode: 'Add modern dark mode theme',
        addInteractivity: 'Add interactive animations and sound',
        refactorCode: 'Refactor code and improve performance',
        makeResponsive: 'Make fully mobile-responsive with fluid grid',
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
      allModelsTab: 'Всі',
      gen03Tab: '0.3 Gen',
      gen02Tab: '0.2 Gen',
      searchOptimizedTab: 'Пошук',
      codingTab: 'Кодинг',
      noModelsFound: 'У цій категорії моделей не знайдено',
      searchEngineBadge: 'ПОШУКОВИЙ ПАРТНЕР',
      activeSearchBanner: (mode: string, modelName: string) => `Активний пошук: ${mode} • Рекомендована модель ${modelName}`,
      switchModelBtn: 'Перемкнути',
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
      deepThink: 'DeepThinking V2',
      deepThinkTooltip: 'DeepThinking V2: Багатокрокове епістемічне міркування та верифікація логіки',
      deepThinkingV21: 'DeepThinking V2.1',
      deepThinkingV21Desc: 'Архітектурний рушій коду та ігор без лінощів. 100% завершений код, сучасна неонова естетика та синтез Web Audio API.',
      ultraThinking: 'UltraThinking',
      ultraThinkingV1: 'UltraThinking V1.0',
      ultraThinkingTooltip: 'UltraThinking V1.0: Глибока діалектична боротьба думок та верифікація гіпотез (Nixima-0.2 Pro)',
      ultraThinkingDesc: 'Флагманський інтелектуальний режим. Змушує модель долати сумніви, досліджувати кілька діалектичних гіпотез, шукати контрприклади та проводити математичні доведення.',
      basicThinking: 'Міркування',
      basicThinkingTooltip: 'Міркування: Швидкий попередній аналіз перед відповіддю',
      thinkingEngineTitle: 'Рушій міркування',
      thinkingEngineSubtitle: 'Оберіть глибину міркувань та швидкість',
      basicThinkingDesc: 'Швидкий аналіз (1-2 кроки) для повсякденних завдань і коду без затримок.',
      deepThinkingDesc: 'Багатокрокове епістемічне міркування, верифікація доведень та логіка.',
      omniBadge: '0.2O Omni Автономний',
      omniTooltip: 'Nixima-0.2O Omni: Суверенна модель «все-в-одному». DeepThinking міркування та живий пошук активуються автономно за потребою.',
      search: 'Search V2',
      searchTooltip: 'Search V2: Реальний веб-пошук у мережі та перевірені джерела',
      searchFast: 'Швидкий',
      searchFastTooltip: 'Search V2 Fast: Надшвидкий пошук у реальному часі (<50мс)',
      searchEngineTitle: 'Пошуковий рушій Search V2',
      searchEngineSubtitle: 'Оберіть швидкість, глибину пошуку та пару AI-рушія',
      searchFastDesc: 'Миттєві факти, заголовки новин та оперативні витяги до 50мс.',
      searchStandardDesc: 'Глибокий багатодоменний веб-пошук зі збалансованим синтезом джерел.',
      searchMegaDesc: 'Суверенний пошуковий рій з індексацією 20+ джерел у 5 кластерах.',
      autoSyncModel: 'Автоперемикання моделі під режим пошуку',
      switchModelTip: 'Перемкнути AI-модель',
      applyModel: 'Застосувати',
      audioMute: 'Вимкнути звук клавіш',
      audioEnable: 'Увімкнути звук клавіш',
      attachTooltip: 'Прикріпити документ',
      infiniteOutput: 'Необмежений вивід',
      infiniteOutputShort: 'Безліміт',
      infiniteOutputActiveTooltip: 'Необмежений вивід активний: Знято обмеження вихідних токенів. Nixima згенерує повний код без обривів чи ліміту в 4096 токенів.',
      infiniteOutputInactiveTooltip: 'Необмежений вивід (Ексклюзив Творця): Зняти ліміт вихідних токенів для повної генерації коду.',
      infiniteOutputBadge: 'MAX',
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
      copyLatex: 'Скопіювати LaTeX',
      copiedLatex: 'LaTeX скопійовано!',
      formulaBadge: 'LaTeX Формула',
      readAloud: 'Озвучити відповідь',
      stopReading: 'Зупинити озвучення',
      explainSimpler: 'Пояснити простіше',
      elaborate: 'Розкрити детальніше',
      translate: 'Перекласти відповідь',
      critique: 'Перевірити точність',
      branchChat: 'Створити гілку звідси',
      downloadMessage: 'Завантажити відповідь (.md)',
      deepThinkingV2: 'DeepThinking V2',
      deepThinkingV21: 'DeepThinking V2.1 Coder',
      coderV21Architecture: 'V2.1 Архітектура коду та дизайну',
      stagesVerifiedV21: (count: number) => `Верифіковано ${count} архітектурних стадій (Без скорочень)`,
      ultraThinkingV1: 'UltraThinking V1.0',
      ultraThinkingStruggle: 'Квантове діалектичне доведення (Nixima-0.2 Pro)',
      ultraStagesVerified: (count: number) => `Верифіковано ${count} ультра-гіпотез`,
      basicThinking: 'Міркування',
      agileSynthesis: 'Швидкий аналіз',
      agileStages: (count: number) => `Аналіз у ${count} ${count === 1 ? 'крок' : count < 5 ? 'кроки' : 'кроків'}`,
      epistemicVerification: 'L3 Епістемічний доказ',
      stagesVerified: (count: number) => `Верифіковано ${count} етапів міркування`,
      copyThoughtTrace: 'Копіювати ланцюжок',
      copiedThoughtTrace: 'Ланцюжок скопійовано!',
      searchV2Grounded: 'Search V2 Верифіковано',
      searchV2FastGrounded: 'Search V2 FAST Верифіковано',
      inspectSources: (count: number) => `Переглянути джерела (${count})`,
      hideSources: 'Сховати джерела',
      verifiedSources: 'Перевірені веб-джерела',
      queriedMesh: (query: string) => `Запит: "${query}"`,
      searchLatency: (ms: number) => `Отримано за ${ms}мс через Nixima Web Mesh`,
      fastLatency: (ms: number) => `Миттєве отримання за ${ms}мс через Lightning Mesh`,
      searchActionRadar: 'Дії та жива аргументація інструменту Search V2',
      aiObservationReaction: 'Спостереження та жива реакція ШІ',
      extractedEvidence: 'Вилучені факти та дані з сайту',
      consensusVerified: 'Консенсус підтверджено між джерелами',
      visitSource: 'Відвідати сайт',
      searchActionsTelemetry: (websitesCount: number, actionsCount: number) => `Оглянуто ${websitesCount} сайтів • ${actionsCount} кроків міркування`,
      hideSearchActions: 'Сховати дії пошуку',
      inspectSearchActions: (count: number) => `Оглянути дії пошуку (${count})`,
      stepDispatchQuery: 'Формування та надсилання запиту',
      stepInspectWebsite: 'Огляд та читання веб-сайту',
      stepCrossReference: 'Перехресна верифікація та порівняння',
      stepExtractData: 'Вилучення ключових фактів',
      stepSynthesize: 'Синтез кількох джерел та консенсус',
      activeScanning: 'Огляд вмісту веб-сайту в реальному часі...',
      relevanceMatch: (pct: number) => `${pct}% Відповідність`,
      openInCanvas: 'Відкрити у Canvas',
      launchInCanvas: 'Відкрити у Canvas',
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

    credits: {
      badge: 'Кредити Nixima',
      unit: 'CR',
      balance: 'Баланс кредитів',
      estCost: (min: number, max: number) => `~${min}-${max} CR`,
      insufficientCredits: 'Недостатньо кредитів',
      insufficientTooltip: (cost: number, balance: number) =>
        `Для цього запиту потрібно ~${cost} CR, але ваш баланс становить ${balance} CR. Отримайте щоденне поповнення в Налаштуваннях, щоб продовжити.`,
      spent: (amount: number) => `-${amount} CR`,
      dailyGrantTitle: 'Щоденний грант мережі Nixima',
      dailyGrantDesc: 'Отримуйте +500 кредитів Nixima кожні 24 години для поповнення вашого пулу обчислень.',
      claimDailyGrant: 'Отримати +500 кредитів',
      dailyGrantClaimed: '500 кредитів нараховано!',
      ratesTitle: 'Тарифи та коефіцієнти споживання моделей',
      ratesDesc: 'Витрати кредитів динамічно масштабуються залежно від класу моделі, глибини міркувань та складності запиту.',
      hardPromptNotice: 'Складні запити (синтез коду, математичні доведення, великий контекст та режим Deep Think) споживають обчислювальні ресурси пропорційно.',
      rechargeModalTitle: 'Реєстр кредитів Nixima та поповнення',
      initialBonusNotice: 'Кожен новий оператор автоматично отримує 1 000 вітальних кредитів Nixima.',
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
      graphSectionTitle: 'Інтерактивні графіки та візуалізації',
      graphSectionSubtitle: 'Живі діаграми, декартові координати та демографічні моделі в один клік',
      graphChips: [
        {
          title: 'Лідери світового ВВП',
          tag: 'СТОВПЧИКИ',
          chartType: 'bar',
          prompt: 'Згенеруй інтерактивну стовпчикову діаграму з порівнянням топ-10 економік світу за номінальним ВВП у трильйонах USD.',
        },
        {
          title: 'Населення світу 1960–2020',
          tag: 'ПЛОЩА',
          chartType: 'area',
          prompt: 'Побудуй інтерактивний графік зростання населення Землі з 1960 по 2020 роки по десятиліттях.',
        },
        {
          title: 'Лінійний графік f(x) = 2x + 1',
          tag: 'МАТЕМАТИКА',
          chartType: 'line',
          prompt: 'Побудуй лінійну функцію f(x) = 2x + 1 на 2D декартовій площині з телеметрією нахилу та кореня.',
        },
        {
          title: 'Вікова піраміда населення',
          tag: 'ПІРАМІДА',
          chartType: 'pyramid',
          prompt: 'Створи демографічну вікову піраміду населення з розподілом чоловічих та жіночих когорт.',
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
        credits: 'Кредити',
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
      antiGlitchTitle: 'Захист чистоти токенів та анти-глітч',
      antiGlitchDesc: 'Потокове придушення витоків китайських ієрогліфів, заїкань слів та збоїв токенізатора у моделях покоління 0.2.',
      infiniteOutputTitle: 'Необмежений вивід (Кліренс Творця)',
      infiniteOutputDesc: 'Суверенний дозвіл на зняття ліміту вихідних токенів (4096). Nixima транслює вичерпні монолітні кодові бази та великі файли без жодних скорочень.',
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

    releaseAnnouncement: {
      badge: 'РЕЛІЗ ПОКОЛІННЯ NIXIMA 0.2',
      headline: 'Представляємо покоління Nixima-0.2',
      subheadline: 'Чотири суверенні нейрорушії нового покоління: проривні міркування, системне програмування та надшвидкісний контекст у 2 000 000 токенів.',
      exploreBtn: 'Спробувати флагман Nixima-0.2',
      detailsBtn: 'Архітектура 0.2 та бенчмарки',
      dismiss: 'Приховати картку релізу',
      modalTitle: 'Архітектурний бриф релізу Nixima 0.2',
      modalSubtitle: 'Офіційна презентація та специфікації моделей, розроблені Богданом.',
      keyHighlightsTitle: 'Ключові архітектурні досягнення 0.2',
      highlight1Title: 'Sparse Rotary Attention (SRA v2)',
      highlight1Desc: 'Динамічна маршрутизація токенів без деградації якості при довжині контексту понад 500 000 токенів.',
      highlight2Title: 'Надшвидкий контекст 2 000 000 токенів',
      highlight2Desc: 'Nixima-0.2 Flash обробляє до 2 мільйонів токенів із затримкою до 10 мс для миттєвого аналізу великих масивів коду та документів.',
      highlight3Title: 'Автономний епістемічний ланцюг думок',
      highlight3Desc: 'Nixima-0.2 Pro виконує глибоку самоверифікацію логіки, точні математичні доведення та прозорі роздуми у блоках <think>.',
      highlight4Title: 'Чистота токенів та анти-глітч фільтр',
      highlight4Desc: 'Активне усунення витоку ієрогліфів усередині слів (наприклад "co[ієрогліф]ol" -> "cool") та зациклень заїкання.',
      activateModel: 'Активувати модель',
      activeNow: 'Поточний рушій',
      close: 'Закрити бриф',
    },

    models: {
      'nixima-0.2-omni': {
        name: 'Nixima-0.2O',
        badge: 'OMNI ВСЕ-В-ОДНОМУ',
        description: 'Суверенна модель нового покоління «все-в-одному». Поєднує глибокі епістемічні міркування, інженерію коду, живий синтез веб-пошуку та надвисоку швидкість без потреби ручних перемикачів.',
        strengths: ['Суверенний інтелект Omni', 'Автономні міркування та веб-пошук', 'Full-stack розробка систем', 'Динамічна маршрутизація'],
      },
      'nixima-0.3-coder': {
        name: 'Nixima-0.3 Coder',
        badge: '0.3 ТИТАН КОДУВАННЯ',
        description: 'Флагманський архітектор ПЗ та інтерактивних ігор покоління 0.3. Працює на базі DeepThinking V2.1 без лінощів мислення, гарантуючи 100% робочий код, неонову естетику, 60fps та чистий звук Web Audio API.',
        strengths: [
          'DeepThinking V2.1 архітектура коду та UI',
          'Нуль лінощів мислення (тільки повний код)',
          'Досконала механіка ігор та Web Audio',
          'Високопродуктивні системи'
        ],
      },
      'nixima-0.2': {
        name: 'Nixima-0.2',
        badge: 'ФЛАГМАН',
        description: 'Передовий синтетичний інтелект нового покоління з адаптивною увагою SRA v2 та автономним багатокроковим синтезом.',
        strengths: ['Передовий інтелект', 'Архітектура SRA v2', 'Автономний синтез', 'Довгий контекст'],
      },
      'nixima-0.2-pro': {
        name: 'Nixima-0.2 Pro',
        badge: 'МІРКУВАННЯ PRO',
        description: 'Автономний рушій поглибленого мислення з багатокроковим ланцюгом думок, епістемічною дедукцією та математичною верифікацією.',
        strengths: ['Глибокий ланцюг думок', 'Епістемічна логіка та докази', 'Наукова дедукція', 'Теорія складних систем'],
      },
      'nixima-0.2-coder': {
        name: 'Nixima-0.2 Coder',
        badge: 'СИСТЕМНИЙ DEV',
        description: 'Спеціалізований архітектор промислового ПЗ. Неперевершений у full-stack системах, безпомилкових алгоритмах та асинхронності.',
        strengths: ['Промислова архітектура', 'Безпомилковий код TS/Rust/Python', 'Паралельні системи', 'Full-stack розробка'],
      },
      'nixima-0.2-flash': {
        name: 'Nixima-0.2 Flash',
        badge: 'НАДШВИДКИЙ',
        description: 'Субмілісекундний рушій із гігантським контекстом у 2 000 000 токенів для миттєвої генерації та потокового аналізу.',
        strengths: ['Субмілісекундна швидкість', 'Контекст 2M токенів', 'Миттєвий аналіз документів', 'Потокова генерація'],
      },
      // Legacy 0.1 compatibility
      'nixima-0.1': {
        name: 'Nixima-0.1',
        badge: 'LEGACY',
        description: 'Передовий інтелект та загальні міркування першого покоління.',
        strengths: ['Загальний інтелект', 'Вища логіка', 'Багатокрокова пам’ять'],
      },
      'nixima-0.1-reasoning': {
        name: 'Nixima-0.1 Reasoning',
        badge: 'LEGACY',
        description: 'Покрокове розв’язання складних завдань першого покоління.',
        strengths: ['Математика та фізика', 'Формальна логіка', 'Глибинна дедукція'],
      },
      'nixima-0.1-coder': {
        name: 'Nixima-0.1 Coder',
        badge: 'LEGACY',
        description: 'Спеціалізована генерація коду та налагодження першого покоління.',
        strengths: ['Full-stack розробка', 'Рефакторинг', 'Пошук багів'],
      },
      'nixima-0.1-flash': {
        name: 'Nixima-0.1 Flash',
        badge: 'LEGACY',
        description: 'Субмілісекундна швидкість для швидкого спілкування першого покоління.',
        strengths: ['Миттєві відповіді', 'Сканування документів'],
      },
    },

    canvas: {
      studioTitle: 'Nixima Canvas',
      studioSubtitle: 'Інтерактивна студія артефактів та пісочниця',
      previewTab: 'Прев’ю',
      codeTab: 'Код',
      consoleTab: 'Консоль',
      version: 'Версія',
      versionHistory: 'Історія версій',
      latest: 'Остання',
      applyAndRefresh: 'Застосувати та запустити',
      runCode: 'Запустити код',
      running: 'Виконання...',
      clearConsole: 'Очистити',
      consoleEmpty: 'Консоль порожня. Запустіть код або взаємодійте з прев’ю для виводу.',
      copiedCode: 'Код скопійовано в буфер обміну!',
      exportFile: 'Експортувати файл',
      openInNewTab: 'Відкрити у новій вкладці',
      maximize: 'На весь екран',
      restore: 'Вийти з повного екрану',
      close: 'Закрити Canvas',
      htmlApp: 'Інтерактивний веб-додаток',
      reactComponent: 'React компонент',
      svgGraphic: 'Векторна SVG графіка',
      markdownDoc: 'Markdown документ',
      scriptCode: 'Скрипт / Код',
      interactiveSandbox: 'Живе ізольоване середовище',
      promptSuggestions: {
        darkMode: 'Додай сучасну темну тему',
        addInteractivity: 'Додай інтерактивні анімації та звук',
        refactorCode: 'Зроби рефакторинг та оптимізуй код',
        makeResponsive: 'Зроби повну мобільну адаптацію з гнучкими сітками',
      },
    },
  },
};
