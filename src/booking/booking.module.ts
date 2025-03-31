import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Showtime])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
