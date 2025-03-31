import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';


@Controller('movies')
export class MoviesController {
    constructor(private readonly service: MoviesService) {}

    @Post()
    create(@Body() dto: CreateMovieDto) {
        return this.service.create(dto);
    }

    @Get('all')
    findAll() {
        return this.service.findAll();
      }

    @Get(':title')
    findOne(@Param('title') title: string) {
        return this.service.findOneByTitle(title);
    }

    @Post('update/:title')
    update(@Param('title') title: string, @Body() dto: UpdateMovieDto) {
    return this.service.updateByTitle(title, dto);
    }


    @Delete(':title')
    remove(@Param('title') title: string) {
        return this.service.removeByTitle(title);
    }













}
