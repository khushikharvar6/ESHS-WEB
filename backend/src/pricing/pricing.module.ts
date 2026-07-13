import { Module } from '@nestjs/common';
import { PricingInitializationService } from './pricing-initialization.service';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';

@Module({
  controllers: [PricingController],
  providers: [PricingInitializationService, PricingService],
  exports: [PricingService],
})
export class PricingModule {}
