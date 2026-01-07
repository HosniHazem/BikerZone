import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto, FilterVideoDto } from './dto/video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Video } from './schemas/video.schema';

@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Upload a video',
    description: 'Create a new video tutorial',
  })
  @ApiBody({ type: CreateVideoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Video uploaded successfully',
    type: Video,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  create(@Request() req, @Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(req.user.id, createVideoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all videos',
    description: 'Retrieve paginated videos with filtering and sorting',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, enum: ['sport', 'cruiser', 'touring', 'adventure', 'standard', 'custom'] })
  @ApiQuery({ name: 'level', required: false, enum: ['beginner', 'intermediate', 'advanced'] })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['views', 'likes', 'recent'] })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Videos retrieved successfully',
  })
  findAll(@Query() filterDto: FilterVideoDto) {
    return this.videosService.findAll(filterDto);
  }

  @Get('popular')
  @ApiOperation({
    summary: 'Get popular videos',
    description: 'Get most viewed and liked videos',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Popular videos retrieved successfully',
  })
  getPopular(@Query('limit') limit?: number) {
    return this.videosService.getPopular(limit ? +limit : 10);
  }

  @Get('recent')
  @ApiOperation({
    summary: 'Get recent videos',
    description: 'Get recently uploaded videos',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recent videos retrieved successfully',
  })
  getRecent(@Query('limit') limit?: number) {
    return this.videosService.getRecent(limit ? +limit : 10);
  }

  @Get('featured')
  @ApiOperation({
    summary: 'Get featured videos',
    description: 'Get featured/highlighted videos',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 5 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Featured videos retrieved successfully',
  })
  getFeatured(@Query('limit') limit?: number) {
    return this.videosService.getFeatured(limit ? +limit : 5);
  }

  @Get('uploader/:uploaderId')
  @ApiOperation({
    summary: 'Get videos by uploader',
    description: 'Get all videos uploaded by a specific user',
  })
  @ApiParam({ name: 'uploaderId', description: 'Uploader user ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Uploader videos retrieved successfully',
  })
  getByUploader(
    @Param('uploaderId') uploaderId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.videosService.getByUploader(uploaderId, page ? +page : 1, limit ? +limit : 10);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get video by ID',
    description: 'Retrieve a specific video',
  })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Video retrieved successfully',
    type: Video,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video not found',
  })
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.videosService.findOne(id, userId);
  }

  @Post(':id/view')
  @ApiOperation({
    summary: 'Increment view count',
    description: 'Track video view',
  })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'View count incremented',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video not found',
  })
  incrementViews(@Param('id') id: string) {
    return this.videosService.incrementViews(id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Toggle like on video',
    description: 'Like or unlike a video',
  })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Like toggled successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  toggleLike(@Request() req, @Param('id') id: string) {
    return this.videosService.toggleLike(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update video',
    description: 'Update video details. Only uploader can update.',
  })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiBody({ type: UpdateVideoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Video updated successfully',
    type: Video,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You can only update your own videos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.videosService.update(id, req.user.id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete video',
    description: 'Soft delete a video. Only uploader can delete.',
  })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Video deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You can only delete your own videos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.videosService.remove(id, req.user.id);
  }
}
