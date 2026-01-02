import { Component } from './base/Component.js';
/**
 * Komponent for klokke
 */
export class ClockComponent extends Component {
    constructor(config) {
        super({
            id: 'clock-component',
            position: config?.position || { x: window.innerWidth - 150, y: 20 },
            draggable: config?.draggable ?? true,
            ...config
        });
        this.updateInterval = null;
        this.hourOffset = 0;
        this.hourOffset = config?.hourOffset || 0;
    }
    render() {
        const date = new Date();
        date.setHours(date.getHours() + this.hourOffset);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `
      <div class="clock-window">
        <div class="clock-display">${hours}:${minutes}:${seconds}</div>
      </div>
    `;
    }
    onMount() {
        this.update();
        // Oppdater klokken hvert sekund
        this.updateInterval = window.setInterval(() => {
            this.update();
        }, 1000);
    }
    onUnmount() {
        if (this.updateInterval !== null) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}
//# sourceMappingURL=ClockComponent.js.map