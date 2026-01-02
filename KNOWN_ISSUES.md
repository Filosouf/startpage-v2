# Known Issues

Dette dokumentet beskriver kjente bugs og problemer i prosjektet.

## LinksComponent "Hopping" Bug

### Beskrivelse
LinksComponent kan "hoppe" eller flytte seg uventet når brukeren prøver å dra den, spesielt når man klikker på header-området (`.titlediv` eller `.windowbackgroundarea1`).

### Symptomer
- Komponenten hopper til en annen posisjon når man starter drag
- Offset-beregningen ser ut til å være feil når man klikker på header-elementer
- Komponenten kan "snappe" til en annen posisjon ved drag-start

### Mulige årsaker
1. **Offset-beregning**: Når man klikker på absolutte posisjonerte elementer (som `.titlediv`, `.windowbackgroundarea1`) inne i komponenten, beregnes `dragOffset` fra ytre elementets `getBoundingClientRect()`, men klikket skjer på et indre element med egen absolut posisjon.

2. **Kompleks CSS-struktur**: LinksComponent har en kompleks nested struktur med:
   - `.component-window` (yterste element, fixed position)
   - `.window-bg` (relative position når inne i component-window)
   - `.titlediv`, `.windowbackgroundarea1`, `.windowbackgroundarea2` (absolute position)

3. **Event bubbling**: Klikk-eventet kan trigger på et indre element, men offset beregnes fra ytre element.

### Gjeldende løsning
Problemet er delvis løst ved å endre CSS fra `position: inherit` til `position: absolute` for indre elementer, men buggen kan fortsatt oppstå i visse situasjoner.

### Mulige løsninger (ikke implementert)

#### Løsning 1: Normaliser offset-beregning
Modifiser `WindowManager.startDrag()` til å normalisere offset basert på hvor i komponenten klikket skjedde:

```typescript
private startDrag(e: MouseEvent, component: Component): void {
  // ... eksisterende kode ...
  
  const element = component.getElement();
  const rect = element.getBoundingClientRect();
  
  // Bruk mouse position direkte i stedet for å beregne fra rect
  this.dragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  
  // Alternativ: Bruk pageX/pageY for mer konsistent beregning
  // this.dragOffset = {
  //   x: e.pageX - rect.left - window.scrollX,
  //   y: e.pageY - rect.top - window.scrollY
  // };
}
```

#### Løsning 2: Forhindre drag på header-elementer
Legg til spesielle event handlers for header-elementer som håndterer drag annerledes:

```typescript
// I WindowManager.startDrag()
const target = e.target as HTMLElement;
if (target.closest('.titlediv') || target.closest('.windowbackgroundarea1')) {
  // Bruk en annen offset-beregning for header-elementer
  // eller forhindre drag helt fra header
}
```

#### Løsning 3: Refaktorer CSS-strukturen
Forenkling av CSS-strukturen ved å bruke mer konvensjonelle layout-metoder (flexbox/grid) i stedet for kompleks absolute positioning.

#### Løsning 4: Bruk pointer-events
Legg til `pointer-events: none` på indre elementer under drag, eller bruk en overlay for drag-håndtering.

### Status
**Åpen** - Buggen eksisterer, men påvirker ikke kritisk funksjonalitet. Komponenten fungerer, men kan oppleves som litt "glitchy" når man drar den.

### Reproduksjon
1. Last siden
2. Prøv å dra LinksComponent ved å klikke på header-området (tittelen eller subtitle-området)
3. Observer at komponenten kan hoppe til en annen posisjon ved drag-start

### Arbeidsomgåelse
- Dra komponenten fra områder utenfor header-elementene (f.eks. fra hovedinnholdet eller kantene)
- Eller bruk localStorage for å lagre posisjon og justere manuelt hvis nødvendig

