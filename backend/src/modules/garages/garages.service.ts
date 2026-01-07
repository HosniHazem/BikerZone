import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Garage, GarageStatus } from './entities/garage.entity';
import { CreateGarageDto } from './dto/create-garage.dto';
import { UpdateGarageDto } from './dto/update-garage.dto';
import { FilterGarageDto } from './dto/filter-garage.dto';

@Injectable()
export class GaragesService {
  constructor(
    @InjectRepository(Garage)
    private garageRepository: Repository<Garage>,
  ) {}

  /**
   * Create a new garage
   */
  async create(ownerId: string, createGarageDto: CreateGarageDto): Promise<Garage> {
    const garage = this.garageRepository.create({
      ...createGarageDto,
      ownerId,
    });

    return await this.garageRepository.save(garage);
  }

  /**
   * Find all garages with filtering and pagination
   */
  async findAll(filterDto: FilterGarageDto): Promise<{
    data: Garage[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { search, service, status, latitude, longitude, radius, page = 1, limit = 10 } = filterDto;
    
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Garage> = {};

    if (status) {
      where.status = status;
    }

    if (service) {
      // Note: For proper array search, you might want to use raw query or JSON operators
      // This is a simplified version
    }

    let query = this.garageRepository.createQueryBuilder('garage');

    if (search) {
      query = query.where(
        'garage.name LIKE :search OR garage.description LIKE :search',
        { search: `%${search}%` }
      );
    }

    if (status) {
      query = query.andWhere('garage.status = :status', { status });
    }

    // Location-based search
    if (latitude && longitude && radius) {
      // Haversine formula for distance calculation
      // This is a simplified version - for production, consider using PostGIS
      query = query.andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(garage.latitude)) * cos(radians(garage.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(garage.latitude)))) <= :radius`,
        { lat: latitude, lng: longitude, radius }
      );
    }

    const [data, total] = await query
      .orderBy('garage.rating', 'DESC')
      .addOrderBy('garage.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find one garage by ID
   */
  async findOne(id: string): Promise<Garage> {
    const garage = await this.garageRepository.findOne({ where: { id } });
    
    if (!garage) {
      throw new NotFoundException('Garage not found');
    }

    return garage;
  }

  /**
   * Update garage
   */
  async update(id: string, ownerId: string, updateGarageDto: UpdateGarageDto): Promise<Garage> {
    const garage = await this.findOne(id);

    // Check ownership
    if (garage.ownerId !== ownerId) {
      throw new ForbiddenException('You can only update your own garage');
    }

    Object.assign(garage, updateGarageDto);
    return await this.garageRepository.save(garage);
  }

  /**
   * Delete garage (soft delete by setting status to inactive)
   */
  async remove(id: string, ownerId: string): Promise<{ message: string }> {
    const garage = await this.findOne(id);

    // Check ownership
    if (garage.ownerId !== ownerId) {
      throw new ForbiddenException('You can only delete your own garage');
    }

    garage.status = GarageStatus.INACTIVE;
    await this.garageRepository.save(garage);

    return { message: 'Garage deleted successfully' };
  }

  /**
   * Get garages by owner
   */
  async findByOwner(ownerId: string, page: number = 1, limit: number = 10): Promise<{
    data: Garage[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.garageRepository.findAndCount({
      where: { ownerId },
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
   * Search garages near location
   */
  async findNearby(
    latitude: number,
    longitude: number,
    radius: number = 10,
    limit: number = 10
  ): Promise<Garage[]> {
    // Using Haversine formula
    const garages = await this.garageRepository
      .createQueryBuilder('garage')
      .where('garage.status = :status', { status: GarageStatus.ACTIVE })
      .andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(garage.latitude)) * cos(radians(garage.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(garage.latitude)))) <= :radius`,
        { lat: latitude, lng: longitude, radius }
      )
      .orderBy('garage.rating', 'DESC')
      .limit(limit)
      .getMany();

    return garages;
  }

  /**
   * Update garage rating
   */
  async updateRating(id: string, newRating: number): Promise<void> {
    const garage = await this.findOne(id);
    
    // Calculate new average rating
    const totalReviews = garage.reviewsCount;
    const currentTotal = garage.rating * totalReviews;
    const newTotal = currentTotal + newRating;
    const newCount = totalReviews + 1;
    const newAverage = newTotal / newCount;

    garage.rating = Math.round(newAverage * 100) / 100;
    garage.reviewsCount = newCount;

    await this.garageRepository.save(garage);
  }
}
