# StemPlayer (stem-player)

## Overview

StemPlayer (marketed as "StemPlay Online" in the UI) is a cross-platform web and mobile application that emulates the physical YEEZY TECH × KANO Stem Player hardware device. It accepts audio files (MP3, WAV, FLAC, M4A) or YouTube URLs, separates them into four stems (Vocals, Drums, Bass, Other) using the Demucs ML model via a Python/FastAPI backend, and provides an interactive "puck" UI for real-time per-stem volume control and mixing. The frontend is a React Native Expo app that runs on Web, iOS, and Android. The project is structured as an npm monorepo managed by Turborepo. The license is MIT, copyright 2026 Aswin Chettri. Current status: active development — the most recent commit is 2026-07-05, and the project was started on 2026-06-27.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Client                          │
│  Expo Router App (React Native + react-native-web)  │
│                                                     │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Home (/)  │ │ Player   │ │ Library  │           │
│  │ Upload/YT │ │ Puck UI  │ │ Track    │           │
│  │ Input     │ │ + Audio  │ │ Browser  │           │
│  └─────┬─────┘ └────┬─────┘ └─────┬────┘           │
│        │             │             │                │
│        └─────────────┴─────────────┘                │
│                      │                              │
│        ┌─────────────┴──────────────┐               │
│        │  Puck3DWebView Component   │               │
│        │  (Hidden WebView/iframe)   │               │
│        │  Runs Tone.js audio engine │               │
│        └─────────────┬──────────────┘               │
└──────────────────────┼──────────────────────────────┘
                       │  HTTP REST + WebSocket
                       │  postMessage (audio commands)
