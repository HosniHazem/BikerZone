import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GaragesService } from './garages.service';
import { GaragesController } from './garages.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Garage } from './entities/garage.entity';
import { Review } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Garage, Review])],
  controllers: [GaragesController, ReviewsController],
  providers: [GaragesService, ReviewsService],
  exports: [GaragesService, ReviewsService],
})
export class GaragesModule {}
