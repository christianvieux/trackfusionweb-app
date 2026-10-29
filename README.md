# TrackFusionWeb App

[![CI](https://github.com/christianvieux/TrackFusion-Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/christianvieux/TrackFusion-Frontend/actions/workflows/ci.yml)

The web app for **TrackFusionWeb**, a music-sharing platform for uploading,
discovering, organizing, and analyzing tracks.

[Live app](https://www.trackfusionweb.com) ·
[Production API health](https://api.trackfusionweb.com/health) ·
[API repository](https://github.com/christianvieux/trackfusionweb-api)

These are the current production addresses for TrackFusionWeb. Local `.env`
changes do not change these hosted links.

## What the App does

- Provides account registration, sign-in, and profile management.
- Lets users upload, browse, play, edit, and favorite tracks.
- Displays BPM and musical-key analysis from the API.
- Manages the playback queue and shared track state.
- Connects browser uploads directly to private media storage through safe,
  time-limited links from the API.

## Technology at a glance

| Technology | Role in the project |
| --- | --- |
| Next.js and React | Build the website and its pages |
| HeroUI and Tailwind CSS | Provide accessible components and styling |
| Axios | Sends browser requests to the TrackFusionWeb API |
| Vitest and ESLint | Test the code and catch common problems |
| Vercel and GitHub Actions | Host, test, and deploy the App |

## Run it locally

> **Recommended:** run the TrackFusionWeb API with its Docker setup first. The
> App will open without it, but sign-in, tracks, uploads, and other connected
> features need the API.

> **About the URLs in this guide:** every local URL below is a default from
> [`.env.example`](.env.example). If you change a local port or URL, use your
> new value instead. The configuration table after step 5 shows exactly what
> to update.

### 1. Install the requirements

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) 20.9 or newer, which includes npm

### 2. Download the project

```bash
git clone https://github.com/christianvieux/TrackFusion-Frontend.git trackfusionweb-app
cd trackfusionweb-app
```

If you already downloaded the project, open a terminal in its folder and skip
this step.

### 3. Install the project packages

```bash
npm ci
```

This installs the exact package versions recorded by the project.

### 4. Create your local settings file

If an `.env` file already exists, keep it and skip this command.

```bash
cp .env.example .env
```

The example already matches the API's default Docker setup:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_IMAGE_REMOTE_ORIGINS=http://127.0.0.1:9000
```

Keep these defaults for the simplest setup. The `.env` file is for your
computer and must not be committed to Git.

### 5. Start and view the App

```bash
npm run dev
```

With the default settings, open
[http://localhost:3000](http://localhost:3000). Press `Ctrl+C` in the terminal
when you want to stop the development server.

## Local URLs and configuration

The addresses in this table assume `.env` still has its example values.

| Default local address | What it is for | Setting that changes it |
| --- | --- | --- |
| `http://localhost:3000` | Opens the App in a browser | The `npm run dev` port and `NEXT_PUBLIC_SITE_URL` |
| `http://localhost:8081` | API address called by the App | `NEXT_PUBLIC_API_URL` |
| `http://127.0.0.1:9000` | Allows images from local media storage | `NEXT_IMAGE_REMOTE_ORIGINS` |
| `http://127.0.0.1:8025` | Shows emails captured by the API setup | API `LOCAL_MAILPIT_UI_PORT` |

Keep these settings aligned when either project uses a custom port or URL:

| Connection | App setting | API setting |
| --- | --- | --- |
| App calls the API | `NEXT_PUBLIC_API_URL` | `LOCAL_API_PORT` |
| API accepts the App | `NEXT_PUBLIC_SITE_URL` and the App's actual browser address | `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, and `DEV_URLS` |
| App displays local media | `NEXT_IMAGE_REMOTE_ORIGINS` | `LOCAL_STORAGE_PORT` |

For example, if the API uses `LOCAL_API_PORT=8181`, set
`NEXT_PUBLIC_API_URL=http://localhost:8181` here. If you keep both projects at
their defaults, no coordination is needed.

The App port itself is not read from `.env`. To use port `3001`, run:

```bash
npm run dev -- --port 3001
```

Then set `NEXT_PUBLIC_SITE_URL=http://localhost:3001` and allow that same origin
in the API. Restart the App after changing `.env`.

## Common commands

Run these commands from the App folder.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development website on the default port `3000` |
| `npm run dev -- --port 3001` | Starts the development website on a custom port |
| `npm run lint` | Checks the code for common problems |
| `npm test` | Runs the automated tests once |
| `npm run build` | Creates a production-ready build |
| `npm run check` | Runs linting, tests, and the production build together |
| `npm start` | Serves an existing production build locally |

## Troubleshooting

### The App does not open

Read the terminal for the first error. If packages are missing or out of date,
run:

```bash
npm ci
npm run dev
```

If port `3000` is busy, use a custom port as shown above and update the connected
App and API settings.

### API requests fail

Open `/health` on the address in `NEXT_PUBLIC_API_URL`. With the default setup,
that is
[http://localhost:8081/health](http://localhost:8081/health).

If it does not return `{"status":"healthy"}`, start or troubleshoot the API.
If it is healthy, confirm that the App URL is allowed by the API's
`FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, or `DEV_URLS` setting.

Keep the default `localhost` host name for both the App and API unless you
intend to update their browser and cookie settings together.

### Images do not load

`NEXT_IMAGE_REMOTE_ORIGINS` must exactly match the beginning of the image URL,
including `http` or `https`, the host name, and any custom port. For the default
API storage, use `http://127.0.0.1:9000`, then restart the App.

### Environment changes do not appear

Stop and restart `npm run dev` after changing `.env` or `next.config.mjs`.
Production environment changes require a new Vercel build.

### Local account emails do not arrive

The API does not send real emails during local development. Open Mailpit using
the API's `LOCAL_MAILPIT_UI_PORT`. Its default address is
[http://127.0.0.1:8025](http://127.0.0.1:8025).

## How the local setup fits together

```text
Browser
   |
   v
TrackFusionWeb App ---- TrackFusionWeb API ---- PostgreSQL
                                  |\---------- Redis
                                  |\---------- Media storage
                                   \---------- Mailpit
```

The App shows the interface. The API owns accounts, tracks, private media
access, email, and saved data.

## Environment variables

> Values beginning with `NEXT_PUBLIC_` are included in browser code. They must
> never contain passwords, private keys, or other secrets.

| Variable | When to change it | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | When the API address changes | Exact API origin; do not add `/api` or another path |
| `NEXT_PUBLIC_SITE_URL` | When the App address changes | Exact public App origin used for links and page information |
| `NEXT_IMAGE_REMOTE_ORIGINS` | When media storage changes | Comma-separated origins that Next.js may load images from |
| `NEXT_PUBLIC_ALLOWED_IMAGE_TYPES` | Usually keep the default | Image types accepted by the upload interface |
| `NEXT_PUBLIC_ALLOWED_AUDIO_TYPES` | Usually keep the default | Audio types accepted by the upload interface |

An origin contains only the protocol, host name, and optional port—for example,
`http://localhost:8081`. Do not include a page path, query string, or trailing
bucket name.

## Tests and project checks

> This section is for contributors. You do not need these commands just to run
> and view the App.

```bash
npm run check
```

This one command runs all three project checks:

| Check | What it confirms |
| --- | --- |
| `npm run lint` | The code follows the project's quality rules |
| `npm test` | The automated behavior tests pass |
| `npm run build` | Next.js can create a production build |

GitHub Actions runs the same checks on pushes and pull requests.

## Advanced configuration and deployment

> Most contributors should keep the `.env.example` defaults. This section is
> only a high-level reference for production work.

Vercel hosts the production App from the `main` branch. Set these values in
Vercel, then rebuild the project:

```dotenv
NEXT_PUBLIC_API_URL=https://api.trackfusionweb.com
NEXT_PUBLIC_SITE_URL=https://www.trackfusionweb.com
NEXT_IMAGE_REMOTE_ORIGINS=https://s3.us-east-1.amazonaws.com
```

The storage origin must match the signed media URLs returned by the production
API. If the production domain or storage provider changes, update Vercel and the
matching API production settings. Changing a local `.env` file does not change
production.

The production API must allow the same App origin:

```dotenv
FRONTEND_URL=https://www.trackfusionweb.com
CORS_ALLOWED_ORIGINS=https://www.trackfusionweb.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
```

Leave `COOKIE_DOMAIN` unset. Authenticated preview deployments need their exact
preview origin added to the API; avoid broad wildcard access.

## Security highlights

- Browser code never contains cloud credentials or API secrets.
- Sign-in uses HTTP-only cookies managed by the API.
- Private uploads use short-lived, user-specific storage links.
- Remote image sources are restricted to configured origins.
- Production uses HTTPS and security headers.
