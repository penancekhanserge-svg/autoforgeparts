# AutoForge Parts

React + Vite application using JavaScript and JSX with Tailwind CSS.

## Development

- `npm install` installs dependencies.
- `npm run dev` starts the local development server.
- `npm run build` creates the production build in dist.
- `npm run preview` previews the production build.
- `npm run lint` checks JavaScript and JSX.

## Included libraries

- React Router: page routing (connected in main.jsx).
- React Icons: icons (used on the starter page).
- Recharts: charts.
- EmailJS: browser email helper in src/lib/email.js.
- Zustand: shopping cart and other client state.
- TanStack Query and Axios: server data fetching.
- React Hook Form, Zod, and resolvers: forms and validation.
- React Hot Toast: notifications (connected in main.jsx).
- Motion: animations.
- clsx and tailwind-merge: class helpers in src/lib/utils.js.

The welcome page includes responsive navigation, local part search, category filters, a make/model/year finder, and a persistent cart with quantity controls. The catalog, compatibility information, and NGN prices are demonstration data. Checkout, live inventory, direct support, and payments are not connected. Chart, form, and animation packages are available for future features.

## Email setup

Copy .env.example to .env.local and add your EmailJS service ID, template ID, and public key. Match the parameters passed to sendContactEmail to your EmailJS template. Restart Vite after changing environment variables. No emails are sent by the starter.

VITE_ environment variables are public browser configuration. Never put private service keys in them.

## Structure

- src/components: shared UI and original SVG part illustrations
- src/pages: future store pages
- src/hooks: reusable hooks
- src/store: persistent cart state
- src/lib: integration and utility helpers
- src/assets: local assets

Tailwind uses its Vite plugin: https://tailwindcss.com/docs/installation/using-vite

## Storefront assets and checks

Hero photograph: https://images.unsplash.com/photo-1503376780353-7e6692767b70 (served locally from public/images/hero-car.jpg). Product images are stylized SVG illustrations, not photos of inventory.

Verified with build, ESLint, and headless Edge browser checks for desktop rendering, cart add/change/remove/persistence, search, vehicle matching, mobile navigation, horizontal overflow, and runtime errors.
