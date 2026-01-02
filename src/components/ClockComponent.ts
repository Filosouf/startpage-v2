import { Component } from './base/Component.js';
import { ComponentConfig } from '../types.js';

/**
 * Komponent for klokke
 */
export class ClockComponent extends Component {
  private updateInterval: number | null = null;
  private hourOffset: number = 0;

  constructor(config?: Partial<ComponentConfig> & { hourOffset?: number }) {
    super({
      id: 'clock-component',
      position: config?.position || { x: window.innerWidth - 150, y: 20 },
      draggable: config?.draggable ?? true,
      ...config
    });
    this.hourOffset = config?.hourOffset || 0;
  }

  render(): string {
    const date = new Date();
    date.setHours(date.getHours() + this.hourOffset);
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `
      <div class="clock-window drag-handle">
        <div class="clock-display">${hours}:${minutes}:${seconds}</div>
      </div>
    `;
  }

  protected onMount(): void {
    this.update();
    // Oppdater klokken hvert sekund
    this.updateInterval = window.setInterval(() => {
      this.update();
    }, 1000);
  }

  protected onUnmount(): void {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}
