import { WindowManager } from './managers/WindowManager.js';
import { WeatherComponent } from './components/WeatherComponent.js';
import { LinksComponent } from './components/LinksComponent.js';
import { ClockComponent } from './components/ClockComponent.js';
import { MealPlanComponent } from './components/MealPlanComponent.js';
/**
 * Hovedapplikasjon for startsiden
 */
class App {
    constructor() {
        this.components = [];
        this.windowManager = new WindowManager();
        this.container = document.body;
    }
    /**
     * Initialiserer applikasjonen
     */
    init() {
        // Opprett alle komponenter
        const weatherComponent = new WeatherComponent();
        const linksComponent = new LinksComponent();
        const clockComponent = new ClockComponent();
        const mealPlanComponent = new MealPlanComponent();
        // Lagre referanser
        this.components = [
            weatherComponent,
            linksComponent,
            clockComponent,
            mealPlanComponent
        ];
        // Monter alle komponenter
        this.components.forEach(component => {
            const div = document.createElement('div');
            this.container.appendChild(div);
            component.mount(div);
            // Sett opp re-register callback for komponenten
            component.setReRegisterCallback(() => {
                this.windowManager.reRegisterComponent(component);
            });
            // Registrer i WindowManager
            this.windowManager.registerComponent(component);
        });
    }
    /**
     * Registrerer en ny komponent
     */
    registerComponent(component) {
        this.components.push(component);
        const div = document.createElement('div');
        this.container.appendChild(div);
        component.mount(div);
        this.windowManager.registerComponent(component);
    }
    /**
     * Henter WindowManager
     */
    getWindowManager() {
        return this.windowManager;
    }
}
// Eksporter singleton instance
const app = new App();
// Eksporter init funksjon
export function init() {
    app.init();
    // Eksponer app globalt for komponenter som trenger tilgang til WindowManager
    window.app = app;
}
// Eksporter app for å kunne registrere nye komponenter
export default app;
//# sourceMappingURL=app.js.map