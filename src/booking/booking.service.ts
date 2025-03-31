import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { CreateBookingDto } from './dto/create-booking.dto';


@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepo: Repository<Booking>,
        @InjectRepository(Showtime)
        private showtimeRepo: Repository<Showtime>,
) {}


async create(dto: CreateBookingDto): Promise<{ bookingId: string }> {
    const showtime = await this.showtimeRepo.findOneBy({ id: dto.showtimeId });
    if (!showtime) throw new NotFoundException('Showtime not found');

    const existing = await this.bookingRepo.findOneBy({
      showtimeId: dto.showtimeId,
      seatNumber: dto.seatNumber,
    });
    if (existing) throw new BadRequestException('Seat already booked for this showtime');

    const booking = this.bookingRepo.create({ ...dto, showtime });
    const saved = await this.bookingRepo.save(booking);
    return { bookingId: saved.id };
  }


}
