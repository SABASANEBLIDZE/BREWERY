1. Create or open your Supabase project.
2. In the Supabase SQL editor, run [`supabase-schema.sql`](./supabase-schema.sql).
3. Open [`supabase-config.js`](./supabase-config.js) and replace:
   - `https://YOUR_PROJECT_ID.supabase.co`
   - `YOUR_SUPABASE_ANON_KEY`
4. Deploy the updated static files.

Notes:
- New reservations are written to the shared `reservations` table.
- `admin.html` reads from the same shared table, so reservations sync across devices.
- Any old browser-local reservations are migrated once from `localStorage` into Supabase when a configured page loads on that original device.
- The current admin password gate is still client-side only. For true admin security, add real authentication or server-side checks before exposing status updates/deletes publicly.
