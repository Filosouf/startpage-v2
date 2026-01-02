/**
 * Base klasse for alle komponenter
 * Alle komponenter arver fra denne klassen
 */
export class Component {
    constructor(config) {
        this.element = null;
        this.container = null;
        this.reRegisterCallback = null;
        this.id = config.id;
        this.position = config.position || { x: 0, y: 0 };
        this.size = config.size || {};
        this.draggable = config.draggable ?? true;
        this.resizable = config.resizable ?? false;
    }
    /**
     * Setter en callback som kalles etter oppdatering for å re-registrere komponenten
     */
    setReRegisterCallback(callback) {
        this.reRegisterCallback = callback;
    }
    /**
     * Monterer komponenten i en container
     */
    mount(container) {
        this.container = container;
        const renderResult = this.render();
        if (typeof renderResult === 'string') {
            container.innerHTML = renderResult;
            this.element = container.firstElementChild;
        }
        else {
            container.appendChild(renderResult);
            this.element = renderResult;
        }
        if (this.element) {
            this.element.id = this.id;
            this.element.classList.add('component-window');
            this.applyPosition();
            this.applySize();
        }
        this.onMount();
    }
    /**
     * Fjerner komponenten fra DOM
     */
    unmount() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.container = null;
        this.onUnmount();
    }
    /**
     * Oppdaterer komponenten
     */
    update() {
        if (this.container && this.element) {
            const renderResult = this.render();
            const currentZIndex = this.element.style.zIndex;
            const currentPosition = this.position;
            const parent = this.element.parentNode;
            const resizeHandle = this.element.querySelector('.resize-handle');
            if (typeof renderResult === 'string') {
                // Opprett et midlertidig element for å parse HTML-stringen
                const temp = document.createElement('div');
                temp.innerHTML = renderResult.trim();
                const newElement = temp.firstElementChild;
                if (newElement && parent) {
                    // Bevar ID, klasser og z-index
                    newElement.id = this.id;
                    newElement.classList.add('component-window');
                    if (this.draggable) {
                        newElement.classList.add('draggable');
                    }
                    newElement.style.zIndex = currentZIndex || '';
                    // Bevar resize handle hvis den finnes
                    if (resizeHandle && this.resizable) {
                        newElement.appendChild(resizeHandle);
                    }
                    // Erstatt det gamle elementet med det nye
                    parent.replaceChild(newElement, this.element);
                    this.element = newElement;
                }
            }
            else {
                // Bevar ID, klasser og z-index for DOM elementer også
                renderResult.id = this.id;
                renderResult.classList.add('component-window');
                if (this.draggable) {
                    renderResult.classList.add('draggable');
                }
                renderResult.style.zIndex = currentZIndex || '';
                // Bevar resize handle hvis den finnes
                if (resizeHandle && this.resizable) {
                    renderResult.appendChild(resizeHandle);
                }
                this.element.replaceWith(renderResult);
                this.element = renderResult;
            }
            if (this.element) {
                this.position = currentPosition;
                this.applyPosition();
                this.applySize();
            }
        }
        this.onUpdate();
        // Re-registrer komponenten i WindowManager hvis callback er satt
        if (this.reRegisterCallback) {
            this.reRegisterCallback();
        }
    }
    /**
     * Setter posisjonen til komponenten
     */
    setPosition(x, y) {
        this.position = { x, y };
        this.applyPosition();
    }
    /**
     * Henter posisjonen til komponenten
     */
    getPosition() {
        return { ...this.position };
    }
    /**
     * Henter DOM elementet til komponenten
     */
    getElement() {
        return this.element;
    }
    /**
     * Henter ID til komponenten
     */
    getId() {
        return this.id;
    }
    /**
     * Sjekker om komponenten er draggable
     */
    isDraggable() {
        return this.draggable;
    }
    /**
     * Setter draggable status
     */
    setDraggable(draggable) {
        this.draggable = draggable;
        if (this.element) {
            if (draggable) {
                this.element.classList.add('draggable');
            }
            else {
                this.element.classList.remove('draggable');
            }
        }
    }
    /**
     * Applikerer posisjonen til DOM elementet
     */
    applyPosition() {
        if (this.element) {
            this.element.style.left = `${this.position.x}px`;
            this.element.style.top = `${this.position.y}px`;
        }
    }
    /**
     * Setter størrelsen til komponenten
     */
    setSize(width, height) {
        if (width !== undefined)
            this.size.width = width;
        if (height !== undefined)
            this.size.height = height;
        this.applySize();
    }
    /**
     * Henter størrelsen til komponenten
     */
    getSize() {
        return { ...this.size };
    }
    /**
     * Applikerer størrelsen til DOM elementet
     */
    applySize() {
        if (this.element) {
            if (this.size.width !== undefined) {
                this.element.style.width = `${this.size.width}px`;
                this.element.style.maxWidth = `${this.size.width}px`;
            }
            if (this.size.height !== undefined) {
                this.element.style.height = `${this.size.height}px`;
                this.element.style.maxHeight = `${this.size.height}px`;
            }
        }
    }
    /**
     * Sjekker om komponenten er resizable
     */
    isResizable() {
        return this.resizable;
    }
    /**
     * Setter resizable status
     */
    setResizable(resizable) {
        this.resizable = resizable;
    }
    /**
     * Lifecycle hooks - kan overrides av subklasser
     */
    onMount() {
        // Override i subklasser
    }
    onUnmount() {
        // Override i subklasser
    }
    onUpdate() {
        // Override i subklasser
    }
}
//# sourceMappingURL=Component.js.map