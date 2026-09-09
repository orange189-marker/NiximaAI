/**
 * Nixima AI Adaptive Hotkey & Gesture Engine
 * Provides OS-aware shortcuts (Windows, macOS, Linux) and adaptive touch badges (Phone, Tablet)
 * with full end-user customization and persistent settings.
 */

export type PlatformType = 'windows' | 'macos' | 'linux' | 'tablet' | 'mobile';

export interface HotkeyConfig {
  id: string;
  key: string;               // e.g. 'n', 'k', 'o', 'Enter'
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  label: string;             // Display text: 'Ctrl+N', '⌘N', 'Tap', 'Alt+N', '+New'
  isTouchBadge: boolean;     // If true, render touch/gesture badge instead of keyboard keys
  platform: PlatformType;
  custom?: boolean;
}

const STORAGE_KEY = 'nixima_hotkey_new_conversation_v2';
export const HOTKEY_CHANGE_EVENT = 'nixima:hotkey-updated';

/**
 * Detect runtime platform and form factor
 */
export function detectPlatform(): PlatformType {
  if (typeof window === 'undefined') return 'windows';

  const ua = navigator.userAgent || '';
  const navPlatform = (navigator as any).userAgentData?.platform || navigator.platform || '';
  const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  const width = window.innerWidth;

  // Check iPads (including iPadOS reporting MacIntel with touch points)
  const isIPad = /iPad/i.test(ua) || (navPlatform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
  const isTabletScreen = isTouch && width >= 640 && width <= 1024;

  if (isIPad || isAndroidTablet || isTabletScreen) {
    return 'tablet';
  }

  // Check mobile phones
  const isMobilePhone = /iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua) || (isTouch && width < 640);
  if (isMobilePhone) {
    return 'mobile';
  }

  // Desktop OS detection
  if (/Mac|iPod|iPhone|iPad/i.test(navPlatform) || /Macintosh/i.test(ua)) {
    return 'macos';
  }
  if (/Linux/i.test(navPlatform) || /Linux/i.test(ua)) {
    return 'linux';
  }

  return 'windows';
}

/**
 * Get the platform's default hotkey configuration
 */
export function getDefaultHotkey(platform?: PlatformType): HotkeyConfig {
  const currentPlatform = platform || detectPlatform();

  switch (currentPlatform) {
    case 'macos':
      return {
        id: 'mac-default',
        key: 'n',
        metaKey: true,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        label: '⌘N',
        isTouchBadge: false,
        platform: 'macos'
      };

    case 'tablet':
      return {
        id: 'tablet-default',
        key: 'n',
        metaKey: true,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        label: 'Tap +',
        isTouchBadge: true,
        platform: 'tablet'
      };

    case 'mobile':
      return {
        id: 'mobile-default',
        key: 'n',
        metaKey: false,
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        label: 'Tap',
        isTouchBadge: true,
        platform: 'mobile'
      };

    case 'linux':
      return {
        id: 'linux-default',
        key: 'n',
        metaKey: false,
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        label: 'Ctrl+N',
        isTouchBadge: false,
        platform: 'linux'
      };

    case 'windows':
    default:
      return {
        id: 'win-default',
        key: 'n',
        metaKey: false,
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        label: 'Ctrl+N',
        isTouchBadge: false,
        platform: 'windows'
      };
  }
}

/**
 * Available hotkey presets for selection
 */
export const HOTKEY_PRESETS: { category: string; platform: PlatformType; presets: HotkeyConfig[] }[] = [
  {
    category: 'Windows & Linux Hotkeys',
    platform: 'windows',
    presets: [
      {
        id: 'win-ctrl-n',
        key: 'n',
        ctrlKey: true,
        label: 'Ctrl+N',
        isTouchBadge: false,
        platform: 'windows'
      },
      {
        id: 'win-alt-n',
        key: 'n',
        altKey: true,
        label: 'Alt+N',
        isTouchBadge: false,
        platform: 'windows'
      },
      {
        id: 'win-ctrl-k',
        key: 'k',
        ctrlKey: true,
        label: 'Ctrl+K',
        isTouchBadge: false,
        platform: 'windows'
      },
      {
        id: 'win-ctrl-shift-o',
        key: 'o',
        ctrlKey: true,
        shiftKey: true,
        label: 'Ctrl+Shift+O',
        isTouchBadge: false,
        platform: 'windows'
      },
      {
        id: 'win-ctrl-j',
        key: 'j',
        ctrlKey: true,
        label: 'Ctrl+J',
        isTouchBadge: false,
        platform: 'windows'
      }
    ]
  },
  {
    category: 'macOS Command Shortcuts',
    platform: 'macos',
    presets: [
      {
        id: 'mac-cmd-n',
        key: 'n',
        metaKey: true,
        label: '⌘N',
        isTouchBadge: false,
        platform: 'macos'
      },
      {
        id: 'mac-opt-n',
        key: 'n',
        altKey: true,
        label: '⌥N',
        isTouchBadge: false,
        platform: 'macos'
      },
      {
        id: 'mac-cmd-k',
        key: 'k',
        metaKey: true,
        label: '⌘K',
        isTouchBadge: false,
        platform: 'macos'
      },
      {
        id: 'mac-shift-cmd-o',
        key: 'o',
        metaKey: true,
        shiftKey: true,
        label: '⇧⌘O',
        isTouchBadge: false,
        platform: 'macos'
      },
      {
        id: 'mac-cmd-j',
        key: 'j',
        metaKey: true,
        label: '⌘J',
        isTouchBadge: false,
        platform: 'macos'
      }
    ]
  },
  {
    category: 'Touch Devices (Phone & Tablet)',
    platform: 'mobile',
    presets: [
      {
        id: 'mobile-tap',
        key: 'n',
        ctrlKey: true,
        metaKey: true,
        label: 'Tap',
        isTouchBadge: true,
        platform: 'mobile'
      },
      {
        id: 'mobile-plus-new',
        key: 'n',
        ctrlKey: true,
        metaKey: true,
        label: '+ New',
        isTouchBadge: true,
        platform: 'mobile'
      },
      {
        id: 'tablet-tap-plus',
        key: 'n',
        ctrlKey: true,
        metaKey: true,
        label: 'Tap +',
        isTouchBadge: true,
        platform: 'tablet'
      },
      {
        id: 'tablet-external-kbd',
        key: 'n',
        metaKey: true,
        label: '⌘N (Keyboard)',
        isTouchBadge: false,
        platform: 'tablet'
      }
    ]
  }
];

