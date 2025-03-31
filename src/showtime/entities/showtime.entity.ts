import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie)
  movie: Movie;
  
  @Column()
  movieId: number;
  
  @Column()
  theater: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column('decimal')
  price: number;

  @OneToMany(() => Booking, booking => booking.showtime)
  bookings: Booking[];


  
}
