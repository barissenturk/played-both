# played-both — Vercel deploy
#
# 1. Bu klasörü (frontend) GitHub'a bağla → Vercel Import
#    Repo: https://github.com/barissenturk/played-both
# 2. Root Directory: . (repo root = frontend)
# 3. Environment Variable:
#      VITE_API_URL=https://YOUR_API.up.railway.app
# 4. Deploy → site URL'ini Railway CORS_ORIGIN'e yaz
#
# Local (API ayrı terminalde :3000'de çalışmalı):
#   npm install
#   npm run dev        → http://localhost:5173
#   (Vite /api proxy → localhost:3000)
