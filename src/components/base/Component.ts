import { ComponentPosition, ComponentRenderResult, ComponentConfig, ComponentSize } from '../../types.js';

/**
 * Base klasse for alle komponenter
 * Alle komponenter arver fra denne klassen
 */
export abstract class Component {
  protected id: string;
  protected element: HTMLElement | null = null;
  protected position: ComponentPosition;
  protected size: ComponentSize;
  protected draggable: boolean;
  protected resizable: boolean;
  protected container: HTMLElement | null = null;
  private reRegisterCallback: (() => void) | null = null;

  constructor(config: ComponentConfig) {
    this.id = config.id;
    this.position = config.position || { x: 0, y: 0 };
    this.size = config.size || {};
    this.draggable = config.draggable ?? true;
    this.resizable = config.resizable ?? false;
  }

  /**
   * Setter en callback som kalles etter oppdatering for å re-registrere komponenten
   */
  setReRegisterCallback(callback: () => void): void {
    this.reRegisterCallback = callback;
  }

  /**
   * Renderer komponenten og returnerer HTML string eller DOM element
   */
  abstract render(): ComponentRenderResult;

  /**
   * Monterer komponenten i en container
   */
  mount(container: HTMLElement): void {
    this.container = container;
    const renderResult = this.render();
    
    if (typeof renderResult === 'string') {
      container.innerHTML = renderResult;
      this.element = container.firstElementChild as HTMLElement;
    } else {
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
  unmount(): void {
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
  update(): void {
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
        const newElement = temp.firstElementChild as HTMLElement;
        
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
      } else {
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
  setPosition(x: number, y: number): void {
    this.position = { x, y };
    this.applyPosition();
  }

  /**
   * Henter posisjonen til komponenten
   */
  getPosition(): ComponentPosition {
    return { ...this.position };
  }

  /**
   * Henter DOM elementet til komponenten
   */
  getElement(): HTMLElement | null {
    return this.element;
  }

  /**
   * Henter ID til komponenten
   */
  getId(): string {
    return this.id;
  }

  /**
   * Sjekker om komponenten er draggable
   */
  isDraggable(): boolean {
    return this.draggable;
  }

  /**
   * Setter draggable status
   */
  setDraggable(draggable: boolean): void {
    this.draggable = draggable;
    if (this.element) {
      if (draggable) {
        this.element.classList.add('draggable');
      } else {
        this.element.classList.remove('draggable');
      }
    }
  }

  /**
   * Applikerer posisjonen til DOM elementet
   */
  protected applyPosition(): void {
    if (this.element) {
      this.element.style.left = `${this.position.x}px`;
      this.element.style.top = `${this.position.y}px`;
    }
  }

  /**
   * Setter størrelsen til komponenten
   */
  setSize(width?: number, height?: number): void {
    if (width !== undefined) this.size.width = width;
    if (height !== undefined) this.size.height = height;
    this.applySize();
  }

  /**
   * Henter størrelsen til komponenten
   */
  getSize(): ComponentSize {
    return { ...this.size };
  }

  /**
   * Applikerer størrelsen til DOM elementet
   */
  protected applySize(): void {
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
  isResizable(): boolean {
    return this.resizable;
  }

  /**
   * Setter resizable status
   */
  setResizable(resizable: boolean): void {
    this.resizable = resizable;
  }

  /**
   * Lifecycle hooks - kan overrides av subklasser
   */
  protected onMount(): void {
    // Override i subklasser
  }

  protected onUnmount(): void {
    // Override i subklasser
  }

  protected onUpdate(): void {
    // Override i subklasser
  }
}
