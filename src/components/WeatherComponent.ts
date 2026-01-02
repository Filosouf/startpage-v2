import { Component } from './base/Component.js';
import { ComponentConfig } from '../types.js';

interface WeatherData {
  temp: number;
  emoji: string;
}

/**
 * Komponent for væropplysninger for Bergen
 */
export class WeatherComponent extends Component {
  private weatherData: WeatherData | null = null;
  private updateInterval: number | null = null;

  constructor(config?: Partial<ComponentConfig>) {
    super({
      id: 'weather-component',
      position: config?.position || { x: window.innerWidth / 2 - 200, y: 20 },
      draggable: config?.draggable ?? true,
      ...config
    });
  }

  render(): string {
    const weatherText = this.weatherData 
      ? `${this.weatherData.emoji} ${this.weatherData.temp}°C`
      : 'Henter væropplysninger...';

    return `
      <div class="weather-box" onclick="window.open('https://www.yr.no/nb/sted/Norge/Vestland/Bergen/Bergen/', '_blank')">
        Vær - ${weatherText}
      </div>
    `;
  }

  protected onMount(): void {
    this.fetchWeather();
    // Oppdater væropplysninger hvert 30. minutt
    this.updateInterval = window.setInterval(() => {
      this.fetchWeather();
    }, 30 * 60 * 1000);
  }

  protected onUnmount(): void {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private async fetchWeather(): Promise<void> {
    try {
      const response = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.3913&lon=5.3221', {
        headers: {
          'User-Agent': 'Startpage/1.0 (contact@example.com)'
        }
      });
      const data = await response.json();
      
      if (data && data.properties && data.properties.timeseries && data.properties.timeseries.length > 0) {
        const current = data.properties.timeseries[0].data.instant.details;
        const nextHour = data.properties.timeseries.find((t: any) => {
          const time = new Date(t.time);
          const now = new Date();
          return time > now;
        });
        
        const temp = Math.round(current.air_temperature);
        const symbol = nextHour ? nextHour.data.next_1_hours?.summary?.symbol_code || 'unknown' : 'unknown';
        
        const emoji = this.getWeatherEmoji(symbol);
        this.weatherData = { temp, emoji };
        this.update();
      } else {
        this.weatherData = null;
        this.update();
      }
    } catch (error) {
      console.error('Feil ved henting av væropplysninger:', error);
      this.weatherData = null;
      this.update();
    }
  }

  private getWeatherEmoji(symbol: string): string {
    const weatherEmoji: Record<string, string> = {
      'clearsky_day': '☀️',
      'clearsky_night': '🌙',
      'clearsky_polartwilight': '🌅',
      'fair_day': '🌤️',
      'fair_night': '🌙',
      'fair_polartwilight': '🌅',
      'partlycloudy_day': '⛅',
      'partlycloudy_night': '☁️',
      'partlycloudy_polartwilight': '⛅',
      'cloudy': '☁️',
      'rainshowers_day': '🌦️',
      'rainshowers_night': '🌧️',
      'rainshowers_polartwilight': '🌦️',
      'rainshowersandthunder_day': '⛈️',
      'rainshowersandthunder_night': '⛈️',
      'rainshowersandthunder_polartwilight': '⛈️',
      'sleetshowers_day': '🌨️',
      'sleetshowers_night': '🌨️',
      'sleetshowers_polartwilight': '🌨️',
      'snowshowers_day': '🌨️',
      'snowshowers_night': '🌨️',
      'snowshowers_polartwilight': '🌨️',
      'rain': '🌧️',
      'heavyrain': '🌧️',
      'heavyrainandthunder': '⛈️',
      'sleet': '🌨️',
      'snow': '❄️',
      'snowandthunder': '⛈️',
      'fog': '🌫️',
      'sleetshowersandthunder_day': '⛈️',
      'sleetshowersandthunder_night': '⛈️',
      'sleetshowersandthunder_polartwilight': '⛈️',
      'snowshowersandthunder_day': '⛈️',
      'snowshowersandthunder_night': '⛈️',
      'snowshowersandthunder_polartwilight': '⛈️',
      'rainandthunder': '⛈️',
      'sleetandthunder': '⛈️',
      'lightrainshowers_day': '🌦️',
      'lightrainshowers_night': '🌧️',
      'lightrainshowers_polartwilight': '🌦️',
      'heavyrainshowers_day': '🌧️',
      'heavyrainshowers_night': '🌧️',
      'heavyrainshowers_polartwilight': '🌧️',
      'lightssleetshowers_day': '🌨️',
      'lightssleetshowers_night': '🌨️',
      'lightssleetshowers_polartwilight': '🌨️',
      'heavysleetshowers_day': '🌨️',
      'heavysleetshowers_night': '🌨️',
      'heavysleetshowers_polartwilight': '🌨️',
      'lightssnowshowers_day': '🌨️',
      'lightssnowshowers_night': '🌨️',
      'lightssnowshowers_polartwilight': '🌨️',
      'heavysnowshowers_day': '🌨️',
      'heavysnowshowers_night': '🌨️',
      'heavysnowshowers_polartwilight': '🌨️',
      'lightrain': '🌦️',
      'lightsleet': '🌨️',
      'lightsnow': '🌨️',
      'lightrainshowersandthunder_day': '⛈️',
      'lightrainshowersandthunder_night': '⛈️',
      'lightrainshowersandthunder_polartwilight': '⛈️',
      'heavyrainshowersandthunder_day': '⛈️',
      'heavyrainshowersandthunder_night': '⛈️',
      'heavyrainshowersandthunder_polartwilight': '⛈️',
      'lightssleetshowersandthunder_day': '⛈️',
      'lightssleetshowersandthunder_night': '⛈️',
      'lightssleetshowersandthunder_polartwilight': '⛈️',
      'heavysleetshowersandthunder_day': '⛈️',
      'heavysleetshowersandthunder_night': '⛈️',
      'heavysleetshowersandthunder_polartwilight': '⛈️',
      'lightssnowshowersandthunder_day': '⛈️',
      'lightssnowshowersandthunder_night': '⛈️',
      'lightssnowshowersandthunder_polartwilight': '⛈️',
      'heavysnowshowersandthunder_day': '⛈️',
      'heavysnowshowersandthunder_night': '⛈️',
      'heavysnowshowersandthunder_polartwilight': '⛈️',
      'lightrainandthunder': '⛈️',
      'lightsleetandthunder': '⛈️',
      'lightsnowandthunder': '⛈️'
    };

    return weatherEmoji[symbol] || '🌡️';
  }
}
