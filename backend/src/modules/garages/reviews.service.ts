import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto, UpdateReviewDto, RespondToReviewDto } from './dto/review.dto';
import { GaragesService } from './garages.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private garagesService: GaragesService,
  ) {}

  /**
   * Create a new review
   */
  async create(
    userId: string,
    garageId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    // Verify garage exists
    await this.garagesService.findOne(garageId);

    const review = this.reviewRepository.create({
      ...createReviewDto,
      userId,
      garageId,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update garage rating
    await this.garagesService.updateRating(garageId, createReviewDto.rating);

    return savedReview;
  }

  /**
   * Find all reviews for a garage
   */
  async findByGarage(
    garageId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Review[];
    total: number;
    page: number;
    totalPages: number;
    averageRating: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.reviewRepository.findAndCount({
      where: { garageId, isActive: true },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Calculate average rating
    const avgResult = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.garageId = :garageId', { garageId })
      .andWhere('review.isActive = :isActive', { isActive: true })
      .getRawOne();

    const averageRating = avgResult?.average ? parseFloat(avgResult.average) : 0;

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      averageRating: Math.round(averageRating * 100) / 100,
    };
  }

  /**
   * Find all reviews by user
   */
  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Review[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.reviewRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find one review by ID
   */
  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  /**
   * Update review
   */
  async update(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.findOne(id);

    // Check ownership
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const oldRating = review.rating;
    Object.assign(review, updateReviewDto);
    const updatedReview = await this.reviewRepository.save(review);

    // If rating changed, update garage rating
    if (updateReviewDto.rating && updateReviewDto.rating !== oldRating) {
      // Recalculate garage rating
      await this.recalculateGarageRating(review.garageId);
    }

    return updatedReview;
  }

  /**
   * Owner response to review
   */
  async respond(
    id: string,
    ownerId: string,
    respondDto: RespondToReviewDto,
  ): Promise<Review> {
    const review = await this.findOne(id);
    
    // Verify garage ownership
    const garage = await this.garagesService.findOne(review.garageId);
    if (garage.ownerId !== ownerId) {
      throw new ForbiddenException('Only garage owner can respond to reviews');
    }

    review.ownerResponse = respondDto.response;
    review.responseDate = new Date();

    return await this.reviewRepository.save(review);
  }

  /**
   * Delete review (soft delete)
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const review = await this.findOne(id);

    // Check ownership
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    review.isActive = false;
    await this.reviewRepository.save(review);

    // Recalculate garage rating
    await this.recalculateGarageRating(review.garageId);

    return { message: 'Review deleted successfully' };
  }

  /**
   * Get average rating for a garage
   */
  async getAverageRating(garageId: string): Promise<number> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.garageId = :garageId', { garageId })
      .andWhere('review.isActive = :isActive', { isActive: true })
      .getRawOne();

    return result?.average ? Math.round(parseFloat(result.average) * 100) / 100 : 0;
  }

  /**
   * Recalculate garage rating
   */
  private async recalculateGarageRating(garageId: string): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { garageId, isActive: true },
    });

    if (reviews.length === 0) {
      // No reviews, reset rating
      const garage = await this.garagesService.findOne(garageId);
      garage.rating = 0;
      garage.reviewsCount = 0;
      await this.garagesService['garageRepository'].save(garage);
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const garage = await this.garagesService.findOne(garageId);
    garage.rating = Math.round(averageRating * 100) / 100;
    garage.reviewsCount = reviews.length;
    await this.garagesService['garageRepository'].save(garage);
  }
}