┌──────────────────────┼──────────────────────────────┐
│              FastAPI Backend (api/)                  │
│                      │                              │
│  ┌───────────┐ ┌─────┴──────┐ ┌──────────────┐     │
│  │ /api/     │ │ Background │ │ Static File  │     │
│  │ upload    │ │ Tasks      │ │ Server       │     │
│  │ youtube   │ │ (demucs    │ │ /songs/      │     │
│  │ job/{id}  │ │  subprocess│ │ /tmp/        │     │
│  │ stems/{id}│ │  via async)│ │ /static/     │     │
│  │ library   │ │            │ │              │     │
│  │ health    │ └────────────┘ └──────────────┘     │
│  └───────────┘                                      │
│                                                     │
│  ┌──────────────┐ ┌──────────────┐                  │
│  │ Demucs CLI   │ │ yt-dlp       │                  │
│  │ (subprocess) │ │ (in-process) │                  │
│  └──────────────┘ └──────────────┘                  │
└─────────────────────────────────────────────────────┘
```

**Data flow:**

1. User uploads an audio file or pastes a YouTube URL on the Home screen.
2. The frontend POSTs to `/api/upload` or `/api/youtube`. The backend returns a `job_id`.
3. The frontend navigates to the Processing screen and polls `GET /api/job/{job_id}` every 2 seconds.
4. On the backend, a `BackgroundTask` runs `yt-dlp` (if YouTube) to download audio, then invokes the `demucs` CLI as an async subprocess to split the audio into 4 stems (vocals.mp3, drums.mp3, bass.mp3, other.mp3) at 128kbps.
5. When complete, the job status transitions to `"completed"` with stem URLs pointing to files served from the `tmp/` static mount.
6. The frontend creates a `Track` object, navigates to the Player screen, and loads the 4 stem URLs into the hidden `Puck3DWebView` component.
7. `Puck3DWebView` runs Tone.js inside a WebView (native) or iframe (web), loading all 4 stems as `Tone.Players`, each set to loop. The component communicates with the parent React Native layer via `postMessage`/`onMessage`.
8. The user controls per-stem volume by sliding on the puck arms. The puck UI sends volume messages to Tone.js. A "solo" feature mutes all non-held stems on a 350ms long-press.

**Why this architecture:** The WebView-bridged audio engine pattern is used because Tone.js (a Web Audio API wrapper) cannot run directly in React Native's JavaScript thread. By isolating Tone.js in a hidden 1×1px WebView, the app gets browser-grade audio DSP on all platforms without crashing the RN UI thread. This is documented in the README and visible in `Puck3DWebView.tsx` (lines 22-23: "Lightweight HTML — Tone.js only, no Three.js, no WebGL"). The `.web.tsx` variant loads Tone.js directly into the DOM for the web platform, bypassing the WebView entirely.

**Progressive streaming pattern:** The native `Puck3DWebView.tsx` implements a two-phase playback strategy — it starts playing the original (unsplit) audio via an HTML `<audio>` element immediately, then loads stems in the background via Tone.Players. When stems finish loading, it crossfades seamlessly from the stream to the stems (line 104: `streamPlayer.pause()`). This is confirmed by commit `c7d1f76` ("progressive streaming engine").

## Tech Stack

### Backend (Python)

| Dependency           | Version    | Source                  |
|----------------------|------------|-------------------------|
| Python               | 3.12+      | README requirement      |
| FastAPI              | 0.111.0    | `api/requirements.txt`  |
| Uvicorn              | 0.29.0     | `api/requirements.txt`  |
| python-multipart     | 0.0.9      | `api/requirements.txt`  |
| yt-dlp               | 2024.4.9   | `api/requirements.txt`  |
| boto3                | 1.34.100   | `api/requirements.txt`  |
| APScheduler          | 3.10.4     | `api/requirements.txt`  |
| websockets           | 12.0       | `api/requirements.txt`  |
| pydantic             | 2.7.1      | `api/requirements.txt`  |
| pydantic-settings    | 2.2.1      | `api/requirements.txt`  |
| slowapi              | 0.1.24     | `api/requirements.txt`  |
| Demucs (`htdemucs_ft`) | Not pinned | Called via CLI subprocess; not in requirements.txt |
| FFmpeg               | Not pinned | Required system dependency (README + `split_songs.py`) |

### Frontend (TypeScript / React Native)

| Dependency                            | Version        | Source                              |
|---------------------------------------|----------------|-------------------------------------|
| React                                 | 19.1.0         | `apps/mobile/package.json`          |
| React Native                          | 0.81.5         | `apps/mobile/package.json`          |
| Expo SDK                              | ~54.0.35       | `apps/mobile/package.json`          |
| expo-router                           | ~6.0.24        | `apps/mobile/package.json`          |
| react-native-webview                  | 13.15.0        | `apps/mobile/package.json`          |
| react-native-reanimated               | ~4.1.1         | `apps/mobile/package.json`          |
| react-native-gesture-handler          | ~2.28.0        | `apps/mobile/package.json`          |
| zustand                               | ^5.0.14        | `apps/mobile/package.json`          |
| nativewind                            | ^4.2.6         | `apps/mobile/package.json`          |
| tailwindcss                           | ^3.4.19        | `apps/mobile/package.json`          |
| lucide-react-native                   | ^1.21.0        | `apps/mobile/package.json`          |
| expo-document-picker                  | ~14.0.8        | `apps/mobile/package.json`          |
| expo-av                               | ^16.0.8        | `apps/mobile/package.json`          |
| expo-image                            | ~3.0.11        | `apps/mobile/package.json`          |
| expo-glass-effect                     | ~0.1.10        | `apps/mobile/package.json`          |
| @expo-google-fonts/ibm-plex-mono      | ^0.4.1         | `apps/mobile/package.json`          |
| @react-native-community/slider        | 5.0.1          | `apps/mobile/package.json`          |
| react-native-svg                      | 15.12.1        | `apps/mobile/package.json`          |
| react-native-web                      | ^0.21.0        | `apps/mobile/package.json`          |
| react-native-worklets                 | 0.5.1          | `apps/mobile/package.json`          |
| TypeScript                            | ~5.9.2         | `apps/mobile/package.json` (dev)    |
| Tone.js                               | 14.8.49 (inferred) | Bundled as `api/static/tone.min.js` (349KB) and `apps/mobile/assets/tone.min.js` |

### Monorepo Tooling

| Tool         | Version   | Source              |
|--------------|-----------|---------------------|
| Turborepo    | ^2.1.2    | Root `package.json` |
| npm          | 10.8.1    | Root `package.json` (`packageManager`) |
| concurrently | ^10.0.3   | Root `package.json` |
| Prettier     | ^3.2.5    | Root `package.json` |

### CI/CD

- GitHub Actions workflow: `.github/workflows/sast.yml`
  - **Bandit** (Python SAST) — scans `api/` at medium severity/confidence
  - **ESLint + TSC** — lints `apps/mobile/` via `npm run lint`
  - Triggers on push/PR to `main`/`master`

## External Dependencies & Integrations

### Third-Party Services

| Service / Tool       | Purpose                                   | Status in Code                    |
|----------------------|-------------------------------------------|-----------------------------------|
| **Demucs** (Meta AI) | ML stem separation — invoked as CLI subprocess (`demucs --mp3 -n htdemucs_ft`) | Fully integrated (`api/services/demucs_service.py`, `api/batch_split.py`) |
| **yt-dlp**           | YouTube audio download — used as Python library | Fully integrated (`api/routes/youtube.py`) |
| **Cloudflare R2**    | Object storage for stems (S3-compatible via boto3) | **Stubbed** — `StorageService` in `api/services/storage_service.py` returns mock URLs; `upload_file()` just prints. Config keys exist but no real S3 calls are made. |
| **Redis**            | Intended for job queue or caching | **Not used in code** — `REDIS_URL` appears in `.env.example` but no code imports or uses Redis |
| **FFmpeg**           | Audio re-encoding (system dependency for Demucs and `reencode.py`) | Required at system level |

### Required Environment Variables

Source: `.env.example` (root) and `apps/mobile/.env.example`

**Backend:**
- `CLOUDFLARE_R2_ACCESS_KEY`
- `CLOUDFLARE_R2_SECRET_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_R2_ENDPOINT`
- `REDIS_URL`
- `MAX_FILE_SIZE_MB`
- `STEM_DELETE_AFTER_HOURS`
- `DEMUCS_MODEL`
- `MOCK_MODE`
- `ALLOWED_ORIGINS` (used in CORS config, default `"*"`)

**Frontend:**
- `NEXT_PUBLIC_API_URL` (in root `.env.example` — however, the mobile app uses `EXPO_PUBLIC_API_URL` per `apps/mobile/.env.example` and `config.ts`)
- `NEXT_PUBLIC_WS_URL` (in root `.env.example` — no code references this)
- `EXPO_PUBLIC_API_URL`

## Core Features

### Implemented and Working (traced to code)

1. **Audio file upload with MIME validation and size limiting** — `api/routes/upload.py` lines 36-68. Validates MIME type starts with `audio/`, checks file extension against allowlist (`.mp3`, `.wav`, `.flac`, `.m4a`), enforces `MAX_FILE_SIZE_MB` (default 100MB) via Content-Length header.

2. **YouTube URL download and audio extraction** — `api/routes/youtube.py` lines 33-60. Validates URL against YouTube domains (youtube.com, youtu.be, m.youtube.com) with regex. Downloads best audio (prefers m4a) via `yt-dlp` Python library.

3. **AI stem separation via Demucs** — `api/services/demucs_service.py`. Runs `demucs --mp3 --mp3-bitrate 128 -d cuda -n htdemucs_ft` as an async subprocess. Outputs 4 MP3 stems per track.

4. **Job queue with polling** — In-memory dict `JOBS = {}` (`api/jobs.py`). Jobs created at upload/youtube submission, polled via `GET /api/job/{job_id}` (`api/routes/stems.py`). Status transitions: `processing` → `completed` | `failed`.

5. **WebSocket connection manager** — `api/routes/websocket.py` lines 8-42. `ConnectionManager` class with per-job connection lists, broadcast capability. Endpoint at `/ws/job/{job_id}`. Currently used for keeping connections alive; the frontend actually polls REST instead.

6. **Pre-split library serving** — `GET /api/library` in `api/main.py` lines 266-400. Walks `../songs/` directory, finds audio files, matches them to pre-existing stems in `songs/stems/htdemucs_ft/`, resolves cover art from `Album Covers/` directory, and returns sorted track metadata. Hardcoded album ordering for "The Fall-Off" and "Vultures" tracklists.

7. **Interactive puck UI with 4-stem volume control** — `apps/mobile/app/player.tsx`. Touch/drag on each arm (top=Vocals, bottom=Drums, left=Bass, right=Other) maps position to 0-1 volume via `handleArmTouch()`. 4 LED indicators per arm light up at 25% thresholds.

8. **Solo mode** — 350ms long-press on any arm mutes all other stems. Released on touch end. `player.tsx` lines 176-184.

9. **Tone.js audio engine in bridged WebView** — `Puck3DWebView.tsx` (native) and `Puck3DWebView.web.tsx` (web). Dual-implementation using `.web.tsx` platform extension. Native version embeds HTML with Tone.js into a `react-native-webview`. Web version loads Tone.js directly via `<script>` tag.

10. **Progressive streaming playback** — `Puck3DWebView.tsx` lines 69-110. Streams original audio via `<audio>` element immediately while stems load in background. Crossfades when stems are ready.

11. **Playback scrubbing/seeking** — `player.tsx` lines 454-486. Custom touch-based scrubber (not a native slider) with visual thumb and track.

12. **Theme switching** — 4 color themes for LED glow colors. `player.tsx` lines 14-19, cycled via `setThemeIndex`.

13. **Master volume control** — Increment/decrement buttons (±0.1). `player.tsx` lines 398-412.

14. **Track navigation** — Next/previous track with wrap-around. `player.tsx` lines 136-150.

15. **Curved stem labels** — `CurvedText` component renders text along circular arcs around the puck. `player.tsx` lines 39-81.

16. **Library screen with search and album view** — `apps/mobile/app/library.tsx`. Text search across title/artist/album. Songs and Albums tab views. Album grid with cover art.

17. **Processing screen with animated progress** — `apps/mobile/app/processing.tsx`. Animated bouncing dots, stepped progress bar with fake progress interpolation (slowly fills while waiting), 4-step checklist.

18. **IP-based rate limiting** — `api/limiter.py` + `slowapi`. Upload and YouTube endpoints limited to `5/minute` per IP.

19. **Cache headers** — 1-year `Cache-Control` for `/songs/` and `/static/` paths. `api/main.py` lines 27-31.

20. **Double-encoded URL middleware** — `api/main.py` lines 17-24. Unquotes `%20` and `%2B` in request paths to handle double-encoding by clients, so filenames with spaces work with `StaticFiles`.

21. **Batch stem splitting utility** — `api/batch_split.py`. CLI script to process all audio files in `songs/` through Demucs, skipping already-processed files. Uses CUDA by default.

22. **Re-encoding utility** — `api/reencode.py`. Parallel (4 workers) FFmpeg re-encoding of all MP3 stems to 128kbps.

### Stubbed / Incomplete / Planned

1. **Cloudflare R2 storage** — `api/services/storage_service.py`: `upload_file()` returns mock URL, `generate_presigned_url()` returns mock URL, `delete_files_prefix()` only prints. The `__init__` is a `pass`. boto3 is listed in requirements but never configured with real credentials in code.

2. **Cleanup scheduler** — `api/services/cleanup_service.py`: `cleanup_old_jobs()` has a docstring ("Deletes files older than 2 hours from local tmp and R2") but the body only logs. `start_cleanup_scheduler()` is defined but never called from `main.py`.

3. **Celery worker** — `api/workers/stem_worker.py` lines 1-2: Comment says "In a full implementation, this would be a celery task." The function body is `pass`.

4. **ytdlp_service.py wrapper** — `api/services/ytdlp_service.py`: `download_youtube_audio()` sleeps 2 seconds and returns a mock path. The actual YouTube download logic lives in `api/routes/youtube.py` directly.

5. **Redis integration** — `REDIS_URL` in `.env.example` but no code uses it.

6. **WebSocket progress updates** — The `ConnectionManager` exists but the frontend polls REST. No code sends updates via WebSocket during job processing.

7. **`expo-av`** — Listed as a dependency but not imported in any source file. Likely a leftover from an earlier implementation before the Tone.js WebView approach.

8. **`expo-sensors`** — Listed as a dependency but not imported anywhere.

9. **`expo-glass-effect`** — Listed as a dependency but not imported anywhere.

10. **Next.js / `web` workspace** — The root `.env.example` references `NEXT_PUBLIC_*` variables and `turbo.json` has `.next/**` build outputs, but no `apps/web/` directory exists. Only `apps/mobile/` exists.

## Key Modules / Files

### Backend (`api/`)

| Path | Purpose | Notes |
|------|---------|-------|
| `api/main.py` | FastAPI app entry point. Mounts static dirs, registers routers, serves `/audio-engine` HTML page, implements `/api/library` and `/api/health`, defines middleware for URL unquoting and cache headers. | 401 lines. Contains the full inline Tone.js audio engine HTML (lines 68-264) served at `/audio-engine`. Also contains hardcoded album track orderings. |
| `api/config.py` | Pydantic `Settings` class loading from `../.env` | Defines all backend config: R2 keys, `MAX_FILE_SIZE_MB`, `DEMUCS_MODEL`, `MOCK_MODE`, `ALLOWED_ORIGINS` |
| `api/models.py` | Pydantic request/response models | `Job`, `StemUrls`, `UploadResponse`, `YouTubeRequest`, `JobStatusResponse` |
| `api/jobs.py` | In-memory job store | Single line: `JOBS = {}`. All state is lost on restart. |
| `api/limiter.py` | Rate limiter singleton | `slowapi.Limiter` keyed by remote IP address |
| `api/routes/upload.py` | `POST /api/upload` — file upload handler | Validates MIME, size; saves to `tmp/`; runs Demucs in background |
| `api/routes/youtube.py` | `POST /api/youtube` — YouTube URL handler | Validates URL against YouTube domains; downloads via `yt-dlp`; runs Demucs in background |
| `api/routes/stems.py` | `GET /api/job/{job_id}`, `GET /api/stems/{job_id}` | Job status polling and stem URL retrieval |
| `api/routes/websocket.py` | `WebSocket /ws/job/{job_id}` | Connection manager; keeps connections alive but doesn't push updates |
| `api/services/demucs_service.py` | `run_demucs()` async function | Wraps `demucs` CLI with `asyncio.create_subprocess_exec`. Output to `tmp/stems/{job_id}/`. Uses CUDA. |
| `api/services/storage_service.py` | Cloudflare R2 storage abstraction | **Stubbed** — all methods return mocks |
| `api/services/cleanup_service.py` | Scheduled cleanup of old stems | **Stubbed** — scheduler defined but never started |
| `api/services/ytdlp_service.py` | yt-dlp wrapper | **Stubbed** — sleeps 2s and returns mock. Actual logic is in `routes/youtube.py` |
| `api/workers/stem_worker.py` | Background worker placeholder | **Stubbed** — `pass` body. Comment references Celery. |
| `api/batch_split.py` | Bulk stem separation script | CLI tool. Walks `songs/`, skips processed, runs Demucs per file. |
| `api/split_songs.py` | Targeted stem separation script | Hardcoded list of 3 Kanye West tracks. Contains a hardcoded Windows FFmpeg path. |
| `api/reencode.py` | Batch MP3 re-encoder | Uses `concurrent.futures.ThreadPoolExecutor` with 4 workers. Re-encodes to 128k via FFmpeg. |
| `api/static/tone.min.js` | Bundled Tone.js library | 349KB minified. Served at `/static/tone.min.js`. |

### Frontend (`apps/mobile/`)

| Path | Purpose | Notes |
|------|---------|-------|
| `apps/mobile/app/_layout.tsx` | Root layout with tab navigation | 3 visible tabs (Home, Player, Library) + hidden Processing tab. Loads IBM Plex Mono fonts. Fetches library on mount. |
| `apps/mobile/app/index.tsx` | Home screen | File upload via `expo-document-picker` and YouTube URL input. Navigates to `/processing`. |
| `apps/mobile/app/player.tsx` | Player screen — core mixing UI | 841 lines. Contains the puck rendering, LED logic, arm touch handlers, theme system, playback controls, progress scrubber, and the hidden `Puck3DWebView` mount. |
| `apps/mobile/app/processing.tsx` | Processing/waiting screen | Animated dots, fake progress interpolation, polls `GET /api/job/{job_id}` every 2s. Navigates to `/player` on completion. |
| `apps/mobile/app/library.tsx` | Library screen | Search, Songs/Albums tabs, track list with cover art, album grid view. |
| `apps/mobile/components/Puck3DWebView.tsx` | Audio engine — native platforms | Embeds Tone.js HTML in `react-native-webview`. Implements progressive streaming (original audio → stems crossfade). Communicates via `postMessage`/`onMessage`. |
| `apps/mobile/components/Puck3DWebView.web.tsx` | Audio engine — web platform | Platform-specific `.web.tsx` override. Loads Tone.js directly into DOM via `<script>` tag, instantiates `Tone.Players` natively without WebView. |
| `apps/mobile/components/StemSlider.tsx` | Slider component for stem volume | Uses `@react-native-community/slider`. Not currently used in the player (replaced by puck arm touch). |
| `apps/mobile/store/useAppStore.ts` | Zustand global state store | `Track` interface, `currentTrack`, `tracks[]`, `uploadingFile`, `youtubeUrl`, `isPlaying` |
| `apps/mobile/config.ts` | Backend URL resolution | Auto-detects API URL from Expo debugger host, `window.location`, or env var. Android emulator → `10.0.2.2` handling in `Puck3DWebView.tsx`. |

## Data Model

### Pydantic Models (Backend) — `api/models.py`

```python
class Job(BaseModel):
    id: str
    status: str          # "processing" | "completed" | "failed"
    progress: int = 0    # 0-100
    stage: str = "pending"

class StemUrls(BaseModel):
    vocals: str   # URL path to vocals.mp3
    drums: str    # URL path to drums.mp3
    bass: str     # URL path to bass.mp3
    other: str    # URL path to other.mp3

class UploadResponse(BaseModel):
    job_id: str
    status: str

class YouTubeRequest(BaseModel):
    url: str

class JobStatusResponse(BaseModel):
    status: str
    progress: int
    stage: str
    stems: Optional[StemUrls] = None
```

### In-Memory Job Store — `api/jobs.py`

```python
JOBS = {}  # Dict[str, dict] — keyed by job_id
```

Each job dict contains (assembled across `upload.py` and `youtube.py`):
```python
{
    "status": "processing" | "completed" | "failed",
    "progress": int,
    "file_url": str | None,
    "is_upload": bool,  # only for upload jobs
    "stage": str,       # set during processing
    "stems": {          # set on completion
        "vocals": str,
        "drums": str,
        "bass": str,
        "other": str,
    }
}
```

### TypeScript Interfaces (Frontend) — `apps/mobile/store/useAppStore.ts`

```typescript
interface Track {
  title: string;
  artist: string;
  album?: string;
  coverArt?: string;
  originalUrl: string;
  vocals: string;     // URL to vocals stem
  drums: string;      // URL to drums stem
  bass: string;       // URL to bass stem
  other: string;      // URL to other stem
}

interface AppState {
  currentTrack: Track | null;
  tracks: Track[];
  uploadingFile: { uri: string; name: string; type?: string } | null;
  youtubeUrl: string;
  isPlaying: boolean;
  // ... setters omitted
}
```

### Filesystem Data Layout

```
songs/
├── Album Covers/           # Cover art images (JPG/PNG) matched by album name
├── Albums/                 # Source audio files organized by album folder
│   └── <Album Name>/
│       └── <Artist> - <Title>.mp3
├── stems/
│   └── htdemucs_ft/        # Demucs output, organized by model name
│       └── <Album Name>/
│           └── <Track Name>/
│               ├── vocals.mp3
│               ├── drums.mp3
│               ├── bass.mp3
│               └── other.mp3
└── test_tone.html          # Manual test file for Tone.js URL encoding

api/tmp/                    # Temporary upload + processing directory
└── stems/
    └── <job_id>/
        └── htdemucs_ft/
            └── <track_name>/
                ├── vocals.mp3
                ├── drums.mp3
                ├── bass.mp3
                └── other.mp3
```

There is no database. All job state is held in an in-memory Python dict. Track library state is derived from filesystem walks at request time.

## APIs / Interfaces

### REST Endpoints

All REST endpoints are prefixed with `/api` except where noted.

#### `GET /api/health`
- **Response:** `{ "status": "ok", "mock_mode": bool }`
- **Source:** `api/main.py` line 61

#### `POST /api/upload`
- **Rate limit:** 5/minute per IP
- **Input:** `multipart/form-data` with field `file` (audio file)
- **Validation:** MIME type must start with `audio/`, extension must be `.mp3`/`.wav`/`.flac`/`.m4a`, Content-Length ≤ `MAX_FILE_SIZE_MB` MB
- **Response:** `UploadResponse { job_id: str, status: str }`
- **Source:** `api/routes/upload.py` line 36

#### `POST /api/youtube`
- **Rate limit:** 5/minute per IP
- **Input:** `{ "url": "<youtube_url>" }`
- **Validation:** URL must match YouTube domain regex
- **Response:** `UploadResponse { job_id: str, status: str }`
- **Source:** `api/routes/youtube.py` line 62

#### `GET /api/job/{job_id}`
- **Response:** `JobStatusResponse { status, progress, stage, stems? }`
- **Source:** `api/routes/stems.py` line 7

#### `GET /api/stems/{job_id}`
- **Response:** `StemUrls { vocals, drums, bass, other }` — only if job completed
- **HTTP 404** if job not found or not completed
- **Source:** `api/routes/stems.py` line 45

#### `GET /api/library`
- **Response:** `{ "tracks": Track[] }` — all tracks from `songs/` directory with stems resolved
- **Source:** `api/main.py` line 266

#### `GET /audio-engine`
- **Response:** Full HTML page with inline Tone.js audio engine (not under `/api` prefix)
- **Source:** `api/main.py` line 66

### WebSocket

#### `WS /ws/job/{job_id}`
- Accepts connection, stores in per-job list. Keeps alive by reading messages in loop.
- No server-push messages are currently sent during job processing.
- **Source:** `api/routes/websocket.py` line 34

### Static File Mounts

| Mount Path | Filesystem Path | Source |
|------------|----------------|--------|
| `/tmp`     | `api/tmp/`     | `api/main.py` line 46 |
| `/static`  | `api/static/`  | `api/main.py` line 49 |
| `/songs`   | `songs/` (repo root) | `api/main.py` line 53 (conditional) |

### WebView ↔ React Native Message Protocol

Messages are JSON strings sent via `postMessage`/`onMessage`:

**Parent → WebView (commands):**
- `{ type: "init", urls: { originalUrl, stems: { vocals, drums, bass, other } } }`
- `{ type: "play", isPlaying: boolean }`
- `{ type: "volume", stem: string, value: number }`
- `{ type: "seek", time: number }`

**WebView → Parent (events):**
- `{ type: "ready" }`
- `{ type: "loading", isLoading: boolean }`
- `{ type: "stemsLoaded", isLoaded: boolean }`
- `{ type: "timeUpdate", currentTime: number, duration: number }`
- `{ type: "log", msg: string }`

## Algorithms & Models

### Demucs `htdemucs_ft` — Stem Separation

- **What it does:** Separates a mixed audio track into 4 stems: vocals, drums, bass, other (instruments).
- **Model:** `htdemucs_ft` (Hybrid Transformer Demucs, fine-tuned). This is a model from Meta Research (Facebook AI).
- **Invocation:** CLI subprocess — `demucs --mp3 --mp3-bitrate 128 -d cuda -n htdemucs_ft <input_file> -o <output_dir>`. See `api/services/demucs_service.py` lines 14-21 and `api/batch_split.py` lines 54-61.
- **Hardware preference:** Code passes `-d cuda` (GPU acceleration). The README notes CPU processing takes "a few minutes per song" and requires ~4GB RAM.
- **Output format:** 4 MP3 files at 128kbps (controlled by `--mp3-bitrate 128`).
- **Training/tuning data:** Not determinable from this repo. The model is a pre-trained artifact from Meta's Demucs project.

### Volume-to-Stem Touch Mapping — `player.tsx`

The puck has 4 directional arms. Touch position on each arm maps to a 0-1 volume:
- **Vocals (top arm):** `pct = 1 - (locationY / armHeight)` — sliding up = louder
- **Drums (bottom arm):** `pct = locationY / armHeight` — sliding down = louder
- **Bass (left arm):** `pct = 1 - (locationX / armWidth)` — sliding left = louder
- **Other (right arm):** `pct = locationX / armWidth` — sliding right = louder

Clamped to `[0, 1]`. See `player.tsx` lines 153-173.

### LED Threshold Logic — `player.tsx`

4 LEDs per arm. LED at index `i` (0-3) lights when: `volume >= (i + 1) * 0.25 - 0.125`. This means LEDs light at volumes ≥ 0.125, 0.375, 0.625, 0.875. See `player.tsx` lines 187-194.

### Solo Logic

Long-press (350ms timeout) adds a stem to `soloingStems[]`. When `soloingStems.length > 0`, all non-soloing stems have their output volume forced to 0 via `getVolumeWithMaster()` (line 227). LEDs for non-soloing stems also turn off (line 189).

### Fake Progress Interpolation — `processing.tsx`

The processing screen shows a progress bar that slowly fills even when the backend reports no change, to give the user a sense of forward motion:
- Backend at 0% → fake crawls to 15%
- Backend at 20% → fake crawls to 35%
- Backend at 30% → fake crawls to 45%
- Backend at 50% → fake crawls to 95% (at 0.3% per second, ~4 minutes to fill)
- Backend at 100% → snaps to 100%

See `processing.tsx` lines 68-92.

### YouTube URL Validation — `youtube.py`

Two-phase: first checks `urllib.parse.urlparse` netloc against allowlist (`youtube.com`, `www.youtube.com`, `youtu.be`, `m.youtube.com`), then applies a regex to match standard YouTube URL patterns including `/watch?v=`, `/embed/`, `/v/`. See lines 19-31.

### Color Interpolation — `player.tsx`

`interpolateColor()` performs linear RGB interpolation between two hex colors. `hexToRgb()` parses hex to `{r, g, b}`. Used for LED glow gradients in themes. See lines 21-37.

### Curved Text Rendering — `player.tsx`

`CurvedText` component places each character of a string at positions along a circular arc. Characters are rotated to face outward or inward. Uses trigonometric positioning: `x = radius * cos(angle)`, `y = radius * sin(angle)`. Character spacing is 5° per character. See lines 39-81.

## Metrics & Performance

### Needs Measurement

- Stem separation time per song (CPU vs GPU) — README estimates "a few minutes" on CPU but no benchmarks in the repo
- Audio engine latency (Tone.js in WebView)
- Time update reporting interval is 100ms (`setInterval` in both `Puck3DWebView.tsx` line 190 and `main.py` line 217)
- MP3 stem file sizes at 128kbps
- Memory usage of Tone.js Players with 4 simultaneous buffers
- Rate limit: 5 uploads/minute per IP (configured in code, `api/routes/upload.py` line 37)
- Max upload size: 100MB default (`api/config.py` line 11)
- Stem auto-deletion: 2 hours (configured in `.env.example` as `STEM_DELETE_AFTER_HOURS=2` but cleanup service is stubbed)

## Setup & Environment

Source: root `README.md` and `apps/mobile/README.md`

### Prerequisites
- Python 3.12+
- FFmpeg (installed and on PATH)
- Node.js (version not specified in repo)
- npm 10.8.1 (specified in root `package.json` `packageManager`)
- CUDA-capable GPU (optional — code passes `-d cuda` to Demucs; will fall back to CPU if unavailable, though this fallback is not explicitly handled in the code)
- Demucs installed (`pip install demucs` — not in `requirements.txt`, must be installed separately)

### Backend Setup

```bash
cd api
pip install -r requirements.txt
# Also install demucs separately (not in requirements.txt):
# pip install demucs
uvicorn main:app --reload
# Defaults to http://localhost:8000
```

### Frontend Setup

```bash
cd apps/mobile
npm install
npx expo start
# Press 'w' for web, or scan QR for Expo Go
```

### Monorepo Scripts (root `package.json`)

| Script | Command | What it does |
|--------|---------|-------------|
| `dev` | `turbo run dev` | Runs all workspace dev servers |
| `dev:web` | `turbo run dev --filter=web` | Runs web workspace only (but no `apps/web` exists) |
| `dev:mobile` | `turbo run start --filter=mobile` | Starts Expo for mobile |
| `dev:api` | `cd api && uvicorn main:app --host 0.0.0.0 --port 8000 --reload` | Starts FastAPI server |
| `start` | `concurrently "npm run dev:api" "npm run dev:mobile"` | Runs API + mobile concurrently |
| `build` | `turbo run build` | Builds all workspaces |
| `lint` | `turbo run lint` | Lints all workspaces |
| `format` | `prettier --write "**/*.{ts,tsx,md}"` | Formats TS/MD files |

