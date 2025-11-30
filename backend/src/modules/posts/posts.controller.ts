import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user.id, createPostDto);
  }

  @Get()
  findAll(@Request() req, @Query() filterDto: FilterPostDto) {
    return this.postsService.getFeed(filterDto, req.user?.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.postsService.findOne(id, req.user?.id);
  }
}
