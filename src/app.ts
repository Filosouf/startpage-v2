import { WindowManager } from './managers/WindowManager.js';
import { WeatherComponent } from './components/WeatherComponent.js';
import { LinksComponent } from './components/LinksComponent.js';
import { ClockComponent } from './components/ClockComponent.js';
import { MealPlanComponent } from './components/MealPlanComponent.js';
import { Component } from './components/base/Component.js';

/**
 * Hovedapplikasjon for startsiden
 */
class App {
  private windowManager: WindowManager;
  private components: Component[] = [];
  private container: HTMLElement;

  constructor() {
    this.windowManager = new WindowManager();
    this.container = document.body;
  }

  /**
   * Initialiserer applikasjonen
   */
  init(): void {
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
  registerComponent(component: Component): void {
    this.components.push(component);
    const div = document.createElement('div');
    this.container.appendChild(div);
    component.mount(div);
    this.windowManager.registerComponent(component);
  }

  /**
   * Henter WindowManager
   */
  getWindowManager(): WindowManager {
    return this.windowManager;
  }
}

// Eksporter singleton instance
const app = new App();

// Eksporter init funksjon
export function init(): void {
  app.init();
  
  // Eksponer app globalt for komponenter som trenger tilgang til WindowManager
  (window as any).app = app;
}

// Eksporter app for å kunne registrere nye komponenter
export default app;