### Environment Configuration

Copy `.env.example` to `.env` at the repo root. For mobile, copy `apps/mobile/.env.example` to `apps/mobile/.env` and set `EXPO_PUBLIC_API_URL` to the backend's IP address.

The `config.ts` in the mobile app auto-detects the backend URL from Expo's debugger host when running via `npx expo start`, so the env var may not be needed during local development.

## Known Limitations / Tech Debt

1. **In-memory job storage** — `JOBS = {}` in `api/jobs.py`. All job state is lost on server restart. No persistence layer. This is a single-process, single-dict design that cannot scale horizontally.

2. **Stubbed storage service** — `api/services/storage_service.py` returns mock URLs. Cloudflare R2 integration is declared in config but never connected. Stems are served from local filesystem only.

3. **Stubbed cleanup service** — `api/services/cleanup_service.py` defines a scheduler but never starts it. `cleanup_old_jobs()` body only logs. Stems accumulate on disk indefinitely.

4. **Stubbed Celery worker** — `api/workers/stem_worker.py` is a placeholder. Processing uses `BackgroundTasks` (FastAPI's built-in) with `asyncio.run()` inside a sync function, which creates a new event loop per background job. This is functional but not production-grade.

5. **Demucs not in requirements.txt** — The `demucs` package and its dependencies (PyTorch, etc.) must be installed separately. This is not documented in `requirements.txt` and could surprise someone following the setup instructions.

6. **Hardcoded CUDA flag** — `demucs_service.py` and `batch_split.py` both pass `-d cuda`. No fallback to CPU if CUDA is unavailable. This will cause `demucs` to error on machines without NVIDIA GPUs unless the user overrides.

7. **Hardcoded Windows FFmpeg path** — `api/split_songs.py` line 5 has a hardcoded path: `C:\Users\win\AppData\Local\Microsoft\WinGet\...`. This is developer-machine-specific.

8. **Hardcoded album ordering** — `api/main.py` lines 370-383 contain hardcoded track orderings for "The Fall-Off" and "Vultures" albums. This is specific to the developer's testing data and not generalizable.

9. **Duplicate yt-dlp logic** — YouTube download is implemented twice: once in `api/routes/youtube.py` (working, in-process) and once in `api/services/ytdlp_service.py` (stubbed, mock).

10. **Unused dependencies** — `expo-av`, `expo-sensors`, `expo-glass-effect` are in `package.json` but never imported. `redis` URL is in env but no Redis client code exists.

11. **No tests** — No test files, no test configuration, no `pytest` or `jest` setup found anywhere in the repository.

12. **CORS set to `*`** — Default `ALLOWED_ORIGINS = "*"` accepts all origins. Appropriate for development but a security concern for production.

13. **WebSocket not used for progress** — `ConnectionManager` exists but the frontend polls REST every 2 seconds instead. The WebSocket infrastructure is wired but not used for its intended purpose.

14. **`StemSlider.tsx` component unused** — The component exists and renders a slider-based volume control, but the player screen uses the puck arm touch system instead.

15. **`NEXT_PUBLIC_WS_URL` env var unreferenced** — Defined in `.env.example` but no code reads it.

16. **`dev:web` script references non-existent workspace** — The root `package.json` has `"dev:web": "turbo run dev --filter=web"` but there is no `apps/web/` directory.

## Decisions & Trade-offs

1. **WebView-bridged Tone.js over native audio** — The audio engine runs inside a hidden 1×1px WebView/iframe to access the Web Audio API via Tone.js, rather than using React Native's native audio APIs (`expo-av`). This allows full DSP control (per-stem volume, seeking, looping) across all platforms using a single implementation. The trade-off is the complexity of the `postMessage` bridge and the fact that audio processing happens in a separate JS context. Visible in `Puck3DWebView.tsx` comments: "Lightweight HTML — Tone.js only, no Three.js, no WebGL". The `.web.tsx` variant eliminates the WebView entirely for web, loading Tone.js directly.

2. **Progressive streaming over wait-for-stems** — Rather than blocking until all 4 stems are loaded (which can take seconds on slow connections), the native WebView plays the original mix immediately via `<audio>` tag, then crossfades to stems when they're ready. This eliminates perceived loading time. This was a deliberate addition per commit `c7d1f76` ("progressive streaming engine").

3. **FastAPI BackgroundTasks over Celery** — Uses FastAPI's built-in `BackgroundTasks` with `asyncio.run()` instead of a proper task queue (Celery/Redis). Simpler setup at the cost of no retry logic, no distributed processing, and jobs lost on restart. The `stem_worker.py` placeholder suggests Celery was considered.

4. **In-memory dict over database** — `JOBS = {}` avoids database setup complexity. Sufficient for a single-user demo but clearly not production-ready.

5. **128kbps MP3 stems** — `--mp3-bitrate 128` reduces file size compared to WAV output. Acceptable quality for a mixing/preview tool. Both `demucs_service.py` and `batch_split.py` enforce this.

6. **Monorepo with Turborepo** — Despite only having one app (`apps/mobile/`), the project uses Turborepo workspaces. This suggests a planned multi-app structure (the `dev:web` script and `.next/**` build output in `turbo.json` hint at a planned Next.js web app).

7. **IBM Plex Mono typography** — The entire UI uses the IBM Plex Mono font family (5 weights loaded), matching the industrial/hardware aesthetic of the physical Stem Player device.

8. **2D puck over 3D** — Branch `3Dwork` exists, and the component is named `Puck3DWebView`, but the actual implementation is a 2D native React Native view with CSS shadows and borders to simulate depth. The "3D" was likely abandoned in favor of performance and simplicity.

9. **Expo SDK 54 (downgrade)** — Commit `a57855a` mentions "expo 54 downgrade", suggesting the project was initially on a newer Expo version that caused issues.

## Timeline

Source: `git log --all --reverse --format="%h %ad %s" --date=short`

| Date | Commit | Event |
|------|--------|-------|
| 2026-06-27 | `62c9b83` | **Initial commit** — project scaffolding |
| 2026-06-27 | `7d0a8ea`, `15745c7` | Early development (unnamed commits) |
| 2026-06-30 | `f39446f` | Continued development |
| 2026-07-01 | `6b92c55` | Continued development |
| 2026-07-02 | `e0f0c87`, `ac0b2d0` | Bug fixes phase |
| 2026-07-04 | `a57855a` | **Major milestone:** UI responsive fixes, Expo 54 downgrade, SAST security CI setup |
| 2026-07-04 | `57ca8d0` | Improved Tone.js handling |
| 2026-07-05 | `c7d1f76` | **Progressive streaming engine** — crossfade from original audio to stems |
| 2026-07-05 | `5c4e589` | **Latest commit:** Progressive streaming engine, UI enhancements, documentation updates |

**Total development span:** ~9 days (2026-06-27 to 2026-07-05). 14 commits across 4 branches (`main`, `3Dwork`, `feature/streaming-playback`, `work1`).

## Interview Talking Points

1. **"How did you handle audio playback across Web, iOS, and Android with a single codebase?"** — See Architecture section (WebView-bridged Tone.js pattern) and the `Puck3DWebView.tsx` / `Puck3DWebView.web.tsx` dual implementation. The `.web.tsx` platform extension is a key detail.

2. **"Walk me through how a YouTube URL becomes four individually-controllable audio stems."** — See the complete data flow in Architecture (steps 1-8), the YouTube validation in Algorithms (`youtube.py` lines 19-31), the Demucs invocation in Core Features #3, and the job polling in `processing.tsx`.

3. **"What would you change to make this production-ready?"** — See Known Limitations: in-memory job store (#1), stubbed storage (#2), stubbed cleanup (#3), no tests (#11), CORS wildcard (#12), hardcoded CUDA (#6). Also see Decisions & Trade-offs #3 (Celery) and #4 (database).

4. **"How does the progressive streaming work and why did you build it?"** — See Architecture (progressive streaming paragraph), Core Features #10, and Algorithms (Puck3DWebView.tsx lines 69-110 with the `streamPlayer.pause()` crossfade). Commit `c7d1f76` introduced this.

5. **"How does the puck UI translate touch position into per-stem volume?"** — See Algorithms (Volume-to-Stem Touch Mapping), LED Threshold Logic, and Solo Logic sections. The directional mapping (top=vocals, bottom=drums, left=bass, right=other) and 350ms solo timer are the key details.

## Confidence Notes

1. **Tone.js version:** Inferred as 14.8.49 from `songs/test_tone.html` which references `cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js`. The bundled `tone.min.js` (349KB) does not have a version header visible without parsing. The bundled file may be a different version — unconfirmed, verify manually.

2. **Expo SDK version discrepancy:** The `package.json` says `"expo": "~54.0.35"` but the README says "Expo SDK 51". The README appears outdated. The `package.json` is the ground truth. Also, `app.json` does not specify an `sdkVersion`.

3. **Demucs installation:** Demucs is not in `requirements.txt`. The README says `pip install -r requirements.txt` but doesn't mention installing Demucs separately. I'm inferring it must be installed because `demucs` is called as a CLI tool. It's possible the developer has it installed globally or in a virtualenv not tracked by the repo.

4. **CUDA fallback behavior:** The code always passes `-d cuda` to Demucs. I have not verified whether Demucs gracefully falls back to CPU or errors out when CUDA is unavailable. The README implies CPU is possible but the code does not implement a fallback.

5. **`apps/web` workspace:** The `turbo.json` build outputs include `.next/**` and root `package.json` has `"dev:web"`, suggesting a Next.js web frontend was planned or once existed. No `apps/web/` directory is present. It may have been deleted or never created. Unconfirmed.

6. **Redis usage:** `REDIS_URL` is in `.env.example` but I found no Redis client code in any Python file. It may have been intended for a future job queue implementation.

7. **`expo-av` removal timeline:** `expo-av` is in dependencies but unused. The `Puck3DWebView` approach likely replaced an earlier `expo-av`-based audio implementation. No code or git diff confirms this — inferred from the presence of the unused dependency.

8. **`nativewind` / Tailwind CSS usage:** `nativewind` and `tailwindcss` are installed, `tailwind.config.js` exists with custom colors, and `global.css` has Tailwind directives, but the actual component code uses `StyleSheet.create()` exclusively. NativeWind may have been set up and then abandoned in favor of manual styles.

9. **The `.env` file in `apps/mobile/`:** The `.env` file (not `.env.example`) is checked into the repo (not in `.gitignore` for that path), containing `EXPO_PUBLIC_API_URL=http://192.168.0.172:8000`. This is a developer's local IP. Not a security risk (no secrets) but indicates the `.gitignore` pattern doesn't cover nested `.env` files properly.
