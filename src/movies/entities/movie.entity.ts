import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  genre: string;

  @Column()
  duration: number;

  @Column()
  rating: string;

  @Column({ name: 'release_year' })
  releaseYear: number;

  @OneToMany(() => Showtime, showtime => showtime.movie)
  showtimes: Showtime[];

}
