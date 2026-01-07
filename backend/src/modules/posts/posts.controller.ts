import { Controller, Get, Post, Body, Param, UseGuards, Request, Query, HttpStatus, Patch, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { PostsPageResponseDto, PostDto, LikeResponseDto, MessageResponseDto, UserPostsResponseDto, TrendingHashtagDto } from './dto/post.response.dto';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')

export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new post',
    description: 'Creates a new post with title, content, and optional tags. Requires authentication.'
  })
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({ description: 'Post created successfully', type: PostDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user.id, createPostDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get posts feed',
    description: 'Retrieves a paginated list of posts with optional filtering by search, tags, hashtags, and sorting options.'
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'tags', required: false, type: [String], description: 'Filter by tags' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'sort', required: false, enum: ['recent', 'popular', 'trending'], description: 'Sort by', example: 'recent' })
  @ApiQuery({ name: 'hashtag', required: false, type: String, description: 'Filter by hashtag' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], description: 'Sort order', example: 'DESC' })
  @ApiOkResponse({ description: 'Posts retrieved successfully', type: PostsPageResponseDto })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  findAll(@Request() req, @Query() filterDto: FilterPostDto) {
    return this.postsService.getFeed(filterDto, req.user?.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get post by ID',
    description: 'Retrieves a specific post by its unique identifier.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    required: true 
  })
  @ApiOkResponse({ description: 'Post retrieved successfully', type: PostDto })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Post not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  findOne(@Request() req, @Param('id') id: string) {
    return this.postsService.findOne(id, req.user?.id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a post',
    description: 'Updates an existing post. Only the post owner can update their posts.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    required: true 
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiOkResponse({ description: 'Post updated successfully', type: PostDto })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Post not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'You can only update your own posts' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  update(@Request() req, @Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, req.user.id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a post',
    description: 'Deletes a post (soft delete). Only the post owner can delete their posts.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    required: true 
  })
  @ApiOkResponse({ description: 'Post deleted successfully', type: MessageResponseDto })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Post not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'You can only delete your own posts' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.postsService.remove(id, req.user.id);
  }

  @Post(':id/like')
  @ApiOperation({ 
    summary: 'Toggle like on a post',
    description: 'Likes or unlikes a post. Returns the new like status and total likes count.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    required: true 
  })
  @ApiOkResponse({ description: 'Like toggled successfully', type: LikeResponseDto })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Post not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  toggleLike(@Request() req, @Param('id') id: string) {
    return this.postsService.toggleLike(id, req.user.id);
  }

  @Post(':id/comments')
  @ApiOperation({ 
    summary: 'Add a comment to a post',
    description: 'Adds a new comment to a post.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    required: true 
  })
  @ApiBody({ type: AddCommentDto })
  @ApiCreatedResponse({ description: 'Comment added successfully', type: PostDto })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Post not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  addComment(@Request() req, @Param('id') id: string, @Body() addCommentDto: AddCommentDto) {
    return this.postsService.addComment(id, req.user.id, addCommentDto);
  }

  @Delete(':id/comments/:commentIndex')
  @ApiOperation({ 
    summary: 'Delete a comment from a post',
    description: 'Deletes a comment from a post. Only the comment owner can delete their comments.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    required: true 
  })
  @ApiParam({ 
    name: 'commentIndex', 
    description: 'Comment index',
    required: true 
  })
  @ApiOkResponse({ description: 'Comment deleted successfully', type: PostDto })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Post or comment not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'You can only delete your own comments' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  deleteComment(@Request() req, @Param('id') id: string, @Param('commentIndex') commentIndex: number) {
    return this.postsService.deleteComment(id, commentIndex, req.user.id);
  }

  @Get('trending/hashtags')
  @ApiOperation({ 
    summary: 'Get trending hashtags',
    description: 'Retrieves the most trending hashtags.'
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of hashtags to return', example: 10 })
  @ApiOkResponse({ description: 'Trending hashtags retrieved successfully', type: [TrendingHashtagDto] })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  getTrendingHashtags(@Query('limit') limit?: number) {
    return this.postsService.getTrendingHashtags(limit || 10);
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Get user posts',
    description: 'Retrieves all posts from a specific user with pagination.'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'User ID',
    required: true 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiOkResponse({ description: 'User posts retrieved successfully', type: UserPostsResponseDto })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  getUserPosts(@Param('userId') userId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.postsService.getUserPosts(userId, page || 1, limit || 10);
  }
}
