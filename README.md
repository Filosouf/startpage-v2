# Startpage v2 - Komponentbasert med TypeScript

Dette er en komponentbasert versjon av startsiden hvor hvert vindu er en uavhengig komponent som kan flyttes rundt på skjermen.

## Funksjoner

- **Modulær arkitektur**: Hvert vindu er en egen komponent
- **Drag-and-drop**: Alle vinduer kan flyttes rundt på skjermen
- **Resize**: Noen vinduer kan endres i størrelse (LinksComponent og MealPlanComponent)
- **Persistent posisjonering**: Vinduposisjoner lagres i localStorage
- **Persistent størrelser**: Resize-størrelser lagres i localStorage
- **TypeScript**: Type-safe kode
- **Enkelt å utvide**: Legg til nye komponenter ved å arve fra Component-klassen

## Komponenter

- **WeatherComponent**: Væropplysninger for Bergen
- **LinksComponent**: Hovedvinduet med lenker
- **ClockComponent**: Klokke
- **MealPlanComponent**: Matplan og kostholdsoppfølging

## Oppsett

### Forutsetninger

Du trenger Node.js og npm installert. Hvis du ikke har det:

**macOS (med Homebrew):**
```bash
brew install node
```

**Eller last ned direkte:**
- Gå til [nodejs.org](https://nodejs.org/) og last ned LTS-versjonen
- Installer den ved å følge instruksjonene

**Verifiser installasjon:**
```bash
node --version
npm --version
```

### Installasjon og bygging

1. Naviger til prosjektmappen:
```bash
cd startpage-v2
```

2. Installer dependencies:
```bash
npm install
```

3. Kompiler TypeScript:
```bash
npm run build
```

Eller for å kompilere med watch mode (automatisk rekompilering ved endringer):
```bash
npm run watch
```

4. Start en lokal HTTP-server (kreves fordi prosjektet bruker ES-moduler):

**Med Python 3:**
```bash
python3 -m http.server 8000
```

**Eller med Node.js (hvis du har http-server installert):**
```bash
npx http-server -p 8000
```

5. Åpne nettleseren og gå til:
```
http://localhost:8000
```

**Merk:** Du må kjøre `npm run build` hver gang du gjør endringer i TypeScript-filene for at endringene skal vises. Du kan også kjøre `npm run watch` for automatisk rekompilering.

## Legge til nye komponenter

1. Opprett en ny fil i `src/components/` som arver fra `Component`:

```typescript
import { Component } from './base/Component';
import { ComponentConfig } from '../types';

export class MyNewComponent extends Component {
  constructor(config?: Partial<ComponentConfig>) {
    super({
      id: 'my-new-component',
      position: config?.position || { x: 100, y: 100 },
      size: config?.size || { width: 300, height: 200 },
      draggable: config?.draggable ?? true,
      resizable: config?.resizable ?? false,
      ...config
    });
  }

  render(): string {
    return `<div class="my-component">Innhold her</div>`;
  }
}
```

2. Registrer komponenten i `src/app.ts`:

```typescript
import { MyNewComponent } from './components/MyNewComponent';

// I init() metoden:
const myComponent = new MyNewComponent();
this.components.push(myComponent);
const div = document.createElement('div');
this.container.appendChild(div);
myComponent.mount(div);
this.windowManager.registerComponent(myComponent);
```

## Struktur

```
startpage-v2/
├── src/
│   ├── components/
│   │   ├── base/
│   │   │   └── Component.ts          # Base klasse
│   │   ├── WeatherComponent.ts
│   │   ├── LinksComponent.ts
│   │   ├── ClockComponent.ts
│   │   └── MealPlanComponent.ts
│   ├── managers/
│   │   └── WindowManager.ts          # Drag-and-drop manager
│   ├── utils/
│   │   └── storage.ts                # localStorage utilities
│   ├── app.ts                         # Hovedapplikasjon
│   └── types.ts                       # TypeScript typer
├── dist/                              # Kompilerte JavaScript filer
├── resources/                         # Bilder og font
├── index.html
├── main.css
├── tsconfig.json
└── package.json
```

## Notater

- Vinduposisjoner lagres automatisk i localStorage
- Resize-størrelser lagres automatisk i localStorage (for resizable komponenter)
- Komponenter kan være draggable eller ikke (konfigurerbart)
- Komponenter kan være resizable eller ikke (konfigurerbart)
- Alle komponenter arver fra base Component-klassen
- WindowManager håndterer drag-and-drop, resize og posisjonering
