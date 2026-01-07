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
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, CancelBookingDto, FilterBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Booking, BookingStatus } from './entities/booking.entity';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new booking',
    description: 'Book a garage appointment. Validates time slot availability.',
  })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Booking created successfully',
    type: Booking,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or time slot already booked',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all bookings',
    description: 'Retrieve paginated list of bookings with optional filtering',
  })
  @ApiQuery({ name: 'garageId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bookings retrieved successfully',
  })
  findAll(@Query() filterDto: FilterBookingDto) {
    return this.bookingsService.findAll(filterDto);
  }

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get upcoming bookings',
    description: 'Get confirmed upcoming bookings for current user',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Upcoming bookings retrieved successfully',
  })
  getUpcoming(@Request() req, @Query('limit') limit?: number) {
    return this.bookingsService.getUpcoming(req.user.id, limit ? +limit : 10);
  }

  @Get('past')
  @ApiOperation({
    summary: 'Get past bookings',
    description: 'Get past bookings for current user',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Past bookings retrieved successfully',
  })
  getPast(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.getPast(req.user.id, page ? +page : 1, limit ? +limit : 10);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get user bookings',
    description: 'Get all bookings for a specific user',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User bookings retrieved successfully',
  })
  findByUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.findByUser(userId, page ? +page : 1, limit ? +limit : 10);
  }

  @Get('garage/:garageId')
  @ApiOperation({
    summary: 'Get garage bookings',
    description: 'Get all bookings for a specific garage',
  })
  @ApiParam({ name: 'garageId', description: 'Garage ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Garage bookings retrieved successfully',
  })
  findByGarage(
    @Param('garageId') garageId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.findByGarage(garageId, page ? +page : 1, limit ? +limit : 10);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get booking by ID',
    description: 'Retrieve a specific booking',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking retrieved successfully',
    type: Booking,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found',
  })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update booking',
    description: 'Update booking details. Only booking owner can update.',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking updated successfully',
    type: Booking,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You can only update your own bookings',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot update completed or cancelled bookings',
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, req.user.id, updateBookingDto);
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancel booking',
    description: 'Cancel a booking with reason. Only booking owner can cancel.',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({ type: CancelBookingDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking cancelled successfully',
    type: Booking,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You can only cancel your own bookings',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot cancel completed or cancelled bookings',
  })
  cancel(
    @Request() req,
    @Param('id') id: string,
    @Body() cancelDto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, req.user.id, cancelDto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update booking status',
    description: 'Update booking status (for garage owners)',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(BookingStatus),
          example: BookingStatus.CONFIRMED,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking status updated successfully',
    type: Booking,
  })
  updateStatus(@Param('id') id: string, @Body('status') status: BookingStatus) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete booking',
    description: 'Permanently delete a booking. Only booking owner can delete.',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You can only delete your own bookings',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.bookingsService.remove(id, req.user.id);
  }
}
