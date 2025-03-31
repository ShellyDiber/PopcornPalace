import { IsDateString, isIn, isInt, IsInt, IsString } from 'class-validator';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export class CreateShowtimeDto {
  @IsInt()
  movieId: number;
  @IsString()
  theater: string;
  @IsDateString()
  startTime: Date;
  @IsDateString()
  endTime: Date;
  @IsInt()
  price: number;
}

