# Admin setup

1. Copy `.env.admin.example` to `.env.admin.local` in the project root.
2. Set ADMIN_EMAIL and a unique ADMIN_PASSWORD of at least 12 characters. Keep this file private; never use VITE_ prefixes for credentials.
3. Run `npm run server` and `npm run dev` in separate terminals.
4. Open the footer Admin login link. Sign in and choose a product, select an image, preview it, and save.

Images persist in server/data/images.json. Back up this directory. Uploaded images are public product content; the write endpoints require a server session. Sessions expire after eight hours and reset on server restart. Login is rate limited.

Deployment requires a Node service with persistent disk, HTTPS, and a same-origin reverse proxy for /api. Set APP_ORIGIN to the exact public origin and keep the API bound behind the proxy. Static-only hosting cannot run this API. The local configuration does not enable self-registration or password resets.
