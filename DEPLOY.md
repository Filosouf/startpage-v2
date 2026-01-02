# Deployment Guide

## GitHub Pages med GitHub Actions (Anbefalt)

Dette prosjektet er konfigurert med GitHub Actions for automatisk bygging og deploy.

### Hvordan det fungerer:

1. Når du pusher til `main` branch, trigger GitHub Actions
2. Actions bygger TypeScript-prosjektet (`npm run build`)
3. De kompilerte filene deployes automatisk til GitHub Pages
4. Siden er tilgjengelig på `https://YOUR_USERNAME.github.io/startpage-v2/`

### Setup:

1. Følg instruksjonene i `GITHUB_SETUP.md` for å opprette repository og pushe kode
2. Aktiver GitHub Pages i repository settings (se `GITHUB_SETUP.md`)
3. Velg "GitHub Actions" som source i Pages settings
4. Fra nå av vil hver push automatisk bygge og deploye

### Manuell deploy (alternativ):

Hvis du ikke vil bruke GitHub Actions, kan du committe `dist/` mappen:

1. Fjern `dist/` fra `.gitignore`
2. Kjør `npm run build`
3. Commit og push `dist/` mappen
4. Sett GitHub Pages til å deploye fra `main` branch, `/ (root)` folder

