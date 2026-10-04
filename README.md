# musfiraai-tools-backend

## 1. Supabase — run the migration
Supabase dashboard → SQL Editor → New query → paste contents of
`supabase/migrations/0001_create_tool_requests.sql` → Run.

## 2. Get your service_role key (secret, backend-only)
Supabase → Settings → API Keys → copy **service_role** key
(different from the anon key you already sent me — never put this one in the HTML/frontend).

## 3. Push this folder to GitHub
```
cd musfiraai-tools-backend
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/musfiraai-tools-backend.git
git push -u origin main
```

## 4. Deploy to Vercel
- Vercel dashboard → Add New Project → Import the GitHub repo you just pushed
- Environment Variables (Vercel project → Settings → Environment Variables):
  - `SUPABASE_URL` = `https://vfumvywhiwrgmankfqbg.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY` = (from step 2)
  - `ALLOWED_ORIGIN` = `https://musfiraai.com` (your live domain)
- Deploy. Your endpoint will be: `https://YOUR-PROJECT.vercel.app/api/request-tool`

## 5. Wire up the HTML
Open `frontend-snippet.html`, replace `YOUR-VERCEL-PROJECT` in the `API_URL` line
with your real Vercel URL, then paste the whole snippet into `musfiraai05__2_.html`
wherever you want it to appear.

## 6. Use the CLI (locally, to manage requests)
```
cd musfiraai-tools-backend
npm install
cp .env.example .env
# edit .env: put SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (real service_role key)

node cli/index.js list                  # pending requests
node cli/index.js view <id>              # full details
node cli/index.js status <id> done       # mark as done
node cli/index.js stats                  # counts per status
```

<!-- BRANDING:START -->

---

🌐 Website: [musfiraai.com](https://musfiraai.com/)

* ▶️ YouTube: [Automate With Musfira AI](https://www.youtube.com/@automatewithmusfiraai)
* 💼 LinkedIn: [Musfira AI](https://www.linkedin.com/in/musfira-ai-b3218b39b)
* 📸 Instagram: [@musma_n55](https://instagram.com/musma_n55)

<!-- BRANDING:END -->
