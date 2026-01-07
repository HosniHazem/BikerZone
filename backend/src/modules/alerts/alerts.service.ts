import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { CreateAlertDto, UpdateAlertDto, FilterAlertDto } from './dto/alert.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name)
    private alertModel: Model<AlertDocument>,
  ) {}

  /**
   * Create a new alert
   */
  async create(userId: string, createAlertDto: CreateAlertDto): Promise<Alert> {
    const validUntil = new Date(createAlertDto.validUntil);
    
    // Validate validUntil is in the future
    if (validUntil <= new Date()) {
      throw new BadRequestException('Alert expiration must be in the future');
    }

    const alert = new this.alertModel({
      ...createAlertDto,
      userId,
      validUntil,
    });

    return await alert.save();
  }

  /**
   * Find all alerts with filtering
   */
  async findAll(filterDto: FilterAlertDto): Promise<{
    data: Alert[];
    total: number;
    page: number;
    hasMore: boolean;
  }> {
    const { type, severity, latitude, longitude, radius, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const query: any = { 
      isActive: true,
      validUntil: { $gt: new Date() },
    };

    if (type) {
      query.type = type;
    }

    if (severity) {
      query.severity = severity;
    }

    // Location-based filtering
    if (latitude && longitude && radius) {
      // Convert radius from km to radians (Earth radius ≈ 6371 km)
      const radiusInRadians = radius / 6371;

      query['location.lat'] = {
        $gte: latitude - (radiusInRadians * 180 / Math.PI),
        $lte: latitude + (radiusInRadians * 180 / Math.PI),
      };

      query['location.lng'] = {
        $gte: longitude - (radiusInRadians * 180 / Math.PI) / Math.cos(latitude * Math.PI / 180),
        $lte: longitude + (radiusInRadians * 180 / Math.PI) / Math.cos(latitude * Math.PI / 180),
      };
    }

    const [data, total] = await Promise.all([
      this.alertModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.alertModel.countDocuments(query),
    ]);

    return {
      data: data as any,
      total,
      page,
      hasMore: skip + limit < total,
    };
  }

  /**
   * Find active alerts
   */
  async findActive(limit: number = 50): Promise<Alert[]> {
    return await this.alertModel
      .find({
        isActive: true,
        validUntil: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec() as any;
  }

  /**
   * Find nearby alerts
   */
  async findNearby(
    latitude: number,
    longitude: number,
    radius: number = 10,
    limit: number = 20,
  ): Promise<Alert[]> {
    const radiusInRadians = radius / 6371;

    const query: any = {
      isActive: true,
      validUntil: { $gt: new Date() },
      'location.lat': {
        $gte: latitude - (radiusInRadians * 180 / Math.PI),
        $lte: latitude + (radiusInRadians * 180 / Math.PI),
      },
      'location.lng': {
        $gte: longitude - (radiusInRadians * 180 / Math.PI) / Math.cos(latitude * Math.PI / 180),
        $lte: longitude + (radiusInRadians * 180 / Math.PI) / Math.cos(latitude * Math.PI / 180),
      },
    };

    return await this.alertModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec() as any;
  }

  /**
   * Find one alert by ID
   */
  async findOne(id: string, userId?: string): Promise<Alert> {
    const alert = await this.alertModel.findById(id).lean().exec();

    if (!alert || !alert.isActive) {
      throw new NotFoundException('Alert not found');
    }

    // Add user interaction flags
    const result = {
      ...alert,
      hasUpvoted: userId ? alert.upvotes.some((id: any) => id.toString() === userId) : false,
      hasDownvoted: userId ? alert.downvotes.some((id: any) => id.toString() === userId) : false,
    };

    return result as any;
  }

  /**
   * Update alert
   */
  async update(id: string, userId: string, updateAlertDto: UpdateAlertDto): Promise<Alert> {
    const alert = await this.alertModel.findById(id);

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    // Check ownership
    if (alert.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own alerts');
    }

    // Check if alert is still valid
    if (alert.validUntil < new Date()) {
      throw new BadRequestException('Cannot update expired alert');
    }

    if (updateAlertDto.validUntil) {
      const newValidUntil = new Date(updateAlertDto.validUntil);
      if (newValidUntil <= new Date()) {
        throw new BadRequestException('Alert expiration must be in the future');
      }
      updateAlertDto.validUntil = newValidUntil as any;
    }

    Object.assign(alert, updateAlertDto);
    return await alert.save();
  }

  /**
   * Delete alert (soft delete)
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const alert = await this.alertModel.findById(id);

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    // Check ownership
    if (alert.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own alerts');
    }

    alert.isActive = false;
    await alert.save();

    return { message: 'Alert deleted successfully' };
  }

  /**
   * Upvote alert
   */
  async upvote(id: string, userId: string): Promise<{ upvotesCount: number; hasUpvoted: boolean }> {
    const alert = await this.alertModel.findById(id);

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    // Remove from downvotes if present
    const downvoteIndex = alert.downvotes.findIndex(
      (voteUserId) => voteUserId.toString() === userId,
    );
    if (downvoteIndex > -1) {
      alert.downvotes.splice(downvoteIndex, 1);
      alert.downvotesCount = Math.max(0, alert.downvotesCount - 1);
    }

    // Toggle upvote
    const upvoteIndex = alert.upvotes.findIndex(
      (voteUserId) => voteUserId.toString() === userId,
    );

    let hasUpvoted: boolean;

    if (upvoteIndex > -1) {
      // Remove upvote
      alert.upvotes.splice(upvoteIndex, 1);
      alert.upvotesCount = Math.max(0, alert.upvotesCount - 1);
      hasUpvoted = false;
    } else {
      // Add upvote
      alert.upvotes.push(userId as any);
      alert.upvotesCount += 1;
      hasUpvoted = true;
    }

    await alert.save();

    return {
      upvotesCount: alert.upvotesCount,
      hasUpvoted,
    };
  }

  /**
   * Downvote alert
   */
  async downvote(id: string, userId: string): Promise<{ downvotesCount: number; hasDownvoted: boolean }> {
    const alert = await this.alertModel.findById(id);

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    // Remove from upvotes if present
    const upvoteIndex = alert.upvotes.findIndex(
      (voteUserId) => voteUserId.toString() === userId,
    );
    if (upvoteIndex > -1) {
      alert.upvotes.splice(upvoteIndex, 1);
      alert.upvotesCount = Math.max(0, alert.upvotesCount - 1);
    }

    // Toggle downvote
    const downvoteIndex = alert.downvotes.findIndex(
      (voteUserId) => voteUserId.toString() === userId,
    );

    let hasDownvoted: boolean;

    if (downvoteIndex > -1) {
      // Remove downvote
      alert.downvotes.splice(downvoteIndex, 1);
      alert.downvotesCount = Math.max(0, alert.downvotesCount - 1);
      hasDownvoted = false;
    } else {
      // Add downvote
      alert.downvotes.push(userId as any);
      alert.downvotesCount += 1;
      hasDownvoted = true;
    }

    await alert.save();

    return {
      downvotesCount: alert.downvotesCount,
      hasDownvoted,
    };
  }

  /**
   * Get user alerts
   */
  async getUserAlerts(userId: string, page: number = 1, limit: number = 10): Promise<{
    data: Alert[];
    total: number;
    page: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.alertModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.alertModel.countDocuments({ userId }),
    ]);

    return {
      data: data as any,
      total,
      page,
      hasMore: skip + limit < total,
    };
  }

  /**
   * Cleanup expired alerts (cron job)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredAlerts(): Promise<void> {
    await this.alertModel.updateMany(
      {
        validUntil: { $lt: new Date() },
        isActive: true,
      },
      {
        isActive: false,
      },
    );
  }
}
