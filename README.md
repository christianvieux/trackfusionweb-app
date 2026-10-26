# TrackFusionWeb Frontend

TrackFusionWeb is a responsive music-sharing application for uploading, discovering, playing, analyzing, favoriting, and sharing audio tracks. This repository contains the Next.js frontend for [trackfusionweb.com](https://trackfusionweb.com); the Express API is maintained in the separate [TrackFusion-Backend](https://github.com/christianvieux/TrackFusion-Backend) repository.

## Architecture

- Next.js 16 App Router and React 19
- HeroUI components with Tailwind CSS 4
- Axios API client with credentialed cookie authentication
- Direct browser uploads through API-issued Amazon S3 presigned URLs
- Client contexts for session, favorites, playback, queue, and track state
- Vercel hosting, with the browser calling `https://api.trackfusionweb.com` directly

No cloud credentials or backend secrets belong in this repository. Values prefixed with `NEXT_PUBLIC_` are embedded in the browser bundle and must be treated as public configuration.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The frontend runs at [http://localhost:3001](http://localhost:3001). The default local API URL is `http://localhost:3000`, which matches the backend’s default port.

### Environment variables

| Variable                            | Required                   | Purpose                                                                                                               |
| ----------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`               | Production                 | Absolute backend origin; use `https://api.trackfusionweb.com` in Vercel. Do not add `/api`.                           |
| `NEXT_PUBLIC_SITE_URL`              | Recommended                | Canonical frontend origin used for metadata and share links. Production defaults to `https://trackfusionweb.com`.     |
| `NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS` | When API images are remote | Comma-separated hostnames permitted by Next.js image optimization. Include every S3/CDN hostname returned by the API. |
| `NEXT_PUBLIC_ALLOWED_IMAGE_TYPES`   | Optional                   | Comma-separated upload MIME types; built-in defaults cover JPEG, PNG, WebP, HEIC, and HEIF.                           |
| `NEXT_PUBLIC_ALLOWED_AUDIO_TYPES`   | Optional                   | Comma-separated upload MIME types; built-in defaults cover MP3, WAV, OGG, M4A, and AAC.                               |

Restart the development server after changing `.env.local`. Vercel must rebuild the application after a public environment variable changes.

## Quality checks

```bash
npm run lint
npm test
npm run build
```

`npm run check` runs all three checks. A GitHub Actions workflow applies the same gate to pull requests and pushes to `main`.

## Production deployment

Connect this repository to Vercel and select `main` as the production branch. Vercel detects Next.js automatically; no custom build command or separate deployment infrastructure is required.

Set these production values in Vercel before the first deployment:

```text
NEXT_PUBLIC_API_URL=https://api.trackfusionweb.com
NEXT_PUBLIC_SITE_URL=https://trackfusionweb.com
NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS=<comma-separated API image hostnames>
```

The backend must also allow the production frontend origin and generate reset links for it. In the backend environment, verify:

```text
FRONTEND_URL=https://trackfusionweb.com
CORS_ALLOWED_ORIGINS=https://trackfusionweb.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
```

Leave `COOKIE_DOMAIN` unset. `lax` is sufficient for the same-site `trackfusionweb.com` and `api.trackfusionweb.com` production origins. Authenticated Vercel preview deployments use a cross-site `vercel.app` origin and require both that exact preview origin in CORS and `COOKIE_SAME_SITE=none`; use that broader setting only if preview authentication is needed.

After deployment, manually verify login/session/logout, password reset links, track and profile-image uploads, audio analysis, playback, favorites, and remote image rendering against the production API.
