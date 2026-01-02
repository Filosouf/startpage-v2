import { Component } from './base/Component.js';
import { ComponentConfig } from '../types.js';

interface Link {
  name: string;
  url: string;
}

interface Category {
  title: string;
  links: Link[];
}

/**
 * Komponent for hovedvinduet med lenker
 */
export class LinksComponent extends Component {
  private categories: Category[];
  private title: string;
  private subtitle: string;
  private frontImageUrl: string;

  constructor(config?: Partial<ComponentConfig> & {
    title?: string;
    subtitle?: string;
    frontImageUrl?: string;
    categories?: Category[];
  }) {
    super({
      id: 'links-component',
      position: config?.position || { 
        x: window.innerWidth / 2 - 480, 
        y: window.innerHeight / 2 - 242 
      },
      size: config?.size || { width: 960, height: 485 },
      draggable: config?.draggable ?? true,
      resizable: config?.resizable ?? true,
      ...config
    });

    this.title = config?.title || 'Startsiden';
    this.subtitle = config?.subtitle || 'Enten går det bra, eller så går det over...';
    this.frontImageUrl = config?.frontImageUrl || 'resources/images/katt_agnes.jpeg';
    
    // Standard kategorier
    this.categories = config?.categories || [
      {
        title: 'NRK',
        links: [
          { name: 'TV', url: 'https://tv.nrk.no' },
          { name: 'Radio', url: 'https://www.nrk.no/radio/' },
          { name: 'Avis', url: 'https://www.nrk.no/' }
        ]
      },
      {
        title: 'DEV',
        links: [
          { name: 'Github', url: 'https://github.com' },
          { name: 'Roadmap', url: 'https://roadmap.sh' }
        ]
      },
      {
        title: 'UNDERHOLDNING',
        links: [
          { name: 'Sjakk', url: 'https://chess.com' },
          { name: 'Youtube', url: 'https://youtube.com' },
          { name: 'Manga', url: 'https://weebcentral.com' },
          { name: '/a/', url: 'https://4chan.org/a' }
        ]
      },
      {
        title: 'Private',
        links: [
          { name: 'E-post', url: 'https://gmail.com' },
          { name: 'Lib', url: 'https://z-library.sk/' },
          { name: 'NTS', url: 'https://www.nevertoosmall.com/' },
          { name: 'Tek', url: 'https://www.tek.no/' },
          { name: 'Kode24', url: 'https://www.kode24.no/' }
        ]
      }
    ];
  }

  render(): string {
    const categoriesHtml = this.categories.map(category => `
      <div class="categorytitle">${category.title}</div>
      <div class="categorycontent">
        ${category.links.map((link, index) => 
          `<a href="${link.url}">${link.name}</a>${index < category.links.length - 1 ? ' - ' : ''}`
        ).join('')}
      </div>
    `).join('');

    return `
      <div class="window-bg">
        <div class="front-img" style="background-image: url('${this.frontImageUrl}')"></div>
        <div class="titlediv drag-handle">
          <div id="titleb">${this.title}</div>
        </div>
        <div class="windowbackgroundarea1 drag-handle">
          <div id="Subtitle">${this.subtitle}</div>
        </div>
        <div class="windowbackgroundarea2">
          <div class="centerDivs">
            <div class="category">
              ${categoriesHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
