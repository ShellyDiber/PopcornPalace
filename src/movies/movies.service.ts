import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';


@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private movieRepo: Repository<Movie>,
      ) {}

      async create(dto: CreateMovieDto): Promise<Movie> {
        const movie = this.movieRepo.create(dto);
        try {
          return await this.movieRepo.save(movie);
        } catch (error) {
          // Check if it's a duplicate key violation
          if (error.code === '23505') {
            throw new BadRequestException('A movie with this title already exists.');
          }
          throw error;
        }
      }
    
      findAll(): Promise<Movie[]> {
        return this.movieRepo.find();
      }

      async findOneByTitle(title: string): Promise<Movie> {
        const movie = await this.movieRepo.findOneBy({ title  });
        if (!movie) throw new NotFoundException('Movie not found');
        return movie;
      }

        async updateByTitle(title: string, dto: UpdateMovieDto): Promise<Movie> {
            const movie = await this.findOneByTitle(title);
            this.movieRepo.merge(movie, dto);
            return this.movieRepo.save(movie);
        }

        async removeByTitle(title: string): Promise<void> {
          const movie = await this.movieRepo.findOne({ where: { title }, relations: ['showtimes'] });
            // If the movie doesn't exist
          if (!movie) throw new NotFoundException('Movie not found');
           // Check if the movie has showtimes
          const hasShowtimes = await this.movieRepo
          .createQueryBuilder('movie')
          .leftJoin('movie.showtimes', 'showtime')
          .where('movie.title = :title', { title })
          .andWhere('showtime.id IS NOT NULL')
          .getOne();

        if (hasShowtimes) {
          throw new BadRequestException('Cannot delete movie: it has existing showtimes.');
        }

        const result = await this.movieRepo.delete({ title });
        if (result.affected === 0) {
          throw new NotFoundException('Movie not found');
        }

        }
}
