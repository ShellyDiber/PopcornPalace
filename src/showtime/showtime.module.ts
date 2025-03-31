// import { Module } from '@nestjs/common';
// import { ShowtimeService } from './showtime.service';
// import { ShowtimeController } from './showtime.controller';

// @Module({
//   providers: [ShowtimeService],
//   controllers: [ShowtimeController]
// })
// export class ShowtimeModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie])],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
})
export class ShowtimeModule {}