/**
 * Load user's saved hotkey configuration, falling back to OS-detected default
 */
export function getSavedHotkey(): HotkeyConfig {
  if (typeof window === 'undefined') return getDefaultHotkey('windows');

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.label && parsed.key) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore JSON error
  }

  return getDefaultHotkey();
}

/**
 * Save user's hotkey configuration and broadcast change
 */
export function saveHotkey(config: HotkeyConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent(HOTKEY_CHANGE_EVENT, { detail: config }));
}

/**
 * Reset hotkey configuration to OS default
 */
export function resetHotkey(): HotkeyConfig {
  const def = getDefaultHotkey();
  saveHotkey(def);
  return def;
}

/**
 * Check if an incoming keyboard event matches the user's hotkey configuration
 */
export function matchesHotkey(e: KeyboardEvent, config: HotkeyConfig): boolean {
  // If target is an input/textarea and not a global modifier shortcut, skip
  const target = e.target as HTMLElement;
  const isInputFocused = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

  // If it's a touch badge preset, we still support Ctrl+N or ⌘N for external keyboards on iPad/tablets
  if (config.isTouchBadge) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
      return true;
    }
    return false;
  }

  const matchesKey = e.key.toLowerCase() === config.key.toLowerCase();
  const matchesCtrl = Boolean(config.ctrlKey) === Boolean(e.ctrlKey);
  const matchesMeta = Boolean(config.metaKey) === Boolean(e.metaKey);
  const matchesAlt = Boolean(config.altKey) === Boolean(e.altKey);
  const matchesShift = Boolean(config.shiftKey) === Boolean(e.shiftKey);

  // Cross-platform tolerance: on macOS, if user set Ctrl+N, accept ⌘N as well if desired
  const matchesModifier = (matchesCtrl && matchesMeta) || 
    (config.ctrlKey && !config.metaKey && e.metaKey && !e.ctrlKey);

  return matchesKey && (matchesModifier || (matchesCtrl && matchesMeta)) && matchesAlt && matchesShift;
}

/**
 * Helper to build custom HotkeyConfig from a recorded KeyboardEvent
 */
export function buildCustomHotkeyFromEvent(e: KeyboardEvent, isMac: boolean): HotkeyConfig | null {
  // Ignore bare modifier keypresses
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
    return null;
  }

  const ctrlKey = e.ctrlKey;
  const metaKey = e.metaKey;
  const altKey = e.altKey;
  const shiftKey = e.shiftKey;
  const key = e.key.toLowerCase();

  // Require at least one modifier key or an F-key
  const isFKey = /^f\d+$/i.test(e.key);
  if (!ctrlKey && !metaKey && !altKey && !isFKey) {
    return null;
  }

  const parts: string[] = [];
  if (isMac) {
    if (ctrlKey) parts.push('⌃');
    if (altKey) parts.push('⌥');
    if (shiftKey) parts.push('⇧');
    if (metaKey) parts.push('⌘');
    parts.push(e.key.toUpperCase());
  } else {
    if (ctrlKey) parts.push('Ctrl');
    if (altKey) parts.push('Alt');
    if (shiftKey) parts.push('Shift');
    if (metaKey) parts.push('Win');
    parts.push(isFKey ? e.key.toUpperCase() : e.key.toUpperCase());
  }

  const label = isMac ? parts.join('') : parts.join('+');

  return {
    id: `custom-${Date.now()}`,
    key,
    ctrlKey,
    metaKey,
    altKey,
    shiftKey,
    label,
    isTouchBadge: false,
    platform: isMac ? 'macos' : 'windows',
    custom: true
  };
}
