# MindBridge

**HIPAA-compliant student mental health support platform.**

A pre-clinical tool that guides students through mental health screening via
AI-powered conversations and validated questionnaires (PHQ-9, GAD-7, PCL-5,
ASRS-v1.1, C-SSRS, AUDIT-C, ISI, PSS-4), then connects them with appropriate
resources.

---

# 4. In a new terminal — set a persistent key and start the server
export ENCRYPTION_KEY=$(openssl rand -hex 32)
echo "SAVE THIS KEY: $ENCRYPTION_KEY"
npm run build
node server/index.js

# 5. In another terminal — tunnel it publicly
cloudflared tunnel --url http://localhost:3001


## Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌──────────────┐
│  React SPA  │◄────►│  Node.js Backend  │◄────►│  Ollama LLM  │
│  (Vite)     │ TLS  │  (zero deps)      │ local│  (llama3.1)  │
└─────────────┘      └──────┬───────────┘      └──────────────┘
                            │
                     ┌──────▼───────────┐
                     │  Encrypted JSON   │
                     │  Session Store    │
                     │  (AES-256-GCM)   │
                     └──────────────────┘
```

### HIPAA Compliance

| Requirement              | Implementation                                     |
| ------------------------ | -------------------------------------------------- |
| Data encryption at rest  | AES-256-GCM via Node.js `crypto` module            |
| Data encryption in transit | TLS 1.3 (nginx reverse proxy in production)      |
| Local AI processing      | Ollama runs on the same server — no external APIs  |
| Right to deletion        | `DELETE /api/session/:id` endpoint                 |
| Access controls          | Session-scoped keys, no cross-session access        |
| Audit logging            | Console logging (swap for structured logger in prod)|

---

## Quick Start

### 1. Install Ollama & pull a model

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1:8b-instruct-q5_K_M
```

### 2. Start the backend (zero dependencies — no npm install needed)

```bash
# Set a persistent encryption key in production!
export ENCRYPTION_KEY=$(openssl rand -hex 32)
node server/index.js
```

### 3. Install frontend dependencies & start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

---

## Project Structure

```
mindbridge/
├── index.html                  # Vite entry HTML
├── vite.config.js              # Vite + React config with API proxy
├── package.json
│
├── server/
│   └── index.js                # Express API — LLM proxy + encrypted storage
│
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Top-level phase controller
│   │
│   ├── components/
│   │   ├── Header.jsx          # App header with HIPAA badge
│   │   ├── Icons.jsx           # Shared SVG icon components
│   │   ├── DisclosureScreen.jsx# Data processing disclosure (Step 1)
│   │   ├── ConsentForm.jsx     # Consent checkboxes (Step 2)
│   │   ├── ChatView.jsx        # Composed chat screen (Step 3/5)
│   │   ├── ChatMessage.jsx     # Single message bubble
│   │   ├── ChatInputBar.jsx    # Text input + send button
│   │   ├── TypingIndicator.jsx # Loading dots animation
│   │   ├── SuggestionChips.jsx # Starter prompt suggestions
│   │   ├── CrisisBanner.jsx    # Safety resource banner
│   │   ├── QuestionnairePicker.jsx  # Assessment selection grid
│   │   ├── QuestionnaireRunner.jsx  # Active questionnaire flow
│   │   └── ResultCard.jsx      # Score + severity display
│   │
│   ├── hooks/
│   │   ├── useChat.js          # Chat state + LLM integration
│   │   └── useSessionData.js   # Encrypted session management
│   │
│   ├── services/
│   │   ├── llm.js              # LLM abstraction (Ollama / demo)
│   │   └── cryptoStore.js      # AES-256-GCM browser encryption
│   │
│   ├── data/
│   │   ├── questionnaires.js   # PHQ-9, GAD-7, PCL-5, etc.
│   │   ├── resources.js        # Categorised support resources
│   │   └── consentItems.js     # Consent form statements
│   │
│   └── styles/
│       ├── global.css          # Variables, resets, layout, buttons
│       ├── Header.css
│       ├── Disclosure.css
│       ├── Chat.css
│       └── Questionnaire.css
│
└── data/
    └── sessions/               # Encrypted session JSON files (gitignored)
```

---

## Switching to Production

1. **In `src/services/llm.js`** — change `MODE` from `'demo'` to `'local'`.
2. **Set `ENCRYPTION_KEY`** as an environment variable (don't use the random default).
3. **Run behind nginx** with TLS 1.3 for encrypted transit.
4. **Add authentication** — session tokens, rate limiting, etc.
5. **Replace JSON file storage** with an encrypted database (e.g. SQLCipher, encrypted PostgreSQL).

---

## Questionnaires Included

| Instrument | Screens For                | Questions |
| ---------- | -------------------------- | --------- |
| PHQ-9      | Depression                 | 9         |
| GAD-7      | Generalized Anxiety        | 7         |
| PCL-5      | PTSD                       | 20        |
| ASRS-v1.1  | ADHD                       | 6         |
| C-SSRS     | Suicidal Ideation (safety) | 5         |
| AUDIT-C    | Alcohol Misuse             | 3         |
| ISI        | Insomnia                   | 7         |
| PSS-4      | Perceived Stress           | 4         |

---

## License

Built for [Hackathon Name] — Healthcare Education Track.
