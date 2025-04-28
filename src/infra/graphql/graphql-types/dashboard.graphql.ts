import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class StateFarmCount {
  @Field()
  state!: string;

  @Field(() => Int)
  count!: number;
}

@ObjectType()
export class CropCount {
  @Field()
  crop!: string;

  @Field(() => Int)
  count!: number;
}

@ObjectType()
export class LandUsage {
  @Field(() => Float)
  arableArea!: number;

  @Field(() => Float)
  vegetationArea!: number;
}

@ObjectType()
export class DashboardMetrics {
  @Field(() => Int)
  totalFarms!: number;

  @Field(() => Float)
  totalHectares!: number;

  @Field(() => [StateFarmCount])
  byState!: StateFarmCount[];

  @Field(() => [CropCount])
  byCrop!: CropCount[];

  @Field(() => LandUsage)
  landUsage!: LandUsage;
}
