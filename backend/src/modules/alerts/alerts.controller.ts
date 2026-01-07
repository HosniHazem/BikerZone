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
import { AlertsService } from './alerts.service';
import { CreateAlertDto, UpdateAlertDto, FilterAlertDto } from './dto/alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Alert } from './schemas/alert.schema';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new alert',
    description: 'Report a traffic/police alert for other riders',
  })
  @ApiBody({ type: CreateAlertDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Alert created successfully',
    type: Alert,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or expiration in the past',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  create(@Request() req, @Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.create(req.user.id, createAlertDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all alerts',
    description: 'Retrieve active alerts with optional filtering',
  })
  @ApiQuery({ name: 'type', required: false, enum: ['police', 'traffic', 'accident', 'roadwork', 'weather', 'other'] })
  @ApiQuery({ name: 'severity', required: false, enum: ['low', 'medium', 'high'] })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alerts retrieved successfully',
  })
  findAll(@Query() filterDto: FilterAlertDto) {
    return this.alertsService.findAll(filterDto);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get active alerts',
    description: 'Get all currently active (non-expired) alerts',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active alerts retrieved successfully',
  })
  findActive(@Query('limit') limit?: number) {
    return this.alertsService.findActive(limit ? +limit : 50);
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Get nearby alerts',
    description: 'Find alerts near a specific location',
  })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, schema: { default: 10 } })
  @ApiQuery({ name: 'limit', required: false, type: Number, schema: { default: 20 } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nearby alerts retrieved successfully',
  })
  findNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
    @Query('limit') limit?: number,
  ) {
    return this.alertsService.findNearby(
      +latitude,
      +longitude,
      radius ? +radius : 10,
      limit ? +limit : 20,
    );
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user alerts',
    description: 'Get all alerts created by a specific user',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User alerts retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  getUserAlerts(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.alertsService.getUserAlerts(userId, page ? +page : 1, limit ? +limit : 10);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get alert by ID',
    description: 'Retrieve a specific alert',
  })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alert retrieved successfully',
    type: Alert,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alert not found',
  })
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.alertsService.findOne(id, userId);
  }

  @Post(':id/upvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Upvote alert',
    description: 'Confirm/upvote an alert to increase its credibility',
  })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alert upvoted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alert not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  upvote(@Request() req, @Param('id') id: string) {
    return this.alertsService.upvote(id, req.user.id);
  }

  @Post(':id/downvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Downvote alert',
    description: 'Report an alert as inaccurate or outdated',
  })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alert downvoted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alert not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  downvote(@Request() req, @Param('id') id: string) {
    return this.alertsService.downvote(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update alert',
    description: 'Update alert details. Only alert creator can update.',
  })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiBody({ type: UpdateAlertDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alert updated successfully',
    type: Alert,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alert not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You can only update your own alerts',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot update expired alert',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAlertDto: UpdateAlertDto,
  ) {
    return this.alertsService.update(id, req.user.id, updateAlertDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete alert',
    description: 'Soft delete an alert. Only alert creator can delete.',
  })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alert deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alert not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You can only delete your own alerts',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.alertsService.remove(id, req.user.id);
  }
}
