export interface StateFarmCountDTO {
  state: string;
  count: number;
}

export interface CropCountDTO {
  crop: string;
  count: number;
}

export interface LandUsageDTO {
  arableArea: number;
  vegetationArea: number;
}

export interface DashboardMetricsDTO {
  totalFarms: number;
  totalHectares: number;
  byState: StateFarmCountDTO[];
  byCrop: CropCountDTO[];
  landUsage: LandUsageDTO;
}
