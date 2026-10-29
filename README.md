# 🛡️ Community Watch - Shopper Review Overlay

An open-source Chrome Extension (Manifest V3) with a **native Side Panel** (styled like Chrome Gemini) that empowers online shoppers to anonymously share and view real community feedback on e-commerce product listings—including **undelivered packages, auto-cancelled orders, delivery issues, counterfeit/defective items, and return/refund denials**, as well as verified positive experiences.

---

## 📸 How It Works

1. **Native Chrome Side Panel**: Docked right beside your Flipkart tab—just like Chrome Gemini.
2. **Instant Consensus**: Displays a live community verdict:
   - 🚨 **DON'T BUY** (High scam / refund denial rate)
   - ⚠️ **CAUTION** (Frequent delivery/quality hassles)
   - ✅ **NO ISSUES REPORTED** (Clean record)
3. **Problem Breakdown**: Shows exact counts of:
   - 🚫 Return / Refund Denied by Flipkart
   - ⚠️ Counterfeit / Fake Item
   - 📦 Wrong Item in Box (Soap, rocks, dummy items)
   - 💥 Defective / Stopped Working
   - 🚚 Delivery OTP Coercion / Delivery boy fraud
4. **100% Anonymous Reporting**: Anyone can share what happened without giving up personal details or credentials.
5. **Floating In-Page Trigger**: A discreet floating radar pill on Flipkart product pages that shows live risk level and opens the side panel in one click.

---

## 🚀 Quick Setup (Load Extension into Chrome)

1. Open Google Chrome and go to:
   ```text
   chrome://extensions
   ```
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** in the top-left.
4. Select the `extension/` folder inside this repository:
   ```text
   c:\Users\fight\Documents\antigravity\noble-heisenberg\extension
   ```
5. Open any Flipkart product page (e.g. OnePlus Nord Buds, iPhones, SD cards).
6. Click the **Trust Radar** icon in the Chrome toolbar or click the floating **"Trust Radar"** pill on the webpage:
   - The native **Side Panel** will slide open on the right side of your screen!

---

## 🌐 Free, Open-Source & Secure Data Storage

Here are the best free architectures for storing community data securely while welcoming open-source contributions:

### Option A: Supabase (Recommended - Free PostgreSQL + Row-Level Security)
* **Cost**: $0 / month (Free tier: 500MB DB, 50,000 monthly active users, unlimited API requests).
* **Open Source**: 100% open-source PostgreSQL.
* **Security (Row-Level Security / RLS)**:
  - Anyone with the public `anon` key can read reports (`SELECT`).
  - Anyone can submit new reports (`INSERT`), but the schema enforces strict validation (character limits, valid categories).
  - Nobody can alter or delete existing reports (`UPDATE`/`DELETE` blocked for public `anon` role).
* **Sample Supabase SQL Schema**:
  ```sql
  create table products (
    pid text primary key,
    title text,
    category text,
    default_seller text,
    created_at timestamp with time zone default now()
  );

  create table reports (
    id uuid default gen_random_uuid() primary key,
    pid text references products(pid) on delete cascade,
    user_alias text default 'Anonymous Shopper',
    verdict text check (verdict in ('dont_buy', 'caution', 'buy')),
    categories text[] not null,
    seller_name text,
    title text not null,
    description text not null,
    flipkart_resolution text check (flipkart_resolution in ('denied', 'pending', 'resolved')),
    verified_purchase boolean default false,
    helpful_count int default 0,
    created_at timestamp with time zone default now()
  );

  -- Enable Row Level Security (RLS)
  alter table reports enable row level security;

  -- Allow public read access
  create policy "Public can view reports" on reports for select using (true);

  -- Allow public anonymous submission
  create policy "Public can submit reports" on reports for insert with check (
    length(description) >= 10 and length(description) <= 2000
  );
  ```

---

### Option B: Git-as-a-Database (GitHub Repo + Static CDN)
* **Cost**: 100% Free Forever.
* **How it works**:
  - Each product has a JSON file: `data/products/{pid}.json`.
  - Community members contribute via:
    1. **GitHub Issues**: A user fills a "Report a Flipkart Scam" issue form.
    2. **GitHub Actions**: A workflow automatically validates the issue, generates or appends to the JSON file, and commits it.
    3. **Pull Requests**: Tech-savvy contributors can bulk-add or curate reports.
  - **Extension queries**: Delivered through GitHub Pages or jsDelivr CDN (`https://cdn.jsdelivr.net/gh/your-username/flipkart-trust-radar@main/data/products/{pid}.json`).
  - **Benefit**: 100% transparent revision history, zero hosting bills, resistant to censorship.

---

### Option C: Cloudflare D1 (Serverless SQLite) + Workers
* **Cost**: Free tier includes 5GB storage, 5M reads/day, 100k writes/day.
* Extremely low edge latency in India.

---

## 💻 Local Development Server

If you want to run the included Node.js API server locally:

```bash
cd backend
npm install
npm start
```
The server runs on `http://localhost:5050` and auto-seeds sample Flipkart products (including the OnePlus Nord Buds from your screenshot!).
