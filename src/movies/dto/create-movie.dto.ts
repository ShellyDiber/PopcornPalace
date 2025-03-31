import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateMovieDto {
  @IsString()
  @MinLength(1)
  title: string;
  @IsString()
  @MinLength(1)
  genre: string;
  @IsInt()
  @Min(1)
  duration: number;
  @IsString()
  @MinLength(1)
  rating: string;
  @IsInt()
  releaseYear: number;
}
  