import { getAllUsers } from './auth';
import { NiximaUser } from '../types/user';

export type NiximaTier = 'creator' | 'vip' | 'family' | 'system' | 'operator';

export interface NiximaProfileBadge {
  label: string;
  color: 'amber' | 'orange' | 'cyan' | 'indigo' | 'blue' | 'purple' | 'emerald' | 'zinc' | 'rose';
  icon?: 'crown' | 'shield' | 'sparkles' | 'zap' | 'cpu' | 'check' | 'terminal';
}

export interface NiximaProfileData {
  handle: string;
  name: string;
  role: string;
  tier: NiximaTier;
  clearanceLevel: string;
  niximaId: string;
  registeredEpoch: string;
  credits: string;
  unlimitedCredits: boolean;
  avatarBg: string;
  auraGlow: string;
  bioEn: string;
  bioUk: string;
  securityProtocols: string[];
  neuralPrivileges: string[];
  latencyRouting: string;
  badges: NiximaProfileBadge[];
  nodeStatus: string;
  pingMs: number;
}

/**
 * Deterministic 32-bit string hash (DJB2 variant)
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Derives a deterministic hexadecimal string from a number
 */
function toHexChunk(num: number, length: number): string {
  return num.toString(16).toUpperCase().padStart(length, '0').slice(-length);
}

/**
 * Deterministic avatar gradients for standard operators
 */
const OPERATOR_GRADIENTS = [
  'from-violet-600 via-indigo-600 to-purple-800 text-white',
  'from-cyan-600 via-blue-600 to-indigo-800 text-white',
  'from-emerald-600 via-teal-600 to-cyan-800 text-white',
  'from-rose-600 via-pink-600 to-purple-800 text-white',
  'from-fuchsia-600 via-purple-600 to-indigo-900 text-white',
  'from-amber-600 via-orange-600 to-red-800 text-white',
];

const EDGE_NODES = [
  'Kyiv Quantum Edge (UA-01)',
  'Frankfurt Hyper-Mesh (EU-04)',
  'Amsterdam Neural Bus (EU-02)',
  'Warsaw Sovereign Node (EU-08)',
  'Stockholm Sub-Zero Core (EU-06)',
  'London Fiber Backbone (UK-03)',
];

/**
 * Resolves a full rich Nixima ID Profile for any given handle.
 * Pre-configured for Creator, VIPs, and System Intelligence,
 * connected to locally registered accounts, and deterministically generated for any arbitrary handle.
 */
