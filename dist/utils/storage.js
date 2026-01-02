const STORAGE_KEY_POSITIONS = 'startpage_component_positions';
const STORAGE_KEY_SIZES = 'startpage_component_sizes';
/**
 * Lagrer posisjonen til en komponent i localStorage
 */
export function saveComponentPosition(id, position) {
    const positions = loadAllPositions();
    positions[id] = position;
    localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(positions));
}
/**
 * Henter lagret posisjon for en komponent
 */
export function loadComponentPosition(id) {
    const positions = loadAllPositions();
    return positions[id] || null;
}
/**
 * Henter alle lagrede posisjoner
 */
export function loadAllPositions() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_POSITIONS);
        if (stored) {
            return JSON.parse(stored);
        }
    }
    catch (error) {
        console.error('Feil ved lesing av localStorage:', error);
    }
    return {};
}
/**
 * Lagrer alle posisjoner
 */
export function saveAllPositions(positions) {
    try {
        localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(positions));
    }
    catch (error) {
        console.error('Feil ved lagring til localStorage:', error);
    }
}
/**
 * Sletter posisjon for en komponent
 */
export function clearComponentPosition(id) {
    const positions = loadAllPositions();
    delete positions[id];
    localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(positions));
}
/**
 * Sletter alle lagrede posisjoner
 */
export function clearAllPositions() {
    localStorage.removeItem(STORAGE_KEY_POSITIONS);
}
/**
 * Lagrer størrelsen til en komponent i localStorage
 */
export function saveComponentSize(id, size) {
    const sizes = loadAllSizes();
    sizes[id] = size;
    localStorage.setItem(STORAGE_KEY_SIZES, JSON.stringify(sizes));
}
/**
 * Henter lagret størrelse for en komponent
 */
export function loadComponentSize(id) {
    const sizes = loadAllSizes();
    return sizes[id] || null;
}
/**
 * Henter alle lagrede størrelser
 */
export function loadAllSizes() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SIZES);
        if (stored) {
            return JSON.parse(stored);
        }
    }
    catch (error) {
        console.error('Feil ved lesing av localStorage (sizes):', error);
    }
    return {};
}
/**
 * Lagrer alle størrelser
 */
export function saveAllSizes(sizes) {
    try {
        localStorage.setItem(STORAGE_KEY_SIZES, JSON.stringify(sizes));
    }
    catch (error) {
        console.error('Feil ved lagring til localStorage (sizes):', error);
    }
}
/**
 * Sletter størrelse for en komponent
 */
export function clearComponentSize(id) {
    const sizes = loadAllSizes();
    delete sizes[id];
    localStorage.setItem(STORAGE_KEY_SIZES, JSON.stringify(sizes));
}
/**
 * Sletter alle lagrede størrelser
 */
export function clearAllSizes() {
    localStorage.removeItem(STORAGE_KEY_SIZES);
}
//# sourceMappingURL=storage.js.map