import { Resolver, Query } from '@nestjs/graphql';
import { GetDashboardMetricsUseCase } from '@domain/use-cases/dashboard-metrics';
import { DashboardMetrics } from './graphql-types/dashboard.graphql';

@Resolver(() => DashboardMetrics)
export class DashboardResolver {
  constructor(
    private readonly getDashboardMetrics: GetDashboardMetricsUseCase,
  ) {}

  @Query(() => DashboardMetrics)
  async dashboard(): Promise<DashboardMetrics> {
    return this.getDashboardMetrics.execute();
  }
}
