import { Controller, Post, Body, Param, Get, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly service: ShowtimeService) {}

  @Post()
  create(@Body() dto: CreateShowtimeDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateShowtimeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
