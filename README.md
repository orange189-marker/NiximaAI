# Nixima AI

The official frontend and conversational web interface for **Nixima AI** — an autonomous synthetic intelligence platform powered by the **Nixima-0.1** frontier reasoning model.

## Features

- **High-Contrast Monochrome Design**: Pitch black OLED palette (`#09090b`), dark graphite panels, crisp zinc borders, and stark white typography.
- **Flagship Model Selection**:
  - `Nixima-0.1` (Default flagship MoE model, 2M context window)
  - `Nixima-0.1 Reasoning` (Extended chain-of-thought verification)
  - `Nixima-0.1 Coder` (High-precision full-stack & systems synthesis)
  - `Nixima-0.1 Flash` (Sub-millisecond low-latency inference)
- **Conversational Sidebar**: Full conversation management with new chat creation, history search, active indicator, and chat deletion.
- **Deep Reasoning Traces**: Step-by-step reasoning dropdowns simulating internal verification and chain-of-thought processes.
- **Code Highlighting**: Syntax-highlighted code blocks with 1-click clipboard copy.
- **Sovereign Mesh Identity**: Cross-device account crossover and distributed identity synchronization.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/orange189-marker/NiximaAI.git
cd NiximaAI

# Install dependencies
npm install

# Run development server on port 6001
npm run dev
```

Open [http://localhost:6001](http://localhost:6001) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## License

MIT © Nixima AI
