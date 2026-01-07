import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}

  /**
   * Create a new post
   */
  async create(userId: string, createPostDto: CreatePostDto): Promise<Post> {
    // Extract hashtags from content
    const hashtags = this.extractHashtags(createPostDto.content);

    const post = new this.postModel({
      ...createPostDto,
      userId,
      hashtags,
    });

    return await post.save();
  }

  /**
   * Get feed with pagination
   */
  async getFeed(
    filterDto: FilterPostDto,
    userId?: string,
  ): Promise<{ data: Post[]; total: number; page: number; hasMore: boolean }> {
    const { page = 1, limit = 10, sort = 'recent', hashtag } = filterDto;
    const skip = (page - 1) * limit;

    const query: any = { isActive: true };

    if (hashtag) {
      query.hashtags = hashtag;
    }

    let sortOption: any = { createdAt: -1 }; // Default: recent

    if (sort === 'popular') {
      sortOption = { likesCount: -1, createdAt: -1 };
    }

    const [data, total] = await Promise.all([
      this.postModel
        .find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.postModel.countDocuments(query),
    ]);

    // Add isLiked flag if userId provided
    const postsWithLikeStatus = data.map(post => ({
      ...post,
      isLikedByUser: userId ? post.likes.some(id => id.toString() === userId) : false,
    }));

    return {
      data: postsWithLikeStatus as any,
      total,
      page,
      hasMore: skip + limit < total,
    };
  }

  /**
   * Get a single post
   */
  async findOne(id: string, userId?: string): Promise<Post> {
    const post = await this.postModel.findById(id).lean().exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    return {
      ...post,
      isLikedByUser: userId ? post.likes.some(id => id.toString() === userId) : false,
    } as any;
  }

  /**
   * Get user's posts
   */
  async getUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Post[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.postModel
        .find({ userId, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.postModel.countDocuments({ userId, isActive: true }),
    ]);

    return { data: data as any, total };
  }

  /**
   * Update a post
   */
  async update(id: string, userId: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    // Update hashtags if content changed
    if (updatePostDto.content) {
      updatePostDto['hashtags'] = this.extractHashtags(updatePostDto.content);
    }

    Object.assign(post, updatePostDto);
    return await post.save();
  }

  /**
   * Delete a post (soft delete)
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    post.isActive = false;
    await post.save();

    return { message: 'Post deleted successfully' };
  }

  /**
   * Like/Unlike a post
   */
  async toggleLike(postId: string, userId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const userIndex = post.likes.findIndex(id => id.toString() === userId);

    if (userIndex === -1) {
      // Like
      post.likes.push(userId as any);
      post.likesCount = post.likes.length;
      await post.save();
      return { isLiked: true, likesCount: post.likesCount };
    } else {
      // Unlike
      post.likes.splice(userIndex, 1);
      post.likesCount = post.likes.length;
      await post.save();
      return { isLiked: false, likesCount: post.likesCount };
    }
  }

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, userId: string, addCommentDto: AddCommentDto): Promise<Post> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.comments.push({
      userId: userId as any,
      content: addCommentDto.content,
      createdAt: new Date(),
    });

    post.commentsCount = post.comments.length;

    return await post.save();
  }

  /**
   * Delete a comment
   */
  async deleteComment(postId: string, commentIndex: number, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = post.comments[commentIndex];

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    post.comments.splice(commentIndex, 1);
    post.commentsCount = post.comments.length;

    return await post.save();
  }

  /**
   * Get trending hashtags
   */
  async getTrendingHashtags(limit: number = 10): Promise<Array<{ tag: string; count: number }>> {
    const result = await this.postModel.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$hashtags' },
      { $group: { _id: '$hashtags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { tag: '$_id', count: 1, _id: 0 } },
    ]);

    return result;
  }

  /**
   * Extract hashtags from content
   */
  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.toLowerCase()) : [];
  }
}
