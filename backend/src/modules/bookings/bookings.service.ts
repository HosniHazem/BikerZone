import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto, UpdateBookingDto, CancelBookingDto, FilterBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  /**
   * Create a new booking
   */
  async create(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    // Validate start date is in the future
    const startDate = new Date(createBookingDto.startDate);
    if (startDate < new Date()) {
      throw new BadRequestException('Booking start date must be in the future');
    }

    // Check for overlapping bookings
    const hasOverlap = await this.checkOverlap(
      createBookingDto.garageId,
      startDate,
      createBookingDto.endDate ? new Date(createBookingDto.endDate) : null,
    );

    if (hasOverlap) {
      throw new BadRequestException('This time slot is already booked');
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId,
      startDate,
      endDate: createBookingDto.endDate ? new Date(createBookingDto.endDate) : null,
    });

    return await this.bookingRepository.save(booking);
  }

  /**
   * Find all bookings with filtering
   */
  async findAll(filterDto: FilterBookingDto): Promise<{
    data: Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { garageId, status, startDate, endDate, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const query = this.bookingRepository.createQueryBuilder('booking');

    if (garageId) {
      query.andWhere('booking.garageId = :garageId', { garageId });
    }

    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    if (startDate && endDate) {
      query.andWhere('booking.startDate BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else if (startDate) {
      query.andWhere('booking.startDate >= :startDate', {
        startDate: new Date(startDate),
      });
    } else if (endDate) {
      query.andWhere('booking.startDate <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    const [data, total] = await query
      .orderBy('booking.startDate', 'DESC')
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
   * Find one booking by ID
   */
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  /**
   * Find bookings by user
   */
  async findByUser(userId: string, page: number = 1, limit: number = 10): Promise<{
    data: Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.bookingRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { startDate: 'DESC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find bookings by garage
   */
  async findByGarage(garageId: string, page: number = 1, limit: number = 10): Promise<{
    data: Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.bookingRepository.findAndCount({
      where: { garageId },
      skip,
      take: limit,
      order: { startDate: 'DESC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get upcoming bookings for user
   */
  async getUpcoming(userId: string, limit: number = 10): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: {
        userId,
        startDate: MoreThanOrEqual(new Date()),
        status: BookingStatus.CONFIRMED,
      },
      take: limit,
      order: { startDate: 'ASC' },
    });
  }

  /**
   * Get past bookings for user
   */
  async getPast(userId: string, page: number = 1, limit: number = 10): Promise<{
    data: Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.bookingRepository.findAndCount({
      where: {
        userId,
        startDate: LessThanOrEqual(new Date()),
      },
      skip,
      take: limit,
      order: { startDate: 'DESC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update booking
   */
  async update(id: string, userId: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);

    // Check ownership
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    // Don't allow updates for completed or cancelled bookings
    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot update completed or cancelled bookings');
    }

    // If updating dates, check for overlaps
    if (updateBookingDto.startDate || updateBookingDto.endDate) {
      const newStartDate = updateBookingDto.startDate 
        ? new Date(updateBookingDto.startDate) 
        : booking.startDate;
      const newEndDate = updateBookingDto.endDate 
        ? new Date(updateBookingDto.endDate) 
        : booking.endDate;

      const hasOverlap = await this.checkOverlap(
        booking.garageId,
        newStartDate,
        newEndDate,
        id,
      );

      if (hasOverlap) {
        throw new BadRequestException('This time slot is already booked');
      }
    }

    Object.assign(booking, updateBookingDto);
    
    if (updateBookingDto.startDate) {
      booking.startDate = new Date(updateBookingDto.startDate);
    }
    if (updateBookingDto.endDate) {
      booking.endDate = new Date(updateBookingDto.endDate);
    }

    return await this.bookingRepository.save(booking);
  }

  /**
   * Cancel booking
   */
  async cancel(id: string, userId: string, cancelDto: CancelBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);

    // Check ownership
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    // Don't allow cancellation of already completed or cancelled bookings
    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot cancel completed or cancelled bookings');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = cancelDto.reason;

    return await this.bookingRepository.save(booking);
  }

  /**
   * Update booking status (for garage owners)
   */
  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = status;
    return await this.bookingRepository.save(booking);
  }

  /**
   * Delete booking (hard delete)
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const booking = await this.findOne(id);

    // Check ownership
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    await this.bookingRepository.remove(booking);
    return { message: 'Booking deleted successfully' };
  }

  /**
   * Check for overlapping bookings
   */
  private async checkOverlap(
    garageId: string,
    startDate: Date,
    endDate: Date | null,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.garageId = :garageId', { garageId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
      });

    if (excludeBookingId) {
      query.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    // Check for overlap
    if (endDate) {
      query.andWhere(
        '((booking.startDate <= :startDate AND booking.endDate >= :startDate) OR ' +
        '(booking.startDate <= :endDate AND booking.endDate >= :endDate) OR ' +
        '(booking.startDate >= :startDate AND booking.endDate <= :endDate))',
        { startDate, endDate },
      );
    } else {
      query.andWhere('booking.startDate = :startDate', { startDate });
    }

    const count = await query.getCount();
    return count > 0;
  }
}
