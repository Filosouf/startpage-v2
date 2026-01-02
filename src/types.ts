/**
 * TypeScript typer for komponentbasert startsiden
 */

export interface ComponentPosition {
  x: number;
  y: number;
}

export interface ComponentSize {
  width?: number;
  height?: number;
}

export interface ComponentConfig {
  id: string;
  position?: ComponentPosition;
  size?: ComponentSize;
  draggable?: boolean;
  resizable?: boolean;
}

export type ComponentRenderResult = string | HTMLElement;
