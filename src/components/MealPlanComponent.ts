import { Component } from './base/Component.js';
import { ComponentConfig } from '../types.js';

interface MealOption {
  id: string;
  label: string;
  items: string[];
}

interface MealPlanData {
  mealPlan: {
    breakfast: MealOption[];
    lunch: MealOption[];
    dinner: MealOption[];
    snacks: string[];
    trainingRules: {
      preWorkout: string[];
      postWorkout: string[];
      pizzaRule: string;
    };
    dailyChecklist: string[];
  };
}

/**
 * Komponent for matplan og kostholdsoppfølging
 */
export class MealPlanComponent extends Component {
  private mealPlanData: MealPlanData;

  constructor(config?: Partial<ComponentConfig>) {
    super({
      id: 'mealplan-component',
      position: config?.position || { x: 50, y: 100 },
      size: config?.size || { width: 400, height: 300 },
      draggable: config?.draggable ?? true,
      resizable: config?.resizable ?? true,
      ...config
    });

    // Matplandata
    this.mealPlanData = {
      mealPlan: {
        breakfast: [
          {
            id: "breakfast_a",
            label: "Havregrøt",
            items: ["Havregrøt", "Bær", "Evt melk/proteinpulver"]
          },
          {
            id: "breakfast_b",
            label: "Egg og brød",
            items: ["2–3 egg", "1–2 grove brødskiver", "Tomat/paprika"]
          },
          {
            id: "breakfast_c",
            label: "Skyr",
            items: ["Skyr/yoghurt", "Frukt", "En neve nøtter"]
          }
        ],
        lunch: [
          {
            id: "lunch_a",
            label: "Knekkebrød",
            items: [
              "3–4 knekkebrød",
              "Ost/kalkun/fiskepålegg",
              "Egg eller cottage cheese"
            ]
          },
          {
            id: "lunch_b",
            label: "Wrap",
            items: [
              "Wrap/grov baguette",
              "Kylling eller tunfisk",
              "Grønnsaker"
            ]
          },
          {
            id: "lunch_c",
            label: "Rester",
            items: [
              "Kjøtt eller fisk",
              "Potet/ris",
              "Grønnsaker"
            ]
          }
        ],
        dinner: [
          {
            id: "dinner_a",
            label: "Kyllingmiddag",
            items: ["Kylling", "Poteter eller ris", "Grønnsaker"]
          },
          {
            id: "dinner_b",
            label: "Fiskemiddag",
            items: [
              "Fisk (sei/laks/torsk)",
              "Potetmos eller ris",
              "Grønnsaker"
            ]
          },
          {
            id: "dinner_c",
            label: "Pasta/risrett",
            items: [
              "Pasta eller ris",
              "Kjøttdeig",
              "Ekstra grønnsaker"
            ]
          }
        ],
        snacks: [
          "Skyr/cottage cheese",
          "Frukt (banan, eple)",
          "Knekkebrød med pålegg",
          "En neve nøtter",
          "Proteinbar (maks 1 per dag)"
        ],
        trainingRules: {
          preWorkout: ["Frukt", "Yoghurt"],
          postWorkout: ["Middag", "Vann"],
          pizzaRule: "Kan erstatte middag 1–2 ganger i uka etter trening"
        },
        dailyChecklist: [
          "Protein til hvert måltid",
          "Grønnsaker minst én gang",
          "1.5–2 liter vann"
        ]
      }
    };
  }

  render(): string {
    const { mealPlan } = this.mealPlanData;

    return `
      <div class="mealplan-window">
        <div class="mealplan-header">
          <h3>🍽️ Matplan</h3>
        </div>
        <div class="mealplan-content">
          <div class="meal-section">
            <h4>Frokost</h4>
            ${this.renderMealOptions(mealPlan.breakfast)}
          </div>
          <div class="meal-section">
            <h4>Lunsj</h4>
            ${this.renderMealOptions(mealPlan.lunch)}
          </div>
          <div class="meal-section">
            <h4>Middag</h4>
            ${this.renderMealOptions(mealPlan.dinner)}
          </div>
          <div class="meal-section">
            <h4>Snacks</h4>
            <ul>
              ${mealPlan.snacks.map(snack => `<li>${snack}</li>`).join('')}
            </ul>
          </div>
          <div class="meal-section">
            <h4>Trening</h4>
            <p><strong>Før:</strong> ${mealPlan.trainingRules.preWorkout.join(', ')}</p>
            <p><strong>Etter:</strong> ${mealPlan.trainingRules.postWorkout.join(', ')}</p>
            <p><strong>Pizza-regel:</strong> ${mealPlan.trainingRules.pizzaRule}</p>
          </div>
          <div class="meal-section">
            <h4>Daglig sjekkliste</h4>
            <ul>
              ${mealPlan.dailyChecklist.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  private renderMealOptions(options: MealOption[]): string {
    return `
      <div class="meal-options">
        ${options.map(option => `
          <div class="meal-option">
            <strong>${option.label}</strong>
            <ul>
              ${option.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  }

}
