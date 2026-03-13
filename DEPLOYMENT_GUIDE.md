# NIS2 Master — Deployment Guide (Vercel)

## Förutsättningar
- GitHub-konto (ska pushas till repo)
- Vercel-konto (gratis tier okä)
- PostgreSQL-databas (Supabase, Neon eller Vercel Postgres)

## 1. Miljövariabler

Skapa en `.env`-fil lokalt (kopiera från `.env.example`):

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 2. Stripe-konfiguration

1. Skapa ett Stripe-konto på stripe.com
2. Aktivera testläge (Test mode)
3. Skapa en produkt: "NIS2 Prep Access" med pris 997 SEK (engångsbetalning)
4. Kopiera Price ID (price_xxxx) - behövs i `server/routes.ts`
5. Konfigurera webhook:
   - URL: `https://your-domain.vercel.app/api/webhook`
   - Händelser: `checkout.session.completed`

## 3. Databasinställning

```sql
-- Kör migrate.sql mot din PostgreSQL-databas
psql $DATABASE_URL < migrate.sql
```

## 4. Vercel Deploy

```bash
# Installera Vercel CLI
npm i -g vercel

# Logga in
vercel login

# Deploy (första gången)
vercel

# Produktionsdeploy
vercel --prod
```

### Miljövariabler i Vercel
Gå till Vercel Dashboard → Settings → Environment Variables och lägg till alla variabler från .env.

## 5. Anpassning

### Ändra pris
I `server/routes.ts`, uppdatera `unit_amount` i Stripe checkout session.

### Ändra frågor/innehåll
- Studie-innehåll: `domain-data-raw.js` → importeras till `client/src/data/domains.ts`
- Quizfrågor: `quiz-questions-raw.js` → importeras till `client/src/data/questions.ts`

## 6. Admin-konto

Efter deploy, lägg till admin direkt i databasen:
```sql
UPDATE users SET is_admin = true WHERE email = 'philip.nilsson@electrab.se';
```

---
*Byggt med React + Express + PostgreSQL + Stripe + Vercel*
