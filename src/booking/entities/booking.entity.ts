import { Showtime } from "src/showtime/entities/showtime.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    seatNumber : number;

    @ManyToOne(() => Showtime)
    showtime: Showtime;

    @Column()
    showtimeId: number;

    @Column()
    userId: string;


}