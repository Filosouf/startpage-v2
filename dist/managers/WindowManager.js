import { saveComponentPosition, loadComponentPosition, saveComponentSize, loadComponentSize } from '../utils/storage.js';
/**
 * Manager for håndtering av drag-and-drop og vindusposisjonering
 */
export class WindowManager {
    constructor() {
        this.components = new Map();
        this.dragging = null;
        this.dragOffset = { x: 0, y: 0 };
        this.resizing = null;
        this.resizeStartSize = { width: 0, height: 0 };
        this.resizeStartPos = { x: 0, y: 0 };
        this.zIndexCounter = 1000;
        /**
         * Håndterer mousemove under dragging
         */
        this.handleMouseMove = (e) => {
            if (!this.dragging)
                return;
            const newX = e.clientX - this.dragOffset.x;
            const newY = e.clientY - this.dragOffset.y;
            // Begrens til skjermens grenser
            const maxX = window.innerWidth - 100; // Minst 100px synlig
            const maxY = window.innerHeight - 50; // Minst 50px synlig
            const boundedX = Math.max(0, Math.min(newX, maxX));
            const boundedY = Math.max(0, Math.min(newY, maxY));
            this.dragging.setPosition(boundedX, boundedY);
        };
        /**
         * Håndterer mouseup for å stoppe dragging
         */
        this.handleMouseUp = () => {
            if (!this.dragging)
                return;
            const element = this.dragging.getElement();
            if (element) {
                element.classList.remove('dragging');
            }
            // Lagre posisjon
            const position = this.dragging.getPosition();
            this.savePosition(this.dragging.getId(), position.x, position.y);
            this.dragging = null;
            // Fjern event listeners
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('mouseup', this.handleMouseUp);
        };
        /**
         * Håndterer mousemove under resize
         */
        this.handleResizeMove = (e) => {
            if (!this.resizing)
                return;
            const deltaX = e.clientX - this.resizeStartPos.x;
            const deltaY = e.clientY - this.resizeStartPos.y;
            const newWidth = Math.max(200, this.resizeStartSize.width + deltaX); // Min bredde 200px
            const newHeight = Math.max(100, this.resizeStartSize.height + deltaY); // Min høyde 100px
            this.resizing.setSize(newWidth, newHeight);
        };
        /**
         * Håndterer mouseup for å stoppe resize
         */
        this.handleResizeUp = () => {
            if (!this.resizing)
                return;
            const element = this.resizing.getElement();
            if (element) {
                element.classList.remove('resizing');
            }
            // Lagre størrelse
            const size = this.resizing.getSize();
            this.saveSize(this.resizing.getId(), size);
            this.resizing = null;
            document.removeEventListener('mousemove', this.handleResizeMove);
            document.removeEventListener('mouseup', this.handleResizeUp);
        };
    }
    /**
     * Registrerer en komponent i WindowManager
     */
    registerComponent(component) {
        this.components.set(component.getId(), component);
        // Last lagret posisjon hvis den finnes
        const savedPosition = loadComponentPosition(component.getId());
        if (savedPosition) {
            component.setPosition(savedPosition.x, savedPosition.y);
        }
        // Last lagret størrelse hvis den finnes
        const savedSize = loadComponentSize(component.getId());
        if (savedSize) {
            component.setSize(savedSize.width, savedSize.height);
        }
        // Gjør komponenten draggable hvis den skal være det
        if (component.isDraggable()) {
            this.makeDraggable(component);
        }
        // Gjør komponenten resizable hvis den skal være det
        if (component.isResizable()) {
            this.makeResizable(component);
        }
    }
    /**
     * Gjør en komponent flyttbar
     */
    makeDraggable(component) {
        const element = component.getElement();
        if (!element)
            return;
        element.classList.add('draggable');
        element.style.cursor = 'move';
        element.style.position = 'fixed';
        // Fjern eksisterende event listeners hvis de finnes
        const existingDragHandler = element._dragHandler;
        const existingFrontHandler = element._frontHandler;
        if (existingDragHandler) {
            element.removeEventListener('mousedown', existingDragHandler);
        }
        if (existingFrontHandler) {
            element.removeEventListener('mousedown', existingFrontHandler);
        }
        // Håndter mousedown for å starte dragging
        const dragHandler = (e) => this.startDrag(e, component);
        const frontHandler = () => this.bringToFront(component);
        // Lagre handlers på elementet for å kunne fjerne dem senere
        element._dragHandler = dragHandler;
        element._frontHandler = frontHandler;
        element.addEventListener('mousedown', dragHandler);
        element.addEventListener('mousedown', frontHandler);
    }
    /**
     * Re-registrerer en komponent (nyttig etter oppdatering)
     */
    reRegisterComponent(component) {
        if (component.isDraggable()) {
            this.makeDraggable(component);
        }
        if (component.isResizable()) {
            this.makeResizable(component);
        }
    }
    /**
     * Starter dragging av en komponent
     */
    startDrag(e, component) {
        // Kun håndter hvis venstre museknapp
        if (e.button !== 0)
            return;
        const element = component.getElement();
        if (!element)
            return;
        // Sjekk om vi klikker på en ikke-draggable del (f.eks. lenker, resize handle)
        const target = e.target;
        if (target.tagName === 'A' || target.closest('a')) {
            return; // Ikke dra hvis vi klikker på en lenke
        }
        // Ikke dra hvis vi klikker på resize handle
        if (target.classList.contains('resize-handle') || target.closest('.resize-handle')) {
            return; // La resize handle håndtere resize i stedet
        }
        // Kun tillat drag hvis vi klikker på drag-handle (header-området)
        if (!target.closest('.drag-handle')) {
            return; // Ikke dra hvis vi ikke klikker på et drag-handle område
        }
        this.dragging = component;
        this.bringToFront(component);
        const rect = element.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        element.classList.add('dragging');
        // Legg til event listeners for mousemove og mouseup
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        e.preventDefault();
    }
    /**
     * Bringer et vindu fremover (høyere z-index)
     */
    bringToFront(component) {
        const element = component.getElement();
        if (!element)
            return;
        this.zIndexCounter++;
        element.style.zIndex = this.zIndexCounter.toString();
    }
    /**
     * Lagrer posisjonen til en komponent
     */
    savePosition(componentId, x, y) {
        saveComponentPosition(componentId, { x, y });
    }
    /**
     * Henter lagret posisjon for en komponent
     */
    loadPosition(componentId) {
        return loadComponentPosition(componentId);
    }
    /**
     * Henter en komponent ved ID
     */
    getComponent(id) {
        return this.components.get(id);
    }
    /**
     * Gjør en komponent resizable
     */
    makeResizable(component) {
        const element = component.getElement();
        if (!element)
            return;
        // Legg til resize handle hvis den ikke allerede finnes
        let resizeHandle = element.querySelector('.resize-handle');
        if (!resizeHandle) {
            resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            element.appendChild(resizeHandle);
        }
        // Fjern eksisterende event listener hvis den finnes
        const existingHandler = resizeHandle._resizeHandler;
        if (existingHandler) {
            resizeHandle.removeEventListener('mousedown', existingHandler);
        }
        // Legg til ny event listener for resize
        const resizeHandler = (e) => this.startResize(e, component);
        resizeHandle._resizeHandler = resizeHandler;
        resizeHandle.addEventListener('mousedown', resizeHandler);
    }
    /**
     * Starter resize av en komponent
     */
    startResize(e, component) {
        if (e.button !== 0)
            return;
        const element = component.getElement();
        if (!element)
            return;
        this.resizing = component;
        this.bringToFront(component);
        const rect = element.getBoundingClientRect();
        const currentSize = component.getSize();
        this.resizeStartSize = {
            width: currentSize.width || rect.width,
            height: currentSize.height || rect.height
        };
        this.resizeStartPos = {
            x: e.clientX,
            y: e.clientY
        };
        element.classList.add('resizing');
        document.addEventListener('mousemove', this.handleResizeMove);
        document.addEventListener('mouseup', this.handleResizeUp);
        e.preventDefault();
        e.stopPropagation();
    }
    /**
     * Lagrer størrelsen til en komponent
     */
    saveSize(componentId, size) {
        saveComponentSize(componentId, size);
    }
    /**
     * Henter lagret størrelse for en komponent
     */
    loadSize(componentId) {
        return loadComponentSize(componentId);
    }
}
//# sourceMappingURL=WindowManager.js.map