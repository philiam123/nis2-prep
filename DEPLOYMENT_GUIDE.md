# NIS2 Master — Deployment Guide (Vercel)

## Förutsättningar
- GitHub-konto (skapat ✅)
- Vercel-konto (skapat ✅)
- Domän: nis2utbildning.com (Namecheap)

---

## Steg 1: Skapa GitHub-repo

1. Gå till https://github.com/new
2. Namnge repot: `aigp-master`
3. Välj **Private**
4. Klicka **Create repository**
5. Du får en URL typ: `https://github.com/DITT-ANVÄNDARNAMN/aigp-master.git`

## Steg 2: Ladda upp koden till GitHub

Packa upp ZIP-filen och kör dessa kommandon i terminalen (Terminal/Git Bash):

```bash
cd aigp-master
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/aigp-master.git
git push -u origin main
```

Byt ut `DITT-ANVÄNDARNAMN` mot ditt GitHub-användarnamn.

## Steg 3: Koppla till Vercel

1. Gå till https://vercel.com/new
2. Klicka **Import Git Repository**
3. Välj ditt `aigp-master` repo
4. Vercel detekterar automatiskt inställningarna från `vercel.json`
5. Under **Environment Variables**, lägg till:
   - `SESSION_SECRET` = `aigp-study-secret-key-2026` (eller ett eget hemligt lösenord)
6. Klicka **Deploy**
7. Vänta tills deployen är klar — du får en `.vercel.app`-URL

## Steg 4: Koppla din domän (nis2utbildning.com)

### I Vercel:
1. Gå till ditt projekt → **Settings** → **Domains**
2. Lägg till: `nis2utbildning.com`
3. Vercel visar vilka DNS-records du behöver ställa in

### I Namecheap:
1. Logga in på Namecheap
2. Gå till **Domain List** → `nis2utbildning.com` → **Manage**
3. Under **DNS**, välj **Custom DNS** eller **Advanced DNS**
4. Lägg till dessa records (som Vercel visar):

| Type  | Host | Value              |
|-------|------|--------------------|
| A     | @    | 76.76.21.21        |
| CNAME | www  | cname.vercel-dns.com |

5. Om du har befintliga A-records, ta bort dem först
6. Vänta 5–30 min för DNS-propagering

## Steg 5: Verifiera

1. Gå till `https://nis2utbildning.com`
2. Testa registrering och inloggning
3. Testa admin-login: `admin@nis2.com` / `AigpAdmin2026!`

---

## Viktiga noteringar

### Databas (MemStorage)
Appen använder just nu **in-memory lagring**. Det betyder:
- Data nollställs varje gång servern startar om (Vercel's serverless cold starts)
- **För produktion** behöver du byta till PostgreSQL (t.ex. Vercel Postgres eller Neon)
- Se `server/storage.ts` — `MemStorage`-klassen behöver bytas mot en databas-implementation

### Betalning
- Betalningen är simulerad just nu (demo-läge)
- Integrera Stripe för riktiga betalningar — gå till Stripe Dashboard för API-nycklar

### Admin-konto
- Email: `admin@nis2.com`
- Lösenord: `AigpAdmin2026!`
- Byt lösenordet i `server/storage.ts` (seedAdmin-metoden) innan produktion

### Session Secret
- Ändra `SESSION_SECRET` i Vercel Environment Variables till något unikt och säkert
- Använd t.ex.: `openssl rand -base64 32` för att generera ett slumpmässigt värde

---

## Filer att känna till

| Fil | Beskrivning |
|-----|-------------|
| `vercel.json` | Vercel deployment-konfiguration |
| `api/index.ts` | Serverless API-funktion (alla /api/ routes) |
| `server/storage.ts` | Datalagring (byt till PostgreSQL för produktion) |
| `server/routes.ts` | API-routes (används av dev-servern) |
| `client/` | Frontend-koden (React + Vite) |
| `shared/schema.ts` | Datamodeller och validering |
| `vite.config.ts` | Vite build-konfiguration |
