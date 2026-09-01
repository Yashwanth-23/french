<div align="center">

# 🇨🇦 French TEF / TCF Canada Mastery Portal
### *The Engineering-Grade Command Center for Express Entry NCLC 7 / B2 French Mastery*

[![Live Demo](https://img.shields.io/badge/Demo-french--ca.vercel.app-0284c7?style=for-the-badge&logo=vercel&logoColor=white)](https://french-ca.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

<p align="center">
  A free, open-access, full-stack pedagogical web platform engineered specifically for non-Romance native speakers targeting <b>NCLC 7 (Level B2)</b> on the <b>TEF Canada</b> or <b>TCF Canada</b> exams for Canadian Immigration (Express Entry & PNP).
</p>

</div>

---

## 🎯 Why This Portal Exists

Preparing for Canadian immigration French via generic gamified apps fails because they prioritize passive recognition over the active production required for NCLC 7.

Achieving B2 requires **800 to 1,000 structured hours** across 5 distinct pedagogical phases:
* **Phase 0 (A0):** Mouth Anatomy, IPA Phonetics, Nasal Vowels (*~25h*)
* **Phase 1 (A1):** Regular -ER Verbs, Passé Composé, Core 1k Lexicon (*~120h*)
* **Phase 2 (A2):** Imparfait, Object Pronouns, Active Vocal Shadowing (*~180h*)
* **Phase 3 (B1):** Subjunctive, Argumentative Connectors, Québécois Dialect (*~260h*)
* **Phase 4 (B2):** Timed FEI/CCIP Exam Simulations & Expression Orale Section A/B (*~220h*)

This platform curates the top 20 free, high-yield educational resources worldwide and structures them into an algorithmic, anti-passive daily mission backlog tailored to your exact time budget.

---

## ⚡ Key Platform Features

### 1. 🧠 Multilingual Cognitive Bridge Engine
Stop translating word-for-word into English. The portal leverages your existing linguistic intuitions to bypass common Romance hurdles:
* **Universal Base:** Clean, standard English explanations for all global learners.
* **Optional Cognitive Anchors:** Seamless toggle for **Telugu** (`నువ్వు/మీరు`), **Hindi** (`तू/आप`, *Chandrabindu* nasals), **Tamil**, or **Spanish** (`Tú/Usted`, Romance cognates).
* **Dynamic Filtering:** The Linguistic Bridges matrix automatically detects your profile language and highlights relevant parallels.

### 2. ⏱️ Anti-Passive Rolling Study Mission Queue
* **Strict Active Output Floor:** Daily plans enforce minimum time allocations for active conjugation drills (*Le Conjugueur*), vocal shadowing (*InnerFrench* & *RFI* transcripts), and production prompts.
* **Granular Time Allocations:** Configurable daily budgets (30m Lite, 1.0h Steady, 1.5h Optimal, 2.0h Intensive).
* **Integrated Sprints & Timers:** 1-click focused countdown timers on every task card with `+30m` and `+60m` rapid sprint loaders.

### 3. 🔗 Zero-Password Multi-Device Cloud Sync
* **Permanent Primary Key URLs:** Access your exact study progress, backlog, and streak from any laptop, phone, or tablet via your unique access link:
  ```
  https://french-ca.vercel.app/?user=<your-handle>
  ```
* **Independent Multi-Profile Support:** Manage multiple learner profiles (e.g. yourself and friends) with isolated study hours, timelines, and preferences.
* **Reddit-Style Handle Generator:** Built-in `🎲 Random Handle` generator creates memorable, collision-free usernames in real time.
* **Offline-First Resilience:** Instant local browser caching with automatic bidirectional sync to Supabase Cloud DB.

### 4. 📚 Curated Deep-Linked Resource Vault
Every task links directly to level-targeted, creator-scoped lessons—eliminating generic channel homepages and dead playlists:
* **Official Exam Portals:** France Éducation international (FEI) TCF Hub & CCIP Paris TEF Candidate Kit.
* **Phonetics & Pronunciation:** French Sounds mouth anatomy & IPA masterclasses.
* **Canadian French Calibration:** Wandering French Québécois phonology & Radio-Canada OHdio broadcasts.
* **Shadowing Audio Banks:** RFI *Journal en français facile* & InnerFrench synchronized audio/PDF transcripts.
* **Grammar & Drills:** Le Conjugueur (Le Figaro) & Podcast Français Facile.
* **Lexical Retrieval:** Anki 5,000 Spaced Repetition audio deck & UT Austin Français Interactif.

### 5. 📊 Exam Scoring & Diagnostic Engine
* **TEF vs. TCF Strategy Hub:** Side-by-side comparative analysis of exam formats (single-pass audio vs. mixed playback, Section A/B roleplay strategies).
* **NCLC 7 Benchmark Calculator:** Real-time tracking against CLB/NCLC 7 score thresholds (TEF: 248+ CO, 248+ CE, 310+ EO/EE; TCF: 458+ CO, 453+ CE, 10+/20 Speaking/Writing).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Lightning-fast reactive UI and client-side routing |
| **Language** | TypeScript (Strict) | Type-safe domain models for curriculum & preferences |
| **Styling** | Tailwind CSS | Modern dark-mode responsive glassmorphic design |
| **Database & Cloud Sync** | Supabase (PostgreSQL) | Real-time JSONB cloud profile persistence & RLS |
| **Icons** | Lucide React | Clean, modern vector UI iconography |
| **Deployment** | Vercel | Global CDN edge deployment with continuous integration |

---

## 🚀 Getting Started / Local Development

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Yashwanth-23/french.git
   cd french
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📁 Architecture & Codebase Structure

```
french-mastery-portal/
├── src/
│   ├── components/            # UI Modals, Navbar, Task Cards & Views
│   │   ├── DailyMission.tsx   # Active study task queue & countdown timers
│   │   ├── OnboardingModal.tsx# Profile creation wizard & sync link generator
│   │   ├── ProfileSwitcher.tsx# Multi-profile manager & settings drawer
│   │   ├── IndianBridgeGuide.tsx # Multilingual cognitive bridge matrix
│   │   ├── ResourceCatalog.tsx# Searchable 20-resource database
│   │   ├── ExamHub.tsx        # TEF / TCF Canada rules & scoring rubrics
│   │   └── HelpGuideModal.tsx # Pedagogical methodology & user guide
│   ├── engine/                # Core business & recommendation logic
│   │   ├── recommender.ts     # Daily task allocation & scoring engine
│   │   └── dataService.ts     # Supabase CRUD & offline local cache sync
│   ├── data/                  # Pedagogical static datasets
│   │   ├── resources.json     # 20 curated high-yield learning resources
│   │   ├── milestones.json    # CEFR A0 -> B2 milestone progression
│   │   └── linguisticBridges.json # Multilingual grammar & phonetic mappings
│   ├── types/                 # TypeScript type definitions
│   │   ├── curriculum.ts      # Task, Milestone, and SkillSlot interfaces
│   │   └── preferences.ts     # UserProfile and UserPreferences types
│   ├── App.tsx                # Main application orchestrator
│   └── main.tsx               # DOM entrypoint
├── public/                    # Static web assets
├── package.json               # Dependencies and build scripts
├── vite.config.ts             # Vite bundler configuration
├── tailwind.config.js         # Tailwind CSS styling tokens
└── README.md                  # Project documentation
```

---

## 📜 Database Schema (Supabase `profiles` table)

```sql
CREATE TABLE public.profiles (
  id TEXT PRIMARY KEY,                       -- Unique URL Slug / Username (e.g. 'yash23')
  name TEXT NOT NULL,                        -- User Display Name (e.g. 'Yashwanth')
  target_exam TEXT DEFAULT 'TEF_Canada',     -- 'TEF_Canada' | 'TCF_Canada' | 'Universal_B2'
  daily_time_minutes INT DEFAULT 120,        -- 30 | 60 | 90 | 120
  preferred_formats JSONB,                   -- {"list": ["podcast", "youtube"], "bridge": "none"}
  starting_level TEXT DEFAULT 'A0',          -- 'A0' | 'A1' | 'A2' | 'B1'
  current_milestone_id TEXT,                 -- e.g. 'milestone-a0'
  completed_milestone_ids JSONB DEFAULT '[]',-- Array of completed milestone IDs
  active_task_queue JSONB DEFAULT '[]',      -- Current active task backlog with timers
  completed_history JSONB DEFAULT '[]',      -- Lifetime log of completed study sessions
  total_minutes_logged INT DEFAULT 0,        -- Total cumulative minutes studied
  streak_days INT DEFAULT 1,                 -- Consecutive daily study streak count
  last_active_date DATE,                     -- ISO format 'YYYY-MM-DD'
  bookmarked_resource_ids JSONB DEFAULT '[]',-- Saved resource IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🤝 Contributing

Contributions to enhance learning resources, add linguistic analogies for additional native languages, or refine exam strategies are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewLinguisticBridge`)
3. Commit your changes (`git commit -m 'feat: Add Bengali linguistic bridge analogies'`)
4. Push to the branch (`git push origin feature/NewLinguisticBridge`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**.

---

<div align="center">
  <sub>Engineered with focus and precision for Canadian French immigration aspirants worldwide.</sub>
</div>
