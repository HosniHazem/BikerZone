import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';
import { CreateVideoDto, UpdateVideoDto, FilterVideoDto } from './dto/video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name)
    private videoModel: Model<VideoDocument>,
  ) {}

  /**
   * Create a new video
   */
  async create(uploadedBy: string, createVideoDto: CreateVideoDto): Promise<Video> {
    const video = new this.videoModel({
      ...createVideoDto,
      uploadedBy,
    });

    return await video.save();
  }

  /**
   * Find all videos with filtering
   */
  async findAll(filterDto: FilterVideoDto): Promise<{
    data: Video[];
    total: number;
    page: number;
    hasMore: boolean;
  }> {
    const { search, category, level, tag, sortBy = 'recent', page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const query: any = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (tag) {
      query.tags = tag;
    }

    let sortOption: any = { createdAt: -1 }; // Default: recent

    if (sortBy === 'views') {
      sortOption = { views: -1, createdAt: -1 };
    } else if (sortBy === 'likes') {
      sortOption = { likesCount: -1, createdAt: -1 };
    }

    const [data, total] = await Promise.all([
      this.videoModel
        .find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.videoModel.countDocuments(query),
    ]);

    return {
      data: data as any,
      total,
      page,
      hasMore: skip + limit < total,
    };
  }

  /**
   * Find one video by ID
   */
  async findOne(id: string, userId?: string): Promise<Video> {
    const video = await this.videoModel.findById(id).lean().exec();

    if (!video || !video.isActive) {
      throw new NotFoundException('Video not found');
    }

    // Add isLikedByUser flag if userId provided
    const result = {
      ...video,
      isLikedByUser: userId ? video.likes.some((id: any) => id.toString() === userId) : false,
    };

    return result as any;
  }

  /**
   * Update video
   */
  async update(id: string, uploadedBy: string, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.videoModel.findById(id);

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check ownership
    if (video.uploadedBy.toString() !== uploadedBy) {
      throw new ForbiddenException('You can only update your own videos');
    }

    Object.assign(video, updateVideoDto);
    return await video.save();
  }

  /**
   * Delete video (soft delete)
   */
  async remove(id: string, uploadedBy: string): Promise<{ message: string }> {
    const video = await this.videoModel.findById(id);

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check ownership
    if (video.uploadedBy.toString() !== uploadedBy) {
      throw new ForbiddenException('You can only delete your own videos');
    }

    video.isActive = false;
    await video.save();

    return { message: 'Video deleted successfully' };
  }

  /**
   * Increment view count
   */
  async incrementViews(id: string): Promise<{ views: number }> {
    const video = await this.videoModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return { views: video.views };
  }

  /**
   * Toggle like on video
   */
  async toggleLike(id: string, userId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const video = await this.videoModel.findById(id);

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const likeIndex = video.likes.findIndex(
      (likeUserId) => likeUserId.toString() === userId,
    );

    let isLiked: boolean;

    if (likeIndex > -1) {
      // Unlike
      video.likes.splice(likeIndex, 1);
      video.likesCount = Math.max(0, video.likesCount - 1);
      isLiked = false;
    } else {
      // Like
      video.likes.push(userId as any);
      video.likesCount += 1;
      isLiked = true;
    }

    await video.save();

    return {
      isLiked,
      likesCount: video.likesCount,
    };
  }

  /**
   * Get popular videos
   */
  async getPopular(limit: number = 10): Promise<Video[]> {
    return await this.videoModel
      .find({ isActive: true })
      .sort({ views: -1, likesCount: -1 })
      .limit(limit)
      .lean()
      .exec() as any;
  }

  /**
   * Get recent videos
   */
  async getRecent(limit: number = 10): Promise<Video[]> {
    return await this.videoModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec() as any;
  }

  /**
   * Get featured videos
   */
  async getFeatured(limit: number = 5): Promise<Video[]> {
    return await this.videoModel
      .find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec() as any;
  }

  /**
   * Get videos by uploader
   */
  async getByUploader(uploadedBy: string, page: number = 1, limit: number = 10): Promise<{
    data: Video[];
    total: number;
    page: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.videoModel
        .find({ uploadedBy, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.videoModel.countDocuments({ uploadedBy, isActive: true }),
    ]);

    return {
      data: data as any,
      total,
      page,
      hasMore: skip + limit < total,
    };
  }
}
