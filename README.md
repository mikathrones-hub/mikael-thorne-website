# Mikael Thorne Website

A React + Vite + Supabase starter for the Mikael Thorne author site.

## Supabase configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://skjfhwvzwplvuzdruqza.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Do **not** put a Supabase secret/service-role key in this project.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints.

## Current foundation

- Dark literary/horror visual system
- Home, Books, Stories, Story Reader, Journal, About
- Supabase email/password login
- Archive Desk admin shell
- Admin profile/permission check
- Supabase client ready for the existing database schema
- Responsive layout

## Next build stage

Connect the Archive Desk to the existing Supabase tables so Mikael can:
- create/edit/publish/archive stories
- manage books/projects
- write journal posts
- moderate reader comments
- change site settings

The demo story/book cards are intentionally placeholders and should be replaced by database content.
