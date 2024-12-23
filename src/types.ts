export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
  shape: "rectangular" | "L-shaped";
  lWidth?: number;
  lLength?: number;
}

export interface Material {
  id: string;
  name: string;
  type: "basic" | "pbr";
  color: string;
  properties?: {
    roughness?: number;
    metalness?: number;
    opacity?: number;
  };
  costs: MaterialCost;
}

export interface MaterialCost {
  basePrice: number;
  laborCost: number;
  wastagePercent: number;
  additionalCosts?: {
    name: string;
    cost: number;
  }[];
}

export interface CostBreakdown {
  materials: {
    area: number;
    baseCost: number;
    wastage: number;
    total: number;
  };
  labor: {
    hours: number;
    cost: number;
  };
  additional: {
    name: string;
    cost: number;
  }[];
  total: number;
}

export interface PerformanceMetrics {
  fps: number;
  triangles: number;
  drawCalls: number;
  memoryUsage: number;
  renderTime: number;
  dimensions?: RoomDimensions;
  material?: string;
  format?: string;
  width?: number;
  height?: number;
  timestamp?: number;
}
