# personal-website-admin

Admin panel for `../personal-website`. Edit profile, apps, experience, skills, services and process
steps, upload screenshots, and read contact-form messages.

## Run

Start the site first, then the admin:

```bash
cd ../personal-website && npm run dev           # http://localhost:3000
cd ../personal-website-admin && npm run dev     # http://localhost:3001
```

## `.env.local`

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Password for signing in. Change it. |
| `SESSION_SECRET` | Signs the session cookie. |
| `SITE_URL` | Site URL the admin's server calls (API). |
| `NEXT_PUBLIC_SITE_URL` | Site URL used in the browser (links, image previews). |
| `ADMIN_API_KEY` | Must equal `ADMIN_API_KEY` in the site's `.env.local`. |

## How it works

The admin stores no data. Server actions (`app/actions.ts`) call the site API through
`lib/api.ts`, so the API key never reaches the browser. Image uploads go to `app/api/upload`, which
forwards them to the site. `proxy.ts` sends anyone who isn't signed in to `/login`.

`lib/schema.ts` and `lib/types.ts` are copies of the site's files. If you add a field, update both.
