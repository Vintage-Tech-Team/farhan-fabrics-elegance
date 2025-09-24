# Farhan Fabrics Elegance

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

You can deploy using any static hosting for Vite builds (e.g., Vercel, Netlify, Cloudflare Pages). Run `npm run build` and upload the `dist` directory.

## Supabase database setup

1. Create a Supabase project and get `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Create a `./supabase` folder (included) with:
   - `migrations/001_init.sql`
   - `seeds/001_seed.sql`
3. Apply migration and seed using Supabase SQL editor or CLI:

Using SQL editor:

- Paste and run `migrations/001_init.sql`
- Then run `seeds/001_seed.sql`

Using Supabase CLI (optional):

```bash
supabase db reset --local # if using local dev
supabase db remote commit # or apply to remote if configured
```

4. Add env vars in `.env` at project root:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

The app uses `src/lib/supabaseClient.ts` and `src/lib/queries.ts` for data access, supporting pagination and sorting.
