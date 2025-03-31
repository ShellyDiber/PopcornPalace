import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Showtime } from './entities/showtime.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Movie } from 'src/movies/entities/movie.entity';
import { Console } from 'console';


@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepo: Repository<Showtime>,
    @InjectRepository(Movie)
    private movieRepo: Repository<Movie>,
  ) {}

  async create(dto: CreateShowtimeDto): Promise<Showtime> {
    const movie = await this.movieRepo.findOneBy({ id: dto.movieId });
    if (!movie) throw new NotFoundException('Movie not found');

    const overlap = await this.showtimeRepo
    .createQueryBuilder('showtime')
    .where('showtime.theater = :theater', { theater: dto.theater })
    .andWhere('showtime.startTime <= :endTime', { endTime: dto.endTime })
    .andWhere('showtime.endTime >= :startTime', { startTime: dto.startTime })
    .getOne();
    console.log('overlap', overlap);
    if (overlap) {
        throw new BadRequestException('Showtime overlaps with an existing showtime');
    }
        

    const showtime = this.showtimeRepo.create({ ...dto, movie });
    return this.showtimeRepo.save(showtime);

}
        

    async findOne(id: number): Promise<Showtime> {
        const showtime = await this.showtimeRepo.findOne({ where: { id }, relations: ['movie'] });
        if (!showtime) throw new NotFoundException('Showtime not found');
        return showtime;
    }

    async update(id: number, dto: UpdateShowtimeDto): Promise<Showtime> {
        const showtime = await this.findOne(id);
    
        if (dto.movieId) {
          const movie = await this.movieRepo.findOneBy({ id: dto.movieId });
          if (!movie) throw new NotFoundException('Movie not found');
          showtime.movie = movie;
        }
    
        const updated = this.showtimeRepo.merge(showtime, dto as Partial<Showtime>);
        return this.showtimeRepo.save(updated);
      }


    async remove(id: number): Promise<void> {
      const showtime = await this.showtimeRepo.findOne({ where: { id }, relations: ['bookings'] });

      if (!showtime) throw new NotFoundException('Showtime not found');
    
      const hasBookings = await this.showtimeRepo
        .createQueryBuilder('showtime')
        .leftJoin('showtime.bookings', 'booking')
        .where('showtime.id = :id', { id })
        .andWhere('booking.id IS NOT NULL')
        .getOne();
    
      if (hasBookings) {
        throw new BadRequestException('Cannot delete showtime: it has existing bookings.');
      }
    
      const result = await this.showtimeRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Showtime not found');
      }
    }

}
