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
        <div class="mealplan-header drag-handle">
          <h3>🍽️ Matplan</h3>
          <button class="print-button" title="Skriv ut matplan">🖨️</button>
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

  protected onMount(): void {
    super.onMount();
    this.setupPrintButton();
  }

  protected onUpdate(): void {
    super.onUpdate();
    this.setupPrintButton();
  }

  private setupPrintButton(): void {
    const element = this.getElement();
    if (!element) return;

    const printButton = element.querySelector('.print-button');
    if (printButton) {
      printButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.printMealPlan();
      });
    }
  }

  private printMealPlan(): void {
    const { mealPlan } = this.mealPlanData;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup-blocker er aktivert. Tillat popups for å kunne skrive ut.');
      return;
    }

    const printContent = `
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Matplan</title>
  <style>
    @page {
      size: A4;
      margin: 1cm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 9pt;
      line-height: 1.3;
      color: #000;
      background: #fff;
      padding: 0;
    }
    
    .print-header {
      text-align: center;
      margin-bottom: 12px;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
    }
    
    .print-header h1 {
      font-size: 18pt;
      margin-bottom: 3px;
    }
    
    .print-header .date {
      font-size: 8pt;
      color: #666;
    }
    
    .print-section {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    
    .print-section h2 {
      font-size: 12pt;
      margin-bottom: 5px;
      border-bottom: 1px solid #333;
      padding-bottom: 2px;
      text-transform: uppercase;
    }
    
    .meal-options {
      margin-left: 10px;
    }
    
    .meal-option {
      margin-bottom: 6px;
      padding: 4px 6px;
      background-color: #f9f9f9;
      border-left: 2px solid #333;
      padding-left: 8px;
    }
    
    .meal-option strong {
      display: block;
      font-size: 10pt;
      margin-bottom: 2px;
      color: #000;
    }
    
    .meal-option ul {
      margin-left: 15px;
      margin-top: 2px;
    }
    
    .meal-option li {
      margin-bottom: 1px;
      font-size: 8.5pt;
    }
    
    .print-section ul {
      margin-left: 15px;
      margin-top: 4px;
    }
    
    .print-section li {
      margin-bottom: 2px;
      font-size: 8.5pt;
    }
    
    .training-rules {
      background-color: #f0f0f0;
      padding: 6px;
      border: 1px solid #333;
      margin-top: 4px;
    }
    
    .training-rules p {
      margin-bottom: 2px;
      font-size: 8.5pt;
    }
    
    .training-rules strong {
      font-weight: bold;
    }
    
    .checklist {
      background-color: #f9f9f9;
      padding: 6px;
      border-left: 2px solid #333;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .print-section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="print-header">
    <h1>🍽️ Matplan</h1>
    <div class="date">${new Date().toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
  </div>
  
  <div class="print-section">
    <h2>Frokost</h2>
    <div class="meal-options">
      ${mealPlan.breakfast.map(option => `
        <div class="meal-option">
          <strong>${option.label}</strong>
          <ul>
            ${option.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>
  
  <div class="print-section">
    <h2>Lunsj</h2>
    <div class="meal-options">
      ${mealPlan.lunch.map(option => `
        <div class="meal-option">
          <strong>${option.label}</strong>
          <ul>
            ${option.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>
  
  <div class="print-section">
    <h2>Middag</h2>
    <div class="meal-options">
      ${mealPlan.dinner.map(option => `
        <div class="meal-option">
          <strong>${option.label}</strong>
          <ul>
            ${option.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>
  
  <div class="print-section">
    <h2>Snacks</h2>
    <ul>
      ${mealPlan.snacks.map(snack => `<li>${snack}</li>`).join('')}
    </ul>
  </div>
  
  <div class="print-section">
    <h2>Trening</h2>
    <div class="training-rules">
      <p><strong>Før trening:</strong> ${mealPlan.trainingRules.preWorkout.join(', ')}</p>
      <p><strong>Etter trening:</strong> ${mealPlan.trainingRules.postWorkout.join(', ')}</p>
      <p><strong>Pizza-regel:</strong> ${mealPlan.trainingRules.pizzaRule}</p>
    </div>
  </div>
  
  <div class="print-section">
    <h2>Daglig sjekkliste</h2>
    <div class="checklist">
      <ul>
        ${mealPlan.dailyChecklist.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  </div>
  
  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  }

}