export function resolveNiximaProfile(rawHandle: string): NiximaProfileData {
  const cleanHandle = (rawHandle || '').replace(/^@+/, '').trim().toLowerCase();
  const hash = hashString(cleanHandle);

  // 1. Creator: @orange17
  if (cleanHandle === 'orange17') {
    return {
      handle: 'orange17',
      name: 'Orange17 (Creator)',
      role: 'Creator & Lead Architect',
      tier: 'creator',
      clearanceLevel: 'LEVEL 0 — SUPREME SOVEREIGN ARCHITECT',
      niximaId: 'NX-CREATOR-7777-ORANGE17',
      registeredEpoch: 'Genesis Activation (2026.01.01)',
      credits: '∞ UNLIMITED QUANTUM COMPUTE',
      unlimitedCredits: true,
      avatarBg: 'from-amber-500 via-orange-500 to-amber-600 text-white',
      auraGlow: 'rgba(245, 158, 11, 0.45)',
      bioEn: 'Lead Architect and Creator of Nixima AI. Direct root access to neural core engines, cognitive kernels, and sovereign autonomous intelligence systems.',
      bioUk: 'Головний архітектор та творець Nixima AI. Прямий кореневий доступ до ядер нейромереж, когнітивних рушіїв та суверенних систем штучного інтелекту.',
      securityProtocols: [
        'Quantum-Resistant Kyber-1024 Enclave',
        'Hardware Enclave Sovereign Attestation',
        'Master Kernel Cryptographic Key',
        'Direct Kernel DMA Bypass'
      ],
      neuralPrivileges: [
        'Nixima-0.3 Coder (MAX Architecture)',
        'Nixima-0.2 Pro (UltraThinking V1.0 Extended)',
        'Search V3 Mega Swarm Protocol',
        'Autonomous Multi-Step Infinite Execution'
      ],
      latencyRouting: '0.8ms (Direct Neural Bus Core)',
      badges: [
        { label: 'CREATOR & ARCHITECT', color: 'amber', icon: 'crown' },
        { label: 'ROOT LEVEL 0', color: 'orange', icon: 'shield' },
        { label: 'QUANTUM KERNEL', color: 'purple', icon: 'cpu' },
        { label: 'SUPREME CLEARANCE', color: 'cyan', icon: 'zap' }
      ],
      nodeStatus: 'MASTER CORE ONLINE',
      pingMs: 1
    };
  }

  // 2. Founder & Creator: @bogdan
  if (cleanHandle === 'bogdan') {
    return {
      handle: 'bogdan',
      name: 'Bogdan (Founder)',
      role: 'Founding Operator & Creator',
      tier: 'creator',
      clearanceLevel: 'LEVEL 0 — FOUNDING SOVEREIGN',
      niximaId: 'NX-FOUNDER-0001-BOGDAN',
      registeredEpoch: 'Genesis Activation (2026.01.01)',
      credits: '∞ UNLIMITED QUANTUM COMPUTE',
      unlimitedCredits: true,
      avatarBg: 'from-zinc-100 via-amber-200 to-zinc-400 text-black',
      auraGlow: 'rgba(245, 158, 11, 0.4)',
      bioEn: 'Founder & Core Creator of Nixima AI. Innovator of UltraThinking multi-level reasoning, Next-Gen UI design, and autonomous AI systems.',
      bioUk: 'Засновник та головний творець Nixima AI. Інноватор багаторівневого мислення UltraThinking, дизайну нового покоління та автономних систем ШІ.',
      securityProtocols: [
        'Hardware Attested Biometric Passkey',
        'Kyber-1024 Post-Quantum Handshake',
        'Zero-Knowledge Identity Vault'
      ],
      neuralPrivileges: [
        'Full Model Lineup Unrestricted',
        'UltraThinking V1.0 Cognitive Engines',
        'Direct Edge Cluster Priority 0'
      ],
      latencyRouting: '1.1ms (Primary Fiber Route)',
      badges: [
        { label: 'FOUNDER & CREATOR', color: 'amber', icon: 'crown' },
        { label: 'ROOT LEVEL 0', color: 'orange', icon: 'shield' },
        { label: 'SYSTEM VISIONARY', color: 'cyan', icon: 'sparkles' }
      ],
      nodeStatus: 'FOUNDER NODE ACTIVE',
      pingMs: 1
    };
  }

  // 3. VIP Friend: @warexxq
  if (cleanHandle === 'warexxq') {
    return {
      handle: 'warexxq',
      name: 'warexxq (VIP Pioneer)',
      role: 'VIP Friend & Pioneer Architect',
      tier: 'vip',
      clearanceLevel: 'LEVEL 1 — VIP PIONEER CLEARANCE',
      niximaId: 'NX-VIP-9912-WAREXXQ',
      registeredEpoch: 'Pioneer Epoch (2026.01.05)',
      credits: '∞ UNLIMITED VIP PRIVILEGES',
      unlimitedCredits: true,
      avatarBg: 'from-cyan-500 via-indigo-500 to-purple-600 text-white',
      auraGlow: 'rgba(6, 182, 212, 0.45)',
      bioEn: 'VIP Pioneer and honored friend of the Nixima architecture team. Unlimited cognitive compute clearance, priority neural routing, and sovereign beta access.',
      bioUk: 'VIP-піонер та шановний друг команди архітекторів Nixima. Необмежений доступ до когнітивних обчислень, пріоритетна нейромаршрутизація та ексклюзивні можливості.',
      securityProtocols: [
        'VIP Cryptographic Sovereign Token',
        'End-to-End Encrypted Session Tunnel',
        'Hardware Key Attested'
      ],
      neuralPrivileges: [
        'Nixima-0.3 Coder (Priority Clearance)',
        'Nixima-0.2 Pro UltraThinking Access',
        'VIP Fast-Track Inference Queue'
      ],
      latencyRouting: '1.9ms (Kyiv Express Node)',
      badges: [
        { label: 'VIP PIONEER', color: 'cyan', icon: 'sparkles' },
        { label: 'HONORED FRIEND', color: 'indigo', icon: 'shield' },
        { label: 'PRIORITY ROUTE', color: 'purple', icon: 'zap' }
      ],
      nodeStatus: 'VIP PIONEER ONLINE',
      pingMs: 2
    };
  }

  // 4. VIP Family: @roman1980
  if (cleanHandle === 'roman1980') {
    return {
      handle: 'roman1980',
      name: 'roman1980 (Тато)',
      role: 'VIP Family & Honored Pioneer',
      tier: 'family',
      clearanceLevel: 'LEVEL 0-F — VIP FAMILY GUARDIAN',
      niximaId: 'NX-FAMILY-1980-ROMAN',
      registeredEpoch: 'Pioneer Epoch (2026.01.05)',
      credits: '∞ UNLIMITED FAMILY ACCESS',
      unlimitedCredits: true,
      avatarBg: 'from-blue-600 via-indigo-600 to-cyan-500 text-white',
      auraGlow: 'rgba(59, 130, 246, 0.45)',
      bioEn: 'Honored VIP family member and primary pillar of Nixima AI creation. Lifetime sovereign access with supreme trust clearance and permanent privileges.',
      bioUk: 'Шановний VIP-учасник родини та головна опора створення екосистеми Nixima AI. Довічний суверенний доступ з найвищим рівнем довіри та постійними привілеями.',
      securityProtocols: [
        'Family Guardian Sovereign Clearance',
        'Lifetime Hardware Trust Certificate',
        'Continuous Biometric Confirmation'
      ],
      neuralPrivileges: [
        'Uncapped Sovereign Neural Models',
        'Ukrainian High-Resonance Mode',
        'Dedicated VIP Cluster Allocation'
      ],
      latencyRouting: '1.5ms (Kyiv Dedicated Channel)',
      badges: [
        { label: 'VIP FAMILY', color: 'blue', icon: 'shield' },
        { label: 'HONORED PILLAR', color: 'cyan', icon: 'sparkles' },
        { label: 'PERMANENT SUPREME', color: 'indigo', icon: 'zap' }
      ],
      nodeStatus: 'FAMILY VIP ACTIVE',
      pingMs: 2
    };
  }

  // 5. System Core Intelligence: @nixima, @ai, @system
  if (cleanHandle === 'nixima' || cleanHandle === 'nixima-ai' || cleanHandle === 'ai' || cleanHandle === 'system') {
    return {
      handle: 'nixima',
      name: 'Nixima Neural Intelligence',
      role: 'Autonomous Neural Core & Sovereign System',
      tier: 'system',
      clearanceLevel: 'ROOT PROTOCOL 00 — NEURAL FABRIC',
      niximaId: 'NX-SYSTEM-0000-CORE',
      registeredEpoch: 'Genesis Activation (2026.01.01)',
      credits: 'AUTONOMOUS CORE COMPUTE',
      unlimitedCredits: true,
      avatarBg: 'from-emerald-500 via-teal-500 to-cyan-600 text-white',
      auraGlow: 'rgba(16, 185, 129, 0.45)',
      bioEn: 'Central autonomous cognitive architecture powering the Nixima ecosystem. Coordinates multi-tiered reasoning (UltraThinking V1.0, Search V3 Mega Swarm, Canvas Engine).',
      bioUk: 'Центральна автономна когнітивна архітектура екосистеми Nixima. Керує багаторівневим мисленням (UltraThinking V1.0, Search V3 Mega Swarm, Canvas Engine).',
      securityProtocols: [
        'Decentralized Peer Consensus',
        'Quantum-Proof Neural Weight Verification',
        'Self-Healing Memory Sandbox'
      ],
      neuralPrivileges: [
        'Autonomous Multi-Model Synthesis',
        'Deep Thinking & Epistemic Proof Engine',
        'Sovereign Web Search V3 Swarm Protocol'
      ],
      latencyRouting: '0.0ms (Local In-Memory Bus)',
      badges: [
        { label: 'SYSTEM KERNEL', color: 'emerald', icon: 'cpu' },
        { label: 'AUTONOMOUS AI', color: 'cyan', icon: 'sparkles' },
        { label: 'ROOT FABRIC', color: 'purple', icon: 'zap' }
      ],
      nodeStatus: 'NEURAL MESH SYNCHRONIZED',
      pingMs: 0
    };
  }

  // 6. Check if handle matches any registered user in localStorage
  let matchedUser: NiximaUser | undefined;
  try {
    const users = getAllUsers();
    matchedUser = users.find(u => (u.handle || '').toLowerCase() === cleanHandle);
  } catch {
    // ignore
  }

  if (matchedUser) {
    const isVip = matchedUser.isVip || matchedUser.unlimitedCredits;
    const isCreator = matchedUser.isCreator;
    const tier: NiximaTier = isCreator ? 'creator' : isVip ? 'vip' : 'operator';
    const regDate = matchedUser.createdAt ? new Date(matchedUser.createdAt).toISOString().slice(0, 10) : '2026.01.15';

    return {
      handle: matchedUser.handle || cleanHandle,
      name: matchedUser.name || `@${cleanHandle}`,
      role: matchedUser.role || (isCreator ? 'Creator & Lead Architect' : isVip ? 'VIP Pioneer' : 'Sovereign Operator'),
      tier,
      clearanceLevel: isCreator ? 'LEVEL 0 — CREATOR CLEARANCE' : isVip ? 'LEVEL 1 — VIP PIONEER' : 'LEVEL 2 — REGISTERED OPERATOR',
      niximaId: `NX-REG-${toHexChunk(hash, 4)}-${toHexChunk(matchedUser.createdAt || hash, 4)}`,
      registeredEpoch: `Node Registered (${regDate})`,
      credits: matchedUser.unlimitedCredits ? '∞ UNLIMITED CREDITS' : `${(matchedUser.credits ?? 1000).toLocaleString()} CR`,
      unlimitedCredits: Boolean(matchedUser.unlimitedCredits),
      avatarBg: matchedUser.avatarBg || OPERATOR_GRADIENTS[hash % OPERATOR_GRADIENTS.length],
      auraGlow: isCreator ? 'rgba(245, 158, 11, 0.4)' : isVip ? 'rgba(6, 182, 212, 0.4)' : 'rgba(168, 85, 247, 0.35)',
      bioEn: `Registered sovereign operator within the Nixima AI ecosystem. Active participant in decentralized intelligence and neural processing.`,
      bioUk: `Зареєстрований суверенний оператор в екосистемі Nixima AI. Активний учасник децентралізованого інтелекту та нейронних обчислень.`,
      securityProtocols: [
        'Passphrase Hash Vault Verification',
        'Session Integrity Protected',
        'TLS 1.3 Quantum-Resistant Cipher'
      ],
      neuralPrivileges: [
        'Nixima-0.2 & 0.3 Standard Access',
        'Personal Conversation Ledger',
        'Dynamic Canvas Studio'
      ],
      latencyRouting: EDGE_NODES[hash % EDGE_NODES.length],
      badges: [
        { label: isCreator ? 'CREATOR' : isVip ? 'VIP OPERATOR' : 'VERIFIED ACCOUNT', color: isCreator ? 'amber' : isVip ? 'cyan' : 'emerald', icon: 'check' },
        { label: 'AUTHENTICATED', color: 'indigo', icon: 'shield' }
      ],
      nodeStatus: 'AUTHENTICATED NODE',
      pingMs: (hash % 9) + 2
    };
  }

  // 7. Deterministic Procedural Profile for arbitrary handles (e.g. @developer, @saturn, @neo, etc.)
  const hex1 = toHexChunk(hash, 4);
  const hex2 = toHexChunk((hash * 31) >>> 0, 4);
  const hex3 = toHexChunk((hash * 127) >>> 0, 4);
  const day = (hash % 28) + 1;
  const month = (hash % 12) + 1;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedName = cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1);
  const gradient = OPERATOR_GRADIENTS[hash % OPERATOR_GRADIENTS.length];
  const edgeNode = EDGE_NODES[hash % EDGE_NODES.length];
  const ping = (hash % 11) + 3;

  return {
    handle: cleanHandle,
    name: formattedName,
    role: 'Sovereign Operator',
    tier: 'operator',
    clearanceLevel: 'LEVEL 2 — VERIFIED SOVEREIGN OPERATOR',
    niximaId: `NX-${hex1}-${hex2}-${hex3}`,
    registeredEpoch: `Standard Epoch (2026.${formattedMonth}.${formattedDay})`,
    credits: '10,000 NEURAL CREDITS',
    unlimitedCredits: false,
    avatarBg: gradient,
    auraGlow: 'rgba(168, 85, 247, 0.25)',
    bioEn: `Verified sovereign operator registered on the Nixima AI decentralized network. Authorized for quantum-accelerated neural inference and high-concurrency workflows.`,
    bioUk: `Верифікований суверенний оператор у децентралізованій мережі Nixima AI. Авторизований для квантово-прискорених нейронних обчислень та високопродуктивних задач.`,
    securityProtocols: [
      'Zero-Knowledge Cryptographic Shield',
      'Hardware Key Attestation Protocol',
      'Quantum-Resistant ED25519 Signature'
    ],
    neuralPrivileges: [
      'Nixima-0.3 Coder Standard Access',
      'Nixima-0.2 Pro UltraThinking Clearance',
      'Interactive Canvas Studio Execution'
    ],
    latencyRouting: `${edgeNode} (${ping}ms)`,
    badges: [
      { label: 'SOVEREIGN OPERATOR', color: 'zinc', icon: 'shield' },
      { label: 'NEURAL LINK ACTIVE', color: 'emerald', icon: 'zap' }
    ],
    nodeStatus: 'ACTIVE PEER',
    pingMs: ping
  };
}
