import { Module } from '@nestjs/common';
import { MrdService } from './mrd.service';
import { MrdController } from './mrd.controller';

@Module({
  controllers: [MrdController],
  providers: [MrdService],
  exports: [MrdService],
})
export class MrdModule {}
