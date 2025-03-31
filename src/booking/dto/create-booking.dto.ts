import { IsInt, IsUUID, Min } from "class-validator";

export class CreateBookingDto {
    @IsInt()
    @Min(1)
    seatNumber: number;
    @IsInt()
    @Min(1)
    showtimeId: number;
    @IsUUID()
    userId: string;
}