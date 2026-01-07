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
import { GaragesService } from './garages.service';
import { CreateGarageDto } from './dto/create-garage.dto';
import { UpdateGarageDto } from './dto/update-garage.dto';
import { FilterGarageDto } from './dto/filter-garage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Garage } from './entities/garage.entity';

@ApiTags('Garages')
@Controller('garages')
export class GaragesController {
  constructor(private readonly garagesService: GaragesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new garage',
    description: 'Register a new garage. Requires authentication.',
  })
  @ApiBody({ type: CreateGarageDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Garage created successfully',
    type: Garage,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Request() req, @Body() createGarageDto: CreateGarageDto) {
    return this.garagesService.create(req.user.id, createGarageDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all garages',
    description: 'Retrieve a paginated list of garages with optional filtering',
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'service', required: false, type: String, description: 'Filter by service' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'suspended'] })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Garages retrieved successfully',
  })
  findAll(@Query() filterDto: FilterGarageDto) {
    return this.garagesService.findAll(filterDto);
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Find nearby garages',
    description: 'Find garages near a specific location',
  })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, schema: { default: 10 } })
  @ApiQuery({ name: 'limit', required: false, type: Number, schema: { default: 10 } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nearby garages retrieved successfully',
  })
  findNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
    @Query('limit') limit?: number,
  ) {
    return this.garagesService.findNearby(+latitude, +longitude, radius ? +radius : 10, limit ? +limit : 10);
  }

  @Get('owner/:ownerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get garages by owner',
    description: 'Retrieve all garages owned by a specific user',
  })
  @ApiParam({ name: 'ownerId', description: 'Owner user ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Owner garages retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  findByOwner(
    @Param('ownerId') ownerId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.garagesService.findByOwner(ownerId, page ? +page : 1, limit ? +limit : 10);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get garage by ID',
    description: 'Retrieve detailed information about a specific garage',
  })
  @ApiParam({ name: 'id', description: 'Garage ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Garage retrieved successfully',
    type: Garage,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Garage not found',
  })
  findOne(@Param('id') id: string) {
    return this.garagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update garage',
    description: 'Update garage information. Only the owner can update their garage.',
  })
  @ApiParam({ name: 'id', description: 'Garage ID' })
  @ApiBody({ type: UpdateGarageDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Garage updated successfully',
    type: Garage,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Garage not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You can only update your own garage',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGarageDto: UpdateGarageDto,
  ) {
    return this.garagesService.update(id, req.user.id, updateGarageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete garage',
    description: 'Soft delete a garage (sets status to inactive). Only the owner can delete their garage.',
  })
  @ApiParam({ name: 'id', description: 'Garage ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Garage deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Garage not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You can only delete your own garage',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.garagesService.remove(id, req.user.id);
  }
}
