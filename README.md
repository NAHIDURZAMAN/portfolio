# Nahidur Zaman Tushar — Portfolio

A fully admin-editable portfolio with image uploads, built with React + Vite + Supabase.

## Stack
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (images)
- **Deployment:** Vercel

---

## 🚀 Setup (One Time)

### 1. Run the Database Schema
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/falcytynddxihujenoxe)
2. Click **SQL Editor** → **New Query**
3. Paste the full contents of `supabase_schema.sql`
4. Click **Run**

### 2. Install dependencies
```bash
npm install
```

### 3. Set environment variables
```bash
cp .env.example .env
# Edit .env and fill in your Supabase keys
```

### 4. Run locally
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel

1. Push to GitHub:
```bash
git init
git remote add origin git@github.com:NAHIDURZAMAN/portfolio.git
git add .
git commit -m "Initial portfolio"
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → Import your GitHub repo

3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_SERVICE_KEY`

4. Deploy! 🎉

---

---

## 📸 Image Support
Upload images for:
- **Profile photo** (hero section)
- **Project screenshots** (projects section)
- **Certificate images** (certifications — click to zoom)
- **Gallery** (events, achievements, team photos — with categories)

Max file size: 5MB. Stored in Supabase Storage.
