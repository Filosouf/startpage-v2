# GitHub Publisering og Brave Startside Setup

## Steg 1: Opprett GitHub Repository

1. Gå til [GitHub.com](https://github.com) og logg inn
2. Klikk på "+" i øvre høyre hjørne og velg "New repository"
3. Gi repositoryet et navn (f.eks. `startpage-v2`)
4. Velg "Public" (så GitHub Pages kan brukes gratis)
5. Ikke hukk av "Initialize with README" (vi har allerede filer)
6. Klikk "Create repository"

## Steg 2: Push til GitHub

Etter at du har opprettet repositoryet, kjør disse kommandoene i terminalen:

```bash
# Legg til remote repository (erstatt YOUR_USERNAME med ditt GitHub-brukernavn)
git remote add origin https://github.com/YOUR_USERNAME/startpage-v2.git

# Push til GitHub
git branch -M main
git push -u origin main
```

## Steg 3: Aktiver GitHub Pages

1. Gå til repositoryet på GitHub
2. Klikk på "Settings" (øverst til høyre)
3. Scroll ned til "Pages" i venstre meny
4. Under "Source", velg "Deploy from a branch"
5. Velg branch: `main`
6. Velg folder: `/ (root)`
7. Klikk "Save"
8. GitHub Pages vil nå publisere siden på: `https://YOUR_USERNAME.github.io/startpage-v2/`

**Merk:** Det kan ta noen minutter før siden er tilgjengelig første gang.

## Steg 4: Bygg og deploy

GitHub Pages trenger de kompilerte filene i `dist/` mappen. Du har to alternativer:

### Alternativ A: Commit dist/ mappen (Enklest)

Legg til `dist/` i git (fjern fra .gitignore midlertidig), commit og push:

```bash
# Fjern dist/ fra .gitignore midlertidig
# (Edit .gitignore og fjern linjen med dist/)

# Bygg prosjektet
npm run build

# Legg til dist/ mappen
git add dist/
git commit -m "Add built files for GitHub Pages"
git push
```

### Alternativ B: Bruk GitHub Actions (Anbefalt)

Se `DEPLOY.md` for instruksjoner om automatisk bygging og deploy.

## Steg 5: Sett opp som startside i Brave

1. Åpne Brave-nettleseren
2. Gå til `brave://settings/` (eller Settings → Appearance → Homepage)
3. Under "Homepage", velg "Open specific page or set of pages"
4. Klikk "Add a new page"
5. Skriv inn URL-en til GitHub Pages:
   ```
   https://YOUR_USERNAME.github.io/startpage-v2/
   ```
6. Klikk "Add"
7. Velg "Show homepage button" hvis du vil ha en hjem-knapp

**Alternativt - Bruk lokal fil (hvis du vil ha det lokalt):**

Hvis du foretrekker å kjøre det lokalt i stedet for GitHub Pages:

1. I Brave Settings, under "Homepage"
2. Velg "Open specific page or set of pages"
3. Klikk "Add a new page"
4. Skriv inn:
   ```
   http://localhost:8000
   ```
5. Start alltid en lokal server når du åpner nettleseren, eller sett opp automatisk oppstart

## Tips

- GitHub Pages vil automatisk oppdatere når du pusher nye endringer
- Hvis du bruker GitHub Actions, vil det bygge automatisk ved hver push
- Du kan også sette opp custom domain i GitHub Pages settings hvis du vil

